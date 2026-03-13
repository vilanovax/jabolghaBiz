'use client';

interface StatRowProps {
  label: string;
  value: number;
  max?: number;
  icon: string;
  color: string;
  onClick?: () => void;
}

export default function StatRow({ label, value, max = 100, icon, color, onClick }: StatRowProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full py-2 transition-colors text-right ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span className="text-lg w-7 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-fg-secondary font-medium">{label}</span>
          <span className="text-fg font-bold font-fa">{value}{max !== 100 ? `/${max}` : ''}</span>
        </div>
        <div className="h-1.5 bg-progress-bg rounded-[999px] overflow-hidden">
          <div
            className="h-full rounded-[999px] transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </button>
  );
}
