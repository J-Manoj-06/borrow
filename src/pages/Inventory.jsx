import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import InventoryToolbar from '../components/Inventory/InventoryToolbar';
import InventoryFilters from '../components/Inventory/InventoryFilters';
import BookCard from '../components/Inventory/BookCard';
import BookTableView from '../components/Inventory/BookTableView';
import BookDetailsModal from '../components/Inventory/BookDetailsModal';
import DeleteConfirmModal from '../components/Inventory/DeleteConfirmModal';
import Pagination from '../components/Inventory/Pagination';
import InventorySkeleton from '../components/Inventory/InventorySkeleton';
import useInventoryData from '../hooks/useInventoryData';
import { FiPlus, FiBookOpen, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export const Inventory = () => {
  const {
    books,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    departmentFilter,
    setDepartmentFilter,
    languageFilter,
    setLanguageFilter,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    viewMode,
    setViewMode,
  } = useInventoryData();

  const navigate = useNavigate();

  // Selected book for details modal & delete confirmation modal
  const [selectedBookForDetails, setSelectedBookForDetails] = useState(null);
  const [selectedBookForDelete, setSelectedBookForDelete] = useState(null);

  const handleAddFirstBookUI = () => {
    navigate('/inventory/add');
  };

  const resetAllFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setDepartmentFilter('all');
    setLanguageFilter('all');
    setSearchQuery('');
  };

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title="Inventory"
        subtitle="Manage and organize your library collection."
      >
        <Button
          variant="primary"
          size="sm"
          icon={FiPlus}
          onClick={handleAddFirstBookUI}
        >
          Add New Book
        </Button>
      </SectionHeader>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-3 text-red-200 text-xs">
          <FiAlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          <span>Notice: {error}. Firestore realtime listener active.</span>
        </div>
      )}

      {/* Toolbar & Filters */}
      <InventoryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery('')}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalItems={totalItems}
      />

      <InventoryFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        languageFilter={languageFilter}
        onLanguageChange={setLanguageFilter}
        onResetFilters={resetAllFilters}
      />

      {/* Loading Skeletons */}
      {loading ? (
        <InventorySkeleton viewMode={viewMode} />
      ) : books.length === 0 ? (
        /* Empty State */
        <EmptyState
          icon={FiBookOpen}
          title="No books found."
          description="Adjust your search parameters, clear filters, or add a new catalog item."
          action={
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={resetAllFilters}>
                Clear All Filters
              </Button>
              <Button variant="primary" size="sm" icon={FiPlus} onClick={handleAddFirstBookUI}>
                Add First Book
              </Button>
            </div>
          }
        />
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onViewDetails={(b) => setSelectedBookForDetails(b)}
              onDelete={(b) => setSelectedBookForDelete(b)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <BookTableView
          books={books}
          onViewDetails={(b) => setSelectedBookForDetails(b)}
          onDelete={(b) => setSelectedBookForDelete(b)}
        />
      )}

      {/* Pagination */}
      {!loading && books.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Book Specification Details Modal */}
      <BookDetailsModal
        isOpen={!!selectedBookForDetails}
        onClose={() => setSelectedBookForDetails(null)}
        book={selectedBookForDetails}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!selectedBookForDelete}
        onClose={() => setSelectedBookForDelete(null)}
        book={selectedBookForDelete}
      />
    </PageContainer>
  );
};

export default Inventory;
