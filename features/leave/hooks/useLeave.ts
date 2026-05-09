'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeLeave } from '@/features/leave/hooks/useEmployeeLeave';
import { LeaveForm, LeaveType } from '@/types';

const BLANK: LeaveForm = {
  from: '',
  to: '',
  reason: '',
  type: 'Vacation',
};

export function useLeaveFeature() {
  const { user } = useAuth();
  const leave = useEmployeeLeave(user?.id ?? 0);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LeaveForm>(BLANK);

  async function submitLeave() {
    if (!form.from || !form.to || !form.reason) return;

    const ok = await leave.fileLeave(form);

    if (ok) {
      setShowForm(false);
      setForm(BLANK);
    }
  }

  return {
    user,
    leave,

    showForm,
    setShowForm,

    form,
    setForm,

    submitLeave,
  };
}