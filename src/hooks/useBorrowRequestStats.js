import { useState, useEffect, useCallback } from 'react';
import { subscribeToBorrowRequestStats } from '../services/borrowRequestStatsService';

export function useBorrowRequestStats() {
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedTodayCount: 0,
    rejectedTodayCount: 0,
    processedTodayCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refreshStream = useCallback(() => {
    setLoading(true);
    setError(null);
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToBorrowRequestStats(
      (newStats) => {
        setStats(newStats);
        setLoading(false);
      },
      (err) => {
        setError(err?.message || 'Unable to load statistics');
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [refreshIndex]);

  return {
    pendingCount: stats.pendingCount,
    approvedTodayCount: stats.approvedTodayCount,
    rejectedTodayCount: stats.rejectedTodayCount,
    processedTodayCount: stats.processedTodayCount,
    loading,
    error,
    refreshStream,
  };
}

export default useBorrowRequestStats;
