'use client';

import { useFullscreen } from '@/features/kiosk/hooks/useFullscreen';
import { useKioskClock } from '@/features/kiosk/hooks/useKioskclock';

export default function KioskHeader() {
  const { time, date } = useKioskClock();
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <header className="flex items-center justify-between w-full px-8 pt-7 pb-2 select-none">
      {/* ── Logo block ── */}
      <div className="flex items-center gap-3">
        <div className="
          w-11 h-11 rounded-xl flex items-center justify-center text-2xl
          bg-amber-500/15 border border-amber-500/30
          shadow-[0_0_18px_rgba(245,166,35,0.18)]
        ">
          ☕
        </div>
        <div>
          <div className="text-lg font-bold tracking-widest text-white/90 leading-tight">
            RUSTYCREW
          </div>
          <div className="text-[11px] tracking-[0.18em] text-amber-400/70 uppercase font-medium leading-tight">
            Employee Attendance Kiosk
          </div>
        </div>
      </div>

      {/* ── Clock block ── */}
      <div className="text-right flex flex-col items-end gap-0.5">
        <div className="text-3xl font-mono font-bold text-white/90 tracking-tight tabular-nums leading-none">
          {time}
        </div>
        <div className="text-xs text-white/40 tracking-wide font-medium">
          {date}
        </div>
      </div>

      {/* ── Fullscreen toggle ── */}
      <button
        onClick={toggle}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="
          absolute top-5 right-6
          w-8 h-8 rounded-lg flex items-center justify-center
          text-white/30 hover:text-amber-400/70
          hover:bg-white/5 transition-all duration-200
          text-xs
        "
      >
        {isFullscreen ? '⊡' : '⊞'}
      </button>
    </header>
  );
}