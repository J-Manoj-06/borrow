import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import { 
  FiX, 
  FiUser, 
  FiBook, 
  FiCalendar, 
  FiClock, 
  FiRotateCcw, 
  FiCheckCircle, 
  FiLayers 
} from 'react-icons/fi';

export const TransactionDrawer = ({
  isOpen,
  onClose,
  transaction,
  onReturn,
  onExtend,
}) => {
  if (!transaction) return null;

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  const isReturned = transaction.status === 'returned';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full max-w-lg h-full bg-[#111111] border-l border-[#2A2A2A] text-white flex flex-col justify-between overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white">Transaction Details</h3>
                <p className="text-xs text-[#A1A1AA] font-mono mt-0.5">ID: {transaction.id}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[#A1A1AA] hover:text-white p-2 rounded-xl hover:bg-[#1E1E1E] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* Status Header Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171717] border border-[#2A2A2A]">
                <span className="text-[#A1A1AA]">Current Status:</span>
                <Badge variant={transaction.isOverdue ? 'danger' : isReturned ? 'success' : 'warning'}>
                  {transaction.isOverdue ? 'Overdue' : transaction.status || 'Issued'}
                </Badge>
              </div>

              {/* Student Information */}
              <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5 text-white" /> Student Information
                </h4>
                <div className="flex items-center gap-3">
                  <Avatar name={transaction.studentName || 'Student'} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{transaction.studentName || 'Library Member'}</h3>
                    <p className="text-xs text-[#A1A1AA]">
                      Reg No: <span className="text-white">{transaction.studentRollNo || 'N/A'}</span>
                    </p>
                    <p className="text-xs text-[#A1A1AA]">{transaction.studentEmail || 'member@borrow.app'}</p>
                  </div>
                </div>
              </div>

              {/* Book Information */}
              <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                  <FiBook className="w-3.5 h-3.5 text-white" /> Book Information
                </h4>
                <div className="flex gap-4">
                  <div className="w-16 h-22 rounded-xl bg-[#111111] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                    {transaction.bookCover ? (
                      <img src={transaction.bookCover} alt={transaction.bookTitle} className="w-full h-full object-cover" />
                    ) : (
                      <FiBook className="w-6 h-6 text-[#A1A1AA]" />
                    )}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="text-sm font-bold text-white truncate">{transaction.bookTitle || 'Untitled Book'}</h3>
                    <p className="text-xs text-[#A1A1AA]">ISBN: {transaction.isbn || 'N/A'}</p>
                    <p className="text-xs text-[#A1A1AA]">Dept: {transaction.department || 'General'}</p>
                  </div>
                </div>
              </div>

              {/* Issue & Return Timestamps */}
              <div className="bg-[#171717] border border-[#2A2A2A] rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5 text-white" /> Schedule & Condition Audit
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#A1A1AA] block">Issue Date</span>
                    <span className="font-semibold text-white">{formatDate(transaction.issueDate)}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Due Date</span>
                    <span className={transaction.isOverdue ? 'font-bold text-[#EF4444]' : 'font-semibold text-white'}>
                      {formatDate(transaction.dueDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Return Date</span>
                    <span className="font-semibold text-white">{formatDate(transaction.returnDate)}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Issued By</span>
                    <span className="font-semibold text-white truncate block">{transaction.issuedBy || 'Librarian'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2A2A2A]/60 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#A1A1AA] block">Condition Before</span>
                    <span className="font-medium text-white uppercase">{transaction.conditionBefore || 'Excellent'}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Condition After</span>
                    <span className="font-medium text-white uppercase">{transaction.conditionAfter || 'N/A'}</span>
                  </div>
                </div>

                {transaction.extensionReason && (
                  <div className="pt-2 border-t border-[#2A2A2A]/60 text-xs">
                    <span className="text-[#A1A1AA] block">Extension History:</span>
                    <p className="text-white mt-0.5 font-medium">
                      Extended {transaction.extendedCount || 1} time(s). Reason: {transaction.extensionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#2A2A2A] bg-[#0E0E0E] flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              {!isReturned && (
                <>
                  <Button
                    variant="secondary"
                    icon={FiCalendar}
                    onClick={() => {
                      onClose();
                      onExtend(transaction);
                    }}
                  >
                    Extend Due Date
                  </Button>
                  <Button
                    variant="primary"
                    icon={FiRotateCcw}
                    onClick={() => {
                      onClose();
                      onReturn(transaction);
                    }}
                  >
                    Return Book
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionDrawer;
