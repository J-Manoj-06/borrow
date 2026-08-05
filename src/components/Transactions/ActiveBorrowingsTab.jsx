import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Badge from '../Badge';
import Button from '../Button';
import EmptyState from '../EmptyState';
import { FiBook, FiRepeat, FiClock, FiCalendar } from 'react-icons/fi';

export const ActiveBorrowingsTab = ({
  activeTransactions = [],
  loading,
  onReturnBook,
  onExtendDueDate,
  isReturning,
}) => {
  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  const calculateDaysRemaining = (dueDate) => {
    if (!dueDate) return { text: 'N/A', isOverdue: false };
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} Days Overdue`, isOverdue: true };
    }
    return { text: `${diffDays} Days Left`, isOverdue: false };
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#A1A1AA] text-xs bg-[#111111] rounded-2xl border border-[#2A2A2A]">
        Loading active borrowing transactions...
      </div>
    );
  }

  if (activeTransactions.length === 0) {
    return (
      <EmptyState
        icon={FiRepeat}
        title="No active book borrowings."
        description="Issued books currently in possession of students will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#111111] border border-[#2A2A2A] rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Active Issued Books ({activeTransactions.length})
          </h3>
          <p className="text-[11px] text-[#A1A1AA]">
            Process book check-ins to return books back to library inventory stock.
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
                <th className="py-3.5 px-4">Issued Book</th>
                <th className="py-3.5 px-4 font-mono">ISBN</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Days Remaining</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {activeTransactions.map((t) => {
                const daysInfo = calculateDaysRemaining(t.dueDate);

                return (
                  <tr key={t.id} className="hover:bg-[#1E1E1E]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={t.studentName || 'Student'} size="sm" />
                        <div>
                          <p className="font-semibold text-white">{t.studentName || 'Student'}</p>
                          <p className="text-[10px] text-[#A1A1AA]">ID: {t.studentRollNo || t.studentId || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {t.department || 'General'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="w-8 h-11 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                          {t.bookCover ? (
                            <img src={t.bookCover} alt={t.bookTitle} className="w-full h-full object-cover" />
                          ) : (
                            <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                          )}
                        </div>
                        <span className="font-semibold text-white truncate" title={t.bookTitle}>
                          {t.bookTitle || 'Untitled Book'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                      {t.isbn || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {formatDate(t.issueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {formatDate(t.dueDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={daysInfo.isOverdue ? 'danger' : 'warning'}>
                        {daysInfo.text}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FiCalendar}
                          onClick={() => onExtendDueDate(t)}
                          className="px-2.5 py-1 text-[11px]"
                        >
                          Extend
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={FiRepeat}
                          loading={isReturning}
                          onClick={() => onReturnBook(t)}
                          className="px-2.5 py-1 text-[11px]"
                        >
                          Return Book
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {activeTransactions.map((t) => {
          const daysInfo = calculateDaysRemaining(t.dueDate);
          return (
            <Card key={t.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={t.studentName || 'Student'} size="sm" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{t.studentName || 'Student'}</h4>
                    <p className="text-[10px] text-[#A1A1AA]">ID: {t.studentRollNo || 'N/A'}</p>
                  </div>
                </div>
                <Badge variant={daysInfo.isOverdue ? 'danger' : 'warning'}>{daysInfo.text}</Badge>
              </div>

              <div className="p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] flex items-center gap-3">
                <div className="w-9 h-12 rounded bg-[#171717] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                  {t.bookCover ? (
                    <img src={t.bookCover} alt={t.bookTitle} className="w-full h-full object-cover" />
                  ) : (
                    <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-white text-xs truncate">{t.bookTitle}</p>
                  <p className="text-[10px] text-[#A1A1AA]">Due: {formatDate(t.dueDate)}</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#2A2A2A]">
                <Button variant="secondary" size="sm" icon={FiCalendar} onClick={() => onExtendDueDate(t)}>
                  Extend
                </Button>
                <Button variant="primary" size="sm" icon={FiRepeat} loading={isReturning} onClick={() => onReturnBook(t)}>
                  Return Book
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveBorrowingsTab;
