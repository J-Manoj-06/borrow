import React from 'react';
import Card, { CardTitle, CardDescription } from '../Card';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import Avatar from '../Avatar';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

export const BorrowHistoryTable = ({ transactions = [] }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A] mb-4">
        <div>
          <CardTitle className="text-base">Recent Borrow History</CardTitle>
          <CardDescription>Latest 10 loan records for this book</CardDescription>
        </div>
        <Badge variant="neutral">{transactions.length} Records</Badge>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No circulation history"
          description="There are no past or active loan transactions recorded for this book."
          className="border-0 bg-transparent p-4"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-2">Student</th>
                <th className="pb-3 px-2">Borrow Date</th>
                <th className="pb-3 px-2">Return / Due Date</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {transactions.slice(0, 10).map((t, idx) => {
                const borrowDate = t.borrowDate
                  ? (t.borrowDate.toDate ? t.borrowDate.toDate().toLocaleDateString() : new Date(t.borrowDate).toLocaleDateString())
                  : 'N/A';

                const returnDate = t.returnDate
                  ? (t.returnDate.toDate ? t.returnDate.toDate().toLocaleDateString() : new Date(t.returnDate).toLocaleDateString())
                  : (t.dueDate ? (t.dueDate.toDate ? t.dueDate.toDate().toLocaleDateString() : new Date(t.dueDate).toLocaleDateString()) : 'Pending');

                return (
                  <tr key={t.id || idx} className="hover:bg-[#1E1E1E]/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Avatar name={t.studentName || 'Student'} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{t.studentName || 'Library Member'}</p>
                          <p className="text-[10px] text-[#A1A1AA]">{t.studentEmail || t.studentId || 'member@borrow.app'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-white font-medium">{borrowDate}</td>
                    <td className="py-3 px-2 text-[#A1A1AA]">{returnDate}</td>
                    <td className="py-3 px-2 text-right">
                      <Badge
                        variant={
                          t.status === 'returned'
                            ? 'success'
                            : t.status === 'overdue'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {t.status || 'Active'}
                      </Badge>
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

export default BorrowHistoryTable;
