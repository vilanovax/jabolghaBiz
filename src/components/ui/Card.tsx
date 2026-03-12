'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: string;
}

export default function Card({ children, className = '', onClick, glow }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl bg-surface-card/60 border border-line-subtle p-4
        backdrop-blur-sm transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:border-line-hover active:scale-[0.98]' : ''}
        ${className}
      `}
      style={glow ? { boxShadow: `0 0 20px ${glow}22` } : undefined}
    >
      {children}
    </div>
  );
}
