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
  pin: string;
}