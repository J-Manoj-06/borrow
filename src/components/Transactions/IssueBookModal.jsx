import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { FiBookOpen, FiUser, FiCalendar } from 'react-icons/fi';

export const IssueBookModal = ({
  isOpen,
  onClose,
  onConfirm,
  isIssuing,
}) => {
  const defaultIssueDate = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [issueDate, setIssueDate] = useState(defaultIssueDate);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      studentName: studentName || 'Library Member',
      studentEmail: studentEmail || 'student@borrow.app',
      studentRollNo: studentRollNo || 'REG-2024',
      bookTitle: bookTitle || 'Catalog Item',
      isbn: isbn || 'N/A',
      issueDate,
      dueDate,
      notes,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Book Contract"
      subtitle="Dispensate library book to student member"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
        {/* Student Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Student Full Name *"
            placeholder="e.g. Alex Johnson"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
          <Input
            label="Student Roll / Reg Number *"
            placeholder="e.g. CS2024-042"
            value={studentRollNo}
            onChange={(e) => setStudentRollNo(e.target.value)}
            required
          />
        </div>

        <Input
          label="Student Email Address *"
          type="email"
          placeholder="student@borrow.app"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          required
        />

        {/* Book Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Book Title *"
            placeholder="e.g. Clean Code Architecture"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            required
          />
          <Input
            label="ISBN Number"
            placeholder="e.g. 9780132350884"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Issue Date *"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
          <Input
            label="Due Date *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <Input
          label="Librarian Notes (Optional)"
          placeholder="e.g. Reference copy dispensation approved for 14 days..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isIssuing}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isIssuing}
          >
            Issue Book
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IssueBookModal;
