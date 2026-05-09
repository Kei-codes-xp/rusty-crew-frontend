import { ShiftType } from "./schedule";

export interface SwapCandidate {
  employee_id: number;
  first_name:  string;
  last_name:   string;
  shift_type: ShiftType;   
  shift_id:    number;
}