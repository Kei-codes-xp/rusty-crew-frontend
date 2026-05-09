import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'RustyCrew — Attendance Kiosk',
  description: 'Employee QR attendance kiosk',
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0e0e0e',
};

export default function KioskLayout({ children }: { children: ReactNode }) {
  return (
    <div className="kiosk-root">
      {children}

      <style>{`
        /* Prevent text selection on kiosk */
        .kiosk-root * {
          -webkit-user-select: none;
          user-select: none;
        }

        /* Prevent scroll globally */
        html, body {
          overflow: hidden;
          height: 100%;
        }

        /* Scrollbar only for scan feed */
        .kiosk-scroll::-webkit-scrollbar { width: 3px; }
        .kiosk-scroll::-webkit-scrollbar-track { background: transparent; }
        .kiosk-scroll::-webkit-scrollbar-thumb {
          background: rgba(245,166,35,0.2);
          border-radius: 10px;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.15; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.35; }
        }

        .float-particle {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}