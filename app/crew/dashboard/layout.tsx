'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEmployeeNotifications } from '@/features/notification/hooks/useEmployeeNotifications';
import Avatar from '@/components/Avatar';
import api from '@/lib/api';

const NAV = [
  { href: '/crew/dashboard', label: 'Home', icon: '◈' },
  { href: '/crew/dashboard/schedule', label: 'Schedule', icon: '▦' },
  { href: '/crew/dashboard/attendance', label: 'Attendance', icon: '◷' },
  { href: '/crew/dashboard/swaps', label: 'Swaps', icon: '⇄' },
  { href: '/crew/dashboard/leave', label: 'Leave', icon: '◌' },
  { href: '/crew/dashboard/payroll', label: 'Payroll', icon: '◎' },
  // { href: '/crew/dashboard/notifications', label: 'Alerts', icon: '◬' },
];

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useEmployeeNotifications();

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } catch { }
    logout();
    router.push('/login');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#e8e8e8] flex flex-col">

      <header className="h-20 sticky top-0 z-50 flex items-center justify-between px-4 bg-[#141414] border-b border-[#222]">
        <div className="flex items-center gap-2">
          <span className="text-lg">☕</span>
          <span className="text-sm font-bold tracking-wide">RUSTYCREW</span>
        </div>

        <div className="flex items-center gap-4">

          <Link href="/crew/dashboard/notifications" className="relative">
            <span className="text-lg">◬</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#f5a623] text-black text-[10px] font-bold px-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </Link>

          <button onClick={handleLogout}>
            <Avatar emp={user} size={28} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">

        <aside className="hidden md:flex md:w-56 flex-col bg-[#141414] border-r border-[#222] p-3 gap-1">
          {NAV.map((n) => {
            const active =
              n.href === '/crew/dashboard'
                ? path === '/crew/dashboard'
                : path.startsWith(n.href);

            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                  ${active
                    ? 'text-[#f5a623] bg-[#1f1a12]'
                    : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'
                  }`}
              >
                <span>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#141414] border-t border-[#222] grid grid-cols-6">
        {NAV.map((n) => {
          const active =
            n.href === '/crew/dashboard'
              ? path === '/crew/dashboard'
              : path.startsWith(n.href);

          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center justify-center text-[11px] gap-1
                ${active ? 'text-[#f5a623]' : 'text-[#444]'}`}
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}