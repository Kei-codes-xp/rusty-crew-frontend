"use client"
import { useEffect, useState } from "react";
import { Shift, ShiftType, SwapRequest } from "@/types/schedule";
import api from "@/lib/api";

export function useSchedule(weekStart: string) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function fetchData() {
    try {
      setLoading(true);

      const [shiftRes, swapRes] = await Promise.all([
        api.get("/shifts", { params: { weekStart } }),
        api.get("/shifts/swaps", { params: { weekStart } }),
      ]);

      setShifts(shiftRes.data);
      setSwaps(swapRes.data);
    } catch (err) {
      console.error("Failed to fetch schedule data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [weekStart]);

  function getShift(empId: number, date: string): ShiftType {
    const override = shifts.find(
      s => s.employeeId === empId && s.date === date
    );

    return override ? override.type : "Off";
  }

  async function updateShift(empId: number, date: string, type: string) {
    setShifts(prev =>
      prev.map(s =>
        s.employeeId === empId && s.date === date
          ? { ...s, type }
          : s
      )
    );
    await api.post("/shifts", {
      employeeId: empId,
      date,
      type,
    });

    const res = await api.get("/shifts", {
      params: { weekStart },
    });

    setShifts(res.data);

  }


  async function handleSwap(id: number, action: "Approved" | "Denied") {
    try {
      setProcessingId(id);

      const endpoint =
        action === "Approved"
          ? `/shifts/swaps/${id}/approve`
          : `/shifts/swaps/${id}/deny`;

      await api.patch(endpoint);

      await fetchData(); // re-sync shifts + swaps

    } catch (err) {
      console.error("Swap update failed", err);
    } finally {
      setProcessingId(null);
    }
  }

  return { shifts, getShift, updateShift, setSwaps, swaps, handleSwap, processingId,  };
}
