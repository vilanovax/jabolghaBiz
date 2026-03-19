'use client';

import { useState, useEffect } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses } from '@/store/gameStore';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function RushHourBanner() {
  const isRushHourActive = useGameStore((s) => s.isRushHourActive);
  const getRushHourTimeLeft = useGameStore((s) => s.getRushHourTimeLeft);
  const getNextRushHour = useGameStore((s) => s.getNextRushHour);
  const businesses = useGameStore((s) => s.businesses);

  const [active, setActive] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('');

  useEffect(() => {
    const update = () => {
      const isActive = isRushHourActive();
      setActive(isActive);

      if (isActive) {
        const left = getRushHourTimeLeft();
        const mins = Math.floor(left / 60000);
        const secs = Math.floor((left % 60000) / 1000);
        setTimeDisplay(`${mins}:${secs.toString().padStart(2, '0')}`);
      } else {
        const next = getNextRushHour();
        const hrs = Math.floor(next / 3600000);
        const mins = Math.floor((next % 3600000) / 60000);
        setTimeDisplay(`${hrs}:${mins.toString().padStart(2, '0')}`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isRushHourActive, getRushHourTimeLeft, getNextRushHour]);

  // Find best business (highest net profit) for CTA link
  const bestBiz = businesses.length > 0
    ? businesses.reduce((best, biz) => {
        const bestNet = calcEffectiveRevenue(best) - calcTotalExpenses(best);
        const bizNet = calcEffectiveRevenue(biz) - calcTotalExpenses(biz);
        return bizNet > bestNet ? biz : best;
      })
    : null;

  if (active) {
    return (
      <Link href={bestBiz ? `/business/${bestBiz.id}` : '/business'} className="block">
        <div
          className="rounded-[16px] px-4 py-3 flex items-center justify-between animate-event-pulse-red active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(249,115,22,0.18))',
            border: '1px solid rgba(239,68,68,0.35)',
            boxShadow: '0 0 24px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-pulse">🔥</span>
            <div>
              <p className="text-xs font-black text-[#EF4444]">ساعت طلایی فعال!</p>
              <p className="text-[10px] text-fg-muted font-bold">درآمد ×۲</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center">
              <p className="text-lg font-black text-[#EF4444] font-fa">{timeDisplay}</p>
            </div>
            <span className="text-[9px] font-black text-white bg-[#EF4444]/80 px-2 py-1 rounded-full flex items-center gap-0.5">
              برو کسب‌وکار
              <ChevronLeft size={10} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div
      className="rounded-[14px] px-3.5 py-2.5 flex items-center justify-between bg-surface-card/40 border border-line-subtle"
      style={{ boxShadow: '0 0 12px rgba(249,115,22,0.05)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">🔥</span>
        <div>
          <p className="text-[10px] font-bold text-fg-secondary">ساعت طلایی بعدی</p>
          <p className="text-[8px] text-fg-faint">درآمد ×۲</p>
        </div>
      </div>
      <div className="text-left">
        <p className="text-sm font-black text-fg-secondary font-fa">{timeDisplay}</p>
        <p className="text-[8px] text-fg-faint">شروع</p>
      </div>
    </div>
  );
}
