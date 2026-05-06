export type LeaveType   = 'Sick' | 'Vacation' | 'Emergency';
export type LeaveStatus = 'Pending' | 'Approved' | 'Denied';

export interface LeaveRequest {
  id:         number;
  employeeId: number;
  from:       string;
  to:         string;
  reason:     string;
  type:       LeaveType;
  status:     LeaveStatus;
}

export interface LeaveForm {
  from:   string;
  to:     string;
  reason: string;
  type:   LeaveType;
}