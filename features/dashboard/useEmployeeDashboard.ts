// features/dashboard/hooks/useEmployeeDashboard.ts
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeAttendance } from '@/features/attendance/hooks/useEmployeeAttendance';
import { useEmployeeSchedule } from '@/features/schedule/hooks/useEmployeeSchedule';
import { useEmployeeNotifications } from '@/features/notification/hooks/useEmployeeNotifications';
import { useEmployeeLeave } from '@/features/leave/hooks/useEmployeeLeave';
import { today, getWeekDates } from '@/utils/date';

export function useEmployeeDashboard() {
  const { user } = useAuth();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const attendance = useEmployeeAttendance(user?.id ?? 0);
  const schedule = useEmployeeSchedule(user?.id ?? 0);
  const notifications = useEmployeeNotifications();
  const leave = useEmployeeLeave(user?.id ?? 0);

  const weekDates = getWeekDates(0);
  const todayDate = today();

  const todayShift = user
    ? schedule.getEffectiveShift(todayDate)
    : null;

  return {
    user,
    now,
    attendance,
    schedule,
    notifications,
    leave,
    weekDates,
    todayDate,
    todayShift,
  };
}