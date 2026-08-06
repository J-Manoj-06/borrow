import { useState, useEffect, useMemo } from 'react';
import { subscribeToLiveAnalytics } from '../services/analyticsService';

function parseDate(val) {
  if (!val) return null;
  if (val.toDate) return val.toDate();
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}
//hryfr

function isDateInHorizon(dateObj, horizon) {
  if (!dateObj) return horizon === 'all';
  const now = new Date();
  const todayStr = now.toDateString();

  switch (horizon) {
    case 'today':
      return dateObj.toDateString() === todayStr;
    case 'week': {
      const diffTime = now - dateObj;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    case 'month':
      return dateObj.getMonth() === now.getMonth() && dateObj.getFullYear() === now.getFullYear();
    case 'last_month': {
      const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return dateObj.getMonth() === lastM.getMonth() && dateObj.getFullYear() === lastM.getFullYear();
    }
    case 'six_months': {
      const diffTime = now - dateObj;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 180;
    }
    case 'year':
      return dateObj.getFullYear() === now.getFullYear();
    case 'all':
    default:
      return true;
  }
}

export const useAnalytics = () => {
  const [rawData, setRawData] = useState({
    books: [],
    transactions: [],
    users: [],
    requests: [],
    activityLogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('all'); // 'today' | 'week' | 'month' | 'last_month' | 'six_months' | 'year' | 'all'

  // Subscriptions
  useEffect(() => {
    const unsubscribe = subscribeToLiveAnalytics(
      (data) => {
        setRawData(data);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Failed to load live analytics');
        setLoading(false);
      }
    );

    const timer = setTimeout(() => setLoading(false), 1200);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Compute 100% Realtime Analytics based on Firestore data and Date Range Filter
  const analytics = useMemo(() => {
    const { books, transactions, users, requests, activityLogs } = rawData;
    const now = new Date();
    const todayStr = now.toDateString();

    // Filtered by Time Horizon
    const horizonTransactions = transactions.filter((t) => {
      const d = parseDate(t.createdAt || t.issueDate);
      return isDateInHorizon(d, dateRange);
    });

    const horizonBooks = books.filter((b) => {
      const d = parseDate(b.createdAt);
      return isDateInHorizon(d, dateRange);
    });

    const horizonRequests = requests.filter((r) => {
      const d = parseDate(r.createdAt || r.requestDate);
      return isDateInHorizon(d, dateRange);
    });

    // 1. Dynamic Summary Cards
    const totalBooks = books.reduce((acc, b) => acc + Number(b.totalCopies || 1), 0);
    const availableBooks = books.reduce((acc, b) => acc + Number(b.availableCopies !== undefined ? b.availableCopies : 1), 0);
    const issuedBooks = Math.max(0, totalBooks - availableBooks);
    const totalUsers = users.length;
    const totalTransactions = horizonTransactions.length;

    const isPending = (status) => {
      if (!status) return true;
      const s = String(status).trim().toLowerCase();
      return s === 'pending' || s === 'requested' || s === 'request';
    };

    const pendingRequests = requests.filter((r) => isPending(r.status)).length;
    const approvedRequests = requests.filter((r) => (r.status || '').toLowerCase() === 'approved').length;

    const returnedToday = transactions.filter((t) => {
      if ((t.status || '').toLowerCase() !== 'returned') return false;
      const d = parseDate(t.returnDate);
      return d && d.toDateString() === todayStr;
    }).length;

    const overdueBooks = transactions.filter((t) => {
      const st = (t.status || '').toLowerCase();
      if (st === 'returned') return false;
      const due = parseDate(t.dueDate);
      return due && now > due;
    }).length;

    const booksAdded = horizonBooks.length;

    // 2. Monthly Borrow Trend (Line Chart - Exact integers only)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyBorrowTrend = monthNames.map((m, idx) => {
      const count = transactions.filter((t) => {
        const d = parseDate(t.createdAt || t.issueDate);
        return d && d.getMonth() === idx;
      }).length;
      return { month: m, borrows: count };
    });

    // 3. Books Added Per Month (Bar Chart - Exact integers only)
    const booksAddedTrend = monthNames.map((m, idx) => {
      const count = books.filter((b) => {
        const d = parseDate(b.createdAt);
        return d && d.getMonth() === idx;
      }).length;
      return { month: m, added: count };
    });

    // 4. Category Analytics (Pie Chart)
    const categoryMap = {};
    books.forEach((b) => {
      const cat = b.category || 'Academic';
      categoryMap[cat] = (categoryMap[cat] || 0) + (b.totalCopies || 1);
    });
    const categoryDistribution = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat],
    }));

    // 5. Department Analytics
    const deptMap = {};
    transactions.forEach((t) => {
      const dept = t.department || 'Computer Science';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, booksBorrowed: 0, usersCount: 0, totalTransactions: 0 };
      }
      deptMap[dept].booksBorrowed += 1;
      deptMap[dept].totalTransactions += 1;
    });

    users.forEach((u) => {
      const dept = u.department || 'Computer Science';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, booksBorrowed: 0, usersCount: 0, totalTransactions: 0 };
      }
      deptMap[dept].usersCount += 1;
    });

    const departmentAnalytics = Object.values(deptMap);
    let mostActiveDepartment = 'N/A';
    if (departmentAnalytics.length > 0) {
      const sorted = [...departmentAnalytics].sort((a, b) => b.totalTransactions - a.totalTransactions);
      mostActiveDepartment = sorted[0]?.name || 'N/A';
    }

    // 6. Top Borrowed Books (Top 10)
    const sortedPopularBooks = [...books]
      .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0))
      .slice(0, 10);

    // 7. Least Borrowed Books (Top 5)
    const sortedLeastUsedBooks = [...books]
      .sort((a, b) => (a.borrowCount || 0) - (b.borrowCount || 0))
      .slice(0, 5);

    // 8. Overdue Report Table
    const overdueReport = transactions
      .filter((t) => {
        const st = (t.status || '').toLowerCase();
        if (st === 'returned') return false;
        const due = parseDate(t.dueDate);
        return due && now > due;
      })
      .map((t) => {
        const due = parseDate(t.dueDate);
        const daysOverdue = Math.max(1, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
        return {
          ...t,
          daysOverdue,
        };
      });

    // 9. Inventory Health Breakdown
    const totalCopiesSum = books.reduce((acc, b) => acc + Number(b.totalCopies || 1), 0);
    const availableCopiesSum = books.reduce((acc, b) => acc + Number(b.availableCopies !== undefined ? b.availableCopies : 1), 0);
    const issuedCopiesSum = Math.max(0, totalCopiesSum - availableCopiesSum);
    const maintenanceCount = books.filter((b) => (b.status || '').toLowerCase() === 'maintenance').length;
    const archivedCount = books.filter((b) => b.isArchived || (b.status || '').toLowerCase() === 'archived').length;
    const referenceCount = books.filter((b) => (b.category || '').toLowerCase() === 'reference').length;

    const inventoryHealth = {
      totalCopies: totalCopiesSum,
      availableCopies: availableCopiesSum,
      issuedCopies: issuedCopiesSum,
      maintenance: maintenanceCount,
      archived: archivedCount,
      reference: referenceCount,
    };

    // 10. Most Active Students Ranking
    const studentMap = {};
    transactions.forEach((t) => {
      const name = t.studentName || t.studentEmail || 'Student';
      if (!studentMap[name]) {
        studentMap[name] = {
          studentName: name,
          department: t.department || 'General',
          booksBorrowed: 0,
          currentActive: 0,
        };
      }
      studentMap[name].booksBorrowed += 1;
      if ((t.status || '').toLowerCase() === 'issued' || (t.status || '').toLowerCase() === 'extended') {
        studentMap[name].currentActive += 1;
      }
    });

    const activeStudentsList = Object.values(studentMap)
      .sort((a, b) => b.booksBorrowed - a.booksBorrowed)
      .slice(0, 10);

    // 11. Recent Activity Logs (Top 20)
    const sortedActivityLogs = [...activityLogs]
      .sort((a, b) => {
        const dateA = parseDate(a.timestamp) || new Date(0);
        const dateB = parseDate(b.timestamp) || new Date(0);
        return dateB - dateA;
      })
      .slice(0, 20);

    return {
      stats: {
        totalBooks,
        availableBooks,
        issuedBooks,
        totalUsers,
        totalTransactions,
        pendingRequests,
        approvedRequests,
        returnedToday,
        overdueBooks,
        booksAdded,
      },
      charts: {
        monthlyBorrowTrend,
        booksAddedTrend,
        categoryDistribution,
        departmentAnalytics,
      },
      popularBooks: sortedPopularBooks,
      leastUsedBooks: sortedLeastUsedBooks,
      activeStudentsList,
      overdueReport,
      inventoryHealth,
      mostActiveDepartment,
      recentActivityLogs: sortedActivityLogs,
    };
  }, [rawData, dateRange]);

  return {
    loading,
    error,
    dateRange,
    setDateRange,
    ...analytics,
  };
};

export default useAnalytics;
