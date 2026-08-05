import React, { useState } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';

export const ExtendDueDateModal = ({
  isOpen,
  onClose,
  transaction,
  onConfirm,
  isExtending,
}) => {
  const defaultNewDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [newDueDate, setNewDueDate] = useState(defaultNewDate);
  const [reason, setReason] = useState('');

  if (!transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(newDueDate, reason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extend Loan Due Date"
      subtitle={`Book: ${transaction.bookTitle || 'Title'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <p className="font-semibold text-white">{transaction.bookTitle || 'Book Title'}</p>
          <p className="text-[#A1A1AA] mt-0.5">Current Due Date: <span className="text-white font-medium">{transaction.dueDate ? (transaction.dueDate.toDate ? transaction.dueDate.toDate().toLocaleDateString() : new Date(transaction.dueDate).toLocaleDateString()) : 'N/A'}</span></p>
        </div>

        <Input
          label="New Due Date *"
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          required
        />

        <Input
          label="Extension Reason (Optional)"
          placeholder="e.g. Academic project extension approved by faculty..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isExtending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isExtending}
          >
            Extend Due Date
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExtendDueDateModal;
