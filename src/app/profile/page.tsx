'use client';

import { useGameStore } from '@/store/gameStore';
import PlayerStatsPanel from '@/components/player/PlayerStatsPanel';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Shield, Star, Calendar, Trophy, Lock } from 'lucide-react';

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

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const fridayMarket = useGameStore((s) => s.fridayMarket);
  const buyFridayItem = useGameStore((s) => s.buyFridayItem);
  const achievements = useGameStore((s) => s.missions.achievements);
  const totalMissionsCompleted = useGameStore((s) => s.missions.totalMissionsCompleted);

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  return (
    <div className="space-y-5 py-4">
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
          <p className="text-sm font-bold">{unlockedAchievements.length}</p>
          <p className="text-[10px] text-fg-muted">نشان</p>
        </Card>
      </div>

      {/* نشان‌ها */}
      {unlockedAchievements.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={14} className="text-[#FFD700]" />
            <h2 className="font-bold text-sm">نشان‌های کسب شده</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {unlockedAchievements.map((ach) => {
              const tc = tierColors[ach.tier];
              return (
                <div
                  key={ach.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[12px] border ${tc.border} ${tc.bg}`}
                >
                  <span className="text-xl">{ach.badge}</span>
                  <div>
                    <p className={`text-[11px] font-bold ${tc.text}`}>{ach.title}</p>
                    <p className="text-[9px] text-white/40">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* نشان‌های قفل */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Lock size={14} className="text-white/30" />
          <h2 className="font-bold text-sm text-white/50">نشان‌های بعدی</h2>
          <span className="text-[9px] text-white/30">{lockedAchievements.length} باقی‌مانده</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {lockedAchievements.slice(0, 6).map((ach) => {
            const tc = tierColors[ach.tier];
            return (
              <div
                key={ach.id}
                className="flex items-center gap-2 px-3 py-2 rounded-[12px] border border-line-subtle bg-surface-card/30 opacity-50"
              >
                <span className="text-lg grayscale">{ach.icon}</span>
                <div>
                  <p className="text-[11px] font-bold text-white/50">{ach.title}</p>
                  <p className="text-[9px] text-white/30">{ach.description}</p>
                </div>
              </div>
            );
          })}
        </div>
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
