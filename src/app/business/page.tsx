'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import BusinessCard from '@/components/business/BusinessCard';
import NewBusinessModal from '@/components/business/NewBusinessModal';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function BusinessPage() {
  const businesses = useGameStore((s) => s.businesses);
  const [showNewBiz, setShowNewBiz] = useState(false);

  const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + b.expenses, 0);
  const totalProfit = businesses.reduce((sum, b) => sum + b.profit, 0);
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);

  return (
    <div className="space-y-5 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">کسب‌وکارهای من</h1>
        <Button onClick={() => setShowNewBiz(true)} size="sm">
          <span className="flex items-center gap-1">
            <Plus size={16} /> جدید
          </span>
        </Button>
      </div>

      {/* خلاصه */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="flex items-center gap-2 p-3">
          <TrendingUp size={16} className="text-emerald-400" />
          <div>
            <p className="text-[10px] text-zinc-500">درآمد</p>
            <MoneyDisplay amount={totalRevenue} size="sm" />
          </div>
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <DollarSign size={16} className="text-amber-400" />
          <div>
            <p className="text-[10px] text-zinc-500">سود</p>
            <MoneyDisplay amount={totalProfit} size="sm" showSign />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Users size={14} /> {totalEmployees} کارمند
        </span>
        <span>هزینه‌ها: {totalExpenses.toLocaleString('fa-IR')}/روز</span>
      </div>

      {/* لیست کسب‌وکارها */}
      <div className="space-y-3">
        {businesses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-3xl mb-2">🏗️</p>
            <p className="text-sm text-zinc-400">هنوز کسب‌وکاری ندارید</p>
            <p className="text-xs text-zinc-600 mt-1">اولین کسب‌وکارتان را بسازید و شروع به کسب درآمد کنید!</p>
            <div className="mt-4">
              <Button onClick={() => setShowNewBiz(true)}>
                <span className="flex items-center gap-1">
                  <Plus size={16} /> ساخت کسب‌وکار
                </span>
              </Button>
            </div>
          </Card>
        ) : (
          businesses.map((biz) => <BusinessCard key={biz.id} business={biz} />)
        )}
      </div>

      {showNewBiz && <NewBusinessModal onClose={() => setShowNewBiz(false)} />}
    </div>
  );
}
