import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiXCircle } from 'react-icons/fi';

const rejectReasons = [
  'Out of Stock',
  'Book Reserved',
  'Damaged',
  'Invalid Request',
  'Maximum Borrow Limit',
  'Other',
];

export const RejectModal = ({
  isOpen,
  onClose,
  request,
  rejectReason,
  setRejectReason,
  isProcessing,
  onConfirm,
}) => {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Borrow Request Rejection"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 space-y-1">
          <p className="font-bold text-sm text-red-100">Reject request for "{request.bookTitle}"?</p>
          <p className="text-xs text-red-300">
            Student: {request.studentName || request.requestedBy}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white mb-2 uppercase tracking-wide">
            Select Rejection Reason <span className="text-[#EF4444]">*</span>
          </label>
          <div className="space-y-2">
            {rejectReasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
                  rejectReason === reason
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-[#171717] text-white border-[#2A2A2A] hover:bg-[#1E1E1E]'
                }`}
              >
                <input
                  type="radio"
                  name="rejectReason"
                  value={reason}
                  checked={rejectReason === reason}
                  onChange={() => setRejectReason(reason)}
                  className="hidden"
                />
                <span className="text-xs">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={FiXCircle}
            loading={isProcessing}
            onClick={onConfirm}
          >
            Reject Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
