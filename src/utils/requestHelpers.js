/**
 * Centralized helper functions for normalizing and matching borrow request statuses across the application.
 */

/**
 * Check if a status string represents a Pending request (awaiting librarian approval).
 * Matches 'pending', 'requested', 'request', or missing status.
 * @param {string} status 
 * @returns {boolean}
 */
export const isPendingRequest = (status) => {
  if (!status) return true;
  const s = String(status).trim().toLowerCase();
  return s === 'pending' || s === 'requested' || s === 'request';
};

/**
 * Check if a status string represents an Approved request.
 * @param {string} status 
 * @returns {boolean}
 */
export const isApprovedRequest = (status) => {
  if (!status) return false;
  const s = String(status).trim().toLowerCase();
  return s === 'approved';
};

/**
 * Check if a status string represents a Rejected request.
 * @param {string} status 
 * @returns {boolean}
 */
export const isRejectedRequest = (status) => {
  if (!status) return false;
  const s = String(status).trim().toLowerCase();
  return s === 'rejected' || s === 'declined';
};

/**
 * Normalize raw status string to a standard UI display label.
 * @param {string} status 
 * @returns {string} 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Returned' | 'Expired'
 */
export const getNormalizedRequestStatus = (status) => {
  if (!status) return 'Pending';
  const s = String(status).trim().toLowerCase();
  if (s === 'pending' || s === 'requested' || s === 'request') return 'Pending';
  if (s === 'approved') return 'Approved';
  if (s === 'rejected' || s === 'declined') return 'Rejected';
  if (s === 'cancelled') return 'Cancelled';
  if (s === 'returned' || s === 'completed') return 'Returned';
  if (s === 'expired') return 'Expired';
  return status.charAt(0).toUpperCase() + status.slice(1);
};
