'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
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
        rounded-xl font-semibold transition-all duration-200
        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}
