import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the transactions collection in Firestore.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToTransactions(callback, onError) {
  try {
    const transRef = collection(db, 'transactions');
    return onSnapshot(
      transRef,
      (snapshot) => {
        const transactions = snapshot.docs.map((d) => ({
          id: d.id,
          transactionId: d.id,
          ...d.data(),
        }));
        callback(transactions);
      },
      (error) => {
        console.error('Error in transactions realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create transactions listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Issue a book to a student, update availableCopies in books collection, and dispatch notification & activity log.
 * @param {object} issueData 
 * @param {string} librarianEmail 
 */
export async function issueBookTransaction(issueData, librarianEmail = 'Librarian') {
  try {
    const transRef = collection(db, 'transactions');
    const issueDateObj = issueData.issueDate ? new Date(issueData.issueDate) : new Date();
    const dueDateObj = issueData.dueDate ? new Date(issueData.dueDate) : new Date(Date.now() + 14 * 86400000);

    const payload = {
      bookId: issueData.bookId || 'N/A',
      bookTitle: issueData.bookTitle || 'Untitled Book',
      isbn: issueData.isbn || 'N/A',
      bookCover: issueData.bookCover || '',
      studentId: issueData.studentId || issueData.userId || 'N/A',
      studentName: issueData.studentName || 'Library Member',
      studentRollNo: issueData.studentRollNo || issueData.rollNo || 'N/A',
      studentEmail: issueData.studentEmail || issueData.userEmail || '',
      department: issueData.department || 'General',
      requestId: issueData.requestId || null,
      issueDate: issueDateObj,
      dueDate: dueDateObj,
      returnDate: null,
      status: 'issued',
      issuedBy: librarianEmail,
      returnedBy: null,
      conditionBefore: issueData.conditionBefore || 'excellent',
      conditionAfter: null,
      remarks: issueData.notes || '',
      extendedCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(transRef, payload);

    // Decrement availableCopies in books
    if (issueData.bookId) {
      try {
        const bookRef = doc(db, 'books', issueData.bookId);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
          const currentAvail = bookSnap.data().availableCopies ?? 1;
          const newAvail = Math.max(0, currentAvail - 1);
          await updateDoc(bookRef, {
            availableCopies: newAvail,
            borrowCount: increment(1),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (bookErr) {
        console.warn('Failed to update availableCopies:', bookErr);
      }
    }

    // Update request status to completed if issued from request
    if (issueData.requestId) {
      try {
        const reqRef = doc(db, 'borrow_requests', issueData.requestId);
        await updateDoc(reqRef, {
          status: 'completed',
          updatedAt: serverTimestamp(),
        });
      } catch (reqErr) {
        console.warn('Failed to complete request:', reqErr);
      }
    }

    // Dispatch notification to student mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId: issueData.studentId || issueData.studentEmail || 'member',
        title: 'Book Issued Successfully',
        message: `"${issueData.bookTitle}" has been issued to you. Due date: ${dueDateObj.toLocaleDateString()}.`,
        type: 'book_issued',
        bookId: issueData.bookId,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Failed to create notification:', notifErr);
    }

    // Log in activity_logs
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'book_issued',
        title: 'Book Issued',
        action: `Issued "${issueData.bookTitle}" to ${issueData.studentName}`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error issuing book transaction:', error);
    throw error;
  }
}

/**
 * Return a borrowed book, update condition & availableCopies in books collection, and dispatch notification.
 * @param {string} transactionId 
 * @param {object} returnData 
 * @param {string} librarianEmail 
 */
export async function returnBookTransaction(transactionId, returnData, librarianEmail = 'Librarian') {
  try {
    const transRef = doc(db, 'transactions', transactionId);
    const returnDateObj = returnData.returnDate ? new Date(returnData.returnDate) : new Date();

    const isDamagedOrLost = returnData.condition === 'damaged' || returnData.condition === 'lost';
    const finalStatus = returnData.condition === 'lost' ? 'lost' : returnData.condition === 'damaged' ? 'damaged' : 'returned';

    // 1. Update transaction
    await updateDoc(transRef, {
      status: finalStatus,
      returnDate: returnDateObj,
      conditionAfter: returnData.condition,
      remarks: returnData.remarks || '',
      returnedBy: librarianEmail,
      updatedAt: serverTimestamp(),
    });

    // 2. Increment availableCopies in books if not lost/damaged
    if (returnData.bookId && !isDamagedOrLost) {
      try {
        const bookRef = doc(db, 'books', returnData.bookId);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
          const currentAvail = bookSnap.data().availableCopies ?? 0;
          await updateDoc(bookRef, {
            availableCopies: currentAvail + 1,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (bookErr) {
        console.warn('Failed to restore availableCopies:', bookErr);
      }
    }

    // 3. Dispatch Notification
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId: returnData.studentId || returnData.studentEmail || 'member',
        title: 'Book Return Processed',
        message: `Return processed for "${returnData.bookTitle || 'Book'}". Condition recorded: ${returnData.condition}.`,
        type: 'book_returned',
        bookId: returnData.bookId,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Notification error:', notifErr);
    }

    // 4. Log in activity_logs
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'book_returned',
        title: 'Book Returned',
        action: `Processed return for "${returnData.bookTitle || 'Book'}" (${returnData.condition})`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error returning book transaction:', error);
    throw error;
  }
}

/**
 * Extend due date for an active transaction.
 * @param {string} transactionId 
 * @param {string} newDueDate 
 * @param {string} reason 
 * @param {string} librarianEmail 
 */
export async function extendDueDateTransaction(transactionId, newDueDate, reason = '', librarianEmail = 'Librarian') {
  try {
    const transRef = doc(db, 'transactions', transactionId);
    const dueDateObj = new Date(newDueDate);

    await updateDoc(transRef, {
      dueDate: dueDateObj,
      status: 'extended',
      extensionReason: reason,
      extendedCount: increment(1),
      updatedAt: serverTimestamp(),
    });

    // Log activity
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'due_date_extended',
        title: 'Due Date Extended',
        action: `Extended due date to ${dueDateObj.toLocaleDateString()} (${reason})`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error extending due date:', error);
    throw error;
  }
}
