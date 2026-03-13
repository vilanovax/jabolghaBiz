'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'profit' | 'gold' | 'upgrade' | 'muted';
  size?: 'sm' | 'md';
  label?: string;
  showValue?: boolean;
  className?: string;
}

const fillColors = {
  primary: 'bg-[#6366F1]',
  profit: 'bg-[#22C55E]',
  gold: 'bg-[#FBBF24]',
  upgrade: 'bg-[#8B5CF6]',
  muted: 'bg-fg-muted',
};

export default function ProgressBar({
  value,
  max,
  color = 'primary',
  size = 'sm',
  label,
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const h = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-[9px] mb-1">
          {label && <span className="text-fg-muted">{label}</span>}
          {showValue && <span className="text-fg font-fa font-bold">{value}/{max}</span>}
        </div>
      )}
      <div className={`${h} bg-progress-bg rounded-[999px] overflow-hidden`}>
        <div
          className={`h-full rounded-[999px] transition-all duration-500 ${fillColors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
