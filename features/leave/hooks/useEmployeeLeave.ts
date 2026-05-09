'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { LeaveRequest, LeaveForm } from '@/types';

/**
 * Employee-scoped leave hook.
 * Employees can only see and manage their own leave requests.
 * Backend enforces this via auth:sanctum + policy.
 */
export function useEmployeeLeave(employeeId: number) {
  const [leaves,  setLeaves]  = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<LeaveRequest[]>('/leaves');
      // Backend already filters to current user via auth; filter client-side as safety net
      setLeaves(res.data.filter((l) => l.employeeId === employeeId));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => { fetch(); }, [fetch]);

  // ── File a new leave request ───────────────────────────────────────────────
  async function fileLeave(form: LeaveForm): Promise<boolean> {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<LeaveRequest>('/leaves', {
        employeeId,
        ...form,
      });
      setLeaves((prev) => [res.data, ...prev]);
      setSuccess('Leave request submitted successfully');
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to submit leave request');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ── Computed counts ───────────────────────────────────────────────────────
  const counts = {
    pending:  leaves.filter((l) => l.status === 'Pending').length,
    approved: leaves.filter((l) => l.status === 'Approved').length,
    denied:   leaves.filter((l) => l.status === 'Denied').length,
  };

  return { leaves, loading, error, success, counts, fileLeave, refresh: fetch };
}