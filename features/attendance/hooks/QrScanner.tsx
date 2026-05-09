'use client';

import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onScan: (token: string) => void;
  onError?: (msg: string) => void;
  active: boolean;
}

export default function QRScanner({ onScan, onError, active }: QRScannerProps) {
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (scannerRef.current || initializingRef.current) return;

    initializingRef.current = true;

    let scanner: any;

    const startScanner = async () => {
      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");

        scanner = new Html5QrcodeScanner(
          "qr-scanner-container",
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            rememberLastUsedCamera: false,
          },
          false
        );

        scanner.render(
          async (decoded: string) => {
            try {
              await scanner.clear();
              scannerRef.current = null;
              initializingRef.current = false;
              onScan(decoded);
            } catch (err) {
              console.error(err);
            }
          },
          (err: string) => {
            if (!err.includes("No MultiFormat")) {
              setError(err);
              onError?.(err);
            }
          }
        );

        scannerRef.current = scanner;
        setError(null);
      } catch {
        setError("Camera initialization failed");
      } finally {
        initializingRef.current = false;
      }
    };

    startScanner();

    return () => {
      initializingRef.current = false;

      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => { });
        scannerRef.current = null;
      }
    };
  }, [active]);

  return (
    <div style={{ width: '100%' }}>
      <div
        id="qr-scanner-container"
        style={{
          width: "100%",
          maxWidth: "min(90vw, 520px)", 
          aspectRatio: "1 / 1",
          borderRadius: 16,
          overflow: "hidden",
          background: "#000",
        }}
      />

      {error && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: '#f87171',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}