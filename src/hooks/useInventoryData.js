import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { subscribeToBooksInventory } from '../services/inventoryService';

export const useInventoryData = () => {
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state initialized from URL query params
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => urlStatus || 'all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');

  // Sorting state
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // LocalStorage view mode preference ('grid' | 'list')
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('borrow_inventory_view') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const changeViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('borrow_inventory_view', mode);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  };

  // Sync statusFilter with URL query params when deep linked
  useEffect(() => {
    if (urlStatus && urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  // Subscribe to Firestore books
  useEffect(() => {
    const unsubscribe = subscribeToBooksInventory(
      (data) => {
        setBooks(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to fetch inventory books');
        setLoading(false);
      }
    );

    // Timeout safety fallback for initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Filtered & Searched books calculation
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // 1. Search Query Matching across title, author, isbn, publisher, category, keywords
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase().trim();
        const titleMatch = book.title?.toLowerCase().includes(queryLower);
        const authorMatch = book.author?.toLowerCase().includes(queryLower);
        const isbnMatch = book.isbn?.toLowerCase().includes(queryLower);
        const publisherMatch = book.publisher?.toLowerCase().includes(queryLower);
        const categoryMatch = book.category?.toLowerCase().includes(queryLower);
        const keywordMatch = Array.isArray(book.keywords)
          ? book.keywords.some((k) => k.toLowerCase().includes(queryLower))
          : book.keywords?.toLowerCase().includes(queryLower);

        if (!titleMatch && !authorMatch && !isbnMatch && !publisherMatch && !categoryMatch && !keywordMatch) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        const status = (book.status || 'available').toLowerCase();
        if (statusFilter === 'available' && status !== 'available' && (book.availableCopies ?? 0) <= 0) return false;
        if (statusFilter === 'borrowed' && status !== 'borrowed' && (book.availableCopies ?? 0) > 0) return false;
        if (statusFilter === 'maintenance' && status !== 'maintenance') return false;
        if (statusFilter === 'archived' && status !== 'archived') return false;
      }

      // 3. Category Filter
      if (categoryFilter !== 'all') {
        if (book.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Department Filter
      if (departmentFilter !== 'all') {
        if (book.department?.toLowerCase() !== departmentFilter.toLowerCase()) {
          return false;
        }
      }

      // 5. Language Filter
      if (languageFilter !== 'all') {
        if (book.language?.toLowerCase() !== languageFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [books, searchQuery, statusFilter, categoryFilter, departmentFilter, languageFilter]);

  // Sorted books calculation
  const sortedBooks = useMemo(() => {
    const list = [...filteredBooks];
    list.sort((a, b) => {
      switch (sortBy) {
        case 'newest': {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateB - dateA;
        }
        case 'oldest': {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
          return dateA - dateB;
        }
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'author':
          return (a.author || '').localeCompare(b.author || '');
        case 'borrowCount':
          return (b.borrowCount || 0) - (a.borrowCount || 0);
        case 'availableCopies':
          return (b.availableCopies || 0) - (a.availableCopies || 0);
        case 'updatedAt': {
          const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
          const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
          return dateB - dateA;
        }
        default:
          return 0;
      }
    });
    return list;
  }, [filteredBooks, sortBy]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, departmentFilter, languageFilter, sortBy]);

  // Paginated slices
  const totalItems = sortedBooks.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBooks.slice(start, start + pageSize);
  }, [sortedBooks, currentPage, pageSize]);

  return {
    books: paginatedBooks,
    allBooks: books,
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
    setViewMode: changeViewMode,
  };
};

export default useInventoryData;
