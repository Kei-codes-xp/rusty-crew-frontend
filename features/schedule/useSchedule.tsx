"use client";

import { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "@/lib/api";
import { Shift, ShiftType, SwapRequest } from "@/types/schedule";

type UpdateShiftPayload = {
  empId: number;
  date: string;
  type: ShiftType;
};

export function useSchedule(weekStart: string) {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);


  // -----------------------------
  // SHIFTS QUERY
  // -----------------------------
  const { data: shifts = [], isLoading: shiftsLoading } = useQuery<
    Shift[]
  >({
    queryKey: ["shifts", weekStart],
    queryFn: async () => {
      const res = await api.get<Shift[]>("/shifts", {
        params: { weekStart },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const shiftMap = useMemo(() => {
    const map = new Map<string, ShiftType>();

    shifts.forEach((s) => {
      map.set(`${s.employeeId}-${s.date}`, s.type);
    });

    return map;
  }, [shifts]);


  // -----------------------------
  // SWAPS QUERY
  // -----------------------------
  const { data: swaps = [], isLoading: swapsLoading } = useQuery<
    SwapRequest[]
  >({
    queryKey: ["swaps", weekStart],
    queryFn: async () => {
      const res = await api.get<SwapRequest[]>("/shifts/swaps", {
        params: { weekStart },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // -----------------------------
  // SHIFT LOOKUP
  // -----------------------------
  const getShift = (empId: number, date: string): ShiftType => {
    return shiftMap.get(`${empId}-${date}`) ?? "Off";
  };

  // -----------------------------
  // OPTIMISTIC SHIFT UPDATE
  // -----------------------------
  const updateShiftMutation = useMutation({
    mutationFn: async (payload: UpdateShiftPayload) => {
      return api.post("/shifts", {
        employeeId: payload.empId,
        date: payload.date,
        type: payload.type,
      });
    },

    onMutate: async (newShift: UpdateShiftPayload) => {
      await queryClient.cancelQueries({
        queryKey: ["shifts", weekStart],
      });

      const prev = queryClient.getQueryData<Shift[]>([
        "shifts",
        weekStart,
      ]);

      queryClient.setQueryData<Shift[]>(
        ["shifts", weekStart],
        (old = []) => {
          return old.map((s) =>
            s.employeeId === newShift.empId &&
              s.date === newShift.date
              ? { ...s, type: newShift.type }
              : s
          );
        }
      );

      return { prev };
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          ["shifts", weekStart],
          context.prev
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["shifts", weekStart],
      });
    },
  });

  const updateShift = (
    empId: number,
    date: string,
    type: ShiftType
  ) => {
    updateShiftMutation.mutate({ empId, date, type });
  };

  // -----------------------------
  // SWAP ACTIONS
  // -----------------------------
  const handleSwap = async (
    id: number,
    action: "Approved" | "Denied"
  ) => {
    try {
      setProcessingId(id);

      const endpoint =
        action === "Approved"
          ? `/shifts/swaps/${id}/approve`
          : `/shifts/swaps/${id}/deny`;

      await api.patch(endpoint);

      queryClient.invalidateQueries({
        queryKey: ["swaps", weekStart],
      });

      queryClient.invalidateQueries({
        queryKey: ["shifts", weekStart],
      });
    } catch (err) {
      console.error("Swap update failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  // -----------------------------
  // PRECOMPUTED SWAP LOOKUP (FAST)
  // -----------------------------
  const pendingSwapSet = useMemo(() => {
    return new Set(
      swaps
        .filter((s) => s.status === "Pending")
        .map((s) => `${s.requesterId}-${s.date}`)
    );
  }, [swaps]);

  return {
    shifts,
    swaps,
    getShift,
    updateShift,
    handleSwap,
    processingId,
    pendingSwapSet,
    shiftsLoading,
    swapsLoading,
  };
}