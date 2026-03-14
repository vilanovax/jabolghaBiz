'use client';

import { useState, useEffect } from 'react';
import { ActiveEvent } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { EVENT_TEMPLATES } from '@/data/mock';

interface EventBannerProps {
  event: ActiveEvent;
  showFull?: boolean;  // true = on home page (wider, more info)
}

export default function EventBanner({ event, showFull = false }: EventBannerProps) {
  const respondToEvent = useGameStore((s) => s.respondToEvent);
  const balance = useGameStore((s) => s.player.balance);
  const [timeLeft, setTimeLeft] = useState('');

  const template = EVENT_TEMPLATES.find((t) => t.id === event.templateId);
  const hasResponse = template?.responseOptions && !event.responded;

  useEffect(() => {
    const update = () => {
      const left = Math.max(0, event.expiresAt - Date.now());
      if (left <= 0) {
        setTimeLeft('۰:۰۰');
        return;
      }
      const mins = Math.floor(left / 60000);
      const secs = Math.floor((left % 60000) / 1000);
      setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event.expiresAt]);

  // Instant events (durationMs=0) don't show banner
  if (event.expiresAt - event.startedAt <= 10_000 && event.effect === 'instant_balance') return null;

  const isPositive = event.isPositive;
  const effectLabel = event.effect === 'revenue_multiplier'
    ? `درآمد ×${event.effectValue.toFixed(1)}`
    : event.effect === 'expense_multiplier'
      ? `هزینه ×${event.effectValue.toFixed(1)}`
      : '';

  return (
    <div
      className={`rounded-[14px] px-3 py-2 transition-all ${isPositive ? 'animate-event-pulse-green' : 'animate-event-pulse-red'}`}
      style={{
        background: isPositive
          ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))'
          : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
        border: `1px solid ${isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{event.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-black ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {event.title}
          </p>
          {showFull && (
            <p className="text-[9px] text-fg-muted mt-0.5 truncate">{event.description}</p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[9px] font-bold font-fa ${isPositive ? 'text-[#22C55E]/70' : 'text-[#EF4444]/70'}`}>
              {effectLabel}
            </span>
            {event.responded && (
              <span className="text-[8px] text-[#6366F1] bg-[#6366F1]/10 px-1.5 py-0.5 rounded-[999px] font-bold">واکنش داده شد</span>
            )}
          </div>
        </div>
        <div className="text-center shrink-0">
          <p className={`text-[12px] font-black font-fa ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{timeLeft}</p>
          <p className="text-[7px] text-fg-muted">باقیمانده</p>
        </div>
      </div>

      {/* Response button */}
      {hasResponse && template.responseOptions && (
        <div className="mt-2 pt-2 border-t border-line-subtle">
          {template.responseOptions.map((opt) => {
            const canAfford = balance >= opt.cost;
            return (
              <button
                key={opt.id}
                onClick={() => respondToEvent(event.id, opt.id)}
                disabled={!canAfford}
                className="w-full flex items-center justify-between bg-surface-card/40 hover:bg-surface-card/60 disabled:opacity-40 rounded-[10px] px-2.5 py-1.5 transition-all active:scale-[0.97]"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-fg-secondary">
                  {opt.icon} {opt.label}
                </span>
                <span className="text-[10px] font-black font-fa text-accent-money">{opt.cost.toLocaleString('fa-IR')}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
