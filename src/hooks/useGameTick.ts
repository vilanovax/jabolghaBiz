'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const TICK_INTERVAL = 1000;             // هر ۱ ثانیه
const MARKET_INTERVAL = 5 * 60 * 1000;  // هر ۵ دقیقه

export function useGameTick() {
  const tickBusinesses = useGameStore((s) => s.tickBusinesses);
  const updateMarketPrices = useGameStore((s) => s.updateMarketPrices);
  const lastMarketUpdate = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      tickBusinesses();

      // بروزرسانی قیمت‌های بازار هر ۵ دقیقه
      const now = Date.now();
      if (now - lastMarketUpdate.current >= MARKET_INTERVAL) {
        updateMarketPrices();
        lastMarketUpdate.current = now;
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tickBusinesses, updateMarketPrices]);
}
