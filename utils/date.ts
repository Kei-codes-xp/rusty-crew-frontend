export const TODAY = new Date().toISOString().slice(0, 10);

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* =========================
   WEEK HELPERS
========================= */

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
  const day = now.getDay() || 7;

  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1 + weekOffset * 7);

  return mon.toISOString().slice(0, 10);
}

export function getWeekEnd(weekOffset = 0): string {
  const dates = getWeekDates(weekOffset);

  return dates[6];
}

export function formatWeekLabel(dates: string[]): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const year = new Date(dates[6]).getFullYear();

  return `${fmt(dates[0])} – ${fmt(dates[6])}, ${year}`;
}

/* =========================
   MONTH HELPERS
========================= */

export function getMonthStart(offset = 0): string {
  const now = new Date();

  const d = new Date(
    now.getFullYear(),
    now.getMonth() + offset,
    1
  );

  return d.toISOString().slice(0, 10);
}

export function getMonthEnd(offset = 0): string {
  const now = new Date();

  const d = new Date(
    now.getFullYear(),
    now.getMonth() + offset + 1,
    0
  );

  return d.toISOString().slice(0, 10);
}

export function formatMonthLabel(offset = 0): string {
  const now = new Date();

  const d = new Date(
    now.getFullYear(),
    now.getMonth() + offset,
    1
  );

  return d.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/* =========================
   SEMI-MONTHLY HELPERS
   (1-15 / 16-end)
========================= */

export function getHalfMonthRange(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const currentDay = date.getDate();

  // First cutoff
  if (currentDay <= 15) {
    const from = new Date(year, month, 1);
    const to = new Date(year, month, 15);

    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      label: `${from.toLocaleDateString('en-US', {
        month: 'short',
      day: 'numeric',
      })} – ${to.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}, ${year}`,
    };
  }

  // Second cutoff
  const from = new Date(year, month, 16);
  const to = new Date(year, month + 1, 0);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    label: `${from.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} – ${to.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}, ${year}`,
  };
}

/* =========================
   TIME HELPERS
========================= */

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);

  return h * 60 + m;
}

export function hoursWorked(clockIn: string, clockOut: string): number {
  return parseFloat(
    (
      (timeToMinutes(clockOut) - timeToMinutes(clockIn)) / 60
    ).toFixed(2)
  );
}