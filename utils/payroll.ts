import { useDashboard } from "@/app/dashboard/useDashboard";
import { Employee } from "@/types/employee";



 export function getPayroll(emp: Employee) {
    const {timeLogs} = useDashboard();

    const logs = timeLogs.filter(l => l.employeeId === emp.id);
    const totalHrs = logs.reduce((s,l) => s + l.hoursWorked, 0);
    const otHrs    = logs.reduce((s,l) => s + l.overtime,    0);
    const base     = emp.isSalaried ? emp.monthlySalary : totalHrs * emp.hourlyRate;
    const otPay    = otHrs * (emp.hourlyRate * 1.25);
    return { totalHrs, otHrs, base, otPay, gross: base + otPay };
  }