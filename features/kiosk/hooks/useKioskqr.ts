'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { KioskQRPayload, QRStatus, ScanResult } from '@/types/kiosk';

const QR_TTL_SECONDS = 30;
const SCAN_POLL_MS   = 4_000;   // poll for new scans every 4 s
const API_BASE       = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// ── Device ID (stable per kiosk) ─────────────────────────────────────────────
function getDeviceId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'rustycrew_kiosk_device';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `kiosk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function useKioskQR() {
  const [payload,    setPayload]    = useState<KioskQRPayload | null>(null);
  const [qrStatus,   setQrStatus]   = useState<QRStatus>('loading');
  const [countdown,  setCountdown]  = useState(QR_TTL_SECONDS);
  const [scans,      setScans]      = useState<ScanResult[]>([]);
  const [error,      setError]      = useState<string | null>(null);

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanPollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestToken  = useRef<string | null>(null);

  // ── Fetch QR from backend ─────────────────────────────────────────────────
  const fetchQR = useCallback(async (isRefresh = false) => {
    setQrStatus(isRefresh ? 'refreshing' : 'loading');
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/kiosk/qr`, {
        method:  'GET',
        headers: {
          'Content-Type':   'application/json',
          'X-Kiosk-Device': getDeviceId(),
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: KioskQRPayload = await res.json();
      setPayload(data);
      latestToken.current = data.token;
      setQrStatus('ready');
      setCountdown(QR_TTL_SECONDS);
    } catch (e: any) {
      setError('Unable to generate secure attendance QR');
      setQrStatus('error');
    }
  }, []);

  // ── Poll for new scans while QR is displayed ──────────────────────────────
  const pollScans = useCallback(async () => {
    if (!latestToken.current) return;
    try {
      const res = await fetch(
        `${API_BASE}/kiosk/scans?token=${latestToken.current}`,
        {
          headers: { 'X-Kiosk-Device': getDeviceId() },
          credentials: 'include',
        }
      );
      if (!res.ok) return;
      const data: ScanResult[] = await res.json();
      if (data.length > 0) {
        setScans((prev) => {
          const ids  = new Set(prev.map((s) => s.id));
          const next = data.filter((s) => !ids.has(s.id));
          return [...next, ...prev].slice(0, 8); // keep latest 8
        });
      }
    } catch {
      // silently skip
    }
  }, []);

  // ── Auto-rotation every 30 s ──────────────────────────────────────────────
  useEffect(() => {
    fetchQR(false);

    // Countdown ticker
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          fetchQR(true);
          return QR_TTL_SECONDS;
        }
        return c - 1;
      });
    }, 1_000);

    // Scan polling
    scanPollRef.current = setInterval(pollScans, SCAN_POLL_MS);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (scanPollRef.current)  clearInterval(scanPollRef.current);
    };
  }, [fetchQR, pollScans]);

  // ── Manual refresh ─────────────────────────────────────────────────────────
  function manualRefresh() {
    setCountdown(QR_TTL_SECONDS);
    fetchQR(true);
  }

  // ── Build QR content string (what gets encoded into the QR image) ──────────
  // Format: JSON string so backend can parse token + signature in one scan
  const qrContent = payload
    ? JSON.stringify({
        token:     payload.token,
        sig:       payload.signature,
        exp:       payload.expires_at,
        kiosk:     payload.kiosk_id,
      })
    : null;

  return {
    payload,
    qrContent,
    qrStatus,
    countdown,
    scans,
    error,
    manualRefresh,
    deviceId: getDeviceId(),
  };
}