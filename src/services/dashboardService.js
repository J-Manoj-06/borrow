import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to real-time updates for books collection to calculate total, available, and popular books.
 */
export function subscribeToBooks(callback, onError) {
  try {
    const booksRef = collection(db, 'books');
    return onSnapshot(
      booksRef,
      (snapshot) => {
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(books);
      },
      (error) => {
        console.error('Error fetching books collection:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Snapshot listener creation error for books:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Subscribe to transactions collection to calculate active borrowed count.
 */
export function subscribeToTransactions(callback, onError) {
  try {
    const transRef = collection(db, 'transactions');
    return onSnapshot(
      transRef,
      (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(transactions);
      },
      (error) => {
        console.error('Error fetching transactions collection:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Snapshot listener creation error for transactions:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Subscribe to borrow requests collection to get pending counts and latest 5 requests.
 */
export function subscribeToBorrowRequests(callback, onError) {
  try {
    const reqRef = collection(db, 'borrow_requests');
    // Try to order by createdAt if index exists, fallback gracefully if snapshot fails
    const q = query(reqRef, limit(20));
    return onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(requests);
      },
      (error) => {
        console.error('Error fetching borrow_requests collection:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Snapshot listener creation error for borrow_requests:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Subscribe to activity_logs collection to display recent timeline.
 */
export function subscribeToActivityLogs(callback, onError) {
  try {
    const actRef = collection(db, 'activity_logs');
    const q = query(actRef, limit(10));
    return onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(logs);
      },
      (error) => {
        console.error('Error fetching activity_logs collection:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Snapshot listener creation error for activity_logs:', error);
    if (onError) onError(error);
    return () => {};
  }
}
