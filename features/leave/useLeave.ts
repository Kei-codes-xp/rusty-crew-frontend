import { useState } from "react";
import { LeaveRequest } from "@/types/leave";
import { INITIAL_LEAVES } from "@/app/dashboard/data";
import { useDashboard } from "@/app/dashboard/useDashboard";
import { Employee } from "@/types/employee";


export function useLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);

  const [leaveForm, setLeaveForm] = useState({
    from: '',
    to: '',
    reason: '',
    type: 'Vacation' as LeaveRequest['type']
  });

  function fileLeave(emp: Employee) {
    const newLeave: LeaveRequest = {
      id: Date.now(),
      employeeId: emp.id,
      ...leaveForm,
      status: 'Pending'
    };

    setLeaves(prev => [...prev, newLeave]);
  }

  function resetForm() {
    setLeaveForm({
      from: '',
      to: '',
      reason: '',
      type: 'Vacation'
    });
  }

  function updateLeave(id: number, status: LeaveRequest["status"]) {
    setLeaves(prev =>
      prev.map(l => (l.id === id ? { ...l, status } : l))
    );
  }

  return {
    leaves,
    leaveForm,
    setLeaveForm,
    fileLeave,
    resetForm,
    updateLeave,
  };
}