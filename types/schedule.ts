export type ShiftType = 'Morning' | 'Afternoon' | 'Evening' | 'Off';
export type SwapStatus = 'Pending' | 'Approved' | 'Denied';

export interface Shift {
  employeeId: number;
  date: string;
  type: ShiftType;
}

export interface SwapRequest {
  id:          number;
  requesterId: number;
  targetId:    number;
  date:        string;
  shiftType:   ShiftType;
  status:      SwapStatus;
  note:        string;
}
 