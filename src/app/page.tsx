'use client';

import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import {
  Briefcase,
  Users,
  Crown,
  ShoppingCart,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import RushHourBanner from '@/components/hooks/RushHourBanner';
import EventBanner from '@/components/hooks/EventBanner';
import MissionsWidget from '@/components/missions/MissionsWidget';

export default function HomePage() {
  const player = useGameStore((s) => s.player);
  const activeEvents = useGameStore((s) => s.randomEvents.activeEvents).filter(
    (e) => e.effect !== 'instant_balance'
  );
  const businesses = useGameStore((s) => s.businesses);
  const products = useGameStore((s) => s.products);

  const totalRevenue = businesses.reduce((sum, b) => sum + calcEffectiveRevenue(b), 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);
  const empireValue = calcEmpireValue(player, businesses);

  const topProducts = [...products]
    .sort((a, b) => (b.currentPrice - b.basePrice) / b.basePrice - (a.currentPrice - a.basePrice) / a.basePrice)
    .slice(0, 4);

  return (
    <div className="space-y-4 py-3 pb-24">
      {/* ===================== Balance Hero ===================== */}
      <div className="relative text-center py-5">
        {/* Radial glow behind balance */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-[#F59E0B]/8 blur-[60px]" />
        </div>
        <p className="text-[10px] text-fg-muted tracking-widest uppercase relative">موجودی</p>
        <div className="relative mt-1">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
        <div className="flex items-center justify-center gap-1 text-[11px] mt-1 relative">
          <TrendingUp size={12} className={totalProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} />
          <MoneyDisplay amount={totalProfit} size="sm" showSign />
          <span className="text-fg-faint">/سیکل</span>
        </div>
      </div>

      {/* ===================== Quick Stats Pills ===================== */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-[#FBBF24]/10 text-[#FBBF24] px-2.5 py-1 rounded-[99px] text-[10px] font-bold">
          <Crown size={11} />
          <span className="font-fa">{empireValue.toLocaleString('fa-IR')}</span>
        </div>
        <div className="flex items-center gap-1 bg-[#6366F1]/10 text-[#818cf8] px-2.5 py-1 rounded-[99px] text-[10px] font-bold">
          <Briefcase size={11} />
          <span>{businesses.length} شرکت</span>
        </div>
        <div className="flex items-center gap-1 bg-[#3B82F6]/10 text-[#60A5FA] px-2.5 py-1 rounded-[99px] text-[10px] font-bold">
          <Users size={11} />
          <span>{totalEmployees} نیرو</span>
        </div>
      </div>

      {/* ===================== Player Stats Bar ===================== */}
      <div className="flex items-center justify-around py-2">
        {[
          { icon: '😊', value: player.stats.happiness, color: '#22C55E' },
          { icon: '🍔', value: player.stats.hunger, color: '#F59E0B' },
          { icon: '⚡', value: player.stats.energy, color: '#3B82F6' },
          { icon: '🧠', value: player.stats.intelligence, color: '#8B5CF6' },
          { icon: '⭐', value: player.stats.experience, color: '#EC4899' },
        ].map((stat) => (
          <Link key={stat.icon} href="/profile" className="flex flex-col items-center gap-0.5 group">
            <span className="text-base group-hover:scale-110 transition-transform">{stat.icon}</span>
            <div className="w-7 h-1 rounded-full bg-progress-bg overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* ===================== Rush Hour ===================== */}
      <RushHourBanner />

      {/* ===================== Active Events (compact) ===================== */}
      {activeEvents.length > 0 && (
        <div className="space-y-1.5">
          {activeEvents.map((evt) => (
            <EventBanner key={evt.id} event={evt} showFull />
          ))}
        </div>
      )}

      {/* ===================== Missions Widget ===================== */}
      <MissionsWidget />

      {/* ===================== Businesses ===================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xs flex items-center gap-1">
            <Zap size={13} className="text-[#6366F1]" />
            شرکت‌ها
          </h2>
          <Link href="/business" className="text-[10px] text-accent-primary hover:opacity-80">
            مشاهده همه
          </Link>
        </div>

        {/* Horizontal scroll for businesses */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {businesses.map((biz) => {
            const net = calcEffectiveRevenue(biz) - calcTotalExpenses(biz);
            const hasPending = biz.pendingRevenue > 0;
            return (
              <Link key={biz.id} href={`/business/${biz.id}`} className="shrink-0">
                <div className={`w-36 rounded-[16px] border p-3 transition-all ${
                  hasPending
                    ? 'border-[#22C55E]/30 bg-[#22C55E]/5 shadow-[0_0_12px_rgba(34,197,94,0.12)]'
                    : 'border-line-subtle bg-surface-card/40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{biz.icon}</span>
                    <Badge text={`${biz.level}`} />
                  </div>
                  <p className="text-[11px] font-bold truncate">{biz.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-fg-muted">
                    <span><Users size={9} className="inline" /> {biz.employees.length}</span>
                    <span><Clock size={9} className="inline" /> {biz.cycleDuration}ث</span>
                  </div>
                  <p className="text-[#22C55E] font-bold font-fa text-[11px] mt-1.5">
                    +{net.toLocaleString('fa-IR')}
                  </p>
                  {hasPending && (
                    <div className="mt-1.5 text-center py-1 rounded-[8px] bg-[#22C55E]/15">
                      <p className="text-accent-money font-black text-xs font-fa animate-pulse">
                        {biz.pendingRevenue.toLocaleString('fa-IR')}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===================== Market Trends ===================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xs flex items-center gap-1">
            <ShoppingCart size={13} className="text-[#22C55E]" />
            بازار
          </h2>
          <Link href="/market" className="text-[10px] text-accent-primary hover:opacity-80">
            ورود
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {topProducts.map((prod) => {
            const change = (((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100).toFixed(0);
            const isUp = prod.currentPrice >= prod.basePrice;
            return (
              <div key={prod.id} className="flex items-center gap-2 bg-white/[0.03] rounded-[12px] px-2.5 py-2 border border-white/[0.06]">
                <span className="text-lg">{prod.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate">{prod.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-accent-money font-fa text-[10px] font-bold">
                      {prod.currentPrice.toLocaleString('fa-IR')}
                    </span>
                    <span className={`text-[9px] font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {isUp ? '+' : ''}{change}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
