import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Check if a book with the given ISBN already exists in Firestore.
 * @param {string} isbn 
 * @param {string} excludeBookId 
 * @returns {Promise<boolean>}
 */
export async function checkIsbnExists(isbn, excludeBookId = null) {
  if (!isbn || !isbn.trim()) return false;
  try {
    const booksRef = collection(db, 'books');
    const q = query(booksRef, where('isbn', '==', isbn.trim()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    
    if (excludeBookId) {
      return snapshot.docs.some(doc => doc.id !== excludeBookId);
    }
    
    return true;
  } catch (error) {
    console.error('Error checking duplicate ISBN:', error);
    return false;
  }
}

/**
 * Add a new book document to Firestore books collection and log activity.
 * @param {object} bookData 
 * @returns {Promise<string>} Document ID
 */
export async function createBook(bookData) {
  try {
    const booksRef = collection(db, 'books');
    const payload = {
      ...bookData,
      borrowCount: bookData.borrowCount || 0,
      isArchived: false,
      status: bookData.status || 'available',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(booksRef, payload);

    // Write log into activity_logs collection
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'book_added',
        title: `Book Added: "${bookData.title}"`,
        action: `Added "${bookData.title}" by ${bookData.author}`,
        bookId: docRef.id,
        userEmail: bookData.createdBy || 'Librarian',
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log write error:', logErr);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating book in Firestore:', error);
    throw error;
  }
}

/**
 * Subscribe to realtime updates for a single book by ID.
 * @param {string} bookId 
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToBook(bookId, callback, onError) {
  if (!bookId) return () => {};
  try {
    const docRef = doc(db, 'books', bookId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, bookId: snapshot.id, ...snapshot.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error in book ${bookId} realtime listener:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create single book listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Update existing book document in Firestore.
 * @param {string} bookId 
 * @param {object} updateData 
 */
export async function updateBook(bookId, updateData) {
  try {
    const docRef = doc(db, 'books', bookId);
    const payload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(docRef, payload);

    // Log update activity
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'book_updated',
        title: `Book Updated: "${updateData.title || 'Book'}"`,
        action: `Updated details for "${updateData.title || 'Book'}"`,
        bookId,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
}

/**
 * Archive a book (sets isArchived = true).
 * @param {string} bookId 
 */
export async function archiveBook(bookId) {
  try {
    const docRef = doc(db, 'books', bookId);
    await updateDoc(docRef, {
      isArchived: true,
      status: 'archived',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error archiving book:', error);
    throw error;
  }
}

/**
 * Soft delete a book (sets deletedAt & deletedBy).
 * @param {string} bookId 
 * @param {string} userEmail 
 */
export async function softDeleteBook(bookId, userEmail = 'Librarian') {
  try {
    const docRef = doc(db, 'books', bookId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      deletedBy: userEmail,
      status: 'deleted',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error soft deleting book:', error);
    throw error;
  }
}

/**
 * Subscribe to recent borrow history transactions for a book.
 * @param {string} bookId 
 * @param {function} callback 
 */
export function subscribeToBookTransactions(bookId, callback) {
  if (!bookId) return () => {};
  try {
    const transRef = collection(db, 'transactions');
    const q = query(transRef, where('bookId', '==', bookId), limit(10));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(list);
      },
      (error) => {
        console.warn('Error fetching book transactions:', error);
        callback([]);
      }
    );
  } catch {
    callback([]);
    return () => {};
  }
}

/**
 * Subscribe to related books in same department or category.
 * @param {string} department 
 * @param {string} category 
 * @param {string} currentBookId 
 * @param {function} callback 
 */
export function subscribeToRelatedBooks(department, category, currentBookId, callback) {
  try {
    const booksRef = collection(db, 'books');
    const q = query(booksRef, limit(10));
    return onSnapshot(
      q,
      (snapshot) => {
        const all = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(b => b.id !== currentBookId);
        
        const filtered = all.filter(b => 
          (department && b.department?.toLowerCase() === department.toLowerCase()) ||
          (category && b.category?.toLowerCase() === category.toLowerCase())
        );

        callback(filtered.length > 0 ? filtered.slice(0, 6) : all.slice(0, 6));
      },
      () => callback([])
    );
  } catch {
    callback([]);
    return () => {};
  }
}

/**
 * Placeholder service for ISBN auto-fill lookup.
 * @param {string} isbn 
 */
export async function lookupIsbnService(isbn) {
  // Service placeholder for Google Books API / Open Library API integration
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        found: true,
        title: `Auto-filled Catalog Item (${isbn})`,
        author: 'Recognized Author',
        publisher: 'Academic Publishing House',
        edition: '1st Edition',
        publicationYear: '2024',
        language: 'English',
        category: 'Academic',
        department: 'Computer Science',
      });
    }, 600);
  });
}
