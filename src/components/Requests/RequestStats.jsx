import React from 'react';
import Card from '../Card';
import { StatSkeleton } from '../Skeleton';
import { FiClock, FiCheckCircle, FiXCircle, FiActivity, FiAlertCircle } from 'react-icons/fi';

export const RequestStats = ({
  stats = {},
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
        <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
        <span>Unable to load statistics. Please check your network connection or permissions.</span>
      </div>
    );
  }

  const {
    pendingCount = 0,
    approvedTodayCount = 0,
    rejectedTodayCount = 0,
    processedTodayCount = 0,
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* CARD 1: Pending Requests */}
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
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{pendingCount}</h3>
          <p className="text-xs text-[#F59E0B] mt-1 font-medium">Awaiting librarian review</p>
        </div>
      </Card>

      {/* CARD 2: Approved Today */}
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
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{approvedTodayCount}</h3>
          <p className="text-xs text-[#22C55E] mt-1 font-medium">Ready for issue</p>
        </div>
      </Card>

      {/* CARD 3: Rejected Today */}
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
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{rejectedTodayCount}</h3>
          <p className="text-xs text-[#EF4444] mt-1 font-medium">Declined today</p>
        </div>
      </Card>

      {/* CARD 4: Processed Today */}
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
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{processedTodayCount}</h3>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium">Processed today</p>
        </div>
      </Card>
    </div>
  );
};

export default RequestStats;
