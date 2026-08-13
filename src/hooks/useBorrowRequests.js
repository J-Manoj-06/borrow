import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  subscribeToBorrowRequests, 
  fetchBookAvailability, 
  approveBorrowRequest, 
  rejectBorrowRequest 
} from '../services/borrowRequestService';
import { subscribeToBooksInventory } from '../services/inventoryService';
import { useBorrowRequestStats } from './useBorrowRequestStats';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import { isPendingRequest, isApprovedRequest, isRejectedRequest } from '../utils/requestHelpers';

export const useBorrowRequests = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  // Firestore statistics hook
  const {
    pendingCount,
    approvedTodayCount,
    rejectedTodayCount,
    processedTodayCount,
    loading: statsLoading,
    error: statsError,
    refreshStream: refreshStatsStream,
  } = useBorrowRequestStats();

  const [rawRequests, setRawRequests] = useState([]);
  const [booksCatalog, setBooksCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state initialized from URL query params
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => urlStatus || 'All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Selected Request Drawer state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bookAvailability, setBookAvailability] = useState(null);
  const [isCheckingBook, setIsCheckingBook] = useState(false);

  // Action Modals State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Book Currently Unavailable');
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync statusFilter with URL search params when deep linked
  useEffect(() => {
    if (urlStatus && urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  // Subscriptions
  useEffect(() => {
    const unsubBooks = subscribeToBooksInventory(
      (bData) => setBooksCatalog(bData),
      (bErr) => console.warn('Books catalog error:', bErr)
    );

    const unsubReqs = subscribeToBorrowRequests(
      (data) => {
        setRawRequests(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to listen to borrow requests.');
        setLoading(false);
      }
    );

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      if (unsubBooks) unsubBooks();
      if (unsubReqs) unsubReqs();
    };
  }, []);

  // Filter and enrich requests with book information (ISBN, cover, title) from catalog if missing on request
  const validRequests = useMemo(() => {
    const booksMap = new Map();
    booksCatalog.forEach((b) => {
      if (b.id) booksMap.set(b.id, b);
    });

    const validBookIds = new Set(booksCatalog.map((b) => b.id));
    const baseList = booksCatalog.length === 0
      ? rawRequests
      : rawRequests.filter((req) => !req.bookId || validBookIds.has(req.bookId));

    return baseList.map((req) => {
      const matchedBook = req.bookId ? booksMap.get(req.bookId) : null;

      // Resolve ISBN across request properties & matched catalog book
      const resolvedIsbn =
        (req.isbn && req.isbn !== 'N/A' && req.isbn !== 'null' && req.isbn !== 'undefined') ? req.isbn :
        (req.bookIsbn && req.bookIsbn !== 'N/A') ? req.bookIsbn :
        (matchedBook?.isbn && matchedBook?.isbn !== 'N/A') ? matchedBook.isbn :
        (matchedBook?.ISBN && matchedBook?.ISBN !== 'N/A') ? matchedBook.ISBN :
        (req.isbn || 'N/A');

      const resolvedTitle = req.bookTitle || req.title || matchedBook?.title || 'Untitled Book';
      const resolvedCover = req.bookCover || req.cover || matchedBook?.coverImage || matchedBook?.cover || matchedBook?.imageUrl || '';
      const resolvedCategory = req.category || matchedBook?.category || 'General';
      const resolvedDepartment = req.department || matchedBook?.department || 'General';

      return {
        ...req,
        isbn: resolvedIsbn,
        bookTitle: resolvedTitle,
        bookCover: resolvedCover,
        category: resolvedCategory,
        department: resolvedDepartment,
      };
    });
  }, [rawRequests, booksCatalog]);

  const stats = useMemo(() => ({
    pendingCount,
    approvedTodayCount,
    rejectedTodayCount,
    processedTodayCount,
  }), [pendingCount, approvedTodayCount, rejectedTodayCount, processedTodayCount]);

  // Filtered & Searched Requests List
  const filteredRequests = useMemo(() => {
    return validRequests.filter((req) => {
      // 1. Search Matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const studentMatch = req.studentName?.toLowerCase().includes(q) || req.requestedBy?.toLowerCase().includes(q);
        const regMatch = (req.studentId || req.registerNumber)?.toLowerCase().includes(q);
        const bookMatch = req.bookTitle?.toLowerCase().includes(q);
        const isbnMatch = req.isbn?.toLowerCase().includes(q);
        const deptMatch = req.department?.toLowerCase().includes(q);

        if (!studentMatch && !regMatch && !bookMatch && !isbnMatch && !deptMatch) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'All') {
        const filterSt = statusFilter.toLowerCase();
        if (filterSt === 'pending') {
          if (!isPendingRequest(req.status)) return false;
        } else if (filterSt === 'approved') {
          if (!isApprovedRequest(req.status)) return false;
        } else if (filterSt === 'rejected') {
          if (!isRejectedRequest(req.status)) return false;
        } else if ((req.status || '').toLowerCase() !== filterSt) {
          return false;
        }
      }

      // 3. Department Filter
      if (departmentFilter !== 'All') {
        if (req.department?.toLowerCase() !== departmentFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Category Filter
      if (categoryFilter !== 'All') {
        if (req.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  }, [validRequests, searchQuery, statusFilter, departmentFilter, categoryFilter, sortBy]);

  // Open Drawer & Inspect Book Availability
  const handleOpenDrawer = async (request) => {
    setSelectedRequest(request);
    setIsCheckingBook(true);
    try {
      const avail = await fetchBookAvailability(request.bookId);
      setBookAvailability(avail);
    } catch {
      setBookAvailability({ availableCopies: 0, totalCopies: 0, exists: false });
    } finally {
      setIsCheckingBook(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedRequest(null);
    setBookAvailability(null);
  };

  // Execute Approve Request
  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await approveBorrowRequest(selectedRequest.id, user || 'Librarian');
      toast.success('Borrow request approved.');
      setShowApproveModal(false);
      handleCloseDrawer();
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error(err?.message || 'Failed to approve borrow request.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Reject Request
  const handleConfirmReject = async (overrideReason) => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    const finalReason = typeof overrideReason === 'string' ? overrideReason : rejectReason;
    try {
      await rejectBorrowRequest(selectedRequest.id, finalReason, user || 'Librarian');
      toast.success('Borrow request rejected.');
      setShowRejectModal(false);
      handleCloseDrawer();
    } catch (err) {
      console.error('Rejection failed:', err);
      toast.error(err?.message || 'Failed to reject borrow request.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    requests: filteredRequests,
    allRequests: validRequests,
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
  };
};

export default useBorrowRequests;
