import React from 'react';
import Card, { CardTitle, CardDescription } from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import Avatar from '../Avatar';
import EmptyState from '../EmptyState';
import { FiInbox, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const RecentRequests = ({ requests = [] }) => {
  const displayRequests = requests.slice(0, 5);

  const handleApproveUI = (req) => {
    toast.success(`Request approved for ${req.studentName || 'Student'} (UI only)`);
  };

  const handleRejectUI = (req) => {
    toast.error(`Request rejected for ${req.studentName || 'Student'} (UI only)`);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] mb-4">
        <div>
          <CardTitle className="text-lg">Recent Borrow Requests</CardTitle>
          <CardDescription>Latest 5 membership & book requests</CardDescription>
        </div>
        <Badge variant="warning">{displayRequests.length} Pending</Badge>
      </div>

      {displayRequests.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="No pending requests"
          description="There are currently no active borrow requests in the queue."
          className="border-0 bg-transparent p-4"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-2">Student</th>
                <th className="pb-3 px-2">Book Title</th>
                <th className="pb-3 px-2">Request Date</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/60">
              {displayRequests.map((req, idx) => {
                const dateStr = req.createdAt
                  ? (req.createdAt.toDate ? req.createdAt.toDate().toLocaleDateString() : new Date(req.createdAt).toLocaleDateString())
                  : 'Today';

                return (
                  <tr key={req.id || idx} className="hover:bg-[#1E1E1E]/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={req.studentName || req.userEmail || 'Student'} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{req.studentName || 'Library Member'}</p>
                          <p className="text-[10px] text-[#A1A1AA]">{req.userEmail || req.studentId || 'member@borrow.app'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-white max-w-[180px] truncate">
                      {req.bookTitle || req.bookName || 'Design Systems Guidelines'}
                    </td>
                    <td className="py-3 px-2 text-[#A1A1AA]">{dateStr}</td>
                    <td className="py-3 px-2">
                      <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'danger' : 'warning'}>
                        {req.status || 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveUI(req)}
                          className="px-2 py-1 text-[11px]"
                        >
                          <FiCheck className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectUI(req)}
                          className="px-2 py-1 text-[11px]"
                        >
                          <FiX className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default RecentRequests;
