'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Business, BusinessType } from '@/types';
import { useGameStore, calcTotalExpenses } from '@/store/gameStore';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

type BizCardState = 'upgradeReady' | 'upgradeInProgress' | 'losing' | 'inventoryWarning' | 'rushHour' | 'normal';

interface BusinessCardProps {
  business: Business;
  index?: number;
}

const STATE_CONFIG: Record<BizCardState, {
  border: string;
  shadow?: string;
  bg?: string;
  barColor: string;
  chip?: { label: string; color: string };
}> = {
  upgradeReady: {
    border: 'border-[#22C55E]/50',
    shadow: '0 0 20px rgba(34,197,94,0.18)',
    barColor: 'linear-gradient(90deg, #22C55E, #4ADE80, #22C55E)',
    chip: { label: '✨ ارتقا آماده', color: 'text-[#22C55E]' },
  },
  upgradeInProgress: {
    border: 'border-[#8B5CF6]/30',
    barColor: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #8B5CF6)',
    chip: { label: '⚙️ در حال ارتقا', color: 'text-[#8B5CF6]' },
  },
  losing: {
    border: 'border-[#EF4444]/35',
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(220,38,38,0.03))',
    barColor: 'linear-gradient(90deg, #EF4444, #F87171, #EF4444)',
    chip: { label: '📉 ضررده', color: 'text-[#EF4444]' },
  },
  inventoryWarning: {
    border: 'border-[#F59E0B]/35',
    barColor: 'linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)',
    chip: { label: '⚠️ انبار پر', color: 'text-[#F59E0B]' },
  },
  rushHour: {
    border: 'border-[#EF4444]/30',
    shadow: '0 0 16px rgba(239,68,68,0.12)',
    bg: 'linear-gradient(135deg, rgba(239,68,68,0.04), rgba(249,115,22,0.03))',
    barColor: 'linear-gradient(90deg, #EF4444, #F97316, #EF4444)',
    chip: { label: '🔥 ساعت طلایی', color: 'text-[#EF4444]' },
  },
  normal: {
    border: 'border-line-subtle',
    barColor: 'linear-gradient(90deg, #6366F1, #8B5CF6, #6366F1)',
  },
};

const BIZ_TYPE_COLORS: Record<BusinessType, { iconBg: string; barColor: string; border: string }> = {
  farming:     { iconBg: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(34,197,94,0.08))',     barColor: 'linear-gradient(90deg, #16A34A, #4ADE80, #16A34A)', border: 'border-[#16A34A]/25' },
  factory:     { iconBg: 'linear-gradient(135deg, rgba(2,132,199,0.15), rgba(14,165,233,0.08))',    barColor: 'linear-gradient(90deg, #0284C7, #38BDF8, #0284C7)', border: 'border-[#0284C7]/25' },
  supermarket: { iconBg: 'linear-gradient(135deg, rgba(234,88,12,0.15), rgba(249,115,22,0.08))',    barColor: 'linear-gradient(90deg, #EA580C, #FB923C, #EA580C)', border: 'border-[#EA580C]/25' },
  restaurant:  { iconBg: 'linear-gradient(135deg, rgba(190,24,93,0.15), rgba(236,72,153,0.08))',    barColor: 'linear-gradient(90deg, #BE185D, #F472B6, #BE185D)', border: 'border-[#BE185D]/25' },
  app_startup: { iconBg: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))',  barColor: 'linear-gradient(90deg, #7C3AED, #A78BFA, #7C3AED)', border: 'border-[#7C3AED]/25' },
  transport:   { iconBg: 'linear-gradient(135deg, rgba(3,105,161,0.15), rgba(56,189,248,0.08))',    barColor: 'linear-gradient(90deg, #0369A1, #7DD3FC, #0369A1)', border: 'border-[#0369A1]/25' },
};

export default function BusinessCard({ business, index = 0 }: BusinessCardProps) {
  const router = useRouter();
  const isRushHourActive = useGameStore((s) => s.isRushHourActive);
  const completeBusinessUpgrade = useGameStore((s) => s.completeBusinessUpgrade);

  const products = useGameStore((s) => s.products);
  const totalExpenses = calcTotalExpenses(business);
  // درآمد واقعی: واحد فروش/دقیقه × مدت سیکل (دقیقه) × قیمت بازار
  const marketProduct = products.find((p) => p.id === business.inventory.productId);
  const unitPrice = marketProduct?.currentPrice ?? 1000;
  const revenuePerCycle = Math.round(business.baseSaleRate * (business.cycleDuration / 60) * unitPrice);
  const netProfit = revenuePerCycle - totalExpenses;
  const invPct = business.inventory.maxCapacity > 0
    ? business.inventory.quantity / business.inventory.maxCapacity
    : 0;

  const rushActive = isRushHourActive();
  const isUpgrading = business.upgradeStartedAt !== null;
  const upgradeReady = isUpgrading && business.upgradeEndsAt !== null && Date.now() >= business.upgradeEndsAt;
  const isLosing = netProfit < 0;
  const inventoryWarning = invPct >= 0.9;

  const cardState: BizCardState = upgradeReady ? 'upgradeReady'
    : isUpgrading ? 'upgradeInProgress'
    : isLosing ? 'losing'
    : inventoryWarning ? 'inventoryWarning'
    : rushActive ? 'rushHour'
    : 'normal';

  const typeColor = BIZ_TYPE_COLORS[business.type];
  const cfg = cardState === 'normal'
    ? { ...STATE_CONFIG.normal, border: typeColor.border, barColor: typeColor.barColor }
    : STATE_CONFIG[cardState];

  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

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
    <Link
      href={`/business/${business.id}`}
      className="block active:scale-[0.98] transition-transform animate-card-enter"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div
        className={`rounded-[20px] bg-surface-card/60 border p-4 overflow-hidden ${cfg.border}`}
        style={{ boxShadow: cfg.shadow, background: cfg.bg }}
      >
        {/* Row 1: Icon + Name/State + Profit */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl shrink-0"
            style={{ background: typeColor.iconBg }}
          >
            {business.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-fg text-[13px] truncate">{business.name}</h3>
              <span className="text-[9px] font-black text-white bg-gradient-to-l from-[#6366F1] to-[#8B5CF6] px-1.5 py-0.5 rounded-full shrink-0">
                LV {business.level}
              </span>
            </div>
            {cfg.chip && (
              <span className={`text-[9px] font-bold ${cfg.chip.color}`}>{cfg.chip.label}</span>
            )}
          </div>

          <div className="text-right shrink-0">
            <p className={`text-[20px] font-black font-fa leading-none ${netProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fa-IR')}
            </p>
            <p className="text-[9px] text-fg-faint">/سیکل</p>
          </div>
        </div>

        {/* Row 2: Progress bar + timer */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[9px] text-fg-faint mb-1.5">
            <span className={rushActive ? 'text-[#EF4444] font-bold' : ''}>
              {rushActive ? '🔥' : '⏱'} {formatTime(timeLeft)}
            </span>
            {inventoryWarning && (
              <span className="text-[#F59E0B] font-bold flex items-center gap-0.5">
                <AlertTriangle size={9} /> انبار پر
              </span>
            )}
          </div>
          <div className="h-2.5 bg-progress-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 animate-bar-shimmer"
              style={{
                width: `${progress}%`,
                background: cfg.barColor,
                boxShadow: rushActive ? '0 0 8px rgba(239,68,68,0.5)' : undefined,
              }}
            />
          </div>
        </div>

        {/* Row 3: CTA — only when action needed */}
        {cardState === 'upgradeReady' && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); completeBusinessUpgrade(business.id); }}
            className="w-full mt-3 py-3 rounded-[14px] text-[12px] font-black text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all animate-event-pulse-green"
            style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}
          >
            <CheckCircle size={15} />
            تکمیل ارتقا → LV {business.level + 1}
          </button>
        )}

        {cardState === 'losing' && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/business/${business.id}`); }}
            className="w-full mt-3 py-3 rounded-[14px] text-[12px] font-black text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
          >
            <Wrench size={15} />
            بررسی و حل مشکل
          </button>
        )}

        {cardState === 'inventoryWarning' && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/business/${business.id}`); }}
            className="w-full mt-3 py-3 rounded-[14px] text-[12px] font-black flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}
          >
            <AlertTriangle size={15} />
            مدیریت انبار
          </button>
        )}
      </div>
    </Link>
  );
}
