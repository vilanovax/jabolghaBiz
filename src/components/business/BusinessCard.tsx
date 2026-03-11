'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Business } from '@/types';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant } from '@/store/gameStore';
import Link from 'next/link';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const effectiveRevenue = calcEffectiveRevenue(business);
  const totalExpenses = calcTotalExpenses(business);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(business);
  const hasPending = business.pendingRevenue > 0;

  // ارزش شرکت = درآمد پایه × سطح × ۱۰
  const companyValue = business.baseRevenue * business.level * 10;

  useEffect(() => {
    const update = () => {
      const elapsed = (Date.now() - business.lastCycleAt) / 1000;
      const remaining = Math.max(0, business.cycleDuration - (elapsed % business.cycleDuration));
      setTimeLeft(Math.ceil(remaining));
      setProgress(((business.cycleDuration - remaining) / business.cycleDuration) * 100);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [business.lastCycleAt, business.cycleDuration]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`;
  };

  return (
    <Card
      className={`overflow-hidden ${hasPending ? 'animate-pulse-glow' : ''}`}
      glow={hasPending ? '#10b981' : undefined}
    >
      {/* progress bar + زمان باقیمانده */}
      <div className="relative h-1.5 bg-zinc-800 -mx-4 -mt-4 mb-3 group">
        <div
          className="h-full transition-all duration-1000 rounded-l-full"
          style={{
            width: `${progress}%`,
            backgroundColor: hasPending ? '#10b981' : '#6366f1',
          }}
        />
        {/* زمان باقیمانده روی progress bar */}
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[9px] text-zinc-500 font-fa">
          {hasPending ? '✅ آماده جمع‌آوری' : `⏱ ${formatTime(timeLeft)} تا تولید بعدی`}
        </span>
      </div>

      <Link href={`/business/${business.id}`} className="block mt-3">
        {/* ردیف ۱: آیکون + نام + سطح */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{business.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm truncate">{business.name}</h3>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/15 px-1.5 py-0.5 rounded">
                LV {business.level}
              </span>
            </div>
          </div>
          {isAuto && (
            <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">🧮 خودکار</span>
          )}
        </div>

        {/* ردیف ۲: درآمد / هزینه / سود */}
        <div className="flex items-center gap-3 mt-2 text-[10px]">
          <span className="text-zinc-500">
            درآمد <span className="text-emerald-400 font-fa font-bold">{effectiveRevenue.toLocaleString('fa-IR')}</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">
            هزینه <span className="text-red-400 font-fa font-bold">{totalExpenses.toLocaleString('fa-IR')}</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">
            سود{' '}
            <span className={`font-fa font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fa-IR')}
            </span>
          </span>
        </div>

        {/* ردیف ۳: کارکنان + ارزش شرکت */}
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-zinc-500">
          <span>👥 کارکنان {business.employees.length} از {business.maxEmployees}</span>
          <span>💎 ارزش: <span className="text-amber-400 font-fa font-bold">{companyValue.toLocaleString('fa-IR')}</span></span>
        </div>
      </Link>

      {/* دکمه جمع‌آوری — فشرده */}
      {hasPending && (
        <button
          onClick={() => collectRevenue(business.id)}
          className="w-full mt-2.5 bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 rounded-lg font-bold text-[11px] active:scale-[0.98] transition-all flex items-center justify-center gap-1"
        >
          💰 جمع‌آوری <span className="font-fa">{business.pendingRevenue.toLocaleString('fa-IR')}</span>
        </button>
      )}
    </Card>
  );
}
