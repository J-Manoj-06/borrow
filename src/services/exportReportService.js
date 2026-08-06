import * as XLSX from 'xlsx';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Format date value to YYYY-MM-DD HH:mm string.
 */
function formatDate(val) {
  if (!val) return 'N/A';
  let dateObj = val;
  if (val.toDate) {
    dateObj = val.toDate();
  } else if (!(val instanceof Date)) {
    dateObj = new Date(val);
  }
  if (isNaN(dateObj.getTime())) return 'N/A';

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const min = String(dateObj.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

/**
 * Generate and download Borrow Excel Report (.xlsx) from live Firestore data.
 */
export async function generateAndDownloadExcelReport() {
  try {
    // 1. Fetch live data from Firestore collections in parallel
    const [booksSnap, transSnap, reqsSnap, usersSnap] = await Promise.all([
      getDocs(collection(db, 'books')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'transactions')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'borrow_requests')).catch(() => ({ docs: [] })),
      getDocs(collection(db, 'users')).catch(() => ({ docs: [] })),
    ]);

    const books = booksSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const transactions = transSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const requests = reqsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const now = new Date();
    const formattedExportDate = formatDate(now);

    // 2. Prepare Sheet 1: Summary
    const totalBooksCount = books.reduce((acc, b) => acc + Number(b.totalCopies || 1), 0);
    const availableBooksCount = books.reduce((acc, b) => acc + Number(b.availableCopies !== undefined ? b.availableCopies : 1), 0);
    const issuedBooksCount = transactions.filter((t) => {
      const st = (t.status || '').toLowerCase();
      return st === 'issued' || st === 'extended';
    }).length;
    const isPending = (status) => {
      if (!status) return true;
      const s = String(status).trim().toLowerCase();
      return s === 'pending' || s === 'requested' || s === 'request';
    };

    const pendingRequestsCount = requests.filter((r) => isPending(r.status)).length;

    const summaryData = [
      { Metric: 'Total Books', Value: totalBooksCount || books.length },
      { Metric: 'Available Books', Value: availableBooksCount },
      { Metric: 'Issued Books', Value: issuedBooksCount },
      { Metric: 'Pending Requests', Value: pendingRequestsCount },
      { Metric: 'Total Users', Value: users.length },
      { Metric: 'Export Date & Time', Value: formattedExportDate },
    ];

    // 3. Prepare Sheet 2: Inventory
    const inventoryData = books.length > 0
      ? books.map((b) => ({
          'Book Title': b.title || 'Untitled Book',
          Author: b.author || 'Unknown Author',
          Category: b.category || 'General',
          Department: b.department || 'General Library',
          'Total Copies': b.totalCopies ?? 1,
          'Available Copies': b.availableCopies ?? 1,
          Status: b.status || ((b.availableCopies ?? 1) > 0 ? 'Available' : 'Issued'),
        }))
      : [{ 'Book Title': 'No Data Available', Author: '-', Category: '-', Department: '-', 'Total Copies': 0, 'Available Copies': 0, Status: '-' }];

    // 4. Prepare Sheet 3: Active Borrowings
    const activeBorrowingsList = transactions.filter((t) => {
      const st = (t.status || '').toLowerCase();
      return st === 'issued' || st === 'extended';
    });

    const activeBorrowingsData = activeBorrowingsList.length > 0
      ? activeBorrowingsList.map((t) => ({
          'Student Name': t.studentName || 'Student',
          'Book Title': t.bookTitle || 'Untitled Book',
          'Issue Date': formatDate(t.issueDate || t.createdAt),
          'Due Date': formatDate(t.dueDate),
          Status: t.status || 'Issued',
        }))
      : [{ 'Student Name': 'No Data Available', 'Book Title': '-', 'Issue Date': '-', 'Due Date': '-', Status: '-' }];

    // 5. Prepare Sheet 4: Pending Requests
    const pendingReqsList = requests.filter((r) => isPending(r.status));

    const pendingRequestsData = pendingReqsList.length > 0
      ? pendingReqsList.map((r) => ({
          'Student Name': r.studentName || r.requestedBy || 'Student',
          'Book Title': r.bookTitle || 'Untitled Book',
          'Request Date': formatDate(r.requestDate || r.createdAt),
          Status: r.status || 'Pending',
        }))
      : [{ 'Student Name': 'No Data Available', 'Book Title': '-', 'Request Date': '-', Status: '-' }];

    // 6. Prepare Sheet 5: Users
    const usersData = users.length > 0
      ? users.map((u) => ({
          'Student Name': u.name || u.displayName || u.email || 'Student',
          Department: u.department || 'General Library',
          'Active Borrow Count': u.activeBorrowCount || u.currentBorrowed || 0,
        }))
      : [{ 'Student Name': 'No Data Available', Department: '-', 'Active Borrow Count': 0 }];

    // 7. Create Excel Workbook using SheetJS
    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 25 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    const inventorySheet = XLSX.utils.json_to_sheet(inventoryData);
    inventorySheet['!cols'] = [{ wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 22 }, { wch: 14 }, { wch: 16 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, inventorySheet, 'Inventory');

    const activeSheet = XLSX.utils.json_to_sheet(activeBorrowingsData);
    activeSheet['!cols'] = [{ wch: 24 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, activeSheet, 'Active Borrowings');

    const pendingSheet = XLSX.utils.json_to_sheet(pendingRequestsData);
    pendingSheet['!cols'] = [{ wch: 24 }, { wch: 30 }, { wch: 20 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, pendingSheet, 'Pending Requests');

    const usersSheet = XLSX.utils.json_to_sheet(usersData);
    usersSheet['!cols'] = [{ wch: 26 }, { wch: 22 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');

    // 8. Generate File Name: Borrow_Report_YYYY-MM-DD_HH-mm.xlsx
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const fileName = `Borrow_Report_${yyyy}-${mm}-${dd}_${hh}-${min}.xlsx`;

    // 9. Write and download file
    XLSX.writeFile(wb, fileName);

    return fileName;
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw error;
  }
}
