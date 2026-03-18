'use client';

import { useState, useMemo } from 'react';
import { useGameStore, calcEmpireValue } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Badge from '@/components/ui/Badge';
import { Shield, Briefcase, Trophy, Award, Lock } from 'lucide-react';
import Link from 'next/link';
import type { AchievementCategory, AchievementRarity } from '@/types';

const tierColors: Record<string, { border: string; bg: string; text: string }> = {
  bronze: { border: 'border-[#CD7F32]/40', bg: 'bg-[#CD7F32]/10', text: 'text-[#CD7F32]' },
  silver: { border: 'border-[#C0C0C0]/40', bg: 'bg-[#C0C0C0]/10', text: 'text-[#C0C0C0]' },
  gold: { border: 'border-[#FFD700]/40', bg: 'bg-[#FFD700]/10', text: 'text-[#FFD700]' },
  diamond: { border: 'border-[#B9F2FF]/40', bg: 'bg-[#B9F2FF]/10', text: 'text-[#B9F2FF]' },
};

const rarityColors: Record<AchievementRarity, string> = {
  common: '#9CA3AF', rare: '#3B82F6', epic: '#8B5CF6', legendary: '#F59E0B',
};

const rarityLabels: Record<AchievementRarity, string> = {
  common: 'معمولی', rare: 'کمیاب', epic: 'حماسی', legendary: 'افسانه‌ای',
};

const categoryTabs: { key: 'all' | AchievementCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'همه', icon: '🏆' },
  { key: 'milestone', label: 'دستاورد', icon: '🎯' },
  { key: 'collection', label: 'مجموعه', icon: '📦' },
  { key: 'stat', label: 'آمار', icon: '📊' },
  { key: 'action', label: 'عملکرد', icon: '⚡' },
];

const statConfig = [
  { key: 'happiness' as const, label: 'شادی', icon: '😊', color: '#f472b6' },
  { key: 'hunger' as const, label: 'گرسنگی', icon: '🍔', color: '#fb923c' },
  { key: 'energy' as const, label: 'انرژی', icon: '⚡', color: '#facc15' },
  { key: 'intelligence' as const, label: 'هوش', icon: '🧠', color: '#818cf8' },
  { key: 'experience' as const, label: 'تجربه', icon: '⭐', color: '#34d399' },
];

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const achievements = useGameStore((s) => s.missions.achievements);
  const totalMissionsCompleted = useGameStore((s) => s.missions.totalMissionsCompleted);
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');
  const [showAllLocked, setShowAllLocked] = useState(false);

  const empireValue = calcEmpireValue(player, businesses);
  const totalUnlocked = achievements.filter((a) => a.unlockedAt).length;

  const filteredAchievements = activeCategory === 'all'
    ? achievements : achievements.filter((a) => a.category === activeCategory);
  const unlockedAchievements = filteredAchievements.filter((a) => a.unlockedAt);
  const lockedAchievements = filteredAchievements.filter((a) => !a.unlockedAt);

  // XP progress to next level
  const xpForNext = player.level * 100;
  const currentXp = player.stats.experience;
  const xpPct = Math.min(100, (currentXp / xpForNext) * 100);

  return (
    <div className="space-y-5 py-3 pb-24">

      {/* =================== Player Card =================== */}
      <div className="relative overflow-hidden rounded-[22px] border border-line-subtle bg-surface-card/60">
        {/* Background glows */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#6366F1]/10 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#F59E0B]/8 blur-[50px] pointer-events-none" />

        <div className="relative p-5">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/10 border-2 border-[#6366F1]/30 flex items-center justify-center">
                <span className="text-4xl">{player.avatar}</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(99,102,241,0.4)]">
                LV {player.level}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-fg truncate">{player.username}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge text={`اعتبار: ${player.reputation}`} variant="gold" />
              </div>
              {/* XP bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8px] text-fg-faint">تجربه</span>
                  <span className="text-[8px] text-fg-faint font-fa">{currentXp}/{xpForNext}</span>
                </div>
                <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${xpPct}%`,
                      background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                      boxShadow: '0 0 8px rgba(99,102,241,0.4)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="mt-4 text-center">
            <p className="text-[9px] text-fg-faint tracking-wider">موجودی</p>
            <MoneyDisplay amount={player.balance} size="lg" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { icon: <Shield size={13} className="text-[#818cf8]" />, value: empireValue.toLocaleString('fa-IR'), label: 'ارزش' },
              { icon: <Briefcase size={13} className="text-[#60A5FA]" />, value: `${businesses.length}`, label: 'شرکت' },
              { icon: <Trophy size={13} className="text-[#F59E0B]" />, value: `${totalMissionsCompleted}`, label: 'ماموریت' },
              { icon: <Award size={13} className="text-[#34d399]" />, value: `${totalUnlocked}`, label: 'نشان' },
            ].map((s, i) => (
              <div key={i} className="text-center py-2 rounded-[12px] bg-surface-inset/20 border border-line-subtle/30">
                <div className="flex justify-center mb-0.5">{s.icon}</div>
                <p className="text-xs font-black font-fa">{s.value}</p>
                <p className="text-[8px] text-fg-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =================== Stats Ring =================== */}
      <div className="flex items-center justify-around py-2.5 px-1 bg-surface-card/30 rounded-[18px] border border-line-subtle">
        {statConfig.map((stat) => {
          const value = player.stats[stat.key];
          const pct = Math.min(100, value);
          return (
            <Link key={stat.key} href="/life" className="flex flex-col items-center gap-1 py-1 group">
              <div className="relative w-11 h-11">
                <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="var(--progress-bg)" strokeWidth="3" />
                  <circle
                    cx="20" cy="20" r="16" fill="none"
                    stroke={stat.color}
                    strokeWidth="3"
                    strokeDasharray={`${pct * 1.005} 100.5`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                    style={{ filter: `drop-shadow(0 0 4px ${stat.color}60)` }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  {stat.icon}
                </span>
              </div>
              <span className="text-[8px] font-bold font-fa" style={{ color: stat.color }}>{value}</span>
              <span className="text-[7px] text-fg-faint">{stat.label}</span>
            </Link>
          );
        })}
      </div>

      {/* =================== Achievements =================== */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-[#FFD700]" />
          <h2 className="font-bold text-sm">دستاوردها</h2>
          <span className="text-[9px] text-fg-faint font-fa">{totalUnlocked}/{achievements.length}</span>
        </div>

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

        {/* Unlocked - horizontal scroll badges */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
              {unlockedAchievements.map((ach) => {
                const tc = tierColors[ach.tier];
                return (
                  <div
                    key={ach.id}
                    className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-[14px] border ${tc.border} ${tc.bg} min-w-[80px]`}
                  >
                    <span className="text-2xl">{ach.badge}</span>
                    <p className={`text-[9px] font-bold ${tc.text} text-center leading-tight`}>{ach.title}</p>
                    <span
                      className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: rarityColors[ach.rarity] + '20', color: rarityColors[ach.rarity] }}
                    >
                      {rarityLabels[ach.rarity]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked - grid boxes */}
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
                const rc = rarityColors[ach.rarity];
                const progressPct = ach.target > 0 ? Math.min(100, (ach.progress / ach.target) * 100) : 0;
                return (
                  <div
                    key={ach.id}
                    className="flex flex-col items-center text-center p-2.5 rounded-[14px] border border-line-subtle/40 bg-surface-card/20"
                  >
                    <span className="text-xl grayscale opacity-40">{ach.icon}</span>
                    <p className="text-[9px] font-bold text-fg-muted mt-1 leading-tight line-clamp-1">{ach.title}</p>
                    <span
                      className="text-[7px] font-bold px-1.5 py-0.5 rounded-full mt-1"
                      style={{ backgroundColor: rc + '12', color: rc }}
                    >
                      {rarityLabels[ach.rarity]}
                    </span>
                    {/* Mini progress */}
                    <div className="w-full mt-1.5">
                      <div className="h-1 bg-progress-bg rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progressPct}%`, backgroundColor: rc, opacity: 0.5 }}
                        />
                      </div>
                      <p className="text-[7px] text-fg-faint font-fa mt-0.5">{ach.progress}/{ach.target}</p>
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
