'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const TICK_INTERVAL = 1000;             // هر ۱ ثانیه
const MARKET_INTERVAL = 5 * 60 * 1000;  // هر ۵ دقیقه
const EVENT_CHECK_INTERVAL = 60 * 1000; // هر ۶۰ ثانیه

export function useGameTick() {
  const tickBusinesses = useGameStore((s) => s.tickBusinesses);
  const updateMarketPrices = useGameStore((s) => s.updateMarketPrices);
  const triggerRandomEvent = useGameStore((s) => s.triggerRandomEvent);
  const expireEvents = useGameStore((s) => s.expireEvents);
  const lastMarketUpdate = useRef(Date.now());
  const lastEventCheck = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      tickBusinesses();

      const now = Date.now();

      // بروزرسانی قیمت‌های بازار هر ۵ دقیقه
      if (now - lastMarketUpdate.current >= MARKET_INTERVAL) {
        updateMarketPrices();
        lastMarketUpdate.current = now;
      }

      // چک رویدادهای تصادفی هر ۶۰ ثانیه
      if (now - lastEventCheck.current >= EVENT_CHECK_INTERVAL) {
        expireEvents();
        triggerRandomEvent();
        lastEventCheck.current = now;
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tickBusinesses, updateMarketPrices, triggerRandomEvent, expireEvents]);
}
