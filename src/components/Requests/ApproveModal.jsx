import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiCheckCircle } from 'react-icons/fi';

export const ApproveModal = ({
  isOpen,
  onClose,
  request,
  isProcessing,
  onConfirm,
}) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Borrow Request"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <p className="text-sm font-medium text-white">
          Are you sure you want to approve this borrow request?
        </p>

        <div className="p-3.5 rounded-xl bg-[#111111] border border-[#2A2A2A] space-y-1 text-xs">
          <p className="font-bold text-white">
            Book: <span className="text-[#22C55E] font-normal">{request.bookTitle || 'Untitled Book'}</span>
          </p>
          <p className="text-[#A1A1AA]">
            Student: <span className="text-white font-medium">{request.studentName || request.requestedBy || 'Student'}</span>
          </p>
        </div>

        <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FiCheckCircle}
            loading={isProcessing}
            onClick={onConfirm}
          >
            Approve
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveModal;
