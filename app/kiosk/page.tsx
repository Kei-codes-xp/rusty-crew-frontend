'use client';

import { useKioskQR }      from '@/features/kiosk/hooks/useKioskqr';
import { useFullscreen }   from '@/features/kiosk/hooks/useFullscreen';
import KioskHeader         from '@/features/kiosk/components/KioskHeader';
import QRDisplay           from '@/features/kiosk/components/QrDisplay';
import SecurityBadges      from '@/features/kiosk/components/SecurityBadge';
import ScanFeed            from '@/features/kiosk/components/ScanFeed';
import IdleOverlay         from '@/features/kiosk/components/IdleOverlay';

export default function KioskPage() {
  const {
    qrContent,
    qrStatus,
    countdown,
    scans,
    error,
    manualRefresh,
    deviceId,
  } = useKioskQR();

  const { enter: enterFullscreen } = useFullscreen();

  return (
    <div
      className="
        relative min-h-screen w-full overflow-hidden
        flex flex-col
      "
      style={{ background: '#0e0e0e' }}
    >
      {/* ── Ambient radial glow behind QR ───────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left:       '50%',
          top:        '52%',
          transform:  'translate(-50%, -50%)',
          width:      700,
          height:     700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.055) 0%, transparent 70%)',
          filter:     'blur(10px)',
        }}
      />

      {/* ── Subtle grid texture overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <KioskHeader />

      {/* ── Divider ─────────────────────────────────────────────────────────── */}
      <div className="mx-8 h-px bg-white/5" />

      {/* ── Main body: QR (center) + Feed (right) ──────────────────────────── */}
      <main className="flex-1 flex items-center justify-center gap-0 px-8 py-6 min-h-0">

        {/* ── Left gutter: empty spacer to balance layout ── */}
        <div className="hidden xl:block flex-1" />

        {/* ── Center column: QR ────────────────────────────────────────────── */}
        <div className="flex flex-col items-center justify-center gap-8 shrink-0 w-full xl:w-auto">

          {/* Status pill */}
          <div className={`
            flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-widest uppercase
            transition-all duration-500
            ${qrStatus === 'ready'
              ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-400'
              : qrStatus === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-amber-500/8 border-amber-500/20 text-amber-400 animate-pulse'}
          `}>
            <div className={`
              w-1.5 h-1.5 rounded-full
              ${qrStatus === 'ready' ? 'bg-emerald-400' : qrStatus === 'error' ? 'bg-red-400' : 'bg-amber-400'}
              ${qrStatus === 'ready' ? 'animate-pulse' : ''}
            `} />
            {qrStatus === 'ready'       && 'QR Active — Ready to scan'}
            {qrStatus === 'loading'     && 'Generating secure QR…'}
            {qrStatus === 'refreshing'  && 'Rotating token…'}
            {qrStatus === 'error'       && 'QR generation failed'}
          </div>

          {/* The QR itself */}
          <QRDisplay
            qrContent={qrContent}
            qrStatus={qrStatus}
            countdown={countdown}
            onManualRefresh={manualRefresh}
          />

          {/* Security badges */}
          <SecurityBadges qrStatus={qrStatus} deviceId={deviceId} />

          {/* Fullscreen button (center, subtle) */}
          <button
            onClick={enterFullscreen}
            className="
              text-[11px] text-white/20 hover:text-amber-400/50
              tracking-widest uppercase transition-colors duration-200
              flex items-center gap-1.5 mt-1
            "
          >
            <span className="text-sm">⊞</span>
            Enter fullscreen kiosk mode
          </button>
        </div>

        {/* ── Right column: scan feed ───────────────────────────────────────── */}
        <div className="
          hidden lg:flex flex-col justify-start
          flex-1 xl:flex-none xl:w-[320px]
          ml-auto pl-10
          pt-2
        ">
          {/* Section label */}
          <div className="mb-4">
            <h2 className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.22em]">
              Recent Activity
            </h2>
            <p className="text-[10px] text-white/15 mt-0.5 tracking-wide">
              Live attendance feed
            </p>
          </div>

          <ScanFeed scans={scans} />

          {/* Bottom tip */}
          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-white/5 bg-white/2 p-4">
              <p className="text-[11px] text-white/30 leading-relaxed">
                <span className="text-amber-400/50 font-semibold">How it works:</span>
                {' '}Open the RustyCrew app → tap Scan QR → point camera at this screen.
                QR rotates every 30 seconds for security.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-8 py-4 border-t border-white/5">
        <p className="text-[10px] text-white/15 tracking-widest uppercase">
          RustyCrew EMS · Kiosk v1.0
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
            <span className="text-[10px] text-white/20 tracking-wide">System online</span>
          </div>
          <span className="text-[10px] text-white/10 font-mono">
            {deviceId.slice(0, 14)}
          </span>
        </div>
      </footer>

      {/* ── Idle screensaver overlay ─────────────────────────────────────────── */}
      <IdleOverlay />
    </div>
  );
}