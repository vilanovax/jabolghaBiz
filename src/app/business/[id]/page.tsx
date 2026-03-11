'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import { businessTemplates } from '@/data/mock';
import {
  ArrowUpCircle, Users, Package, ChevronRight,
  Lock, Unlock, Clock, Coins,
} from 'lucide-react';
import Link from 'next/link';

type Tab = 'overview' | 'employees' | 'products';

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const biz = useGameStore((s) => s.businesses.find((b) => b.id === id));
  const balance = useGameStore((s) => s.player.balance);
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const unlockProduct = useGameStore((s) => s.unlockProduct);
  const tickBusinesses = useGameStore((s) => s.tickBusinesses);

  const [tab, setTab] = useState<Tab>('overview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);

  // تایمر هر ثانیه
  useEffect(() => {
    const interval = setInterval(() => {
      tickBusinesses();
      if (biz) {
        const elapsed = (Date.now() - biz.lastCycleAt) / 1000;
        const remaining = Math.max(0, biz.cycleDuration - (elapsed % biz.cycleDuration));
        setTimeLeft(Math.ceil(remaining));
        setProgress(((biz.cycleDuration - remaining) / biz.cycleDuration) * 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [biz, tickBusinesses]);

  if (!biz) {
    return (
      <div className="py-20 text-center">
        <p className="text-zinc-400">کسب‌وکار یافت نشد</p>
        <Link href="/business" className="text-indigo-400 text-sm mt-2 inline-block">بازگشت</Link>
      </div>
    );
  }

  const template = businessTemplates.find((t) => t.type === biz.type);
  const effectiveRevenue = calcEffectiveRevenue(biz);
  const totalExpenses = calcTotalExpenses(biz);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(biz);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'کلی', icon: Coins },
    { key: 'employees', label: 'نیروها', icon: Users },
    { key: 'products', label: 'محصولات', icon: Package },
  ];

  return (
    <div className="space-y-4 py-4 pb-24">
      {/* هدر */}
      <div className="flex items-center gap-3">
        <Link href="/business" className="text-zinc-500 hover:text-zinc-300">
          <ChevronRight size={20} />
        </Link>
        <span className="text-3xl">{biz.icon}</span>
        <div>
          <h1 className="text-lg font-black">{biz.name}</h1>
          <div className="flex items-center gap-2">
            <Badge text={`سطح ${biz.level}`} color="#6366f1" />
            <span className="text-[10px] text-zinc-500">{biz.initialEquipment}</span>
          </div>
        </div>
      </div>

      {/* تایمر دایره‌ای + جمع‌آوری */}
      <Card glow={biz.pendingRevenue > 0 ? '#10b981' : '#3f3f46'} className="text-center py-5">
        {/* progress ring */}
        <div className="relative w-28 h-28 mx-auto mb-3">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={biz.pendingRevenue > 0 ? '#10b981' : '#6366f1'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.64} 264`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Clock size={14} className="text-zinc-500 mb-0.5" />
            <span className="text-lg font-black font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {biz.pendingRevenue > 0 ? (
          <button
            onClick={() => collectRevenue(biz.id)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-all animate-pulse-glow"
          >
            جمع‌آوری {biz.pendingRevenue.toLocaleString('fa-IR')} تومان
          </button>
        ) : (
          <p className="text-xs text-zinc-500">
            {isAuto ? 'درآمد اتوماتیک فعال است' : 'در انتظار سیکل بعدی...'}
          </p>
        )}

        {isAuto && (
          <p className="text-[10px] text-emerald-400 mt-1">🧮 حسابدار فعال — جمع‌آوری خودکار</p>
        )}
      </Card>

      {/* آمار مالی */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center py-2">
          <p className="text-[10px] text-zinc-500">درآمد/سیکل</p>
          <p className="text-xs text-emerald-400 font-bold">{effectiveRevenue.toLocaleString('fa-IR')}</p>
        </Card>
        <Card className="text-center py-2">
          <p className="text-[10px] text-zinc-500">هزینه/سیکل</p>
          <p className="text-xs text-red-400 font-bold">{totalExpenses.toLocaleString('fa-IR')}</p>
        </Card>
        <Card className="text-center py-2">
          <p className="text-[10px] text-zinc-500">سود خالص</p>
          <MoneyDisplay amount={netProfit} size="sm" showSign />
        </Card>
      </div>

      {/* تب‌ها */}
      <div className="flex bg-zinc-800/50 rounded-xl p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ==================== تب کلی ==================== */}
      {tab === 'overview' && (
        <div className="space-y-3">
          <Card className="space-y-2">
            <p className="text-xs font-bold">اطلاعات شرکت</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
              <span>مدت سیکل: <span className="text-white">{biz.cycleDuration} ثانیه</span></span>
              <span>حداکثر انباشت: <span className="text-white">{biz.maxPendingCycles} سیکل</span></span>
              <span>تعداد نیرو: <span className="text-white">{biz.employees.length}</span></span>
              <span>محصولات فعال: <span className="text-white">{biz.products.filter((p) => p.unlocked).length}/{biz.products.length}</span></span>
            </div>
          </Card>

          <Button
            onClick={() => upgradeBusiness(biz.id)}
            disabled={balance < biz.upgradeCost}
            fullWidth
            variant="success"
          >
            <span className="flex items-center justify-center gap-1.5">
              <ArrowUpCircle size={16} />
              ارتقا به سطح {biz.level + 1} — {biz.upgradeCost.toLocaleString('fa-IR')} تومان
            </span>
          </Button>
        </div>
      )}

      {/* ==================== تب نیروها ==================== */}
      {tab === 'employees' && (
        <div className="space-y-3">
          {/* نیروهای فعلی */}
          {biz.employees.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2 text-zinc-400">نیروهای فعلی</p>
              {biz.employees.map((emp) => (
                <Card key={emp.id} className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{emp.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{emp.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      {emp.roleName}
                      {emp.revenueBoost > 0 && ` · +${(emp.revenueBoost * 100).toFixed(0)}% درآمد`}
                      {emp.autoCollect && ' · جمع‌آوری خودکار'}
                    </p>
                  </div>
                  <span className="text-[10px] text-red-400">حقوق: {emp.salary.toLocaleString('fa-IR')}</span>
                </Card>
              ))}
            </div>
          )}

          {/* استخدام */}
          <p className="text-xs font-bold text-zinc-400">استخدام نیروی جدید</p>
          {template?.availableEmployees.map((et) => {
            const alreadyHired = biz.employees.some((e) => e.templateId === et.id);
            const canAfford = balance >= et.hireCost;
            return (
              <Card
                key={et.id}
                className={`space-y-2 ${alreadyHired ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{et.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{et.name}</p>
                    <p className="text-[10px] text-zinc-500">{et.description}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">
                      حقوق: {et.salary.toLocaleString('fa-IR')}/سیکل
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => hireEmployee(biz.id, et)}
                  disabled={alreadyHired || !canAfford}
                  fullWidth
                  size="sm"
                  variant={alreadyHired ? 'secondary' : 'primary'}
                >
                  {alreadyHired ? 'استخدام شده' : `استخدام — ${et.hireCost.toLocaleString('fa-IR')} تومان`}
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {/* ==================== تب محصولات ==================== */}
      {tab === 'products' && (
        <div className="space-y-3">
          {biz.products.map((prod) => (
            <Card key={prod.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{prod.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{prod.name}</p>
                    {prod.unlocked ? (
                      <Unlock size={12} className="text-emerald-400" />
                    ) : (
                      <Lock size={12} className="text-zinc-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500">{prod.description}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">
                    +{prod.revenueBoost.toLocaleString('fa-IR')} تومان/سیکل
                  </p>
                </div>
              </div>
              {!prod.unlocked && (
                <Button
                  onClick={() => unlockProduct(biz.id, prod.id)}
                  disabled={balance < prod.unlockCost}
                  fullWidth
                  size="sm"
                >
                  آنلاک — {prod.unlockCost.toLocaleString('fa-IR')} تومان
                </Button>
              )}
              {prod.unlocked && (
                <p className="text-[10px] text-emerald-400 text-center font-medium">فعال</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
