import React from 'react';
import Card from '../Card';
import { FiBell, FiActivity, FiClock, FiAlertTriangle, FiSliders } from 'react-icons/fi';

export const NotificationStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Unread */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            Unread Alerts
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#F59E0B]">
            <FiBell className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.unreadCount || 0}</h3>
          <p className="text-[11px] text-[#F59E0B] mt-0.5">Awaiting librarian review</p>
        </div>
      </Card>

      {/* Today's Activities */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            Today's Activity
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#22C55E]">
            <FiActivity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.todayActivitiesCount || 0}</h3>
          <p className="text-[11px] text-[#22C55E] mt-0.5">Recorded operations today</p>
        </div>
      </Card>

      {/* Borrow Requests */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            Borrow Events
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-white">
            <FiClock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.borrowRequestsCount || 0}</h3>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">Requests & dispenses</p>
        </div>
      </Card>

      {/* Overdue Alerts */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            Overdue Alerts
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-[#EF4444]">
            <FiAlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.overdueAlertsCount || 0}</h3>
          <p className="text-[11px] text-[#EF4444] mt-0.5">Exceeded loan dates</p>
        </div>
      </Card>

      {/* System Alerts */}
      <Card hoverable className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            System Alerts
          </span>
          <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-white">
            <FiSliders className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{stats.systemAlertsCount || 0}</h3>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5 font-normal">Settings & accounts</p>
        </div>
      </Card>
    </div>
  );
};

export default NotificationStats;
