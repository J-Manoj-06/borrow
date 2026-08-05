import React from 'react';
import Card from '../Card';
import { FiClock, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';

export const RequestStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Pending */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            Pending Requests
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#F59E0B]">
            <FiClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.pendingCount || 0}</h3>
          <p className="text-xs text-[#F59E0B] mt-1">Awaiting librarian review</p>
        </div>
      </Card>

      {/* Approved Today */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            Approved Today
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#22C55E]">
            <FiCheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.approvedTodayCount || 0}</h3>
          <p className="text-xs text-[#22C55E] mt-1">Pre-approved for dispensation</p>
        </div>
      </Card>

      {/* Rejected Today */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Rejected Today
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#EF4444]">
            <FiXCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.rejectedTodayCount || 0}</h3>
          <p className="text-xs text-[#EF4444] mt-1">Declined with reason</p>
        </div>
      </Card>

      {/* Processed Today */}
      <Card hoverable className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            Processed Today
          </span>
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-white">
            <FiActivity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.processedTodayCount || 0}</h3>
          <p className="text-xs text-[#A1A1AA] mt-1">Total requests reviewed</p>
        </div>
      </Card>
    </div>
  );
};

export default RequestStats;
