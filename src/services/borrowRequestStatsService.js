import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Checks if a given timestamp or date value falls on today in the user's local timezone.
 * @param {*} dateVal 
 * @returns {boolean}
 */
export function isTodayInLocalTimezone(dateVal) {
  if (!dateVal) return false;
  let dateObj;
  if (typeof dateVal.toDate === 'function') {
    dateObj = dateVal.toDate();
  } else if (dateVal instanceof Date) {
    dateObj = dateVal;
  } else {
    dateObj = new Date(dateVal);
  }
  if (isNaN(dateObj.getTime())) return false;

  const today = new Date();
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  );
}

/**
 * Subscribe to realtime updates for borrow_requests and compute statistics in-memory.
 * @param {function} callback 
 * @param {function} onError 
 * @returns {function} Unsubscribe function
 */
export function subscribeToBorrowRequestStats(callback, onError) {
  try {
    const reqsRef = collection(db, 'borrow_requests');

    return onSnapshot(
      reqsRef,
      (snapshot) => {
        let pendingCount = 0;
        let approvedTodayCount = 0;
        let rejectedTodayCount = 0;
        let cancelledTodayCount = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data() || {};
          const status = (data.status || '').toString().toLowerCase();

          // 1. Pending Requests
          if (status === 'pending') {
            pendingCount += 1;
          }
          // 2. Approved Today
          else if (status === 'approved') {
            const approvedDate = data.approvedAt || data.approvedDate || data.updatedAt;
            if (isTodayInLocalTimezone(approvedDate)) {
              approvedTodayCount += 1;
            }
          }
          // 3. Rejected Today
          else if (status === 'rejected') {
            const rejectedDate = data.rejectedAt || data.rejectedDate || data.updatedAt;
            if (isTodayInLocalTimezone(rejectedDate)) {
              rejectedTodayCount += 1;
            }
          }
          // 4. Cancelled Today (Support optional status)
          else if (status === 'cancelled' || status === 'canceled') {
            const cancelledDate = data.cancelledAt || data.canceledAt || data.updatedAt;
            if (isTodayInLocalTimezone(cancelledDate)) {
              cancelledTodayCount += 1;
            }
          }
          // Other statuses (issued, returned, expired, unknown) do not break calculations
        });

        const processedTodayCount = approvedTodayCount + rejectedTodayCount + cancelledTodayCount;

        callback({
          pendingCount,
          approvedTodayCount,
          rejectedTodayCount,
          processedTodayCount,
        });
      },
      (error) => {
        console.error('Error in borrow_requests stats realtime listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.error('Failed to create borrow_requests stats listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}
