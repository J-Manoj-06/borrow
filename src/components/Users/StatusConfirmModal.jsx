import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiAlertTriangle } from 'react-icons/fi';

export const StatusConfirmModal = ({
  isOpen,
  onClose,
  user,
  targetStatus,
  onConfirm,
  isUpdating,
}) => {
  if (!user) return null;

  const isSuspend = targetStatus === 'suspended';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm Account ${isSuspend ? 'Suspension' : 'Reactivation'}`}
      subtitle={`Student: ${user.name || user.email}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <div
          className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
            isSuspend
              ? 'bg-red-950/60 border-red-800/60 text-red-200'
              : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
          }`}
        >
          <FiAlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isSuspend ? 'text-[#EF4444]' : 'text-[#22C55E]'}`} />
          <div>
            <p className="font-semibold">
              {isSuspend ? `Suspend ${user.name}'s account?` : `Reactivate ${user.name}'s account?`}
            </p>
            <p className="text-[11px] mt-0.5 opacity-90">
              {isSuspend
                ? 'Suspending an account temporarily revokes borrowing privileges in the Borrow Flutter app.'
                : 'Reactivating restores full borrowing access and mobile app requests.'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            variant={isSuspend ? 'danger' : 'success'}
            size="sm"
            loading={isUpdating}
            onClick={onConfirm}
          >
            Confirm {isSuspend ? 'Suspension' : 'Reactivation'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusConfirmModal;
