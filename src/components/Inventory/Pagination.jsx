import React from 'react';
import Button from '../Button';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 25,
  onPageChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers range
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#2A2A2A]">
      {/* Item count text */}
      <span className="text-xs text-[#A1A1AA]">
        Showing <span className="font-semibold text-white">{startItem}</span> -{' '}
        <span className="font-semibold text-white">{endItem}</span> of{' '}
        <span className="font-semibold text-white">{totalItems}</span> books
      </span>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2.5 py-1 text-xs"
        >
          <FiChevronLeft className="w-4 h-4 mr-0.5" />
          Previous
        </Button>

        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((pg) => (
            <button
              key={pg}
              type="button"
              onClick={() => onPageChange(pg)}
              className={cn(
                'w-8 h-8 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center select-none',
                currentPage === pg
                  ? 'bg-white text-black'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#1E1E1E]'
              )}
            >
              {pg}
            </button>
          ))}
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2.5 py-1 text-xs"
        >
          Next
          <FiChevronRight className="w-4 h-4 ml-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
