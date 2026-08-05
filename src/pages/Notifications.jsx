import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import NotificationStats from '../components/Notifications/NotificationStats';
import NotificationFeed from '../components/Notifications/NotificationFeed';
import AuditLogsTable from '../components/Notifications/AuditLogsTable';
import ActivityTimeline from '../components/Notifications/ActivityTimeline';
import { TableSkeleton } from '../components/Skeleton';
import useNotifications from '../hooks/useNotifications';
import { FiCheckCircle, FiArchive, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../utils/cn';

export const Notifications = () => {
  const {
    notifications,
    logs,
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
  } = useNotifications();

  const statusOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread', color: 'bg-[#F59E0B]' },
    { value: 'read', label: 'Read', color: 'bg-[#22C55E]' },
    { value: 'archived', label: 'Archived', color: 'bg-neutral-500' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'borrow', label: 'Borrow Events' },
    { value: 'inventory', label: 'Inventory Events' },
    { value: 'users', label: 'User Events' },
    { value: 'settings', label: 'System Events' },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="Notifications & Activity Center"
        subtitle="Stay updated with all library activities."
      >
        <Button
          variant="secondary"
          size="sm"
          icon={FiCheckCircle}
          onClick={handleMarkAllRead}
        >
          Mark All Read
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={FiArchive}
          onClick={handleArchiveRead}
        >
          Archive Read
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={FiTrash2}
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </SectionHeader>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Firestore realtime notification listener active.</span>
        </div>
      )}

      {/* Summary Metrics */}
      <NotificationStats stats={stats} />

      {/* Tab Navigation */}
      <div className="flex border-b border-[#2A2A2A] mb-6 bg-[#111111] px-4 rounded-t-2xl">
        {[
          { id: 'notifications', label: `Notification Feed (${stats.unreadCount || 0} unread)` },
          { id: 'audit_logs', label: `Audit Logs (${logs.length})` },
          { id: 'timeline', label: 'Activity Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-white text-white font-bold'
                : 'border-transparent text-[#A1A1AA] hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar (for Feed & Logs) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#111111] p-4 rounded-2xl border border-[#2A2A2A]">
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by Title, Message, Student, Book, Keywords..."
          />
        </div>

        {activeTab === 'notifications' && (
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#171717]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Status Chips (for Notifications Tab) */}
      {activeTab === 'notifications' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
            Filter Status:
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
      )}

      {/* Tab Content */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          {activeTab === 'notifications' && (
            <NotificationFeed
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkUnread={handleMarkUnread}
              onArchive={handleArchive}
              onSoftDelete={handleSoftDelete}
            />
          )}

          {activeTab === 'audit_logs' && <AuditLogsTable logs={logs} />}

          {activeTab === 'timeline' && <ActivityTimeline logs={logs} />}
        </>
      )}
    </PageContainer>
  );
};

export default Notifications;
