'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'upgrade';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] hover:from-[#818cf8] hover:to-[#a78bfa] text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)]',
  secondary: 'bg-surface-inset hover:bg-line-hover text-fg',
  danger: 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] hover:from-[#f87171] hover:to-[#ef4444] text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
  success: 'bg-gradient-to-br from-[#22C55E] to-[#16A34A] hover:from-[#34d399] hover:to-[#22c55e] text-white shadow-[0_4px_14px_rgba(34,197,94,0.35)]',
  upgrade: 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] hover:from-[#a78bfa] hover:to-[#8b5cf6] text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-[999px] font-bold transition-all duration-100
        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}
