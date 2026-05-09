'use client';

import { useEffect, useRef, useState } from 'react';
import { QRStatus } from '@/types/kiosk';

interface QRDisplayProps {
  qrContent:     string | null;
  qrStatus:      QRStatus;
  countdown:     number;
  onManualRefresh: () => void;
}

const QR_TTL = 30;

export default function QRDisplay({
  qrContent,
  qrStatus,
  countdown,
  onManualRefresh,
}: QRDisplayProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  // ── Draw QR onto canvas using qrcode library ───────────────────────────────
  useEffect(() => {
    if (!qrContent || qrStatus !== 'ready') return;

    // Animate: fade out → render → fade in
    setVisible(false);
    const t = setTimeout(async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const canvas = canvasRef.current;
        if (!canvas) return;
        await QRCode.toCanvas(canvas, qrContent, {
          width:            340,
          margin:           2,
          color: {
            dark:  '#111111',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
        });
        setVisible(true);
      } catch (e) {
        console.error('QR render error', e);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [qrContent, qrStatus]);

  // ── Countdown ring ─────────────────────────────────────────────────────────
  const pct         = countdown / QR_TTL;
  const RADIUS      = 26;
  const CIRC        = 2 * Math.PI * RADIUS;
  const dashoffset  = CIRC * (1 - pct);
  const isUrgent    = countdown <= 8;

  return (
    <div className="flex flex-col items-center gap-6 select-none">

      {/* ── QR card ── */}
      <div className="relative">

        {/* Ambient glow */}
        <div className={`
          absolute -inset-6 rounded-3xl blur-2xl transition-opacity duration-700
          ${qrStatus === 'ready'
            ? 'bg-amber-500/12 opacity-100'
            : 'opacity-0'}
        `} />

        {/* Card */}
        <div className={`
          relative z-10 rounded-3xl p-5
          bg-white
          shadow-[0_0_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)]
          transition-all duration-300
          ${qrStatus === 'refreshing' ? 'scale-[0.985] opacity-60' : 'scale-100 opacity-100'}
        `}>

          {/* QR canvas or skeleton */}
          {qrStatus === 'error' ? (
            <div className="w-340px h-340px flex flex-col items-center justify-center gap-3 bg-[#1a1a1a] rounded-xl">
              <div className="text-3xl">⚠</div>
              <p className="text-[13px] text-white/50 text-center px-6 leading-relaxed">
                Unable to generate secure attendance QR
              </p>
              <button
                onClick={onManualRefresh}
                className="mt-2 px-5 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide hover:bg-amber-500/30 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (qrStatus === 'loading') ? (
            <div className="w-340px h-340px rounded-xl overflow-hidden">
              <div className="w-full h-full bg-linear-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className={`rounded-xl transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
              width={340}
              height={340}
            />
          )}
        </div>

        {/* Pulse ring (when ready) */}
        {qrStatus === 'ready' && (
          <div className="absolute -inset-2 rounded-2rem border border-amber-400/20 animate-ping opacity-40 pointer-events-none" />
        )}
      </div>

      {/* ── Countdown row ── */}
      <div className="flex items-center gap-3">
        {/* SVG ring */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg
            width="56" height="56"
            className={`-rotate-90 transition-colors duration-300 ${isUrgent ? 'drop-shadow-[0_0_6px_rgba(251,146,60,0.8)]' : ''}`}
          >
            {/* track */}
            <circle
              cx="28" cy="28" r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="3.5"
            />
            {/* progress */}
            <circle
              cx="28" cy="28" r={RADIUS}
              fill="none"
              stroke={isUrgent ? '#fb923c' : '#f5a623'}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className={`
            absolute text-sm font-bold font-mono tabular-nums
            ${isUrgent ? 'text-orange-400' : 'text-amber-400'}
          `}>
            {countdown}
          </span>
        </div>

        <div>
          <p className="text-[13px] text-white/50 leading-tight">
            {qrStatus === 'refreshing'
              ? 'Generating new QR…'
              : `Refreshing in ${countdown}s`}
          </p>
          <p className="text-[11px] text-white/25 tracking-wide mt-0.5">
            Rotating token · HMAC-SHA256
          </p>
        </div>
      </div>

      {/* ── Instruction ── */}
      <p className="text-[13px] text-white/35 tracking-wide text-center max-w-280px leading-relaxed">
        Open the <span className="text-amber-400/60 font-semibold">RustyCrew</span> app on your phone and scan to clock in or out
      </p>
    </div>
  );
}