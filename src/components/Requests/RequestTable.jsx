import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Button from '../Button';
import RequestStatusBadge from './RequestStatusBadge';
import EmptyState from '../EmptyState';
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
        title="No pending borrow requests."
        description="Incoming book request documents submitted from mobile app users will appear here in real time."
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
              const isPending = (req.status || 'Pending').toLowerCase() === 'pending';

              return (
                <tr key={req.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.studentName || req.requestedBy || 'Student'} size="sm" />
                      <div>
                        <p className="font-semibold text-white">{req.studentName || req.requestedBy || 'Student'}</p>
                        <p className="text-[10px] text-[#A1A1AA]">ID: {req.studentId || req.registerNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {req.department || 'General'}
                  </td>
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
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                    {req.isbn || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {formatDate(req.requestDate || req.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <RequestStatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiEye}
                        onClick={() => onInspect(req)}
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
                              onInspect(req);
                              onReject(req);
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
                              onInspect(req);
                              onApprove(req);
                            }}
                            className="text-[11px] px-2.5 py-1"
                          >
                            Approve
                          </Button>
                        </>
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
