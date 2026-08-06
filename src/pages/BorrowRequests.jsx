import React, { useState } from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import RequestStats from '../components/Requests/RequestStats';
import RequestTable from '../components/Requests/RequestTable';
import RequestCard from '../components/Requests/RequestCard';
import RequestDrawer from '../components/Requests/RequestDrawer';
import ApproveModal from '../components/Requests/ApproveModal';
import RejectModal from '../components/Requests/RejectModal';
import { TableSkeleton } from '../components/Skeleton';
import useBorrowRequests from '../hooks/useBorrowRequests';
import { FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../utils/cn';

export const BorrowRequests = () => {
  const {
    requests,
    loading,
    error,
    stats,
    statsLoading,
    statsError,
    refreshStatsStream,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    selectedRequest,
    setSelectedRequest,
    bookAvailability,
    isCheckingBook,
    handleOpenDrawer,
    handleCloseDrawer,
    showApproveModal,
    setShowApproveModal,
    showRejectModal,
    setShowRejectModal,
    rejectReason,
    setRejectReason,
    isProcessing,
    handleConfirmApprove,
    handleConfirmReject,
  } = useBorrowRequests();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshStatsStream();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const statusOptions = [
    { value: 'All', label: 'All Requests' },
    { value: 'Pending', label: 'Pending', color: 'bg-[#F59E0B]' },
    { value: 'Approved', label: 'Approved', color: 'bg-[#22C55E]' },
    { value: 'Rejected', label: 'Rejected', color: 'bg-[#EF4444]' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-neutral-500' },
    { value: 'Returned', label: 'Returned', color: 'bg-neutral-400' },
    { value: 'Expired', label: 'Expired', color: 'bg-red-800' },
  ];

  const departmentOptions = [
    'All',
    'Computer Science',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business & Management',
    'General',
  ];

  const categoryOptions = [
    'All',
    'Academic',
    'Programming & Technology',
    'Novel',
    'Reference',
    'Research',
    'Magazine',
  ];

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="Borrow Requests"
        subtitle="Review and manage book borrowing requests."
      >
        <Button
          variant="secondary"
          size="sm"
          icon={FiRefreshCw}
          loading={isRefreshing}
          onClick={handleRefresh}
        >
          Refresh Stream
        </Button>
      </SectionHeader>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Realtime Firestore requests listener active.</span>
        </div>
      )}

      {/* Realtime Summary Metrics */}
      <RequestStats stats={stats} loading={statsLoading} error={statsError} />

      {/* Toolbar & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#111111] p-4 rounded-2xl border border-[#2A2A2A]">
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by Student Name, Reg No, Book Name, ISBN, Dept..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept} className="bg-[#171717]">
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat} className="bg-[#171717]">
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer font-medium"
          >
            <option value="newest" className="bg-[#171717]">Newest First</option>
            <option value="oldest" className="bg-[#171717]">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Status Chips Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
          Status:
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

      {/* Main Content: Table on Desktop, Cards on Mobile */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <RequestTable
              requests={requests}
              onInspect={handleOpenDrawer}
              onApprove={(r) => {
                setSelectedRequest(r);
                setShowApproveModal(true);
              }}
              onReject={(r) => {
                setSelectedRequest(r);
                setShowRejectModal(true);
              }}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onInspect={handleOpenDrawer}
                onApprove={(req) => {
                  setSelectedRequest(req);
                  setShowApproveModal(true);
                }}
                onReject={(req) => {
                  setSelectedRequest(req);
                  setShowRejectModal(true);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Right Inspection Drawer */}
      <RequestDrawer
        isOpen={Boolean(selectedRequest)}
        onClose={handleCloseDrawer}
        request={selectedRequest}
        bookAvailability={bookAvailability}
        isCheckingBook={isCheckingBook}
        onApprove={() => setShowApproveModal(true)}
        onReject={() => setShowRejectModal(true)}
      />

      {/* Approve Confirmation Modal */}
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        request={selectedRequest}
        isProcessing={isProcessing}
        onConfirm={handleConfirmApprove}
      />

      {/* Reject Confirmation Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        request={selectedRequest}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isProcessing={isProcessing}
        onConfirm={handleConfirmReject}
      />
    </PageContainer>
  );
};

export default BorrowRequests;
