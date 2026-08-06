import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import { FiXCircle } from 'react-icons/fi';

const rejectReasons = [
  'Book Currently Unavailable',
  'Maximum Borrow Limit Reached',
  'Book Reserved',
  'Damaged Book',
  'Invalid Request',
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
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCustomReason('');
    }
  }, [isOpen]);

  if (!request) return null;

  const handleFormSubmit = () => {
    const finalReason = rejectReason === 'Other' ? (customReason.trim() || 'Other Reason') : rejectReason;
    onConfirm(finalReason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Borrow Request"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <p className="text-sm font-medium text-white">
          Are you sure you want to reject this request?
        </p>

        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 space-y-1">
          <p className="font-bold text-xs text-red-100">Request: "{request.bookTitle || 'Book'}"</p>
          <p className="text-[11px] text-red-300">
            Student: {request.studentName || request.requestedBy || 'Student'}
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

        {/* Text box if "Other" is selected */}
        {rejectReason === 'Other' && (
          <div className="pt-2">
            <Input
              label="Custom Rejection Reason"
              placeholder="Enter specific rejection details..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              required
            />
          </div>
        )}

        <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-2">
          <Button variant="secondary" size="sm" disabled={isProcessing} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={FiXCircle}
            loading={isProcessing}
            disabled={isProcessing}
            onClick={handleFormSubmit}
          >
            Reject Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectModal;
