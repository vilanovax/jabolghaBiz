'use client';

import { useState, useEffect } from 'react';

interface AbilityButtonProps {
  abilityName: string;
  abilityIcon: string;
  abilityDescription: string;
  durationMs: number;
  cooldownMs: number;
  lastUsedAt: number | null;
  activeUntil: number | null;
  onUse: () => void;
  disabled?: boolean;
}

export default function AbilityButton({
  abilityName,
  abilityIcon,
  abilityDescription,
  durationMs,
  cooldownMs,
  lastUsedAt,
  activeUntil,
  onUse,
  disabled,
}: AbilityButtonProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive = activeUntil ? now < activeUntil : false;
  const cooldownEnd = lastUsedAt ? lastUsedAt + cooldownMs : 0;
  const isOnCooldown = !isActive && now < cooldownEnd;

  const activeRemaining = isActive && activeUntil ? Math.ceil((activeUntil - now) / 1000) : 0;
  const cooldownRemaining = isOnCooldown ? Math.ceil((cooldownEnd - now) / 1000) : 0;
  const cooldownProgress = isOnCooldown ? 1 - (cooldownEnd - now) / cooldownMs : 0;
  const activeProgress = isActive && activeUntil ? 1 - (activeUntil - now) / durationMs : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
  };

  const canUse = !isActive && !isOnCooldown && !disabled;

  return (
    <button
      onClick={canUse ? onUse : undefined}
      disabled={!canUse}
      className="relative w-full overflow-hidden group"
    >
      {/* Background + progress fill */}
      <div
        className={`
          absolute inset-0 rounded-[14px] transition-all
          ${isActive
            ? 'bg-gradient-to-l from-[#22C55E]/5 to-[#059669]/5'
            : isOnCooldown
              ? 'bg-surface-inset/30'
              : 'bg-gradient-to-l from-[#F59E0B]/8 to-[#D97706]/5'
          }
        `}
      />
      {isActive && (
        <div
          className="absolute inset-y-0 right-0 rounded-[14px] bg-gradient-to-l from-[#22C55E]/20 to-[#059669]/10 transition-all duration-1000"
          style={{ width: `${(1 - activeProgress) * 100}%` }}
        />
      )}
      {isOnCooldown && (
        <div
          className="absolute inset-y-0 right-0 rounded-[14px] bg-surface-inset/20 transition-all duration-1000"
          style={{ width: `${cooldownProgress * 100}%` }}
        />
      )}

      {/* Content */}
      <div
        className={`
          relative flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-right
          border transition-all duration-300
          ${isActive
            ? 'border-[#22C55E]/50 shadow-[0_0_16px_rgba(34,197,94,0.15)]'
            : isOnCooldown
              ? 'border-line-subtle'
              : 'border-[#F59E0B]/30 hover:border-[#F59E0B]/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-[0.97]'
          }
        `}
      >
        {/* Icon orb */}
        <div
          className={`
            relative w-9 h-9 rounded-full flex items-center justify-center shrink-0
            ${isActive
              ? 'bg-[#22C55E]/15 animate-pulse-glow'
              : isOnCooldown
                ? 'bg-surface-inset/40'
                : 'bg-[#F59E0B]/10 group-hover:bg-[#F59E0B]/20'
            }
          `}
        >
          <span className={`text-lg ${isOnCooldown ? 'grayscale opacity-40' : ''}`}>{abilityIcon}</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold truncate ${isOnCooldown ? 'text-fg-muted' : isActive ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
            {abilityName}
          </p>
          <p className="text-[10px] text-fg-muted/60 truncate">{abilityDescription}</p>
        </div>

        {/* State badge */}
        {isActive && (
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs font-black text-[#22C55E] font-fa tabular-nums">
              {formatTime(activeRemaining)}
            </span>
          </div>
        )}
        {isOnCooldown && (
          <div className="shrink-0">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--line-subtle)" strokeWidth="2" opacity="0.3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeDasharray={`${cooldownProgress * 94.2} 94.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-fg-muted font-fa tabular-nums">
                {formatTime(cooldownRemaining)}
              </span>
            </div>
          </div>
        )}
        {canUse && (
          <span className="shrink-0 text-[10px] font-black text-[#F59E0B] bg-[#F59E0B]/15 px-3 py-1.5 rounded-full border border-[#F59E0B]/20 group-hover:bg-[#F59E0B]/25 transition-colors">
            فعال کن
          </span>
        )}
      </div>
    </button>
  );
}
