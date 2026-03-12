'use client';

import { useState } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses } from '@/store/gameStore';
import BusinessCard from '@/components/business/BusinessCard';
import NewBusinessModal from '@/components/business/NewBusinessModal';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function BusinessPage() {
  const businesses = useGameStore((s) => s.businesses);
  const [showNewBiz, setShowNewBiz] = useState(false);

  const totalRevenue = businesses.reduce((sum, b) => sum + calcEffectiveRevenue(b), 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);

  return (
    <div className="space-y-4 py-4 pb-24">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">کسب‌وکارهای من</h1>
        <Button onClick={() => setShowNewBiz(true)} size="sm">
          <span className="flex items-center gap-1">
            <Plus size={16} /> جدید
          </span>
        </Button>
      </div>

      {/* خلاصه — نوار افقی فشرده با ایموجی */}
      {businesses.length > 0 && (
        <div className="flex items-center justify-between bg-surface-card/50 rounded-xl px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">📈</span>
            <span className="text-[11px] text-fg-secondary">سود:</span>
            <span className={`text-[11px] font-fa font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('fa-IR')}
            </span>
          </div>
          <div className="w-px h-4 bg-surface-inset" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs">💸</span>
            <span className="text-[11px] text-fg-secondary">هزینه:</span>
            <span className="text-[11px] text-red-400 font-fa font-bold">{totalExpenses.toLocaleString('fa-IR')}</span>
          </div>
          <div className="w-px h-4 bg-surface-inset" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs">👥</span>
            <span className="text-[11px] text-fg-secondary font-bold font-fa">{totalEmployees.toLocaleString('fa-IR')}</span>
            <span className="text-[11px] text-fg-secondary">نفر</span>
          </div>
        </div>
      )}

      {/* لیست کسب‌وکارها */}
      <div className="space-y-3">
        {businesses.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-4xl mb-3">🚀</p>
            <p className="text-sm text-fg-secondary font-bold">هنوز کسب‌وکاری ندارید</p>
            <p className="text-xs text-fg-faint mt-1">اولین کسب‌وکارتان را راه‌اندازی کنید و شروع به کسب درآمد کنید!</p>
            <div className="mt-5">
              <Button onClick={() => setShowNewBiz(true)} size="lg">
                <span className="flex items-center gap-2">
                  🚀 راه‌اندازی کسب‌وکار
                </span>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {businesses.map((biz) => <BusinessCard key={biz.id} business={biz} />)}

            {/* دکمه ساخت کسب‌وکار جدید */}
            <button
              onClick={() => setShowNewBiz(true)}
              className="w-full border-2 border-dashed border-line hover:border-indigo-500 rounded-2xl py-4 text-fg-muted hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
            >
              🚀 راه‌اندازی کسب‌وکار جدید
            </button>
          </>
        )}
      </div>

      {showNewBiz && <NewBusinessModal onClose={() => setShowNewBiz(false)} />}
    </div>
  );
}
