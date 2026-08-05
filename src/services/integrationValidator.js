/**
 * Realtime Firestore Integration & Data Consistency Validator.
 * Validates document schemas and integrity rules across the Borrow ecosystem.
 */

export const validateBookData = (book) => {
  const errors = [];
  if (!book.id && !book.bookId) errors.push('Missing book ID');
  if (!book.title) errors.push('Missing book title');
  if (typeof book.availableCopies === 'number' && book.availableCopies < 0) {
    errors.push('availableCopies cannot be negative');
  }
  if (typeof book.totalCopies === 'number' && typeof book.availableCopies === 'number') {
    if (book.availableCopies > book.totalCopies) {
      errors.push('availableCopies cannot exceed totalCopies');
    }
  }
  return { isValid: errors.length === 0, errors };
};

export const validateRequestData = (request) => {
  const errors = [];
  if (!request.id && !request.requestId) errors.push('Missing request ID');
  if (!request.bookId) errors.push('Missing book ID in request');
  if (!request.studentId && !request.userId && !request.userEmail) {
    errors.push('Missing student identifier in request');
  }
  const validStatuses = ['pending', 'approved', 'rejected', 'cancelled', 'expired', 'completed'];
  if (request.status && !validStatuses.includes(request.status.toLowerCase())) {
    errors.push(`Invalid request status: ${request.status}`);
  }
  return { isValid: errors.length === 0, errors };
};

export const validateTransactionData = (transaction) => {
  const errors = [];
  if (!transaction.id && !transaction.transactionId) errors.push('Missing transaction ID');
  if (!transaction.bookId) errors.push('Missing book ID in transaction');
  if (!transaction.studentId) errors.push('Missing student ID in transaction');
  const validStatuses = ['issued', 'active', 'returned', 'overdue', 'lost', 'damaged', 'extended'];
  if (transaction.status && !validStatuses.includes(transaction.status.toLowerCase())) {
    errors.push(`Invalid transaction status: ${transaction.status}`);
  }
  return { isValid: errors.length === 0, errors };
};

export const validateUserData = (user) => {
  const errors = [];
  if (!user.id && !user.uid) errors.push('Missing user UID');
  if (!user.email) errors.push('Missing user email');
  if (typeof user.borrowLimit === 'number' && user.borrowLimit < 1) {
    errors.push('borrowLimit must be at least 1');
  }
  return { isValid: errors.length === 0, errors };
};

export default {
  validateBookData,
  validateRequestData,
  validateTransactionData,
  validateUserData,
};
