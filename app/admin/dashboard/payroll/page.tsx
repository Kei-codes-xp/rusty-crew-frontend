'use client';

import { useState, useEffect } from 'react';
import { usePayrollAdmin } from '@/features/payroll/usePayrollAdmin';
import PayslipCard from '@/components/payroll/PayslipCard';
import {
  PayrollEntry,
  PayrollPeriod,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  GeneratePayrollForm,
  PayrollFrequency,
  PayrollStatus,
} from '@/types/payroll';

// ── Shared style tokens ───────────────────────────────────────────────────────
const S = {
  card: { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '16px 18px' } as React.CSSProperties,
  btn: { background: '#f5a623', color: '#0f0f0f', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnSm: { background: '#1e1e1e', color: '#ccc', border: '1px solid #2a2a2a', borderRadius: 7, padding: '6px 13px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  btnDanger: { background: '#3d1a1a', color: '#f87171', border: '1px solid #5a1a1a', borderRadius: 7, padding: '6px 13px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
  input: { background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '9px 12px', fontSize: 13, color: '#e8e8e8', fontFamily: 'inherit', outline: 'none', width: '100%' } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', display: 'block', marginBottom: 6 },
  h2: { fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 14 },
  th: { fontSize: 10, fontWeight: 700, color: '#444', textTransform: 'uppercase' as const, letterSpacing: '0.07em', padding: '8px 12px', textAlign: 'left' as const },
  td: { fontSize: 13, color: '#888', padding: '10px 12px', borderBottom: '1px solid #1c1c1c', verticalAlign: 'middle' as const },
};

const STATUS_PILL: Record<string, React.CSSProperties> = {
  draft: { background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#f5a623' },
  locked: { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)', color: '#4ade80' },
  voided: { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', color: '#f87171' },
};

const BLANK_FORM: GeneratePayrollForm = {
  startDate: '', endDate: '', frequency: 'weekly', notes: '',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{
      ...STATUS_PILL[status] ?? {},
      fontSize: 10, fontWeight: 700,
      padding: '2px 8px', borderRadius: 20,
    }}>
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
    </span>
  );
}

function Feedback({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600,
      ...(error
        ? { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.22)', color: '#f87171' }
        : { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80' }),
    }}>
      {error ? `⚠ ${error}` : `✔ ${success}`}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPayrollPage() {
  const admin = usePayrollAdmin();

  const [activeTab, setActiveTab] = useState<'periods' | 'entries' | 'payslip'>('periods');
  const [showGenerate, setShowGenerate] = useState(false);
  const [form, setForm] = useState<GeneratePayrollForm>(BLANK_FORM);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [filterFrequency, setFilterFrequency] = useState<PayrollFrequency | ''>('');
  const [filterStatus, setFilterStatus] =
    useState<PayrollStatus | ''>('')

  useEffect(() => {
    admin.fetchPeriods(
      filterFrequency || undefined,
      filterStatus || undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFrequency, filterStatus]);

  async function handleGenerate() {
    if (!form.startDate || !form.endDate) return;
    const ok = await admin.generate(form);
    if (ok) {
      setShowGenerate(false);
      setForm(BLANK_FORM);
      setActiveTab('entries');
    }
  }

  function openPeriod(period: PayrollPeriod) {
    admin.fetchEntries(period);
    setSelectedEntry(null);
    setActiveTab('entries');
  }

  function openPayslip(entry: PayrollEntry) {
    setSelectedEntry(entry);
    setActiveTab('payslip');
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            Payroll Management
          </div>
          <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>
            Generate, review, and lock payroll periods
          </div>
        </div>
        <button style={S.btn} onClick={() => setShowGenerate(true)}>+ Generate Payroll</button>
      </div>

      <Feedback error={admin.error} success={admin.success} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: '#111', borderRadius: 9, padding: 3 }}>
        {([
          { id: 'periods', label: '📋 Periods' },
          { id: 'entries', label: '👥 Entries' },
          { id: 'payslip', label: '🧾 Payslip' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1, padding: '8px', borderRadius: 7,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12, transition: 'all 0.15s',
              fontWeight: activeTab === t.id ? 700 : 400,
              background: activeTab === t.id ? '#1a1a1a' : 'transparent',
              color: activeTab === t.id ? '#f5a623' : '#555',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          PERIODS TAB
      ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'periods' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10 }}>
            <select
              style={{ ...S.input, width: 'auto' }}
              value={filterFrequency}
              onChange={e => setFilterFrequency(e.target.value as PayrollFrequency | '')}
            >
              <option value="">All frequencies</option>
              <option value="weekly">Weekly</option>
              <option value="semi_monthly">Semi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              style={{ ...S.input, width: 'auto' }}
              value={filterStatus}
              onChange={(e) => {
                const value = e.target.value;

                setFilterStatus(
                  value === '' ? '' : (value as PayrollStatus)
                );
              }}
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="locked">Locked</option>
              <option value="voided">Voided</option>
            </select>
          </div>

          <div style={S.card}>
            {admin.loading ? (
              <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '2.5rem' }}>
                Loading periods…
              </div>
            ) : admin.periods.length === 0 ? (
              <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '2.5rem' }}>
                No payroll periods yet.{' '}
                <button
                  style={{ color: '#f5a623', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
                  onClick={() => setShowGenerate(true)}
                >
                  Generate the first one →
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#111' }}>
                      {['Period', 'Freq', 'Date range', 'Emp', 'Total gross', 'Status', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {admin.periods.map(period => (
                      <tr key={period.id}>
                        <td style={{ ...S.td, fontWeight: 600, color: '#ccc' }}>
                          {period.label}
                        </td>
                        <td style={S.td}>
                          {FREQUENCY_LABELS[period.frequency]}
                        </td>
                        <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 11 }}>
                          {period.startDate} → {period.endDate}
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' as const }}>
                          {period.entryCount}
                        </td>
                        <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>
                          ₱{period.totalGross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={S.td}>
                          <StatusPill status={period.status} />
                        </td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button style={S.btnSm} onClick={() => openPeriod(period)}>
                              View
                            </button>
                            {period.status === 'draft' && (
                              <>
                                <button
                                  style={{ ...S.btn, padding: '4px 10px', fontSize: 11 }}
                                  onClick={() => admin.lock(period)}
                                >
                                  🔒 Lock
                                </button>
                                <button
                                  style={S.btnDanger}
                                  onClick={() => admin.voidPeriod(period)}
                                >
                                  Void
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {admin.meta.lastPage > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {Array.from({ length: admin.meta.lastPage }, (_, i) => (
                <button
                  key={i}
                  style={{
                    ...S.btnSm,
                    background: admin.meta.currentPage === i + 1 ? '#f5a623' : '#1e1e1e',
                    color: admin.meta.currentPage === i + 1 ? '#0f0f0f' : '#ccc',
                    borderColor: admin.meta.currentPage === i + 1 ? '#f5a623' : '#2a2a2a',
                  }}
                  onClick={() => admin.fetchPeriods(
                    filterFrequency || undefined,
                    filterStatus || undefined,
                    i + 1,
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          ENTRIES TAB
      ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'entries' && (
        !admin.selectedPeriod ? (
          <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '3rem' }}>
            ← Select a period from the Periods tab to view entries.
          </div>
        ) : (
          <>
            {/* Period summary bar */}
            <div style={{
              ...S.card,
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 0,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e8e8e8' }}>
                  {admin.selectedPeriod.label}
                </div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
                  {admin.selectedPeriod.entryCount} employees ·{' '}
                  ₱{admin.selectedPeriod.totalGross.toLocaleString('en-PH', { minimumFractionDigits: 2 })} total gross
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <StatusPill status={admin.selectedPeriod.status} />
                {admin.selectedPeriod.status === 'draft' && (
                  <button
                    style={{ ...S.btn, padding: '7px 14px', fontSize: 12 }}
                    onClick={() => admin.lock(admin.selectedPeriod!)}
                  >
                    🔒 Lock Period
                  </button>
                )}
              </div>
            </div>

            {/* Aggregate stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { label: 'Total hours', val: `${admin.selectedPeriod.totalHours.toFixed(1)}h`, color: '#ccc' },
                { label: 'Total OT', val: `${admin.selectedPeriod.totalOT.toFixed(1)}h`, color: '#fbbf24' },
                { label: 'Total gross', val: `₱${admin.selectedPeriod.totalGross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, color: '#4ade80' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ ...S.card, textAlign: 'center' as const }}>
                  <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Entries table */}
            <div style={S.card}>
              <div style={S.h2}>
                Employee entries ({admin.entries.length})
              </div>
              {admin.entries.length === 0 ? (
                <div style={{ color: '#444', fontSize: 13 }}>No entries found.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#111' }}>
                        {['Employee', 'Role', 'Hrs', 'OT hrs', 'Base', 'OT pay', 'Gross', 'Net', ''].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {admin.entries.map(e => (
                        <tr key={`${e.employeeId}-${e.firstName}-${e.lastName}`}>
                          <td style={{ ...S.td, fontWeight: 600, color: '#ccc' }}>
                            {e.firstName} {e.lastName}
                          </td>
                          <td style={S.td}>
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#111', border: '1px solid #2a2a2a', color: '#666' }}>
                              {e.role}
                            </span>
                          </td>
                          <td style={S.td}>{e.totalHours.toFixed(1)}h</td>
                          <td style={{ ...S.td, color: e.otHours > 0 ? '#fbbf24' : '#444' }}>
                            {e.otHours > 0 ? `+${e.otHours.toFixed(1)}h` : '—'}
                          </td>
                          <td style={S.td}>
                            ₱{e.base.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ ...S.td, color: e.otPay > 0 ? '#fbbf24' : '#444' }}>
                            {e.otPay > 0 ? `₱${e.otPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}` : '—'}
                          </td>
                          <td style={{ ...S.td, color: '#4ade80', fontWeight: 600 }}>
                            ₱{e.gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={{ ...S.td, color: '#4ade80', fontWeight: 700 }}>
                            ₱{e.net.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                          </td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button style={S.btnSm} onClick={() => openPayslip(e)}>
                                Payslip
                              </button>
                              <button
                                style={S.btnSm}
                                onClick={() => admin.downloadPayslip(e.employeeId, admin.selectedPeriod!)}
                              >
                                ↓
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          PAYSLIP TAB
      ────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'payslip' && (
        selectedEntry && admin.selectedPeriod ? (
          <PayslipCard
            period={admin.selectedPeriod}
            entry={selectedEntry}
            showDailyLogs
            onDownload={() => admin.downloadPayslip(
              selectedEntry.employeeId,
              admin.selectedPeriod!,
            )}
          />
        ) : (
          <div style={{ ...S.card, color: '#444', fontSize: 13, textAlign: 'center', padding: '3rem' }}>
            ← Select an employee from the Entries tab to view their payslip.
          </div>
        )
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          GENERATE MODAL
      ────────────────────────────────────────────────────────────────────── */}
      {showGenerate && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200,
          }}
          onClick={() => setShowGenerate(false)}
        >
          <div
            style={{
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              borderRadius: 16, padding: '24px 22px',
              width: 400, maxWidth: '95vw',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Generate Payroll</div>

            {/* Frequency */}
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Pay frequency</label>
              <select
                style={S.input}
                value={form.frequency}
                onChange={e => setForm(p => ({ ...p, frequency: e.target.value as PayrollFrequency }))}
              >
                <option value="weekly">Weekly</option>
                <option value="semi_monthly">Semi-Monthly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Date range */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <label style={S.label}>Start date</label>
                <input
                  type="date"
                  style={S.input}
                  value={form.startDate}
                  onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label style={S.label}>End date</label>
                <input
                  type="date"
                  style={S.input}
                  value={form.endDate}
                  onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 18 }}>
              <label style={S.label}>Notes (optional)</label>
              <input
                style={S.input}
                placeholder="e.g. Week 18 payroll run"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              />
            </div>

            {/* Warning */}
            <div style={{
              padding: '9px 12px', borderRadius: 8, marginBottom: 18,
              background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.18)',
              fontSize: 11, color: 'rgba(245,166,35,0.75)', lineHeight: 1.65,
            }}>
              ⚠ Payroll is computed server-side from time_logs and saved as an
              immutable snapshot. Lock the period once reviewed.
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={S.btnSm} onClick={() => setShowGenerate(false)}>
                Cancel
              </button>
              <button
                style={{
                  ...S.btn,
                  opacity: (!form.startDate || !form.endDate || admin.generating) ? 0.5 : 1,
                  cursor: (!form.startDate || !form.endDate || admin.generating) ? 'not-allowed' : 'pointer',
                }}
                disabled={!form.startDate || !form.endDate || admin.generating}
                onClick={handleGenerate}
              >
                {admin.generating
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 12, height: 12, border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid rgba(0,0,0,0.7)', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Generating…
                  </span>
                  : 'Generate'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}