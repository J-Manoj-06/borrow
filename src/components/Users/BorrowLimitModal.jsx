import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';

export const BorrowLimitModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isUpdating,
}) => {
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    if (user) {
      setLimit(user.borrowLimit || 5);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user.id, Number(limit));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modify Maximum Borrowing Limit"
      subtitle={`Student: ${user.name || user.email}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-white">
        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A]">
          <p className="font-semibold text-white">{user.name || 'Member'}</p>
          <p className="text-[#A1A1AA] mt-0.5">
            Current Active Borrowed Books: <span className="text-white font-medium">{user.activeBorrowCount || 0}</span>
          </p>
        </div>

        <Input
          label="Maximum Borrow Limit (Books) *"
          type="number"
          min="1"
          max="20"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />

        <p className="text-[11px] text-[#A1A1AA]">
          Modifying the limit updates the maximum number of simultaneous book loans permitted for this student.
        </p>

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isUpdating}
          >
            Update Limit
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BorrowLimitModal;
