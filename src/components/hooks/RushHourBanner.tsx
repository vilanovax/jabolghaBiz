'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function RushHourBanner() {
  const isRushHourActive = useGameStore((s) => s.isRushHourActive);
  const getRushHourTimeLeft = useGameStore((s) => s.getRushHourTimeLeft);
  const getNextRushHour = useGameStore((s) => s.getNextRushHour);

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

  if (active) {
    return (
      <div
        className="rounded-[14px] px-3 py-2.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))',
          border: '1px solid rgba(239,68,68,0.3)',
          boxShadow: '0 0 16px rgba(239,68,68,0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg animate-pulse">🔥</span>
          <div>
            <p className="text-[11px] font-black text-[#EF4444]">ساعت طلایی فعال!</p>
            <p className="text-[9px] text-fg-muted">درآمد ×۲</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-[#EF4444] font-fa">{timeDisplay}</p>
          <p className="text-[8px] text-fg-muted">باقیمانده</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] px-3 py-2 flex items-center justify-between bg-surface-card/40 border border-line-subtle">
      <div className="flex items-center gap-2">
        <span className="text-sm">🔥</span>
        <p className="text-[10px] text-fg-muted">ساعت طلایی بعدی</p>
      </div>
      <p className="text-[11px] font-bold text-fg-secondary font-fa">{timeDisplay}</p>
    </div>
  );
}
