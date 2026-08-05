import React from 'react';
import { cn } from '../../utils/cn';

export const InventoryFilters = ({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  departmentFilter,
  onDepartmentChange,
  languageFilter,
  onLanguageChange,
  onResetFilters,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available', color: 'bg-[#22C55E]' },
    { value: 'borrowed', label: 'Borrowed', color: 'bg-[#F59E0B]' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-[#EF4444]' },
    { value: 'archived', label: 'Archived', color: 'bg-neutral-500' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'academic', label: 'Academic' },
    { value: 'novel', label: 'Novel' },
    { value: 'magazine', label: 'Magazine' },
    { value: 'reference', label: 'Reference' },
    { value: 'research', label: 'Research' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'computer science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business & Econ' },
    { value: 'literature', label: 'Literature' },
    { value: 'general', label: 'General Library' },
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
  ];

  const hasActiveFilters = 
    statusFilter !== 'all' || 
    categoryFilter !== 'all' || 
    departmentFilter !== 'all' || 
    languageFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Availability Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
          Status:
        </span>
        {statusOptions.map((opt) => {
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 select-none border',
                isActive
                  ? 'bg-white text-black border-white font-semibold shadow-xs'
                  : 'bg-[#171717] text-[#A1A1AA] border-[#2A2A2A] hover:border-neutral-500 hover:text-white'
              )}
            >
              {opt.color && (
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    opt.color,
                    isActive ? 'opacity-100' : 'opacity-70'
                  )}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Category Chips & Select Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categoryOptions.map((opt) => {
            const isActive = categoryFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onCategoryChange(opt.value)}
                className={cn(
                  'px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 border select-none',
                  isActive
                    ? 'bg-neutral-200 text-black border-white font-semibold'
                    : 'bg-[#171717] text-[#A1A1AA] border-[#2A2A2A] hover:border-neutral-500 hover:text-white'
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters for Dept, Lang & Clear All */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-1.5 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {departmentOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={languageFilter}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-1.5 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717] text-white">
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-[#EF4444] hover:underline font-medium px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
