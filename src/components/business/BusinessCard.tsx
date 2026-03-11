'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Business } from '@/types';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant } from '@/store/gameStore';
import { Users, Clock, ArrowUpCircle, Coins } from 'lucide-react';
import Link from 'next/link';

const typeLabels: Record<string, string> = {
  farming: 'مزرعه',
  factory: 'کارخانه',
  supermarket: 'سوپرمارکت',
  restaurant: 'رستوران',
  app_startup: 'استارتاپ',
  transport: 'حمل‌ونقل',
};

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const tickBusinesses = useGameStore((s) => s.tickBusinesses);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const effectiveRevenue = calcEffectiveRevenue(business);
  const totalExpenses = calcTotalExpenses(business);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(business);

  useEffect(() => {
    const interval = setInterval(() => {
      tickBusinesses();
      const elapsed = (Date.now() - business.lastCycleAt) / 1000;
      const remaining = Math.max(0, business.cycleDuration - (elapsed % business.cycleDuration));
      setTimeLeft(Math.ceil(remaining));
      setProgress(((business.cycleDuration - remaining) / business.cycleDuration) * 100);
    }, 1000);
    return () => clearInterval(interval);
  }, [business, tickBusinesses]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/business/${business.id}`}>
      <Card className="space-y-3" glow={business.pendingRevenue > 0 ? '#10b981' : undefined}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{business.icon}</span>
            <div>
              <h3 className="font-bold text-white">{business.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge text={`سطح ${business.level}`} color="#6366f1" />
                <span className="text-xs text-zinc-500">{typeLabels[business.type] || business.type}</span>
              </div>
            </div>
          </div>
          {/* mini timer */}
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock size={12} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* progress bar */}
        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              backgroundColor: business.pendingRevenue > 0 ? '#10b981' : '#6366f1',
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-900/50 rounded-xl p-2">
            <p className="text-[10px] text-zinc-500 mb-0.5">درآمد/سیکل</p>
            <p className="text-xs text-emerald-400 font-bold">{effectiveRevenue.toLocaleString('fa-IR')}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-2">
            <p className="text-[10px] text-zinc-500 mb-0.5">هزینه/سیکل</p>
            <p className="text-xs text-red-400 font-bold">{totalExpenses.toLocaleString('fa-IR')}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-xl p-2">
            <p className="text-[10px] text-zinc-500 mb-0.5">سود خالص</p>
            <MoneyDisplay amount={netProfit} size="sm" showSign />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {business.employees.length} نیرو
          </span>
          <span className="flex items-center gap-1">
            <Coins size={14} />
            {business.products.filter((p) => p.unlocked).length}/{business.products.length} محصول
          </span>
          {isAuto && <span className="text-emerald-400 text-[10px]">🧮 خودکار</span>}
        </div>

        {business.pendingRevenue > 0 && (
          <div onClick={(e) => e.preventDefault()}>
            <Button
              onClick={() => collectRevenue(business.id)}
              fullWidth
              variant="success"
              size="sm"
            >
              <span className="flex items-center justify-center gap-1.5">
                جمع‌آوری {business.pendingRevenue.toLocaleString('fa-IR')} تومان
              </span>
            </Button>
          </div>
        )}
      </Card>
    </Link>
  );
}
