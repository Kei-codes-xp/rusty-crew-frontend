// features/attendance/attendance.data.ts

import { TimeLog } from "@/types/attendance";

export const INITIAL_TIME_LOGS: TimeLog[] = [
  {
    id: 1,
    employeeId: 1,
    date: "2026-05-04",
    clockIn: "06:02",
    clockOut: "14:05",
    hoursWorked: 8.05,
    overtime: 0,
    status: "On time",
    method: "QR",
  },
  {
    id: 2,
    employeeId: 2,
    date: "2026-05-04",
    clockIn: "06:08",
    clockOut: "14:00",
    hoursWorked: 7.87,
    overtime: 0,
    status: "Late",
    method: "QR",
  },
  {
    id: 3,
    employeeId: 3,
    date: "2026-05-04",
    clockIn: "07:58",
    clockOut: null,
    hoursWorked: 0,
    overtime: 0,
    status: "On time",
    method: "Manual",
  },
  {
    id: 4,
    employeeId: 4,
    date: "2026-05-04",
    clockIn: "13:55",
    clockOut: null,
    hoursWorked: 0,
    overtime: 0,
    status: "On time",
    method: "QR",
  },
];