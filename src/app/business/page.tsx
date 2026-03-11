'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import BusinessCard from '@/components/business/BusinessCard';
import NewBusinessModal from '@/components/business/NewBusinessModal';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function BusinessPage() {
  const businesses = useGameStore((s) => s.businesses);
  const [showNewBiz, setShowNewBiz] = useState(false);

  const totalRevenue = businesses.reduce((sum, b) => sum + b.revenue, 0);
  const totalExpenses = businesses.reduce((sum, b) => sum + b.expenses, 0);
  const totalProfit = businesses.reduce((sum, b) => sum + b.profit, 0);
  const totalEmployees = businesses.reduce((sum, b) => sum + b.employees.length, 0);

  return (
    <div className="space-y-5 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">My Businesses</h1>
        <Button onClick={() => setShowNewBiz(true)} size="sm">
          <span className="flex items-center gap-1">
            <Plus size={16} /> New
          </span>
        </Button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="flex items-center gap-2 p-3">
          <TrendingUp size={16} className="text-emerald-400" />
          <div>
            <p className="text-[10px] text-zinc-500">Revenue</p>
            <MoneyDisplay amount={totalRevenue} size="sm" />
          </div>
        </Card>
        <Card className="flex items-center gap-2 p-3">
          <DollarSign size={16} className="text-amber-400" />
          <div>
            <p className="text-[10px] text-zinc-500">Profit</p>
            <MoneyDisplay amount={totalProfit} size="sm" showSign />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Users size={14} /> {totalEmployees} total employees
        </span>
        <span>Expenses: ${totalExpenses.toLocaleString()}/day</span>
      </div>

      {/* Business List */}
      <div className="space-y-3">
        {businesses.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-3xl mb-2">🏗️</p>
            <p className="text-sm text-zinc-400">No businesses yet</p>
            <p className="text-xs text-zinc-600 mt-1">Start your first business to begin earning!</p>
            <div className="mt-4">
              <Button onClick={() => setShowNewBiz(true)}>
                <span className="flex items-center gap-1">
                  <Plus size={16} /> Create Business
                </span>
              </Button>
            </div>
          </Card>
        ) : (
          businesses.map((biz) => <BusinessCard key={biz.id} business={biz} />)
        )}
      </div>

      {showNewBiz && <NewBusinessModal onClose={() => setShowNewBiz(false)} />}
    </div>
  );
}
