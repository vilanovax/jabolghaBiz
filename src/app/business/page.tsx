'use client';

import { useState } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses } from '@/store/gameStore';
import BusinessCard from '@/components/business/BusinessCard';
import NewBusinessModal from '@/components/business/NewBusinessModal';
import { Plus, TrendingUp, TrendingDown, Users, Zap, Lock } from 'lucide-react';

export default function BusinessPage() {
  const businesses = useGameStore((s) => s.businesses);
  const player = useGameStore((s) => s.player);
  const [showNewBiz, setShowNewBiz] = useState(false);

  const totalRevenue = businesses.reduce((sum, b) => sum + calcEffectiveRevenue(b), 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + calcTotalExpenses(b), 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);

  // Empire mood
  const mood =
    businesses.length === 0
      ? null
      : totalProfit > 0
        ? { label: 'سودده', color: '#22C55E', bg: 'rgba(34,197,94,0.10)', icon: '📈' }
        : totalProfit === 0
          ? { label: 'لب مرز', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', icon: '⚠️' }
          : { label: 'ضررده', color: '#EF4444', bg: 'rgba(239,68,68,0.10)', icon: '📉' };

  // Can create new business? (simple level gate example)
  const maxBusinesses = Math.max(1, Math.floor(player.level / 2) + 1);
  const canCreate = businesses.length < maxBusinesses;

  return (
    <div className="space-y-4 py-4 pb-24">

      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black">کسب‌وکارهای من</h1>
          <p className="text-[10px] text-fg-muted mt-0.5">
            {businesses.length} از {maxBusinesses} شرکت فعال
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowNewBiz(true)}
            className="flex items-center gap-1.5 text-[11px] font-black text-white bg-gradient-to-l from-[#6366F1] to-[#8B5CF6] px-3 py-2 rounded-full active:scale-95 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.3)]"
          >
            <Plus size={14} />
            جدید
          </button>
        )}
      </div>

      {/* ---- Summary Strip ---- */}
      {businesses.length > 0 && mood && (
        <div
          className="rounded-[16px] px-4 py-3 border"
          style={{ background: mood.bg, borderColor: `${mood.color}25` }}
        >
          <div className="flex items-center justify-between">
            {/* Mood + profit */}
            <div className="flex items-center gap-2">
              <span className="text-base">{mood.icon}</span>
              <div>
                <p className="text-[8px] text-fg-muted">وضعیت امپراتوری</p>
                <p className="text-xs font-black" style={{ color: mood.color }}>{mood.label}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-[8px] text-fg-muted">سود/سیکل</p>
                <div className="flex items-center gap-0.5">
                  {totalProfit >= 0
                    ? <TrendingUp size={10} className="text-[#22C55E]" />
                    : <TrendingDown size={10} className="text-[#EF4444]" />
                  }
                  <p className={`text-[11px] font-black font-fa ${totalProfit >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString('fa-IR')}
                  </p>
                </div>
              </div>
              <div className="w-px h-6 bg-line-subtle" />
              <div className="text-center">
                <p className="text-[8px] text-fg-muted">کارمند</p>
                <div className="flex items-center gap-0.5 justify-center">
                  <Users size={10} className="text-fg-faint" />
                  <p className="text-[11px] font-black font-fa">{totalEmployees}</p>
                </div>
              </div>
              <div className="w-px h-6 bg-line-subtle" />
              <div className="text-center">
                <p className="text-[8px] text-fg-muted">هزینه</p>
                <p className="text-[11px] font-black font-fa text-[#EF4444]">
                  {totalExpenses.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Business List ---- */}
      <div className="space-y-3">
        {businesses.length === 0 ? (
          /* ---- Empty state ---- */
          <div className="text-center py-12 space-y-3">
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-[24px] flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}
              >
                🚀
              </div>
            </div>
            <div>
              <p className="text-sm font-black">امپراتوری‌ات رو شروع کن</p>
              <p className="text-[11px] text-fg-muted mt-1">اولین کسب‌وکارت رو راه‌اندازی کن و شروع به کسب درآمد کن!</p>
            </div>
            <button
              onClick={() => setShowNewBiz(true)}
              className="inline-flex items-center gap-2 text-sm font-black text-white bg-gradient-to-l from-[#6366F1] to-[#8B5CF6] px-6 py-3 rounded-full active:scale-95 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
            >
              <Zap size={16} />
              راه‌اندازی کسب‌وکار
            </button>
          </div>
        ) : (
          <>
            {businesses.map((biz, i) => <BusinessCard key={biz.id} business={biz} index={i} />)}

            {/* ---- Launch Card ---- */}
            {canCreate ? (
              <button
                onClick={() => setShowNewBiz(true)}
                className="w-full active:scale-[0.98] transition-transform"
              >
                <div
                  className="rounded-[20px] px-4 py-5 flex items-center gap-4 border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
                    border: '1px dashed rgba(99,102,241,0.35)',
                    boxShadow: '0 0 20px rgba(99,102,241,0.06)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' }}
                  >
                    🚀
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm font-black text-[#6366F1]">راه‌اندازی کسب‌وکار جدید</p>
                    <p className="text-[10px] text-fg-muted mt-0.5">بازار جدیدت رو فتح کن</p>
                  </div>
                  <Plus size={18} className="text-[#6366F1] shrink-0" />
                </div>
              </button>
            ) : (
              /* ---- Locked: max businesses reached ---- */
              <div
                className="rounded-[20px] px-4 py-5 flex items-center gap-4 opacity-60"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px dashed rgba(150,150,150,0.25)',
                }}
              >
                <div className="w-12 h-12 rounded-[14px] bg-surface-inset/50 flex items-center justify-center shrink-0">
                  <Lock size={20} className="text-fg-faint" />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-black text-fg-muted">کسب‌وکار جدید قفل است</p>
                  <p className="text-[10px] text-fg-faint mt-0.5">
                    در LV {(businesses.length) * 2 + 1} باز می‌شود
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showNewBiz && <NewBusinessModal onClose={() => setShowNewBiz(false)} />}
    </div>
  );
}
