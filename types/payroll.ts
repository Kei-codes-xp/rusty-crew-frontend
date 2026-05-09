// Extends existing types/index.ts — add these to your types/ folder

export interface PayrollEntry {
  id:            number;
  employeeId:    number;
  firstName:     string;
  lastName:      string;
  role:          string;
  isSalaried:    boolean;
  hourlyRate:    number;
  monthlySalary: number;
  totalHours:    number;
  otHours:       number;
  base:          number;
  otPay:         number;
  gross:         number;
  logs:          PayrollDayLog[];
}

export interface PayrollDayLog {
  date:        string;
  hoursWorked: number;
  overtime:    number;
  status:      string;
}

export interface QRSession {
  token:       string;      // rotating session token from backend
  employeeId:  number;
  expiresAt:   string;      // ISO datetime
  deviceId:    string;      // fingerprint of device
}

export interface EmployeeDashboard {
  todayShift:      TodayShift | null;
  isClockedIn:     boolean;
  currentLog:      import('./attendance').TimeLog | null;
  weekShifts:      import('./schedule').Shift[];
  pendingSwaps:    import('./schedule').SwapRequest[];
  pendingLeaves:   import('./leave').LeaveRequest[];
  unreadCount:     number;
  recentNotifs:    import('./notification').Notification[];
}

export interface TodayShift {
  date:      string;
  type:      import('./schedule').ShiftType;
  startTime: string;
  endTime:   string;
}