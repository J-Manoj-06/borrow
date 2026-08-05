import { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToTransactions, 
  issueBookTransaction, 
  returnBookTransaction, 
  extendDueDateTransaction 
} from '../services/transactionService';
import { subscribeToBorrowRequests } from '../services/borrowRequestService';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useTransactions = () => {
  const { user } = useAuth();

  const [rawTransactions, setRawTransactions] = useState([]);
  const [rawRequests, setRawRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Tab: 'pending_issue' | 'active_borrowings' | 'history'
  const [activeTab, setActiveTab] = useState('pending_issue');

  // Search & Filters for History Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals / Drawer State
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [extendTarget, setExtendTarget] = useState(null);

  const [isIssuing, setIsIssuing] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Realtime Subscriptions
  useEffect(() => {
    const unsubTrans = subscribeToTransactions(
      (tData) => {
        setRawTransactions(tData);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to fetch transactions');
        setLoading(false);
      }
    );

    const unsubReqs = subscribeToBorrowRequests(
      (rData) => setRawRequests(rData),
      () => {}
    );

    const timer = setTimeout(() => setLoading(false), 1200);

    return () => {
      clearTimeout(timer);
      if (unsubTrans) unsubTrans();
      if (unsubReqs) unsubReqs();
    };
  }, []);

  // Filter 1: Pending Issue Requests (Borrow Requests approved by librarian, awaiting physical issue)
  const pendingIssueRequests = useMemo(() => {
    return rawRequests.filter((r) => (r.status || '').toLowerCase() === 'approved');
  }, [rawRequests]);

  // Filter 2: Active Borrowings (Transactions currently issued or extended)
  const activeBorrowings = useMemo(() => {
    return rawTransactions.filter(
      (t) => (t.status || '').toLowerCase() === 'issued' || (t.status || '').toLowerCase() === 'extended'
    );
  }, [rawTransactions]);

  // Filter 3: History Transactions (Completed / Returned / Lost / Damaged)
  const historyTransactions = useMemo(() => {
    return rawTransactions.filter((t) => {
      const st = (t.status || '').toLowerCase();
      return st !== 'issued' && st !== 'extended';
    });
  }, [rawTransactions]);

  // Compute Statistics
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();

    const currentlyIssued = activeBorrowings.length;
    const returnedToday = rawTransactions.filter((t) => {
      if (t.status !== 'returned') return false;
      const d = t.returnDate ? (t.returnDate.toDate ? t.returnDate.toDate() : new Date(t.returnDate)) : null;
      return d && d.toDateString() === todayStr;
    }).length;

    const overdueCount = activeBorrowings.filter((t) => {
      const due = t.dueDate ? (t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate)) : null;
      return due && new Date() > due;
    }).length;

    return {
      pendingIssueCount: pendingIssueRequests.length,
      currentlyIssued,
      returnedToday,
      overdueCount,
    };
  }, [pendingIssueRequests, activeBorrowings, rawTransactions]);

  // Handler: Issue Book from Approved Request
  const handleIssueApprovedRequest = async (approvedReq) => {
    if (!approvedReq) return;
    setIsIssuing(true);
    try {
      const issuePayload = {
        bookId: approvedReq.bookId,
        bookTitle: approvedReq.bookTitle || 'Untitled Book',
        isbn: approvedReq.isbn || 'N/A',
        bookCover: approvedReq.bookCover || '',
        studentId: approvedReq.studentId || approvedReq.requestedBy || 'N/A',
        studentName: approvedReq.studentName || approvedReq.requestedBy || 'Student',
        studentRollNo: approvedReq.studentId || approvedReq.registerNumber || 'N/A',
        department: approvedReq.department || 'General',
        requestId: approvedReq.id,
      };

      await issueBookTransaction(issuePayload, user?.email || 'Librarian');
      toast.success(`Book "${approvedReq.bookTitle}" issued to ${approvedReq.studentName || approvedReq.requestedBy}!`);
      setActiveTab('active_borrowings');
    } catch (err) {
      console.error('Error issuing approved book:', err);
      toast.error(err?.message || 'Failed to issue book.');
    } finally {
      setIsIssuing(false);
    }
  };

  // Handler: Return Book Active Borrowing
  const handleReturnActiveBorrowing = async (transaction) => {
    if (!transaction) return;
    setIsReturning(true);
    try {
      await returnBookTransaction(
        transaction.id,
        {
          bookId: transaction.bookId,
          bookTitle: transaction.bookTitle,
          studentId: transaction.studentId,
          studentName: transaction.studentName,
          condition: 'excellent',
          remarks: 'Returned via librarian admin dashboard',
        },
        user?.email || 'Librarian'
      );
      toast.success(`Book "${transaction.bookTitle}" returned to library stock!`);
    } catch (err) {
      console.error('Error returning book:', err);
      toast.error(err?.message || 'Failed to process book return.');
    } finally {
      setIsReturning(false);
    }
  };

  // Handler: Extend Due Date
  const handleExtendSubmit = async (newDueDate, reason) => {
    if (!extendTarget) return;
    setIsExtending(true);
    try {
      await extendDueDateTransaction(extendTarget.id, newDueDate, reason, user?.email || 'Librarian');
      toast.success('Due date extended successfully!');
      setExtendTarget(null);
    } catch (err) {
      toast.error('Failed to extend due date.');
    } finally {
      setIsExtending(false);
    }
  };

  return {
    pendingIssueRequests,
    activeBorrowings,
    historyTransactions,
    rawTransactions,
    loading,
    error,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    sortBy,
    setSortBy,
    selectedTransaction,
    setSelectedTransaction,
    extendTarget,
    setExtendTarget,
    isIssuing,
    isReturning,
    isExtending,
    handleIssueApprovedRequest,
    handleReturnActiveBorrowing,
    handleExtendSubmit,
  };
};

export default useTransactions;
