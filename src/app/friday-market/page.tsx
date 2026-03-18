'use client';

import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Button from '@/components/ui/Button';
import { Store } from 'lucide-react';

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

      {/* Items */}
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
