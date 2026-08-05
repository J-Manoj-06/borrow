import React from 'react';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import ReportStats from '../components/Reports/ReportStats';
import AnalyticsCharts from '../components/Reports/AnalyticsCharts';
import PopularBooks from '../components/Reports/PopularBooks';
import OverdueReport from '../components/Reports/OverdueReport';
import DepartmentGrid from '../components/Reports/DepartmentGrid';
import InventoryHealth from '../components/Reports/InventoryHealth';
import UserAnalytics from '../components/Reports/UserAnalytics';
import { TableSkeleton } from '../components/Skeleton';
import useAnalytics from '../hooks/useAnalytics';
import useExportReport from '../hooks/useExportReport';
import { FiPrinter, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../utils/cn';

export const Reports = () => {
  const {
    loading,
    error,
    dateRange,
    setDateRange,
    stats,
    charts,
    popularBooks,
    leastUsedBooks,
    activeStudentsList,
    overdueReport,
    inventoryHealth,
  } = useAnalytics();

  const { isExporting, handleExport } = useExportReport();

  const handlePrint = () => {
    window.print();
  };

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'six_months', label: 'Last 6 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <PageContainer>
      {/* Header (Hidden during print) */}
      <div className="print:hidden">
        <SectionHeader
          title="Reports & Analytics"
          subtitle="Realtime Firestore analytical insights for library operations."
        >
          <Button
            variant="secondary"
            size="sm"
            icon={FiPrinter}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={FiDownload}
            loading={isExporting}
            disabled={isExporting}
            onClick={handleExport}
          >
            Export Report (.xlsx)
          </Button>
        </SectionHeader>
      </div>

      {/* Printable Title Header (Only visible in Print mode) */}
      <div className="hidden print:block mb-6 border-b pb-4 border-neutral-300">
        <h1 className="text-2xl font-bold text-black">Borrow Library Management — Executive Analytics Report</h1>
        <p className="text-xs text-neutral-600">Generated on {new Date().toLocaleString()} | Filter: {dateRange.toUpperCase()}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs print:hidden">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Realtime analytics listener active.</span>
        </div>
      )}

      {/* Date Range Filter Selector (Hidden during print) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none print:hidden">
        <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
          Time Horizon:
        </span>
        {dateOptions.map((opt) => {
          const isActive = dateRange === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDateRange(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 select-none border',
                isActive
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#171717] text-[#A1A1AA] border-[#2A2A2A] hover:border-neutral-500 hover:text-white'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          {/* 10 Realtime Summary Metric Cards */}
          <ReportStats stats={stats || {}} />

          {/* Recharts Analytics Visualizations */}
          <AnalyticsCharts charts={charts || {}} />

          {/* Popular & Least Borrowed Books */}
          <PopularBooks popularBooks={popularBooks} leastUsedBooks={leastUsedBooks} />

          {/* Overdue Loans Audit Table */}
          <OverdueReport overdueReport={overdueReport} />

          {/* Department Analytics Grid */}
          <DepartmentGrid departmentAnalytics={charts?.departmentAnalytics || []} />

          {/* Inventory Health */}
          <InventoryHealth health={inventoryHealth} />

          {/* Active Student Borrowers Ranking */}
          <UserAnalytics activeStudentsList={activeStudentsList} />
        </>
      )}
    </PageContainer>
  );
};

export default Reports;
