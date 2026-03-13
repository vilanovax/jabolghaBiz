'use client';

import { useState, useEffect, useCallback } from 'react';
import { Business, BusinessTemplate } from '@/types';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant, getNextUnlock } from '@/store/gameStore';
import { businessTemplates } from '@/data/mock';
import Link from 'next/link';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [collectAnim, setCollectAnim] = useState<number | null>(null);

  const effectiveRevenue = calcEffectiveRevenue(business);
  const totalExpenses = calcTotalExpenses(business);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(business);
  const hasPending = business.pendingRevenue > 0;
  const template = businessTemplates.find((t) => t.type === business.type);
  const nextUnlock = template ? getNextUnlock(business, template) : null;

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

  const handleCollect = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasPending) return;
    const amount = business.pendingRevenue;
    collectRevenue(business.id);
    setCollectAnim(amount);
    setTimeout(() => setCollectAnim(null), 1500);
  }, [business.id, business.pendingRevenue, hasPending, collectRevenue]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${sec}s`;
  };

  return (
    <div
      className={`relative rounded-[18px] bg-surface-card/60 border p-4 transition-all duration-300 overflow-hidden ${
        hasPending
          ? 'border-[#22C55E]/30 shadow-[0_0_18px_rgba(34,197,94,0.25)]'
          : 'border-line-subtle shadow-[var(--shadow-card)]'
      }`}
    >
      {/* floating collect animation */}
      {collectAnim !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-[#22C55E] font-black text-2xl font-fa animate-collect">
            +{collectAnim.toLocaleString('fa-IR')}
          </span>
        </div>
      )}

      <Link href={`/business/${business.id}`} className="block">
        {/* row 1: icon + name + level + auto badge */}
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{business.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-fg text-sm truncate">{business.name}</h3>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/15 px-1.5 py-0.5 rounded">
                LV {business.level}
              </span>
            </div>
          </div>
          {isAuto && (
            <span className="text-[9px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">🧮 خودکار</span>
          )}
        </div>

        {/* row 2: REVENUE big + cycle time */}
        <div className="flex items-baseline gap-3 mt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-[#22C55E] text-lg font-black font-fa">+{effectiveRevenue.toLocaleString('fa-IR')}</span>
            <span className="text-[9px] text-fg-muted">/سیکل</span>
          </div>
          <span className="text-[10px] text-fg-faint font-fa">⏱ {formatTime(business.cycleDuration)}</span>
        </div>

        {/* row 3: production progress bar */}
        <div className="mt-2.5">
          <div className="h-1.5 bg-surface-inset/50 rounded-[999px] overflow-hidden">
            <div
              className="h-full rounded-[999px] transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: hasPending
                  ? 'linear-gradient(90deg, #22C55E, #16A34A)'
                  : 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                boxShadow: hasPending ? '0 0 8px rgba(34,197,94,0.5)' : '0 0 6px rgba(99,102,241,0.3)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1 text-[9px]">
            <span className="text-fg-faint">
              {hasPending ? '✅ آماده جمع‌آوری' : `⏱ ${formatTime(timeLeft)} تا تولید`}
            </span>
          </div>
        </div>

        {/* row 4: stats — employees, expenses, profit */}
        <div className="flex items-center gap-3 mt-2 text-[10px]">
          <span className="flex items-center gap-1 text-fg-muted">
            👥 <span className="font-fa font-bold text-fg-secondary">{business.employees.length}/{business.maxEmployees}</span>
          </span>
          <span className="flex items-center gap-1 text-fg-muted">
            💸 <span className="font-fa font-bold text-[#EF4444]">{totalExpenses.toLocaleString('fa-IR')}</span>
          </span>
          <span className="flex items-center gap-1 text-fg-muted">
            📈 <span className={`font-fa font-bold ${netProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fa-IR')}
            </span>
          </span>
        </div>

        {/* Next Unlock teaser */}
        {nextUnlock && (
          <div className="mt-2.5 flex items-center gap-2 bg-[#FBBF24]/5 border border-[#FBBF24]/15 rounded-[12px] px-2.5 py-1.5">
            <span className="text-sm">{nextUnlock.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-[#FBBF24] font-bold truncate">{nextUnlock.name}</p>
            </div>
            <span className="text-[9px] text-[#FBBF24]/70 font-fa font-bold shrink-0">LV {nextUnlock.level}</span>
          </div>
        )}
      </Link>

      {/* Collect button — big, rewarding */}
      {hasPending && (
        <button
          onClick={handleCollect}
          className="w-full mt-3 py-3 rounded-[999px] font-black text-sm text-white active:scale-[0.96] transition-all flex flex-col items-center justify-center gap-0.5"
          style={{
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            boxShadow: '0 4px 20px rgba(34,197,94,0.45)',
          }}
        >
          <span>💰 جمع‌آوری</span>
          <span className="font-fa text-base">+{business.pendingRevenue.toLocaleString('fa-IR')}</span>
        </button>
      )}
    </div>
  );
}
