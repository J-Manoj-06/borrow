import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Button from '../Button';
import Badge from '../Badge';
import RequestStatusBadge from './RequestStatusBadge';
import EmptyState from '../EmptyState';
import { isPendingRequest, isApprovedRequest, isRejectedRequest } from '../../utils/requestHelpers';
import { FiBook, FiCheck, FiX, FiEye, FiClock } from 'react-icons/fi';

export const RequestTable = ({
  requests = [],
  onInspect,
  onApprove,
  onReject,
}) => {
  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={FiClock}
        title="No borrow requests found."
        description="Book borrowing request documents submitted from mobile app users will appear here in real time."
      />
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
            <tr>
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Book Title</th>
              <th className="py-3.5 px-4 font-mono">ISBN</th>
              <th className="py-3.5 px-4">Request Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {requests.map((req) => {
              const isPending = isPendingRequest(req.status);
              const isApproved = isApprovedRequest(req.status);
              const isRejected = isRejectedRequest(req.status);

              return (
                <tr key={req.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                  {/* Student Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.studentName || req.requestedBy || 'Student'} size="sm" />
                      <div>
                        <p className="font-semibold text-white">{req.studentName || req.requestedBy || 'Student'}</p>
                        <p className="text-[10px] text-[#A1A1AA]">ID: {req.studentId || req.registerNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {req.department || 'General'}
                  </td>

                  {/* Book Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 max-w-[220px]">
                      <div className="w-8 h-11 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                        {req.bookCover ? (
                          <img src={req.bookCover} alt={req.bookTitle} className="w-full h-full object-cover" />
                        ) : (
                          <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                        )}
                      </div>
                      <span className="font-semibold text-white truncate" title={req.bookTitle}>
                        {req.bookTitle || 'Untitled Book'}
                      </span>
                    </div>
                  </td>

                  {/* ISBN */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                    {req.isbn || 'N/A'}
                  </td>

                  {/* Request Date */}
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {formatDate(req.requestDate || req.createdAt)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <RequestStatusBadge status={req.status} />
                  </td>

                  {/* Actions Column */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiEye}
                        onClick={() => onInspect(req)}
                        className="text-[11px] px-2.5 py-1"
                      >
                        View
                      </Button>

                      {/* Pending Actions: Approve (Green) & Reject (Red) */}
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(req)}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#22C55E] text-black hover:bg-green-400 active:scale-95 transition-all shadow-sm"
                          >
                            <FiCheck className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(req)}
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
                        <div className="flex flex-col items-end shrink-0 max-w-[130px]">
                          <Badge variant="danger" size="sm">Rejected</Badge>
                          <span className="text-[9px] text-[#EF4444] mt-0.5 truncate font-medium" title={req.rejectionReason}>
                            {req.rejectionReason || req.rejectReason || 'Declined'}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RequestTable;
