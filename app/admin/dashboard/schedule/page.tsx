"use client"

import { ShiftType } from "@/types/schedule";
import { useDashboard } from "../useDashboard";
import { getWeekDates, TODAY } from "@/utils/date";
import { useState } from "react";
import { DAYS_OF_WEEK } from "@/constants/calendar";
import { S } from "@/styles/dashboardStyles";
import { detectConflict } from "@/utils/schedule";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { useSchedule } from "@/features/schedule/useSchedule";

const SchedulePage = () => {
  const SHIFT_COLORS: Record<ShiftType, string> = {
    Morning: '#3d2a0a', Afternoon: '#0a2a3d', Evening: '#2a0a2d', Off: '#1a1a1a'
  };
  const SHIFT_TEXT: Record<ShiftType, string> = {
    Morning: '#fbbf24', Afternoon: '#60a5fa', Evening: '#c084fc', Off: '#333'
  };
  const SHIFT_ABBR: Record<ShiftType, string> = {
    Morning: 'M', Afternoon: 'A', Evening: 'E', Off: '—'
  };


  const weekDates = getWeekDates(0);
  const weekStart = weekDates[0];

  const {
    employees,
    activeEmployees,
    getShift,
    updateShift,
  } = useDashboard();

  const {
    swaps,
    // setSwaps,
    handleSwap,
    processingId
  } = useSchedule(weekStart);


  const [weekOffset, setWeekOffset] = useState(0);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>Weekly Schedule</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={S.btnSm} onClick={() => setWeekOffset(w => w - 1)}>← Prev</button>
          <span style={{ fontSize: 13, color: '#888' }}>{weekDates[0]} – {weekDates[6]}</span>
          <button style={S.btnSm} onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
        </div>
      </div>

      {/* Conflict warning */}
      {swaps.some(s => s.status === 'Pending') && (
        <div style={{ background: '#3d2a0a', border: '1px solid #5a3a0a', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#fbbf24' }}>
          ⚠ {swaps.filter(s => s.status === 'Pending').length} pending swap request(s) may cause scheduling conflicts. Review below.
        </div>
      )}

      <div style={{ ...S.card, overflowX: 'auto' }}>
        <table style={{ ...S.table, minWidth: 640 }}>
          <thead>
            <tr style={{ background: '#111' }}>
              <th style={{ ...S.th, width: 130 }}>Staff</th>
              {weekDates.map((d, i) => (
                <th key={d} style={{ ...S.th, textAlign: 'center' }}>
                  <div>{DAYS_OF_WEEK[i]}</div>
                  <div style={{ fontWeight: 400, color: '#444', fontSize: 10 }}>{d.slice(5)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeEmployees.map(emp => (
              <tr key={emp.id}>
                <td style={{ ...S.td, fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar emp={emp} size={24} />{emp.firstName}</div>
                </td>
                {weekDates.map(date => {
                  const type = getShift(emp.id, date);
                  const conflict = detectConflict(emp.id, date, type, swaps);
                  return (
                    <td key={date} style={{ ...S.td, padding: '4px 3px', textAlign: 'center' }}>
                      <div style={{ position: 'relative' }}>
                        {conflict && <div style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: '50%', background: '#f87171', zIndex: 1 }} />}
                        <select
                          value={type}
                          onChange={e => updateShift(emp.id, date, e.target.value as ShiftType)}
                          style={{
                            background: SHIFT_COLORS[type], color: SHIFT_TEXT[type],
                            border: `1px solid ${SHIFT_COLORS[type]}`,
                            borderRadius: 6, padding: '4px 2px', fontSize: 11,
                            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                            width: '100%', textAlign: 'center',
                          }}>
                          <option value="Morning">M</option>
                          <option value="Afternoon">A</option>
                          <option value="Evening">E</option>
                          <option value="Off">—</option>
                        </select>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: '#555' }}>
        {[['M', '#3d2a0a', '#fbbf24', 'Morning 6–2'], ['A', '#0a2a3d', '#60a5fa', 'Afternoon 2–10'], ['E', '#2a0a2d', '#c084fc', 'Evening 6–10']].map(([a, bg, fg, lbl]) => (
          <span key={lbl}><span style={{ background: bg, color: fg, padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 10 }}>{a}</span> {lbl}</span>
        ))}
        <span><span style={{ background: '#3d1a1a', color: '#f87171', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>●</span> Conflict</span>
      </div>

      {/* Swap requests */}
      <div style={{ ...S.card, marginTop: 16 }}>
        <div style={S.h2}>Shift Swap Requests</div>
        {swaps.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>No swap requests</div>}
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Requester</th><th style={S.th}>Target</th>
            <th style={S.th}>Date</th><th style={S.th}>Shift</th>
            <th style={S.th}>Note</th><th style={S.th}>Status</th><th style={S.th}>Action</th>
          </tr></thead>
          <tbody>
            {swaps.map(s => {
              const req = employees.find(e => e.id === s.requesterId);
              const tgt = employees.find(e => e.id === s.targetId);
              return (
                <tr key={s.id}>
                  <td style={S.td}>{req?.firstName} {req?.lastName}</td>
                  <td style={S.td}>{tgt?.firstName} {tgt?.lastName}</td>
                  <td style={S.td}>{s.date}</td>
                  <td style={S.td}>{s.shiftType}</td>
                  <td style={S.td}><span style={{ color: '#555' }}>{s.note}</span></td>
                  <td style={S.td}><StatusBadge status={s.status} /></td>
                  <td style={S.td}>
                    {s.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button
                          style={S.btn}
                          disabled={processingId === s.id}
                          onClick={() => handleSwap(s.id, 'Approved')}
                        >
                          {processingId === s.id ? 'Processing...' : 'Approve'}
                        </button>

                        <button style={S.btnDanger} onClick={() => handleSwap(s.id, 'Denied')}>Deny</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulePage;