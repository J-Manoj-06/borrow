import React from 'react';
import Card from '../Card';
import { FiBookOpen, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';

export const TransactionStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Currently Issued */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Currently Issued
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-white">
            <FiBookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.currentlyIssued || 0}</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">Active loan contracts</p>
        </div>
      </Card>

      {/* Returned Today */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Returned Today
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#22C55E]">
            <FiCheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.returnedToday || 0}</h3>
          <p className="text-xs text-[#22C55E] mt-1">Check-ins processed today</p>
        </div>
      </Card>

      {/* Overdue Books */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            Overdue Books
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#EF4444]">
            <FiAlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.overdueCount || 0}</h3>
          <p className="text-xs text-[#EF4444] mt-1">Exceeded due date threshold</p>
        </div>
      </Card>

      {/* Due Today */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            Due Today
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#F59E0B]">
            <FiClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.dueToday || 0}</h3>
          <p className="text-xs text-[#F59E0B] mt-1">Expected return by EOD</p>
        </div>
      </Card>
    </div>
  );
};

export default TransactionStats;
