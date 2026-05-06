"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDashboard } from "@/app/dashboard/useDashboard";
import Avatar from "@/components/Avatar";
import { S } from "@/styles/dashboardStyles";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';


const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/employees", label: "Employees" },
  { href: "/dashboard/attendance", label: "Attendance" },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/payroll", label: "Payroll" },
  { href: "/dashboard/leaves", label: "Leaves" },
  { href: "/dashboard/notifications", label: "Notifications" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const unread = 3;
  const managerEmp = user;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user]);

  function handleLogout() {
    logout();
  }
  if (loading) {
    <p>Loading</p>
  }
     return (
      <div className="flex min-h-screen bg-[#0F0F0F] text-gray-200">
        {/* Sidebar */}
        <aside className="w-56 bg-[#0F0F0F] border-r border-[#222] flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <span className="text-xl">☕</span>
              <span className="font-semibold text-amber-50">RUSTYCREW</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-3 py-2 rounded-lg text-sm transition
                ${path === href
                    ? "bg-[#1E1E1E] text-[#F5A623] border border-[#2A2A2A]"
                    : "text-gray-400 hover:text-[#F5A623]"
                  }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-[#222]">
            {managerEmp && (
              <div className="flex items-center gap-3 mb-3">
                <Avatar emp={managerEmp} size={30} />
                <div>
                  <p className="text-xs font-medium text-gray-300">
                    {managerEmp.firstName} {managerEmp.lastName}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {managerEmp.role}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-500"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          {/* Topbar */}
          <header className="h-14 flex items-center justify-between px-6 border-b border-[#222] bg-[#0F0F0F]">
            <div className="text-xs uppercase tracking-widest text-gray-500">
              {NAV.find((n) => n.href === path)?.label || "Dashboard"}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/notifications">
                <button
                  style={{
                    ...S.btnSm,
                    position: "relative",
                  }}
                >
                  🔔
                  {unread > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        background: "#f5a623",
                        color: "#000",
                        borderRadius: 10,
                        padding: "0 4px",
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    >
                      {unread}
                    </span>
                  )}
                </button>
              </Link>
              <button className="px-3 py-2 text-xs rounded bg-[#F5A623] border border-[#2A2A2A] text-[#0F0F0F]">
                QR Clock-in
              </button>

              {managerEmp && (
                <div className="flex items-center gap-2">
                  <Avatar emp={managerEmp} size={26} />
                  <span className="text-xs text-gray-400">Manager</span>
                </div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <section className="flex-1 p-6 overflow-auto">
            {children}
          </section>
        </main>
      </div>
    );
}