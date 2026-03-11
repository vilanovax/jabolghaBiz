'use client';

interface BadgeProps {
  text: string;
  color?: string;
}

export default function Badge({ text, color = '#6366f1' }: BadgeProps) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}
