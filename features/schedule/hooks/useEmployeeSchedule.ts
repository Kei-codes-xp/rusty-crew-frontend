'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Shift, ShiftType, SwapRequest } from '@/types';
import { getWeekDates } from '@/utils/date';
import { SHIFT_TIMES } from '@/constants/calendar';

/**
 * DB-driven schedule hook (no fallback pattern)
 */
export function useEmployeeSchedule(employeeId: number) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates(weekOffset);

  // ── Fetch data ───────────────────────────────────────────────
  const fetchWeek = useCallback(async () => {
    setLoading(true);
    try {
      const [shiftRes, swapRes] = await Promise.all([
        api.get<Shift[]>('/shifts', {
          params: { weekStart: weekDates[0], employeeId },
        }),
        api.get<SwapRequest[]>('/shifts/swaps'),
      ]);

      setShifts(shiftRes.data);
      setSwaps(swapRes.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [weekDates[0], employeeId]);

  useEffect(() => {
    fetchWeek();
  }, [fetchWeek]);

  // ── ONLY DB + swaps (NO fallback) ───────────────────────────
  function getEffectiveShift(date: string) {
    const approvedSwap = swaps.find(
      (s) =>
        s.status === 'Approved' &&
        s.date === date &&
        (s.requesterId === employeeId || s.targetId === employeeId),
    );

    const apiShift = shifts.find(
      (s) => s.employeeId === employeeId && s.date === date,
    );

    // swap overrides everything
    if (approvedSwap) {
      return {
        type: 'Off' as ShiftType,
        time: SHIFT_TIMES['Off' as ShiftType] ?? '',
        swapApplied: true,
        swapId: approvedSwap.id,
        fromApi: true,
      };
    }

    // DB shift only
    if (apiShift) {
      return {
        type: apiShift.type,
        time: SHIFT_TIMES[apiShift.type],
        swapApplied: false,
        swapId: undefined,
        fromApi: true,
      };
    }

    // ❗ NO DATA = EMPTY RESULT
    return null;
  }

  // ── pending swaps ───────────────────────────────────────────
  const myPendingSwaps = swaps.filter(
    (s) =>
      s.status === 'Pending' &&
      (s.requesterId === employeeId || s.targetId === employeeId),
  );

  // ── swap actions ────────────────────────────────────────────
  async function requestSwap(
    targetId: number,
    date: string,
    shiftType: ShiftType,
    note: string,
  ) {
    try {
      await api.post('/shifts/swaps', {
        requesterId: employeeId,
        targetId,
        date,
        shiftType,
        note,
      });

      await fetchWeek();
      return { ok: true, message: 'Swap request sent' };
    } catch (e: any) {
      return {
        ok: false,
        message: e?.response?.data?.message ?? 'Failed to request swap',
      };
    }
  }

  async function acceptSwap(swapId: number) {
    try {
      await api.patch(`/shifts/swaps/${swapId}/approve`);
      await fetchWeek();
      return { ok: true, message: 'Swap approved' };
    } catch (e: any) {
      return { ok: false, message: 'Failed' };
    }
  }

  async function denySwap(swapId: number) {
    try {
      await api.patch(`/shifts/swaps/${swapId}/deny`);
      await fetchWeek();
      return { ok: true, message: 'Swap denied' };
    } catch (e: any) {
      return { ok: false, message: 'Failed' };
    }
  }

  return {
    weekDates,
    weekOffset,
    setWeekOffset,
    shifts,
    swaps,
    myPendingSwaps,
    loading,
    error,
    getEffectiveShift,
    requestSwap,
    acceptSwap,
    denySwap,
    refresh: fetchWeek,
  };
}