// features/notification/notification.data.ts

import { Notification  } from "@/types/notification";

export const INITIAL_NOTIFICATIONS:Notification [] = [
  {
    id: 1,
    type: "late",
    message: "",
    time: "06:08 AM",
    read: false,
  },
  {
    id: 2,
    type: "swap",
    message: "Kyla Santos requested a shift swap",
    time: "Yesterday",
    read: false,
  },
  {
    id: 3,
    type: "leave",
    message: "Ana Lim filed a sick leave request",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    type: "shift",
    message: "Shift reminder: Afternoon crew at 2:00 PM",
    time: "Today",
    read: true,
  },
];