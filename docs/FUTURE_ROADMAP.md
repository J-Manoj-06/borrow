# 🚀 Borrow Admin Dashboard — Future Scalability Roadmap

> Technical blueprint for future modular expansions and enterprise library features.

---

## 🔮 Future Module Expansion Blueprint

### 1. Fine & Overdue Penalty Management
- **Description**: Automatic fine calculation engine charging standard daily fees for overdue book returns.
- **Architectural Hook**: Extend `transactionService.js` and `ReturnBookModal.jsx` to compute `daysOverdue * dailyFineRate` and record payment transactions under `fines` collection.

---

### 2. Digital E-Book Library & PDF Reader
- **Description**: Digital e-book catalog allowing students to read PDF and EPUB files directly inside the mobile app or browser portal.
- **Architectural Hook**: Extend `books` Firestore schema with `isDigital: true` and `pdfUrl`. Integrate PDF viewer component in `BookDetails.jsx`.

---

### 3. Smart Reservation Queue
- **Description**: Automatic waitlist queue when `availableCopies == 0`. When a book is returned, the next student in queue is automatically notified.
- **Architectural Hook**: Create `reservation_queue` collection with Firestore trigger listener in `transactionService.js`.

---

### 4. AI Book Recommendation & Smart Search
- **Description**: Vector embeddings or Google Gemini API integration for semantic natural language book discovery.
- **Architectural Hook**: Query embedding pipeline integrated into `SearchInput.jsx` and `dashboardService.js`.

---

### 5. Hardware RFID & NFC Integration
- **Description**: Contactless RFID/NFC card reader support for instant student ID check-in and automated anti-theft gate scanning.
- **Architectural Hook**: WebUSB / WebBluetooth integration inside `ScanCenter.jsx`.

---

### 6. Automated Push & SMS Notifications
- **Description**: Automated SMS (Twilio) or Push Notifications (FCM) triggered 1 day before due date.
- **Architectural Hook**: Scheduled Firebase Cloud Function checking `transactions` where `dueDate == tomorrow`.
