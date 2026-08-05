import React from 'react';
import Card, { CardTitle, CardDescription } from '../Card';
import EmptyState from '../EmptyState';
import { FiActivity, FiBookOpen, FiUserCheck, FiRotateCcw, FiPlusCircle } from 'react-icons/fi';

export const RecentActivity = ({ logs = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'book_added':
        return FiPlusCircle;
      case 'book_updated':
        return FiBookOpen;
      case 'borrow_request':
        return FiActivity;
      case 'return_request':
        return FiRotateCcw;
      case 'user_registered':
        return FiUserCheck;
      default:
        return FiActivity;
    }
  };

  return (
    <Card className="p-6">
      <div className="pb-4 border-b border-[#2A2A2A] mb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Realtime audit log of system events</CardDescription>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon={FiActivity}
          title="No recent activity"
          description="Activity logs will appear automatically as actions occur."
          className="border-0 bg-transparent p-4"
        />
      ) : (
        <div className="relative border-l border-[#2A2A2A] ml-3 pl-4 space-y-4 my-2">
          {logs.slice(0, 8).map((log, idx) => {
            const Icon = getIcon(log.type);
            const timeStr = log.timestamp
              ? (log.timestamp.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
              : 'Just now';

            return (
              <div key={log.id || idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#111111] border-2 border-white flex items-center justify-center" />
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-white transition-colors">
                    {log.action || log.title || 'System Activity'}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                    {log.description || log.userEmail || 'Action executed by administrator.'}
                  </p>
                  <span className="text-[10px] text-[#A1A1AA]/70 mt-1 inline-block font-mono">
                    {timeStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
