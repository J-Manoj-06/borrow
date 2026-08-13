import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import StatCard from '../components/Dashboard/StatCard';
import InventoryChart from '../components/Dashboard/InventoryChart';
import RecentRequests from '../components/Dashboard/RecentRequests';
import RecentActivity from '../components/Dashboard/RecentActivity';
import PopularBooks from '../components/Dashboard/PopularBooks';
import QuickActions from '../components/Dashboard/QuickActions';
import { 
  StatSkeleton, 
  ChartSkeleton, 
  TableSkeleton, 
  ActivitySkeleton, 
  BookCardSkeleton 
} from '../components/Skeleton';
import useDashboardData from '../hooks/useDashboardData';
import useExportReport from '../hooks/useExportReport';
import { 
  FiDownload, 
  FiBookOpen, 
  FiCheckCircle, 
  FiRepeat, 
  FiClock, 
  FiAlertTriangle, 
  FiRotateCcw 
} from 'react-icons/fi';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    stats, 
    recentRequests, 
    activityLogs, 
    popularBooks, 
    chartData, 
    loading, 
    error 
  } = useDashboardData();

  const { isExporting, handleExport } = useExportReport();

  return (
    <PageContainer>
      {/* Page Title & Header */}
      <SectionHeader
        title="Dashboard"
        subtitle="Welcome back. Here's your library overview."
      >
        <Button
          variant="secondary"
          size="sm"
          icon={FiDownload}
          loading={isExporting}
          disabled={isExporting}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </SectionHeader>

      {/* Error Alert Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Utilizing active session listener fallback.</span>
        </div>
      )}

      {/* 1. Statistics Cards Grid (6 Metric Cards with Interactive Deep-Linking) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            {/* 1. Total Books */}
            <StatCard
              title="Total Books"
              value={stats.totalBooks}
              icon={FiBookOpen}
              description="Cataloged library items"
              onClick={() => navigate('/inventory?status=all')}
            />

            {/* 2. Available Books */}
            <StatCard
              title="Available Books"
              value={stats.availableBooks}
              icon={FiCheckCircle}
              indicatorColor="green"
              description="Ready for immediate issue"
              onClick={() => navigate('/inventory?status=available')}
            />

            {/* 3. Books Issued */}
            <StatCard
              title="Books Issued"
              value={stats.booksIssued}
              icon={FiRepeat}
              description="Currently out on loan"
              onClick={() => navigate('/transactions?tab=active_borrowings')}
            />

            {/* 4. Pending Requests */}
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={FiClock}
              indicatorColor="orange"
              description="Awaiting librarian review"
              onClick={() => navigate('/borrow-requests?status=Pending')}
            />

            {/* 5. Overdue Books */}
            <StatCard
              title="Overdue Books"
              value={stats.overdueBooks}
              icon={FiAlertTriangle}
              indicatorColor="red"
              description="Past return due date"
              onClick={() => navigate('/transactions?tab=active_borrowings&filter=overdue')}
            />

            {/* 6. Returned Today */}
            <StatCard
              title="Returned Today"
              value={stats.returnedToday}
              icon={FiRotateCcw}
              description="Books checked back in"
              onClick={() => navigate('/transactions?tab=history&filter=returned_today')}
            />
          </>
        )}
      </div>

      {/* 2. Main Analytics & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {loading ? <ChartSkeleton /> : <InventoryChart data={chartData} />}
        </div>
        <div className="space-y-6">
          <QuickActions />
          {loading ? <ActivitySkeleton /> : <RecentActivity logs={activityLogs} />}
        </div>
      </div>

      {/* 3. Requests Table & Popular Books Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {loading ? <TableSkeleton /> : <RecentRequests requests={recentRequests} />}
        </div>
        <div className="lg:col-span-1">
          {loading ? (
            <div className="space-y-4">
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : (
            <PopularBooks books={popularBooks} />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
