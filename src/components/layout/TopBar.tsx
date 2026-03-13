'use client';

import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Zap, Settings, ClipboardList } from 'lucide-react';
import Link from 'next/link';

interface TopBarProps {
  onMissionsClick?: () => void;
}

export default function TopBar({ onMissionsClick }: TopBarProps) {
  const player = useGameStore((s) => s.player);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-line-subtle">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{player.avatar}</span>
          <div>
            <p className="text-sm font-black text-fg leading-none">{player.username}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-[#818cf8] font-bold bg-[#6366F1]/15 px-1.5 py-0.5 rounded-[999px]">
                LV {player.level}
              </span>
            </div>
          </div>
        </div>

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
