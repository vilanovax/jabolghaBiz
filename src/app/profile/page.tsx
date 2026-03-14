'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import PlayerStatsPanel from '@/components/player/PlayerStatsPanel';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Shield, Star, Calendar, Trophy, Lock } from 'lucide-react';
import type { AchievementCategory, AchievementRarity } from '@/types';

const effectLabels: Record<string, string> = {
  happiness: 'شادی',
  hunger: 'گرسنگی',
  energy: 'انرژی',
  intelligence: 'هوش',
  experience: 'تجربه',
};

const tierColors: Record<string, { border: string; bg: string; text: string }> = {
  bronze: { border: 'border-[#CD7F32]/40', bg: 'bg-[#CD7F32]/10', text: 'text-[#CD7F32]' },
  silver: { border: 'border-[#C0C0C0]/40', bg: 'bg-[#C0C0C0]/10', text: 'text-[#C0C0C0]' },
  gold: { border: 'border-[#FFD700]/40', bg: 'bg-[#FFD700]/10', text: 'text-[#FFD700]' },
  diamond: { border: 'border-[#B9F2FF]/40', bg: 'bg-[#B9F2FF]/10', text: 'text-[#B9F2FF]' },
};

const rarityColors: Record<AchievementRarity, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

const rarityLabels: Record<AchievementRarity, string> = {
  common: 'معمولی',
  rare: 'کمیاب',
  epic: 'حماسی',
  legendary: 'افسانه‌ای',
};

const categoryTabs: { key: 'all' | AchievementCategory; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'milestone', label: 'دستاورد' },
  { key: 'collection', label: 'مجموعه' },
  { key: 'stat', label: 'آمار' },
  { key: 'action', label: 'عملکرد' },
];

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const fridayMarket = useGameStore((s) => s.fridayMarket);
  const buyFridayItem = useGameStore((s) => s.buyFridayItem);
  const achievements = useGameStore((s) => s.missions.achievements);
  const totalMissionsCompleted = useGameStore((s) => s.missions.totalMissionsCompleted);
  const [activeCategory, setActiveCategory] = useState<'all' | AchievementCategory>('all');

  const filteredAchievements = activeCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === activeCategory);

  const unlockedAchievements = filteredAchievements.filter((a) => a.unlockedAt);
  const lockedAchievements = filteredAchievements.filter((a) => !a.unlockedAt);
  const totalUnlocked = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-5 py-4 pb-24">
      {/* هدر پروفایل */}
      <Card className="text-center py-6">
        <div className="text-5xl mb-3">{player.avatar}</div>
        <h1 className="text-xl font-black">{player.username}</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Badge text={`سطح ${player.level}`} variant="primary" />
          <Badge text={`اعتبار: ${player.reputation}`} variant="gold" />
        </div>
        <div className="mt-3">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
      </Card>

      {/* اطلاعات سریع */}
      <div className="grid grid-cols-4 gap-2">
        <Card className="text-center py-3">
          <Shield size={16} className="mx-auto text-indigo-400 mb-1" />
          <p className="text-sm font-bold">{player.level}</p>
          <p className="text-[10px] text-fg-muted">سطح</p>
        </Card>
        <Card className="text-center py-3">
          <Star size={16} className="mx-auto text-amber-400 mb-1" />
          <p className="text-sm font-bold">{businesses.length}</p>
          <p className="text-[10px] text-fg-muted">کسب‌وکار</p>
        </Card>
        <Card className="text-center py-3">
          <Trophy size={16} className="mx-auto text-[#F59E0B] mb-1" />
          <p className="text-sm font-bold">{totalMissionsCompleted}</p>
          <p className="text-[10px] text-fg-muted">ماموریت</p>
        </Card>
        <Card className="text-center py-3">
          <Calendar size={16} className="mx-auto text-emerald-400 mb-1" />
          <p className="text-sm font-bold">{totalUnlocked}</p>
          <p className="text-[10px] text-fg-muted">نشان</p>
        </Card>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Trophy size={16} className="text-[#FFD700]" />
          <h2 className="font-bold text-sm">نشان‌ها و دستاوردها</h2>
          <span className="text-[9px] text-fg-faint">{totalUnlocked}/{achievements.length}</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 mb-3">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold shrink-0 transition-all ${
                activeCategory === tab.key
                  ? 'bg-[#6366F1] text-white'
                  : 'bg-surface-card/40 text-fg-muted hover:bg-surface-card/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* نشان‌های کسب شده */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.map((ach) => {
                const tc = tierColors[ach.tier];
                const rc = rarityColors[ach.rarity];
                return (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-[12px] border ${tc.border} ${tc.bg}`}
                  >
                    <span className="text-xl">{ach.badge}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-[11px] font-bold ${tc.text}`}>{ach.title}</p>
                        <span
                          className="text-[7px] font-bold px-1 py-0.5 rounded-[99px]"
                          style={{ backgroundColor: rc + '20', color: rc }}
                        >
                          {rarityLabels[ach.rarity]}
                        </span>
                      </div>
                      <p className="text-[9px] text-fg-faint">{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* نشان‌های قفل */}
        {lockedAchievements.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lock size={12} className="text-fg-faint" />
              <span className="text-[10px] text-fg-muted font-bold">{lockedAchievements.length} باقی‌مانده</span>
            </div>
            <div className="space-y-2">
              {lockedAchievements.map((ach) => {
                const rc = rarityColors[ach.rarity];
                const progressPct = ach.target > 0 ? Math.min(100, (ach.progress / ach.target) * 100) : 0;

                return (
                  <div
                    key={ach.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] border border-line-subtle bg-surface-card/30"
                  >
                    <span className="text-lg grayscale opacity-50 shrink-0">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-bold text-fg-muted">{ach.title}</p>
                        <span
                          className="text-[7px] font-bold px-1 py-0.5 rounded-[99px]"
                          style={{ backgroundColor: rc + '15', color: rc }}
                        >
                          {rarityLabels[ach.rarity]}
                        </span>
                      </div>
                      <p className="text-[9px] text-fg-faint mt-0.5">{ach.description}</p>
                      {/* Progress bar */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-progress-bg rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progressPct}%`,
                              backgroundColor: rc,
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <span className="text-[8px] font-bold font-fa text-fg-faint shrink-0">
                          {ach.progress}/{ach.target}
                        </span>
                      </div>
                      {/* Reward preview */}
                      {ach.reward?.money && ach.reward.money > 0 && (
                        <div className="mt-1">
                          <span className="text-[8px] text-fg-faint">جایزه: </span>
                          <span className="text-[8px] font-bold text-accent-money font-fa">
                            {ach.reward.money.toLocaleString('fa-IR')} ت
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* آمار */}
      <div>
        <h2 className="font-bold text-sm mb-3">وضعیت شخصی</h2>
        <PlayerStatsPanel />
      </div>

      {/* بازار جمعه */}
      <div>
        <h2 className="font-bold text-sm mb-1">بازار جمعه</h2>
        <p className="text-xs text-fg-muted mb-3">آیتم‌های ویژه برای تقویت وضعیت شما</p>
        <div className="grid grid-cols-2 gap-2">
          {fridayMarket.map((item) => {
            const canAfford = player.balance >= item.price;
            const effects = Object.entries(item.effect)
              .map(([k, v]) => `${effectLabels[k] || k} ${(v as number) > 0 ? '+' : ''}${v}`)
              .join('، ');

            return (
              <Card
                key={item.id}
                className={`${!item.available ? 'opacity-40' : ''}`}
              >
                <div className="text-center mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xs font-bold mt-1">{item.name}</p>
                  <MoneyDisplay amount={item.price} size="sm" />
                  <p className="text-[10px] text-fg-muted mt-0.5">{effects}</p>
                </div>
                <Button
                  onClick={() => buyFridayItem(item.id)}
                  disabled={!item.available || !canAfford}
                  fullWidth
                  size="sm"
                  variant="secondary"
                >
                  {!item.available ? 'تمام شد' : canAfford ? 'خرید' : 'موجودی کافی نیست'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
