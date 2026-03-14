'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { AchievementRarity } from '@/types';
import MoneyDisplay from '@/components/ui/MoneyDisplay';

const rarityConfig: Record<AchievementRarity, { label: string; color: string; glow: string }> = {
  common: { label: 'معمولی', color: '#9CA3AF', glow: 'rgba(156,163,175,0.2)' },
  rare: { label: 'کمیاب', color: '#3B82F6', glow: 'rgba(59,130,246,0.25)' },
  epic: { label: 'حماسی', color: '#8B5CF6', glow: 'rgba(139,92,246,0.25)' },
  legendary: { label: 'افسانه‌ای', color: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
};

export default function AchievementToast() {
  const queue = useGameStore((s) => s.achievementToastQueue);
  const dismiss = useGameStore((s) => s.dismissAchievementToast);
  const [visible, setVisible] = useState(false);

  const current = queue[0];

  useEffect(() => {
    if (!current) {
      setVisible(false);
      return;
    }

    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 50);

    // Auto dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(dismiss, 300); // wait for exit animation
    }, 3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [current, dismiss]);

  if (!current) return null;

  const rarity = rarityConfig[current.rarity];

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-[60] flex justify-center px-4 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div
        className="max-w-lg w-full rounded-[16px] px-4 py-3 border backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, ${rarity.glow}, rgba(0,0,0,0.6))`,
          borderColor: rarity.color + '40',
          boxShadow: `0 8px 32px ${rarity.glow}`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{current.badge}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white">{current.title}</p>
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded-[99px]"
                style={{
                  backgroundColor: rarity.color + '20',
                  color: rarity.color,
                }}
              >
                {rarity.label}
              </span>
            </div>
            <p className="text-[10px] text-white/60 mt-0.5">{current.description}</p>
            {current.reward?.money && current.reward.money > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9px] text-white/40">جایزه:</span>
                <MoneyDisplay amount={current.reward.money} size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
