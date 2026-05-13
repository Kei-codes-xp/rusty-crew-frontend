'use client';

import { useState } from 'react';
import { Employee } from '@/types';
import { initials, avatarBg, avatarFg } from '@/utils/employee';

interface AvatarProps {
  emp: Employee;
  size?: number;
  editable?: boolean;           // show camera overlay on hover
  onClick?: () => void;        // called when overlay is clicked
  loading?: boolean;           // show spinner (uploading state)
  className?: string;
}

export default function Avatar({
  emp,
  size = 32,
  editable = false,
  onClick,
  loading = false,
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = !!emp.avatarUrl && !imgError;
  const accent = emp.themeColor ?? '#f5a623';
  const fontSize = size * 0.34;
  const borderRad = '50%';

  // ── Initials fallback layer ───────────────────────────────────────────────
  const InitialsLayer = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: borderRad,
        background: avatarBg(emp),
        color: avatarFg(emp),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        flexShrink: 0,
        fontFamily: 'monospace',
        letterSpacing: 0,
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {initials(emp)}
    </div>
  );

  const getAvatarUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;

    return `http://localhost:8000${url}`;
  };

  // ── Image layer ───────────────────────────────────────────────────────────
  const ImageLayer = showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getAvatarUrl(emp.avatarUrl)!}
      alt={`${emp.firstName} ${emp.lastName}`}
      width={size}
      height={size}
      onError={() => setImgError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: borderRad,
        objectFit: 'cover',
        flexShrink: 0,
        display: 'block',
      }}
    />
  ) : null;

  // ── Loading spinner overlay ───────────────────────────────────────────────
  const Spinner = loading ? (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: borderRad,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: '50%',
          border: `2px solid rgba(255,255,255,0.2)`,
          borderTop: `2px solid ${accent}`,
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  ) : null;

  // ── Editable camera overlay ───────────────────────────────────────────────
  const EditOverlay = editable && !loading ? (
    <div
      className="avatar-edit-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: borderRad,
        background: 'rgba(0,0,0,0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
      }}
      onClick={onClick}
      role="button"
      aria-label="Change profile picture"
    >
      {/* Camera icon — hidden until hover via CSS class */}
      <svg
        className="avatar-camera-icon"
        width={size * 0.38}
        height={size * 0.38}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
      >
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    </div>
  ) : null;

  return (
    <>
      {/* Inline CSS for hover — avoids Tailwind JIT issues with dynamic selectors */}
      <style>{`
        .avatar-editable:hover .avatar-edit-overlay {
          background: rgba(0,0,0,0.52) !important;
        }
        .avatar-editable:hover .avatar-camera-icon {
          opacity: 1 !important;
        }
        .avatar-editable {
          cursor: pointer;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className={`${editable ? 'avatar-editable' : ''} ${className ?? ''}`}
        style={{
          position: 'relative',
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: borderRad,
          // Subtle ring using theme color when editable
          boxShadow: editable
            ? `0 0 0 2px rgba(${hexToRgb(accent)}, 0.35)`
            : undefined,
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {showImage ? ImageLayer : InitialsLayer}
        {Spinner}
        {EditOverlay}
      </div>
    </>
  );
}

// ── Utility: hex to "r, g, b" string for rgba() ───────────────────────────────
function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}