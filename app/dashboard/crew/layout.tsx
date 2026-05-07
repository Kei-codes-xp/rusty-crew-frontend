'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeNotifications } from '@/features/notification/hooks/useEmployeeNotifications';
import Avatar from '@/components/Avatar';
import api from '@/lib/api';

const NAV = [
  { href: '/employee/dashboard',     label: 'Home',       icon: '◈' },
  { href: '/employee/schedule',      label: 'Schedule',   icon: '▦' },
  { href: '/employee/attendance',    label: 'Attendance', icon: '◷' },
  { href: '/employee/swaps',         label: 'Swaps',      icon: '⇄' },
  { href: '/employee/leave',         label: 'Leave',      icon: '◌' },
  { href: '/employee/payroll',       label: 'Payroll',    icon: '◎' },
  { href: '/employee/notifications', label: 'Alerts',     icon: '◬' },
];

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  const path    = usePathname();
  const router  = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount }  = useEmployeeNotifications();

  async function handleLogout() {
    try { await api.post('/auth/logout'); } catch {}
    logout();
    router.push('/login');
  }

  if (!user) return null;

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      minHeight:     '100vh',
      background:    '#0f0f0f',
      color:         '#e8e8e8',
      fontFamily:    '"JetBrains Mono", "Fira Code", monospace',
      maxWidth:      480,    // mobile-first cap
      margin:        '0 auto',
      position:      'relative',
    }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header style={{
        background:    '#141414',
        borderBottom:  '1px solid #222',
        padding:       '0 16px',
        height:        52,
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        position:      'sticky',
        top:           0,
        zIndex:        50,
        flexShrink:    0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>☕</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>BREWCREW</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Notification badge */}
          <Link href="/employee/notifications" style={{ position: 'relative', textDecoration: 'none' }}>
            <span style={{ fontSize: 16 }}>◬</span>
            {unreadCount > 0 && (
              <span style={{
                position:   'absolute',
                top:        -4,
                right:      -6,
                background: '#f5a623',
                color:      '#000',
                fontSize:   9,
                fontWeight: 700,
                borderRadius: 10,
                padding:    '1px 4px',
                minWidth:   14,
                textAlign:  'center',
              }}>{unreadCount}</span>
            )}
          </Link>

          {/* Avatar */}
          {user && (
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              title="Logout"
            >
              <Avatar emp={user} size={28} />
            </button>
          )}
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '16px 16px 80px', overflowY: 'auto' }}>
        {children}
      </main>

      {/* ── Bottom navigation (mobile) ──────────────────────────────────── */}
      <nav style={{
        position:      'fixed',
        bottom:        0,
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         '100%',
        maxWidth:      480,
        background:    '#141414',
        borderTop:     '1px solid #222',
        display:       'grid',
        gridTemplateColumns: `repeat(${NAV.length}, 1fr)`,
        zIndex:        50,
        height:        60,
      }}>
        {NAV.map((n) => {
          const active = path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            2,
                textDecoration: 'none',
                color:          active ? '#f5a623' : '#444',
                fontSize:       18,
                paddingTop:     6,
                borderTop:      active ? '2px solid #f5a623' : '2px solid transparent',
                transition:     'all 0.15s',
                position:       'relative',
              }}
            >
              <span>{n.icon}</span>
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 400 }}>{n.label}</span>
              {n.href === '/employee/notifications' && unreadCount > 0 && (
                <span style={{
                  position:   'absolute',
                  top:        4,
                  right:      8,
                  background: '#f5a623',
                  color:      '#000',
                  fontSize:   8,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding:    '1px 3px',
                }}>{unreadCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}