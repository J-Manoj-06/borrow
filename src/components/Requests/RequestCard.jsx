import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Button from '../Button';
import Badge from '../Badge';
import RequestStatusBadge from './RequestStatusBadge';
import { isPendingRequest, isApprovedRequest, isRejectedRequest } from '../../utils/requestHelpers';
import { FiBook, FiCheck, FiX, FiEye } from 'react-icons/fi';

export const RequestCard = ({
  request,
  onInspect,
  onApprove,
  onReject,
}) => {
  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  const isPending = isPendingRequest(request.status);
  const isApproved = isApprovedRequest(request.status);
  const isRejected = isRejectedRequest(request.status);

  return (
    <Card hoverable className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={request.studentName || request.requestedBy || 'Student'} size="md" />
          <div>
            <h4 className="font-bold text-white text-xs">{request.studentName || request.requestedBy || 'Student'}</h4>
            <p className="text-[10px] text-[#A1A1AA]">ID: {request.studentId || request.registerNumber || 'N/A'}</p>
            <p className="text-[10px] text-[#A1A1AA]">{request.department || 'General'}</p>
          </div>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center gap-3">
        <div className="w-9 h-12 rounded bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
          {request.bookCover ? (
            <img src={request.bookCover} alt={request.bookTitle} className="w-full h-full object-cover" />
          ) : (
            <FiBook className="w-4 h-4 text-[#A1A1AA]" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-white text-xs truncate" title={request.bookTitle}>
            {request.bookTitle || 'Untitled Book'}
          </p>
          <p className="text-[10px] text-[#A1A1AA] font-mono">ISBN: {request.isbn || 'N/A'}</p>
          <p className="text-[10px] text-[#A1A1AA]">Requested: {formatDate(request.requestDate || request.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#2A2A2A]">
        {/* View Button */}
        <Button
          variant="secondary"
          size="sm"
          icon={FiEye}
          onClick={() => onInspect(request)}
          className="text-[11px] px-2.5 py-1"
        >
          View
        </Button>

        {/* Pending Actions */}
        {isPending && (
          <>
            <button
              type="button"
              onClick={() => onApprove(request)}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#22C55E] text-black hover:bg-green-400 active:scale-95 transition-all shadow-sm"
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
            <button
              type="button"
              onClick={() => onReject(request)}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EF4444] text-white hover:bg-red-600 active:scale-95 transition-all shadow-sm"
            >
              <FiX className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          </>
        )}

        {/* Approved Read-Only State */}
        {isApproved && (
          <div className="flex flex-col items-end shrink-0">
            <Badge variant="success" size="sm">Approved</Badge>
            <span className="text-[9px] text-[#A1A1AA] mt-0.5 font-medium">Waiting for Issue</span>
          </div>
        )}

        {/* Rejected Read-Only State */}
        {isRejected && (
          <div className="flex flex-col items-end shrink-0 max-w-[140px]">
            <Badge variant="danger" size="sm">Rejected</Badge>
            <span className="text-[9px] text-[#EF4444] mt-0.5 truncate font-medium" title={request.rejectionReason}>
              {request.rejectionReason || request.rejectReason || 'Declined'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestCard;
