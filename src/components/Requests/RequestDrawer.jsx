import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import RequestStatusBadge from './RequestStatusBadge';
import { 
  FiX, 
  FiUser, 
  FiBook, 
  FiCheck, 
  FiCalendar, 
  FiMessageSquare, 
  FiCheckCircle,
  FiXCircle,
  FiInfo
} from 'react-icons/fi';

export const RequestDrawer = ({
  isOpen,
  onClose,
  request,
  bookAvailability,
  isCheckingBook,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const st = (request.status || 'Pending').toLowerCase();
  const isPending = st === 'pending';
  const isApproved = st === 'approved';
  const isRejected = st === 'rejected';

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-[#111111] border-l border-[#2A2A2A] h-full flex flex-col justify-between text-white text-xs"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A]">
              <div>
                <h3 className="text-sm font-bold text-white">Borrow Request Details</h3>
                <p className="text-[10px] text-[#A1A1AA]">ID: {request.id}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Student Information Card */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-3">
                <h4 className="text-[10px] uppercase font-semibold text-[#A1A1AA] tracking-wider flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5 text-white" /> Student Information
                </h4>
                <div className="flex items-center gap-3 pt-1">
                  <Avatar name={request.studentName || request.requestedBy || 'Student'} size="md" />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {request.studentName || request.requestedBy || 'Student'}
                    </h4>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Reg / Roll ID: {request.studentId || request.registerNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#2A2A2A]">
                  <div>
                    <span className="text-[#A1A1AA] block">Department</span>
                    <span className="font-medium text-white">{request.department || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Email</span>
                    <span className="font-medium text-white truncate block">{request.studentEmail || request.email || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Book Information Card */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-4">
                <h4 className="text-[10px] uppercase font-semibold text-[#A1A1AA] tracking-wider flex items-center gap-1.5">
                  <FiBook className="w-3.5 h-3.5 text-white" /> Book Information
                </h4>
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-xl bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                    {request.bookCover ? (
                      <img src={request.bookCover} alt={request.bookTitle} className="w-full h-full object-cover" />
                    ) : (
                      <FiBook className="w-6 h-6 text-[#A1A1AA]" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <h4 className="font-bold text-white text-sm line-clamp-2" title={request.bookTitle}>
                      {request.bookTitle || 'Untitled Book'}
                    </h4>
                    <p className="text-[11px] text-[#A1A1AA]">ISBN: {request.isbn || 'N/A'}</p>
                    {request.category && <Badge variant="neutral">{request.category}</Badge>}
                  </div>
                </div>

                {/* Stock Availability */}
                <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold">Catalog Stock:</span>
                  {isCheckingBook ? (
                    <span className="text-[#A1A1AA]">Checking...</span>
                  ) : bookAvailability ? (
                    <span className="font-mono text-white font-bold">
                      {bookAvailability.availableCopies} / {bookAvailability.totalCopies} Copies
                    </span>
                  ) : (
                    <Badge variant="neutral">Verified</Badge>
                  )}
                </div>
              </div>

              {/* Request Details & Metadata Card */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-white" /> Request Date:
                  </span>
                  <span className="font-mono text-white">{formatDate(request.requestDate || request.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5">
                    <FiInfo className="w-4 h-4 text-white" /> Status:
                  </span>
                  <RequestStatusBadge status={request.status} />
                </div>

                {/* Approval Details if Approved */}
                {isApproved && (
                  <div className="p-3.5 rounded-xl bg-green-950/40 border border-green-800/40 text-green-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-green-100">
                      <FiCheckCircle className="w-4 h-4 text-[#22C55E]" /> Request Approved
                    </div>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Approved By: <span className="text-white font-medium">{request.approvedBy || 'Librarian'}</span>
                    </p>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Approved Date: <span className="text-white font-medium">{formatDate(request.approvedAt)}</span>
                    </p>
                    <p className="text-[10px] text-green-300 mt-1 italic">
                      This request is ready for physical book issue under Transactions → Pending Issue.
                    </p>
                  </div>
                )}

                {/* Rejection Details if Rejected */}
                {isRejected && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-red-100">
                      <FiXCircle className="w-4 h-4 text-[#EF4444]" /> Request Rejected
                    </div>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Reason: <span className="text-white font-semibold">{request.rejectionReason || request.rejectReason || 'Declined'}</span>
                    </p>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Rejected By: <span className="text-white font-medium">{request.rejectedBy || 'Librarian'}</span>
                    </p>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Rejected Date: <span className="text-white font-medium">{formatDate(request.rejectedAt)}</span>
                    </p>
                  </div>
                )}

                {request.requestMessage && (
                  <div>
                    <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5 mb-1">
                      <FiMessageSquare className="w-4 h-4 text-white" /> Student Note:
                    </span>
                    <p className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-neutral-300">
                      {request.requestMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-[#2A2A2A] bg-[#0E0E0E] flex items-center justify-between gap-3">
              <Button variant="secondary" size="md" onClick={onClose}>
                Close
              </Button>

              {isPending && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="md"
                    icon={FiX}
                    onClick={onReject}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    icon={FiCheck}
                    onClick={onApprove}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RequestDrawer;
