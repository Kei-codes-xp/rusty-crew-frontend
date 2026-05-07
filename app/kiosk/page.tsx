'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import QRCode from 'react-qr-code';

export default function KioskPage() {
  const [qrToken, setQrToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  // 🔥 generate QR token
  const generateQR = async () => {
    try {
      setLoading(true);

      const { data } = await api.get('/auth/qr/generate');

      setQrToken(data.token);
      setTimeLeft(30);
    } catch (err) {
      console.error('QR generation failed', err);
    } finally {
      setLoading(false);
    }
  };

  // ⏱️ QR rotation (30 sec)
  useEffect(() => {
    generateQR();

    const interval = setInterval(() => {
      generateQR();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ⏳ countdown timer (UI only)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">☕ RustyCrew Kiosk</h1>
        <p className="text-gray-400 mt-2">
          Scan to clock in / out
        </p>
      </div>

      {/* QR Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl">
        {loading ? (
          <div className="w-64 h-64 flex items-center justify-center text-black">
            Loading QR...
          </div>
        ) : (
          <QRCode value={qrToken} size={256} />
        )}
      </div>

      {/* Timer */}
      <div className="mt-6 text-lg">
        {qrToken && (
          <p className="text-gray-300">
            Refreshing in:{" "}
            <span className="text-white font-bold">
              {timeLeft}s
            </span>
          </p>
        )}
      </div>

      {/* Footer status */}
      <div className="mt-10 text-sm text-gray-500">
        Status: {qrToken ? 'Active' : 'Generating...'}
      </div>
    </div>
  );
}