'use client';

import { useGameStore } from '@/store/gameStore';
import PlayerStatsPanel from '@/components/player/PlayerStatsPanel';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Shield, Star, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const fridayMarket = useGameStore((s) => s.fridayMarket);
  const buyFridayItem = useGameStore((s) => s.buyFridayItem);

  return (
    <div className="space-y-5 py-4">
      {/* Profile Header */}
      <Card className="text-center py-6">
        <div className="text-5xl mb-3">{player.avatar}</div>
        <h1 className="text-xl font-black">{player.username}</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <Badge text={`Level ${player.level}`} color="#6366f1" />
          <Badge text={`Rep: ${player.reputation}`} color="#f59e0b" />
        </div>
        <div className="mt-3">
          <MoneyDisplay amount={player.balance} size="lg" />
        </div>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center py-3">
          <Shield size={16} className="mx-auto text-indigo-400 mb-1" />
          <p className="text-sm font-bold">{player.level}</p>
          <p className="text-[10px] text-zinc-500">Level</p>
        </Card>
        <Card className="text-center py-3">
          <Star size={16} className="mx-auto text-amber-400 mb-1" />
          <p className="text-sm font-bold">{businesses.length}</p>
          <p className="text-[10px] text-zinc-500">Businesses</p>
        </Card>
        <Card className="text-center py-3">
          <Calendar size={16} className="mx-auto text-emerald-400 mb-1" />
          <p className="text-sm font-bold">{player.createdAt.split('-')[0]}</p>
          <p className="text-[10px] text-zinc-500">Joined</p>
        </Card>
      </div>

      {/* Stats */}
      <div>
        <h2 className="font-bold text-sm mb-3">Personal Stats</h2>
        <PlayerStatsPanel />
      </div>

      {/* Friday Market */}
      <div>
        <h2 className="font-bold text-sm mb-1">Friday Market</h2>
        <p className="text-xs text-zinc-500 mb-3">Special items to boost your stats</p>
        <div className="grid grid-cols-2 gap-2">
          {fridayMarket.map((item) => {
            const canAfford = player.balance >= item.price;
            const effects = Object.entries(item.effect)
              .map(([k, v]) => `${k} ${(v as number) > 0 ? '+' : ''}${v}`)
              .join(', ');

            return (
              <Card
                key={item.id}
                className={`${!item.available ? 'opacity-40' : ''}`}
              >
                <div className="text-center mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xs font-bold mt-1">{item.name}</p>
                  <p className="text-amber-400 font-mono text-xs">${item.price}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{effects}</p>
                </div>
                <Button
                  onClick={() => buyFridayItem(item.id)}
                  disabled={!item.available || !canAfford}
                  fullWidth
                  size="sm"
                  variant="secondary"
                >
                  {!item.available ? 'Sold Out' : canAfford ? 'Buy' : 'No Funds'}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
