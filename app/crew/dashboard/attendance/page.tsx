'use client';

import QRScanner from '@/features/attendance/hooks/QrScanner';
import StatusBadge from '@/components/StatusBadge';
import { useAttendancePage } from '@/features/attendance/hooks/useAttendancePage';

const S = {
  card: { background: '#1a1a1a', border: '1px solid #252525', borderRadius: 12, padding: '14px 16px' } as React.CSSProperties,
  h2: { fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 12 },
  btn: { background: '#f5a623', color: '#0f0f0f', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700 } as React.CSSProperties,
};

export default function AttendancePage() {
  const {
    user,
    tab,
    setTab,
    scanActive,
    setScanActive,
    historyFrom,
    setHistoryFrom,
    historyTo,
    setHistoryTo,
    todayLog,
    history,
    isClockedIn,
    loading,
    clockMsg,
    handleScan,
    loadHistory,
  } = useAttendancePage();

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4">

      {/* Title */}
      <div className="text-lg font-bold">Attendance</div>

      {/* Tabs */}
      <div className="flex bg-[#111] rounded-lg p-1">
        {(['qr', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm rounded-md transition
              ${tab === t ? 'bg-[#1a1a1a] text-[#f5a623] font-bold' : 'text-gray-500'}`}
          >
            {t === 'qr' ? '◷ QR' : '📋 History'}
          </button>
        ))}
      </div>

      {/* ── QR TAB ───────────────────────── */}
      {tab === 'qr' && (
        <>
          <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#252525] text-center">
            <div className="text-sm text-gray-400">
              {isClockedIn ? 'Clocked in' : 'Not clocked in'}
            </div>
          </div>

          <div style={S.card}>
            <div style={S.h2}>QR Scanner</div>

            {scanActive ? (
              <div
                style={{
                  width: "100%",
                  minHeight: "auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #222",
                    padding: 16,
                    borderRadius: 12,
                    width: "100%",
                    maxWidth: 520,
                  }}
                >
                  <QRScanner onScan={handleScan} active={scanActive} />

                  <button style={{ width: "100%", marginTop: 10 }} onClick={() => setScanActive(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 120, height: 120, margin: '0 auto 16px',
                  background: '#111', border: '1px dashed #f5a623',
                  borderRadius: 12, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 40,
                }}>
                  📱
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
                  {isClockedIn
                    ? 'Scan your QR to clock out'
                    : 'Scan your QR to clock in'}
                </div>
                <button style={{ ...S.btn, width: '100%' }} onClick={() => setScanActive(true)} disabled={loading}>
                  {loading ? 'Processing…' : '◷ Open Scanner'}
                </button>
              </div>
            )}

          </div>

          {clockMsg && (
            <div className="p-3 rounded bg-[#111] text-sm">
              {clockMsg.text}
            </div>
          )}

          {todayLog && (
            <div style={S.card}>
              <div style={S.h2}>Today Log</div>
              <div className="text-sm text-gray-300">
                In: {todayLog.clockIn} | Out: {todayLog.clockOut ?? 'Active'}
              </div>
              <StatusBadge status={todayLog.status} />
            </div>
          )}
        </>
      )}

      {/* ── HISTORY TAB ───────────────────── */}
      {tab === 'history' && (
        <div style={S.card}>
          <div style={S.h2}>History</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <input
              type="date"
              value={historyFrom}
              onChange={(e) => setHistoryFrom(e.target.value)}
              className="bg-[#111] p-2 rounded text-white"
            />
            <input
              type="date"
              value={historyTo}
              onChange={(e) => setHistoryTo(e.target.value)}
              className="bg-[#111] p-2 rounded text-white"
            />
          </div>

          <button
            style={{ ...S.btn, width: '100%' }}
            onClick={loadHistory}
            disabled={loading}
          >
            Load History
          </button>

          <div className="mt-4">
            {history.map((log) => (
              <div key={log.id} className="border-b border-[#222] py-2 text-sm">
                {log.date} - {log.clockIn} → {log.clockOut ?? 'Active'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}