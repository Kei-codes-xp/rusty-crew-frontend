'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { TimeLog } from '@/types';
import { today, hoursWorked } from '@/utils/date';
import { useDeviceId } from '@/hooks/useDeviceId';
import { usePolling } from '@/hooks/usePolling';

const POLL_MS = 30_000; // re-fetch every 30 s

interface ClockResult {
  action: 'clock_in' | 'clock_out';
  message: string;
  log: TimeLog;
}

/**
 * Employee-scoped attendance hook.
 * Handles QR clock-in/out, history fetch, and optimistic UI.
 */
export function useEmployeeAttendance(employeeId: number) {
  const deviceId = useDeviceId();

  const [todayLog, setTodayLog] = useState<TimeLog | null>(null);
  const [history, setHistory] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [clockMsg, setClockMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch today's log ──────────────────────────────────────────────────────
  const fetchToday = useCallback(async () => {
    try {
      const res = await api.get<TimeLog[]>('/attendance', {
        params: { date: today() },

      });
      const mine = res.data.find((l) => l.employeeId === employeeId) ?? null;
      console.log("res.data", res.data)

      setTodayLog(mine);
    } catch {
      console.error("Failed to fetch today's log");
    }
  }, [employeeId]);


  // ── Fetch attendance history ───────────────────────────────────────────────
  const fetchHistory = useCallback(async (from: string, to: string) => {
    setLoading(true);
    try {
      const res = await api.get<TimeLog[]>('/attendance/range', {
        params: { from, to },
      });
      setHistory(res.data.filter((l) => l.employeeId === employeeId));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => { fetchToday(); }, [fetchToday]);
  usePolling(fetchToday, POLL_MS);

  // ── QR Clock-in / Clock-out ────────────────────────────────────────────────
  // Called after QR scanner resolves a token.
  // Sends { qrToken, deviceId } → POST /api/auth/qr
  async function clockByQR(qrToken: string): Promise<ClockResult | null> {
    setLoading(true);
    setClockMsg(null);
    try {
      const res = await api.post<ClockResult>('/clock-in', { qrToken, deviceId });
      const result = res.data;

      // Optimistic update
      setTodayLog(result.log);
      setClockMsg({ text: result.message, ok: true });
      return result;
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? '❌ Clock-in failed';
      setClockMsg({ text: msg, ok: false });
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ── Manual clock (fallback for managers entering on behalf) ───────────────
  async function clockManual(time: string, type: 'in' | 'out'): Promise<void> {
    setLoading(true);
    try {
      const res = await api.post<{ data: TimeLog }>('/attendance/manual', {
        employeeId, time, type,
      });
      setTodayLog(res.data.data ?? res.data as any);
      setClockMsg({ text: `✅ Manual ${type} recorded at ${time}`, ok: true });
    } catch (e: any) {
      setClockMsg({ text: e?.response?.data?.message ?? '❌ Failed', ok: false });
    } finally {
      setLoading(false);
    }
  }

  const isClockedIn = !!todayLog?.clockIn && !todayLog?.clockOut;

  return {
    todayLog,
    history,
    loading,
    error,
    clockMsg,
    isClockedIn,
    clockByQR,
    clockManual,
    fetchHistory,
    fetchToday,
  };
}