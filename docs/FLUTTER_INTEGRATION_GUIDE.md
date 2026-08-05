# 📱 Borrow Flutter App Integration Guide

> Technical reference for Flutter mobile developers consuming and updating Cloud Firestore collections managed by the **Borrow Admin Dashboard**.

---

## 🔄 Real-time Synchronization Architecture

The Borrow ecosystem relies on Firebase Cloud Firestore as the single source of truth. Whenever librarians perform actions in the React Admin Dashboard, changes are written to Firestore and pushed to the Flutter app via `StreamBuilder` and `snapshots()` listeners.

---

## 📂 Firestore Collections Reference

### 1. `books` Collection
Read by Flutter app for catalog browsing, searching, and book reservation.

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `title` | String | Full book title |
| `author` | String | Author name |
| `isbn` | String | Unique ISBN 10/13 |
| `category` | String | Category (e.g. Academic, Novel) |
| `department` | String | Target academic department |
| `coverImage` | String | Cloudinary image URL |
| `availableCopies` | Number | Realtime available copies count |
| `totalCopies` | Number | Total physical inventory copies |
| `isArchived` | Boolean | True if hidden from catalog |
| `barcode` | String | Unique Code128 value (`BORROW-XXXXXXXX`) |
| `qrCode` | String | JSON encoded QR Data URL |

---

### 2. `borrow_requests` Collection
Created by Flutter app when a student requests a book. Reviewed and approved/rejected by Admin Dashboard.

| Field Name | Type | Flutter Action | Admin Action |
| :--- | :--- | :--- | :--- |
| `bookId` | String | Created | Read |
| `studentId` | String | Created | Read |
| `status` | String | Reads real-time updates (`pending`, `approved`, `rejected`, `completed`) | Updates status to `approved` or `rejected` |
| `rejectionReason` | String | Displays if status is `rejected` | Set during rejection modal |

---

### 3. `notifications` Collection
Created by Admin Dashboard when actions occur (e.g. Request Approved, Book Issued, Return Processed). Consumed by Flutter app.

```json
{
  "userId": "student_uid_123",
  "title": "Borrow Request Approved",
  "message": "Your request for 'Clean Code' was approved! Please collect it from counter.",
  "type": "request_approved",
  "read": false,
  "createdAt": "2026-08-05T10:00:00Z"
}
```

---

### 4. `transactions` Collection
Created when a book is issued. Read by Flutter app under "My Borrowed Books".

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `transactionId` | String | Firestore document ID |
| `studentId` | String | Student UID |
| `bookId` | String | Book document ID |
| `issueDate` | Timestamp | Date book was issued |
| `dueDate` | Timestamp | Expected return date |
| `status` | String | `issued`, `returned`, `overdue`, `extended` |
