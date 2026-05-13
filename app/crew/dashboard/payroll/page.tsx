'use client';

import { useState }              from 'react';
import { usePayrollEmployee }    from '@/features/payroll/usePayrollEmployee';
import PayslipCard               from '@/components/payroll/PayslipCard';
import { PayrollPeriod, FREQUENCY_LABELS } from '@/types/payroll';

const S = {
  card:  { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
  btnSm: { background: '#1e1e1e', color: '#ccc', border: '1px solid #2a2a2a', borderRadius: 7, padding: '6px 13px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btn:   { background: '#f5a623', color: '#0f0f0f', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
};

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  draft:  { bg: 'rgba(245,166,35,0.1)',  fg: '#f5a623' },
  locked: { bg: 'rgba(74,222,128,0.08)', fg: '#4ade80' },
  voided: { bg: 'rgba(248,113,113,0.08)',fg: '#f87171' },
};

export default function EmployeePayrollPage() {
  const { periods, selectedPeriod, entry, loading, error, fetchEntry, downloadPdf } = usePayrollEmployee();
  const [view, setView] = useState<'list' | 'detail'>('list');

  function handleSelect(period: PayrollPeriod) {
    fetchEntry(period);
    setView('detail');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>
          {view === 'detail' && selectedPeriod
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setView('list')}
                  style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16, padding: 0 }}
                >
                  ←
                </button>
                Payslip
              </span>
            : 'My Payroll'}
        </div>
        {view === 'detail' && selectedPeriod && (
          <button style={S.btn} onClick={() => downloadPdf(selectedPeriod)}>
            ↓ Download
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600,
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)',
          color: '#f87171',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && (
        <>
          {loading ? (
            <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '2.5rem' }}>
              Loading payroll history…
            </div>
          ) : periods.length === 0 ? (
            <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>💰</div>
              No payroll records yet.
              <div style={{ fontSize: 11, color: '#333', marginTop: 6 }}>
                Your manager will generate payroll at the end of each period.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {periods.map(period => {
                const sc = STATUS_COLORS[period.status] ?? STATUS_COLORS.draft;
                return (
                  <div
                    key={period.id}
                    style={{
                      ...S.card,
                      cursor:   'pointer',
                      display:  'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      transition: 'border-color 0.15s',
                    }}
                    onClick={() => handleSelect(period)}
                  >
                    {/* Left */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e8e8', marginBottom: 3 }}>
                        {period.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#555' }}>
                        {FREQUENCY_LABELS[period.frequency]} ·{' '}
                        {period.startDate} → {period.endDate}
                      </div>
                    </div>

                    {/* Status + chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: sc.bg, border: `1px solid ${sc.fg}33`, color: sc.fg,
                      }}>
                        {period.status === 'locked' ? '🔒 ' : ''}{period.status}
                      </span>
                      <span style={{ color: '#333', fontSize: 14 }}>›</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Detail / Payslip view ── */}
      {view === 'detail' && (
        loading ? (
          <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '2.5rem' }}>
            Loading payslip…
          </div>
        ) : entry && selectedPeriod ? (
          <PayslipCard
            period={selectedPeriod}
            entry={entry}
            showDailyLogs
            onDownload={() => downloadPdf(selectedPeriod)}
          />
        ) : !error ? (
          <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '2.5rem' }}>
            No payslip data available for this period.
          </div>
        ) : null
      )}
    </div>
  );
}