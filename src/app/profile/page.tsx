'use client';

import { useMemo } from 'react';
import { useGameStore, calcEmpireValue } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Shield, Briefcase, Trophy, Award, Lock, Star, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { AchievementRarity, Achievement } from '@/types';

// ==================== Title System ====================
function getPlayerTitle(level: number): { title: string; icon: string } {
  if (level >= 50) return { title: 'امپراتور تجارت', icon: '👑' };
  if (level >= 40) return { title: 'سلطان بازار', icon: '🏛️' };
  if (level >= 30) return { title: 'غول اقتصادی', icon: '💎' };
  if (level >= 20) return { title: 'تاجر حرفه‌ای', icon: '🔥' };
  if (level >= 15) return { title: 'مدیر موفق', icon: '📈' };
  if (level >= 10) return { title: 'کارآفرین باتجربه', icon: '⚡' };
  if (level >= 5)  return { title: 'کارآفرین نوپا', icon: '🌱' };
  return { title: 'تازه‌کار', icon: '🎯' };
}

function getAvatarGlow(level: number): string {
  if (level >= 30) return 'rgba(255, 215, 0, 0.5)';
  if (level >= 15) return 'rgba(139, 92, 246, 0.5)';
  return 'rgba(99, 102, 241, 0.4)';
}

function getAvatarBorderColor(level: number): string {
  if (level >= 30) return '#FFD700';
  if (level >= 15) return '#8B5CF6';
  return '#6366F1';
}

// ==================== Stat Display ====================
const STAT_DISPLAY = [
  {
    key: 'energy' as const, label: 'انرژی', icon: '⚡',
    color: '#facc15', bg: 'rgba(250,204,21,0.1)',
    isWarn: (v: number) => v < 20, warnEffect: 'تولید -15%',
    barPct: (v: number) => v,
  },
  {
    key: 'happiness' as const, label: 'شادی', icon: '😊',
    color: '#f472b6', bg: 'rgba(244,114,182,0.1)',
    isWarn: (v: number) => v < 30, warnEffect: 'درآمد -10%',
    barPct: (v: number) => v,
  },
  {
    key: 'hunger' as const, label: 'گرسنگی', icon: '🍔',
    color: '#fb923c', bg: 'rgba(251,146,60,0.1)',
    isWarn: (v: number) => v > 80, warnEffect: 'درآمد -5%',
    barPct: (v: number) => 100 - v,
  },
];

const rarityConfig: Record<AchievementRarity, { color: string; label: string; bg: string; glow: string }> = {
  common:    { color: '#9CA3AF', label: 'معمولی',   bg: 'rgba(156,163,175,0.12)', glow: '' },
  rare:      { color: '#3B82F6', label: 'کمیاب',    bg: 'rgba(59,130,246,0.12)',  glow: '0 0 10px rgba(59,130,246,0.2)' },
  epic:      { color: '#8B5CF6', label: 'حماسی',    bg: 'rgba(139,92,246,0.12)',  glow: '0 0 12px rgba(139,92,246,0.25)' },
  legendary: { color: '#F59E0B', label: 'افسانه‌ای', bg: 'rgba(245,158,11,0.15)', glow: '0 0 16px rgba(245,158,11,0.3)' },
};

const tierColors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
  bronze:  { border: 'border-[#CD7F32]/40', bg: 'bg-[#CD7F32]/10',  text: 'text-[#CD7F32]', shadow: '0 0 12px rgba(205,127,50,0.2)' },
  silver:  { border: 'border-[#C0C0C0]/40', bg: 'bg-[#C0C0C0]/10',  text: 'text-[#C0C0C0]', shadow: '0 0 12px rgba(192,192,192,0.2)' },
  gold:    { border: 'border-[#FFD700]/40', bg: 'bg-[#FFD700]/10',  text: 'text-[#FFD700]', shadow: '0 0 16px rgba(255,215,0,0.3)' },
  diamond: { border: 'border-[#B9F2FF]/40', bg: 'bg-[#B9F2FF]/10',  text: 'text-[#B9F2FF]', shadow: '0 0 20px rgba(185,242,255,0.3)' },
};

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const achievements = useGameStore((s) => s.missions.achievements);
  const activeMissions = useGameStore((s) => s.missions.activeMissions);
  const totalMissionsCompleted = useGameStore((s) => s.missions.totalMissionsCompleted);
  const managers = useGameStore((s) => s.managers);
  const hasActiveToast = useGameStore((s) => s.achievementToastQueue.length > 0);

  const empireValue = calcEmpireValue(player, businesses);
  const totalUnlocked = achievements.filter((a) => a.unlockedAt).length;
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedCount = achievements.length - totalUnlocked;

  const xpForNext = 100;
  const currentXp = Math.min(player.stats.experience, 99);
  const xpPct = currentXp;

  const playerTitle = getPlayerTitle(player.level);
  const glowColor = getAvatarGlow(player.level);
  const borderColor = getAvatarBorderColor(player.level);

  const featuredAchievement = useMemo(() => {
    const rarityOrder: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common'];
    for (const rarity of rarityOrder) {
      const found = unlockedAchievements.find((a) => a.rarity === rarity);
      if (found) return found;
    }
    return null;
  }, [unlockedAchievements]);

  const activeEffects = useMemo(() => {
    const effects: { label: string; positive: boolean }[] = [];
    const s = player.stats;
    if (s.energy > 80)    effects.push({ label: '+10% سرعت تولید', positive: true });
    if (s.energy < 20)    effects.push({ label: '-15% سرعت تولید', positive: false });
    if (s.happiness > 70) effects.push({ label: '+10% درآمد', positive: true });
    if (s.happiness < 30) effects.push({ label: '-10% درآمد', positive: false });
    if (s.hunger > 80)    effects.push({ label: '-5% درآمد', positive: false });
    return effects;
  }, [player.stats]);

  const smartActions = useMemo(() => {
    const actions: { label: string; hint?: string; href: string; icon: string; color: string }[] = [];
    const claimable = activeMissions.find((m) => m.completed && !m.claimed);
    if (claimable) {
      const hint = claimable.reward > 0 ? `+${new Intl.NumberFormat('fa-IR').format(claimable.reward)}` : undefined;
      actions.push({ label: 'دریافت جایزه', hint, href: '/missions', icon: '🏆', color: '#22C55E' });
    }
    const inProgress = activeMissions.find((m) => !m.completed && !m.claimed && m.progress > 0);
    if (inProgress && actions.length < 2) {
      const pct = Math.round((inProgress.progress / inProgress.target) * 100);
      actions.push({ label: `ادامه ماموریت (${pct}%)`, href: '/missions', icon: '🎯', color: '#F59E0B' });
    }
    const now = Date.now();
    const readyAbility = managers.hiredManagers.find((m) => {
      if (!managers.activeSlots.includes(m.id)) return false;
      if (m.abilityActiveUntil && m.abilityActiveUntil > now) return false;
      return !m.lastAbilityUsedAt || now > m.lastAbilityUsedAt + m.ability.cooldownMs;
    });
    if (readyAbility && actions.length < 2) {
      actions.push({ label: 'بوست مدیر', href: '/managers', icon: '⚡', color: '#6366F1' });
    }
    if (player.stats.energy < 20 && actions.length < 2)
      actions.push({ label: 'استراحت کن', hint: 'تولید -25%', href: '/life', icon: '😴', color: '#facc15' });
    if (player.stats.hunger > 80 && actions.length < 2)
      actions.push({ label: 'غذا بخور', hint: 'درآمد -10%', href: '/life', icon: '🍔', color: '#fb923c' });
    return actions.slice(0, 2);
  }, [activeMissions, managers, player.stats]);

  const retentionHook = useMemo(() => {
    const claimable = activeMissions.find((m) => m.completed && !m.claimed);
    if (claimable) return { text: 'جایزه ماموریت آماده دریافته', href: '/missions', icon: '🏆', cta: 'دریافت' };
    const inProgress = activeMissions.find((m) => !m.completed && m.progress > 0);
    if (inProgress) {
      const pct = Math.round((inProgress.progress / inProgress.target) * 100);
      return { text: `ماموریت ${pct}% پیشرفت داره`, href: '/missions', icon: '🎯', cta: 'ادامه' };
    }
    if (player.stats.energy < 20)  return { text: 'انرژی کم — تولید کند شده', href: '/life', icon: '⚠️', cta: 'بازیابی' };
    if (player.stats.hunger > 80)  return { text: 'گرسنگی بالا — درآمد کاهش یافته', href: '/life', icon: '🍔', cta: 'رسیدگی' };
    return null;
  }, [activeMissions, player.stats]);

  return (
    <div className="space-y-4 py-3 pb-24">

      {/* =================== HERO =================== */}
      <div className="relative overflow-hidden rounded-[22px] border border-line-subtle bg-surface-card/60">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none" style={{ background: glowColor }} />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#F59E0B]/10 blur-[60px] pointer-events-none" />
        <div className="relative p-5">
          <div className="flex flex-col items-center text-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-[92px] h-[92px] rounded-full flex items-center justify-center animate-avatar-glow"
                style={{
                  '--glow-color': glowColor,
                  background: `linear-gradient(135deg, ${borderColor}20, ${borderColor}08)`,
                  border: `3px solid ${borderColor}60`,
                } as React.CSSProperties}
              >
                <span className="text-5xl">{player.avatar}</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 animate-level-pulse" style={{ transform: 'translateX(-50%)' }}>
                <div
                  className="px-3 py-1 rounded-full text-white font-black text-sm"
                  style={{ background: `linear-gradient(135deg, ${borderColor}, ${borderColor}CC)`, boxShadow: `0 2px 12px ${glowColor}` }}
                >
                  LV {player.level}
                </div>
              </div>
            </div>

            {/* Name + Title */}
            <div className="mt-2">
              <h1 className="text-xl font-black text-fg">{player.username}</h1>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="text-sm">{playerTitle.icon}</span>
                <span className="text-xs font-bold" style={{ color: borderColor }}>{playerTitle.title}</span>
              </div>
            </div>

            {/* Active effects */}
            {activeEffects.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {activeEffects.map((e, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: e.positive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: e.positive ? '#22C55E' : '#EF4444',
                    }}
                  >
                    {e.label}
                  </span>
                ))}
              </div>
            )}

            {/* XP Bar */}
            <div className="w-full max-w-[280px] mt-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-fg-muted">تجربه</span>
                <span className="text-[9px] text-fg-faint font-fa font-bold">{currentXp}/{xpForNext} XP</span>
              </div>
              <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-xp-fill"
                  style={{ width: `${xpPct}%`, background: `linear-gradient(90deg, ${borderColor}, ${borderColor}AA)`, boxShadow: `0 0 12px ${glowColor}` }}
                />
              </div>
              <p className="text-[8px] text-fg-faint mt-0.5 text-center">{Math.ceil(xpForNext - currentXp)} XP تا سطح بعد</p>
            </div>
          </div>
        </div>
      </div>

      {/* =================== QUICK ACTIONS =================== */}
      {!hasActiveToast && smartActions.length > 0 && (
        <div className="flex gap-2">
          {smartActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[14px] border bg-surface-card/40 active:scale-[0.97] transition-transform"
              style={{ borderColor: `${action.color}25` }}
            >
              <span className="text-sm">{action.icon}</span>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold leading-tight" style={{ color: action.color }}>{action.label}</span>
                {action.hint && <span className="text-[8px] font-bold text-fg-faint leading-tight">{action.hint}</span>}
              </div>
              <ChevronLeft size={12} className="shrink-0" style={{ color: action.color }} />
            </Link>
          ))}
        </div>
      )}

      {/* =================== RETENTION HOOK =================== */}
      {!hasActiveToast && retentionHook && (
        <Link
          href={retentionHook.href}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] bg-[#6366F1]/8 border border-[#6366F1]/15 active:scale-[0.98] transition-transform"
        >
          <span className="text-sm">{retentionHook.icon}</span>
          <span className="text-[10px] font-bold text-fg-secondary flex-1">{retentionHook.text}</span>
          <span className="text-[9px] font-black text-[#818cf8] px-2 py-0.5 rounded-full bg-[#6366F1]/12">
            {retentionHook.cta}
          </span>
        </Link>
      )}

      {/* =================== BALANCE + STATS SUMMARY =================== */}
      <div
        className="rounded-[20px] border border-[#F59E0B]/20 bg-surface-card/40 p-4"
        style={{ boxShadow: '0 0 24px rgba(245,158,11,0.06)' }}
      >
        <p className="text-[10px] text-fg-muted font-bold text-center mb-1">موجودی کل</p>
        <div className="text-center animate-money-glow">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 mb-4">
          <Shield size={11} className="text-[#F59E0B]" />
          <span className="text-[9px] text-fg-faint font-fa">ارزش امپراتوری: {empireValue.toLocaleString('fa-IR')}</span>
        </div>
        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-2 border-t border-line-subtle/40 pt-3">
          {[
            { icon: <Briefcase size={13} className="text-[#60A5FA]" />, value: businesses.length, label: 'شرکت', color: '#60A5FA' },
            { icon: <Trophy size={13} className="text-[#F59E0B]" />, value: totalMissionsCompleted, label: 'ماموریت', color: '#F59E0B' },
            { icon: <Award size={13} className="text-[#34d399]" />, value: `${totalUnlocked}/${achievements.length}`, label: 'دستاورد', color: '#34d399' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              {s.icon}
              <p className="text-[13px] font-black font-fa" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8px] text-fg-faint font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =================== CHARACTER STATUS (3 stats) =================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-4 rounded-full bg-[#818cf8]" />
            <h2 className="font-bold text-sm">وضعیت شخصیت</h2>
          </div>
          <Link href="/life" className="text-[10px] font-bold text-[#818cf8]">مدیریت ←</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STAT_DISPLAY.map((stat) => {
            const value = player.stats[stat.key];
            const barPct = stat.barPct(value);
            const isWarn = stat.isWarn(value);
            return (
              <Link
                key={stat.key}
                href="/life"
                className="rounded-[18px] p-3 text-center active:scale-[0.97] transition-transform"
                style={{ background: stat.bg, border: `1px solid ${stat.color}25` }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <p
                  className={`text-[20px] font-black font-fa leading-none mt-1 ${isWarn ? 'animate-warning-pulse' : ''}`}
                  style={{ color: stat.color }}
                >
                  {value}
                </p>
                <p className="text-[8px] text-fg-muted mt-0.5">{stat.label}</p>
                {isWarn && (
                  <p className="text-[7px] text-[#EF4444] font-bold mt-0.5">{stat.warnEffect}</p>
                )}
                <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${barPct}%`, backgroundColor: stat.color }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =================== ACHIEVEMENTS =================== */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-[#FFD700]" />
          <h2 className="font-bold text-sm">دستاوردها</h2>
          <span className="text-[9px] text-fg-faint font-fa">{totalUnlocked}/{achievements.length}</span>
        </div>

        {/* Featured */}
        {featuredAchievement && <FeaturedAchievementCard achievement={featuredAchievement} />}

        {/* Unlocked horizontal scroll */}
        {unlockedAchievements.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 mb-3">
            {unlockedAchievements.map((ach, i) => {
              const rc = rarityConfig[ach.rarity];
              const tc = tierColors[ach.tier];
              return (
                <div
                  key={ach.id}
                  className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-[14px] border ${tc.border} ${tc.bg} min-w-[85px] animate-achievement-shine animate-pop-in`}
                  style={{ boxShadow: rc.glow || tc.shadow, animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-2xl">{ach.badge}</span>
                  <p className={`text-[9px] font-bold ${tc.text} text-center leading-tight`}>{ach.title}</p>
                  <span
                    className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: rc.bg, color: rc.color }}
                  >
                    {rc.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {unlockedAchievements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-3xl opacity-20 mb-2">🏆</p>
            <p className="text-[11px] text-fg-muted">اولین دستاوردت رو کسب کن!</p>
          </div>
        )}

        {/* Locked count */}
        {lockedCount > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-1 py-2.5 rounded-[12px] bg-surface-card/30 border border-line-subtle/30">
            <Lock size={12} className="text-fg-faint" />
            <span className="text-[10px] text-fg-muted">
              <span className="font-fa font-bold text-fg-secondary">{lockedCount}</span> دستاورد دیگه در انتظارته
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Featured Achievement ====================
function FeaturedAchievementCard({ achievement }: { achievement: Achievement }) {
  const rc = rarityConfig[achievement.rarity];
  const tc = tierColors[achievement.tier];
  return (
    <div
      className={`mb-3 p-4 rounded-[16px] border ${tc.border} animate-achievement-shine`}
      style={{ background: `linear-gradient(135deg, ${rc.bg}, transparent)`, boxShadow: rc.glow || tc.shadow }}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.badge}</div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <Star size={12} style={{ color: rc.color }} />
            <span className="text-[9px] font-bold" style={{ color: rc.color }}>بزرگ‌ترین دستاورد</span>
          </div>
          <p className={`text-sm font-black ${tc.text} mt-0.5`}>{achievement.title}</p>
          <p className="text-[9px] text-fg-muted mt-0.5">{achievement.description}</p>
        </div>
        <span className="text-[8px] font-black px-2 py-1 rounded-full" style={{ backgroundColor: rc.bg, color: rc.color }}>
          {rc.label}
        </span>
      </div>
    </div>
  );
}
