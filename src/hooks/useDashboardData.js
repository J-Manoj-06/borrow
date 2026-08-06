import { useState, useEffect } from 'react';
import { 
  subscribeToBooks, 
  subscribeToTransactions, 
  subscribeToBorrowRequests, 
  subscribeToActivityLogs 
} from '../services/dashboardService';

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    booksIssued: 0,
    pendingRequests: 0,
    overdueBooks: 0,
    returnedToday: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubs = [];
    let loadedCount = 0;

    const checkLoadingDone = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        setLoading(false);
      }
    };

    // 1. Subscribe to Books
    const unsubBooks = subscribeToBooks(
      (booksData) => {
        const total = booksData.reduce((acc, b) => acc + (b.totalCopies || 1), 0);
        const available = booksData.reduce((acc, b) => acc + (b.availableCopies !== undefined ? b.availableCopies : 1), 0);

        setStats(prev => ({
          ...prev,
          totalBooks: total || booksData.length,
          availableBooks: available,
        }));

        // Popular books
        const sortedPopular = [...booksData]
          .sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0))
          .slice(0, 4);
        setPopularBooks(sortedPopular);

        // Chart data
        const daysMap = {};
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          daysMap[dateStr] = 0;
        }

        booksData.forEach(book => {
          if (book.createdAt) {
            const dateObj = book.createdAt.toDate ? book.createdAt.toDate() : new Date(book.createdAt);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (daysMap[dateStr] !== undefined) {
              daysMap[dateStr] += 1;
            }
          }
        });

        const formattedChart = Object.keys(daysMap).map(date => ({
          date,
          books: daysMap[date],
        }));
        setChartData(formattedChart);

        checkLoadingDone();
      },
      (err) => {
        setError(err?.message || 'Failed to sync books data');
        checkLoadingDone();
      }
    );
    unsubs.push(unsubBooks);

    // 2. Subscribe to Transactions
    const unsubTrans = subscribeToTransactions(
      (transData) => {
        const todayStr = new Date().toDateString();
        const activeLoans = transData.filter(t => t.status === 'issued' || t.status === 'extended').length;
        const overdue = transData.filter(t => {
          if (t.status !== 'issued' && t.status !== 'extended') return false;
          const due = t.dueDate ? (t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate)) : null;
          return due && new Date() > due;
        }).length;

        const returnedCountToday = transData.filter(t => {
          if (t.status !== 'returned') return false;
          const ret = t.returnDate ? (t.returnDate.toDate ? t.returnDate.toDate() : new Date(t.returnDate)) : null;
          return ret && ret.toDateString() === todayStr;
        }).length;

        setStats(prev => ({
          ...prev,
          booksIssued: activeLoans,
          overdueBooks: overdue,
          returnedToday: returnedCountToday,
        }));
        checkLoadingDone();
      },
      (err) => {
        setError(err?.message || 'Failed to sync transactions data');
        checkLoadingDone();
      }
    );
    unsubs.push(unsubTrans);

    // 3. Subscribe to Borrow Requests
    const unsubReqs = subscribeToBorrowRequests(
      (reqsData) => {
        const isPending = (status) => {
          if (!status) return true;
          const s = String(status).trim().toLowerCase();
          return s === 'pending' || s === 'requested' || s === 'request';
        };

        const pending = reqsData.filter(r => isPending(r.status)).length;
        setStats(prev => ({
          ...prev,
          pendingRequests: pending,
        }));

        // Sort pending requests first, newest first
        const sortedReqs = [...reqsData]
          .filter(r => isPending(r.status))
          .sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return timeB - timeA;
          })
          .slice(0, 5);

        // If no pending requests, fallback to latest requests overall
        if (sortedReqs.length === 0 && reqsData.length > 0) {
          const fallbackReqs = [...reqsData]
            .sort((a, b) => {
              const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
              const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
              return timeB - timeA;
            })
            .slice(0, 5);
          setRecentRequests(fallbackReqs);
        } else {
          setRecentRequests(sortedReqs);
        }

        checkLoadingDone();
      },
      (err) => {
        setError(err?.message || 'Failed to sync borrow requests');
        checkLoadingDone();
      }
    );
    unsubs.push(unsubReqs);

    // 4. Subscribe to Activity Logs
    const unsubActivity = subscribeToActivityLogs(
      (logsData) => {
        const sortedLogs = [...logsData].sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || 0);
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp || 0);
          return timeB - timeA;
        });
        setActivityLogs(sortedLogs);
        checkLoadingDone();
      },
      (err) => {
        setError(err?.message || 'Failed to sync activity logs');
        checkLoadingDone();
      }
    );
    unsubs.push(unsubActivity);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timeout);
      unsubs.forEach(unsub => unsub && unsub());
    };
  }, []);

  return {
    stats,
    recentRequests,
    activityLogs,
    popularBooks,
    chartData,
    loading,
    error,
  };
};

export default useDashboardData;
