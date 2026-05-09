'use client';

import { useEffect, useState } from 'react';
import { QRStatus } from '@/types/kiosk';
interface SecurityBadgesProps {
  qrStatus: QRStatus;
  deviceId: string;
}

export default function SecurityBadges({ qrStatus, deviceId }: SecurityBadgesProps) {
  const ready = qrStatus === 'ready';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeDeviceId = mounted ? deviceId : '';

  const badges = [
    { label: 'Secure QR', ok: ready, icon: '🔐' },
    { label: 'Device-bound', ok: true, icon: '📱' },
    { label: 'Rotating token', ok: ready, icon: '🔄' },
    { label: 'HMAC-SHA256', ok: ready, icon: '🛡' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {badges.map((b) => (
        <div
          key={b.label}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold
            tracking-wide transition-all duration-500
            ${b.ok
              ? 'bg-emerald-500/8 border-emerald-500/25 text-emerald-400'
              : 'bg-white/3 border-white/8 text-white/25'}
          `}
        >
          <span className={`text-[10px] ${b.ok ? 'opacity-100' : 'opacity-40'}`}>
            {b.icon}
          </span>
          <span className={b.ok ? '' : 'opacity-40'}>
            {b.ok ? '✔' : '○'} {b.label}
          </span>
        </div>
      ))}

      {/* Device ID chip */}
      {safeDeviceId && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/6 bg-white/2 text-[10px] text-white/20 font-mono tracking-widest">
          {safeDeviceId.slice(0, 18)}…
        </div>
      )}
    </div>
  );
}