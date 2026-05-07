"use client";

import { useEffect } from "react";
import { useNotificationsStore } from "@/store/notificationsStore";

export function useNotifications() {
  const notifs = useNotificationsStore((s) => s.notifs);
  const loading = useNotificationsStore((s) => s.loading);
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);
  const handleDismiss = useNotificationsStore((s) => s.handleDismiss);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unread = notifs.filter((n) => !n.read).length;

  return {
    notifs,
    loading,
    unread,
    handleDismiss,
    markAllRead,
  };
}