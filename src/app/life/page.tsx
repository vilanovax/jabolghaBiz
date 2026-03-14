'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { LIFE_ACTIONS, STAT_GAMEPLAY_EFFECTS } from '@/data/mock';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import StatBar from '@/components/ui/StatBar';
import {
  Heart, Utensils, BedDouble, GraduationCap, Dumbbell, Gamepad2,
  ShoppingBag, Clock, Zap, TrendingUp, TrendingDown, AlertTriangle,
} from 'lucide-react';
import type { LifeActionCategory } from '@/types';

const categoryConfig: Record<LifeActionCategory, { label: string; icon: typeof Heart; color: string }> = {
  food: { label: 'غذا', icon: Utensils, color: '#F59E0B' },
  rest: { label: 'استراحت', icon: BedDouble, color: '#3B82F6' },
  education: { label: 'آموزش', icon: GraduationCap, color: '#8B5CF6' },
  fitness: { label: 'ورزش', icon: Dumbbell, color: '#22C55E' },
  entertainment: { label: 'سرگرمی', icon: Gamepad2, color: '#EC4899' },
};

const statConfig = [
  { key: 'happiness' as const, label: 'شادی', icon: '😊', color: '#EC4899' },
  { key: 'hunger' as const, label: 'گرسنگی', icon: '🍔', color: '#F59E0B' },
  { key: 'energy' as const, label: 'انرژی', icon: '⚡', color: '#3B82F6' },
  { key: 'intelligence' as const, label: 'هوش', icon: '🧠', color: '#8B5CF6' },
  { key: 'experience' as const, label: 'تجربه', icon: '⭐', color: '#22C55E' },
];

function formatCooldown(ms: number): string {
  if (ms <= 0) return '';
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}ث`;
}

export default function LifePage() {
  const player = useGameStore((s) => s.player);
  const performLifeAction = useGameStore((s) => s.performLifeAction);
  const getActionCooldownLeft = useGameStore((s) => s.getActionCooldownLeft);
  const fridayMarket = useGameStore((s) => s.fridayMarket);
  const buyFridayItem = useGameStore((s) => s.buyFridayItem);
  const [activeCategory, setActiveCategory] = useState<LifeActionCategory>('food');
  const [, setTick] = useState(0);

  // Force re-render every second for cooldown timers
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const { stats } = player;

  // Active stat effects
  const effects: { label: string; value: string; isGood: boolean }[] = [];
  const energyMult = STAT_GAMEPLAY_EFFECTS.energyCycleMultiplier(stats.energy);
  if (energyMult !== 1.0) {
    effects.push({
      label: 'سرعت سیکل',
      value: energyMult > 1 ? `+${Math.round((energyMult - 1) * 100)}%` : `${Math.round((energyMult - 1) * 100)}%`,
      isGood: energyMult > 1,
    });
  }
  const happyMult = STAT_GAMEPLAY_EFFECTS.happinessRevenueMultiplier(stats.happiness);
  if (happyMult !== 1.0) {
    effects.push({
      label: 'درآمد (شادی)',
      value: happyMult > 1 ? `+${Math.round((happyMult - 1) * 100)}%` : `${Math.round((happyMult - 1) * 100)}%`,
      isGood: happyMult > 1,
    });
  }
  const hungerMult = STAT_GAMEPLAY_EFFECTS.hungerRevenueMultiplier(stats.hunger);
  if (hungerMult !== 1.0) {
    effects.push({
      label: 'درآمد (گرسنگی)',
      value: `${Math.round((hungerMult - 1) * 100)}%`,
      isGood: false,
    });
  }

  const filteredActions = LIFE_ACTIONS.filter((a) => a.category === activeCategory);

  return (
    <div className="space-y-5 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Heart size={22} className="text-[#EC4899]" />
        <h1 className="text-xl font-black">زندگی</h1>
      </div>

      {/* Stat Bars */}
      <div className="space-y-2">
        {statConfig.map((s) => (
          <StatBar
            key={s.key}
            label={s.label}
            value={stats[s.key]}
            max={100}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      {/* Active Effects */}
      {effects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {effects.map((eff) => (
            <div
              key={eff.label}
              className={`flex items-center gap-1 px-2 py-1 rounded-[99px] text-[9px] font-bold ${
                eff.isGood
                  ? 'bg-[#22C55E]/10 text-[#22C55E]'
                  : 'bg-[#EF4444]/10 text-[#EF4444]'
              }`}
            >
              {eff.isGood ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {eff.label}: {eff.value}
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {stats.energy < 20 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#EF4444]/10 border border-[#EF4444]/20 text-[11px] text-[#EF4444] font-bold">
          <AlertTriangle size={14} />
          انرژی خیلی پایینه! سیکل شرکت‌ها ۲۵٪ کندتره.
        </div>
      )}
      {stats.hunger > 80 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[11px] text-[#F59E0B] font-bold">
          <AlertTriangle size={14} />
          خیلی گرسنه‌ای! درآمد ۱۰٪ کمتره.
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key as LifeActionCategory)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[11px] font-bold shrink-0 transition-all ${
                isActive
                  ? 'text-white'
                  : 'bg-surface-card/40 text-fg-muted hover:bg-surface-card/60'
              }`}
              style={isActive ? { backgroundColor: cfg.color } : undefined}
            >
              <Icon size={14} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Actions Grid */}
      <div className="space-y-2">
        {filteredActions.map((action) => {
          const cooldown = getActionCooldownLeft(action.id);
          const onCooldown = cooldown > 0;
          const canAfford = player.balance >= action.cost;
          const disabled = onCooldown || !canAfford;

          return (
            <button
              key={action.id}
              onClick={() => performLifeAction(action.id)}
              disabled={disabled}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-[14px] border transition-all text-right active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 ${
                onCooldown
                  ? 'border-line-subtle bg-surface-card/20'
                  : 'border-line-subtle bg-surface-card/40 hover:bg-surface-card/60'
              }`}
            >
              <span className="text-2xl shrink-0">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{action.name}</p>
                <p className="text-[10px] text-fg-muted mt-0.5">{action.description}</p>
                {/* Effects preview */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.entries(action.effect).map(([key, val]) => {
                    const stat = statConfig.find((s) => s.key === key);
                    const numVal = val as number;
                    // For hunger: positive means more hungry (bad), negative means less hungry (good)
                    const isGood = key === 'hunger' ? numVal < 0 : numVal > 0;
                    return (
                      <span
                        key={key}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[99px] ${
                          isGood ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}
                      >
                        {stat?.icon} {numVal > 0 ? '+' : ''}{numVal}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="shrink-0 text-left">
                {onCooldown ? (
                  <div className="flex items-center gap-1 text-fg-faint">
                    <Clock size={12} />
                    <span className="text-[11px] font-mono font-bold">{formatCooldown(cooldown)}</span>
                  </div>
                ) : action.cost > 0 ? (
                  <MoneyDisplay amount={action.cost} size="sm" />
                ) : (
                  <span className="text-[10px] text-[#22C55E] font-bold">رایگان</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Friday Market */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag size={16} className="text-[#F59E0B]" />
          <h2 className="font-bold text-sm">بازار جمعه</h2>
          <span className="text-[9px] text-fg-faint">آیتم‌های ویژه</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fridayMarket.map((item) => {
            const canBuy = item.available && player.balance >= item.price;
            return (
              <button
                key={item.id}
                onClick={() => buyFridayItem(item.id)}
                disabled={!canBuy}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-[14px] border transition-all active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 ${
                  item.available
                    ? 'border-line-subtle bg-surface-card/40 hover:bg-surface-card/60'
                    : 'border-line-subtle bg-surface-card/20'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-[11px] font-bold">{item.name}</p>
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {Object.entries(item.effect).map(([key, val]) => {
                    const stat = statConfig.find((s) => s.key === key);
                    const numVal = val as number;
                    const isGood = key === 'hunger' ? numVal < 0 : numVal > 0;
                    return (
                      <span
                        key={key}
                        className={`text-[8px] font-bold px-1 py-0.5 rounded-[99px] ${
                          isGood ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                        }`}
                      >
                        {stat?.icon}{numVal > 0 ? '+' : ''}{numVal}
                      </span>
                    );
                  })}
                </div>
                {item.available ? (
                  <MoneyDisplay amount={item.price} size="sm" />
                ) : (
                  <span className="text-[10px] text-fg-faint">ناموجود</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
