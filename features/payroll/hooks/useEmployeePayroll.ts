'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { PayrollEntry } from '@/types/payroll';

export type PayrollHook = ReturnType<typeof useEmployeePayroll>;

export function useEmployeePayroll(employeeId: number) {
  const [payroll, setPayroll] = useState<PayrollEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = useCallback(async (from: string, to: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<{ employees: PayrollEntry[] }>('/payroll/weekly', {
        params: { from, to },
      });

      const mine =
        res.data.employees.find(
          (e) => String(e.employeeId) === String(employeeId)
        ) ?? null;

      setPayroll(mine);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load payroll');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  const fetchPayslip = useCallback(async (from: string, to: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get<PayrollEntry>(
        `/payroll/payslip/${employeeId}`,
        { params: { from, to } }
      );

      return res.data;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load payslip');
      return null;
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  async function downloadPayslip(from: string, to: string) {
    try {
      const res = await api.get(`/payroll/payslip/${employeeId}/pdf`, {
        params: { from, to },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );

      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${from}_${to}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('PDF download failed — contact your manager');
    }
  }

  return {
    payroll,
    loading,
    error,
    fetchPayroll,
    fetchPayslip,
    downloadPayslip,
  };
}