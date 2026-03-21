'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { LIFE_ACTIONS, STAT_GAMEPLAY_EFFECTS } from '@/data/mock';
import { Clock, AlertTriangle } from 'lucide-react';

const STATS = [
  { key: 'energy' as const,    label: 'انرژی',    icon: '⚡', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'  },
  { key: 'happiness' as const, label: 'شادی',     icon: '😊', color: '#EC4899', bg: 'rgba(236,72,153,0.1)'  },
  { key: 'hunger' as const,    label: 'گرسنگی',   icon: '🍔', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
];

// آموزش (intelligence/experience) رو از لیست حذف می‌کنیم — بازی ساده‌تره
const VISIBLE_ACTIONS = LIFE_ACTIONS.filter((a) => a.category !== 'education');

function formatCooldown(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}ث`;
}

export default function LifePage() {
  const player = useGameStore((s) => s.player);
  const performLifeAction = useGameStore((s) => s.performLifeAction);
  const getActionCooldownLeft = useGameStore((s) => s.getActionCooldownLeft);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const { stats } = player;

  return (
    <div className="space-y-4 py-4 pb-24">
      <h1 className="text-lg font-black">زندگی</h1>

      {/* ---- ۳ آمار اصلی ---- */}
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => {
          const value = stats[s.key];
          const barPct = s.key === 'hunger' ? 100 - value : value;
          const isWarn = s.key === 'energy' ? value < 20
            : s.key === 'hunger' ? value > 80
            : value < 30;
          const isBoost = s.key === 'energy' ? value > 80
            : s.key === 'hunger' ? false
            : value > 70;
          const borderColor = isWarn ? `${s.color}60` : isBoost ? '#22C55E60' : `${s.color}25`;
          const bg = isWarn ? `${s.color}15` : isBoost ? 'rgba(34,197,94,0.08)' : s.bg;
          return (
            <div
              key={s.key}
              className="rounded-[18px] p-3 text-center"
              style={{ background: bg, border: `1px solid ${borderColor}` }}
            >
              <span className="text-2xl">{s.icon}</span>
              <p
                className={`text-[22px] font-black font-fa leading-none mt-1 ${isWarn ? 'animate-warning-pulse' : ''}`}
                style={{ color: isBoost ? '#22C55E' : s.color }}
              >
                {value}
              </p>
              <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
              <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barPct}%`, backgroundColor: isBoost ? '#22C55E' : isWarn ? '#EF4444' : s.color }}
                />
              </div>
              {isBoost && <p className="text-[7px] text-[#22C55E] font-bold mt-1">● بوست فعال</p>}
              {isWarn && <p className="text-[7px] text-[#EF4444] font-bold mt-1">● جریمه فعال</p>}
            </div>
          );
        })}
      </div>

      {/* ---- وضعیت فعال (مثبت + منفی) ---- */}
      <div className="flex flex-wrap gap-1.5">
        {stats.energy > 80 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[10px] text-[#22C55E] font-bold">
            ⚡ سرعت تولید +۱۰٪
          </div>
        )}
        {stats.happiness > 70 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20 text-[10px] text-[#EC4899] font-bold">
            😊 درآمد +۱۰٪
          </div>
        )}
        {stats.energy < 20 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#3B82F6]/8 border border-[#3B82F6]/20 text-[10px] text-[#3B82F6] font-bold">
            <AlertTriangle size={11} /> سرعت تولید ۱۵٪ کمتره
          </div>
        )}
        {stats.hunger > 80 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#F59E0B]/8 border border-[#F59E0B]/20 text-[10px] text-[#F59E0B] font-bold">
            <AlertTriangle size={11} /> درآمد ۵٪ کمتره
          </div>
        )}
        {stats.happiness < 30 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#EC4899]/8 border border-[#EC4899]/20 text-[10px] text-[#EC4899] font-bold">
            <AlertTriangle size={11} /> درآمد ۱۰٪ کمتره
          </div>
        )}
        {stats.energy >= 20 && stats.energy <= 80 && stats.hunger <= 80 && stats.happiness >= 30 && stats.energy <= 80 && stats.happiness <= 70 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-card/50 border border-line-subtle text-[10px] text-fg-muted">
            ⚖️ وضعیت عادی — هیچ افکت فعالی نیست
          </div>
        )}
      </div>

      {/* ---- اکشن‌ها — گرید ۲ ستونه ---- */}
      <div className="grid grid-cols-2 gap-2">
        {VISIBLE_ACTIONS.map((action) => {
          const cooldown = getActionCooldownLeft(action.id);
          const onCooldown = cooldown > 0;
          const canAfford = player.balance >= action.cost;
          const disabled = onCooldown || !canAfford;

          // مهم‌ترین اثر روی ۳ آمار اصلی
          const mainEntry = Object.entries(action.effect)
            .filter(([k]) => ['energy', 'happiness', 'hunger'].includes(k))
            .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))[0];
          const statInfo = mainEntry ? STATS.find((s) => s.key === mainEntry[0]) : null;
          const effectVal = mainEntry ? (mainEntry[1] as number) : 0;
          const isGood = mainEntry
            ? (mainEntry[0] === 'hunger' ? effectVal < 0 : effectVal > 0)
            : true;

          return (
            <button
              key={action.id}
              onClick={() => performLifeAction(action.id)}
              disabled={disabled}
              className="flex flex-col items-center gap-2 p-3 rounded-[16px] border transition-all active:scale-[0.97] disabled:opacity-45 text-center"
              style={{
                background: statInfo && !onCooldown ? statInfo.bg : 'transparent',
                borderColor: statInfo && !onCooldown ? `${statInfo.color}25` : 'rgba(212,212,216,0.3)',
              }}
            >
              <span className="text-3xl">{action.icon}</span>
              <p className="text-[12px] font-black text-fg leading-tight">{action.name}</p>

              {onCooldown ? (
                <div className="flex items-center gap-1 text-fg-faint text-[10px]">
                  <Clock size={10} />
                  <span className="font-mono font-bold">{formatCooldown(cooldown)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {statInfo && (
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{
                        color: isGood ? statInfo.color : '#EF4444',
                        background: isGood ? `${statInfo.color}18` : 'rgba(239,68,68,0.1)',
                      }}
                    >
                      {statInfo.icon} {effectVal > 0 ? '+' : ''}{effectVal}
                    </span>
                  )}
                  {action.cost > 0 && (
                    <span className="text-[9px] text-fg-muted font-fa">
                      {action.cost.toLocaleString('fa-IR')}﷼
                    </span>
                  )}
                  {action.cost === 0 && (
                    <span className="text-[9px] text-[#22C55E] font-bold">رایگان</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
