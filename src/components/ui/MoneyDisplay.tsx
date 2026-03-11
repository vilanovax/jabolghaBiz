'use client';

import { useGameStore } from '@/store/gameStore';

interface MoneyDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
}

export default function MoneyDisplay({ amount, size = 'md', showSign = false }: MoneyDisplayProps) {
  const currency = useGameStore((s) => s.currency);
  const formatted = new Intl.NumberFormat('fa-IR').format(Math.abs(amount));
  const isPositive = amount >= 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  };

  return (
    <span
      className={`${sizeClasses[size]} ${
        showSign ? (isPositive ? 'text-emerald-400' : 'text-red-400') : 'text-amber-400'
      } font-fa font-bold`}
    >
      {showSign && (isPositive ? '+' : '-')}{formatted} {currency}
    </span>
  );
}
