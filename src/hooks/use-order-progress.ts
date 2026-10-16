'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useOrderStore, type Order } from '@/store/order';
import {
  deriveProgress,
  DEMO_SPEED_MS,
  REALISTIC_SPEED_MS,
  type OrderProgress,
} from '@/lib/trackingSimulation';

const DEMO_MODE_KEY = 'hearth-ember-demo-mode';

function getDemoMode(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

export function setDemoMode(enabled: boolean) {
  try {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

export function useDemoMode(): [boolean, (val: boolean) => void] {
  const [demo, setDemo] = useState(true);

  useEffect(() => {
    setDemo(getDemoMode());
  }, []);

  const update = useCallback((val: boolean) => {
    setDemo(val);
    setDemoMode(val);
  }, []);

  return [demo, update];
}

export function useOrderProgress(orderId: string | null): {
  progress: OrderProgress | null;
  order: Order | null;
} {
  const [now, setNow] = useState<number | null>(null);
  const [demo, setDemo] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const order = useOrderStore((s) => (orderId ? s.getOrderById(orderId) : null));

  useEffect(() => {
    setNow(Date.now());
    setDemo(getDemoMode());
  }, []);

  useEffect(() => {
    if (!order) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order]);

  useEffect(() => {
    const handler = () => setDemo(getDemoMode());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const progress = order && now !== null
    ? deriveProgress(
        order.placedAt,
        order.estimatedDelivery,
        now,
        demo ? DEMO_SPEED_MS : REALISTIC_SPEED_MS,
        order.cancelledAt
      )
    : null;

  // Stop ticking once delivered
  useEffect(() => {
    if (progress?.status === 'delivered' && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [progress?.status]);

  return { progress, order };
}
