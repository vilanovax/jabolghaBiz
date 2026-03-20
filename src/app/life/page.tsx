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
          const isWarn = s.key === 'energy' ? value < 30
            : s.key === 'hunger' ? value > 70
            : value < 30;
          return (
            <div
              key={s.key}
              className="rounded-[18px] p-3 text-center"
              style={{ background: s.bg, border: `1px solid ${s.color}25` }}
            >
              <span className="text-2xl">{s.icon}</span>
              <p
                className={`text-[22px] font-black font-fa leading-none mt-1 ${isWarn ? 'animate-warning-pulse' : ''}`}
                style={{ color: s.color }}
              >
                {value}
              </p>
              <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
              <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${barPct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- هشدارهای فعال ---- */}
      {stats.energy < 20 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#3B82F6]/8 border border-[#3B82F6]/20 text-[11px] text-[#3B82F6] font-bold">
          <AlertTriangle size={13} />
          انرژی پایینه — سرعت تولید ۱۵٪ کمتره
        </div>
      )}
      {stats.hunger > 80 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#F59E0B]/8 border border-[#F59E0B]/20 text-[11px] text-[#F59E0B] font-bold">
          <AlertTriangle size={13} />
          خیلی گرسنه‌ای — درآمد ۵٪ کمتره
        </div>
      )}
      {stats.happiness < 30 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-[#EC4899]/8 border border-[#EC4899]/20 text-[11px] text-[#EC4899] font-bold">
          <AlertTriangle size={13} />
          ناراحتی — درآمد ۱۰٪ کمتره
        </div>
      )}

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
