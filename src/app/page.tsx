'use client';

import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import {
  Briefcase,
  Users,
  Crown,
  ShoppingCart,
  TrendingUp,
  Zap,
  Landmark,
  Swords,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import RushHourBanner from '@/components/hooks/RushHourBanner';
import EventBanner from '@/components/hooks/EventBanner';
import MissionsWidget, { useActiveMissionContext } from '@/components/missions/MissionsWidget';

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

  // Mission context for cross-section linking
  const { missionBusinessTypes, needsMarket, needsUpgrade } = useActiveMissionContext();

  const topProducts = [...products]
    .sort((a, b) => Math.abs((b.currentPrice - b.basePrice) / b.basePrice) - Math.abs((a.currentPrice - a.basePrice) / a.basePrice))
    .slice(0, 4);

  const rivalNews = news.filter((n) => n.category === 'rival').slice(0, 2);

  // Banking summary
  const activeLoans = banking.loans.length;
  const activeDeposits = banking.deposits.length;
  const totalDepositInterest = banking.deposits.reduce((s, d) => s + d.accruedInterest, 0);

  // Closest rival ahead + achievable goal
  const closestRivalAhead = rivals
    .filter((r) => r.wealth > player.balance)
    .sort((a, b) => a.wealth - b.wealth)[0] ?? null;
  const rivalGapPct = closestRivalAhead && player.balance > 0
    ? Math.round(((closestRivalAhead.wealth - player.balance) / player.balance) * 100)
    : 0;
  // Calculate income boost needed to overtake
  const incomeNeededHint = closestRivalAhead && totalProfit > 0
    ? Math.max(5, Math.min(50, Math.round(((closestRivalAhead.wealth - player.balance) / (totalProfit * 100)) * 10)))
    : null;

  return (
    <div className="space-y-5 py-3 pb-24">
      {/* ===================== Balance Hero ===================== */}
      <div className="relative text-center py-7">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-[#F59E0B]/10 blur-[90px]" />
        </div>
        <p className="text-[10px] text-fg-muted tracking-widest uppercase relative">موجودی کل</p>
        <div className="relative mt-2 animate-money-glow">
          <span className="text-3xl font-black font-fa text-accent-money">
            {new Intl.NumberFormat('fa-IR').format(player.balance)} <span className="text-xl">تومان</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3 relative">
          <div className="flex items-center gap-1 text-[10px]">
            {totalProfit >= 0 ? <ArrowUpRight size={13} className="text-[#22C55E]" /> : <ArrowDownRight size={13} className="text-[#EF4444]" />}
            <MoneyDisplay amount={totalProfit} size="sm" showSign />
            <span className="text-fg-faint">/سیکل</span>
          </div>
          <div className="w-px h-3 bg-line-subtle" />
          <div className="flex items-center gap-1 text-[10px]">
            <Crown size={11} className="text-[#FBBF24]" />
            <span className="text-fg-faint font-fa">{empireValue.toLocaleString('fa-IR')}</span>
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
              مدیریت
              <ChevronLeft size={12} />
            </Link>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {businesses.map((biz) => {
              const net = calcEffectiveRevenue(biz) - calcTotalExpenses(biz);
              const invPct = Math.round((biz.inventory.quantity / biz.inventory.maxCapacity) * 100);
              const isUpgrading = biz.upgradeStartedAt !== null;
              const inventoryFull = invPct >= 95;
              const hasWarning = inventoryFull || (net < 0);

              // Mission link: highlight if business type matches active mission
              const isMissionLinked = missionBusinessTypes.has(biz.type)
                || (needsUpgrade && !isUpgrading);

              return (
                <Link key={biz.id} href={`/business/${biz.id}`} className="shrink-0">
                  <div className={`w-[148px] rounded-[16px] border bg-surface-card/40 p-3 transition-all ${
                    isMissionLinked
                      ? 'border-[#3B82F6]/40 bg-[#3B82F6]/5'
                      : hasWarning
                        ? 'border-[#F59E0B]/40'
                        : isUpgrading
                          ? 'border-[#8B5CF6]/30'
                          : 'border-line-subtle hover:border-[#6366F1]/30'
                  }`}
                    style={isMissionLinked ? { boxShadow: '0 0 10px rgba(59,130,246,0.1)' } : undefined}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{biz.icon}</span>
                      <Badge text={`Lv${biz.level}`} variant={isUpgrading ? 'upgrade' : 'primary'} />
                    </div>
                    <p className="text-[11px] font-bold truncate">{biz.name}</p>

                    {/* Mission link hint */}
                    {isMissionLinked && (
                      <div className="flex items-center gap-1 mt-1 text-[8px] font-bold text-[#3B82F6]">
                        <span>🎯</span>
                        مرتبط با ماموریت
                      </div>
                    )}

                    {/* Net profit */}
                    <div className="flex items-center gap-1 mt-1">
                      {net >= 0
                        ? <ArrowUpRight size={10} className="text-[#22C55E]" />
                        : <ArrowDownRight size={10} className="text-[#EF4444]" />
                      }
                      <span className={`text-[10px] font-black font-fa ${net >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {net >= 0 ? '+' : ''}{net.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[8px] text-fg-faint">/سیکل</span>
                    </div>

                    {/* Inventory bar */}
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${invPct}%`,
                            backgroundColor: invPct > 90 ? '#EF4444' : invPct > 50 ? '#F59E0B' : '#22C55E',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[8px] text-fg-faint font-fa">{biz.inventory.quantity}/{biz.inventory.maxCapacity}</span>
                        <span className="text-[8px] text-fg-faint"><Users size={8} className="inline" /> {biz.employees.length}</span>
                      </div>
                    </div>

                    {/* Warning / Status */}
                    {inventoryFull && (
                      <div className="flex items-center gap-1 mt-1.5 text-[8px] font-bold text-[#F59E0B]">
                        <AlertTriangle size={9} />
                        انبار پر
                      </div>
                    )}
                    {net < 0 && !inventoryFull && (
                      <div className="flex items-center gap-1 mt-1.5 text-[8px] font-bold text-[#EF4444]">
                        <AlertTriangle size={9} />
                        ضررده
                      </div>
                    )}
                    {isUpgrading && !hasWarning && !isMissionLinked && (
                      <div className="flex items-center gap-1 mt-1.5 text-[8px] font-bold text-[#8B5CF6]">
                        <Clock size={9} />
                        در حال ارتقا...
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== Player Stats Ring ===================== */}
      <div className="flex items-center justify-around py-1 px-2 bg-surface-card/30 rounded-[16px] border border-line-subtle">
        {[
          { icon: '😊', value: player.stats.happiness, color: '#22C55E', label: 'شادی' },
          { icon: '🍔', value: player.stats.hunger, color: '#F59E0B', label: 'گرسنگی' },
          { icon: '⚡', value: player.stats.energy, color: '#3B82F6', label: 'انرژی' },
          { icon: '🧠', value: player.stats.intelligence, color: '#8B5CF6', label: 'هوش' },
          { icon: '⭐', value: player.stats.experience, color: '#EC4899', label: 'تجربه' },
        ].map((stat) => {
          const isLow = stat.label === 'گرسنگی' ? stat.value > 80 : stat.value < 25;
          return (
            <Link key={stat.icon} href="/life" className="flex flex-col items-center gap-1 py-2 group">
              <span className="text-base group-hover:scale-110 transition-transform">{stat.icon}</span>
              <div className="w-8 h-1.5 rounded-full bg-progress-bg overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${stat.value}%`, backgroundColor: isLow ? '#EF4444' : stat.color }}
                />
              </div>
              <span className={`text-[7px] ${isLow ? 'text-[#EF4444] font-bold' : 'text-fg-faint'}`}>{stat.label}</span>
            </Link>
          );
        })}
      </div>

      {/* ===================== Banking Quick Summary ===================== */}
      {(activeLoans > 0 || activeDeposits > 0) && (
        <Link href="/market" className="block">
          <div className="flex items-center gap-3 bg-surface-card/40 rounded-[14px] border border-line-subtle px-3 py-2.5">
            <Landmark size={18} className="text-[#3B82F6] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold">خلاصه بانکی</p>
              <div className="flex items-center gap-3 mt-0.5 text-[9px] text-fg-muted">
                {activeLoans > 0 && <span>{activeLoans} وام فعال</span>}
                {activeDeposits > 0 && <span>{activeDeposits} سپرده</span>}
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

          {/* Competitive pressure banner */}
          {closestRivalAhead && (
            <Link
              href="/leaderboard"
              className="flex items-center gap-2.5 mb-2 px-3 py-2.5 rounded-[14px] bg-[#F97316]/8 border border-[#F97316]/20 active:scale-[0.98] transition-transform"
            >
              <span className="text-xl">{closestRivalAhead.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-fg">{closestRivalAhead.name}</p>
                <p className="text-[9px] text-[#F97316] font-bold">
                  {rivalGapPct > 0 ? `${rivalGapPct}% جلوتر از تو` : 'هم‌سطح تو'}
                </p>
                {incomeNeededHint && incomeNeededHint <= 30 && (
                  <p className="text-[8px] text-fg-muted mt-0.5">
                    با +{incomeNeededHint}% درآمد از او جلو می‌زنی
                  </p>
                )}
              </div>
              <span className="text-[9px] font-black text-[#F97316] px-2 py-1 rounded-full bg-[#F97316]/12">
                سبقت بگیر
              </span>
            </Link>
          )}

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
            ورود به بازار
            <ChevronLeft size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {topProducts.map((prod) => {
            const changePct = ((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100;
            const isUp = changePct >= 0;
            const isSignificant = Math.abs(changePct) >= 15;
            return (
              <Link key={prod.id} href="/market" className="block">
                <div className={`flex items-center gap-2 rounded-[12px] px-2.5 py-2 border transition-all active:scale-[0.98] ${
                  isSignificant
                    ? isUp
                      ? 'border-[#22C55E]/25 bg-[#22C55E]/5'
                      : 'border-[#EF4444]/25 bg-[#EF4444]/5'
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
                    {/* Mission assist label */}
                    {needsMarket && isSignificant && !isUp && (
                      <p className="text-[7px] font-bold text-[#3B82F6] mt-0.5">🎯 مناسب برای ماموریت</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    {isUp ? <ArrowUpRight size={12} className="text-[#22C55E]" /> : <ArrowDownRight size={12} className="text-[#EF4444]" />}
                    {isSignificant && (
                      <span className={`text-[7px] font-bold mt-0.5 ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {isUp ? 'فروش' : 'فرصت'}
                      </span>
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
