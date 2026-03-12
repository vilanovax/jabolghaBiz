'use client';

import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  const player = useGameStore((s) => s.player);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-nav/95 backdrop-blur-md border-b border-nav-line">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{player.avatar}</span>
          <div>
            <p className="text-sm font-bold text-fg leading-none">{player.username}</p>
            <p className="text-[10px] text-fg-muted">سطح {player.level}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-card rounded-full px-3 py-1">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs text-fg-secondary font-medium">{player.stats.energy}</span>
          </div>
          <div className="bg-surface-card rounded-full px-3 py-1">
            <MoneyDisplay amount={player.balance} size="sm" />
          </div>
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-surface-card transition-colors text-fg-secondary hover:text-fg"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
