import React from 'react';
import TransactionStats from './TransactionStats';
import TransactionTable from './TransactionTable';
import SearchInput from '../SearchInput';
import { TableSkeleton } from '../Skeleton';
import { cn } from '../../utils/cn';

export const HistoryTab = ({
  transactions = [],
  loading,
  stats,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  departmentFilter,
  setDepartmentFilter,
  sortBy,
  setSortBy,
  onSelectTransaction,
  onReturn,
  onExtend,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'issued', label: 'Issued', color: 'bg-[#F59E0B]' },
    { value: 'returned', label: 'Returned', color: 'bg-[#22C55E]' },
    { value: 'overdue', label: 'Overdue', color: 'bg-[#EF4444]' },
    { value: 'extended', label: 'Extended', color: 'bg-neutral-400' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'computer science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business & Econ' },
    { value: 'literature', label: 'Literature' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <TransactionStats stats={stats} />

      {/* Toolbar: Search, Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#111111] p-4 rounded-2xl border border-[#2A2A2A]">
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by Student, Reg No, Book Title, ISBN..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717]">
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            <option value="newest" className="bg-[#171717]">Newest First</option>
            <option value="dueDate" className="bg-[#171717]">Due Date Soonest</option>
            <option value="oldest" className="bg-[#171717]">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
          Status:
        </span>
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 select-none border',
                isActive
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#171717] text-[#A1A1AA] border-[#2A2A2A] hover:border-neutral-500 hover:text-white'
              )}
            >
              {opt.color && (
                <span className={cn('w-2 h-2 rounded-full', opt.color)} />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Transaction Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <TransactionTable
          transactions={transactions}
          onSelectTransaction={onSelectTransaction}
          onReturn={onReturn}
          onExtend={onExtend}
        />
      )}
    </div>
  );
};

export default HistoryTab;
