'use client';

import { useState, useEffect } from 'react';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import AbilityButton from './AbilityButton';
import { HiredManager, ManagerTemplate } from '@/types';
import { MANAGER_CONFIG, getManagerUpgradeCost } from '@/data/mock';
import { Lock, ArrowUp, Sparkles, Zap, TrendingUp, ShoppingCart } from 'lucide-react';

// ===== Rarity theming =====

const rarityTheme: Record<string, {
  border: string; glow: string; bg: string; badge: string; badgeBg: string;
  accent: string; gradFrom: string; gradTo: string;
}> = {
  common: {
    border: 'border-[#9CA3AF]/20', glow: '', bg: 'from-[#9CA3AF]/5 to-transparent',
    badge: 'text-[#9CA3AF]', badgeBg: 'bg-[#9CA3AF]/10 border-[#9CA3AF]/20',
    accent: '#9CA3AF', gradFrom: '#9CA3AF', gradTo: '#6B7280',
  },
  rare: {
    border: 'border-[#3B82F6]/25', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)]',
    bg: 'from-[#3B82F6]/5 to-transparent',
    badge: 'text-[#3B82F6]', badgeBg: 'bg-[#3B82F6]/10 border-[#3B82F6]/20',
    accent: '#3B82F6', gradFrom: '#3B82F6', gradTo: '#2563EB',
  },
  epic: {
    border: 'border-[#8B5CF6]/30', glow: 'shadow-[0_0_24px_rgba(139,92,246,0.15)]',
    bg: 'from-[#8B5CF6]/5 to-transparent',
    badge: 'text-[#8B5CF6]', badgeBg: 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20',
    accent: '#8B5CF6', gradFrom: '#8B5CF6', gradTo: '#7C3AED',
  },
  legendary: {
    border: 'border-[#F59E0B]/35', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    bg: 'from-[#F59E0B]/8 to-[#D97706]/3',
    badge: 'text-[#F59E0B]', badgeBg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20',
    accent: '#F59E0B', gradFrom: '#F59E0B', gradTo: '#D97706',
  },
};

const rarityLabels: Record<string, string> = {
  common: 'عادی', rare: 'کمیاب', epic: 'حماسی', legendary: 'افسانه‌ای',
};

const rarityStars: Record<string, string> = {
  common: '★', rare: '★★', epic: '★★★', legendary: '★★★★',
};

const classIcons: Record<string, typeof Zap> = {
  financial: TrendingUp, operational: Zap, marketing: ShoppingCart,
};

const classLabels: Record<string, string> = {
  financial: 'مالی', operational: 'عملیاتی', marketing: 'بازاریابی',
};

const passiveLabels: Record<string, string> = {
  revenue: 'درآمد', production_speed: 'سرعت تولید', sale_rate: 'سرعت فروش',
};

// ===== Hired Manager Card =====

interface HiredManagerCardProps {
  manager: HiredManager;
  isActive: boolean;
  balance: number;
  onActivate: (slotIndex: number) => void;
  onUseAbility: () => void;
  onUpgrade: () => void;
  onCompleteUpgrade: () => void;
  availableSlots: number[];
}

export function HiredManagerCard({
  manager, isActive, balance, onActivate, onUseAbility, onUpgrade, onCompleteUpgrade, availableSlots,
}: HiredManagerCardProps) {
  const [now, setNow] = useState(Date.now());
  const theme = rarityTheme[manager.rarity];
  const levelMult = 1 + (manager.level - 1) * MANAGER_CONFIG.levelPassiveBoost;
  const effectivePassive = manager.passiveEffect.value * levelMult;
  const ClassIcon = classIcons[manager.managerClass];

  useEffect(() => {
    if (!manager.upgradeEndsAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [manager.upgradeEndsAt]);

  const isUpgrading = manager.upgradeStartedAt && manager.upgradeEndsAt;
  const upgradeComplete = isUpgrading && now >= manager.upgradeEndsAt!;
  const upgradeRemainingSec = isUpgrading && !upgradeComplete
    ? Math.ceil((manager.upgradeEndsAt! - now) / 1000) : 0;

  const upgradeCost = getManagerUpgradeCost(manager.baseHireCost, manager.level);
  const canUpgrade = !isUpgrading && manager.level < manager.maxLevel && balance >= upgradeCost;

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Level dots
  const levelDots = Array.from({ length: manager.maxLevel }, (_, i) => i < manager.level);

  return (
    <div
      className={`
        relative rounded-[20px] border ${theme.border} ${theme.glow}
        bg-gradient-to-b ${theme.bg}
        bg-surface-card/60 overflow-hidden transition-all
      `}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-[2px] rounded-b-full"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}60, transparent)` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Icon container */}
          <div className="relative">
            <div
              className="w-14 h-14 rounded-[16px] flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}05)` }}
            >
              <span className="text-3xl">{manager.icon}</span>
            </div>
            {isActive && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                <Sparkles size={10} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-fg truncate">{manager.name}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badge}`}>
                {rarityLabels[manager.rarity]}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <ClassIcon size={11} style={{ color: theme.accent }} />
              <span className="text-[10px] text-fg-muted">{classLabels[manager.managerClass]}</span>
              <span className="text-[10px]" style={{ color: theme.accent }}>{rarityStars[manager.rarity]}</span>
            </div>
            {/* Level dots */}
            <div className="flex items-center gap-1 mt-1.5">
              {levelDots.map((filled, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: filled ? theme.accent : 'var(--surface-inset)',
                    boxShadow: filled ? `0 0 6px ${theme.accent}40` : 'none',
                  }}
                />
              ))}
              <span className="text-[9px] text-fg-muted mr-1 font-fa">L{manager.level}</span>
            </div>
          </div>
        </div>

        {/* Passive Effect */}
        <div
          className="rounded-[14px] px-3.5 py-2.5 mb-3 border"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)`,
            borderColor: `${theme.accent}15`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-fg-muted">اثر دائمی</span>
            <span className="text-[9px] text-fg-muted font-fa">
              حقوق: {manager.salary.toLocaleString('fa-IR')} / سیکل
            </span>
          </div>
          <p className="text-base font-black mt-0.5" style={{ color: theme.accent }}>
            +{Math.round(effectivePassive * 100)}% {passiveLabels[manager.passiveEffect.type]}
          </p>
        </div>

        {/* Ability (only for active managers) */}
        {isActive && (
          <div className="mb-3">
            <p className="text-[10px] text-fg-muted mb-1.5">⚡ قدرت ویژه</p>
            <AbilityButton
              abilityName={manager.ability.name}
              abilityIcon={manager.ability.icon}
              abilityDescription={manager.ability.description}
              durationMs={manager.ability.durationMs}
              cooldownMs={manager.ability.cooldownMs}
              lastUsedAt={manager.lastAbilityUsedAt}
              activeUntil={manager.abilityActiveUntil}
              onUse={onUseAbility}
            />
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-2">
          {!isActive && availableSlots.length > 0 && (
            <button
              onClick={() => onActivate(availableSlots[0])}
              className="
                flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px]
                bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white
                font-bold text-xs shadow-[0_4px_14px_rgba(99,102,241,0.3)]
                hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]
                active:scale-[0.96] transition-all
              "
            >
              <Sparkles size={13} />
              فعال‌سازی
            </button>
          )}

          {upgradeComplete ? (
            <button
              onClick={onCompleteUpgrade}
              className="
                flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px]
                bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white
                font-bold text-xs shadow-[0_4px_14px_rgba(34,197,94,0.3)]
                active:scale-[0.96] transition-all animate-pulse-glow
              "
            >
              ✅ تکمیل ارتقا
            </button>
          ) : isUpgrading ? (
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] bg-surface-inset/30 border border-line-subtle">
              <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin" />
              <span className="text-[11px] font-bold text-[#8B5CF6] font-fa tabular-nums">
                {formatDuration(upgradeRemainingSec)}
              </span>
            </div>
          ) : manager.level < manager.maxLevel ? (
            <button
              onClick={onUpgrade}
              disabled={!canUpgrade}
              className={`
                flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px]
                font-bold text-xs transition-all active:scale-[0.96]
                ${canUpgrade
                  ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)]'
                  : 'bg-surface-inset/30 text-fg-muted border border-line-subtle cursor-not-allowed'
                }
              `}
            >
              <ArrowUp size={13} />
              L{manager.level + 1} · <MoneyDisplay amount={upgradeCost} size="sm" />
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[12px] bg-[#22C55E]/8 border border-[#22C55E]/20">
              <span className="text-[11px] font-bold text-[#22C55E]">⭐ حداکثر سطح</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Template Card (not hired) =====

interface TemplateManagerCardProps {
  template: ManagerTemplate;
  balance: number;
  playerLevel: number;
  isUnlocked: boolean;
  onHire: () => void;
}

export function TemplateManagerCard({ template, balance, playerLevel, isUnlocked, onHire }: TemplateManagerCardProps) {
  const theme = rarityTheme[template.rarity];
  const canAfford = balance >= template.hireCost;
  const meetsLevel = playerLevel >= template.unlockLevel;
  const ClassIcon = classIcons[template.managerClass];

  if (!isUnlocked) {
    return (
      <div className="relative rounded-[20px] border border-line-subtle/40 bg-surface-card/20 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-[14px] bg-surface-inset/20 flex items-center justify-center">
            <Lock size={18} className="text-fg-faint" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-fg-muted/50">{template.name}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badge} opacity-40`}>
                {rarityLabels[template.rarity]}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {!meetsLevel && (
                <span className="text-[10px] text-fg-faint flex items-center gap-0.5">
                  🔓 لول {template.unlockLevel}
                </span>
              )}
              {template.unlockCondition && (
                <span className="text-[10px] text-fg-faint">📋 شرط آنلاک</span>
              )}
            </div>
          </div>
          <span className="text-[10px] opacity-30" style={{ color: theme.accent }}>{rarityStars[template.rarity]}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative rounded-[20px] border ${theme.border} ${theme.glow}
        bg-gradient-to-b ${theme.bg}
        bg-surface-card/60 overflow-hidden
      `}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-[2px] rounded-b-full"
        style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}50, transparent)` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-[16px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${theme.accent}15, ${theme.accent}05)` }}
          >
            <span className="text-3xl">{template.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-fg truncate">{template.name}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badge}`}>
                {rarityLabels[template.rarity]}
              </span>
            </div>
            <p className="text-[10px] text-fg-muted mt-0.5">{template.description}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ClassIcon size={11} style={{ color: theme.accent }} />
              <span className="text-[10px] text-fg-muted">{classLabels[template.managerClass]}</span>
              <span className="text-[10px]" style={{ color: theme.accent }}>{rarityStars[template.rarity]}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Passive */}
          <div
            className="rounded-[12px] px-3 py-2 border"
            style={{
              background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)`,
              borderColor: `${theme.accent}15`,
            }}
          >
            <p className="text-[9px] text-fg-muted">اثر دائمی</p>
            <p className="text-sm font-black" style={{ color: theme.accent }}>
              +{Math.round(template.passiveEffect.value * 100)}%
            </p>
            <p className="text-[9px] text-fg-muted">{passiveLabels[template.passiveEffect.type]}</p>
          </div>
          {/* Ability */}
          <div className="rounded-[12px] px-3 py-2 bg-surface-inset/20 border border-line-subtle/30">
            <p className="text-[9px] text-fg-muted">قدرت ویژه</p>
            <p className="text-xs font-bold text-fg mt-0.5 truncate">
              {template.ability.icon} {template.ability.name}
            </p>
            <p className="text-[9px] text-fg-muted truncate">{template.ability.description}</p>
          </div>
        </div>

        {/* Hire button */}
        <button
          onClick={onHire}
          disabled={!canAfford}
          className={`
            w-full flex items-center justify-center gap-2 py-3 rounded-[14px]
            font-bold text-sm transition-all active:scale-[0.96]
            ${canAfford
              ? `text-white shadow-[0_4px_16px_${theme.accent}30]`
              : 'bg-surface-inset/30 text-fg-muted border border-line-subtle cursor-not-allowed'
            }
          `}
          style={canAfford ? {
            background: `linear-gradient(135deg, ${theme.gradFrom}, ${theme.gradTo})`,
          } : undefined}
        >
          استخدام · <MoneyDisplay amount={template.hireCost} size="sm" />
        </button>
      </div>
    </div>
  );
}
