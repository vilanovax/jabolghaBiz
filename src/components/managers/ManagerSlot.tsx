'use client';

import { HiredManager } from '@/types';
import { Lock, X } from 'lucide-react';
import { MANAGER_CONFIG } from '@/data/mock';

const rarityGlow: Record<string, string> = {
  common: 'shadow-[0_0_12px_rgba(156,163,175,0.1)]',
  rare: 'shadow-[0_0_16px_rgba(59,130,246,0.2)]',
  epic: 'shadow-[0_0_20px_rgba(139,92,246,0.25)]',
  legendary: 'shadow-[0_0_24px_rgba(245,158,11,0.3)]',
};

const rarityBorder: Record<string, string> = {
  common: 'border-[#9CA3AF]/20',
  rare: 'border-[#3B82F6]/30',
  epic: 'border-[#8B5CF6]/40',
  legendary: 'border-[#F59E0B]/50',
};

const rarityAccent: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

const passiveLabels: Record<string, string> = {
  revenue: 'درآمد',
  production_speed: 'سرعت',
  sale_rate: 'فروش',
};

interface ManagerSlotProps {
  index: number;
  manager: HiredManager | null;
  locked: boolean;
  unlockLevel: number;
  onRemove: () => void;
  onClick: () => void;
}

export default function ManagerSlot({ index, manager, locked, unlockLevel, onRemove, onClick }: ManagerSlotProps) {
  const levelMult = manager ? 1 + (manager.level - 1) * MANAGER_CONFIG.levelPassiveBoost : 1;
  const effectivePassive = manager ? manager.passiveEffect.value * levelMult : 0;

  if (locked) {
    return (
      <div className="relative rounded-[18px] border-2 border-dashed border-line-subtle/40 bg-surface-card/20 p-4 flex flex-col items-center justify-center gap-2 min-h-[120px]">
        <div className="w-10 h-10 rounded-full bg-surface-inset/30 flex items-center justify-center">
          <Lock size={16} className="text-fg-faint" />
        </div>
        <p className="text-[10px] text-fg-faint font-bold">اسلات {index + 1}</p>
        <div className="flex items-center gap-1 bg-surface-inset/30 rounded-full px-2 py-0.5">
          <span className="text-[9px] text-fg-faint">🔓 لول {unlockLevel}</span>
        </div>
      </div>
    );
  }

  if (!manager) {
    return (
      <button
        onClick={onClick}
        className="
          relative rounded-[18px] border-2 border-dashed border-[#6366F1]/20
          bg-gradient-to-b from-[#6366F1]/5 to-transparent
          p-4 flex flex-col items-center justify-center gap-2 min-h-[120px]
          hover:border-[#6366F1]/40 hover:from-[#6366F1]/10
          active:scale-[0.97] transition-all group
        "
      >
        <div className="w-12 h-12 rounded-full bg-[#6366F1]/8 flex items-center justify-center group-hover:bg-[#6366F1]/15 transition-colors">
          <span className="text-xl text-[#818cf8]">+</span>
        </div>
        <p className="text-[10px] text-fg-muted font-bold">اسلات {index + 1}</p>
        <p className="text-[9px] text-[#818cf8]">انتخاب مدیر</p>
      </button>
    );
  }

  const color = rarityAccent[manager.rarity];

  return (
    <div
      className={`
        relative rounded-[18px] border-2 ${rarityBorder[manager.rarity]} ${rarityGlow[manager.rarity]}
        bg-gradient-to-b from-surface-card/80 to-surface-card/40
        p-3 min-h-[120px] overflow-hidden
      `}
    >
      {/* Rarity glow orb behind icon */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-[30px] opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 left-2 w-6 h-6 rounded-full bg-surface-inset/50 flex items-center justify-center text-fg-faint hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors z-10"
      >
        <X size={12} />
      </button>

      {/* Content */}
      <div className="relative flex flex-col items-center text-center gap-1.5">
        <span className="text-3xl">{manager.icon}</span>
        <p className="text-xs font-black text-fg truncate w-full">{manager.name}</p>
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            L{manager.level}
          </span>
          <span className="text-[9px] font-bold" style={{ color }}>
            +{Math.round(effectivePassive * 100)}% {passiveLabels[manager.passiveEffect.type]}
          </span>
        </div>
      </div>
    </div>
  );
}
