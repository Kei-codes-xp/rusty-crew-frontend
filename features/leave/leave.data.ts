// features/leave/leave.data.ts

import { LeaveRequest } from "@/types/leave";

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 1,
    from: "2026-05-10",
    to: "2026-05-11",
    reason: "Sick",
    type: "Sick",
    status: "Pending",
  },
  {
    id: 2,
    employeeId: 2,
    from: "2026-05-15",
    to: "2026-05-16",
    reason: "Vacation trip",
    type: "Vacation",
    status: "Approved",
  },
  {
    id: 3,
    employeeId: 3,
    from: "2026-05-08",
    to: "2026-05-08",
    reason: "Emergency",
    type: "Emergency",
    status: "Denied",
  },
];