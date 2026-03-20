'use client';

import { useMemo } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import {
  Briefcase, Users, ShoppingCart, Wallet,
  TrendingUp, ArrowUpRight, ArrowDownRight, ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import RushHourBanner from '@/components/hooks/RushHourBanner';
import EventBanner from '@/components/hooks/EventBanner';
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

  const totalRevenue = businesses.reduce((sum, b) => sum + calcEffectiveRevenue(b), 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenue - totalExpenses;
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

      {/* ===================== Balance Hero ===================== */}
      <div className="relative text-center py-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-[90px]" />
        </div>
        <p className="text-[10px] text-fg-muted tracking-widest relative">موجودی کل</p>
        <div className="relative mt-2 animate-money-glow">
          <span className="text-3xl font-black font-fa text-accent-money">
            {new Intl.NumberFormat('fa-IR').format(player.balance)} <span className="text-xl">تومان</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2.5 relative">
          <div className="flex items-center gap-1 text-[10px]">
            {totalProfit >= 0
              ? <ArrowUpRight size={13} className="text-[#22C55E]" />
              : <ArrowDownRight size={13} className="text-[#EF4444]" />
            }
            <MoneyDisplay amount={totalProfit} size="sm" showSign />
            <span className="text-fg-faint">/سیکل</span>
          </div>
          <div className="w-px h-3 bg-line-subtle" />
          <div className="flex items-center gap-1 text-[10px] text-fg-faint">
            <span className="font-fa">{empireValue.toLocaleString('fa-IR')}</span>
            <span>ارزش</span>
          </div>
        </div>
      </div>

      {/* ===================== Empire Stats Grid ===================== */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: <Briefcase size={14} className="text-[#818cf8]" />, value: `${businesses.length}`, label: 'شرکت', bg: 'bg-[#6366F1]/8' },
          { icon: <Users size={14} className="text-[#60A5FA]" />, value: `${totalEmployees}`, label: 'نیرو', bg: 'bg-[#3B82F6]/8' },
          { icon: <ShoppingCart size={14} className="text-[#34d399]" />, value: `${totalInventory}`, label: 'انبار', bg: 'bg-[#22C55E]/8' },
          { icon: <Wallet size={14} className="text-[#F59E0B]" />, value: `${totalRevenue.toLocaleString('fa-IR')}`, label: 'درآمد/سیکل', bg: 'bg-[#F59E0B]/8' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-[14px] p-2.5 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-sm font-black font-fa">{s.value}</p>
            <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

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
              const net = calcEffectiveRevenue(biz) - calcTotalExpenses(biz);
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

                    {/* Net profit */}
                    <div className="flex items-center gap-0.5 mt-1.5">
                      <span className={`text-[10px] font-black font-fa ${net >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {net >= 0 ? '+' : ''}{net.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[8px] text-fg-faint">/سیکل</span>
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
            const changePct = ((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100;
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
                        {prod.currentPrice.toLocaleString('fa-IR')}
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
