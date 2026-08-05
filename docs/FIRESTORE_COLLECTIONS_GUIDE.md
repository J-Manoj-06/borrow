# 🗄️ Firestore Collections & Security Indexes Guide

> Reference guide for Cloud Firestore collection structures, composite index requirements, and security rules.

---

## 📑 Collections Summary

1. `books` — Catalog items managed by librarians.
2. `borrow_requests` — Borrow requests submitted from mobile app or dashboard.
3. `transactions` — Active and historical circulation loans.
4. `users` — Registered student and member account profiles.
5. `notifications` — Notifications delivered to mobile app users.
6. `activity_logs` — System audit logs.
7. `settings` — Central configuration documents (`library`, `borrowing_rules`, `notification_preferences`, `appearance`, `departments`, `categories`, `semesters`).
8. `scan_history` — Audit records for barcode and QR code verifications.

---

## 🔍 Required Composite Indexes

Ensure the following composite indexes are created in Firebase Console:

### 1. `transactions` Collection
- `studentId` ASC, `status` ASC, `createdAt` DESC
- `bookId` ASC, `status` ASC, `createdAt` DESC

### 2. `borrow_requests` Collection
- `status` ASC, `createdAt` DESC
- `studentId` ASC, `createdAt` DESC

### 3. `activity_logs` Collection
- `type` ASC, `timestamp` DESC
