import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the borrow_requests collection in Firestore.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToBorrowRequests(callback, onError) {
  try {
    const reqRef = collection(db, 'borrow_requests');
    return onSnapshot(
      reqRef,
      (snapshot) => {
        const requests = snapshot.docs.map((d) => ({
          id: d.id,
          requestId: d.id,
          ...d.data(),
        }));
        callback(requests);
      },
      (error) => {
        console.error('Error in borrow_requests realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create borrow_requests listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Check count of active loans/requests for a student to enforce max 3 books limit.
 * @param {string} studentId 
 * @returns {Promise<number>}
 */
export async function getStudentActiveCount(studentId) {
  if (!studentId) return 0;
  try {
    const transRef = collection(db, 'transactions');
    const q = query(
      transRef, 
      where('studentId', '==', studentId), 
      where('status', '==', 'active')
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch {
    return 0;
  }
}

/**
 * Approve a borrow request, update book copies & borrow count, create transaction, notification & log.
 * @param {object} request 
 * @param {string} librarianEmail 
 */
export async function approveBorrowRequest(request, librarianEmail = 'Librarian') {
  if (!request || !request.id) throw new Error('Invalid request data.');

  try {
    const requestRef = doc(db, 'borrow_requests', request.id);

    // 1. Update borrow_requests status
    await updateDoc(requestRef, {
      status: 'approved',
      approvalTimestamp: serverTimestamp(),
      approvedBy: librarianEmail,
      updatedAt: serverTimestamp(),
    });

    // 2. Decrement availableCopies and increment borrowCount in books collection
    if (request.bookId) {
      try {
        const bookRef = doc(db, 'books', request.bookId);
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
        console.warn('Failed to update book copies count:', bookErr);
      }
    }

    // 3. Create active transaction document
    try {
      const transRef = collection(db, 'transactions');
      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + 14); // 14 days loan period default

      await addDoc(transRef, {
        type: 'issue',
        status: 'active',
        requestId: request.id,
        studentId: request.studentId || request.userId || 'N/A',
        studentName: request.studentName || request.userEmail || 'Library Member',
        studentEmail: request.studentEmail || request.userEmail || '',
        bookId: request.bookId || 'N/A',
        bookTitle: request.bookTitle || request.bookName || 'Untitled Book',
        isbn: request.isbn || 'N/A',
        borrowDate: serverTimestamp(),
        dueDate: dueDateObj,
        createdAt: serverTimestamp(),
      });
    } catch (transErr) {
      console.warn('Failed to create transaction record:', transErr);
    }

    // 4. Create Notification document for mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId: request.studentId || request.userId || request.userEmail || 'member',
        title: 'Borrow Request Approved',
        message: `Your borrow request for "${request.bookTitle || 'Book'}" has been approved! Please collect it from the library counter.`,
        type: 'request_approved',
        bookId: request.bookId,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Failed to create notification:', notifErr);
    }

    // 5. Create Activity Log
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'borrow_approved',
        title: 'Borrow Request Approved',
        action: `Approved request for "${request.bookTitle || 'Book'}" requested by ${request.studentName || 'Student'}`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error approving borrow request:', error);
    throw error;
  }
}

/**
 * Reject a borrow request with reason, create notification & log.
 * @param {object} request 
 * @param {string} reason 
 * @param {string} notes 
 * @param {string} librarianEmail 
 */
export async function rejectBorrowRequest(request, reason, notes = '', librarianEmail = 'Librarian') {
  if (!request || !request.id) throw new Error('Invalid request data.');

  try {
    const requestRef = doc(db, 'borrow_requests', request.id);

    // 1. Update borrow_requests status
    await updateDoc(requestRef, {
      status: 'rejected',
      rejectionReason: reason,
      rejectionNotes: notes,
      rejectedTimestamp: serverTimestamp(),
      rejectedBy: librarianEmail,
      updatedAt: serverTimestamp(),
    });

    // 2. Create Notification document for mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId: request.studentId || request.userId || request.userEmail || 'member',
        title: 'Borrow Request Declined',
        message: `Your request for "${request.bookTitle || 'Book'}" was declined. Reason: ${reason}${notes ? ` (${notes})` : ''}.`,
        type: 'request_declined',
        bookId: request.bookId,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Failed to create decline notification:', notifErr);
    }

    // 3. Create Activity Log
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'borrow_rejected',
        title: 'Borrow Request Declined',
        action: `Declined request for "${request.bookTitle || 'Book'}" (${reason})`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error rejecting borrow request:', error);
    throw error;
  }
}
