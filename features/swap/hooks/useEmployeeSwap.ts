'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeSchedule } from '@/features/schedule/hooks/useEmployeeSchedule';
import { Employee, ShiftType } from '@/types';
import { TODAY } from '@/utils/date';
import { SwapCandidate } from '@/types/swap';



export function useSwaps() {
  const { user } = useAuth();
  const schedule = useEmployeeSchedule(user?.id ?? 0);

  const [colleagues, setColleagues] = useState<Employee[]>([]);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [swapCandidates, setSwapCandidates] = useState<SwapCandidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);



  const [form, setForm] = useState({
    targetId: '',
    date: '',
    shiftType: 'Morning' as ShiftType,
    note: '',
  });


  useEffect(() => {
    if (!user?.id) return;

    api.get<Employee[]>('/employees')
      .then((r) => {
        setColleagues(
          r.data.filter(
            (e) => e.id !== user.id && e.status === 'Active'
          )
        );

      })
      .catch(() => { });
  }, [user?.id]);


  const fetchSwapCandidates = useCallback(async (date: string) => {
    if (!date) {
      setSwapCandidates([]);
      return;
    }

    setLoadingCandidates(true);

    try {
      const res = await api.get<SwapCandidate[]>(
        '/shift-swaps/eligible',
        {
          params: { date },
        }
      );

      setSwapCandidates(res.data);
    } catch (err) {
      console.error('Failed to fetch swap candidates:', err);
      setSwapCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }, []);



  async function requestSwap() {
    if (!user || !form.targetId || !form.date) {
      setMsg({ text: 'Please fill in all fields', ok: false });
      return;
    }

    const res = await schedule.requestSwap(
      +form.targetId,
      form.date,
      form.shiftType,
      form.note
    );

    setMsg({ text: res.message, ok: res.ok });

    if (res.ok) {
      setShowForm(false);
      setForm({ targetId: '', date: '', shiftType: 'Morning', note: '' });
    }
  }

  return {
    user,
    schedule,

    colleagues,
    msg,
    showForm,
    setShowForm,
    swapCandidates,
    loadingCandidates,

    form,
    setForm,
    fetchSwapCandidates,

    requestSwap,
  };
}