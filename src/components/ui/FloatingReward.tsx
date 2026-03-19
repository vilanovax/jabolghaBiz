'use client';

import { useEffect } from 'react';
import { useGameStore, FloatingRewardItem } from '@/store/gameStore';

function FloatingRewardBubble({ reward, onDone }: { reward: FloatingRewardItem; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  const isNegative = reward.amount < 0;
  const amountStr = isNegative
    ? `${reward.amount.toLocaleString('fa-IR')} تومان`
    : `+${reward.amount.toLocaleString('fa-IR')} تومان`;

  return (
    <div
      className="animate-collect pointer-events-none flex flex-col items-center gap-0.5"
      style={{ position: 'absolute', left: '50%', bottom: '80px', transform: 'translateX(-50%)' }}
    >
      <span
        className={`text-lg font-black font-fa px-3 py-1 rounded-full shadow-lg ${
          isNegative
            ? 'text-[#EF4444] bg-[#EF4444]/15 border border-[#EF4444]/20'
            : 'text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/20'
        }`}
      >
        {amountStr}
      </span>
      {reward.label && (
        <span className="text-[10px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded-full">
          {reward.label}
        </span>
      )}
      {reward.subtitle && (
        <span className="text-[9px] text-fg-muted">{reward.subtitle}</span>
      )}
    </div>
  );
}

export default function FloatingRewardLayer() {
  const rewards = useGameStore((s) => s.floatingRewards);
  const clearReward = useGameStore((s) => s.clearFloatingReward);

  if (rewards.length === 0) return null;

  // Show only most recent reward to avoid clutter
  const reward = rewards[rewards.length - 1];

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      <FloatingRewardBubble
        key={reward.id}
        reward={reward}
        onDone={() => clearReward(reward.id)}
      />
    </div>
  );
}
