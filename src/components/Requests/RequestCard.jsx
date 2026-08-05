import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Button from '../Button';
import RequestStatusBadge from './RequestStatusBadge';
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

  const isPending = (request.status || 'Pending').toLowerCase() === 'pending';

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
        <Button
          variant="secondary"
          size="sm"
          icon={FiEye}
          onClick={() => onInspect(request)}
          className="text-[11px] px-2.5 py-1"
        >
          Inspect
        </Button>
        {isPending && (
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={FiX}
              onClick={() => {
                onInspect(request);
                onReject(request);
              }}
              className="text-[11px] px-2.5 py-1 text-[#EF4444] hover:bg-red-950/40"
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={FiCheck}
              onClick={() => {
                onInspect(request);
                onApprove(request);
              }}
              className="text-[11px] px-2.5 py-1"
            >
              Approve
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default RequestCard;
