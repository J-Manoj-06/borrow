import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import PendingIssueTab from '../components/Transactions/PendingIssueTab';
import ActiveBorrowingsTab from '../components/Transactions/ActiveBorrowingsTab';
import HistoryTab from '../components/Transactions/HistoryTab';
import TransactionDrawer from '../components/Transactions/TransactionDrawer';
import ExtendDueDateModal from '../components/Transactions/ExtendDueDateModal';
import useTransactions from '../hooks/useTransactions';
import { FiClock, FiCheckCircle, FiRepeat, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../utils/cn';

export const Transactions = () => {
  const {
    pendingIssueRequests,
    activeBorrowings,
    historyTransactions,
    loading,
    error,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    sortBy,
    setSortBy,
    selectedTransaction,
    setSelectedTransaction,
    extendTarget,
    setExtendTarget,
    isIssuing,
    isReturning,
    isExtending,
    handleIssueApprovedRequest,
    handleReturnActiveBorrowing,
    handleExtendSubmit,
  } = useTransactions();

  return (
    <PageContainer>
      {/* Page Header */}
      <SectionHeader
        title="Circulation Transactions"
        subtitle="Manage approved book issues, active borrowings, and return check-ins."
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Realtime Firestore circulation listener active.</span>
        </div>
      )}

      {/* 3 Tabs Navigation Bar */}
      <div className="flex border-b border-[#2A2A2A] mb-6 bg-[#111111] px-4 rounded-t-2xl">
        {[
          {
            id: 'pending_issue',
            label: `Pending Issue (${pendingIssueRequests.length})`,
            icon: FiClock,
            badgeColor: pendingIssueRequests.length > 0 ? 'bg-[#F59E0B]' : null,
          },
          {
            id: 'active_borrowings',
            label: `Active Borrowings (${activeBorrowings.length})`,
            icon: FiRepeat,
            badgeColor: activeBorrowings.length > 0 ? 'bg-[#22C55E]' : null,
          },
          {
            id: 'history',
            label: `History (${historyTransactions.length})`,
            icon: FiCheckCircle,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-3.5 px-5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2',
                isActive
                  ? 'border-white text-white font-bold'
                  : 'border-transparent text-[#A1A1AA] hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badgeColor && (
                <span className={cn('w-2 h-2 rounded-full animate-pulse', tab.badgeColor)} />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PENDING ISSUE */}
      {activeTab === 'pending_issue' && (
        <PendingIssueTab
          pendingRequests={pendingIssueRequests}
          loading={loading}
          onIssueBook={handleIssueApprovedRequest}
          isIssuing={isIssuing}
        />
      )}

      {/* TAB 2: ACTIVE BORROWINGS */}
      {activeTab === 'active_borrowings' && (
        <ActiveBorrowingsTab
          activeTransactions={activeBorrowings}
          loading={loading}
          onReturnBook={handleReturnActiveBorrowing}
          onExtendDueDate={(t) => setExtendTarget(t)}
          isReturning={isReturning}
        />
      )}

      {/* TAB 3: HISTORY */}
      {activeTab === 'history' && (
        <HistoryTab
          transactions={historyTransactions}
          loading={loading}
          stats={stats}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onSelectTransaction={(t) => setSelectedTransaction(t)}
          onReturn={handleReturnActiveBorrowing}
          onExtend={(t) => setExtendTarget(t)}
        />
      )}

      {/* Inspection Drawer */}
      <TransactionDrawer
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onReturn={handleReturnActiveBorrowing}
        onExtend={(t) => setExtendTarget(t)}
      />

      {/* Extend Due Date Modal */}
      <ExtendDueDateModal
        isOpen={Boolean(extendTarget)}
        onClose={() => setExtendTarget(null)}
        transaction={extendTarget}
        onConfirm={handleExtendSubmit}
        isExtending={isExtending}
      />
    </PageContainer>
  );
};

export default Transactions;
