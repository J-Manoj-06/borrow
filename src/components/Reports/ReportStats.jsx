import React from 'react';
import Card from '../Card';
import { 
  FiBook, 
  FiCheckCircle, 
  FiBookOpen, 
  FiUsers, 
  FiRepeat, 
  FiClock, 
  FiAlertTriangle, 
  FiPlusCircle, 
  FiRotateCcw,
  FiThumbsUp
} from 'react-icons/fi';

export const ReportStats = ({ stats = {} }) => {
  const cards = [
    { label: 'Total Books', value: stats.totalBooks || 0, sub: 'Active catalog copies', icon: FiBook, color: 'text-white' },
    { label: 'Available Books', value: stats.availableBooks || 0, sub: 'Ready for loan', icon: FiCheckCircle, color: 'text-[#22C55E]' },
    { label: 'Issued Books', value: stats.issuedBooks || 0, sub: 'Currently out on loan', icon: FiBookOpen, color: 'text-white' },
    { label: 'Total Users', value: stats.totalUsers || 0, sub: 'Registered members', icon: FiUsers, color: 'text-white' },
    { label: 'Total Transactions', value: stats.totalTransactions || 0, sub: 'Circulation events', icon: FiRepeat, color: 'text-white' },
    { label: 'Pending Requests', value: stats.pendingRequests || 0, sub: 'Awaiting librarian review', icon: FiClock, color: 'text-[#F59E0B]' },
    { label: 'Approved Requests', value: stats.approvedRequests || 0, sub: 'Approved for issue', icon: FiThumbsUp, color: 'text-[#22C55E]' },
    { label: 'Returned Today', value: stats.returnedToday || 0, sub: 'Daily check-ins', icon: FiRotateCcw, color: 'text-[#F59E0B]' },
    { label: 'Overdue Books', value: stats.overdueBooks || 0, sub: 'Past return due date', icon: FiAlertTriangle, color: 'text-[#EF4444]' },
    { label: 'Books Added', value: stats.booksAdded || 0, sub: 'Added in horizon', icon: FiPlusCircle, color: 'text-[#22C55E]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <Card key={idx} hoverable className="p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider truncate" title={c.label}>
                {c.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${c.color}`} />
            </div>
            <div className="mt-2.5">
              <h3 className="text-xl font-extrabold text-white tracking-tight">{c.value}</h3>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5 truncate">{c.sub}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportStats;
