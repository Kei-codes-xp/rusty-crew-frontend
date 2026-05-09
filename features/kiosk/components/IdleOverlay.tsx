'use client';

import { useState, useEffect, useCallback } from 'react';
import { useKioskClock } from '../hooks/useKioskclock';

const IDLE_SECONDS = 120; // 2 min of no interaction → screensaver

export default function IdleOverlay() {
  const [idle,  setIdle]  = useState(false);
  const [timer, setTimer] = useState(0);
  const { time, date }    = useKioskClock();

  const resetTimer = useCallback(() => {
    setTimer(0);
    setIdle(false);
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    return () => events.forEach((e) => window.removeEventListener(e, resetTimer));
  }, [resetTimer]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => {
        if (t >= IDLE_SECONDS) {
          setIdle(true);
          return t;
        }
        return t + 1;
      });
    }, 1_000);
    return () => clearInterval(id);
  }, []);

  if (!idle) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ background: 'rgba(10,10,10,0.97)' }}
      onClick={resetTimer}
    >
      {/* Floating particles (pure CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-400/20"
            style={{
              left:             `${(i * 37 + 10) % 90}%`,
              top:              `${(i * 53 + 15) % 85}%`,
              animationDelay:   `${i * 0.4}s`,
              animationDuration:`${4 + (i % 3)}s`,
              animation:        'bounce 4s ease-in-out infinite',
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="text-5xl mb-6 animate-pulse">☕</div>

      {/* Clock */}
      <div className="text-6xl font-mono font-bold text-white/80 tabular-nums tracking-tight mb-2">
        {time}
      </div>
      <div className="text-base text-white/30 tracking-widest mb-12">
        {date}
      </div>

      {/* Brand */}
      <div className="text-lg font-bold tracking-[0.4em] text-amber-400/50 uppercase mb-1">
        RustyCrew
      </div>
      <div className="text-xs tracking-[0.3em] text-white/20 uppercase mb-16">
        Employee Attendance Kiosk
      </div>

      {/* Tap hint */}
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl text-white/20">
          👆
        </div>
        <p className="text-xs text-white/20 tracking-widest uppercase">
          Tap to wake
        </p>
      </div>
    </div>
  );
}