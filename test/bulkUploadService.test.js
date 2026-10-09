import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  isCellEmpty,
  cleanString,
  parsePublisherAndYear,
  validateWorkbookRows,
  generateCsvReport,
  CORE_REQUIRED_FIELDS,
} from '../src/services/bulkUploadService.js';
import * as XLSX from 'xlsx';

describe('Bulk Upload Service - Data Cleaning & Helpers', () => {
  test('isCellEmpty correctly handles null, undefined, whitespace, hyphens, and placeholders', () => {
    assert.strictEqual(isCellEmpty(null), true);
    assert.strictEqual(isCellEmpty(undefined), true);
    assert.strictEqual(isCellEmpty(''), true);
    assert.strictEqual(isCellEmpty('   '), true);
    assert.strictEqual(isCellEmpty('-'), true);
    assert.strictEqual(isCellEmpty('  -  '), true);
    assert.strictEqual(isCellEmpty('N/A'), true);
    assert.strictEqual(isCellEmpty('null'), true);

    assert.strictEqual(isCellEmpty('Valid Title'), false);
    assert.strictEqual(isCellEmpty('00123'), false);
    assert.strictEqual(isCellEmpty(0), false);
  });

  test('cleanString preserves strings with leading zeros and trims whitespace', () => {
    assert.strictEqual(cleanString('  00123  '), '00123');
    assert.strictEqual(cleanString('C12220'), 'C12220');
    assert.strictEqual(cleanString(' 9780143447061 '), '9780143447061');
    assert.strictEqual(cleanString(null), '');
  });

  test('parsePublisherAndYear extracts publisher and 4-digit publication year', () => {
    const res1 = parsePublisherAndYear('PRIYANK PACHPANDE 2021');
    assert.strictEqual(res1.publisher, 'PRIYANK PACHPANDE');
    assert.strictEqual(res1.publicationYear, '2021');

    const res2 = parsePublisherAndYear('O\'REILLY MEDIA, 2020');
    assert.strictEqual(res2.publisher, 'O\'REILLY MEDIA');
    assert.strictEqual(res2.publicationYear, '2020');

    const res3 = parsePublisherAndYear('Oxford Press');
    assert.strictEqual(res3.publisher, 'Oxford Press');
    assert.strictEqual(res3.publicationYear, '');
  });
});

describe('Bulk Upload Service - Strict Missing-Data Validation', () => {
  test('Valid row passes all checks', () => {
    const sampleRows = [
      {
        TITLE: 'Clean Architecture',
        AUTHOR: 'Robert C. Martin',
        ISBN: '9780134494166',
        'ACCESSION NUMBER': 'CS001',
        DEPARTMENT: 'Computer Science',
        'COVER IMAGE URL': 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg',
      },
    ];

    const result = validateWorkbookRows(sampleRows, { requireCoverImage: false });
    assert.strictEqual(result.stats.total, 1);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.excludedMissing, 0);
    assert.strictEqual(result.rows[0].status, 'valid');
  });

  test('Missing even one required field excludes the entire row', () => {
    const missingTitle = [
      {
        TITLE: '   ',
        AUTHOR: 'Robert C. Martin',
        ISBN: '9780134494166',
        'ACCESSION NUMBER': 'CS001',
        DEPARTMENT: 'Computer Science',
      },
    ];
    const res1 = validateWorkbookRows(missingTitle);
    assert.strictEqual(res1.stats.valid, 0);
    assert.strictEqual(res1.stats.excludedMissing, 1);
    assert.strictEqual(res1.rows[0].status, 'excluded');
    assert.ok(res1.rows[0].missingFields.includes('TITLE'));

    const missingIsbn = [
      {
        TITLE: 'Refactoring',
        AUTHOR: 'Martin Fowler',
        ISBN: '-',
        'ACCESSION NUMBER': 'CS002',
        DEPARTMENT: 'Computer Science',
      },
    ];
    const res2 = validateWorkbookRows(missingIsbn);
    assert.strictEqual(res2.stats.valid, 0);
    assert.strictEqual(res2.stats.excludedMissing, 1);
    assert.ok(res2.rows[0].missingFields.includes('ISBN'));
  });

  test('Multiple missing fields are all accurately captured in exclusion report', () => {
    const multiMissing = [
      {
        TITLE: '',
        AUTHOR: '',
        ISBN: '9780134494166',
        'ACCESSION NUMBER': '',
        DEPARTMENT: 'Computer Science',
      },
    ];
    const result = validateWorkbookRows(multiMissing);
    assert.strictEqual(result.rows[0].status, 'excluded');
    assert.deepStrictEqual(result.rows[0].missingFields, ['TITLE', 'AUTHOR', 'ACCESSION NUMBER']);
    assert.ok(result.rows[0].reason.includes('Book Title'));
    assert.ok(result.rows[0].reason.includes('Author'));
    assert.ok(result.rows[0].reason.includes('Accession Number'));
  });

  test('Strict cover requirement excludes row when cover image is missing or invalid', () => {
    const withoutCover = [
      {
        TITLE: 'The Pragmatic Programmer',
        AUTHOR: 'Andrew Hunt',
        ISBN: '9780201616224',
        'ACCESSION NUMBER': 'CS003',
        DEPARTMENT: 'Computer Science',
        'COVER IMAGE URL': '',
      },
    ];

    // When requireCoverImage is true, missing cover excludes the row
    const resStrict = validateWorkbookRows(withoutCover, { requireCoverImage: true });
    assert.strictEqual(resStrict.stats.valid, 0);
    assert.strictEqual(resStrict.stats.excludedMissing, 1);
    assert.ok(resStrict.rows[0].missingFields.includes('COVER IMAGE URL'));

    // When requireCoverImage is false, valid book is accepted
    const resFlexible = validateWorkbookRows(withoutCover, { requireCoverImage: false });
    assert.strictEqual(resFlexible.stats.valid, 1);
    assert.strictEqual(resFlexible.stats.excludedMissing, 0);
  });
});

describe('Bulk Upload Service - Duplicate Detection', () => {
  test('Detects duplicate ISBN within spreadsheet and skips second occurrence', () => {
    const rows = [
      {
        TITLE: 'Book One',
        AUTHOR: 'Author A',
        ISBN: '9781111111111',
        'ACCESSION NUMBER': 'ACC01',
        DEPARTMENT: 'General',
      },
      {
        TITLE: 'Book Two Duplicate ISBN',
        AUTHOR: 'Author B',
        ISBN: '9781111111111',
        'ACCESSION NUMBER': 'ACC02',
        DEPARTMENT: 'General',
      },
    ];

    const result = validateWorkbookRows(rows);
    assert.strictEqual(result.stats.total, 2);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.duplicateSheet, 1);
    assert.strictEqual(result.rows[0].status, 'valid');
    assert.strictEqual(result.rows[1].status, 'duplicate_sheet');
    assert.ok(result.rows[1].reason.includes('already appears in Excel Row 2'));
  });

  test('Detects duplicate Accession Number within spreadsheet', () => {
    const rows = [
      {
        TITLE: 'Book Alpha',
        AUTHOR: 'Author A',
        ISBN: '9781111111111',
        'ACCESSION NUMBER': 'SAME_ACC',
        DEPARTMENT: 'General',
      },
      {
        TITLE: 'Book Beta',
        AUTHOR: 'Author B',
        ISBN: '9782222222222',
        'ACCESSION NUMBER': 'SAME_ACC',
        DEPARTMENT: 'General',
      },
    ];

    const result = validateWorkbookRows(rows);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.duplicateSheet, 1);
    assert.strictEqual(result.rows[1].status, 'duplicate_sheet');
  });

  test('Detects duplicates against existing database records', () => {
    const existingDb = {
      isbns: new Map([['9789999999999', 'existing-firestore-doc-1']]),
      accessions: new Map([['db_acc_99', 'existing-firestore-doc-2']]),
    };

    const rows = [
      {
        TITLE: 'Book Clash DB',
        AUTHOR: 'Author C',
        ISBN: '9789999999999',
        'ACCESSION NUMBER': 'UNIQUE_ACC',
        DEPARTMENT: 'General',
      },
    ];

    const result = validateWorkbookRows(rows, {}, existingDb);
    assert.strictEqual(result.stats.valid, 0);
    assert.strictEqual(result.stats.duplicateDb, 1);
    assert.strictEqual(result.rows[0].status, 'duplicate_db');
    assert.ok(result.rows[0].reason.includes('existing-firestore-doc-1'));
  });
});

import * as fs from 'node:fs';

describe('Bulk Upload Service - Real 500-Book Spreadsheet Verification', () => {
  test('Correctly parses and validates the actual Library_Books_HIGH_QUALITY_COVERS-1.xlsx file', () => {
    const fileBuf = fs.readFileSync('public/Library_Books_HIGH_QUALITY_COVERS-1.xlsx');
    const wb = XLSX.read(fileBuf, { type: 'buffer' });
    assert.ok(wb.SheetNames.includes('Popular Books'));

    const sheet = wb.Sheets['Popular Books'];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
    assert.strictEqual(rows.length, 500);

    const result = validateWorkbookRows(rows, { requireCoverImage: false });
    assert.strictEqual(result.stats.total, 500);
    // 35 rows missing required data, 35 duplicate ISBNs in sheet, 430 valid books
    assert.strictEqual(result.stats.valid + result.stats.excludedMissing + result.stats.duplicateSheet, 500);
    assert.strictEqual(result.stats.excludedMissing, 35);
    assert.strictEqual(result.stats.duplicateSheet, 35);
    assert.strictEqual(result.stats.valid, 430);
  });

  test('CSV report generation produces proper headers and formatted rows', async () => {
    const testRows = [
      {
        excelRow: 2,
        status: 'valid',
        title: 'Title A',
        author: 'Author A',
        isbn: '1234567890',
        accessionNumber: 'ACC1',
        department: 'Science',
        totalCopies: 2,
        coverUrl: 'https://example.com/cover.jpg',
        reason: '',
      },
      {
        excelRow: 3,
        status: 'excluded',
        title: 'Title B',
        author: 'Author B',
        isbn: '',
        accessionNumber: 'ACC2',
        department: 'Science',
        totalCopies: 1,
        coverUrl: '',
        reason: 'Missing required field(s): ISBN',
      },
    ];

    const blob = generateCsvReport(testRows);
    const text = await blob.text();
    assert.ok(text.includes('Excel Row,Status,Title,Author,ISBN'));
    assert.ok(text.includes('"VALID"'));
    assert.ok(text.includes('"EXCLUDED"'));
    assert.ok(text.includes('Missing required field(s): ISBN'));
  });
});
