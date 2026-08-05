import { 
  collection, 
  doc, 
  updateDoc, 
  onSnapshot, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Subscribe to realtime updates for the notifications collection.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToNotifications(callback, onError) {
  try {
    const notifRef = collection(db, 'notifications');
    return onSnapshot(
      notifRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          notificationId: d.id,
          ...d.data(),
        }));
        callback(list);
      },
      (error) => {
        console.error('Error in notifications realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create notifications listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Subscribe to realtime updates for the activity_logs collection.
 * @param {function} callback 
 * @param {function} onError 
 */
export function subscribeToActivityLogs(callback, onError) {
  try {
    const logsRef = collection(db, 'activity_logs');
    return onSnapshot(
      logsRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          activityId: d.id,
          ...d.data(),
        }));
        callback(list);
      },
      (error) => {
        console.error('Error in activity_logs realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to create activity_logs listener:', error);
    if (onError) onError(error);
    return () => {};
  }
}

/**
 * Mark a notification as read.
 * @param {string} id 
 */
export async function markNotificationRead(id) {
  if (!id) return;
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { isRead: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Mark a notification as unread.
 * @param {string} id 
 */
export async function markNotificationUnread(id) {
  if (!id) return;
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { isRead: false, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error marking notification as unread:', error);
  }
}

/**
 * Archive a notification.
 * @param {string} id 
 */
export async function archiveNotification(id) {
  if (!id) return;
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { isArchived: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error archiving notification:', error);
  }
}

/**
 * Soft delete a notification.
 * @param {string} id 
 */
export async function softDeleteNotification(id) {
  if (!id) return;
  try {
    const docRef = doc(db, 'notifications', id);
    await updateDoc(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error('Error soft deleting notification:', error);
  }
}

/**
 * Mark all notifications as read.
 * @param {Array} notificationsList 
 */
export async function markAllNotificationsRead(notificationsList = []) {
  try {
    const unread = notificationsList.filter((n) => !n.isRead && !n.isDeleted);
    if (unread.length === 0) return;

    const batch = writeBatch(db);
    unread.forEach((n) => {
      const docRef = doc(db, 'notifications', n.id);
      batch.update(docRef, { isRead: true, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

/**
 * Archive all read notifications.
 * @param {Array} notificationsList 
 */
export async function archiveReadNotifications(notificationsList = []) {
  try {
    const readList = notificationsList.filter((n) => n.isRead && !n.isArchived && !n.isDeleted);
    if (readList.length === 0) return;

    const batch = writeBatch(db);
    readList.forEach((n) => {
      const docRef = doc(db, 'notifications', n.id);
      batch.update(docRef, { isArchived: true, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error archiving read notifications:', error);
  }
}

/**
 * Soft delete all notifications.
 * @param {Array} notificationsList 
 */
export async function softDeleteAllNotifications(notificationsList = []) {
  try {
    const activeList = notificationsList.filter((n) => !n.isDeleted);
    if (activeList.length === 0) return;

    const batch = writeBatch(db);
    activeList.forEach((n) => {
      const docRef = doc(db, 'notifications', n.id);
      batch.update(docRef, { isDeleted: true, updatedAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting all notifications:', error);
  }
}
