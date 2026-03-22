'use client';

import { useGameStore, xpForLevel } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Zap, Settings, ClipboardList, Crown, Store } from 'lucide-react';
import Link from 'next/link';

interface TopBarProps {
  onMissionsClick?: () => void;
}

export default function TopBar({ onMissionsClick }: TopBarProps) {
  const player = useGameStore((s) => s.player);
  const required = xpForLevel(player.level);
  const xpPct = Math.min(100, Math.round((player.stats.experience / required) * 100));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-line-subtle">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2.5">
        <Link href="/profile" className="flex items-center gap-2.5">
          {/* آواتار با نوار XP دایره‌ای */}
          <div className="relative">
            <span className="text-2xl block">{player.avatar}</span>
            {/* حلقه XP دور آواتار */}
            <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(99,102,241,0.15)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="16" fill="none"
                stroke="#818cf8" strokeWidth="2.5"
                strokeDasharray={`${xpPct} ${100 - xpPct}`}
                strokeDashoffset="25"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-fg leading-none">{player.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#818cf8] font-bold bg-[#6366F1]/15 px-1.5 py-0.5 rounded-[999px]">
                LV {player.level}
              </span>
              <span className="text-[8px] text-fg-faint font-fa font-bold">
                {player.stats.experience}/{required} XP
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-surface-card/60 border border-line-subtle rounded-[999px] px-2.5 py-1">
            <Zap size={13} className="text-[#FBBF24]" />
            <span className="text-[11px] text-fg font-bold font-fa">{player.stats.energy}</span>
          </div>
          <div className="bg-surface-card/60 border border-line-subtle rounded-[999px] px-2.5 py-1">
            <MoneyDisplay amount={player.balance} size="sm" />
          </div>
          <button
            onClick={onMissionsClick}
            className="p-2 rounded-[999px] hover:bg-surface-card/60 transition-colors text-fg-muted hover:text-fg relative"
          >
            <ClipboardList size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
          </button>
          <Link
            href="/managers"
            className="p-2 rounded-[999px] hover:bg-surface-card/60 transition-colors text-[#F59E0B] hover:text-[#D97706]"
          >
            <Crown size={17} />
          </Link>
          <Link
            href="/friday-market"
            className="p-2 rounded-[999px] hover:bg-surface-card/60 transition-colors text-[#22C55E] hover:text-[#16A34A]"
          >
            <Store size={17} />
          </Link>
          <Link
            href="/settings"
            className="p-2 rounded-[999px] hover:bg-surface-card/60 transition-colors text-fg-muted hover:text-fg"
          >
            <Settings size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
