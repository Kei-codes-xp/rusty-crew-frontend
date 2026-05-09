import { Employee } from "@/types/employee";
import { TimeLog } from "@/types/attendance";
import { Shift, SwapRequest } from "@/types/schedule";
import { LeaveRequest } from "@/types/leave";
import { Notification } from "@/types/notification";
import { Role } from "@/types/employee";
// import { getWeekDates } from "@/utils/date";

export const TODAY = new Date().toISOString().slice(0, 10);

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@mail.com",
    phone: "000",
    emergency: "000",
    role: "Barista",
    hourlyRate: 80,
    isSalaried: false,
    monthlySalary: 0,
    status: "Active",
    qrToken: "QR001",
    leaveBalance: 5,
    avatarColor: "1",
  },
  {
    id: 2,
    firstName: "Kyla",
    lastName: "Santos",
    email: "kyla@mail.com",
    phone: "000",
    emergency: "000",
    role: "Cashier",
    hourlyRate: 90,
    isSalaried: false,
    monthlySalary: 0,
    status: "Active",
    qrToken: "QR002",
    leaveBalance: 5,
    avatarColor: "2",
  },
];


export const INITIAL_TIMELOGS: TimeLog[] = [
  {
    id: 1,
    employeeId: 1,
    date: TODAY,
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
    date: TODAY,
    clockIn: "06:08",
    clockOut: "14:00",
    hoursWorked: 7.87,
    overtime: 0,
    status: "Late",
    method: "QR",
  },
];


export const INITIAL_SHIFTS: Shift[] = [];



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
];

export const INITIAL_NOTIFS: Notification[] = [
  {
    id: 1,
    type: "late",
    message: "",
    time: "06:08 AM",
    read: false,
  },
];


export const SHIFT_PATTERN: Record<number, string[]> = {
  1: ["Morning", "Morning", "Afternoon", "Off"],
  2: ["Afternoon", "Morning", "Off", "Morning"],
};