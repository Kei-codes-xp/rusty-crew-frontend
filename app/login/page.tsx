// src/app/login/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Image from 'next/image';

type Tab = 'qr' | 'pin' | 'manager' | 'crew';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'qr', label: 'QR Scan', icon: '⬛' },
  { id: 'pin', label: 'PIN', icon: '🔢' },
  { id: 'manager', label: 'Manager', icon: '🛡️' },
  { id: 'crew', label: 'Crew', icon: '👤' },
];

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('qr');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const scannerRef = useRef<any>(null);
  const isProcessingRef = useRef(false);
  const { login } = useAuth();
  const router = useRouter();

  // ── QR scanner logic ──
  useEffect(() => {
    if (tab !== 'qr') {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
      return;
    }

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      if (scannerRef.current) return;

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 220 },
        false
      );

      scanner.render(
        async (decodedText: string) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;
          setError('');

          try {
            const { data } = await api.post('/auth/qr', { qr_token: decodedText });
            setStatus(
              `${data.action === 'clock_in' ? '✔ Clocked in' : '✔ Clocked out'}: ${data.employee.first_name} — ${data.time}`
            );
            scanner.clear().catch(() => {});
          } catch {
            setError('Invalid QR code. Please try again.');
          } finally {
            setTimeout(() => { isProcessingRef.current = false; }, 2500);
          }
        },
        () => {}
      );

      scannerRef.current = scanner;
    });

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [tab]);

  // ── Handlers ──
  const handlePin = async () => {
    if (!pin || pin.length < 4) { setError('Enter your 4-digit PIN'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/pin', { pin });
      setStatus(`✔ ${data.employee.first_name} — ${data.time}`);
      if (data.token) login(data.token, data.employee);
    } catch { setError('Invalid PIN. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleManager = async () => {
    if (!email || !password) { setError('Enter your email and password'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/manager', { email, password });
      login(data.token, data.employee);
      router.replace('/admin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  const handleCrew = async () => {
    if (!email || !password) { setError('Enter your email and password'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/crew', { email, password });
      login(data.token, data.employee);
      router.replace('/crew/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Crew login failed.');
    } finally { setLoading(false); }
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setError('');
    setStatus('');
    setPin('');
    setEmail('');
    setPassword('');
    setShowPass(false);
  };

  const inputCls = `
    w-full px-4 py-3 rounded-xl text-sm
    bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)]
    text-white/80 placeholder-white/25
    focus:outline-none focus:border-amber-500/60 focus:bg-[#1e1e1e]
    transition-all duration-200 font-mono tracking-wide
  `;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0e0e0e]">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />
      <div className="absolute pointer-events-none"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 65%)', filter: 'blur(8px)' }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4 bg-[#161616] border border-white/10 rounded-[20px] shadow-2xl overflow-hidden">
        <div className="h-2px bg-linear-to-r from-transparent via-amber-500/70 to-transparent" />
        
        <div className="px-7 pt-8 pb-7">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-25 h-25 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_24px_rgba(245,166,35,0.12)]">
              {/* < Image src="/icon.png" alt="RustyCrew Logo" width={120} height={120} /> */}
             
            </div>
            <h1 className="text-lg font-bold tracking-[0.18em] uppercase mb-1 text-white/90">RustyCrew</h1>
            <p className="text-[11px] tracking-[0.14em] uppercase font-medium text-amber-500/60">Employee Management System</p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-4 gap-1 p-1 mb-6 rounded-xl bg-black/40 border border-white/5">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => handleTabChange(t.id)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-[10px] font-semibold tracking-wide uppercase transition-all
                  ${tab === t.id ? 'bg-amber-500/15 border border-amber-500/30 text-amber-500' : 'text-white/30 border border-transparent'}`}>
                <span className="text-base">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          {status && <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">✔ {status}</div>}
          {error && <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-xs bg-red-500/10 border border-red-500/20 text-red-400">⚠ {error}</div>}

          {/* Tab Content */}
          {tab === 'qr' && (
            <div className="flex flex-col items-center gap-4">
              <div id="qr-reader" className="w-full rounded-2xl overflow-hidden bg-black border border-white/5" />
              <p className="text-[11px] text-white/40">Position your QR code in frame</p>
            </div>
          )}

          {tab === 'pin' && (
            <div className="flex flex-col gap-5">
              <input type="password" maxLength={4} placeholder="• • • •" value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handlePin()}
                className={`${inputCls} text-center text-lg tracking-[0.5em]`} />
              <PrimaryButton onClick={handlePin} loading={loading}>Clock In</PrimaryButton>
            </div>
          )}

          {(tab === 'manager' || tab === 'crew') && (
            <div className="flex flex-col gap-4">
              <input type="email" placeholder={`${tab}@rustycrew.ph`} value={email}
                onChange={e => setEmail(e.target.value)} className={inputCls} />
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password}
                  onChange={e => setPassword(e.target.value)} className={inputCls} 
                  onKeyDown={e => e.key === 'Enter' && (tab === 'manager' ? handleManager() : handleCrew())} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <RoleBadge role={tab === 'manager' ? 'Manager' : 'Crew member'} color={tab === 'manager' ? '#f5a623' : '#60a5fa'} />
              <PrimaryButton onClick={tab === 'manager' ? handleManager : handleCrew} loading={loading}>
                Sign in as {tab}
              </PrimaryButton>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-7 pt-5 border-t border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase text-white/20">System online · Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──

function PrimaryButton({ children, onClick, loading }: { children: React.ReactNode; onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="w-full py-3 rounded-xl text-sm font-bold uppercase transition-all bg-amber-500 text-black shadow-[0_0_20px_rgba(245,166,35,0.2)] disabled:opacity-50">
      {loading ? 'Processing...' : children}
    </button>
  );
}

function RoleBadge({ role, color }: { role: string; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: `${color}10`, borderColor: `${color}20` }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-[10px] font-bold uppercase" style={{ color: color }}>{role} access</span>
    </div>
  );
}