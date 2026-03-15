'use client';

import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
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
  Landmark,
  Swords,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
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
  const banking = useGameStore((s) => s.banking);
  const rivals = useGameStore((s) => s.rivals.rivals).filter((r) => r.active);
  const news = useGameStore((s) => s.news);

  const totalRevenue = businesses.reduce((sum, b) => sum + calcEffectiveRevenue(b), 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);
  const empireValue = calcEmpireValue(player, businesses);
  const totalInventory = businesses.reduce((sum, b) => sum + b.inventory.quantity, 0);

  const topProducts = [...products]
    .sort((a, b) => (b.currentPrice - b.basePrice) / b.basePrice - (a.currentPrice - a.basePrice) / a.basePrice)
    .slice(0, 4);

  const rivalNews = news.filter((n) => n.category === 'rival').slice(0, 2);

  // Banking summary
  const activeLoans = banking.loans.length;
  const activeDeposits = banking.deposits.length;
  const totalDepositInterest = banking.deposits.reduce((s, d) => s + d.accruedInterest, 0);

  return (
    <div className="space-y-5 py-3 pb-24">
      {/* ===================== Balance Hero ===================== */}
      <div className="relative text-center py-6">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 rounded-full bg-[#F59E0B]/8 blur-[80px]" />
        </div>
        <p className="text-[10px] text-fg-muted tracking-widest uppercase relative">موجودی کل</p>
        <div className="relative mt-1.5">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
        <div className="flex items-center justify-center gap-3 mt-2 relative">
          <div className="flex items-center gap-1 text-[10px]">
            {totalProfit >= 0 ? <ArrowUpRight size={12} className="text-[#22C55E]" /> : <ArrowDownRight size={12} className="text-[#EF4444]" />}
            <MoneyDisplay amount={totalProfit} size="sm" showSign />
            <span className="text-fg-faint">/سیکل</span>
          </div>
        </div>
      </div>

      {/* ===================== Empire Stats Grid ===================== */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: <Crown size={14} className="text-[#FBBF24]" />, value: empireValue.toLocaleString('fa-IR'), label: 'ارزش', bg: 'bg-[#FBBF24]/8' },
          { icon: <Briefcase size={14} className="text-[#818cf8]" />, value: `${businesses.length}`, label: 'شرکت', bg: 'bg-[#6366F1]/8' },
          { icon: <Users size={14} className="text-[#60A5FA]" />, value: `${totalEmployees}`, label: 'نیرو', bg: 'bg-[#3B82F6]/8' },
          { icon: <ShoppingCart size={14} className="text-[#34d399]" />, value: `${totalInventory}`, label: 'انبار', bg: 'bg-[#22C55E]/8' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-[14px] p-2.5 text-center`}>
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-sm font-black font-fa">{s.value}</p>
            <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ===================== Player Stats Ring ===================== */}
      <div className="flex items-center justify-around py-1 px-2 bg-surface-card/30 rounded-[16px] border border-line-subtle">
        {[
          { icon: '😊', value: player.stats.happiness, color: '#22C55E', label: 'شادی' },
          { icon: '🍔', value: player.stats.hunger, color: '#F59E0B', label: 'گرسنگی' },
          { icon: '⚡', value: player.stats.energy, color: '#3B82F6', label: 'انرژی' },
          { icon: '🧠', value: player.stats.intelligence, color: '#8B5CF6', label: 'هوش' },
          { icon: '⭐', value: player.stats.experience, color: '#EC4899', label: 'تجربه' },
        ].map((stat) => (
          <Link key={stat.icon} href="/life" className="flex flex-col items-center gap-1 py-2 group">
            <span className="text-base group-hover:scale-110 transition-transform">{stat.icon}</span>
            <div className="w-8 h-1.5 rounded-full bg-progress-bg overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
              />
            </div>
            <span className="text-[7px] text-fg-faint">{stat.label}</span>
          </Link>
        ))}
      </div>

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

      {/* ===================== Missions Widget ===================== */}
      <MissionsWidget />

      {/* ===================== Businesses ===================== */}
      {businesses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xs flex items-center gap-1.5">
              <Zap size={13} className="text-[#6366F1]" />
              شرکت‌ها
            </h2>
            <Link href="/business" className="text-[10px] text-accent-primary flex items-center gap-0.5 hover:opacity-80">
              مشاهده همه
              <ChevronLeft size={12} />
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {businesses.map((biz) => {
              const net = calcEffectiveRevenue(biz) - calcTotalExpenses(biz);
              const invPct = Math.round((biz.inventory.quantity / biz.inventory.maxCapacity) * 100);
              return (
                <Link key={biz.id} href={`/business/${biz.id}`} className="shrink-0">
                  <div className="w-[140px] rounded-[16px] border border-line-subtle bg-surface-card/40 p-3 hover:border-[#6366F1]/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{biz.icon}</span>
                      <Badge text={`Lv${biz.level}`} variant="primary" />
                    </div>
                    <p className="text-[11px] font-bold truncate">{biz.name}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-fg-muted">
                      <span><Users size={9} className="inline" /> {biz.employees.length}</span>
                      <span><Clock size={9} className="inline" /> {biz.cycleDuration}ث</span>
                    </div>
                    {/* Inventory bar */}
                    <div className="mt-2">
                      <div className="h-1 rounded-full bg-progress-bg overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${invPct}%`,
                            backgroundColor: invPct > 90 ? '#EF4444' : invPct > 50 ? '#F59E0B' : '#22C55E',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[8px] text-fg-faint font-fa">📦 {biz.inventory.quantity}/{biz.inventory.maxCapacity}</span>
                        <span className="text-[#22C55E] font-bold font-fa text-[9px]">+{net.toLocaleString('fa-IR')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== Banking Quick Summary ===================== */}
      {(activeLoans > 0 || activeDeposits > 0) && (
        <Link href="/market" className="block">
          <div className="flex items-center gap-3 bg-surface-card/40 rounded-[14px] border border-line-subtle px-3 py-2.5">
            <Landmark size={18} className="text-[#3B82F6] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold">خلاصه بانکی</p>
              <div className="flex items-center gap-3 mt-0.5 text-[9px] text-fg-muted">
                {activeLoans > 0 && <span>📝 {activeLoans} وام فعال</span>}
                {activeDeposits > 0 && <span>💰 {activeDeposits} سپرده</span>}
                {totalDepositInterest > 0 && (
                  <span className="text-[#22C55E] font-bold font-fa">+{totalDepositInterest.toLocaleString('fa-IR')} سود</span>
                )}
              </div>
            </div>
            <ChevronLeft size={14} className="text-fg-faint" />
          </div>
        </Link>
      )}

      {/* ===================== Rival Activity ===================== */}
      {rivals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xs flex items-center gap-1.5">
              <Swords size={13} className="text-[#F97316]" />
              رقبا
            </h2>
            <Link href="/leaderboard" className="text-[10px] text-accent-primary flex items-center gap-0.5 hover:opacity-80">
              رتبه‌بندی
              <ChevronLeft size={12} />
            </Link>
          </div>
          {/* Top rivals mini-cards */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {rivals.sort((a, b) => b.wealth - a.wealth).slice(0, 4).map((rival) => {
              const isAhead = rival.wealth > player.balance;
              return (
                <div key={rival.id} className="shrink-0 w-[120px] rounded-[12px] border border-line-subtle bg-surface-card/30 p-2.5 text-center">
                  <span className="text-2xl">{rival.avatar}</span>
                  <p className="text-[10px] font-bold truncate mt-1">{rival.name}</p>
                  <p className="text-[8px] text-fg-muted">Lv{rival.level} · {rival.businessCount} شرکت</p>
                  <p className={`text-[9px] font-bold font-fa mt-1 ${isAhead ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                    {rival.wealth.toLocaleString('fa-IR')}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Rival news */}
          {rivalNews.length > 0 && (
            <div className="mt-2 space-y-1">
              {rivalNews.map((n) => (
                <div key={n.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-[#F97316]/5 border border-[#F97316]/10">
                  <span className="text-sm">{n.icon}</span>
                  <p className="text-[9px] text-fg-muted truncate flex-1">{n.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== Market Trends ===================== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xs flex items-center gap-1.5">
            <TrendingUp size={13} className="text-[#22C55E]" />
            بازار
          </h2>
          <Link href="/market" className="text-[10px] text-accent-primary flex items-center gap-0.5 hover:opacity-80">
            ورود
            <ChevronLeft size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {topProducts.map((prod) => {
            const changePct = ((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100;
            const isUp = changePct >= 0;
            return (
              <div key={prod.id} className="flex items-center gap-2 bg-surface-card/30 rounded-[12px] px-2.5 py-2 border border-line-subtle">
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
                {isUp ? <ArrowUpRight size={12} className="text-[#22C55E] shrink-0" /> : <ArrowDownRight size={12} className="text-[#EF4444] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
