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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm rounded-[24px] border border-[#FBBF24]/20 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            boxShadow: '0 0 60px rgba(251,191,36,0.15), 0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header with glow */}
          <div className="relative pt-5 pb-3 px-4">
            {/* Background glow circle */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #FBBF24 0%, transparent 70%)' }}
            />

            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="text-center relative z-10">
              <span className="text-4xl block mb-2">🎁</span>
              <h2 className="text-base font-black text-white">پاداش روزانه</h2>
              {dailyBonus.streak > 0 && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-[999px]"
                  style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))' }}
                >
                  <span className="text-sm">🔥</span>
                  <span className="text-[11px] text-[#FBBF24] font-black font-fa">
                    {dailyBonus.streak} روز متوالی
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reward Grid */}
          <div className="px-3 py-3">
            <div className="grid grid-cols-7 gap-1.5">
              {DAILY_BONUS_REWARDS.map((reward, index) => {
                const dayNum = index + 1;
                const isClaimed = dailyBonus.streak >= dayNum && !canClaim;
                const isToday = dayNum === currentDay && canClaim;
                const justClaimed = claimedAmount !== null && dayNum === currentDay;

                return (
                  <div
                    key={dayNum}
                    className={`flex flex-col items-center py-2.5 rounded-[14px] border transition-all duration-300 ${
                      justClaimed
                        ? 'border-[#22C55E]/50 scale-110'
                        : isToday
                          ? 'border-[#FBBF24]/50'
                          : isClaimed
                            ? 'border-[#22C55E]/30'
                            : 'border-white/10'
                    }`}
                    style={{
                      background: justClaimed
                        ? 'linear-gradient(180deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)'
                        : isToday
                          ? 'linear-gradient(180deg, rgba(251,191,36,0.2) 0%, rgba(251,191,36,0.05) 100%)'
                          : isClaimed
                            ? 'linear-gradient(180deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.02) 100%)'
                            : 'rgba(255,255,255,0.03)',
                      boxShadow: isToday && !justClaimed
                        ? '0 0 12px rgba(251,191,36,0.3), inset 0 0 12px rgba(251,191,36,0.1)'
                        : justClaimed
                          ? '0 0 16px rgba(34,197,94,0.4)'
                          : 'none',
                    }}
                  >
                    <span className={`text-xl ${isToday && !justClaimed ? 'animate-bounce' : ''}`}>
                      {isClaimed || justClaimed ? '✅' : reward.icon}
                    </span>
                    <span className="text-[7px] text-white/40 mt-1 font-bold">{reward.label}</span>
                    <span className={`text-[10px] font-black font-fa mt-0.5 ${
                      isToday ? 'text-[#FBBF24]' : isClaimed || justClaimed ? 'text-[#22C55E]' : 'text-white/30'
                    }`}>
                      {(reward.amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streak Progress */}
          <div className="px-4 pb-2">
            <div className="h-1.5 rounded-[999px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-[999px] transition-all duration-700"
                style={{
                  width: `${(currentDay / 7) * 100}%`,
                  background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                  boxShadow: '0 0 8px rgba(251,191,36,0.5)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[8px]">
              <span className="text-white/30">روز ۱</span>
              <span className="text-[#FBBF24] font-bold">🏆 جایزه بزرگ</span>
              <span className="text-white/30">روز ۷</span>
            </div>
          </div>

          {/* Claim Button / Status */}
          <div className="px-4 pt-2 pb-5">
            {claimedAmount !== null ? (
              <div className="text-center py-4">
                <p className="text-[#22C55E] font-black text-2xl font-fa animate-collect">
                  +{claimedAmount.toLocaleString('fa-IR')}
                </p>
                <p className="text-[11px] text-white/50 mt-2">پاداش به موجودی اضافه شد!</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-8 py-2 rounded-[999px] text-xs font-bold text-white/70 bg-white/10 hover:bg-white/15 active:scale-95 transition-all"
                >
                  بستن
                </button>
              </div>
            ) : canClaim ? (
              <button
                onClick={handleClaim}
                className="w-full py-4 rounded-[18px] font-black text-base text-white active:scale-[0.96] transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #D97706)',
                  boxShadow: '0 6px 30px rgba(251,191,36,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  🎁 دریافت پاداش روز <span className="font-fa">{currentDay.toLocaleString('fa-IR')}</span>
                </span>
              </button>
            ) : (
              <div className="text-center py-3">
                <p className="text-[12px] text-white/50">پاداش امروز دریافت شده ✅</p>
                <p className="text-[10px] text-white/30 mt-1">فردا برگردید!</p>
                <button
                  onClick={onClose}
                  className="mt-3 px-8 py-2 rounded-[999px] text-xs font-bold text-white/70 bg-white/10 hover:bg-white/15 active:scale-95 transition-all"
                >
                  بستن
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
