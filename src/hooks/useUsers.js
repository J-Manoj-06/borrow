import { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToUsers, 
  updateUserStatus, 
  updateUserBorrowLimit, 
  updateUserProfile 
} from '../services/userService';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [borrowingFilter, setBorrowingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Selected & Modal Targets
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusModalTarget, setStatusModalTarget] = useState(null);
  const [targetStatus, setTargetStatus] = useState('active');
  const [limitModalTarget, setLimitModalTarget] = useState(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Subscribe to users collection
  useEffect(() => {
    const unsubscribe = subscribeToUsers(
      (data) => {
        setUsers(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to fetch users list');
        setLoading(false);
      }
    );

    const timer = setTimeout(() => setLoading(false), 1500);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Compute realtime summary statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'active' || !u.status).length;
    const suspendedUsers = users.filter((u) => u.status === 'suspended').length;
    const pendingRegistrations = users.filter((u) => u.status === 'pending').length;
    
    const borrowedCount = users.reduce((acc, u) => acc + (u.activeBorrowCount || u.currentBorrowedCount || 0), 0);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingRegistrations,
      borrowedCount,
    };
  }, [users]);

  // Search & Filter computation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = u.name?.toLowerCase().includes(q);
        const regMatch = (u.registerNumber || u.rollNo || u.studentId)?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        const phoneMatch = u.phone?.toLowerCase().includes(q);
        const deptMatch = u.department?.toLowerCase().includes(q);

        if (!nameMatch && !regMatch && !emailMatch && !phoneMatch && !deptMatch) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'all') {
        const st = (u.status || 'active').toLowerCase();
        if (st !== statusFilter.toLowerCase()) return false;
      }

      // 3. Department Filter
      if (departmentFilter !== 'all') {
        if (u.department?.toLowerCase() !== departmentFilter.toLowerCase()) return false;
      }

      // 4. Semester Filter
      if (semesterFilter !== 'all') {
        if (u.semester?.toLowerCase() !== semesterFilter.toLowerCase()) return false;
      }

      // 5. Borrowing Status Filter
      if (borrowingFilter !== 'all') {
        const count = u.activeBorrowCount || 0;
        const limit = u.borrowLimit || 5;

        if (borrowingFilter === 'has_books' && count <= 0) return false;
        if (borrowingFilter === 'no_books' && count > 0) return false;
        if (borrowingFilter === 'limit_reached' && count < limit) return false;
      }

      return true;
    });
  }, [users, searchQuery, statusFilter, departmentFilter, semesterFilter, borrowingFilter]);

  // Sort computation
  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    list.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
    return list;
  }, [filteredUsers, sortBy]);

  // Status Modal Trigger
  const initiateStatusChange = (u, nextStatus) => {
    setStatusModalTarget(u);
    setTargetStatus(nextStatus);
  };

  // Confirm Status Change
  const confirmStatusChange = async () => {
    if (!statusModalTarget) return;
    setIsUpdatingStatus(true);
    try {
      await updateUserStatus(statusModalTarget.id, targetStatus, user?.email || 'Librarian');
      toast.success(`Account status for ${statusModalTarget.name || 'User'} updated to ${targetStatus.toUpperCase()}!`);
      setStatusModalTarget(null);
    } catch (err) {
      toast.error('Failed to update user status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Confirm Borrow Limit Update
  const confirmBorrowLimit = async (userId, newLimit) => {
    setIsUpdatingLimit(true);
    try {
      await updateUserBorrowLimit(userId, newLimit, user?.email || 'Librarian');
      toast.success(`Borrowing limit updated to ${newLimit} books!`);
      setLimitModalTarget(null);
    } catch (err) {
      toast.error('Failed to update borrowing limit.');
    } finally {
      setIsUpdatingLimit(false);
    }
  };

  // Confirm Profile Details Edit
  const handleProfileSave = async (userId, profileData) => {
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile(userId, profileData, user?.email || 'Librarian');
      toast.success('User profile contact details updated successfully!');
    } catch (err) {
      toast.error('Failed to update user profile details.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return {
    users: sortedUsers,
    allUsers: users,
    loading,
    error,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    semesterFilter,
    setSemesterFilter,
    borrowingFilter,
    setBorrowingFilter,
    sortBy,
    setSortBy,
    selectedUser,
    setSelectedUser,
    statusModalTarget,
    setStatusModalTarget,
    targetStatus,
    limitModalTarget,
    setLimitModalTarget,
    isUpdatingStatus,
    isUpdatingLimit,
    isUpdatingProfile,
    initiateStatusChange,
    confirmStatusChange,
    confirmBorrowLimit,
    handleProfileSave,
  };
};

export default useUsers;
