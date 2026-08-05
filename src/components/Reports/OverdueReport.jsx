import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Avatar from '../Avatar';
import { FiAlertTriangle } from 'react-icons/fi';

export const OverdueReport = ({ overdueReport = [] }) => {
  const formatDate = (val) => {
    if (!val) return 'N/A';
    if (val.toDate) return val.toDate().toLocaleDateString();
    return new Date(val).toLocaleDateString();
  };

  return (
    <Card className="p-0 overflow-hidden mb-6 border-[#EF4444]/40">
      <div className="p-4 bg-red-950/40 border-b border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiAlertTriangle className="w-5 h-5 text-[#EF4444]" />
          <div>
            <h3 className="text-sm font-bold text-white">Overdue Loans Audit</h3>
            <p className="text-xs text-red-200/80">Active loans that have exceeded expected return date</p>
          </div>
        </div>
        <Badge variant="danger">{overdueReport.length} Overdue Loans</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] border-b border-[#2A2A2A] text-[#A1A1AA] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Book Title</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Days Overdue</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {overdueReport.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-[#A1A1AA] text-xs">
                  No Records Found
                </td>
              </tr>
            ) : (
              overdueReport.map((t) => (
                <tr key={t.id} className="bg-red-950/20 hover:bg-red-950/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={t.studentName || 'Student'} size="sm" />
                      <div>
                        <p className="font-semibold text-white">{t.studentName || 'Student'}</p>
                        <p className="text-[10px] text-[#A1A1AA]">{t.studentRollNo || 'REG-N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{t.bookTitle || 'Book Title'}</td>
                  <td className="py-3 px-4 text-[#A1A1AA]">{formatDate(t.issueDate)}</td>
                  <td className="py-3 px-4 text-[#EF4444] font-bold">{formatDate(t.dueDate)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-200 font-bold border border-red-800">
                      +{t.daysOverdue || 1} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A1A1AA]">{t.department || 'Computer Science'}</td>
                  <td className="py-3 px-4">
                    <Badge variant="danger">Overdue</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default OverdueReport;
