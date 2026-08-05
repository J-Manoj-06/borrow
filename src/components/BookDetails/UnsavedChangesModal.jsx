import React from 'react';
import Modal from '../Modal';
import Button from '../Button';
import { FiAlertTriangle } from 'react-icons/fi';

export const UnsavedChangesModal = ({
  isOpen,
  onClose,
  onSave,
  onDiscard,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unsaved Changes Detected"
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs text-white">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-200">
          <FiAlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">You have unsaved edits on this book.</p>
            <p className="mt-1 text-xs text-amber-300/80">
              Leaving edit mode without saving will discard your modified specification parameters.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onDiscard} className="w-full sm:w-auto">
            Discard Changes
          </Button>
          <Button variant="primary" size="sm" onClick={onSave} className="w-full sm:w-auto">
            Save & Exit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;
