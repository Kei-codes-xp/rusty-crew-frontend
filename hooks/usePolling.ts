'use client';
 
import { useEffect, useRef } from 'react';
 
/**
 * Calls `fn` immediately and then every `intervalMs` milliseconds.
 * Stops when component unmounts or `enabled` is false.
 */
export function usePolling(fn: () => void, intervalMs: number, enabled = true) {
  const savedFn = useRef(fn);
 
  useEffect(() => { savedFn.current = fn; }, [fn]);
 
  useEffect(() => {
    if (!enabled) return;
    savedFn.current();
    const id = setInterval(() => savedFn.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}