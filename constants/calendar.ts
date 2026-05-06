import { ShiftType } from "@/types/schedule";

export const TODAY = new Date().toISOString().slice(0,10);

export const DAYS_OF_WEEK = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export const SHIFT_PATTERN: Record<number, ShiftType[]> = {
  1:['Morning','Morning','Morning','Afternoon','Afternoon','Morning','Off'],
  2:['Afternoon','Morning','Afternoon','Afternoon','Morning','Afternoon','Off'],
  3:['Morning','Morning','Morning','Morning','Morning','Morning','Morning'],
  4:['Evening','Off','Evening','Evening','Off','Evening','Afternoon'],
  5:['Morning','Afternoon','Off','Morning','Afternoon','Afternoon','Off'],
  6:['Off','Morning','Afternoon','Off','Morning','Morning','Evening'],
  7:['Afternoon','Off','Morning','Afternoon','Evening','Off','Morning'],
};


export const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string; abbr: string }> = {
  Morning:   { bg: '#3d2a0a', text: '#fbbf24', abbr: 'M' },
  Afternoon: { bg: '#0a2a3d', text: '#60a5fa', abbr: 'A' },
  Evening:   { bg: '#2a0a2d', text: '#c084fc', abbr: 'E' },
  Off:       { bg: '#1a1a1a', text: '#333333', abbr: '—' },
};
 
export const SHIFT_TIMES: Record<ShiftType, string> = {
  Morning:   '6:00 AM – 2:00 PM',
  Afternoon: '2:00 PM – 10:00 PM',
  Evening:   '6:00 PM – 10:00 PM',
  Off:       '—',
};
 