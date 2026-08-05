import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Realtime subscription watching books, transactions, users, borrow_requests, and activity_logs
 * to build comprehensive analytics metrics and datasets.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToAnalyticsData(callback, onError) {
  try {
    let books = [];
    let transactions = [];
    let users = [];
    let requests = [];

    const notify = () => {
      callback({
        books,
        transactions,
        users,
        requests,
      });
    };

    const unsubBooks = onSnapshot(
      collection(db, 'books'),
      (snap) => {
        books = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Books snapshot error:', err)
    );

    const unsubTrans = onSnapshot(
      collection(db, 'transactions'),
      (snap) => {
        transactions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Transactions snapshot error:', err)
    );

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Users snapshot error:', err)
    );

    const unsubReqs = onSnapshot(
      collection(db, 'borrow_requests'),
      (snap) => {
        requests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Requests snapshot error:', err)
    );

    return () => {
      unsubBooks();
      unsubTrans();
      unsubUsers();
      unsubReqs();
    };
  } catch (error) {
    console.error('Failed to initialize analytics real-time listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}
