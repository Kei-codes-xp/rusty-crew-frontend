import { ShiftType, SwapRequest } from "@/types/schedule";

export function detectConflict(
  empId: number,
  date: string,
  type: ShiftType,
  swaps: SwapRequest[]
): boolean {
  if (type === 'Off') return false;

  const existing = swaps.filter(
    s =>
      (s.requesterId === empId || s.targetId === empId) &&
      s.date === date &&
      s.status === 'Pending'
  );

  return existing.length > 0;
}