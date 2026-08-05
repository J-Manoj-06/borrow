import React from 'react';
import Card from '../Card';
import { FiUsers, FiUserCheck, FiUserX, FiBookOpen, FiClock } from 'react-icons/fi';

export const UserStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Users */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
            Total Users
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-white">
            <FiUsers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.totalUsers || 0}</h3>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">Registered library members</p>
        </div>
      </Card>

      {/* Active Users */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Active Users
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#22C55E]">
            <FiUserCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.activeUsers || 0}</h3>
          <p className="text-[11px] text-[#22C55E] mt-0.5">Clear borrowing privileges</p>
        </div>
      </Card>

      {/* Suspended Users */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Suspended
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#EF4444]">
            <FiUserX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.suspendedUsers || 0}</h3>
          <p className="text-[11px] text-[#EF4444] mt-0.5">Access suspended</p>
        </div>
      </Card>

      {/* Currently Borrowed */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            Books Out
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-white">
            <FiBookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.borrowedCount || 0}</h3>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">Active dispensations</p>
        </div>
      </Card>

      {/* Pending Registrations */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            Pending Regs
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#F59E0B]">
            <FiClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.pendingRegistrations || 0}</h3>
          <p className="text-[11px] text-[#F59E0B] mt-0.5">Awaiting verification</p>
        </div>
      </Card>
    </div>
  );
};

export default UserStats;
