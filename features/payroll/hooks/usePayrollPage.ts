
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeePayroll } from './useEmployeePayroll';
import { getWeekDates } from '@/utils/date';

export function usePayrollPage() {
  const { user } = useAuth();

  const payrollHook = useEmployeePayroll(user?.id ?? 0);

  const [from, setFrom] = useState(getWeekDates(0)[0]);
  const [to, setTo] = useState(getWeekDates(0)[6]);

  function handleFetch() {
    payrollHook.fetchPayroll(from, to);
  }

  return {
    user,
    from,
    to,
    setFrom,
    setTo,
    handleFetch,
    ...payrollHook,
  };
}