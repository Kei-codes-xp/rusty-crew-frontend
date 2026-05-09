'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeAttendance } from '@/features/attendance/hooks/useEmployeeAttendance';
import { useEmployeeSchedule } from '@/features/schedule/hooks/useEmployeeSchedule';
import { useEmployeeNotifications } from '@/features/notification/hooks/useEmployeeNotifications';
import { useEmployeeLeave } from '@/features/leave/hooks/useEmployeeLeave';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';
import { SHIFT_COLORS, SHIFT_TIMES } from '@/constants/calendar';
import { today, getWeekDates, formatWeekLabel } from '@/utils/date';
import { fullName } from '@/utils/employee';

// ── Shared style tokens ───────────────────────────────────────────────────────
const S = {
  card:    { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
  label:   { fontSize: 11, color: '#555', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'block' },
  h2:      { fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 12 },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f5a623', textDecoration: 'none', fontWeight: 600 },
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const attendance     = useEmployeeAttendance(user?.id ?? 0);
  const schedule       = useEmployeeSchedule(user?.id ?? 0);
  const { notifications, unreadCount } = useEmployeeNotifications();
  const { leaves, counts: leaveCounts } = useEmployeeLeave(user?.id ?? 0);

  const weekDates      = getWeekDates(0);
  const todayDate      = today();
  const todayShift     = user ? schedule.getEffectiveShift(todayDate) : null;
  const { todayLog, isClockedIn } = attendance;

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 4 }}>
        <Avatar emp={user} size={44} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#e8e8e8' }}>
            Hey, {user.firstName} 👋
          </div>
          <div style={{ fontSize: 12, color: '#555' }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Clock status card ─────────────────────────────────────────────── */}
      <div style={{
        ...S.card,
        background: isClockedIn ? '#0f2218' : '#1a1a1a',
        border:     `1px solid ${isClockedIn ? '#1a4a2a' : '#252525'}`,
        textAlign:  'center',
      }}>
        <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'monospace', color: isClockedIn ? '#4ade80' : '#e8e8e8', letterSpacing: 2 }}>
          {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div style={{ fontSize: 12, color: '#555', marginBottom: 14, marginTop: 2 }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Clock-in status */}
        {isClockedIn ? (
          <div>
            <div style={{ fontSize: 13, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>
              ● Clocked in at {todayLog?.clockIn}
            </div>
            <div style={{ fontSize: 11, color: '#555' }}>
              Tap "Attendance" → Clock Out when done
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>
              Not clocked in yet
            </div>
            <Link href="/crew/dashboard/attendance" style={{
              background: '#f5a623', color: '#0f0f0f',
              padding: '10px 24px', borderRadius: 8,
              fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-block',
            }}>
              ◷ Clock In Now
            </Link>
          </div>
        )}
      </div>

      {/* ── Today's shift ─────────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={S.h2}>Today's Shift</div>
        {todayShift && todayShift.type !== 'Off' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: SHIFT_COLORS[todayShift.type].bg,
              color:      SHIFT_COLORS[todayShift.type].text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 700,
            }}>
              {SHIFT_COLORS[todayShift.type].abbr}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: SHIFT_COLORS[todayShift.type].text }}>
                {todayShift.type} Shift
              </div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
                {todayShift.time}
              </div>
              {todayShift.swapApplied && (
                <div style={{ fontSize: 11, color: '#fb923c', marginTop: 4 }}>
                  ⇄ Shift swap applied
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#444' }}>🏖 Day off today</div>
        )}
      </div>

      {/* ── Weekly schedule preview ────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={S.h2}>This Week</div>
          <Link href="/employee/schedule" style={S.linkBtn}>View →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {weekDates.map((date, i) => {
            const shift   = user ? schedule.getEffectiveShift(date) : null;
            const isToday = date === todayDate;
            const abbr    = shift ? SHIFT_COLORS[shift.type].abbr : '—';
            const col     = shift ? SHIFT_COLORS[shift.type] : SHIFT_COLORS.Off;
            return (
              <div key={date} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: isToday ? '#f5a623' : '#444', marginBottom: 3, fontWeight: isToday ? 700 : 400 }}>
                  {['M','T','W','T','F','S','S'][i]}
                </div>
                <div style={{
                  background:   isToday ? col.bg : '#111',
                  border:       `1px solid ${isToday ? col.text : '#222'}`,
                  color:        isToday ? col.text : '#444',
                  borderRadius: 6,
                  padding:      '6px 2px',
                  fontSize:     11,
                  fontWeight:   isToday ? 700 : 400,
                }}>
                  {abbr}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pending swap requests ─────────────────────────────────────────── */}
      {schedule.myPendingSwaps.length > 0 && (
        <div style={{ ...S.card, border: '1px solid #3d2a0a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ ...S.h2, color: '#fbbf24' }}>⚠ Pending Swaps</div>
            <Link href="/employee/swaps" style={S.linkBtn}>Manage →</Link>
          </div>
          {schedule.myPendingSwaps.slice(0, 2).map((swap) => (
            <div key={swap.id} style={{
              background: '#111', borderRadius: 8, padding: '8px 10px',
              marginBottom: 6, fontSize: 12, color: '#ccc',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>
                {swap.requesterId === user.id ? 'You requested a swap' : 'Swap request from someone'}
              </div>
              <div style={{ color: '#555' }}>{swap.date} · {swap.shiftType}</div>
              <StatusBadge status={swap.status} />
            </div>
          ))}
        </div>
      )}

      {/* ── Quick stats ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Link href="/employee/leave" style={{ ...S.card, textDecoration: 'none' }}>
          <div style={S.label}>Leave Balance</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>
            {user.leaveBalance} <span style={{ fontSize: 13, color: '#555' }}>days</span>
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            {leaveCounts.pending} pending request{leaveCounts.pending !== 1 ? 's' : ''}
          </div>
        </Link>
        <Link href="/employee/notifications" style={{ ...S.card, textDecoration: 'none', position: 'relative' }}>
          <div style={S.label}>Notifications</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: unreadCount > 0 ? '#f5a623' : '#e8e8e8' }}>
            {unreadCount}
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>unread alerts</div>
        </Link>
      </div>

      {/* ── Recent notifications ──────────────────────────────────────────── */}
      {notifications.slice(0, 3).map((n) => (
        <div key={n.id} style={{
          ...S.card,
          display:    'flex',
          gap:        10,
          alignItems: 'flex-start',
          background: n.read ? '#1a1a1a' : '#1e180f',
          border:     `1px solid ${n.read ? '#222' : '#3d2a0a'}`,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>
            {{ shift: '📅', leave: '🏖', late: '⏰', swap: '🔄' }[n.type] ?? '🔔'}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: n.read ? '#888' : '#e8e8e8', fontWeight: n.read ? 400 : 600 }}>
              {n.message}
            </div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{n.time}</div>
          </div>
          {!n.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f5a623', flexShrink: 0, marginTop: 4 }} />}
        </div>
      ))}
    </div>
  );
}