'use client';

import { useEffect, useRef, useState } from 'react';
import { ScanResult } from '@/types/kiosk';

interface ScanFeedProps {
  scans: ScanResult[];
}

// ── Avatar initials from name ─────────────────────────────────────────────────
function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ── Deterministic warm color from name ───────────────────────────────────────
const COLORS: [string, string][] = [
  ['#3d5a2b', '#8aba5e'],
  ['#2b3d5a', '#5e8aba'],
  ['#5a3d2b', '#ba8a5e'],
  ['#3d2b5a', '#8a5eba'],
  ['#5a2b3d', '#ba5e8a'],
  ['#2b5a3d', '#5eba8a'],
];
function nameColor(name: string): [string, string] {
  const i =
    name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) %
    COLORS.length;

  return COLORS[i];
}

interface ScanRowProps {
  scan:  ScanResult;
  fresh: boolean;
}

function ScanRow({ scan, fresh }: ScanRowProps) {
  const [mounted, setMounted] = useState(false);
  const [bg, fg] = nameColor(scan.employeeName);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  const isIn = scan.action === 'clock_in';

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        border transition-all duration-500 ease-out
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
        ${fresh
          ? 'bg-amber-500/8 border-amber-500/20'
          : 'bg-white/3 border-white/6'}
      `}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: bg, color: fg }}
      >
        {initials(scan.employeeName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white/80 truncate leading-tight">
          {scan.employeeName}
        </div>
        <div className={`text-[11px] font-medium leading-tight mt-0.5 ${isIn ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isIn ? '● Clocked in' : '○ Clocked out'}
        </div>
      </div>

      {/* Time */}
      <div className="text-right shrink-0">
        <div className="text-[12px] font-mono text-white/40 tabular-nums">
          {scan.time}
        </div>
        {fresh && (
          <div className="text-[9px] text-amber-400/70 tracking-widest uppercase font-bold mt-0.5">
            New
          </div>
        )}
      </div>

      {/* Action dot */}
      <div className={`
        w-2 h-2 rounded-full shrink-0
        ${isIn ? 'bg-emerald-400' : 'bg-amber-400'}
        ${fresh ? 'animate-pulse' : ''}
      `} />
    </div>
  );
}

export default function ScanFeed({ scans }: ScanFeedProps) {
  const prevIdsRef = useRef<Set<string>>(new Set());

  // Track which IDs are newly arrived this render
  const freshIds = new Set<string>();
  scans.forEach((s) => {
    if (!prevIdsRef.current.has(s.id)) freshIds.add(s.id);
  });
  useEffect(() => {
    prevIdsRef.current = new Set(scans.map((s) => s.id));
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] text-white/35 uppercase tracking-[0.18em] font-semibold">
          Live attendance feed
        </span>
        {scans.length > 0 && (
          <span className="ml-auto text-[10px] text-white/20 font-mono">
            {scans.length} record{scans.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Scan rows */}
      <div className="flex flex-col gap-1.5 overflow-hidden">
        {scans.length === 0 ? (
          <div className="px-4 py-6 text-center text-[13px] text-white/20 border border-white/5 rounded-xl">
            Waiting for scans…
          </div>
        ) : (
          scans.map((scan) => (
            <ScanRow
              key={scan.id}
              scan={scan}
              fresh={freshIds.has(scan.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}