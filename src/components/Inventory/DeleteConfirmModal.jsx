import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiAlertTriangle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const DeleteConfirmModal = ({ isOpen, onClose, book }) => {
  if (!book) return null;

  const handleConfirmDelete = () => {
    toast.error(`Deleted "${book.title}" from library inventory (UI simulation).`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Delete Action"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200">
          <FiAlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Are you sure you want to delete this book?</p>
            <p className="mt-1 text-xs text-red-300/80">
              You are about to remove <span className="font-bold text-white">"{book.title}"</span> (ISBN: {book.isbn || 'N/A'}).
            </p>
          </div>
        </div>

        <p className="text-[#A1A1AA]">
          This action will simulate removing the catalog entry from Firestore in accordance with Phase 3 UI guidelines.
        </p>

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
