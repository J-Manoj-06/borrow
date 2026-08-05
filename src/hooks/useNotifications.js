import { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToNotifications, 
  subscribeToActivityLogs, 
  markNotificationRead, 
  markNotificationUnread, 
  archiveNotification, 
  softDeleteNotification, 
  markAllNotificationsRead, 
  archiveReadNotifications, 
  softDeleteAllNotifications 
} from '../services/notificationService';
import { toast } from 'react-hot-toast';

export const useNotifications = () => {
  const [rawNotifications, setRawNotifications] = useState([]);
  const [rawLogs, setRawLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread' | 'read' | 'archived'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'borrow' | 'inventory' | 'users' | 'settings' | 'system'
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'audit_logs' | 'timeline'

  // Subscriptions
  useEffect(() => {
    const unsubNotif = subscribeToNotifications(
      (data) => {
        setRawNotifications(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Notifications listener error');
        setLoading(false);
      }
    );

    const unsubLogs = subscribeToActivityLogs(
      (data) => {
        setRawLogs(data);
      },
      (err) => console.warn('Activity logs error:', err)
    );

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      if (unsubNotif) unsubNotif();
      if (unsubLogs) unsubLogs();
    };
  }, []);

  // Compute realtime summary statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();

    const activeNotifs = rawNotifications.filter((n) => !n.isDeleted);
    const unreadCount = activeNotifs.filter((n) => !n.isRead && !n.isArchived).length;
    
    const todayActivitiesCount = rawLogs.filter((l) => {
      const d = l.timestamp ? (l.timestamp.toDate ? l.timestamp.toDate() : new Date(l.timestamp)) : null;
      return d && d.toDateString() === todayStr;
    }).length;

    const borrowRequestsCount = activeNotifs.filter((n) => n.type?.includes('request') || n.type?.includes('borrow')).length;
    const overdueAlertsCount = activeNotifs.filter((n) => n.type?.includes('overdue')).length;
    const systemAlertsCount = activeNotifs.filter((n) => n.type?.includes('system') || n.type?.includes('settings') || n.type?.includes('account')).length;

    return {
      unreadCount,
      todayActivitiesCount,
      borrowRequestsCount,
      overdueAlertsCount,
      systemAlertsCount,
    };
  }, [rawNotifications, rawLogs]);

  // Filtered Notifications list
  const filteredNotifications = useMemo(() => {
    return rawNotifications.filter((n) => {
      if (n.isDeleted) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = n.title?.toLowerCase().includes(q);
        const descMatch = n.message?.toLowerCase().includes(q) || n.description?.toLowerCase().includes(q);
        const userMatch = (n.userId || n.userEmail)?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !userMatch) return false;
      }

      // Status Filter
      if (statusFilter === 'unread' && (n.isRead || n.isArchived)) return false;
      if (statusFilter === 'read' && (!n.isRead || n.isArchived)) return false;
      if (statusFilter === 'archived' && !n.isArchived) return false;
      if (statusFilter !== 'archived' && n.isArchived) return false;

      // Category Filter
      if (categoryFilter !== 'all') {
        const t = (n.type || '').toLowerCase();
        if (categoryFilter === 'borrow' && !t.includes('borrow') && !t.includes('request') && !t.includes('issued') && !t.includes('returned')) return false;
        if (categoryFilter === 'inventory' && !t.includes('book')) return false;
        if (categoryFilter === 'users' && !t.includes('user') && !t.includes('account')) return false;
        if (categoryFilter === 'settings' && !t.includes('setting')) return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return timeB - timeA;
    });
  }, [rawNotifications, searchQuery, statusFilter, categoryFilter]);

  // Filtered Activity Logs
  const sortedLogs = useMemo(() => {
    const list = [...rawLogs];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter((l) => 
        l.action?.toLowerCase().includes(q) ||
        l.title?.toLowerCase().includes(q) ||
        l.userEmail?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
      const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
      return timeB - timeA;
    });
    return list;
  }, [rawLogs, searchQuery]);

  // Handlers
  const handleMarkRead = (id) => markNotificationRead(id);
  const handleMarkUnread = (id) => markNotificationUnread(id);
  const handleArchive = (id) => archiveNotification(id);
  const handleSoftDelete = (id) => softDeleteNotification(id);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(rawNotifications);
    toast.success('All active notifications marked as read.');
  };

  const handleArchiveRead = async () => {
    await archiveReadNotifications(rawNotifications);
    toast.success('All read notifications moved to archive.');
  };

  const handleClearAll = async () => {
    await softDeleteAllNotifications(rawNotifications);
    toast.success('Notifications list cleared.');
  };

  return {
    notifications: filteredNotifications,
    rawNotifications,
    logs: sortedLogs,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    activeTab,
    setActiveTab,
    handleMarkRead,
    handleMarkUnread,
    handleArchive,
    handleSoftDelete,
    handleMarkAllRead,
    handleArchiveRead,
    handleClearAll,
  };
};

export default useNotifications;
