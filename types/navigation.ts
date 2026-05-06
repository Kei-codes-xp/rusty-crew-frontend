export type NavItem =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'schedule'
  | 'payroll'
  | 'leaves'
  | 'notifications';
 
export interface NavConfig {
  id:    NavItem;
  label: string;
  icon:  string;
}