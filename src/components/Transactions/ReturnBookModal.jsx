import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { FiRotateCcw } from 'react-icons/fi';

export const ReturnBookModal = ({
  isOpen,
  onClose,
  transaction,
  onConfirm,
  isReturning,
}) => {
  const defaultReturnDate = new Date().toISOString().split('T')[0];

  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [condition, setCondition] = useState('excellent');
  const [remarks, setRemarks] = useState('');

  if (!transaction) return null;

  const conditions = [
    { value: 'excellent', label: 'Excellent (Intact)' },
    { value: 'good', label: 'Good (Minor wear)' },
    { value: 'fair', label: 'Fair (Usable condition)' },
    { value: 'damaged', label: 'Damaged (Needs repair)' },
    { value: 'lost', label: 'Lost (Not returned)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      returnDate,
      condition,
      remarks,
      bookId: transaction.bookId,
      bookTitle: transaction.bookTitle,
      studentId: transaction.studentId,
      studentEmail: transaction.studentEmail,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Book Check-in / Return"
      subtitle={`Book: ${transaction.bookTitle || 'Title'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] space-y-1">
          <p className="font-semibold text-white">{transaction.bookTitle || 'Book Title'}</p>
          <p className="text-[#A1A1AA]">Issued to <span className="text-white">{transaction.studentName || 'Student'}</span></p>
        </div>

        <Input
          label="Return Date *"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#A1A1AA]">Book Physical Condition *</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {conditions.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#171717]">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Check-in Remarks (Optional)"
          placeholder="e.g. Spine intact, no missing pages..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isReturning}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={FiRotateCcw}
            loading={isReturning}
          >
            Confirm Return
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReturnBookModal;
