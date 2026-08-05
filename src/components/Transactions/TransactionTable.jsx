import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import Avatar from '../Avatar';
import EmptyState from '../EmptyState';
import { FiBook, FiRotateCcw, FiCalendar, FiEye, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const TransactionTable = ({
  transactions = [],
  onSelectTransaction,
  onReturn,
  onExtend,
}) => {
  const getStatusBadge = (t) => {
    const st = t.displayStatus || t.status || 'issued';
    switch (st.toLowerCase()) {
      case 'returned':
        return <Badge variant="success">Returned</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      case 'lost':
        return <Badge variant="danger">Lost</Badge>;
      case 'damaged':
        return <Badge variant="danger">Damaged</Badge>;
      case 'extended':
        return <Badge variant="neutral">Extended</Badge>;
      case 'issued':
      default:
        return <Badge variant="warning">Issued</Badge>;
    }
  };

  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={FiBook}
        title="No transactions available."
        description="Book issue and return records will appear here automatically."
      />
    );
  }

  return (
    <div>
      {/* Desktop & Tablet Table */}
      <Card className="p-0 overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-4 font-mono">ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Book Title</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Return Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {transactions.map((t) => {
                const isOverdue = t.isOverdue;
                const isReturned = t.status === 'returned';

                return (
                  <tr
                    key={t.id}
                    className={cn(
                      'transition-colors',
                      isOverdue
                        ? 'bg-red-950/20 hover:bg-red-950/40 border-l-2 border-l-[#EF4444]'
                        : 'hover:bg-[#1E1E1E]/60'
                    )}
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">
                      {t.id?.substring(0, 8) || 'TXN'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div
                        onClick={() => onSelectTransaction(t)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <Avatar name={t.studentName || 'Student'} size="sm" />
                        <div>
                          <p className="font-semibold text-white group-hover:underline">
                            {t.studentName || 'Library Member'}
                          </p>
                          <p className="text-[10px] text-[#A1A1AA]">
                            {t.studentRollNo || t.rollNo || t.studentId || 'Reg: N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="w-7 h-9 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden flex items-center justify-center shrink-0">
                          {t.bookCover ? (
                            <img src={t.bookCover} alt={t.bookTitle} className="w-full h-full object-cover" />
                          ) : (
                            <FiBook className="w-3.5 h-3.5 text-[#A1A1AA]" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-white truncate" title={t.bookTitle}>
                            {t.bookTitle || 'Untitled Book'}
                          </p>
                          <p className="text-[10px] text-[#A1A1AA] font-mono">ISBN: {t.isbn || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{formatDate(t.issueDate)}</td>
                    <td
                      className={cn(
                        'py-3.5 px-4 font-medium',
                        isOverdue ? 'text-[#EF4444] font-bold' : 'text-white'
                      )}
                    >
                      {formatDate(t.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">{formatDate(t.returnDate)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(t)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FiEye}
                          onClick={() => onSelectTransaction(t)}
                          className="px-2 py-1 text-[11px]"
                        >
                          Inspect
                        </Button>
                        {!isReturned && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={FiCalendar}
                              onClick={() => onExtend(t)}
                              className="px-2 py-1 text-[11px]"
                            >
                              Extend
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              icon={FiRotateCcw}
                              onClick={() => onReturn(t)}
                              className="px-2 py-1 text-[11px]"
                            >
                              Return
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

      {/* Mobile Responsive Cards View */}
      <div className="space-y-3 sm:hidden">
        {transactions.map((t) => {
          const isOverdue = t.isOverdue;
          const isReturned = t.status === 'returned';

          return (
            <Card
              key={t.id}
              className={cn(
                'p-4 space-y-3',
                isOverdue ? 'border-[#EF4444] bg-red-950/20' : 'border-[#2A2A2A]'
              )}
            >
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={t.studentName || 'Student'} size="sm" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{t.studentName || 'Student'}</h4>
                    <p className="text-[10px] text-[#A1A1AA] font-mono">TXN: {t.id?.substring(0, 8)}</p>
                  </div>
                </div>
                {getStatusBadge(t)}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-12 rounded bg-[#111111] border border-[#2A2A2A] overflow-hidden shrink-0 flex items-center justify-center">
                  {t.bookCover ? (
                    <img src={t.bookCover} alt={t.bookTitle} className="w-full h-full object-cover" />
                  ) : (
                    <FiBook className="w-4 h-4 text-[#A1A1AA]" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-xs text-white truncate">{t.bookTitle || 'Book Title'}</p>
                  <p className="text-[10px] text-[#A1A1AA] mt-0.5">Due: {formatDate(t.dueDate)}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between">
                <Button variant="secondary" size="sm" icon={FiEye} onClick={() => onSelectTransaction(t)}>
                  Inspect
                </Button>

                {!isReturned && (
                  <div className="flex items-center gap-1.5">
                    <Button variant="secondary" size="sm" icon={FiCalendar} onClick={() => onExtend(t)}>
                      Extend
                    </Button>
                    <Button variant="primary" size="sm" icon={FiRotateCcw} onClick={() => onReturn(t)}>
                      Return
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionTable;
