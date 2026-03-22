'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function ActiveBoostBanner() {
  const activeBoosts = useGameStore((s) => s.boosts.activeBoosts);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const active = activeBoosts.find((b) => b.expiresAt > now);
  if (!active) return null;

  const remaining = Math.max(0, Math.ceil((active.expiresAt - now) / 1000));
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div
      className="rounded-[16px] border border-[#F59E0B]/30 p-3 flex items-center gap-3 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))',
        boxShadow: '0 0 20px rgba(245,158,11,0.08)',
      }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #F59E0B 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }} />
      <span className="text-2xl shrink-0 relative animate-pulse">{active.icon}</span>
      <div className="flex-1 min-w-0 relative">
        <div className="flex items-center gap-2">
          <p className="text-[11px] font-black text-[#F59E0B]">{active.name}</p>
          <span className="text-[9px] font-bold text-white bg-[#F59E0B] px-1.5 py-0.5 rounded-full">×{active.multiplier}</span>
        </div>
        <p className="text-[10px] text-fg-muted mt-0.5">تولید و فروش تقویت‌شده</p>
      </div>
      <div className="text-center shrink-0 relative">
        <p className="text-[16px] font-black font-fa text-[#F59E0B]">
          {mins}:{secs.toString().padStart(2, '0')}
        </p>
        <p className="text-[8px] text-fg-faint">باقی‌مانده</p>
      </div>
    </div>
  );
}
