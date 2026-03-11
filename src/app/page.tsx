'use client';

import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import PlayerStatsPanel from '@/components/player/PlayerStatsPanel';
import Badge from '@/components/ui/Badge';
import { TrendingUp, Briefcase, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const player = useGameStore((s) => s.player);
  const businesses = useGameStore((s) => s.businesses);
  const products = useGameStore((s) => s.products);

  const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
  const totalProfit = businesses.reduce((sum, b) => sum + b.profit, 0);
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);

  const topProducts = [...products]
    .sort((a, b) => (b.currentPrice - b.basePrice) / b.basePrice - (a.currentPrice - a.basePrice) / a.basePrice)
    .slice(0, 3);

  return (
    <div className="space-y-5 py-4">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-black">
          Welcome back, <span className="text-indigo-400">{player.username}</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">Here&apos;s your empire overview</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card glow="#6366f1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Balance</p>
          <MoneyDisplay amount={player.balance} size="lg" />
        </Card>
        <Card glow="#10b981">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Daily Profit</p>
          <MoneyDisplay amount={totalProfit} size="lg" showSign />
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center py-3">
          <Briefcase size={18} className="mx-auto text-indigo-400 mb-1" />
          <p className="text-lg font-bold">{businesses.length}</p>
          <p className="text-[10px] text-zinc-500">Businesses</p>
        </Card>
        <Card className="text-center py-3">
          <TrendingUp size={18} className="mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500">Revenue/day</p>
        </Card>
        <Card className="text-center py-3">
          <Star size={18} className="mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold">{totalEmployees}</p>
          <p className="text-[10px] text-zinc-500">Employees</p>
        </Card>
      </div>

      {/* My Businesses - Quick View */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">My Businesses</h2>
          <Link href="/business" className="text-xs text-indigo-400 hover:text-indigo-300">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {businesses.map((biz) => (
            <Link key={biz.id} href="/business">
              <Card className="flex items-center gap-3 hover:bg-zinc-700/40">
                <span className="text-2xl">{biz.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{biz.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge text={`Lv.${biz.level}`} />
                    <span className="text-[10px] text-zinc-500">{biz.employees.length} staff</span>
                  </div>
                </div>
                <MoneyDisplay amount={biz.profit} size="sm" showSign />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Market Trends */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-sm">Trending Products</h2>
          <Link href="/market" className="text-xs text-indigo-400 hover:text-indigo-300">
            Market
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {topProducts.map((prod) => {
            const change = (((prod.currentPrice - prod.basePrice) / prod.basePrice) * 100).toFixed(0);
            const isUp = prod.currentPrice >= prod.basePrice;
            return (
              <Card key={prod.id} className="text-center py-3">
                <span className="text-2xl">{prod.icon}</span>
                <p className="text-xs font-bold mt-1">{prod.name}</p>
                <p className="text-amber-400 font-mono text-xs">${prod.currentPrice}</p>
                <p className={`text-[10px] ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp ? '+' : ''}{change}%
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Player Stats */}
      <div>
        <h2 className="font-bold text-sm mb-3">Your Stats</h2>
        <PlayerStatsPanel />
      </div>
    </div>
  );
}
