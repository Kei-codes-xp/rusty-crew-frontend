'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { Notification } from '@/types';
import { usePolling } from '@/hooks/usePolling';

const POLL_MS = 20_000; // poll every 20 s for real-time feel

/**
 * Employee notification hook with polling.
 * Fetches from /notifications (backend already filters to current user).
 */
export function useEmployeeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading,       setLoading]       = useState(false);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      setNotifications(res.data);
    } catch {
      // silently fail on background poll
    }
  }, []);

  usePolling(fetch, POLL_MS);

  // ── Mark single as read ───────────────────────────────────────────────────
  async function dismiss(id: number): Promise<void> {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // rollback on failure
      await fetch();
    }
  }

  // ── Mark all as read ──────────────────────────────────────────────────────
  async function markAllRead(): Promise<void> {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.patch('/notifications/read-all');
    } catch {
      await fetch();
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const ICONS: Record<string, string> = {
    shift: '📅',
    leave: '🏖',
    late:  '⏰',
    swap:  '🔄',
  };

  return { notifications, loading, unreadCount, dismiss, markAllRead, ICONS };
}