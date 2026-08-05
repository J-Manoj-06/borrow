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
  FiAlertTriangle, 
  FiCalendar, 
  FiMessageSquare, 
  FiCheckCircle 
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

  const isPending = (request.status || 'Pending').toLowerCase() === 'pending';
  const isOutOfStock = bookAvailability && bookAvailability.availableCopies <= 0;

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
              {/* Student Profile Card */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={request.studentName || request.requestedBy || 'Student'} size="md" />
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {request.studentName || request.requestedBy || 'Student'}
                    </h4>
                    <p className="text-[11px] text-[#A1A1AA]">
                      Reg / Roll: {request.studentId || request.registerNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#2A2A2A]">
                  <div>
                    <span className="text-[#A1A1AA] block">Department</span>
                    <span className="font-medium text-white">{request.department || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA] block">Semester</span>
                    <span className="font-medium text-white">{request.semester || 'General'}</span>
                  </div>
                </div>
              </div>

              {/* Requested Book Specification Card */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-4">
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

                {/* Real-time Availability Check */}
                <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold">Inventory Status:</span>
                  {isCheckingBook ? (
                    <span className="text-[#A1A1AA]">Checking availability...</span>
                  ) : bookAvailability ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-bold">
                        {bookAvailability.availableCopies} / {bookAvailability.totalCopies} Copies
                      </span>
                      {isOutOfStock ? (
                        <Badge variant="danger">Out of Stock</Badge>
                      ) : (
                        <Badge variant="success">Available</Badge>
                      )}
                    </div>
                  ) : (
                    <Badge variant="neutral">Verified</Badge>
                  )}
                </div>
              </div>

              {/* Request Metadata */}
              <div className="p-4 rounded-2xl bg-[#171717] border border-[#2A2A2A] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-white" /> Request Date:
                  </span>
                  <span className="font-mono text-white">{formatDate(request.requestDate || request.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5">
                    <FiCheckCircle className="w-4 h-4 text-white" /> Status:
                  </span>
                  <RequestStatusBadge status={request.status} />
                </div>

                {request.rejectionReason && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200">
                    <span className="font-bold block mb-0.5">Rejection Reason:</span>
                    <p>{request.rejectionReason}</p>
                  </div>
                )}

                {request.requestMessage && (
                  <div>
                    <span className="text-[#A1A1AA] font-semibold flex items-center gap-1.5 mb-1">
                      <FiMessageSquare className="w-4 h-4 text-white" /> Request Note:
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
                    disabled={isOutOfStock}
                    title={isOutOfStock ? 'Book is currently out of stock' : 'Approve Request'}
                    onClick={onApprove}
                  >
                    Approve Request
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
