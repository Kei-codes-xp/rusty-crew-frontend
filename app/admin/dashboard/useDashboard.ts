import { useEmployees } from "@/features/employees/useEmployees";
import { useAttendance } from "@/features/attendance/hooks/useAttendance";
import { useSchedule } from "@/features/schedule/useSchedule";
import { useLeave } from "@/features/leave/useLeave";
import { SwapRequest } from "@/types/schedule";
import { useState } from "react";
import { INITIAL_SWAPS } from "@/features/swap/swap.data";
import { getWeekDates } from "@/utils/date";

export function useDashboard() {
  const weekDates = getWeekDates(0);

  const weekStart = weekDates[0];

  const employeesHook = useEmployees();
  const attendanceHook = useAttendance();
  const scheduleHook = useSchedule(weekStart);
  const leaveHook = useLeave();
  // const [swaps, setSwaps] = useState<SwapRequest[]>(INITIAL_SWAPS);

  const {
    swaps,
    setSwaps,
  } = useSchedule(weekStart);


  const { employees, addEmployee, updateEmployee } = employeesHook;
  const { timeLogs, clock } = attendanceHook;
  const { shifts, getShift, updateShift } = scheduleHook;
  const { leaves, fileLeave, updateLeave } = leaveHook;
  const safeEmployees = Array.isArray(employees) ? employees : [];


  const today = new Date().toISOString().slice(0, 10);

  const activeEmployees = safeEmployees.filter(e => e.status === "Active");

  const todayLogs = timeLogs?.filter(l => l.date === today);

  const onShiftToday = todayLogs?.filter(l => !l.clockOut).length ?? 0;

  const totalHoursWeek = timeLogs?.reduce((sum, l) => sum + l.hoursWorked, 0) ?? 0;

  const pendingLeaves = leaves?.filter(l => l.status === "Pending");




  return {
    // data
    employees,
    timeLogs,
    shifts,
    leaves,
    // swaps,
    // handleSwap,


    activeEmployees,
    todayLogs,
    onShiftToday,
    totalHoursWeek,
    pendingLeaves,
    weekDates,
    weekStart,

    addEmployee,
    updateEmployee,
    clock,
    getShift,
    updateShift,
    fileLeave,
    updateLeave,
  };
}