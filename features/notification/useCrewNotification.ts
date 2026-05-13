'use client';

import { useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Notification } from '@/types/notification';
import { useState } from 'react';

export function useEmployeeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const ICONS: Record<string, string> = {
    late: '⏰',
    swap: '🔄',
    leave: '🏖',
    shift: '📅',
    default: '🔔',
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications/crew');

      setNotifications(res.data.data ?? res.data);
      console.log('Fetched notifications:', res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error('Failed to dismiss:', err);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    dismiss,
    markAllRead,
    ICONS,
    fetchNotifications,
  };
}