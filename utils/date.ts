export const TODAY = new Date().toISOString().slice(0,10);


export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekDates(weekOffset = 0): string[] {
  const now = new Date();
  const day = now.getDay() || 7; // treat Sunday as 7
  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1 + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getWeekStart(weekOffset = 0): string {
  const now = new Date();
  const day = now.getDay() || 7; // Sunday = 7

  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1 + weekOffset * 7);

  return mon.toISOString().slice(0, 10);
}

export function formatWeekLabel(dates: string[]): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const year = new Date(dates[6]).getFullYear();
  return `${fmt(dates[0])} – ${fmt(dates[6])}, ${year}`;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function hoursWorked(clockIn: string, clockOut: string): number {
  return parseFloat(
    ((timeToMinutes(clockOut) - timeToMinutes(clockIn)) / 60).toFixed(2)
  );
}