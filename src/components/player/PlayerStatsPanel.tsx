'use client';

import { useGameStore } from '@/store/gameStore';
import StatBar from '@/components/ui/StatBar';

const statConfig = [
  { key: 'happiness' as const, label: 'شادی', icon: '😊', color: '#f472b6' },
  { key: 'hunger' as const, label: 'گرسنگی', icon: '🍔', color: '#fb923c' },
  { key: 'energy' as const, label: 'انرژی', icon: '⚡', color: '#facc15' },
  { key: 'intelligence' as const, label: 'هوش', icon: '🧠', color: '#818cf8' },
  { key: 'experience' as const, label: 'تجربه', icon: '⭐', color: '#34d399' },
];

export default function PlayerStatsPanel() {
  const stats = useGameStore((s) => s.player.stats);

  return (
    <div className="space-y-2">
      {statConfig.map((stat) => (
        <StatBar
          key={stat.key}
          label={stat.label}
          value={stats[stat.key]}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
