'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import {
  PayrollPeriod,
  PayrollEntry,
  GeneratePayrollForm,
  GeneratePayrollResponse,
  PeriodListResponse,
  PeriodEntriesResponse,
  PayrollStatus,
  PayrollFrequency,
} from '@/types/payroll';

/**
 * Admin / Manager payroll hook.
 *
 * ALL state lives here. Components are pure display + interaction surfaces.
 *
 * Rules enforced:
 *   - No payroll computation on the frontend.
 *   - generate() calls POST /api/payroll/generate → backend does all math.
 *   - lock() / void() are one-way operations guarded by the backend.
 *   - entries are always fetched from the persisted DB rows.
 */
export function usePayrollAdmin() {
  const [periods,      setPeriods]      = useState<PayrollPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [entries,      setEntries]      = useState<PayrollEntry[]>([]);
  const [loading,      setLoading]      = useState(false);
  const [generating,   setGenerating]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [success,      setSuccess]      = useState<string | null>(null);

  const [meta, setMeta] = useState({ total: 0, currentPage: 1, lastPage: 1 });

  // ── Fetch periods list ────────────────────────────────────────────────────
  const fetchPeriods = useCallback(async (
    frequency?: PayrollFrequency,
    status?:    PayrollStatus,
    page = 1,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PeriodListResponse>('/payroll/periods', {
        params: { frequency, status, page },
      });
      setPeriods(res.data.data);
      setMeta({
        total:       res.data.meta.total,
        currentPage: res.data.meta.current_page,
        lastPage:    res.data.meta.last_page,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load payroll periods.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch entries for a period ────────────────────────────────────────────
  const fetchEntries = useCallback(async (period: PayrollPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PeriodEntriesResponse>(`/payroll/${period.id}/entries`);
      setSelectedPeriod(res.data.period);
      setEntries(res.data.entries);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load payroll entries.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Generate payroll ──────────────────────────────────────────────────────
  // Calls backend service — NO computation on frontend.
  const generate = useCallback(async (form: GeneratePayrollForm): Promise<boolean> => {
    setGenerating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post<GeneratePayrollResponse>('/payroll/generate', {
        startDate: form.startDate,
        endDate:   form.endDate,
        frequency: form.frequency,
        notes:     form.notes || undefined,
      });

      const newPeriod = res.data.period;

      // Optimistic update: prepend to list
      setPeriods((prev) => {
        const without = prev.filter((p) => p.id !== newPeriod.id);
        return [newPeriod, ...without];
      });

      setSelectedPeriod(newPeriod);
      setEntries(res.data.entries);
      setSuccess(`Payroll generated: ${newPeriod.label}`);
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Payroll generation failed.');
      return false;
    } finally {
      setGenerating(false);
    }
  }, []);

  // ── Lock period ───────────────────────────────────────────────────────────
  const lock = useCallback(async (period: PayrollPeriod): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch<{ message: string; period: PayrollPeriod }>(
        `/payroll/periods/${period.id}/lock`
      );
      const locked = res.data.period;

      // Update list + selected
      setPeriods((prev) => prev.map((p) => p.id === locked.id ? locked : p));
      if (selectedPeriod?.id === locked.id) setSelectedPeriod(locked);
      // Refresh entries so their status reflects locked
      setEntries((prev) => prev.map((e) => ({ ...e, status: 'locked' as const })));
      setSuccess('Payroll period locked successfully.');
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to lock period.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  // ── Void period ───────────────────────────────────────────────────────────
  const voidPeriod = useCallback(async (period: PayrollPeriod): Promise<boolean> => {
    if (!confirm('Void this payroll period? This cannot be undone.')) return false;
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch<{ message: string; period: PayrollPeriod }>(
        `/payroll/periods/${period.id}/void`
      );
      const voided = res.data.period;
      setPeriods((prev) => prev.map((p) => p.id === voided.id ? voided : p));
      if (selectedPeriod?.id === voided.id) {
        setSelectedPeriod(voided);
        setEntries([]);
      }
      setSuccess('Period voided.');
      return true;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to void period.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  // ── Download payslip PDF ──────────────────────────────────────────────────
  const downloadPayslip = useCallback(async (
    employeeId: number,
    period:     PayrollPeriod,
  ) => {
    try {
      const res = await api.get(
        `/payroll/payslip/${employeeId}/${period.id}/pdf`,
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href    = url;
      a.download = `payslip_${employeeId}_${period.startDate}_${period.endDate}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed.');
    }
  }, []);

  return {
    periods,
    selectedPeriod,
    setSelectedPeriod,
    entries,
    loading,
    generating,
    error,
    success,
    meta,
    fetchPeriods,
    fetchEntries,
    generate,
    lock,
    voidPeriod,
    downloadPayslip,
  };
}