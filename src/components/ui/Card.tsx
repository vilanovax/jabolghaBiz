'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: 'primary' | 'profit' | 'gold' | 'none';
  active?: boolean;
}

const glowStyles = {
  none: '',
  primary: 'shadow-[var(--shadow-glow)] border-[#6366F1]/30',
  profit: 'shadow-[var(--shadow-collect)] border-[#22C55E]/30',
  gold: 'shadow-[var(--shadow-gold)] border-[#FBBF24]/30',
};

export default function Card({ children, className = '', onClick, glow = 'none', active }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-[18px] bg-surface-card/60 border border-line-subtle p-4
        shadow-[var(--shadow-card)] transition-all duration-200
        ${glowStyles[glow]}
        ${active ? 'animate-shimmer' : ''}
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-line-hover active:scale-[0.97]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
