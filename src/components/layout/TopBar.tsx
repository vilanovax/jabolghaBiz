'use client';

import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  const player = useGameStore((s) => s.player);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{player.avatar}</span>
          <div>
            <p className="text-sm font-bold text-white leading-none">{player.username}</p>
            <p className="text-[10px] text-zinc-500">سطح {player.level}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800 rounded-full px-3 py-1">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs text-zinc-300 font-medium">{player.stats.energy}</span>
          </div>
          <div className="bg-zinc-800 rounded-full px-3 py-1">
            <MoneyDisplay amount={player.balance} size="sm" />
          </div>
          <Link
            href="/settings"
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
