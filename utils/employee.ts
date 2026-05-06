import { Employee, Role, Status } from '@/types';
import { AVATAR_COLORS } from '@/constants/avatar';

export function initials(emp: Employee): string {
  return `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
}

export function avatarBg(emp: Employee): string {
  return AVATAR_COLORS[parseInt(emp.avatarColor) % AVATAR_COLORS.length][0];
}

export function avatarFg(emp: Employee): string {
  return AVATAR_COLORS[parseInt(emp.avatarColor) % AVATAR_COLORS.length][1];
}

export function fullName(emp: Employee): string {
  return `${emp.firstName} ${emp.lastName}`;
}

export const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
  Barista: { bg: '#1a3d2b', text: '#4ade80' },
  Cashier: { bg: '#1a2d3d', text: '#60a5fa' },
  Manager: { bg: '#3d2d0a', text: '#fbbf24' },
  Admin:   { bg: '#2d1a3d', text: '#c084fc' },
};

export const STATUS_COLORS: Record<Status | string, { bg: string; text: string }> = {
  Active:    { bg: '#1a3d2b', text: '#4ade80' },
  Inactive:  { bg: '#2a2a2a', text: '#888888' },
  Resigned:  { bg: '#3d1a1a', text: '#f87171' },
  'On time': { bg: '#1a3d2b', text: '#4ade80' },
  Late:      { bg: '#3d2a1a', text: '#fb923c' },
  Undertime: { bg: '#3d2d1a', text: '#fbbf24' },
  Absent:    { bg: '#3d1a1a', text: '#f87171' },
  Pending:   { bg: '#3d2d0a', text: '#fbbf24' },
  Approved:  { bg: '#1a3d2b', text: '#4ade80' },
  Denied:    { bg: '#3d1a1a', text: '#f87171' },
};

/**
 * Compute payroll totals for an employee given their time logs.
 */
export function computePayroll(emp: Employee, totalHours: number, otHours: number) {
  const base  = emp.isSalaried ? emp.monthlySalary : totalHours * emp.hourlyRate;
  const otPay = otHours * emp.hourlyRate * 1.25;
  return { base, otPay, gross: base + otPay };
}