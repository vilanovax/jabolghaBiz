'use client';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'profit' | 'gold' | 'upgrade' | 'muted';
}

const styles = {
  primary: 'bg-[#6366F1]/15 text-[#818cf8]',
  profit: 'bg-[#22C55E]/15 text-[#34d399]',
  gold: 'bg-[#FBBF24]/15 text-[#fbbf24]',
  upgrade: 'bg-[#8B5CF6]/15 text-[#a78bfa]',
  muted: 'bg-surface-inset/50 text-fg-muted',
};

export default function Badge({ text, variant = 'primary' }: BadgeProps) {
  return (
    <span className={`px-2 py-0.5 rounded-[999px] text-[10px] font-bold ${styles[variant]}`}>
      {text}
    </span>
  );
}
