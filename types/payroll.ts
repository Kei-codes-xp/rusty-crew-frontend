export type PayrollFrequency = 'weekly' | 'semi_monthly' | 'monthly';
export type PayrollStatus    = 'draft'  | 'locked'       | 'voided';


export interface PayrollPeriod {
  id:          number;
  label:       string;
  frequency:   PayrollFrequency;
  startDate:   string;           // YYYY-MM-DD
  endDate:     string;           // YYYY-MM-DD
  status:      PayrollStatus;
  generatedAt: string | null;    // ISO datetime
  lockedAt:    string | null;    // ISO datetime — set when period is locked
  generatedBy: number | null;    // employee_id
  totalGross:  number;
  totalHours:  number;
  totalOT:     number;
  entryCount:  number;
  notes:       string | null;
}
 

export interface PayrollDayLog {
  date:        string;   // YYYY-MM-DD
  hoursWorked: number;
  overtime:    number;
  status:      'On time' | 'Late' | 'Undertime' | 'Absent';
  clockIn:     string | null;
  clockOut:    string | null;
}

export interface PayrollEntry {
  id:         number;
  periodId:   number;
 
  // Employee snapshot (NOT the live Employee object)
  employeeId:    number;
  firstName:     string;
  lastName:      string;
  role:          string;
 
  // Pay settings AT TIME OF GENERATION
  isSalaried:    boolean;
  hourlyRate:    number;   // hourly_rate_snapshot
  monthlySalary: number;   // monthly_salary_snapshot
 
  // Time totals
  totalHours:  number;
  otHours:     number;
 
  // Pay breakdown
  base:        number;     // base_pay
  otPay:       number;
  deductions:  number;
  gross:       number;     // gross_pay
  net:         number;     // net_pay (gross - deductions)
 
  // Metadata
  status:      PayrollStatus;
  remarks:     string | null;
 
  // Per-day breakdown from time_logs
  logs:        PayrollDayLog[];
 
  // Audit trail
  timeLogIds:  number[];
}


export interface GeneratePayrollResponse {
  message:  string;
  period:   PayrollPeriod;
  entries:  PayrollEntry[];
}
 
export interface PeriodListResponse {
  data: PayrollPeriod[];
  meta: {
    total:        number;
    per_page:     number;
    current_page: number;
    last_page:    number;
  };
}
 
export interface PeriodEntriesResponse {
  period:  PayrollPeriod;
  entries: PayrollEntry[];
}
 
export interface PayslipResponse {
  period: PayrollPeriod;
  entry:  PayrollEntry;
}
 
// ── Form types ────────────────────────────────────────────────────────────────
 
export interface GeneratePayrollForm {
  startDate: string;
  endDate:   string;
  frequency: PayrollFrequency;
  notes:     string;
}
 
// ── Frequency display labels ──────────────────────────────────────────────────
 
export const FREQUENCY_LABELS: Record<PayrollFrequency, string> = {
  weekly:       'Weekly',
  semi_monthly: 'Semi-Monthly',
  monthly:      'Monthly',
};
 
export const STATUS_LABELS: Record<PayrollStatus, string> = {
  draft:  'Draft',
  locked: 'Locked',
  voided: 'Voided',
};


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