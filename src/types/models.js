/**
 * JSDoc Type Safety Models for Borrow Admin Dashboard.
 * Prepares codebase for seamless future TypeScript migration.
 */

/**
 * @typedef {Object} Book
 * @property {string} id - Firestore Document ID
 * @property {string} title - Full book title
 * @property {string} author - Author name
 * @property {string} isbn - Unique ISBN
 * @property {string} category - Book category
 * @property {string} department - Target department
 * @property {string} [coverImage] - Cloudinary URL
 * @property {number} availableCopies - Available copies count
 * @property {number} totalCopies - Total catalog inventory
 * @property {boolean} isArchived - Archive status
 * @property {string} barcode - Unique Code128 barcode
 * @property {string} qrCode - QR code Data URL
 * @property {string} [floor] - Physical floor location
 * @property {string} [rack] - Physical rack location
 * @property {string} [shelf] - Physical shelf location
 */

/**
 * @typedef {Object} BorrowRequest
 * @property {string} id - Request document ID
 * @property {string} bookId - Book ID
 * @property {string} bookTitle - Book title
 * @property {string} studentId - Student UID
 * @property {string} studentName - Student full name
 * @property {string} status - 'pending' | 'approved' | 'rejected' | 'completed'
 * @property {string} [rejectionReason] - Reason if rejected
 * @property {Object} createdAt - Firestore Timestamp
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction document ID
 * @property {string} bookId - Book ID
 * @property {string} studentId - Student UID
 * @property {Date} issueDate - Issue timestamp
 * @property {Date} dueDate - Expiration timestamp
 * @property {Date|null} returnDate - Return timestamp
 * @property {string} status - 'issued' | 'returned' | 'overdue' | 'extended'
 * @property {string} [conditionBefore] - Condition when issued
 * @property {string} [conditionAfter] - Condition when returned
 */

/**
 * @typedef {Object} User
 * @property {string} id - User UID
 * @property {string} email - Email address
 * @property {string} [name] - Full name
 * @property {string} status - 'active' | 'suspended' | 'pending'
 * @property {number} borrowLimit - Maximum allowed active loans (default 5)
 * @property {number} activeBorrowCount - Current active loans
 */

export default {};
