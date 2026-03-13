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
    lg: 'text-2xl',
  };

  const colorClass = showSign
    ? isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'
    : 'text-accent-money';

  return (
    <span className={`${sizeClasses[size]} ${colorClass} font-fa font-black`}>
      {showSign && (isPositive ? '+' : '-')}{formatted} {currency}
    </span>
  );
}
