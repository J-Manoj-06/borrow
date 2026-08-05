import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import UserStats from '../components/Users/UserStats';
import UserTable from '../components/Users/UserTable';
import UserDrawer from '../components/Users/UserDrawer';
import StatusConfirmModal from '../components/Users/StatusConfirmModal';
import BorrowLimitModal from '../components/Users/BorrowLimitModal';
import { TableSkeleton } from '../components/Skeleton';
import useUsers from '../hooks/useUsers';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../utils/cn';
import { toast } from 'react-hot-toast';

export const Users = () => {
  const {
    users,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    semesterFilter,
    setSemesterFilter,
    borrowingFilter,
    setBorrowingFilter,
    sortBy,
    setSortBy,
    selectedUser,
    setSelectedUser,
    statusModalTarget,
    setStatusModalTarget,
    targetStatus,
    limitModalTarget,
    setLimitModalTarget,
    isUpdatingStatus,
    isUpdatingLimit,
    isUpdatingProfile,
    initiateStatusChange,
    confirmStatusChange,
    confirmBorrowLimit,
    handleProfileSave,
  } = useUsers();

  const handleExportUI = () => {
    toast.success('User directory report exported (UI simulation).');
  };

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active', color: 'bg-[#22C55E]' },
    { value: 'suspended', label: 'Suspended', color: 'bg-[#EF4444]' },
    { value: 'pending', label: 'Pending', color: 'bg-[#F59E0B]' },
    { value: 'graduated', label: 'Graduated', color: 'bg-neutral-500' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'computer science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business & Econ' },
    { value: 'literature', label: 'Literature' },
  ];

  const borrowingOptions = [
    { value: 'all', label: 'All Borrowing Status' },
    { value: 'has_books', label: 'Has Active Books' },
    { value: 'no_books', label: 'No Active Books' },
    { value: 'limit_reached', label: 'Max Limit Reached' },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="Users"
        subtitle="Manage students and library members."
      >
        <Button
          variant="secondary"
          size="sm"
          icon={FiDownload}
          onClick={handleExportUI}
        >
          Export Users
        </Button>
      </SectionHeader>

      {/* Error Alert Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Firestore realtime users listener active.</span>
        </div>
      )}

      {/* Realtime Summary Metrics */}
      <UserStats stats={stats} />

      {/* Toolbar: Search, Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#111111] p-4 rounded-2xl border border-[#2A2A2A]">
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by Student Name, Reg No, Email, Phone, Department..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Borrowing Status Select */}
          <select
            value={borrowingFilter}
            onChange={(e) => setBorrowingFilter(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {borrowingOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717]">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Department Select */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717]">
                {opt.label}
              </option>
            ))}
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

      {/* User Table / Mobile Cards */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <UserTable
          users={users}
          onSelectUser={(u) => setSelectedUser(u)}
          onStatusChange={initiateStatusChange}
          onLimitChange={(u) => setLimitModalTarget(u)}
        />
      )}

      {/* Profile Inspection & Edit Drawer */}
      <UserDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onStatusChange={initiateStatusChange}
        onLimitChange={(u) => setLimitModalTarget(u)}
        onProfileSave={handleProfileSave}
        isUpdatingProfile={isUpdatingProfile}
      />

      {/* Account Status Confirmation Modal */}
      <StatusConfirmModal
        isOpen={!!statusModalTarget}
        onClose={() => setStatusModalTarget(null)}
        user={statusModalTarget}
        targetStatus={targetStatus}
        onConfirm={confirmStatusChange}
        isUpdating={isUpdatingStatus}
      />

      {/* Borrow Limit Modal */}
      <BorrowLimitModal
        isOpen={!!limitModalTarget}
        onClose={() => setLimitModalTarget(null)}
        user={limitModalTarget}
        onConfirm={confirmBorrowLimit}
        isUpdating={isUpdatingLimit}
      />
    </PageContainer>
  );
};

export default Users;
