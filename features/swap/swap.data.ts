// features/swap/swap.data.ts

import { SwapRequest } from "@/types/schedule";

export const INITIAL_SWAPS: SwapRequest[] = [
  {
    id: 1,
    requesterId: 5,
    targetId: 4,
    date: "2026-05-02",
    shiftType: "Afternoon",
    status: "Pending",
    note: "Family event",
  },
  {
    id: 2,
    requesterId: 6,
    targetId: 1,
    date: "2026-05-03",
    shiftType: "Morning",
    status: "Pending",
    note: "Doctor appointment",
  },
];