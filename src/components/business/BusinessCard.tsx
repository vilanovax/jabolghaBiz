'use client';

import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Business } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { Users, TrendingUp, ArrowUpCircle } from 'lucide-react';

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
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const balance = useGameStore((s) => s.player.balance);
  const canUpgrade = balance >= business.upgradeCost;

  return (
    <Card className="space-y-3">
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
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-zinc-900/50 rounded-xl p-2">
          <p className="text-[10px] text-zinc-500 mb-0.5">درآمد</p>
          <MoneyDisplay amount={business.revenue} size="sm" />
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-2">
          <p className="text-[10px] text-zinc-500 mb-0.5">هزینه‌ها</p>
          <span className="text-sm text-red-400 font-mono">{business.expenses.toLocaleString('fa-IR')}</span>
        </div>
        <div className="bg-zinc-900/50 rounded-xl p-2">
          <p className="text-[10px] text-zinc-500 mb-0.5">سود</p>
          <MoneyDisplay amount={business.profit} size="sm" showSign />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {business.employees.length} کارمند
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp size={14} />
          ظرفیت: {business.productionCapacity}
        </span>
      </div>

      <Button
        onClick={() => upgradeBusiness(business.id)}
        disabled={!canUpgrade}
        fullWidth
        variant="success"
        size="sm"
      >
        <span className="flex items-center justify-center gap-1.5">
          <ArrowUpCircle size={16} />
          ارتقا — {new Intl.NumberFormat('fa-IR').format(business.upgradeCost)}
        </span>
      </Button>
    </Card>
  );
}
