'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { levelUpReward, getUnlocksForLevel } from '@/store/gameStore';

const CONFETTI_COLORS = ['#FFD700', '#F59E0B', '#8B5CF6', '#6366F1', '#22C55E', '#F472B6'];
const CONFETTI_COUNT = 20;

// Title thresholds matching profile page
const TITLE_THRESHOLDS = [
  { level: 50, title: 'امپراتور تجارت' },
  { level: 40, title: 'سلطان بازار' },
  { level: 30, title: 'غول اقتصادی' },
  { level: 20, title: 'تاجر حرفه‌ای' },
  { level: 15, title: 'مدیر موفق' },
  { level: 10, title: 'کارآفرین باتجربه' },
  { level: 5, title: 'کارآفرین نوپا' },
];

function getLevelUpHint(level: number): string | null {
  const newTitle = TITLE_THRESHOLDS.find((t) => t.level === level);
  if (newTitle) return `عنوان جدید: ${newTitle.title}`;
  const nextTitle = [...TITLE_THRESHOLDS].reverse().find((t) => t.level > level);
  if (nextTitle) return `${nextTitle.level - level} سطح تا «${nextTitle.title}»`;
  return null;
}

export default function LevelUpOverlay() {
  const level = useGameStore((s) => s.player.level);
  const prevLevel = useRef(level);
  const [showOverlay, setShowOverlay] = useState(false);
  const [displayLevel, setDisplayLevel] = useState(level);
  const [hint, setHint] = useState<string | null>(null);
  const [reward, setReward] = useState(0);
  const [unlocks, setUnlocks] = useState<string[]>([]);

  useEffect(() => {
    if (prevLevel.current !== level && prevLevel.current > 0 && level > prevLevel.current) {
      setDisplayLevel(level);
      setHint(getLevelUpHint(level));
      setReward(levelUpReward(level));
      setUnlocks(getUnlocksForLevel(level));
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), unlocks.length > 0 ? 5000 : 3500);
      prevLevel.current = level;
      return () => clearTimeout(timer);
    }
    prevLevel.current = level;
  }, [level]);

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {/* Gold flash */}
      <div
        className="absolute inset-0 animate-levelup-flash"
        style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)' }}
      />

      {/* Confetti */}
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: '-10px',
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-in ${Math.random() * 0.5}s forwards`,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Center badge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-levelup-pop text-center max-w-[280px]">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
              boxShadow: '0 0 40px rgba(255,215,0,0.5), 0 0 80px rgba(245,158,11,0.3)',
            }}
          >
            <span className="text-3xl font-black text-white">LV {displayLevel}</span>
          </div>
          <p className="text-lg font-black text-white drop-shadow-lg">سطح جدید!</p>

          {/* جایزه پولی */}
          {reward > 0 && (
            <p className="text-sm font-bold text-[#FFD700] mt-1.5 drop-shadow-lg">
              +{reward.toLocaleString('fa-IR')} تومان 🎁
            </p>
          )}

          {/* عنوان */}
          {hint && (
            <p className="text-xs font-bold text-white/70 mt-1 drop-shadow-lg">{hint}</p>
          )}

          {/* آنلاک‌ها */}
          {unlocks.length > 0 && (
            <div className="mt-3 space-y-1">
              {unlocks.map((u, i) => (
                <p key={i} className="text-[11px] font-bold text-[#22C55E] drop-shadow-lg">
                  🔓 {u}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
