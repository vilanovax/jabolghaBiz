'use client';

import { LeaderboardEntry } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-zinc-300',
  3: 'text-amber-600',
};

const rankBg: Record<number, string> = {
  1: 'bg-yellow-500/10 border-yellow-500/30',
  2: 'bg-zinc-400/10 border-zinc-400/30',
  3: 'bg-amber-600/10 border-amber-600/30',
};

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const playerId = useGameStore((s) => s.player.id);
  const isMe = entry.playerId === playerId;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors
        ${isMe ? 'bg-indigo-950/30 border-indigo-500/40' : rankBg[entry.rank] || 'bg-zinc-800/40 border-zinc-700/30'}
      `}
    >
      <span className={`text-lg font-black w-8 text-center ${rankColors[entry.rank] || 'text-zinc-500'}`}>
        {entry.rank <= 3 ? ['', '1st', '2nd', '3rd'][entry.rank] : `#${entry.rank}`}
      </span>
      <span className="text-2xl">{entry.avatar}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isMe ? 'text-indigo-300' : 'text-white'}`}>
          {entry.username} {isMe && '(You)'}
        </p>
        <p className="text-[10px] text-zinc-500">
          Lv.{entry.level} · {entry.businessCount} businesses
        </p>
      </div>
      <span className="text-amber-400 font-mono text-sm font-bold">
        ${new Intl.NumberFormat().format(entry.wealth)}
      </span>
    </div>
  );
}
