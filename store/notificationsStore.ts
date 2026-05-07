import { create } from "zustand";
import api from "@/lib/api";
import { Notification } from "@/types/notification";

type NotificationStore = {
  notifs: Notification[];
  loading: boolean;
  unread: number;

  fetchNotifications: () => Promise<void>;
  handleDismiss: (id: number) => Promise<void>;
  markAllRead: () => void;
};

export const useNotificationsStore = create<NotificationStore>((set, get) => ({
  notifs: [],
  loading: false,
  unread: 0,

  fetchNotifications: async () => {
    try {
      const res = await api.get("/notifications");

      const data = res.data.data ?? res.data;

      set({
        notifs: data,
        unread: data.filter((n: Notification) => !n.read).length,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },

  handleDismiss: async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      const updated = get().notifs.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      set({
        notifs: updated,
        unread: updated.filter((n) => !n.read).length,
      });
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  },

  markAllRead: () => {
    set((state) => ({
      notifs: state.notifs.map(n => ({ ...n, read: true })),
      unread: 0,
    }));
  },
}));