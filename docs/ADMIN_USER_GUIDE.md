# 📖 Borrow Admin Dashboard — Librarian User Manual

> Complete operational guide for librarians managing physical book inventory, student borrow requests, circulation transactions, student accounts, analytics, system settings, and barcode label printing.

---

## 📋 Module Operating Guides

### 1. Dashboard Overview (`/dashboard`)
- View total books, active requests, active loans, and overdue alerts at a glance.
- Monitor 30-day borrowing trends via the Recharts line chart.
- Inspect the real-time activity timeline and popular books grid.

### 2. Book Inventory (`/inventory`)
- Toggle between **Grid View** and **List View** with view mode persistence.
- Filter catalog items by status, department, category, and language.
- Search books instantly by Title, Author, ISBN, or Barcode value.

### 3. Adding New Books (`/inventory/add`)
- Complete the 4-step wizard:
  1. **Basic Info**: Title, Author, ISBN, Category, Language, Description.
  2. **Library Details**: Copies count, Department, Floor, Rack, Shelf, Section.
  3. **Cover Image**: Upload to Cloudinary with live preview.
  4. **Review & Publish**: Automatic duplicate ISBN detection before writing to Firestore.

### 4. Borrow Requests (`/requests`)
- Review incoming book borrow requests from Flutter mobile app users.
- Click **Approve**: Auto-validates available copies > 0 and student limit <= 3, decrements copies, creates active transaction, and sends mobile notification.
- Click **Reject**: Select reason (`Book unavailable`, `Damaged`, `Reference Only`, `Max Limit Reached`, `Other`) to send decline notification.

### 5. Book Transactions & Circulation (`/transactions`)
- **Issue Book**: Manual or request-based issue with custom due date.
- **Return Book**: Process book check-in with physical condition recording (`Excellent`, `Good`, `Fair`, `Damaged`, `Lost`).
- **Extend Due Date**: Update due date with librarian extension reason.
- **Overdue Highlight**: Automatically highlights overdue loans in red.

### 6. Student & User Management (`/users`)
- Inspect student profile drawer with overview, active books, and complete loan history.
- Change Account Status (**Approve**, **Suspend**, **Reactivate**).
- Modify Maximum Borrow Limit (default 5 books).
- Edit student contact specifications.

### 7. Reports & Analytics (`/reports`)
- Select Time Horizon (`Today`, `This Week`, `This Month`, `Last Month`, `Last 6 Months`, `This Year`, `All Time`).
- View 5 Recharts visualizations (Borrow Trend, Books Added, Department Usage, Category Distribution, Weekly Activity).
- Inspect Top 10 Popular Books, Overdue Report Table, and Inventory Health.

### 8. Barcode & QR Code Management (`/barcode`)
- View auto-generated Code128 barcodes & QR codes.
- Select single or bulk books to print high-resolution labels (`Small`, `Medium`, `Large` sizes).
- Use **Fast Issue** (Scan Student -> Scan Book -> Issue) and **Fast Return** (Scan Book -> Auto Return).
- Locate physical books via Floor, Rack, Shelf, and Section finder.

### 9. System Settings (`/settings`)
- Configure Library Info, Borrowing Rules, Taxonomy (Categories, Departments, Semesters), Notification Preferences, Profile Security, and Appearance.
