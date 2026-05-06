// features/schedule/schedule.data.ts

import { ShiftType } from "@/types/schedule";

export const SHIFT_PATTERN: Record<number, ShiftType[]> = {
  1: ["Morning", "Morning", "Morning", "Afternoon", "Afternoon", "Morning", "Off"],
  2: ["Afternoon", "Morning", "Afternoon", "Afternoon", "Morning", "Afternoon", "Off"],
  3: ["Morning", "Morning", "Morning", "Morning", "Morning", "Morning", "Morning"],
  4: ["Evening", "Off", "Evening", "Evening", "Off", "Evening", "Afternoon"],
  5: ["Morning", "Afternoon", "Off", "Morning", "Afternoon", "Afternoon", "Off"],
  6: ["Off", "Morning", "Afternoon", "Off", "Morning", "Morning", "Evening"],
  7: ["Afternoon", "Off", "Morning", "Afternoon", "Evening", "Off", "Morning"],
};