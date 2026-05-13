'use client';

import { PayrollEntry, PayrollPeriod, FREQUENCY_LABELS } from '@/types/payroll';

interface PayslipCardProps {
  period:         PayrollPeriod;
  entry:          PayrollEntry;
  onDownload?:    () => void;
  showDailyLogs?: boolean;
}

const S = {
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13,
  } as React.CSSProperties,
  th: {
    fontSize: 10, fontWeight: 700, color: '#444',
    textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '7px 10px',
  },
  td: {
    fontSize: 12, color: '#888', padding: '8px 10px',
    borderBottom: '1px solid #1c1c1c', verticalAlign: 'middle' as const,
  },
};

const STATUS_COLORS: Record<string, string> = {
  'On time': '#4ade80', Late: '#fb923c', Undertime: '#fbbf24', Absent: '#f87171',
};

export default function PayslipCard({ period, entry, onDownload, showDailyLogs = false }: PayslipCardProps) {
  const isLocked = period.status === 'locked';

  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #252525', borderRadius: 14, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1e1e,#161616)', padding: '20px 22px', borderBottom: '1px solid #222' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>☕</span>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.85)' }}>RUSTYCREW</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Employee Payslip</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 3 }}>
              {FREQUENCY_LABELS[period.frequency]}
            </div>
            <div style={{ fontSize: 11, color: '#555' }}>{period.startDate} – {period.endDate}</div>
            <div style={{
              marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
              ...(isLocked
                ? { background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80' }
                : { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#f5a623' }),
            }}>
              {isLocked ? '🔒 Locked' : '📝 Draft'}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            {entry.firstName} {entry.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>
            {entry.role} · {entry.isSalaried ? 'Salaried' : `₱${entry.hourlyRate}/hr`}
          </div>
        </div>
      </div>

      {/* Gross pay hero */}
      <div style={{ padding: '18px 22px', background: 'rgba(74,222,128,0.04)', borderBottom: '1px solid #1e1e1e', textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          {entry.net !== entry.gross ? 'Net Pay' : 'Gross Pay'}
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, color: '#4ade80', letterSpacing: -1 }}>
          ₱{(entry.net || entry.gross).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
        </div>
        {entry.net !== entry.gross && (
          <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>
            Gross: ₱{entry.gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div style={{ padding: '16px 22px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          Breakdown
        </div>
        {[
          { label: 'Hours worked',        value: `${entry.totalHours.toFixed(1)}h`,  color: '#ccc' },
          { label: 'Overtime hours',      value: `${entry.otHours.toFixed(1)}h`,     color: entry.otHours > 0 ? '#fbbf24' : '#444' },
          { label: 'Base pay',            value: `₱${entry.base.toLocaleString('en-PH', {minimumFractionDigits:2})}`, color: '#ccc' },
          { label: 'Overtime pay (1.25×)',value: `₱${entry.otPay.toLocaleString('en-PH', {minimumFractionDigits:2})}`, color: entry.otPay > 0 ? '#fbbf24' : '#444' },
          ...(entry.deductions > 0 ? [{ label: 'Deductions', value: `-₱${entry.deductions.toLocaleString('en-PH', {minimumFractionDigits:2})}`, color: '#f87171' }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} style={S.row}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{label}</span>
            <span style={{ color, fontWeight: 600, fontSize: 13 }}>{value}</span>
          </div>
        ))}
        <div style={{ ...S.row, borderBottom: 'none', paddingTop: 12, marginTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
            {entry.net !== entry.gross ? 'Net Pay' : 'Gross Pay'}
          </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>
            ₱{(entry.net || entry.gross).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Daily logs */}
      {showDailyLogs && entry.logs.length > 0 && (
        <div style={{ borderTop: '1px solid #1e1e1e' }}>
          <div style={{ padding: '12px 22px 6px', fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Daily breakdown ({entry.logs.length} days)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#111' }}>
                  {['Date','In','Out','Hrs','OT','Status'].map(h => (
                    <th key={h} style={{ ...S.th, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entry.logs.map(log => (
                  <tr key={log.date}>
                    <td style={S.td}>{log.date.slice(5)}</td>
                    <td style={S.td}>{log.clockIn  ?? '—'}</td>
                    <td style={S.td}>{log.clockOut ?? '—'}</td>
                    <td style={S.td}>{log.hoursWorked.toFixed(1)}</td>
                    <td style={{ ...S.td, color: log.overtime > 0 ? '#fbbf24' : '#444' }}>
                      {log.overtime > 0 ? `+${log.overtime.toFixed(1)}` : '—'}
                    </td>
                    <td style={S.td}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600, color: STATUS_COLORS[log.status] ?? '#888', background: `${STATUS_COLORS[log.status] ?? '#888'}18` }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '14px 22px', borderTop: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: '#333' }}>
          Period #{period.id}{isLocked && ' · 🔒 Immutable snapshot'}
        </div>
        {onDownload && (
          <button onClick={onDownload} style={{ background: '#f5a623', color: '#0f0f0f', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            ↓ Download
          </button>
        )}
      </div>
    </div>
  );
}