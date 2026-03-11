'use client';

interface MoneyDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
}

export default function MoneyDisplay({ amount, size = 'md', showSign = false }: MoneyDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US').format(Math.abs(amount));
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
      } font-mono`}
    >
      {showSign && (isPositive ? '+' : '-')}${formatted}
    </span>
  );
}
