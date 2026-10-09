import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as XLSX from 'xlsx';
import {
  isCellEmpty,
  cleanString,
  parsePublisherAndYear,
  validateWorkbookRows,
  generateCsvReport,
  importValidBooks,
} from '../src/services/bulkUploadService.js';

describe('Bulk Upload Full Flow - Schema Validation & Integrity', () => {
  test('Treats empty strings, whitespace-only, and placeholder dashes as missing', () => {
    assert.strictEqual(isCellEmpty(''), true);
    assert.strictEqual(isCellEmpty('   \t\n  '), true);
    assert.strictEqual(isCellEmpty('-'), true);
    assert.strictEqual(isCellEmpty(' - '), true);
    assert.strictEqual(isCellEmpty('N/A'), true);
    assert.strictEqual(isCellEmpty('n/a'), true);
    assert.strictEqual(isCellEmpty(undefined), true);
    assert.strictEqual(isCellEmpty(null), true);
  });

  test('Preserves identifiers (accession numbers, ISBNs) with leading zeros', () => {
    assert.strictEqual(cleanString('0012345'), '0012345');
    assert.strictEqual(cleanString('  009780143447061  '), '009780143447061');
    assert.strictEqual(cleanString('C00122'), 'C00122');
  });

  test('Rejects row missing any required field (e.g. Title, Author, ISBN, Accession, Department)', () => {
    const requiredChecks = [
      { key: 'TITLE', row: { TITLE: '', AUTHOR: 'Author', ISBN: '123', 'ACCESSION NUMBER': 'ACC1', DEPARTMENT: 'CS' } },
      { key: 'AUTHOR', row: { TITLE: 'Title', AUTHOR: '   ', ISBN: '123', 'ACCESSION NUMBER': 'ACC1', DEPARTMENT: 'CS' } },
      { key: 'ISBN', row: { TITLE: 'Title', AUTHOR: 'Author', ISBN: '-', 'ACCESSION NUMBER': 'ACC1', DEPARTMENT: 'CS' } },
      { key: 'ACCESSION NUMBER', row: { TITLE: 'Title', AUTHOR: 'Author', ISBN: '123', 'ACCESSION NUMBER': '', DEPARTMENT: 'CS' } },
      { key: 'DEPARTMENT', row: { TITLE: 'Title', AUTHOR: 'Author', ISBN: '123', 'ACCESSION NUMBER': 'ACC1', DEPARTMENT: ' - ' } },
    ];

    requiredChecks.forEach(({ key, row }) => {
      const result = validateWorkbookRows([row]);
      assert.strictEqual(result.stats.valid, 0, `Row should be invalid when ${key} is missing`);
      assert.strictEqual(result.stats.excludedMissing, 1);
      assert.strictEqual(result.rows[0].status, 'excluded');
      assert.ok(result.rows[0].missingFields.includes(key), `Expected missingFields to contain ${key}`);
    });
  });

  test('Valid row with all required catalogue fields passes validation', () => {
    const validRow = {
      TITLE: 'Design Patterns',
      AUTHOR: 'Gang of Four',
      ISBN: '9780201633610',
      'ACCESSION NUMBER': 'ACC9901',
      DEPARTMENT: 'Computer Science',
      'CALL NUMBER': '005.133',
      Count: 4,
      'ITEM TYPE': 'BK',
      PRICE: 1200,
      PAGES: 416,
      'PUBLISHER AND YEAR OF PUBLICATION': 'Addison-Wesley 1994',
      'COVER IMAGE URL': 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg',
    };

    const result = validateWorkbookRows([validRow]);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.excludedMissing, 0);
    assert.strictEqual(result.rows[0].title, 'Design Patterns');
    assert.strictEqual(result.rows[0].totalCopies, 4);
    assert.strictEqual(result.rows[0].publisher, 'Addison-Wesley');
    assert.strictEqual(result.rows[0].publicationYear, '1994');
  });
});

describe('Bulk Upload Full Flow - Duplicate Detection Rules', () => {
  test('Identifies duplicate ISBN in spreadsheet and records conflicting row number', () => {
    const rows = [
      { TITLE: 'Book 1', AUTHOR: 'A', ISBN: '9783161484100', 'ACCESSION NUMBER': 'ACC1', DEPARTMENT: 'General' },
      { TITLE: 'Book 2', AUTHOR: 'B', ISBN: '9783161484100', 'ACCESSION NUMBER': 'ACC2', DEPARTMENT: 'General' },
    ];

    const result = validateWorkbookRows(rows);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.duplicateSheet, 1);
    assert.strictEqual(result.rows[0].status, 'valid');
    assert.strictEqual(result.rows[1].status, 'duplicate_sheet');
    assert.ok(result.rows[1].reason.includes('Excel Row 2'));
  });

  test('Identifies duplicate Accession Number in spreadsheet', () => {
    const rows = [
      { TITLE: 'Book 1', AUTHOR: 'A', ISBN: '9781111111111', 'ACCESSION NUMBER': 'ACC_SAME', DEPARTMENT: 'General' },
      { TITLE: 'Book 2', AUTHOR: 'B', ISBN: '9782222222222', 'ACCESSION NUMBER': 'ACC_SAME', DEPARTMENT: 'General' },
    ];

    const result = validateWorkbookRows(rows);
    assert.strictEqual(result.stats.valid, 1);
    assert.strictEqual(result.stats.duplicateSheet, 1);
    assert.strictEqual(result.rows[1].status, 'duplicate_sheet');
    assert.ok(result.rows[1].reason.includes('Duplicate Accession Number'));
  });

  test('Identifies duplicates against existing Firestore catalog database', () => {
    const existingCatalog = {
      isbns: new Map([['9780131103627', 'existing-doc-c-programming']]),
      accessions: new Map([['cs-acc-001', 'existing-doc-c-programming']]),
    };

    const rows = [
      { TITLE: 'The C Programming Language', AUTHOR: 'Kernighan & Ritchie', ISBN: '9780131103627', 'ACCESSION NUMBER': 'new-acc', DEPARTMENT: 'CS' },
      { TITLE: 'Another Book', AUTHOR: 'Author X', ISBN: '9789999999999', 'ACCESSION NUMBER': 'cs-acc-001', DEPARTMENT: 'CS' },
    ];

    const result = validateWorkbookRows(rows, {}, existingCatalog);
    assert.strictEqual(result.stats.valid, 0);
    assert.strictEqual(result.stats.duplicateDb, 2);
    assert.strictEqual(result.rows[0].status, 'duplicate_db');
    assert.ok(result.rows[0].reason.includes('existing-doc-c-programming'));
    assert.strictEqual(result.rows[1].status, 'duplicate_db');
    assert.ok(result.rows[1].reason.includes('existing-doc-c-programming'));
  });
});

describe('Bulk Upload Full Flow - Cover Image URL Validation', () => {
  test('Validates HTTP and HTTPS cover URLs and flags invalid protocols', () => {
    const rows = [
      {
        TITLE: 'Book A', AUTHOR: 'Author A', ISBN: '9780000000001', 'ACCESSION NUMBER': 'ACC001', DEPARTMENT: 'General',
        'COVER IMAGE URL': 'https://covers.openlibrary.org/b/id/123-L.jpg',
      },
      {
        TITLE: 'Book B', AUTHOR: 'Author B', ISBN: '9780000000002', 'ACCESSION NUMBER': 'ACC002', DEPARTMENT: 'General',
        'COVER IMAGE URL': 'ftp://example.com/bad-protocol.jpg',
      },
    ];

    const result = validateWorkbookRows(rows, { requireCoverImage: false });
    assert.strictEqual(result.rows[0].coverStatus, 'valid');
    assert.strictEqual(result.rows[0].hasValidCoverUrlFormat, true);
    assert.strictEqual(result.rows[1].coverStatus, 'invalid');
    assert.strictEqual(result.rows[1].hasValidCoverUrlFormat, false);
  });

  test('Strict cover mode excludes rows missing cover image URL', () => {
    const rowWithoutCover = {
      TITLE: 'Book No Cover', AUTHOR: 'Author', ISBN: '9780000000003', 'ACCESSION NUMBER': 'ACC003', DEPARTMENT: 'General',
      'COVER IMAGE URL': '',
    };

    const resStrict = validateWorkbookRows([rowWithoutCover], { requireCoverImage: true });
    assert.strictEqual(resStrict.stats.valid, 0);
    assert.strictEqual(resStrict.stats.excludedMissing, 1);
    assert.ok(resStrict.rows[0].missingFields.includes('COVER IMAGE URL'));
  });
});

describe('Bulk Upload Full Flow - Real 500-Record Workbook Import Simulation', () => {
  test('Verifies all 500 records from Library_Books_HIGH_QUALITY_COVERS-1.xlsx with zero silent data corruption', () => {
    const fileBuf = fs.readFileSync('public/Library_Books_HIGH_QUALITY_COVERS-1.xlsx');
    const wb = XLSX.read(fileBuf, { type: 'buffer' });
    const sheet = wb.Sheets['Popular Books'];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

    assert.strictEqual(rows.length, 500);

    const result = validateWorkbookRows(rows, { requireCoverImage: false });

    // Validate totals
    assert.strictEqual(result.stats.total, 500);
    assert.strictEqual(result.stats.valid, 430);
    assert.strictEqual(result.stats.excludedMissing, 35);
    assert.strictEqual(result.stats.duplicateSheet, 35);

    // Sum matches exactly 500
    assert.strictEqual(
      result.stats.valid + result.stats.excludedMissing + result.stats.duplicateSheet,
      500
    );

    // Every excluded row has specific missing fields
    const excludedRows = result.rows.filter((r) => r.status === 'excluded');
    assert.strictEqual(excludedRows.length, 35);
    excludedRows.forEach((r) => {
      assert.ok(r.missingFields.length > 0);
      assert.ok(r.reason.startsWith('Missing required field(s):'));
    });

    // Every duplicate row specifies the source conflicting row
    const duplicateRows = result.rows.filter((r) => r.status === 'duplicate_sheet');
    assert.strictEqual(duplicateRows.length, 35);
    duplicateRows.forEach((r) => {
      assert.ok(r.reason.includes('already appears in Excel Row'));
    });
  });

  test('Generates comprehensive CSV error & audit report', async () => {
    const fileBuf = fs.readFileSync('public/Library_Books_HIGH_QUALITY_COVERS-1.xlsx');
    const wb = XLSX.read(fileBuf, { type: 'buffer' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets['Popular Books'], { defval: '', raw: false });
    const validated = validateWorkbookRows(rows);

    const blob = generateCsvReport(validated.rows);
    const csvContent = await blob.text();
    const lines = csvContent.split('\r\n').filter(Boolean);

    // Header line + 500 data lines = 501 lines
    assert.strictEqual(lines.length, 501);
    assert.ok(lines[0].includes('Excel Row,Status,Title,Author,ISBN,Accession Number'));
  });
});
