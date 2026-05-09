import { useEffect, useState } from "react";
import { LeaveRequest } from "@/types/leave";
import { Employee } from "@/types/employee";
import api from "@/lib/api";


export function useLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

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

  async function fetchLeaves()  {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  function resetForm() {
    setLeaveForm({
      from: '',
      to: '',
      reason: '',
      type: 'Vacation'
    });
  }

  async function updateLeave(id: number, status: LeaveRequest["status"]) {
    // setLeaves(prev =>
    //   prev.map(l => (l.id === id ? { ...l, status } : l))
    // );
    try {
      const endpoint = status === 'Approved' ? `/leaves/${id}/approve` : `/leaves/${id}/deny`;
      await api.patch(endpoint);

      await fetchLeaves();
    } catch (err) {
      console.error("Failed to update leave:", err);
    }
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