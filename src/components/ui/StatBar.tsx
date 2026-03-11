'use client';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  icon: string;
  color: string;
  onClick?: () => void;
}

export default function StatBar({ label, value, max = 100, icon, color, onClick }: StatBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-left ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <span className="text-lg w-7 text-center">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-zinc-400">{label}</span>
          <span className="text-zinc-300 font-medium">{value}/{max}</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </button>
  );
}
