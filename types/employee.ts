// ── Updated Employee interface — add profile fields to the existing file ──────
// Replace your existing types/employee.ts with this.

export type Role   = 'Barista' | 'Cashier' | 'Manager' | 'Admin';
export type Status = 'Active'  | 'Inactive' | 'Resigned';

export interface Employee {
  id:             number;
  firstName:      string;
  lastName:       string;
  email:          string;
  phone:          string;
  emergency:      string;
  role:           Role;
  status:         Status;
  hourlyRate:     number;
  isSalaried:     boolean;
  monthlySalary:  number;
  qrToken:        string;
  leaveBalance:   number;
  avatarColor:    string;

  // ── New profile personalisation fields ─────────────────────────────────────
  avatarUrl:      string | null;   // uploaded image URL, null → use initials
  displayName:    string | null;   // shown instead of firstName in greetings
  nickname:       string | null;   // casual name
  bio:            string | null;   // about me
  themeColor:     string | null;   // personalised accent colour hex
}

export interface NewEmployeeForm {
  firstName:     string;
  lastName:      string;
  email:         string;
  phone:         string;
  emergency:     string;
  role:          Role;
  hourlyRate:    number;
  isSalaried:    boolean;
  monthlySalary: number;
  pin:           string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the best display name for an employee in order of preference */
export function preferredName(emp: Employee): string {
  return emp.displayName ?? emp.nickname ?? emp.firstName;
}