'use client';

import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export function TwaProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      try {
        WebApp.ready();
        WebApp.expand(); // Telegram WeApp ni to'liq ekran qilish
      } catch (e) {
        console.log("Telegram muhitida emas:", e);
      }
    }
  }, []);

  if (!isMounted) return null;

  return <>{children}</>;
}
