import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import EmptyState from '../EmptyState';
import { FiBook, FiCheckCircle, FiClock, FiUser } from 'react-icons/fi';

export const PendingIssueTab = ({
  pendingRequests = [],
  loading,
  onIssueBook,
  isIssuing,
}) => {
  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#A1A1AA] text-xs bg-[#111111] rounded-2xl border border-[#2A2A2A]">
        Loading approved borrow requests for issue...
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <EmptyState
        icon={FiClock}
        title="No requests pending issue."
        description="Borrow requests approved by librarians will automatically appear here awaiting physical book handover."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Approved Requests Pending Physical Issue ({pendingRequests.length})
          </h3>
          <p className="text-[11px] text-[#A1A1AA]">
            Click "Issue Book" when handing over the book to the student to update stock and start borrowing period.
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <Card className="p-0 overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Requested Book</th>
                <th className="py-3.5 px-4 font-mono">ISBN</th>
                <th className="py-3.5 px-4">Approved By</th>
                <th className="py-3.5 px-4">Approved Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {pendingRequests.map((req) => (
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
                    {req.approvedBy || 'Librarian'}
                  </td>
                  <td className="py-3.5 px-4 text-[#A1A1AA]">
                    {formatDate(req.approvedAt || req.updatedAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={FiCheckCircle}
                      loading={isIssuing}
                      onClick={() => onIssueBook(req)}
                      className="px-3 py-1 text-[11px]"
                    >
                      Issue Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {pendingRequests.map((req) => (
          <Card key={req.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={req.studentName || 'Student'} size="sm" />
                <div>
                  <h4 className="font-bold text-white text-xs">{req.studentName || 'Student'}</h4>
                  <p className="text-[10px] text-[#A1A1AA]">ID: {req.studentId || 'N/A'}</p>
                </div>
              </div>
              <Badge variant="success">Approved</Badge>
            </div>

            <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center gap-3">
              <div className="w-9 h-12 rounded bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                {req.bookCover ? (
                  <img src={req.bookCover} alt={req.bookTitle} className="w-full h-full object-cover" />
                ) : (
                  <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                )}
              </div>
              <div>
                <p className="font-bold text-white text-xs truncate">{req.bookTitle}</p>
                <p className="text-[10px] text-[#A1A1AA]">Approved: {formatDate(req.approvedAt)}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-[#2A2A2A]">
              <Button
                variant="primary"
                size="sm"
                icon={FiCheckCircle}
                loading={isIssuing}
                onClick={() => onIssueBook(req)}
              >
                Issue Book
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingIssueTab;
