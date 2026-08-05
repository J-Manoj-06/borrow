import { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToBorrowRequests, 
  fetchBookAvailability, 
  approveBorrowRequest, 
  rejectBorrowRequest 
} from '../services/borrowRequestService';
import { subscribeToBooksInventory } from '../services/inventoryService';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useBorrowRequests = () => {
  const { user } = useAuth();

  const [rawRequests, setRawRequests] = useState([]);
  const [booksCatalog, setBooksCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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
  const [rejectReason, setRejectReason] = useState('Out of Stock');
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Filter requests to only include valid books uploaded by librarians
  const validRequests = useMemo(() => {
    if (booksCatalog.length === 0) return rawRequests;
    const validBookIds = new Set(booksCatalog.map((b) => b.id));
    return rawRequests.filter((req) => !req.bookId || validBookIds.has(req.bookId));
  }, [rawRequests, booksCatalog]);

  // Compute Summary Statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();

    const pendingCount = validRequests.filter((r) => (r.status || 'Pending').toLowerCase() === 'pending').length;

    const approvedTodayCount = validRequests.filter((r) => {
      if (r.status !== 'Approved') return false;
      const d = r.approvedAt ? (r.approvedAt.toDate ? r.approvedAt.toDate() : new Date(r.approvedAt)) : null;
      return d && d.toDateString() === todayStr;
    }).length;

    const rejectedTodayCount = validRequests.filter((r) => {
      if (r.status !== 'Rejected') return false;
      const d = r.rejectedAt ? (r.rejectedAt.toDate ? r.rejectedAt.toDate() : new Date(r.rejectedAt)) : null;
      return d && d.toDateString() === todayStr;
    }).length;

    return {
      pendingCount,
      approvedTodayCount,
      rejectedTodayCount,
      processedTodayCount: approvedTodayCount + rejectedTodayCount,
    };
  }, [validRequests]);

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
        if ((req.status || 'Pending').toLowerCase() !== statusFilter.toLowerCase()) {
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
      await approveBorrowRequest(selectedRequest.id, user?.email || 'Librarian');
      toast.success(`Request for "${selectedRequest.bookTitle}" approved!`);
      setShowApproveModal(false);
      handleCloseDrawer();
    } catch (err) {
      toast.error(err?.message || 'Failed to approve request.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Reject Request
  const handleConfirmReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await rejectBorrowRequest(selectedRequest.id, rejectReason, user?.email || 'Librarian');
      toast.success(`Request rejected: ${rejectReason}`);
      setShowRejectModal(false);
      handleCloseDrawer();
    } catch (err) {
      toast.error(err?.message || 'Failed to reject request.');
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
