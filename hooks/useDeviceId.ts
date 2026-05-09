'use client';
 
import { useState, useEffect } from 'react';
 
const KEY = 'brewcrew_device_id';
 
/**
 * Returns a stable device identifier stored in localStorage.
 * Used for QR attendance device binding validation.
 */
export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState('');
 
  useEffect(() => {
    let id = localStorage.getItem(KEY);
    if (!id) {
      // Generate a simple fingerprint: timestamp + random
      id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(KEY, id);
    }
    setDeviceId(id);
  }, []);
 
  return deviceId;
}
 