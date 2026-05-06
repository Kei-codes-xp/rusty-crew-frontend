// src/app/login/page.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '@/lib/api';

type Tab = 'qr' | 'pin' | 'manager';

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('qr');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const scannerRef = useRef<any>(null);
  const { login } = useAuth();
  const router = useRouter();
  const isProcessingRef = useRef(false);

  // Start QR scanner
  useEffect(() => {
    if (tab !== 'qr') { scannerRef.current?.clear(); return; }

    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
      scanner.render(
        async (decodedText) => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;

          try {
            const { data } = await api.post('/auth/qr', {
              qr_token: decodedText,
            });

            setStatus(
              `${data.action === 'clock_in' ? 'Clocked in' : 'Clocked out'}: ${data.employee.first_name} — ${data.time}`
            );

            scanner.clear();
          } catch (err) {
            setError('Invalid QR');
          } finally {
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 2000);
          }
        },
        (errorMessage) => {

        }
      );
      scannerRef.current = scanner;
    });

    return () => {
      scannerRef.current?.clear();
    };
  }, [tab]);

  const handlePin = async () => {
    try {
      const { data } = await api.post('/auth/pin', { pin });
      setStatus(`${data.employee.first_name} — ${data.time}`);
      if (data.token) login(data.token, data.employee);
    } catch { setError('Invalid PIN'); }
  };

  const handleManager = async () => {
    setError('');
    console.log("CLICKED LOGIN");

    try {
      const { data } = await api.post('/auth/manager', {
        email,
        password,
      });

      login(data.token, data.employee);
      router.replace('/dashboard');

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-80 shadow-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">☕</div>
          <h1 className="text-lg font-medium">RustyCrew</h1>
          <p className="text-sm text-gray-500">Clock in or access your schedule</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-5">
          {(['qr', 'pin', 'manager'] as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setStatus(''); }}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all
                ${tab === t ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'}`}>
              {t === 'qr' ? 'QR Code' : t === 'pin' ? 'PIN' : 'Manager'}
            </button>
          ))}
        </div>

        {status && <div className="text-sm text-green-700 bg-green-50 rounded-lg p-3 mb-4">{status}</div>}
        {error && <div className="text-sm text-red-600  bg-red-50  rounded-lg p-3 mb-4">{error}</div>}

        {tab === 'qr' && (
          <div>
            <div id="qr-reader" className="rounded-lg overflow-hidden mb-3" />
            <p className="text-xs text-gray-400 text-center">Position your QR code in front of the camera</p>
          </div>
        )}

        {tab === 'pin' && (
          <div className="space-y-3">
            <input type="password" maxLength={4} placeholder="4-digit PIN" value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            <button onClick={handlePin}
              className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700">
              Clock in
            </button>
          </div>
        )}

        {tab === 'manager' && (
          <div className="space-y-3">
            <input type="email" placeholder="manager@rustycrew.ph" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            <input type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
            <button onClick={handleManager}
              className="w-full bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700">
              Sign in as manager
            </button>
          </div>
        )}
      </div>
    </div>
  );
}