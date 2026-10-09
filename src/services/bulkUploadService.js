import * as XLSX from 'xlsx';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';
import { uploadCoverFromUrl } from './cloudinary.js';

export const CORE_REQUIRED_FIELDS = [
  'TITLE',
  'AUTHOR',
  'ISBN',
  'ACCESSION NUMBER',
  'DEPARTMENT',
];

export const FIELD_LABELS = {
  TITLE: 'Book Title',
  AUTHOR: 'Author',
  ISBN: 'ISBN',
  'ACCESSION NUMBER': 'Accession Number',
  DEPARTMENT: 'Department',
  'COVER IMAGE URL': 'Cover Image URL',
  'CALL NUMBER': 'Call Number',
  'ITEM TYPE': 'Item Type / Category',
};

/**
 * Check if a cell value is strictly empty (null, undefined, whitespace, or placeholder hyphen).
 * @param {*} val 
 * @returns {boolean}
 */
export function isCellEmpty(val) {
  if (val === null || val === undefined) return true;
  const str = String(val).trim();
  if (str === '' || str === '-' || str.toLowerCase() === 'n/a' || str.toLowerCase() === 'null') {
    return true;
  }
  return false;
}

/**
 * Extract clean string value, preserving leading zeros and trim whitespace.
 * @param {*} val 
 * @returns {string}
 */
export function cleanString(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

/**
 * Parse publisher and publication year if present in combined column.
 * e.g., "PRIYANK PACHPANDE 2021" -> { publisher: "PRIYANK PACHPANDE", publicationYear: "2021" }
 * @param {string} raw 
 * @returns {{ publisher: string, publicationYear: string, raw: string }}
 */
export function parsePublisherAndYear(raw = '') {
  const cleaned = cleanString(raw);
  if (!cleaned || cleaned === '-') {
    return { publisher: '', publicationYear: '', raw: '' };
  }

  // Check if ending with 4 digits year (e.g. 1990 - 2029)
  const match = cleaned.match(/^(.*?)[\s,]+(1[89]\d{2}|20\d{2})$/);
  if (match) {
    return {
      publisher: match[1].trim(),
      publicationYear: match[2].trim(),
      raw: cleaned,
    };
  }

  return {
    publisher: cleaned,
    publicationYear: '',
    raw: cleaned,
  };
}

/**
 * Fetch existing book identifiers (ISBNs, Accession Numbers) from Firestore
 * to detect duplicates against the database.
 * @returns {Promise<{ isbns: Map<string, string>, accessions: Map<string, string> }>}
 */
export async function fetchExistingCatalogIdentifiers() {
  const isbns = new Map();
  const accessions = new Map();

  try {
    const booksRef = collection(db, 'books');
    const snapshot = await getDocs(booksRef);

    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      if (data.isbn && !isCellEmpty(data.isbn)) {
        isbns.set(cleanString(data.isbn).toLowerCase(), id);
      }
      if (data.accessionNumber && !isCellEmpty(data.accessionNumber)) {
        accessions.set(cleanString(data.accessionNumber).toLowerCase(), id);
      }
    });
  } catch (err) {
    console.warn('Could not fetch existing catalog identifiers for duplicate check:', err);
  }

  return { isbns, accessions };
}

/**
 * Parse an uploaded Excel/CSV file and extract sheets.
 * @param {File} file 
 * @returns {Promise<{ sheetNames: string[], sheets: Record<string, any[]> }>}
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, {
          type: 'array',
          cellDates: true,
          raw: false, // Ensures leading zeros and formatted strings are preserved
        });

        const sheetNames = workbook.SheetNames || [];
        if (sheetNames.length === 0) {
          throw new Error('The uploaded workbook contains no sheets.');
        }

        const sheets = {};
        sheetNames.forEach((name) => {
          const ws = workbook.Sheets[name];
          // Convert sheet with raw: false to retain cell string formatting
          const rows = XLSX.utils.sheet_to_json(ws, {
            defval: '',
            raw: false,
          });
          sheets[name] = rows;
        });

        resolve({ sheetNames, sheets });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the selected spreadsheet file.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validate all rows from a spreadsheet against the catalog schema,
 * duplicate constraints, and cover image requirements.
 * 
 * @param {any[]} rawRows 
 * @param {object} options 
 * @param {boolean} options.requireCoverImage 
 * @param {{ isbns: Map<string, string>, accessions: Map<string, string> }} existingCatalog 
 * @returns {{
 *   rows: any[],
 *   stats: {
 *     total: number,
 *     valid: number,
 *     excludedMissing: number,
 *     duplicateSheet: number,
 *     duplicateDb: number,
 *     totalDuplicates: number,
 *     coversValid: number,
 *     coversMissing: number,
 *     coversFailed: number
 *   }
 * }}
 */
export function validateWorkbookRows(rawRows = [], options = {}, existingCatalog = { isbns: new Map(), accessions: new Map() }) {
  const requireCover = Boolean(options.requireCoverImage);
  const requiredFields = [...CORE_REQUIRED_FIELDS];
  if (requireCover) {
    requiredFields.push('COVER IMAGE URL');
  }

  const validatedRows = [];
  const seenIsbnsInSheet = new Map();
  const seenAccessionsInSheet = new Map();

  let validCount = 0;
  let excludedMissingCount = 0;
  let duplicateSheetCount = 0;
  let duplicateDbCount = 0;
  let coversValidCount = 0;
  let coversMissingCount = 0;
  let coversFailedCount = 0;

  rawRows.forEach((row, index) => {
    // Excel row number is index + 2 (1-indexed + header row)
    const excelRow = index + 2;

    const title = cleanString(row.TITLE || row.Title || row['BOOK TITLE'] || '');
    const author = cleanString(row.AUTHOR || row.Author || '');
    const isbn = cleanString(row.ISBN || row.Isbn || '');
    const accessionNumber = cleanString(row['ACCESSION NUMBER'] || row.AccessionNumber || '');
    const department = cleanString(row.DEPARTMENT || row.Department || '');
    const coverUrl = cleanString(row['COVER IMAGE URL'] || row['Cover Image Url'] || row.coverImage || '');
    const callNumber = cleanString(row['CALL NUMBER'] || row.CallNumber || '');
    const itemNumber = cleanString(row['ITEM NUMBER'] || '');
    const biblioNumber = cleanString(row['BIBLIONUMBER'] || '');
    const edition = cleanString(row.EDITION || '');
    const volume = cleanString(row.VOLUME || '');
    const copyNumber = cleanString(row['COPY NUMBER'] || '');
    const itemType = cleanString(row['ITEM TYPE'] || 'BK');
    const price = cleanString(row.PRICE || '');
    const pages = cleanString(row.PAGES || '');
    const countVal = Number(row.Count || row.count || 1);
    const totalCopies = isNaN(countVal) || countVal < 1 ? 1 : countVal;

    const pubInfo = parsePublisherAndYear(row['PUBLISHER AND YEAR OF PUBLICATION']);

    // Check missing required fields
    const missingFields = [];
    if (isCellEmpty(title)) missingFields.push('TITLE');
    if (isCellEmpty(author)) missingFields.push('AUTHOR');
    if (isCellEmpty(isbn)) missingFields.push('ISBN');
    if (isCellEmpty(accessionNumber)) missingFields.push('ACCESSION NUMBER');
    if (isCellEmpty(department)) missingFields.push('DEPARTMENT');
    if (requireCover && isCellEmpty(coverUrl)) missingFields.push('COVER IMAGE URL');

    // Cover URL validation
    let hasValidCoverUrlFormat = false;
    let coverStatus = 'none'; // 'valid' | 'invalid' | 'none'
    if (!isCellEmpty(coverUrl)) {
      if (/^https?:\/\//i.test(coverUrl)) {
        hasValidCoverUrlFormat = true;
        coverStatus = 'valid';
        coversValidCount++;
      } else {
        coverStatus = 'invalid';
        coversFailedCount++;
      }
    } else {
      coversMissingCount++;
    }

    // Determine row validation status
    let status = 'valid'; // 'valid' | 'excluded' | 'duplicate_sheet' | 'duplicate_db' | 'image_failed'
    let reason = '';

    if (missingFields.length > 0) {
      status = 'excluded';
      excludedMissingCount++;
      const readableFields = missingFields.map((f) => FIELD_LABELS[f] || f);
      reason = `Missing required field(s): ${readableFields.join(', ')}`;
    } else if (requireCover && coverStatus === 'invalid') {
      status = 'image_failed';
      excludedMissingCount++;
      reason = 'Cover image URL does not use valid HTTP or HTTPS protocol.';
    } else {
      // Check duplicate within sheet
      const isbnKey = isbn.toLowerCase();
      const accKey = accessionNumber.toLowerCase();

      if (isbnKey && seenIsbnsInSheet.has(isbnKey)) {
        status = 'duplicate_sheet';
        duplicateSheetCount++;
        reason = `Duplicate ISBN "${isbn}" already appears in Excel Row ${seenIsbnsInSheet.get(isbnKey)}.`;
      } else if (accKey && seenAccessionsInSheet.has(accKey)) {
        status = 'duplicate_sheet';
        duplicateSheetCount++;
        reason = `Duplicate Accession Number "${accessionNumber}" already appears in Excel Row ${seenAccessionsInSheet.get(accKey)}.`;
      } else if (isbnKey && existingCatalog.isbns.has(isbnKey)) {
        // Check duplicate against existing Firestore database
        status = 'duplicate_db';
        duplicateDbCount++;
        const existingId = existingCatalog.isbns.get(isbnKey);
        reason = `ISBN "${isbn}" already exists in library catalog (Book ID: ${existingId}).`;
      } else if (accKey && existingCatalog.accessions.has(accKey)) {
        status = 'duplicate_db';
        duplicateDbCount++;
        const existingId = existingCatalog.accessions.get(accKey);
        reason = `Accession Number "${accessionNumber}" already exists in library catalog (Book ID: ${existingId}).`;
      } else {
        // Truly Valid!
        validCount++;
        if (isbnKey) seenIsbnsInSheet.set(isbnKey, excelRow);
        if (accKey) seenAccessionsInSheet.set(accKey, excelRow);
      }
    }

    const proxyCoverUrl = coverUrl && /^https?:\/\//i.test(coverUrl)
      ? `/api/cover-proxy?url=${encodeURIComponent(coverUrl)}`
      : '';

    validatedRows.push({
      excelRow,
      title: title || 'Untitled',
      author: author || 'Unknown Author',
      isbn: isbn || 'N/A',
      accessionNumber: accessionNumber || 'N/A',
      department: department || 'General Library',
      category: itemType === 'CB' ? 'Children’s Books' : 'Academic',
      callNumber,
      itemNumber,
      biblioNumber,
      edition,
      volume,
      copyNumber,
      itemType,
      price: price || 'N/A',
      pages: pages || 'N/A',
      publisher: pubInfo.publisher,
      publicationYear: pubInfo.publicationYear,
      publisherAndYear: pubInfo.raw,
      coverUrl,
      proxyCoverUrl,
      hasValidCoverUrlFormat,
      coverStatus,
      totalCopies,
      availableCopies: totalCopies,
      missingFields,
      status,
      reason,
      rawRecord: row,
    });
  });

  return {
    rows: validatedRows,
    stats: {
      total: rawRows.length,
      valid: validCount,
      excludedMissing: excludedMissingCount,
      duplicateSheet: duplicateSheetCount,
      duplicateDb: duplicateDbCount,
      totalDuplicates: duplicateSheetCount + duplicateDbCount,
      coversValid: coversValidCount,
      coversMissing: coversMissingCount,
      coversFailed: coversFailedCount,
    },
  };
}

/**
 * Generate a downloadable CSV report of all parsed rows including skipped,
 * duplicates, and successfully imported records.
 * 
 * @param {any[]} rows 
 * @returns {Blob}
 */
export function generateCsvReport(rows = []) {
  const headers = [
    'Excel Row',
    'Status',
    'Title',
    'Author',
    'ISBN',
    'Accession Number',
    'Department',
    'Total Copies',
    'Cover URL',
    'Exclusion / Failure Reason',
  ];

  const csvRows = [headers.join(',')];

  rows.forEach((r) => {
    const escape = (val) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    csvRows.push([
      escape(r.excelRow),
      escape(r.status.toUpperCase()),
      escape(r.title),
      escape(r.author),
      escape(r.isbn),
      escape(r.accessionNumber),
      escape(r.department),
      escape(r.totalCopies),
      escape(r.coverUrl || 'None'),
      escape(r.reason || 'None (Valid)'),
    ].join(','));
  });

  return new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Batch import valid books into Firestore with controlled chunking,
 * cover image uploading to Cloudinary, and progress tracking.
 * 
 * @param {any[]} validRows 
 * @param {string} userEmail 
 * @param {function} onProgress Callback({ current, total, percent, bookTitle, currentBatch })
 * @param {object} options
 * @returns {Promise<{
 *   successCount: number,
 *   failCount: number,
 *   coverSuccessCount: number,
 *   coverFailCount: number,
 *   errors: any[]
 * }>}
 */
export async function importValidBooks(validRows = [], userEmail = 'Librarian', onProgress = () => {}, options = {}) {
  const total = validRows.length;
  if (total === 0) {
    return {
      successCount: 0,
      failCount: 0,
      coverSuccessCount: 0,
      coverFailCount: 0,
      errors: [],
    };
  }

  const BATCH_SIZE = 15;
  let successCount = 0;
  let failCount = 0;
  let coverSuccessCount = 0;
  let coverFailCount = 0;
  const errors = [];

  const booksCollection = collection(db, 'books');
  const logsCollection = collection(db, 'activity_logs');

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const chunk = validRows.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    // Process chunk items
    for (let j = 0; j < chunk.length; j++) {
      const book = chunk[j];
      const currentIndex = i + j + 1;

      onProgress({
        current: currentIndex,
        total,
        percent: Math.round((currentIndex / total) * 100),
        bookTitle: book.title,
        currentBatch: batchIndex,
        totalBatches,
      });

      let finalCoverImage = '';

      // 1. Process cover image upload if URL is present
      if (book.coverUrl && /^https?:\/\//i.test(book.coverUrl)) {
        try {
          finalCoverImage = await uploadCoverFromUrl(book.coverUrl);
          coverSuccessCount++;
        } catch (imgErr) {
          coverFailCount++;
          console.warn(`Cover upload failed for row ${book.excelRow} (${book.title}):`, imgErr.message);

          if (options.requireCoverImage) {
            failCount++;
            errors.push({
              excelRow: book.excelRow,
              title: book.title,
              error: `Cover upload failed: ${imgErr.message}`,
            });
            continue; // Skip creating book if cover is strictly required
          }
        }
      }

      // 2. Prepare Firestore document payload
      const payload = {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        accessionNumber: book.accessionNumber,
        department: book.department,
        category: book.category || 'Academic',
        callNumber: book.callNumber || '',
        itemNumber: book.itemNumber || '',
        biblioNumber: book.biblioNumber || '',
        edition: book.edition || '',
        volume: book.volume || '',
        copyNumber: book.copyNumber || '',
        price: book.price || '',
        pages: book.pages || '',
        publisher: book.publisher || '',
        publicationYear: book.publicationYear || '',
        publisherAndYear: book.publisherAndYear || '',
        coverImage: finalCoverImage || '',
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        status: 'Available',
        borrowCount: 0,
        isArchived: false,
        createdBy: userEmail || 'Librarian',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Write document to Firestore
      try {
        const docRef = await addDoc(booksCollection, payload);
        successCount++;

        // 4. Log activity
        try {
          await addDoc(logsCollection, {
            type: 'book_bulk_imported',
            title: `Bulk Imported: "${book.title}"`,
            action: `Imported "${book.title}" (ISBN: ${book.isbn}, Accession: ${book.accessionNumber})`,
            bookId: docRef.id,
            userEmail: userEmail || 'Librarian',
            timestamp: serverTimestamp(),
          });
        } catch {
          // Non-critical logging error ignored
        }
      } catch (dbErr) {
        failCount++;
        errors.push({
          excelRow: book.excelRow,
          title: book.title,
          error: dbErr.message || 'Database write error',
        });
      }
    }

    // Brief pause between batches to maintain UI responsiveness and respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 60));
  }

  return {
    successCount,
    failCount,
    coverSuccessCount,
    coverFailCount,
    errors,
  };
}
