'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Button from '@/components/ui/Button';
import { Store, Zap } from 'lucide-react';
import { BOOST_ITEMS, BOOST_CONFIG } from '@/data/mock';

const effectLabels: Record<string, string> = {
  happiness: 'شادی',
  hunger: 'گرسنگی',
  energy: 'انرژی',
  intelligence: 'هوش',
  experience: 'تجربه',
};

export default function FridayMarketPage() {
  const player = useGameStore((s) => s.player);
  const fridayMarket = useGameStore((s) => s.fridayMarket);
  const buyFridayItem = useGameStore((s) => s.buyFridayItem);
  const boosts = useGameStore((s) => s.boosts);
  const buyProductionBoost = useGameStore((s) => s.buyProductionBoost);

  const now = Date.now();
  const hasActiveBoost = boosts.activeBoosts.some((b) => b.expiresAt > now);
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = boosts.lastResetDate === today
    ? Object.values(boosts.purchaseCount).reduce((s, c) => s + c, 0)
    : 0;
  const productionBoosts = BOOST_ITEMS.filter((b) => b.category === 'production');

  return (
    <div className="space-y-5 py-3 pb-24">
      {/* Header */}
      <div className="relative text-center py-5">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-[#22C55E]/8 blur-[80px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 border border-[#22C55E]/20 mb-2">
            <Store size={26} className="text-[#22C55E]" />
          </div>
          <h1 className="text-xl font-black text-fg">بازار جمعه</h1>
          <p className="text-[10px] text-fg-muted mt-1">آیتم‌های ویژه برای تقویت وضعیت شما</p>
        </div>
      </div>

      {/* بوسترها */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-[#F59E0B]" />
          <h2 className="font-bold text-sm">بوسترها</h2>
          <span className="text-[9px] text-fg-faint bg-surface-card px-2 py-0.5 rounded-full font-fa font-bold">
            {todayCount}/{BOOST_CONFIG.dailyPurchaseLimit} روزانه
          </span>
          {hasActiveBoost && (
            <span className="text-[9px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full font-bold">فعال</span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {productionBoosts.map((item) => {
            const levelOk = !item.unlockLevel || player.level >= item.unlockLevel;
            const canAfford = player.balance >= item.price;
            const limitOk = todayCount < BOOST_CONFIG.dailyPurchaseLimit;
            const canBuy = levelOk && canAfford && limitOk && !hasActiveBoost;

            return (
              <div
                key={item.id}
                className={`rounded-[16px] border p-3 text-center transition-all ${
                  canBuy
                    ? 'bg-[#F59E0B]/5 border-[#F59E0B]/20'
                    : 'bg-surface-card/30 border-line-subtle opacity-50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-[10px] font-bold mt-1">{item.name}</p>
                <p className="text-[8px] text-fg-muted mt-0.5">×{item.productionMultiplier} • {(item.durationMs ?? 0) / 60000}min</p>
                <div className="mt-1.5 mb-2">
                  <MoneyDisplay amount={item.price} size="sm" />
                </div>
                {!levelOk ? (
                  <p className="text-[8px] text-fg-faint">🔒 سطح {item.unlockLevel}</p>
                ) : (
                  <button
                    onClick={() => buyProductionBoost(item.id)}
                    disabled={!canBuy}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                      canBuy
                        ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white'
                        : 'bg-surface-card text-fg-faint'
                    }`}
                  >
                    {hasActiveBoost ? 'فعاله' : !canAfford ? 'کمبود' : !limitOk ? 'سقف' : 'فعال کن'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* آیتم‌ها */}
      <div className="flex items-center gap-2 mb-0">
        <Store size={16} className="text-[#22C55E]" />
        <h2 className="font-bold text-sm">آیتم‌های وضعیت</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fridayMarket.map((item) => {
          const canAfford = player.balance >= item.price;
          const effects = Object.entries(item.effect)
            .map(([k, v]) => {
              const val = v as number;
              return `${effectLabels[k] || k} ${val > 0 ? '+' : ''}${val}`;
            })
            .join('، ');

          return (
            <div
              key={item.id}
              className={`
                relative rounded-[18px] bg-surface-card/60 border border-line-subtle p-3.5
                shadow-[var(--shadow-card)] transition-all overflow-hidden
                ${!item.available ? 'opacity-40' : ''}
              `}
            >
              <div className="text-center mb-2.5">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-xs font-black mt-1.5">{item.name}</p>
                <div className="mt-1">
                  <MoneyDisplay amount={item.price} size="sm" />
                </div>
                <p className="text-[10px] text-fg-muted mt-1">{effects}</p>
              </div>
              <Button
                onClick={() => buyFridayItem(item.id)}
                disabled={!item.available || !canAfford}
                fullWidth
                size="sm"
                variant={item.available && canAfford ? 'success' : 'secondary'}
              >
                {!item.available ? 'تمام شد' : canAfford ? 'خرید' : 'موجودی کم'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
