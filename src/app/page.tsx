'use client';

import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, calcEmpireValue } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  TrendingUp,
  Briefcase,
  Users,
  Crown,
  ArrowUpCircle,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const demandLabel = (supply: number, demand: number) => {
  const ratio = demand / supply;
  if (ratio > 1.3) return { text: 'بالا', color: 'text-emerald-400' };
  if (ratio > 0.8) return { text: 'متوسط', color: 'text-amber-400' };
  return { text: 'پایین', color: 'text-red-400' };
};

const supplyLabel = (supply: number, demand: number) => {
  const ratio = supply / demand;
  if (ratio > 1.3) return { text: 'بالا', color: 'text-emerald-400' };
  if (ratio > 0.8) return { text: 'متوسط', color: 'text-amber-400' };
  return { text: 'پایین', color: 'text-red-400' };
};

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

  const dailyTasks = [
    { text: 'یک کارمند جدید استخدام کن', done: false },
    { text: 'یک کسب‌وکار را ارتقا بده', done: false },
    { text: 'محصولی در بازار بفروش', done: true },
  ];

  return (
    <div className="space-y-5 py-4 pb-24">
      {/* خوش‌آمدگویی */}
      <div>
        <h1 className="text-xl font-black">
          خوش برگشتی، <span className="text-indigo-400">{player.username}</span>
        </h1>
        <p className="text-sm text-fg-muted mt-0.5">داشبورد امپراتوری کسب‌وکار شما</p>
      </div>

      {/* ===================== خلاصه امپراتوری ===================== */}
      <div className="grid grid-cols-2 gap-3">
        <Card glow="#6366f1">
          <p className="text-[10px] text-fg-muted tracking-wider">موجودی کل</p>
          <MoneyDisplay amount={player.balance} size="lg" />
        </Card>
        <Card glow="#10b981">
          <p className="text-[10px] text-fg-muted tracking-wider">سود/سیکل</p>
          <MoneyDisplay amount={totalProfit} size="lg" showSign />
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center py-3">
          <Crown size={18} className="mx-auto text-amber-400 mb-1" />
          <p className="text-sm font-bold">{empireValue.toLocaleString('fa-IR')}</p>
          <p className="text-[10px] text-fg-muted">ارزش امپراتوری</p>
        </Card>
        <Card className="text-center py-3">
          <Briefcase size={18} className="mx-auto text-indigo-400 mb-1" />
          <p className="text-sm font-bold">{businesses.length}</p>
          <p className="text-[10px] text-fg-muted">کسب‌وکار</p>
        </Card>
        <Card className="text-center py-3">
          <Users size={18} className="mx-auto text-cyan-400 mb-1" />
          <p className="text-sm font-bold">{totalEmployees}</p>
          <p className="text-[10px] text-fg-muted">نیروها</p>
        </Card>
      </div>

      {/* ===================== کسب‌وکارهای من ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">کسب‌وکارهای من</h2>
          <Link href="/business" className="text-xs text-indigo-400 hover:text-indigo-300">
            مشاهده همه
          </Link>
        </div>
        <div className="space-y-3">
          {businesses.map((biz) => {
            const revenue = calcEffectiveRevenue(biz);
            const expenses = calcTotalExpenses(biz);
            const net = revenue - expenses;
            return (
              <Link key={biz.id} href={`/business/${biz.id}`}>
                <Card className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{biz.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate">{biz.name}</p>
                        <Badge text={`سطح ${biz.level}`} />
                      </div>
                      <p className="text-[10px] text-fg-muted mt-0.5">
                        {biz.employees.length} نیرو · <Clock size={10} className="inline" /> {biz.cycleDuration} ثانیه
                      </p>
                    </div>
                    {biz.pendingRevenue > 0 && (
                      <span className="text-[10px] bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded-full animate-pulse">
                        درآمد آماده
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-surface-elevated/60 rounded-lg py-1.5 px-1">
                      <p className="text-[10px] text-fg-muted">درآمد/سیکل</p>
                      <p className="text-xs text-emerald-400 font-bold">{revenue.toLocaleString('fa-IR')}</p>
                    </div>
                    <div className="bg-surface-elevated/60 rounded-lg py-1.5 px-1">
                      <p className="text-[10px] text-fg-muted">هزینه/سیکل</p>
                      <p className="text-xs text-red-400 font-bold">{expenses.toLocaleString('fa-IR')}</p>
                    </div>
                    <div className="bg-surface-elevated/60 rounded-lg py-1.5 px-1">
                      <p className="text-[10px] text-fg-muted">سود خالص</p>
                      <MoneyDisplay amount={net} size="sm" showSign />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button fullWidth size="sm" variant="secondary">
                      <span className="flex items-center justify-center gap-1">
                        <Briefcase size={14} /> مدیریت
                      </span>
                    </Button>
                    <Button fullWidth size="sm" variant="success">
                      <span className="flex items-center justify-center gap-1">
                        <ArrowUpCircle size={14} /> ارتقا
                      </span>
                    </Button>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===================== روند بازار ===================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">روند بازار</h2>
          <Link href="/market" className="text-xs text-indigo-400 hover:text-indigo-300">
            <ShoppingCart size={14} className="inline me-1" />
            ورود به بازار
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {topProducts.map((prod) => {
            const change = (((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100).toFixed(0);
            const isUp = prod.currentPrice >= prod.basePrice;
            const demand = demandLabel(prod.supply, prod.demand);
            const supply = supplyLabel(prod.supply, prod.demand);

            return (
              <Card key={prod.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{prod.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{prod.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-amber-400 font-fa text-xs font-bold">
                        {prod.currentPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className={`text-[10px] font-medium ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isUp ? '+' : ''}{change}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-fg-muted">تقاضا: <span className={demand.color}>{demand.text}</span></span>
                  <span className="text-fg-muted">عرضه: <span className={supply.color}>{supply.text}</span></span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ===================== ماموریت‌های روزانه ===================== */}
      <div>
        <h2 className="font-bold text-sm mb-3">ماموریت‌های روزانه</h2>
        <Card className="space-y-2">
          {dailyTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              {task.done ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={16} className="text-fg-faint shrink-0" />
              )}
              <span className={`text-xs ${task.done ? 'text-fg-muted line-through' : 'text-fg-secondary'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* ===================== وضعیت شخصی (مینیمال) ===================== */}
      <div>
        <h2 className="font-bold text-sm mb-3">وضعیت شخصی</h2>
        <Card className="flex items-center justify-around py-3">
          {[
            { icon: '😊', value: player.stats.happiness, label: 'شادی' },
            { icon: '🍔', value: player.stats.hunger, label: 'گرسنگی' },
            { icon: '⚡', value: player.stats.energy, label: 'انرژی' },
            { icon: '🧠', value: player.stats.intelligence, label: 'هوش' },
            { icon: '⭐', value: player.stats.experience, label: 'تجربه' },
          ].map((stat) => (
            <Link key={stat.label} href="/profile" className="flex flex-col items-center gap-0.5 group">
              <span className="text-lg group-hover:scale-110 transition-transform">{stat.icon}</span>
              <span className="text-xs font-bold text-fg">{stat.value}</span>
              <span className="text-[9px] text-fg-faint">{stat.label}</span>
            </Link>
          ))}
        </Card>
      </div>

      {/* ===================== دکمه اصلی شناور ===================== */}
      <Link href="/business" className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40">
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 active:scale-95 transition-all flex items-center gap-2">
          <Briefcase size={18} />
          مدیریت کسب‌وکارها
        </button>
      </Link>
    </div>
  );
}
