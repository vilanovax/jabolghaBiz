'use client';

import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import {
  Briefcase,
  Users,
  Crown,
  ArrowUpCircle,
  ShoppingCart,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import RushHourBanner from '@/components/hooks/RushHourBanner';

export default function HomePage() {
  const player = useGameStore((s) => s.player);
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

  const hasPendingAny = businesses.some((b) => b.pendingRevenue > 0);

  return (
    <div className="space-y-5 py-4 pb-24">
      {/* ===================== 1️⃣ پول — مهمترین عنصر ===================== */}
      <div className="text-center space-y-1">
        <p className="text-[10px] text-fg-muted tracking-widest uppercase">موجودی</p>
        <MoneyDisplay amount={player.balance} size="lg" />
        <div className="flex items-center justify-center gap-1 text-[11px]">
          <TrendingUp size={12} className={totalProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'} />
          <MoneyDisplay amount={totalProfit} size="sm" showSign />
          <span className="text-fg-faint">/سیکل</span>
        </div>
      </div>

      {/* ===================== Rush Hour ===================== */}
      <RushHourBanner />

      {/* ===================== آمار سریع ===================== */}
      <div className="flex items-center justify-around py-3 border-y border-line-subtle">
        <div className="text-center">
          <Crown size={16} className="mx-auto text-accent-gold mb-0.5" />
          <p className="text-sm font-black font-fa">{empireValue.toLocaleString('fa-IR')}</p>
          <p className="text-[9px] text-fg-muted">ارزش</p>
        </div>
        <div className="w-px h-8 bg-line-subtle" />
        <div className="text-center">
          <Briefcase size={16} className="mx-auto text-accent-primary mb-0.5" />
          <p className="text-sm font-black">{businesses.length}</p>
          <p className="text-[9px] text-fg-muted">شرکت</p>
        </div>
        <div className="w-px h-8 bg-line-subtle" />
        <div className="text-center">
          <Users size={16} className="mx-auto text-accent-info mb-0.5" />
          <p className="text-sm font-black">{totalEmployees}</p>
          <p className="text-[9px] text-fg-muted">نیرو</p>
        </div>
      </div>

      {/* ===================== 2️⃣ شرکت‌ها — تولید ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">شرکت‌ها</h2>
          <Link href="/business" className="text-[11px] text-accent-primary hover:opacity-80">
            مشاهده همه
          </Link>
        </div>
        <div className="space-y-2.5">
          {businesses.map((biz) => {
            const revenue = calcEffectiveRevenue(biz);
            const expenses = calcTotalExpenses(biz);
            const net = revenue - expenses;
            const hasPending = biz.pendingRevenue > 0;
            return (
              <Link key={biz.id} href={`/business/${biz.id}`}>
                <Card glow={hasPending ? 'profit' : 'none'} active={hasPending}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{biz.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black truncate">{biz.name}</p>
                        <Badge text={`LV ${biz.level}`} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px]">
                        <span className="text-fg-muted">
                          <Users size={10} className="inline mb-px" /> {biz.employees.length}
                        </span>
                        <span className="text-fg-muted">
                          <Clock size={10} className="inline mb-px" /> {biz.cycleDuration}ث
                        </span>
                        <span className="text-[#22C55E] font-bold font-fa">+{net.toLocaleString('fa-IR')}</span>
                      </div>
                    </div>
                    {hasPending && (
                      <div className="text-center animate-coin-burst">
                        <p className="text-accent-money font-black text-sm font-fa">{biz.pendingRevenue.toLocaleString('fa-IR')}</p>
                        <p className="text-[8px] text-[#22C55E]">آماده</p>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===================== 3️⃣ روند بازار ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">بازار</h2>
          <Link href="/market" className="text-[11px] text-accent-primary hover:opacity-80 flex items-center gap-1">
            <ShoppingCart size={12} />
            ورود
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {topProducts.map((prod) => {
            const change = (((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100).toFixed(0);
            const isUp = prod.currentPrice >= prod.basePrice;
            return (
              <div key={prod.id} className="flex items-center gap-2 bg-surface-card/40 rounded-[12px] px-3 py-2 border border-line-subtle">
                <span className="text-xl">{prod.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate">{prod.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent-money font-fa text-[11px] font-bold">
                      {prod.currentPrice.toLocaleString('fa-IR')}
                    </span>
                    <span className={`text-[10px] font-bold ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {isUp ? '+' : ''}{change}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== وضعیت شخصی ===================== */}
      <div className="flex items-center justify-around py-3 bg-surface-card/30 rounded-[18px]">
        {[
          { icon: '😊', value: player.stats.happiness, label: 'شادی' },
          { icon: '🍔', value: player.stats.hunger, label: 'سیری' },
          { icon: '⚡', value: player.stats.energy, label: 'انرژی' },
          { icon: '🧠', value: player.stats.intelligence, label: 'هوش' },
          { icon: '⭐', value: player.stats.experience, label: 'تجربه' },
        ].map((stat) => (
          <Link key={stat.label} href="/profile" className="flex flex-col items-center gap-0.5 group">
            <span className="text-lg group-hover:scale-110 transition-transform">{stat.icon}</span>
            <span className="text-xs font-black text-fg">{stat.value}</span>
            <span className="text-[8px] text-fg-faint">{stat.label}</span>
          </Link>
        ))}
      </div>

      {/* ===================== CTA شناور ===================== */}
      <Link href="/business" className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] hover:from-[#818cf8] hover:to-[#a78bfa] text-white px-6 py-3 rounded-[999px] font-bold text-sm shadow-[0_4px_18px_rgba(99,102,241,0.4)] active:scale-95 transition-all flex items-center gap-2">
          <Briefcase size={18} />
          مدیریت شرکت‌ها
        </button>
      </Link>
    </div>
  );
}
