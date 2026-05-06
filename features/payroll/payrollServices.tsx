import { useState } from "react";
import { LeaveRequest } from "@/types/leave";

export function useLeave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);

  function fileLeave(leave: LeaveRequest) {
    setLeaves(prev => [...prev, leave]);
  }

  function updateLeave(id:number, status: LeaveRequest["status"]) {
    setLeaves(prev =>
      prev.map(l => l.id === id ? {...l, status} : l)
    );
  }

  return { leaves, fileLeave, updateLeave };
}