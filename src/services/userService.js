import { 
  collection, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp, 
  limit 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the users collection in Firestore.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToUsers(callback, onError) {
  try {
    const usersRef = collection(db, 'users');
    return onSnapshot(
      usersRef,
      (snapshot) => {
        const usersList = snapshot.docs.map((d) => ({
          id: d.id,
          uid: d.id,
          ...d.data(),
        }));
        callback(usersList);
      },
      (error) => {
        console.error('Error in users realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create users listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Update user account status (e.g. active, suspended, pending, deactivated).
 * @param {string} userId 
 * @param {string} newStatus 
 * @param {string} librarianEmail 
 */
export async function updateUserStatus(userId, newStatus, librarianEmail = 'Librarian') {
  if (!userId) throw new Error('User ID is required.');
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    // Create notification for mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId,
        title: `Account Status Updated`,
        message: `Your Borrow account status has been updated to: ${newStatus.toUpperCase()}.`,
        type: `account_${newStatus}`,
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Failed to create notification:', notifErr);
    }

    // Log activity
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'account_status_updated',
        title: 'User Status Changed',
        action: `Set account status for user ${userId} to ${newStatus}`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
}

/**
 * Update user maximum borrowing limit.
 * @param {string} userId 
 * @param {number} newLimit 
 * @param {string} librarianEmail 
 */
export async function updateUserBorrowLimit(userId, newLimit, librarianEmail = 'Librarian') {
  if (!userId) throw new Error('User ID is required.');
  try {
    const userRef = doc(db, 'users', userId);
    const limitNum = Number(newLimit) || 5;

    await updateDoc(userRef, {
      borrowLimit: limitNum,
      updatedAt: serverTimestamp(),
    });

    // Notification for mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId,
        title: 'Borrow Limit Updated',
        message: `Your maximum book borrowing limit has been updated to ${limitNum} books.`,
        type: 'borrow_limit_changed',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Notification error:', notifErr);
    }

    // Activity log
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'borrow_limit_changed',
        title: 'Borrow Limit Changed',
        action: `Updated borrow limit for user ${userId} to ${limitNum} books`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error updating borrow limit:', error);
    throw error;
  }
}

/**
 * Update editable user profile details (phone, department, semester, address, emergencyContact, notes).
 * @param {string} userId 
 * @param {object} profileData 
 * @param {string} librarianEmail 
 */
export async function updateUserProfile(userId, profileData, librarianEmail = 'Librarian') {
  if (!userId) throw new Error('User ID is required.');
  try {
    const userRef = doc(db, 'users', userId);
    const payload = {
      phone: profileData.phone || '',
      department: profileData.department || 'General',
      semester: profileData.semester || 'General',
      address: profileData.address || '',
      emergencyContact: profileData.emergencyContact || '',
      notes: profileData.notes || '',
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, payload);

    // Notification for mobile app
    try {
      const notifRef = collection(db, 'notifications');
      await addDoc(notifRef, {
        userId,
        title: 'Profile Updated',
        message: 'Your library membership contact details have been updated by the administration.',
        type: 'profile_updated',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (notifErr) {
      console.warn('Notification error:', notifErr);
    }

    // Activity log
    try {
      const logsRef = collection(db, 'activity_logs');
      await addDoc(logsRef, {
        type: 'profile_updated',
        title: 'Profile Updated',
        action: `Updated contact profile details for user ${userId}`,
        userEmail: librarianEmail,
        timestamp: serverTimestamp(),
      });
    } catch (logErr) {
      console.warn('Activity log error:', logErr);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Subscribe to all transactions for a specific user.
 * @param {string} userId 
 * @param {function} callback 
 */
export function subscribeToUserTransactions(userId, callback) {
  if (!userId) return () => {};
  try {
    const transRef = collection(db, 'transactions');
    const q = query(transRef, where('studentId', '==', userId), limit(25));
    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(list);
      },
      (error) => {
        console.warn('Error fetching user transactions:', error);
        callback([]);
      }
    );
  } catch {
    callback([]);
    return () => {};
  }
}
