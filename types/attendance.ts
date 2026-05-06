export type AttendanceStatus = 'On time' | 'Late' | 'Undertime' | 'Absent';
export type ClockMethod      = 'QR'      | 'Manual';

export interface TimeLog {
  id:          number;
  employeeId:  number;
  date:        string;
  clockIn:     string | null;
  clockOut:    string | null;
  hoursWorked: number;
  overtime:    number;
  status:      AttendanceStatus;
  method:      ClockMethod;
}