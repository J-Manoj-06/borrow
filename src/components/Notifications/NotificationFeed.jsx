import React from 'react';
import Card from '../Card';
import Badge from '../Badge';
import EmptyState from '../EmptyState';
import { 
  FiBell, 
  FiCheckCircle, 
  FiXCircle, 
  FiBookOpen, 
  FiClock, 
  FiAlertTriangle, 
  FiUserCheck, 
  FiCheck, 
  FiArchive, 
  FiTrash2, 
  FiEye 
} from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const NotificationFeed = ({
  notifications = [],
  onMarkRead,
  onMarkUnread,
  onArchive,
  onSoftDelete,
}) => {
  const getIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('approved')) return <FiCheckCircle className="w-4 h-4 text-[#22C55E]" />;
    if (t.includes('declined') || t.includes('rejected')) return <FiXCircle className="w-4 h-4 text-[#EF4444]" />;
    if (t.includes('issued')) return <FiBookOpen className="w-4 h-4 text-white" />;
    if (t.includes('overdue')) return <FiAlertTriangle className="w-4 h-4 text-[#EF4444]" />;
    if (t.includes('user') || t.includes('account')) return <FiUserCheck className="w-4 h-4 text-[#22C55E]" />;
    return <FiBell className="w-4 h-4 text-[#A1A1AA]" />;
  };

  const formatDate = (val) => {
    if (!val) return 'Just now';
    if (val.toDate) return val.toDate().toLocaleString();
    return new Date(val).toLocaleString();
  };

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={FiCheckCircle}
        title="You're all caught up."
        description="No unread or pending notifications. Future events will appear here in real-time."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => {
        const isUnread = !n.isRead && !n.isArchived;

        return (
          <Card
            key={n.id}
            className={cn(
              'p-4 transition-all border',
              isUnread
                ? 'bg-[#171717] border-white/40 shadow-sm'
                : 'bg-[#111111] border-[#2A2A2A] opacity-80 hover:opacity-100'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {/* Type Icon */}
                <div className="p-2 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                {/* Body Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {/* Unread indicator dot */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0 animate-pulse" />
                    )}
                    <h4 className="font-bold text-white text-xs leading-snug">{n.title || 'Notification Alert'}</h4>
                    {n.priority && (
                      <Badge variant={n.priority === 'urgent' || n.priority === 'high' ? 'danger' : 'neutral'} size="sm">
                        {n.priority}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {n.message || n.description || 'System notification event.'}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[10px] text-[#A1A1AA] font-mono">
                    <span>{formatDate(n.createdAt)}</span>
                    {n.userId && <span>User: {n.userId}</span>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {isUnread ? (
                  <button
                    type="button"
                    onClick={() => onMarkRead(n.id)}
                    title="Mark as Read"
                    className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                  >
                    <FiCheck className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onMarkUnread(n.id)}
                    title="Mark as Unread"
                    className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                  >
                    <FiBell className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onArchive(n.id)}
                  title="Archive Notification"
                  className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E] transition-colors"
                >
                  <FiArchive className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSoftDelete(n.id)}
                  title="Delete Notification"
                  className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#EF4444] hover:bg-red-950/40 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default NotificationFeed;
