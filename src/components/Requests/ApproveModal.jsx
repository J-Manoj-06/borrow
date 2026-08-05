import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiCheckCircle, FiInfo } from 'react-icons/fi';

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
      title="Confirm Borrow Request Approval"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <div className="p-4 rounded-xl bg-[#111111] border border-[#2A2A2A] space-y-2">
          <p className="font-semibold text-white">
            Approve request for <span className="text-[#22C55E]">"{request.bookTitle}"</span>?
          </p>
          <p className="text-[#A1A1AA]">
            Requested by: <span className="text-white font-medium">{request.studentName || request.requestedBy}</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#171717] border border-[#2A2A2A] text-[#A1A1AA] flex items-start gap-2.5">
          <FiInfo className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            Approving sets status to <code className="text-white">Approved</code>. The librarian can dispense the physical book later in the Transactions module.
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
            Confirm Approval
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApproveModal;
