'use client';

import { useAuth } from '@/context/AuthContext';
import { useEmployeeSchedule } from '@/features/schedule/hooks/useEmployeeSchedule';
import { today } from '@/utils/date';

export function useSchedulePage() {
  const { user } = useAuth();
  const schedule = useEmployeeSchedule(user?.id ?? 0);

  console.log('useSchedulePage', { user, schedule });

  const todayDate = today();

  const {
    weekDates,
    weekOffset,
    setWeekOffset,
    myPendingSwaps,
    loading,
  } = schedule;

  return {
    user,

    // schedule data
    schedule,
    weekDates,
    weekOffset,
    setWeekOffset,
    myPendingSwaps,
    loading,

    // utils
    todayDate,
  };
}