
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface UseBalanceRefreshOptions {
  interval?: number;
  enabled?: boolean;
}

export const useBalanceRefresh = (options: UseBalanceRefreshOptions = {}) => {
  const { interval = 5000, enabled = true } = options; // Changed from 10000 to 5000 ms (5 seconds)
  const { user, refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Refresh user data on a regular interval
  useEffect(() => {
    if (!enabled) return;

    let intervalId: number | undefined;

    const refresh = async () => {
      try {
        setIsRefreshing(true);
        await refreshUser();
        setLastRefreshed(new Date());
      } catch (error) {
        console.error('Error refreshing user balance:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Set up the interval
    intervalId = window.setInterval(refresh, interval);

    // Clean up the interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [enabled, interval, refreshUser]);

  // Force a refresh manually
  const forceRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      await refreshUser();
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error refreshing user balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    balances: user?.balances || {},
    isRefreshing,
    lastRefreshed,
    forceRefresh
  };
};
