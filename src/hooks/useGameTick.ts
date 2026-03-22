'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

const TICK_INTERVAL = 1000;             // هر ۱ ثانیه
const MARKET_INTERVAL = 5 * 60 * 1000;  // هر ۵ دقیقه
const EVENT_CHECK_INTERVAL = 60 * 1000; // هر ۶۰ ثانیه
const STAT_DECAY_CHECK = 30 * 1000;     // چک کاهش stat هر ۳۰ ثانیه
const ORDER_CHECK_INTERVAL = 60 * 1000; // چک سفارشات هر ۶۰ ثانیه
const INSTALLMENT_CHECK_INTERVAL = 60 * 1000; // چک اقساط هر ۶۰ ثانیه
const DEPOSIT_CHECK_INTERVAL = 60 * 1000;     // چک سود سپرده هر ۶۰ ثانیه
const RIVAL_TICK_INTERVAL = 60 * 1000;        // تیک رقبا هر ۶۰ ثانیه

export function useGameTick() {
  const tickBusinesses = useGameStore((s) => s.tickBusinesses);
  const updateMarketPrices = useGameStore((s) => s.updateMarketPrices);
  const triggerRandomEvent = useGameStore((s) => s.triggerRandomEvent);
  const expireEvents = useGameStore((s) => s.expireEvents);
  const decayStats = useGameStore((s) => s.decayStats);
  const generateOrders = useGameStore((s) => s.generateOrders);
  const expireOrders = useGameStore((s) => s.expireOrders);
  const processInstallments = useGameStore((s) => s.processInstallments);
  const accrueDepositInterest = useGameStore((s) => s.accrueDepositInterest);
  const tickRivals = useGameStore((s) => s.tickRivals);
  const expireBoosts = useGameStore((s) => s.expireBoosts);
  const completeLifeAction = useGameStore((s) => s.completeLifeAction);
  const lastMarketUpdate = useRef(Date.now());
  const lastEventCheck = useRef(Date.now());
  const lastDecayCheck = useRef(Date.now());
  const lastOrderCheck = useRef(Date.now());
  const lastInstallmentCheck = useRef(Date.now());
  const lastDepositCheck = useRef(Date.now());
  const lastRivalTick = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      tickBusinesses();
      expireBoosts();
      completeLifeAction();

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

      // کاهش خودکار stat‌ها
      if (now - lastDecayCheck.current >= STAT_DECAY_CHECK) {
        decayStats();
        lastDecayCheck.current = now;
      }

      // تولید و انقضای سفارشات ویژه هر ۶۰ ثانیه
      if (now - lastOrderCheck.current >= ORDER_CHECK_INTERVAL) {
        generateOrders();
        expireOrders();
        lastOrderCheck.current = now;
      }

      // پردازش اقساط وام هر ۶۰ ثانیه
      if (now - lastInstallmentCheck.current >= INSTALLMENT_CHECK_INTERVAL) {
        processInstallments();
        lastInstallmentCheck.current = now;
      }

      // سود سپرده هر ۶۰ ثانیه
      if (now - lastDepositCheck.current >= DEPOSIT_CHECK_INTERVAL) {
        accrueDepositInterest();
        lastDepositCheck.current = now;
      }

      // تیک رقبای AI هر ۶۰ ثانیه
      if (now - lastRivalTick.current >= RIVAL_TICK_INTERVAL) {
        tickRivals();
        lastRivalTick.current = now;
      }
    }, TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [tickBusinesses, updateMarketPrices, triggerRandomEvent, expireEvents, decayStats, generateOrders, expireOrders, processInstallments, accrueDepositInterest, tickRivals, expireBoosts, completeLifeAction]);
}
