import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Realtime subscription watching books, transactions, users, borrow_requests, and activity_logs
 * to feed 100% live Firestore analytics.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToLiveAnalytics(callback, onError) {
  try {
    let books = [];
    let transactions = [];
    let users = [];
    let requests = [];
    let activityLogs = [];

    const notify = () => {
      callback({
        books,
        transactions,
        users,
        requests,
        activityLogs,
      });
    };

    const unsubBooks = onSnapshot(
      collection(db, 'books'),
      (snap) => {
        books = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => {
        console.warn('Analytics books snapshot warning:', err);
        if (onError) onError(err);
      }
    );

    const unsubTrans = onSnapshot(
      collection(db, 'transactions'),
      (snap) => {
        transactions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Analytics transactions snapshot warning:', err)
    );

    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Analytics users snapshot warning:', err)
    );

    const unsubReqs = onSnapshot(
      collection(db, 'borrow_requests'),
      (snap) => {
        requests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Analytics requests snapshot warning:', err)
    );

    const unsubLogs = onSnapshot(
      collection(db, 'activity_logs'),
      (snap) => {
        activityLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        notify();
      },
      (err) => console.warn('Analytics logs snapshot warning:', err)
    );

    return () => {
      unsubBooks();
      unsubTrans();
      unsubUsers();
      unsubReqs();
      unsubLogs();
    };
  } catch (error) {
    console.error('Failed to initialize analytics realtime listeners:', error);
    if (onError) onError(error);
    return () => {};
  }
}
