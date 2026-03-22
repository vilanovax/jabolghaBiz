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

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  food:          { label: 'غذا', icon: '🍽️', color: '#F59E0B' },
  rest:          { label: 'استراحت', icon: '😴', color: '#3B82F6' },
  fitness:       { label: 'ورزش', icon: '💪', color: '#22C55E' },
  entertainment: { label: 'سرگرمی', icon: '🎮', color: '#EC4899' },
  education:     { label: 'آموزش', icon: '📖', color: '#8B5CF6' },
};

function formatCooldown(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}ث`;
}

function formatDuration(ms: number): string {
  const secs = Math.ceil(ms / 1000);
  return `${secs}ث`;
}

// بخش اکشن فعال — تایمر بزرگ
function ActiveActionBanner() {
  const activeAction = useGameStore((s) => s.life.activeAction);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  if (!activeAction || activeAction.endsAt <= now) return null;

  const action = LIFE_ACTIONS.find((a) => a.id === activeAction.actionId);
  if (!action) return null;

  const total = activeAction.endsAt - activeAction.startedAt;
  const elapsed = now - activeAction.startedAt;
  const remaining = Math.max(0, activeAction.endsAt - now);
  const pct = Math.min(100, (elapsed / total) * 100);
  const secs = Math.ceil(remaining / 1000);

  const effects = Object.entries(action.effect)
    .filter(([k]) => k !== 'experience')
    .map(([k, v]) => {
      const stat = STATS.find((s) => s.key === k);
      const val = v as number;
      const isGood = k === 'hunger' ? val < 0 : val > 0;
      return { icon: stat?.icon ?? '🧠', val, isGood };
    });

  return (
    <div
      className="rounded-[20px] border border-[#6366F1]/30 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))' }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-[18px] bg-[#6366F1]/15 border border-[#6366F1]/25 flex items-center justify-center text-3xl animate-pulse">
          {action.icon}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-black">{action.name}...</p>
          <div className="flex items-center gap-2 mt-1">
            {effects.map((e, i) => (
              <span key={i} className={`text-[10px] font-bold ${e.isGood ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {e.icon} {e.val > 0 ? '+' : ''}{e.val}
              </span>
            ))}
          </div>
        </div>
        <div className="text-center shrink-0">
          <p className="text-[20px] font-black font-fa text-[#6366F1]">{secs}</p>
          <p className="text-[8px] text-fg-faint">ثانیه</p>
        </div>
      </div>
      <div className="h-2 bg-progress-bg">
        <div
          className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function LifePage() {
  const player = useGameStore((s) => s.player);
  const performLifeAction = useGameStore((s) => s.performLifeAction);
  const getActionCooldownLeft = useGameStore((s) => s.getActionCooldownLeft);
  const activeAction = useGameStore((s) => s.life.activeAction);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const { stats } = player;
  const hasActiveAction = activeAction && activeAction.endsAt > Date.now();

  // دسته‌بندی اکشن‌ها
  const categories = ['food', 'rest', 'fitness', 'entertainment'] as const;

  return (
    <div className="space-y-4 py-4 pb-24">
      <h1 className="text-lg font-black">زندگی</h1>

      {/* ---- ۳ آمار اصلی ---- */}
      <div className="grid grid-cols-3 gap-2">
        {STATS.map((s) => {
          const value = stats[s.key];
          const barPct = s.key === 'hunger' ? 100 - value : value;
          const isWarn = s.key === 'energy' ? value < 20 : s.key === 'hunger' ? value > 80 : value < 30;
          const isBoost = s.key === 'energy' ? value > 80 : s.key === 'hunger' ? false : value > 70;
          const borderColor = isWarn ? `${s.color}60` : isBoost ? '#22C55E60' : `${s.color}25`;
          const bg = isWarn ? `${s.color}15` : isBoost ? 'rgba(34,197,94,0.08)' : s.bg;
          return (
            <div key={s.key} className="rounded-[18px] p-3 text-center" style={{ background: bg, border: `1px solid ${borderColor}` }}>
              <span className="text-2xl">{s.icon}</span>
              <p className={`text-[22px] font-black font-fa leading-none mt-1 ${isWarn ? 'animate-warning-pulse' : ''}`} style={{ color: isBoost ? '#22C55E' : s.color }}>
                {value}
              </p>
              <p className="text-[8px] text-fg-muted mt-0.5">{s.label}</p>
              <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden mt-2">
                <div className="h-full rounded-full transition-all" style={{ width: `${barPct}%`, backgroundColor: isBoost ? '#22C55E' : isWarn ? '#EF4444' : s.color }} />
              </div>
              {isBoost && <p className="text-[7px] text-[#22C55E] font-bold mt-1">● بوست فعال</p>}
              {isWarn && <p className="text-[7px] text-[#EF4444] font-bold mt-1">● جریمه فعال</p>}
            </div>
          );
        })}
      </div>

      {/* ---- وضعیت فعال ---- */}
      <div className="flex flex-wrap gap-1.5">
        {stats.energy > 80 && <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">⚡ سرعت تولید +۱۰٪</span>}
        {stats.happiness > 70 && <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899]">😊 درآمد +۱۰٪</span>}
        {stats.energy < 20 && <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#3B82F6]/8 border border-[#3B82F6]/20 text-[#3B82F6]"><AlertTriangle size={11} className="inline" /> تولید ۱۵٪ کمتر</span>}
        {stats.hunger > 80 && <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#F59E0B]/8 border border-[#F59E0B]/20 text-[#F59E0B]"><AlertTriangle size={11} className="inline" /> درآمد ۵٪ کمتر</span>}
        {stats.happiness < 30 && <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[#EC4899]/8 border border-[#EC4899]/20 text-[#EC4899]"><AlertTriangle size={11} className="inline" /> درآمد ۱۰٪ کمتر</span>}
      </div>

      {/* ---- اکشن فعال ---- */}
      <ActiveActionBanner />

      {/* ---- اکشن‌ها — دسته‌بندی شده ---- */}
      {categories.map((cat) => {
        const catCfg = CATEGORY_CONFIG[cat];
        const actions = LIFE_ACTIONS.filter((a) => a.category === cat);
        if (actions.length === 0) return null;

        return (
          <div key={cat}>
            <p className="text-[10px] font-bold text-fg-secondary mb-2 flex items-center gap-1.5">
              {catCfg.icon} {catCfg.label}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => {
                const cooldown = getActionCooldownLeft(action.id);
                const onCooldown = cooldown > 0;
                const canAfford = player.balance >= action.cost;
                const isBusy = !!hasActiveAction;
                const disabled = onCooldown || !canAfford || isBusy;

                const effects = Object.entries(action.effect)
                  .filter(([k]) => ['energy', 'happiness', 'hunger'].includes(k))
                  .map(([k, v]) => {
                    const stat = STATS.find((s) => s.key === k);
                    const val = v as number;
                    const isGood = k === 'hunger' ? val < 0 : val > 0;
                    return { icon: stat?.icon ?? '', val, isGood, color: isGood ? '#22C55E' : '#EF4444' };
                  });

                return (
                  <button
                    key={action.id}
                    onClick={() => performLifeAction(action.id)}
                    disabled={disabled}
                    className="rounded-[16px] border p-3 text-right transition-all active:scale-[0.97] disabled:opacity-40"
                    style={{
                      borderColor: disabled ? 'rgba(212,212,216,0.2)' : `${catCfg.color}25`,
                      background: disabled ? 'transparent' : `${catCfg.color}08`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black truncate">{action.name}</p>
                        <p className="text-[8px] text-fg-faint">{action.description}</p>
                      </div>
                    </div>

                    {onCooldown ? (
                      <div className="flex items-center justify-center gap-1 text-fg-faint text-[10px] py-1">
                        <Clock size={10} />
                        <span className="font-mono font-bold">{formatCooldown(cooldown)}</span>
                      </div>
                    ) : isBusy ? (
                      <p className="text-[9px] text-fg-faint text-center py-1">در حال انجام...</p>
                    ) : (
                      <>
                        {/* اثرات */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                          {effects.map((e, i) => (
                            <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: e.color, background: `${e.color}15` }}>
                              {e.icon} {e.val > 0 ? '+' : ''}{e.val}
                            </span>
                          ))}
                        </div>
                        {/* هزینه + مدت */}
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-fg-faint">
                            ⏱ {formatDuration(action.durationMs)}
                          </span>
                          {action.cost > 0 ? (
                            <span className="text-[9px] text-fg-muted font-fa font-bold">{action.cost.toLocaleString('fa-IR')} ت</span>
                          ) : (
                            <span className="text-[9px] text-[#22C55E] font-bold">رایگان</span>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
