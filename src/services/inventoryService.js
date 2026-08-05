import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the books collection in Firestore.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToBooksInventory(callback, onError) {
  try {
    const booksRef = collection(db, 'books');
    return onSnapshot(
      booksRef,
      (snapshot) => {
        const books = snapshot.docs.map((doc) => ({
          id: doc.id,
          bookId: doc.id,
          ...doc.data(),
        }));
        callback(books);
      },
      (error) => {
        console.error('Error in books inventory realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create books inventory listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}
