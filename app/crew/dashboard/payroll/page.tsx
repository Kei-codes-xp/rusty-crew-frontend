'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEmployeePayroll } from '@/features/payroll/hooks/useEmployeePayroll';
import { getWeekDates } from '@/utils/date';

const S = {
  card:  { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
  h2:    { fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 12 },
  btn:   { background: '#f5a623', color: '#0f0f0f', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnSm: { background: '#1e1e1e', color: '#ccc', border: '1px solid #2a2a2a', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  input: { background: '#111', border: '1px solid #2a2a2a', borderRadius: 7, padding: '8px 11px', fontSize: 13, color: '#e8e8e8', fontFamily: 'inherit' } as React.CSSProperties,
  row:   { display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #1c1c1c' } as React.CSSProperties,
};

export default function PayrollPage() {
  const { user }    = useAuth();
  const payrollHook = useEmployeePayroll(user?.id ?? 0);

  const [from, setFrom] = useState(getWeekDates(0)[0]);
  const [to,   setTo]   = useState(getWeekDates(0)[6]);

  const { payroll, loading, error } = payrollHook;

  function handleFetch() {
    payrollHook.fetchPayroll(from, to);
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>Payroll</div>

      {/* ── Period selector ───────────────────────────────────────────────── */}
      <div style={S.card}>
        <div style={S.h2}>Select period</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: '#555', display: 'block', marginBottom: 4 }}>From</label>
            <input type="date" style={{ ...S.input, width: '100%' }} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#555', display: 'block', marginBottom: 4 }}>To</label>
            <input type="date" style={{ ...S.input, width: '100%' }} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <button style={{ ...S.btn, width: '100%' }} onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading…' : 'View Payroll'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#2d0f0f', border: '1px solid #4a1a1a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      {/* ── Payroll breakdown ─────────────────────────────────────────────── */}
      {payroll && (
        <>
          {/* Pay type */}
          <div style={{ ...S.card, background: '#0f1a10', border: '1px solid #1a3a1a', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Estimated Gross Pay
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#4ade80', letterSpacing: -1 }}>
              ₱{payroll.gross.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
              {from} → {to}
            </div>
          </div>

          {/* Breakdown */}
          <div style={S.card}>
            <div style={S.h2}>Breakdown</div>

            {[
              { label: 'Pay type',       val: payroll.isSalaried ? 'Salaried' : 'Hourly', color: '#888' },
              { label: 'Rate',           val: payroll.isSalaried ? `₱${payroll.monthlySalary.toLocaleString()}/mo` : `₱${payroll.hourlyRate}/hr`, color: '#888' },
              { label: 'Hours worked',   val: `${payroll.totalHours.toFixed(1)}h`,   color: '#ccc' },
              { label: 'Overtime hours', val: `${payroll.otHours.toFixed(1)}h`,       color: payroll.otHours > 0 ? '#fbbf24' : '#444' },
              { label: 'Base pay',       val: `₱${payroll.base.toLocaleString()}`,    color: '#ccc' },
              { label: 'Overtime pay',   val: `₱${payroll.otPay.toFixed(0)}`,         color: payroll.otPay > 0 ? '#fbbf24' : '#444' },
            ].map(({ label, val, color }) => (
              <div key={label} style={S.row}>
                <span style={{ fontSize: 13, color: '#555' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color }}>{val}</span>
              </div>
            ))}

            {/* Gross total */}
            <div style={{ ...S.row, borderBottom: 'none', paddingTop: 12, marginTop: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8' }}>Gross Pay</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#4ade80' }}>₱{payroll.gross.toLocaleString()}</span>
            </div>
          </div>

          {/* Daily log */}
          {payroll.logs.length > 0 && (
            <div style={S.card}>
              <div style={S.h2}>Daily breakdown</div>
              {payroll.logs.map((log) => (
                <div key={log.date} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '7px 0',
                  borderBottom: '1px solid #1c1c1c',
                }}>
                  <span style={{ fontSize: 12, color: '#555' }}>{log.date}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{log.hoursWorked.toFixed(1)}h</span>
                  {log.overtime > 0 && (
                    <span style={{ fontSize: 11, color: '#fbbf24' }}>+{log.overtime.toFixed(1)}h OT</span>
                  )}
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 600,
                    background: log.status === 'Late' ? '#3d2a1a' : '#1a3d2b',
                    color:      log.status === 'Late' ? '#fb923c'  : '#4ade80',
                  }}>{log.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Download payslip */}
          <button
            style={{ ...S.btn, width: '100%' }}
            onClick={() => payrollHook.downloadPayslip(from, to)}
          >
            ↓ Download Payslip PDF
          </button>
        </>
      )}
    </div>
  );
}