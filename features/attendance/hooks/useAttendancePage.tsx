'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeAttendance } from '@/features/attendance/hooks/useEmployeeAttendance';
import { getWeekDates } from '@/utils/date';

type Tab = 'qr' | 'history';

export function useAttendancePage() {
  const { user } = useAuth();
  const attendance = useEmployeeAttendance(user?.id ?? 0);

  const [tab, setTab] = useState<Tab>('qr');
  const [scanActive, setScanActive] = useState(false);
  const [historyFrom, setHistoryFrom] = useState(getWeekDates(0)[0]);
  const [historyTo, setHistoryTo] = useState(getWeekDates(0)[6]);

  const {
    todayLog,
    history,
    isClockedIn,
    loading,
    clockMsg,
    clockByQR,
    fetchHistory,
  } = attendance;

  function handleScan(token: string) {
    setScanActive(false);
    clockByQR(token);
  }

  function loadHistory() {
    fetchHistory(historyFrom, historyTo);
  }

  return {
    user,

    // state
    tab,
    setTab,
    scanActive,
    setScanActive,
    historyFrom,
    setHistoryFrom,
    historyTo,
    setHistoryTo,

    // attendance data
    todayLog,
    history,
    isClockedIn,
    loading,
    clockMsg,

    // actions
    handleScan,
    loadHistory,
  };
}