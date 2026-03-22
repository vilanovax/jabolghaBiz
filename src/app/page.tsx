'use client';

import { useMemo, useEffect, useState } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue, xpForLevel, getUnlocksForLevel } from '@/store/gameStore';
import {
  Briefcase, Users, ShoppingCart, Wallet,
  TrendingUp, ArrowUpRight, ArrowDownRight, ChevronLeft, Lock,
} from 'lucide-react';
import Link from 'next/link';
import RushHourBanner from '@/components/hooks/RushHourBanner';
import EventBanner from '@/components/hooks/EventBanner';
import ActiveBoostBanner from '@/components/boosts/ActiveBoostBanner';
import { useActiveMissionContext } from '@/components/missions/MissionsWidget';
import { useGameStore as useStore } from '@/store/gameStore';

export default function HomePage() {
  const player = useGameStore((s) => s.player);
  const activeEvents = useGameStore((s) => s.randomEvents.activeEvents).filter(
    (e) => e.effect !== 'instant_balance'
  );
  const businesses = useGameStore((s) => s.businesses);
  const products = useGameStore((s) => s.products);
  const missions = useGameStore((s) => s.missions);
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);
  const completeBusinessUpgrade = useGameStore((s) => s.completeBusinessUpgrade);

  // درآمد تخمینی هر سیکل = min(تولید, فروش) × قیمت بازار
  const totalRevenueMoney = businesses.reduce((sum, b) => {
    const prod = products.find((p) => p.id === b.inventory.productId);
    const price = prod?.currentPrice ?? 0;
    const unitsPerCycle = Math.min(
      calcEffectiveRevenue(b),
      b.baseSaleRate * (b.cycleDuration / 60)
    );
    return sum + Math.round(unitsPerCycle * price);
  }, 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenueMoney - totalExpenses;
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);
  const empireValue = calcEmpireValue(player, businesses);
  const totalInventory = businesses.reduce((sum, b) => sum + b.inventory.quantity, 0);

  const topProducts = useMemo(() => [...products]
    .sort((a, b) => Math.abs((b.currentPrice - b.basePrice) / b.basePrice) - Math.abs((a.currentPrice - a.basePrice) / a.basePrice))
    .slice(0, 4),
  [products]);

  // ---- Action Center logic ----
  const claimableMissions = missions.activeMissions.filter((m) => m.completed && !m.claimed);
  const topClaimable = claimableMissions[0] ?? null;

  const losingBusinesses = businesses.filter((b) => calcEffectiveRevenue(b) - calcTotalExpenses(b) < 0);

  const upgradeReadyBiz = businesses.find(
    (b) => b.upgradeStartedAt !== null && b.upgradeEndsAt !== null && Date.now() >= b.upgradeEndsAt
  );

  const actions = useMemo(() => {
    const list: { icon: string; label: string; sub?: string; href: string; color: string; bg: string; onTap?: () => void }[] = [];

    if (claimableMissions.length > 0) {
      const totalReward = claimableMissions.reduce((s, m) => s + m.reward, 0);
      list.push({
        icon: '🏆',
        label: claimableMissions.length === 1 ? 'جایزه ماموریت آماده' : `${claimableMissions.length} جایزه آماده`,
        sub: totalReward > 0 ? `+${totalReward.toLocaleString('fa-IR')} تومان` : undefined,
        href: '/missions',
        color: '#22C55E',
        bg: 'rgba(34,197,94,0.1)',
      });
    }

    if (upgradeReadyBiz) {
      list.push({
        icon: '✨',
        label: 'ارتقا آماده تکمیله',
        sub: upgradeReadyBiz.name,
        href: `/business/${upgradeReadyBiz.id}`,
        color: '#22C55E',
        bg: 'rgba(34,197,94,0.08)',
        onTap: () => completeBusinessUpgrade(upgradeReadyBiz.id),
      });
    }

    if (player.stats.energy < 20 && list.length < 2) {
      list.push({
        icon: '😴',
        label: 'انرژی کمه — استراحت کن',
        sub: 'تولید -25%',
        href: '/life',
        color: '#F59E0B',
        bg: 'rgba(245,158,11,0.08)',
      });
    }

    if (player.stats.hunger > 80 && list.length < 2) {
      list.push({
        icon: '🍔',
        label: 'خیلی گرسنه‌ای — غذا بخور',
        sub: 'درآمد -10%',
        href: '/life',
        color: '#F97316',
        bg: 'rgba(249,115,22,0.08)',
      });
    }

    if (losingBusinesses.length > 0 && list.length < 2) {
      list.push({
        icon: '📉',
        label: losingBusinesses.length === 1 ? `${losingBusinesses[0].name} ضررده` : `${losingBusinesses.length} شرکت ضررده`,
        sub: 'بررسی و رفع مشکل',
        href: `/business/${losingBusinesses[0].id}`,
        color: '#EF4444',
        bg: 'rgba(239,68,68,0.07)',
      });
    }

    return list.slice(0, 2);
  }, [claimableMissions, upgradeReadyBiz, player.stats, losingBusinesses, completeBusinessUpgrade]);

  return (
    <div className="space-y-4 py-3 pb-24">

      {/* ===================== Balance Hero — Credit Card ===================== */}
      <div className="relative w-full" style={{ perspective: '1200px' }}>
        <div
          className="relative w-full rounded-[22px] overflow-hidden"
          style={{
            aspectRatio: '1.586',
            background: 'linear-gradient(135deg, #0D0B1E 0%, #1B1640 45%, #0E1729 100%)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {/* Dot grid texture */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(200,169,110,0.18) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.35,
            }}
          />

          {/* Diagonal shimmer stripe */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(200,169,110,0.055) 48%, rgba(255,220,120,0.03) 52%, transparent 68%)',
            }}
          />

          {/* Top edge gold line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(200,169,110,0.55) 40%, rgba(232,201,126,0.7) 60%, transparent 95%)' }}
          />

          {/* Glow blob center */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '60%', height: '80%',
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-5" dir="rtl">

            {/* ── Row 1: Chip + Logo ── */}
            <div className="flex items-start justify-between">
              {/* EMV Chip */}
              <div
                className="rounded-[5px] flex-shrink-0"
                style={{
                  width: 36, height: 28,
                  background: 'linear-gradient(145deg, #D4A843 0%, #F0D070 35%, #B8882E 65%, #E2C060 100%)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px)',
                  backgroundSize: '9px 7px',
                }} />
                <div style={{
                  position: 'absolute', top: '35%', left: '25%', right: '25%', bottom: '35%',
                  background: 'rgba(0,0,0,0.12)', borderRadius: 2,
                }} />
              </div>

              {/* Network logo — two overlapping circles + brand */}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[8px] font-black tracking-[0.18em] uppercase"
                  style={{ color: 'rgba(200,169,110,0.45)' }}
                >
                  JABOLGH
                </span>
                <div className="flex">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: 'rgba(200,169,110,0.55)', boxShadow: '0 0 8px rgba(200,169,110,0.3)' }}
                  />
                  <div
                    className="w-6 h-6 rounded-full -mr-3"
                    style={{ background: 'rgba(160,120,60,0.45)', boxShadow: '0 0 8px rgba(160,120,60,0.2)' }}
                  />
                </div>
              </div>
            </div>

            {/* ── Row 2: Balance (center) ── */}
            <div className="text-center">
              <p
                className="text-[8px] tracking-[0.25em] uppercase mb-1"
                style={{ color: 'rgba(200,169,110,0.42)', letterSpacing: '0.22em' }}
              >
                موجودی کل
              </p>
              <p
                className="font-black font-fa leading-none"
                style={{
                  fontSize: 'clamp(22px, 7vw, 30px)',
                  color: '#EDD07A',
                  textShadow: '0 0 24px rgba(200,169,110,0.45), 0 2px 4px rgba(0,0,0,0.5)',
                  letterSpacing: '-0.02em',
                }}
              >
                {new Intl.NumberFormat('fa-IR').format(player.balance)}
                <span
                  className="font-fa"
                  style={{ fontSize: 'clamp(12px, 3.5vw, 16px)', color: 'rgba(200,169,110,0.55)', marginRight: 6 }}
                >
                  تومان
                </span>
              </p>

              {/* Profit row */}
              <div className="flex items-center justify-center gap-2.5 mt-2">
                <div className="flex items-center gap-1">
                  {totalProfit >= 0
                    ? <ArrowUpRight size={11} style={{ color: '#4ade80' }} />
                    : <ArrowDownRight size={11} style={{ color: '#f87171' }} />
                  }
                  <span
                    className="text-[10px] font-black font-fa"
                    style={{ color: totalProfit >= 0 ? '#4ade80' : '#f87171' }}
                  >
                    {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>/سیکل</span>
                </div>
                <div
                  className="h-2.5 w-px"
                  style={{ background: 'rgba(200,169,110,0.2)' }}
                />
                <span className="text-[9px] font-fa" style={{ color: 'rgba(200,169,110,0.38)' }}>
                  ارزش {empireValue.toLocaleString('fa-IR')}
                </span>
              </div>
            </div>

            {/* ── Row 3: Name + Level ── */}
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-[7px] tracking-widest mb-0.5 uppercase"
                  style={{ color: 'rgba(200,169,110,0.35)', letterSpacing: '0.18em' }}
                >
                  صاحب کارت
                </p>
                <p
                  className="text-[13px] font-black tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.82)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
                >
                  {player.username}
                </p>
              </div>

              <div
                className="flex flex-col items-center px-3 py-1.5 rounded-[10px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,169,110,0.12), rgba(200,169,110,0.04))',
                  border: '1px solid rgba(200,169,110,0.18)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <span className="text-[7px] tracking-wider uppercase" style={{ color: 'rgba(200,169,110,0.4)' }}>
                  سطح
                </span>
                <span className="text-[18px] font-black font-fa leading-tight" style={{ color: '#C8A96E' }}>
                  {player.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card reflection / bottom glow */}
        <div
          className="absolute -bottom-3 left-6 right-6 h-4 rounded-b-[22px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(139,92,246,0.15), transparent)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* ===================== Empire Stats Grid ===================== */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: <Briefcase size={14} className="text-[#818cf8]" />, value: `${businesses.length}`, label: 'شرکت', bg: 'bg-[#6366F1]/8' },
          { icon: <Users size={14} className="text-[#60A5FA]" />, value: `${totalEmployees}`, label: 'نیرو', bg: 'bg-[#3B82F6]/8' },
          { icon: <ShoppingCart size={14} className="text-[#34d399]" />, value: `${totalInventory}`, label: 'انبار', bg: 'bg-[#22C55E]/8' },
          { icon: <Wallet size={14} className="text-[#F59E0B]" />, value: `${totalRevenueMoney.toLocaleString('fa-IR')}`, label: 'درآمد/سیکل', bg: 'bg-[#F59E0B]/8' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-[14px] p-2.5 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-sm font-black font-fa">{s.value}</p>
            <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ===================== Next Unlock ===================== */}
      <NextUnlockCard level={player.level} xp={player.stats.experience} />

      {/* ===================== Action Center ===================== */}
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 rounded-[16px] border active:scale-[0.98] transition-transform"
              style={{ background: action.bg, borderColor: `${action.color}25` }}
            >
              <span className="text-xl shrink-0">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-black" style={{ color: action.color }}>{action.label}</p>
                {action.sub && <p className="text-[9px] text-fg-muted mt-0.5">{action.sub}</p>}
              </div>
              <ChevronLeft size={15} className="shrink-0" style={{ color: action.color }} />
            </Link>
          ))}
        </div>
      )}

      {/* ===================== Active Boost ===================== */}
      <ActiveBoostBanner />

      {/* ===================== Rush Hour ===================== */}
      <RushHourBanner />

      {/* ===================== Active Events ===================== */}
      {activeEvents.length > 0 && (
        <div className="space-y-1.5">
          {activeEvents.map((evt) => (
            <EventBanner key={evt.id} event={evt} showFull />
          ))}
        </div>
      )}

      {/* ===================== Businesses ===================== */}
      {businesses.length === 0 && (
        <Link
          href="/business"
          className="block rounded-[18px] border border-dashed border-[#6366F1]/30 p-5 text-center active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))' }}
        >
          <span className="text-3xl">🚀</span>
          <p className="text-sm font-black mt-2">اولین شرکتت رو بساز!</p>
          <p className="text-[10px] text-fg-muted mt-1">برو به بخش کسب‌وکار و شروع کن</p>
        </Link>
      )}
      {businesses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xs text-fg">شرکت‌ها</h2>
            <Link href="/business" className="text-[10px] text-accent-primary flex items-center gap-0.5">
              مدیریت <ChevronLeft size={12} />
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {businesses.map((biz) => {
              const bizProd = products.find((p) => p.id === biz.inventory.productId);
              const bizPrice = bizProd?.currentPrice ?? 0;
              const bizUnitsPerCycle = Math.min(calcEffectiveRevenue(biz), biz.baseSaleRate * (biz.cycleDuration / 60));
              const net = Math.round(bizUnitsPerCycle * bizPrice) - calcTotalExpenses(biz);
              const invPct = Math.round((biz.inventory.quantity / biz.inventory.maxCapacity) * 100);
              const isUpgrading = biz.upgradeStartedAt !== null;
              const isLosing = net < 0;
              const upgradeReady = isUpgrading && biz.upgradeEndsAt !== null && Date.now() >= biz.upgradeEndsAt;

              const borderColor = upgradeReady ? 'rgba(34,197,94,0.4)'
                : isLosing ? 'rgba(239,68,68,0.3)'
                : isUpgrading ? 'rgba(139,92,246,0.3)'
                : 'rgba(212,212,216,0.25)';

              return (
                <Link key={biz.id} href={`/business/${biz.id}`} className="shrink-0 active:scale-[0.97] transition-transform">
                  <div
                    className="w-[148px] rounded-[16px] bg-surface-card/50 p-3 border"
                    style={{ borderColor }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{biz.icon}</span>
                      <span
                        className="text-[8px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: isUpgrading ? '#8B5CF6' : '#6366F1' }}
                      >
                        LV {biz.level}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold truncate">{biz.name}</p>

                    {/* Status chip */}
                    {upgradeReady && (
                      <p className="text-[8px] font-bold text-[#22C55E] mt-0.5">✨ ارتقا آماده</p>
                    )}
                    {!upgradeReady && isUpgrading && (
                      <p className="text-[8px] font-bold text-[#8B5CF6] mt-0.5">⚙️ در حال ارتقا</p>
                    )}
                    {!isUpgrading && isLosing && (
                      <p className="text-[8px] font-bold text-[#EF4444] mt-0.5">📉 ضررده</p>
                    )}

                    {/* Cycle countdown + profit */}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-0.5">
                        <span className={`text-[10px] font-black font-fa ${net >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                          {net >= 0 ? '+' : ''}{net.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[8px] text-fg-faint">/سیکل</span>
                      </div>
                      {!isUpgrading && (
                        <CycleCountdown lastCycleAt={biz.lastCycleAt} cycleDuration={biz.cycleDuration} />
                      )}
                    </div>

                    {/* Inventory bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-progress-bg overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${invPct}%`,
                          backgroundColor: invPct > 90 ? '#EF4444' : invPct > 50 ? '#F59E0B' : '#22C55E',
                        }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== Market Trends ===================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xs text-fg flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#22C55E]" />
            بازار
          </h2>
          <Link href="/market" className="text-[10px] text-accent-primary flex items-center gap-0.5">
            ورود به بازار <ChevronLeft size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {topProducts.map((prod) => {
            const currentPrice = prod.currentPrice ?? prod.basePrice ?? 0;
            const basePrice = prod.basePrice ?? 0;
            const changePct = basePrice > 0 ? ((currentPrice - basePrice) / basePrice) * 100 : 0;
            const isUp = changePct >= 0;
            const isSignificant = Math.abs(changePct) >= 15;
            return (
              <Link key={prod.id} href="/market" className="block active:scale-[0.98] transition-transform">
                <div className={`flex items-center gap-2 rounded-[12px] px-2.5 py-2 border ${
                  isSignificant
                    ? isUp ? 'border-[#22C55E]/25 bg-[#22C55E]/5' : 'border-[#EF4444]/25 bg-[#EF4444]/5'
                    : 'border-line-subtle bg-surface-card/30'
                }`}>
                  <span className="text-lg">{prod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate">{prod.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-accent-money font-fa text-[10px] font-bold">
                        {currentPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className={`text-[9px] font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {isUp ? '+' : ''}{changePct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isUp
                      ? <ArrowUpRight size={12} className="text-[#22C55E]" />
                      : <ArrowDownRight size={12} className="text-[#EF4444]" />
                    }
                    {isSignificant && (
                      <p className={`text-[7px] font-bold text-center ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {isUp ? 'فروش' : 'فرصت'}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==================== Next Unlock Card ====================
function NextUnlockCard({ level, xp }: { level: number; xp: number }) {
  // پیدا کردن اولین لولی که آنلاک داره
  const nextUnlocks = useMemo(() => {
    for (let l = level + 1; l <= level + 15; l++) {
      const unlocks = getUnlocksForLevel(l);
      if (unlocks.length > 0) return { targetLevel: l, unlocks };
    }
    return null;
  }, [level]);

  if (!nextUnlocks) return null;

  const required = xpForLevel(level);
  const xpPct = Math.min(100, Math.round((xp / required) * 100));
  const levelsAway = nextUnlocks.targetLevel - level;

  return (
    <div
      className="rounded-[16px] border border-[#8B5CF6]/15 bg-[#8B5CF6]/5 p-3.5"
      style={{ boxShadow: '0 0 16px rgba(139,92,246,0.06)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Lock size={13} className="text-[#8B5CF6]" />
          <span className="text-[11px] font-black text-[#8B5CF6]">
            {levelsAway === 1 ? 'آنلاک بعدی' : `${levelsAway} سطح تا آنلاک`}
          </span>
        </div>
        <span className="text-[9px] font-bold text-fg-faint font-fa">سطح {nextUnlocks.targetLevel}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {nextUnlocks.unlocks.map((u, i) => (
          <span
            key={i}
            className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#a78bfa]"
          >
            🔓 {u}
          </span>
        ))}
      </div>

      {/* Mini XP bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-progress-bg overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] transition-all"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <span className="text-[8px] text-fg-faint font-fa font-bold shrink-0">{xp}/{required} XP</span>
      </div>
    </div>
  );
}

// ==================== Cycle Countdown ====================
function CycleCountdown({ lastCycleAt, cycleDuration }: { lastCycleAt: number; cycleDuration: number }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - lastCycleAt) / 1000;
      const rem = Math.max(0, cycleDuration - (elapsed % cycleDuration));
      setRemaining(Math.ceil(rem));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastCycleAt, cycleDuration]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <span className="text-[9px] font-bold font-fa text-[#818cf8]">
      {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`}
    </span>
  );
}
