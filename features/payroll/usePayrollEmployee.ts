'use client';

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import {
  PayrollPeriod,
  PayrollEntry,
  PayslipResponse,
  PeriodListResponse,
} from '@/types/payroll';

/**
 * Employee-scoped payroll hook — READ ONLY.
 *
 * Employees can view their own payroll history and download payslips.
 * All values come from persisted PayrollEntry snapshots.
 * Zero computation happens here.
 */
export function usePayrollEmployee() {
  const [periods,        setPeriods]        = useState<PayrollPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [entry,          setEntry]          = useState<PayrollEntry | null>(null);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, lastPage: 1 });

  const fetchPeriods = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PeriodListResponse>('/employee/payroll/periods', {
        params: { page },
      });
      setPeriods(res.data.data);
      setMeta({
        total:       res.data.meta.total,
        currentPage: res.data.meta.current_page,
        lastPage:    res.data.meta.last_page,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load payroll history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPeriods(); }, [fetchPeriods]);

  const fetchEntry = useCallback(async (period: PayrollPeriod) => {
    setLoading(true);
    setError(null);
    setEntry(null);
    setSelectedPeriod(period);
    try {
      const res = await api.get<PayslipResponse>(`/employee/payroll/${period.id}/payslip`);
      setEntry(res.data.entry);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        setError('No payroll record for this period yet.');
      } else {
        setError(e?.response?.data?.message ?? 'Failed to load payslip.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPdf = useCallback(async (period: PayrollPeriod) => {
    try {
      const res = await api.get(`/employee/payroll/${period.id}/pdf`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href    = url;
      a.download = `payslip_${period.startDate}_${period.endDate}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed. Please try again.');
    }
  }, []);

  return {
    periods, selectedPeriod, entry,
    loading, error, meta,
    fetchPeriods, fetchEntry, downloadPdf,
  };
}