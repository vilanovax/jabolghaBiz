'use client';

import { useState, useMemo } from 'react';
import { useGameStore, calcEmpireValue } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Shield, Briefcase, Trophy, Award, Lock, Star, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { AchievementCategory, AchievementRarity, Achievement } from '@/types';

// ==================== Title System ====================
function getPlayerTitle(level: number): { title: string; icon: string } {
  if (level >= 50) return { title: 'امپراتور تجارت', icon: '👑' };
  if (level >= 40) return { title: 'سلطان بازار', icon: '🏛️' };
  if (level >= 30) return { title: 'غول اقتصادی', icon: '💎' };
  if (level >= 20) return { title: 'تاجر حرفه‌ای', icon: '🔥' };
  if (level >= 15) return { title: 'مدیر موفق', icon: '📈' };
  if (level >= 10) return { title: 'کارآفرین باتجربه', icon: '⚡' };
  if (level >= 5) return { title: 'کارآفرین نوپا', icon: '🌱' };
  return { title: 'تازه‌کار', icon: '🎯' };
}

function getAvatarGlow(level: number): string {
  if (level >= 30) return 'rgba(255, 215, 0, 0.5)';   // gold
  if (level >= 15) return 'rgba(139, 92, 246, 0.5)';   // purple
  return 'rgba(99, 102, 241, 0.4)';                      // blue
}

function getAvatarBorderColor(level: number): string {
  if (level >= 30) return '#FFD700';
  if (level >= 15) return '#8B5CF6';
  return '#6366F1';
}

// ==================== Config ====================
const tierColors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
  bronze: { border: 'border-[#CD7F32]/40', bg: 'bg-[#CD7F32]/10', text: 'text-[#CD7F32]', shadow: '0 0 12px rgba(205,127,50,0.2)' },
  silver: { border: 'border-[#C0C0C0]/40', bg: 'bg-[#C0C0C0]/10', text: 'text-[#C0C0C0]', shadow: '0 0 12px rgba(192,192,192,0.2)' },
  gold: { border: 'border-[#FFD700]/40', bg: 'bg-[#FFD700]/10', text: 'text-[#FFD700]', shadow: '0 0 16px rgba(255,215,0,0.3)' },
  diamond: { border: 'border-[#B9F2FF]/40', bg: 'bg-[#B9F2FF]/10', text: 'text-[#B9F2FF]', shadow: '0 0 20px rgba(185,242,255,0.3)' },
};

const rarityConfig: Record<AchievementRarity, { color: string; label: string; bg: string; glow: string }> = {
  common: { color: '#9CA3AF', label: 'معمولی', bg: 'rgba(156,163,175,0.12)', glow: '' },
  rare: { color: '#3B82F6', label: 'کمیاب', bg: 'rgba(59,130,246,0.12)', glow: '0 0 10px rgba(59,130,246,0.2)' },
  epic: { color: '#8B5CF6', label: 'حماسی', bg: 'rgba(139,92,246,0.12)', glow: '0 0 12px rgba(139,92,246,0.25)' },
  legendary: { color: '#F59E0B', label: 'افسانه‌ای', bg: 'rgba(245,158,11,0.15)', glow: '0 0 16px rgba(245,158,11,0.3)' },
};

const categoryTabs: { key: 'all' | AchievementCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'همه', icon: '🏆' },
  { key: 'milestone', label: 'دستاورد', icon: '🎯' },
  { key: 'collection', label: 'مجموعه', icon: '📦' },
  { key: 'stat', label: 'آمار', icon: '📊' },
  { key: 'action', label: 'عملکرد', icon: '⚡' },
];

const statConfig = [
  {
    key: 'energy' as const, label: 'انرژی', icon: '⚡', color: '#facc15',
    effectHigh: 'سرعت تولید +10%', effectLow: 'سرعت تولید -25%',
    thresholdHigh: 80, thresholdLow: 20,
  },
  {
    key: 'happiness' as const, label: 'شادی', icon: '😊', color: '#f472b6',
    effectHigh: 'درآمد +10%', effectLow: 'درآمد -15%',
    thresholdHigh: 70, thresholdLow: 30,
  },
  {
    key: 'hunger' as const, label: 'گرسنگی', icon: '🍔', color: '#fb923c',
    effectHigh: 'درآمد -10%', effectLow: '',
    thresholdHigh: 80, thresholdLow: 0,
  },
  {
    key: 'intelligence' as const, label: 'هوش', icon: '🧠', color: '#818cf8',
    effectHigh: 'هزینه ارتقا -5%', effectLow: '',
    thresholdHigh: 70, thresholdLow: 0,
  },
  {
    key: 'experience' as const, label: 'تجربه', icon: '⭐', color: '#34d399',
    effectHigh: '', effectLow: '',
    thresholdHigh: 100, thresholdLow: 0,
  },
];

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const achievements = useGameStore((s) => s.missions.achievements);
  const activeMissions = useGameStore((s) => s.missions.activeMissions);
  const totalMissionsCompleted = useGameStore((s) => s.missions.totalMissionsCompleted);
  const managers = useGameStore((s) => s.managers);
  const hasActiveToast = useGameStore((s) => s.achievementToastQueue.length > 0);
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');
  const [showAllLocked, setShowAllLocked] = useState(false);

  const empireValue = calcEmpireValue(player, businesses);
  const totalUnlocked = achievements.filter((a) => a.unlockedAt).length;

  const filteredAchievements = activeCategory === 'all'
    ? achievements : achievements.filter((a) => a.category === activeCategory);
  const unlockedAchievements = filteredAchievements.filter((a) => a.unlockedAt);
  const lockedAchievements = filteredAchievements.filter((a) => !a.unlockedAt);

  // XP progress
  const xpForNext = player.level * 100;
  const currentXp = player.stats.experience;
  const xpPct = Math.min(100, (currentXp / xpForNext) * 100);

  // Title
  const playerTitle = getPlayerTitle(player.level);
  const glowColor = getAvatarGlow(player.level);
  const borderColor = getAvatarBorderColor(player.level);

  // Featured achievement (highest rarity unlocked)
  const featuredAchievement = useMemo(() => {
    const rarityOrder: AchievementRarity[] = ['legendary', 'epic', 'rare', 'common'];
    const unlocked = achievements.filter((a) => a.unlockedAt);
    for (const rarity of rarityOrder) {
      const found = unlocked.find((a) => a.rarity === rarity);
      if (found) return found;
    }
    return null;
  }, [achievements]);

  // Active stat effects
  const activeEffects = useMemo(() => {
    const effects: { label: string; positive: boolean }[] = [];
    const s = player.stats;
    if (s.energy > 80) effects.push({ label: '+10% سرعت تولید', positive: true });
    if (s.energy < 20) effects.push({ label: '-25% سرعت تولید', positive: false });
    if (s.happiness > 70) effects.push({ label: '+10% درآمد', positive: true });
    if (s.happiness < 30) effects.push({ label: '-15% درآمد', positive: false });
    if (s.hunger > 80) effects.push({ label: '-10% درآمد', positive: false });
    if (s.intelligence > 70) effects.push({ label: '-5% هزینه ارتقا', positive: true });
    return effects;
  }, [player.stats]);

  // Smart quick actions (context-aware, max 2, with reward preview)
  const smartActions = useMemo(() => {
    const actions: { label: string; hint?: string; href: string; icon: string; color: string }[] = [];

    // Claimable mission reward (highest priority)
    const claimableMission = activeMissions.find((m) => m.completed && !m.claimed);
    if (claimableMission) {
      const rewardText = claimableMission.reward > 0
        ? `+${new Intl.NumberFormat('fa-IR').format(claimableMission.reward)}`
        : undefined;
      actions.push({ label: 'دریافت جایزه', hint: rewardText, href: '/missions', icon: '🏆', color: '#22C55E' });
    }

    // Incomplete mission with progress
    const inProgressMission = activeMissions.find((m) => !m.completed && !m.claimed && m.progress > 0);
    if (inProgressMission && actions.length < 2) {
      const pct = Math.round((inProgressMission.progress / inProgressMission.target) * 100);
      const rewardText = inProgressMission.reward > 0
        ? `+${new Intl.NumberFormat('fa-IR').format(inProgressMission.reward)}`
        : undefined;
      actions.push({ label: `ادامه ماموریت (${pct}%)`, hint: rewardText, href: '/missions', icon: '🎯', color: '#F59E0B' });
    }

    // Manager ability ready
    const now = Date.now();
    const readyAbility = managers.hiredManagers.find((m) => {
      if (!managers.activeSlots.includes(m.id)) return false;
      if (m.abilityActiveUntil && m.abilityActiveUntil > now) return false;
      if (!m.lastAbilityUsedAt) return true;
      return now > m.lastAbilityUsedAt + m.ability.cooldownMs;
    });
    if (readyAbility && actions.length < 2) {
      const boostLabel = `×${readyAbility.ability.effectMultiplier} ${readyAbility.ability.effectType === 'revenue_boost' ? 'درآمد' : 'تولید'}`;
      actions.push({ label: 'بوست مدیر', hint: boostLabel, href: '/business', icon: '⚡', color: '#6366F1' });
    }

    // Empty manager slot
    const emptySlot = managers.activeSlots.slice(0, managers.maxSlots).some((s) => s === null);
    if (emptySlot && managers.hiredManagers.length > 0 && actions.length < 2) {
      actions.push({ label: 'فعال‌سازی مدیر', href: '/business', icon: '👔', color: '#8B5CF6' });
    }

    // Low energy
    if (player.stats.energy < 20 && actions.length < 2) {
      actions.push({ label: 'استراحت کن', hint: 'تولید -25%', href: '/life', icon: '😴', color: '#facc15' });
    }

    // High hunger
    if (player.stats.hunger > 80 && actions.length < 2) {
      actions.push({ label: 'غذا بخور', hint: 'درآمد -10%', href: '/life', icon: '🍔', color: '#fb923c' });
    }

    return actions.slice(0, 2);
  }, [activeMissions, managers, player.stats]);

  // Retention hook (single most important CTA)
  const retentionHook = useMemo(() => {
    // Claimable reward first
    const claimable = activeMissions.find((m) => m.completed && !m.claimed);
    if (claimable) {
      return { text: 'جایزه ماموریت آماده دریافته', href: '/missions', icon: '🏆', cta: 'دریافت' };
    }

    // In-progress mission
    const inProgress = activeMissions.find((m) => !m.completed && m.progress > 0);
    if (inProgress) {
      const pct = Math.round((inProgress.progress / inProgress.target) * 100);
      return { text: `ماموریت ${pct}% پیشرفت داره`, href: '/missions', icon: '🎯', cta: 'ادامه' };
    }

    // Low stat warning
    if (player.stats.energy < 20) {
      return { text: 'انرژی کم — تولید کند شده', href: '/life', icon: '⚠️', cta: 'بازیابی' };
    }

    if (player.stats.hunger > 80) {
      return { text: 'گرسنگی بالا — درآمد کاهش یافته', href: '/life', icon: '🍔', cta: 'رسیدگی' };
    }

    return null;
  }, [activeMissions, player.stats]);

  return (
    <div className="space-y-5 py-3 pb-24">

      {/* =================== HERO SECTION =================== */}
      <div className="relative overflow-hidden rounded-[22px] border border-line-subtle bg-surface-card/60">
        {/* Background glows — stronger */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none" style={{ background: glowColor }} />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-[#F59E0B]/10 blur-[60px] pointer-events-none" />

        <div className="relative p-5">
          {/* Avatar + Info */}
          <div className="flex flex-col items-center text-center gap-3">
            {/* Avatar with glow */}
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
              {/* Level badge */}
              <div
                className="absolute -bottom-2 left-1/2 animate-level-pulse"
                style={{ transform: 'translateX(-50%)' }}
              >
                <div
                  className="px-3 py-1 rounded-full text-white font-black text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${borderColor}, ${borderColor}CC)`,
                    boxShadow: `0 2px 12px ${glowColor}`,
                  }}
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
                <span className="text-xs font-bold" style={{ color: borderColor }}>
                  {playerTitle.title}
                </span>
              </div>
            </div>

            {/* Active effects chips */}
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
                <span className="text-[9px] text-fg-faint font-fa font-bold">
                  {currentXp}/{xpForNext} XP
                </span>
              </div>
              <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-xp-fill"
                  style={{
                    width: `${xpPct}%`,
                    background: `linear-gradient(90deg, ${borderColor}, ${borderColor}AA)`,
                    boxShadow: `0 0 12px ${glowColor}`,
                  }}
                />
              </div>
              <p className="text-[8px] text-fg-faint mt-0.5 text-center">
                {Math.ceil(xpForNext - currentXp)} XP تا سطح بعد
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================== SMART QUICK ACTIONS =================== */}
      {/* Hidden when achievement toast is active to avoid CTA overload */}
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
                {action.hint && (
                  <span className="text-[8px] font-bold text-fg-faint leading-tight">{action.hint}</span>
                )}
              </div>
              <ChevronLeft size={12} className="shrink-0" style={{ color: action.color }} />
            </Link>
          ))}
        </div>
      )}

      {/* =================== RETENTION HOOK =================== */}
      {/* Also hidden during toast to keep single focus */}
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

      {/* =================== MONEY DISPLAY =================== */}
      <div className="text-center py-4 rounded-[18px] border border-[#F59E0B]/20 bg-surface-card/40" style={{ boxShadow: '0 0 24px rgba(245,158,11,0.08)' }}>
        <p className="text-[10px] text-fg-muted font-bold tracking-wider mb-1">موجودی کل</p>
        <div className="animate-money-glow">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
        <div className="flex items-center justify-center gap-1 mt-1.5">
          <Shield size={11} className="text-[#F59E0B]" />
          <span className="text-[9px] text-fg-faint font-fa">ارزش امپراتوری: {empireValue.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      {/* =================== PERFORMANCE SUMMARY =================== */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-[#6366F1]" />
          <h2 className="font-bold text-sm">خلاصه عملکرد</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <Briefcase size={16} className="text-[#60A5FA]" />, value: `${businesses.length}`, label: 'شرکت فعال', color: '#60A5FA' },
            { icon: <Trophy size={16} className="text-[#F59E0B]" />, value: `${totalMissionsCompleted}`, label: 'ماموریت انجام‌شده', color: '#F59E0B' },
            { icon: <Award size={16} className="text-[#34d399]" />, value: `${totalUnlocked}/${achievements.length}`, label: 'دستاورد', color: '#34d399' },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 py-3 rounded-[14px] bg-surface-card/40 border border-line-subtle/40 animate-stat-slide-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
            >
              {s.icon}
              <p className="text-base font-black font-fa" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8px] text-fg-faint font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =================== STATS CARDS =================== */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-[#818cf8]" />
          <h2 className="font-bold text-sm">وضعیت شخصیت</h2>
          <Link href="/life" className="mr-auto text-[10px] font-bold text-[#818cf8]">مدیریت</Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {statConfig.map((stat, i) => {
            const value = player.stats[stat.key];
            const pct = Math.min(100, value);
            const isGood = stat.key === 'hunger' ? value < 80 : value > (stat.thresholdLow || 30);
            const statusColor = isGood ? '#22C55E' : '#EF4444';
            const currentEffect = value > stat.thresholdHigh && stat.effectHigh
              ? stat.effectHigh
              : value < stat.thresholdLow && stat.effectLow
                ? stat.effectLow
                : null;

            return (
              <Link
                key={stat.key}
                href="/life"
                className="flex items-start gap-2.5 p-3 rounded-[14px] bg-surface-card/40 border border-line-subtle/40 animate-stat-slide-up active:scale-[0.98] transition-transform"
                style={{ animationDelay: `${(i + 3) * 80}ms`, opacity: 0 }}
              >
                {/* Ring */}
                <div className="relative w-10 h-10 shrink-0">
                  <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--progress-bg)" strokeWidth="3" />
                    <circle
                      cx="20" cy="20" r="16" fill="none"
                      stroke={stat.color}
                      strokeWidth="3"
                      strokeDasharray={`${pct * 1.005} 100.5`}
                      strokeLinecap="round"
                      className="animate-ring-fill"
                      style={{ filter: `drop-shadow(0 0 4px ${stat.color}60)` }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-base">
                    {stat.icon}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-fg">{stat.label}</span>
                    <span className="text-[11px] font-black font-fa" style={{ color: stat.color }}>{value}</span>
                  </div>
                  {currentEffect ? (
                    <p className="text-[8px] font-bold mt-0.5" style={{ color: statusColor }}>
                      {currentEffect}
                    </p>
                  ) : (
                    <p className="text-[8px] text-fg-faint mt-0.5">
                      {stat.key === 'hunger' ? 'زیر 80 نگه دار' :
                       stat.key === 'experience' ? 'برای سطح بالاتر' :
                       `بالای ${stat.thresholdHigh} = بونوس`}
                    </p>
                  )}
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

        {/* Featured Achievement */}
        {featuredAchievement && (
          <FeaturedAchievementCard achievement={featuredAchievement} />
        )}

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 mb-3">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                activeCategory === tab.key
                  ? 'bg-[#6366F1]/15 text-[#818cf8] shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                  : 'bg-surface-card/30 text-fg-muted hover:bg-surface-card/60'
              }`}
            >
              <span className="text-[10px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Unlocked achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
              {unlockedAchievements.map((ach, i) => {
                const rc = rarityConfig[ach.rarity];
                const tc = tierColors[ach.tier];
                return (
                  <div
                    key={ach.id}
                    className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-[14px] border ${tc.border} ${tc.bg} min-w-[85px] animate-achievement-shine animate-pop-in`}
                    style={{
                      boxShadow: rc.glow || tc.shadow,
                      animationDelay: `${i * 80}ms`,
                    }}
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
          </div>
        )}

        {/* Locked achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Lock size={11} className="text-fg-faint" />
                <span className="text-[10px] text-fg-muted font-bold">{lockedAchievements.length} باقی‌مانده</span>
              </div>
              {lockedAchievements.length > 6 && (
                <button
                  onClick={() => setShowAllLocked(!showAllLocked)}
                  className="text-[10px] font-bold text-[#818cf8] hover:text-[#6366F1] transition-colors"
                >
                  {showAllLocked ? 'کمتر' : `همه (${lockedAchievements.length})`}
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(showAllLocked ? lockedAchievements : lockedAchievements.slice(0, 6)).map((ach) => {
                const rc = rarityConfig[ach.rarity];
                const progressPct = ach.target > 0 ? Math.min(100, (ach.progress / ach.target) * 100) : 0;
                return (
                  <div
                    key={ach.id}
                    className="flex flex-col items-center text-center p-2.5 rounded-[14px] border border-line-subtle/40 bg-surface-card/20"
                    style={{ borderColor: `${rc.color}15` }}
                  >
                    <div className="relative">
                      <span className="text-xl grayscale opacity-30">{ach.icon}</span>
                      <Lock size={10} className="absolute -top-0.5 -right-1 text-fg-faint" />
                    </div>
                    <p className="text-[9px] font-bold text-fg-muted mt-1 leading-tight line-clamp-1">{ach.title}</p>
                    <span
                      className="text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-1"
                      style={{ backgroundColor: rc.bg, color: rc.color }}
                    >
                      {rc.label}
                    </span>
                    {/* Progress bar */}
                    <div className="w-full mt-1.5">
                      <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${progressPct}%`, backgroundColor: rc.color, opacity: 0.6 }}
                        />
                      </div>
                      <p className="text-[7px] text-fg-faint font-fa mt-0.5">
                        {ach.progress}/{ach.target}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Featured Achievement Card ====================
function FeaturedAchievementCard({ achievement }: { achievement: Achievement }) {
  const rc = rarityConfig[achievement.rarity];
  const tc = tierColors[achievement.tier];

  return (
    <div
      className={`mb-3 p-4 rounded-[16px] border ${tc.border} animate-achievement-shine`}
      style={{
        background: `linear-gradient(135deg, ${rc.bg}, transparent)`,
        boxShadow: rc.glow || tc.shadow,
      }}
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
        <span
          className="text-[8px] font-black px-2 py-1 rounded-full"
          style={{ backgroundColor: rc.bg, color: rc.color }}
        >
          {rc.label}
        </span>
      </div>
    </div>
  );
}
