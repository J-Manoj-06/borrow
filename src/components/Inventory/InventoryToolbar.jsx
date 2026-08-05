import React from 'react';
import SearchInput from '../SearchInput';
import { FiGrid, FiList } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const InventoryToolbar = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalItems = 0,
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' },
    { value: 'author', label: 'Author Name' },
    { value: 'borrowCount', label: 'Most Borrowed' },
    { value: 'availableCopies', label: 'Most Copies Available' },
    { value: 'updatedAt', label: 'Recently Updated' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-[#111111] p-4 rounded-2xl border border-[#2A2A2A]">
      {/* Realtime Search Bar */}
      <div className="flex-1 max-w-lg">
        <SearchInput
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={onSearchClear}
          placeholder="Search by Title, Author, ISBN, Publisher, Category..."
        />
      </div>

      {/* Right Controls: Sort & View Toggle */}
      <div className="flex items-center justify-between md:justify-end gap-3">
        {/* Total Count Badge */}
        <span className="text-xs text-[#A1A1AA] font-medium hidden sm:inline-block">
          {totalItems} {totalItems === 1 ? 'book' : 'books'}
        </span>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#A1A1AA] font-medium shrink-0 hidden lg:inline-block">
            Sort:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#171717] text-white text-xs rounded-xl border border-[#2A2A2A] px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#171717] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid vs List View Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#171717] border border-[#2A2A2A]">
          <button
            type="button"
            title="Grid View"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
              viewMode === 'grid'
                ? 'bg-white text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E]'
            )}
          >
            <FiGrid className="w-4 h-4" />
            <span className="hidden sm:inline-block">Grid</span>
          </button>
          <button
            type="button"
            title="List View"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5',
              viewMode === 'list'
                ? 'bg-white text-black font-semibold'
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E]'
            )}
          >
            <FiList className="w-4 h-4" />
            <span className="hidden sm:inline-block">List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryToolbar;
