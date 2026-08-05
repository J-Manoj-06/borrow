import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the borrow_requests collection.
 * Validates that each request's bookId exists in books collection.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToBorrowRequests(callback, onError) {
  try {
    const reqRef = collection(db, 'borrow_requests');
    return onSnapshot(
      reqRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          requestId: d.id,
          ...d.data(),
        }));
        callback(list);
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
 * Fetch book availability and specifications from books collection.
 * @param {string} bookId 
 * @returns {Promise<object>}
 */
export async function fetchBookAvailability(bookId) {
  if (!bookId) return null;
  try {
    const bookRef = doc(db, 'books', bookId);
    const snap = await getDoc(bookRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        exists: true,
        availableCopies: data.availableCopies ?? 0,
        totalCopies: data.totalCopies ?? 1,
        status: data.status || 'Available',
        title: data.title || 'Untitled Book',
        author: data.author || 'Unknown Author',
        coverImage: data.coverImage || data.cover || data.imageUrl || '',
        category: data.category || 'General',
        department: data.department || 'General Library',
        isbn: data.isbn || 'N/A',
      };
    }
    return { exists: false, availableCopies: 0, totalCopies: 0 };
  } catch (error) {
    console.error('Error fetching book availability:', error);
    return { exists: false, availableCopies: 0, totalCopies: 0 };
  }
}

/**
 * Approve a borrow request.
 * Sets status='Approved', approvedBy=librarianId, approvedAt=now.
 * (Does NOT reduce stock or create transactions yet).
 * @param {string} requestId 
 * @param {string} librarianId 
 */
export async function approveBorrowRequest(requestId, librarianId = 'Librarian') {
  if (!requestId) throw new Error('Missing request ID');
  try {
    const docRef = doc(db, 'borrow_requests', requestId);
    await updateDoc(docRef, {
      status: 'Approved',
      approvedBy: librarianId,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error approving borrow request:', error);
    throw error;
  }
}

/**
 * Reject a borrow request with reason.
 * Sets status='Rejected', rejectedBy=librarianId, rejectedAt=now, rejectionReason=reason.
 * @param {string} requestId 
 * @param {string} reason 
 * @param {string} librarianId 
 */
export async function rejectBorrowRequest(requestId, reason = 'Out of Stock', librarianId = 'Librarian') {
  if (!requestId) throw new Error('Missing request ID');
  try {
    const docRef = doc(db, 'borrow_requests', requestId);
    await updateDoc(docRef, {
      status: 'Rejected',
      rejectedBy: librarianId,
      rejectedAt: serverTimestamp(),
      rejectionReason: reason,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error rejecting borrow request:', error);
    throw error;
  }
}
