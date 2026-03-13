'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { DAILY_BONUS_REWARDS } from '@/data/mock';
import { X } from 'lucide-react';

interface DailyBonusModalProps {
  onClose: () => void;
}

export default function DailyBonusModal({ onClose }: DailyBonusModalProps) {
  const dailyBonus = useGameStore((s) => s.dailyBonus);
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus);
  const canClaim = useGameStore((s) => s.canClaimDailyBonus)();
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

  const currentDay = canClaim ? (dailyBonus.streak % 7) + 1 : dailyBonus.streak;

  const handleClaim = useCallback(() => {
    const amount = claimDailyBonus();
    if (amount !== null) {
      setClaimedAmount(amount);
    }
  }, [claimDailyBonus]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-surface-elevated rounded-[24px] border border-line overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-black flex items-center gap-2">
              🎁 پاداش روزانه
              {dailyBonus.streak > 0 && (
                <span className="text-[9px] bg-[#FBBF24]/15 text-[#FBBF24] px-2 py-0.5 rounded-[999px] font-bold font-fa">
                  {dailyBonus.streak} روز متوالی 🔥
                </span>
              )}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-surface-card text-fg-muted">
              <X size={18} />
            </button>
          </div>

          {/* Reward Grid */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-7 gap-1.5">
              {DAILY_BONUS_REWARDS.map((reward, index) => {
                const dayNum = index + 1;
                const isClaimed = dailyBonus.streak >= dayNum && !canClaim;
                const isToday = dayNum === currentDay && canClaim;
                const isFuture = dayNum > (canClaim ? currentDay : dailyBonus.streak);
                const justClaimed = claimedAmount !== null && dayNum === currentDay;

                return (
                  <div
                    key={dayNum}
                    className={`flex flex-col items-center py-2 rounded-[12px] border transition-all ${
                      justClaimed
                        ? 'border-[#22C55E]/40 bg-[#22C55E]/10 scale-105'
                        : isToday
                          ? 'border-[#FBBF24]/40 bg-[#FBBF24]/10 animate-pulse'
                          : isClaimed
                            ? 'border-[#22C55E]/20 bg-[#22C55E]/5'
                            : 'border-line/30 bg-surface-card/30 opacity-50'
                    }`}
                  >
                    <span className="text-lg">{isClaimed ? '✅' : reward.icon}</span>
                    <span className="text-[8px] text-fg-muted mt-0.5">{reward.label}</span>
                    <span className={`text-[9px] font-bold font-fa mt-0.5 ${
                      isToday ? 'text-[#FBBF24]' : isClaimed ? 'text-[#22C55E]' : 'text-fg-faint'
                    }`}>
                      {(reward.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Claim Button / Status */}
          <div className="px-4 pb-4">
            {claimedAmount !== null ? (
              <div className="text-center py-3">
                <p className="text-[#22C55E] font-black text-lg font-fa animate-collect">
                  +{claimedAmount.toLocaleString('fa-IR')}
                </p>
                <p className="text-[11px] text-fg-muted mt-1">پاداش دریافت شد!</p>
              </div>
            ) : canClaim ? (
              <button
                onClick={handleClaim}
                className="w-full py-3 rounded-[999px] font-black text-sm text-white active:scale-[0.96] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
                }}
              >
                🎁 دریافت پاداش روز {currentDay.toLocaleString('fa-IR')}
              </button>
            ) : (
              <div className="text-center py-2">
                <p className="text-[11px] text-fg-muted">پاداش امروز دریافت شده ✅</p>
                <p className="text-[9px] text-fg-faint mt-0.5">فردا برگردید!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
