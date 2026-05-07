import { useDashboard } from "@/app/dashboard/useDashboard";
import { Employee } from "@/types/employee";



export function getPayroll(emp: Employee, timeLogs: any[] = []) {
  const logs = timeLogs.filter(l => l.employee_id === emp.id);

  const totalHrs = logs.reduce((s, l) => s + l.hoursWorked, 0);
  const otHrs = logs.reduce((s, l) => s + l.overtime, 0);

  const base = emp.isSalaried
    ? emp.monthlySalary / 30
    : totalHrs * emp.hourlyRate;

  const otPay = otHrs * emp.hourlyRate * 1.25;

  const gross = base + otPay;

  return { totalHrs, otHrs, base, otPay, gross };
}