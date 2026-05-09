'use client';

import { useAuth } from '@/context/AuthContext';
import { useEmployeeSchedule } from '@/features/schedule/hooks/useEmployeeSchedule';
import { SHIFT_COLORS, SHIFT_TIMES, DAYS_OF_WEEK } from '@/constants/calendar';
import { formatWeekLabel, today } from '@/utils/date';
import { ShiftType } from '@/types';

const S = {
  card:  { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
  h2:    { fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 12 },
  btnSm: { background: '#1e1e1e', color: '#ccc', border: '1px solid #2a2a2a', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
};

export default function SchedulePage() {
  const { user }    = useAuth();
  const schedule    = useEmployeeSchedule(user?.id ?? 0);
  const todayDate   = today();

  const {
    weekDates, weekOffset, setWeekOffset,
    myPendingSwaps, loading,
  } = schedule;

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>My Schedule</div>

      {/* ── Week navigation ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={S.btnSm} onClick={() => setWeekOffset((w) => w - 1)}>← Prev</button>
        <span style={{ fontSize: 12, color: '#888' }}>{formatWeekLabel(weekDates)}</span>
        <button style={S.btnSm} onClick={() => setWeekOffset((w) => w + 1)}>Next →</button>
      </div>

      {/* ── Daily shift cards ─────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#444', fontSize: 13, padding: '2rem' }}>Loading schedule…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weekDates.map((date, i) => {
            const shift     = schedule.getEffectiveShift(date);
            const isToday   = date === todayDate;
            const col = SHIFT_COLORS[shift?.type ?? 'Off'];
            const dayLabel  = DAYS_OF_WEEK[i];
            const dateLabel = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={date} style={{
                ...S.card,
                background: isToday ? '#1a1e11' : '#1a1a1a',
                border:     `1px solid ${isToday ? '#2a3a1a' : '#252525'}`,
                display:    'flex',
                alignItems: 'center',
                gap:        14,
              }}>
                {/* Day label */}
                <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: isToday ? '#f5a623' : '#444', fontWeight: 700, textTransform: 'uppercase' }}>
                    {dayLabel}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: isToday ? '#f5a623' : '#888', marginTop: 2 }}>
                    {dateLabel.split(' ')[1]}
                  </div>
                </div>

                {/* Shift indicator */}
                {shift?.type !== 'Off' ? (
                  <>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: col.bg, color: col.text,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, flexShrink: 0,
                    }}>
                      {col.abbr}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: col.text }}>
                        {shift?.type} Shift
                      </div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                        {SHIFT_TIMES[shift?.type ?? 'Off']}
                        
                      </div>
                      {shift?.swapApplied && (
                        <div style={{ fontSize: 10, color: '#fb923c', marginTop: 3 }}>
                          ⇄ Swap applied
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8,
                      background: '#111', color: '#333',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>
                      🏖
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#444' }}>Day Off</div>
                    </div>
                  </>
                )}

                {isToday && (
                  <div style={{
                    fontSize: 9, fontWeight: 700, background: '#f5a623',
                    color: '#000', borderRadius: 10, padding: '2px 6px',
                    flexShrink: 0,
                  }}>TODAY</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Legend ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {(['Morning', 'Afternoon', 'Evening'] as ShiftType[]).map((t) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#555' }}>
            <span style={{ background: SHIFT_COLORS[t].bg, color: SHIFT_COLORS[t].text, padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
              {SHIFT_COLORS[t].abbr}
            </span>
            {SHIFT_TIMES[t]}
          </span>
        ))}
      </div>
    </div>
  );
}