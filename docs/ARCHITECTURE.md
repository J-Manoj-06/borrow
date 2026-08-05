# 🏗️ Borrow Admin Dashboard — System Architecture & Data Flow

> Deep-dive architectural documentation for developers maintaining and extending the Borrow Admin Dashboard.

---

## 🏛️ Overall Architecture Overview

The Borrow Admin Portal is structured around a decoupled, event-driven React 19 single-page application (SPA) powered by Cloud Firestore and Cloudinary.

```
+------------------------------------+          +----------------------------------+
|    Borrow React Admin Dashboard    |          |    Borrow Flutter Mobile App     |
|   (Librarian Circulation Portal)   |          |   (Student Book Search/Borrow)   |
+-----------------+------------------+          +----------------+-----------------+
                  |                                              |
                  |                Firestore Snapshot            |
                  +---------------> Listener Sync <--------------+
                                          |
                                          v
                              +-----------------------+
                              |    Cloud Firestore    |
                              |  Realtime DB Engine   |
                              +-----------------------+
```

---

## 🔁 Real-time Synchronization Flow

1. **Snapshot Listeners**: Custom hooks (e.g. `useInventoryData`, `useBorrowRequests`, `useTransactions`, `useNotifications`, `useUsers`, `useBarcodeScanner`) register `onSnapshot()` listeners targeting Firestore collections.
2. **Local State Update**: When a document changes in Firestore (due to a student request or librarian action), Firestore triggers the snapshot callback, instantly updating React state without manual refreshing.
3. **State Mutation**: Librarian actions (Approve Request, Return Book, Issue Book, Add Book) execute atomic Firestore batch updates or single-doc writes.

---

## 📤 Cloudinary Image Upload Pipeline

1. Librarian selects cover image file in `Step3ImageUpload.jsx`.
2. Client converts file to base64 Data URL for instant live preview.
3. If Cloudinary environment credentials exist, `cloudinary.js` sends direct unsigned multipart POST upload request to Cloudinary API.
4. Cloudinary returns optimized CDN image URL which is saved to the book's `coverImage` field in Firestore.
5. Fallback: If Cloudinary fails or credentials are omitted, image Data URL is stored cleanly.

---

## 📊 Module Component Hierarchy

```
App.jsx
 └── AuthProvider (AuthContext.js)
      └── ErrorBoundary
           └── AppRoutes (React.lazy code-splitting)
                ├── ProtectedRoute -> ProtectedLayout
                │    ├── Sidebar
                │    ├── Topbar (Realtime Notification Bell Count)
                │    └── PageOutlet
                │         ├── /dashboard -> Dashboard.jsx
                │         ├── /inventory -> Inventory.jsx
                │         ├── /inventory/add -> AddBook.jsx
                │         ├── /inventory/:bookId -> BookDetails.jsx
                │         ├── /requests -> Requests.jsx
                │         ├── /transactions -> Transactions.jsx
                │         ├── /users -> Users.jsx
                │         ├── /reports -> Reports.jsx
                │         ├── /notifications -> Notifications.jsx
                │         ├── /barcode -> Barcode.jsx
                │         └── /settings -> Settings.jsx
                └── PublicRoute -> /login (Login.jsx)
```
