'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { EVENT_TEMPLATES } from '@/data/mock';
import { X } from 'lucide-react';

interface EventModalProps {
  eventId: string;
  onClose: () => void;
}

export default function EventModal({ eventId, onClose }: EventModalProps) {
  const activeEvents = useGameStore((s) => s.randomEvents.activeEvents);
  const respondToEvent = useGameStore((s) => s.respondToEvent);
  const balance = useGameStore((s) => s.player.balance);
  const [responded, setResponded] = useState(false);

  const event = activeEvents.find((e) => e.id === eventId);
  if (!event) return null;

  const template = EVENT_TEMPLATES.find((t) => t.id === event.templateId);
  const isPositive = event.isPositive;
  const isInstant = event.effect === 'instant_balance';

  // Effect description
  let effectText = '';
  if (event.effect === 'revenue_multiplier') {
    const pct = Math.round(Math.abs(event.effectValue - 1) * 100);
    effectText = isPositive ? `+${pct}% درآمد` : `-${pct}% درآمد`;
  } else if (event.effect === 'expense_multiplier') {
    const pct = Math.round(Math.abs(event.effectValue - 1) * 100);
    effectText = isPositive ? `-${pct}% هزینه` : `+${pct}% هزینه`;
  }

  // Duration text
  const durationMins = template ? Math.round(template.durationMs / 60000) : 0;
  const scopeText = event.scope === 'global' ? 'همه شرکت‌ها' : event.targetBusinessType ? `شرکت‌های مرتبط` : '';

  const handleRespond = (responseId: string) => {
    respondToEvent(event.id, responseId);
    setResponded(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-event-flash">
        <div
          className="w-full max-w-sm rounded-[24px] border overflow-hidden"
          style={{
            background: isPositive
              ? 'linear-gradient(180deg, #0a2e1a 0%, #0f2419 50%, #0d1f16 100%)'
              : 'linear-gradient(180deg, #2e0a0a 0%, #241010 50%, #1f0d0d 100%)',
            borderColor: isPositive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
            boxShadow: isPositive
              ? '0 0 60px rgba(34,197,94,0.15), 0 25px 50px rgba(0,0,0,0.5)'
              : '0 0 60px rgba(239,68,68,0.15), 0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="relative pt-5 pb-3 px-4">
            {/* Glow circle */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-30"
              style={{
                background: `radial-gradient(circle, ${isPositive ? '#22C55E' : '#EF4444'} 0%, transparent 70%)`,
              }}
            />

            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="text-center relative z-10">
              <span className="text-5xl block mb-2">{event.icon}</span>
              <h2 className="text-lg font-black text-white">{event.title}</h2>
              {/* Severity badge */}
              <div
                className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-[999px]"
                style={{
                  background: isPositive
                    ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))'
                    : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
                }}
              >
                <span className={`text-[11px] font-black ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {isPositive ? '📈' : '📉'} {event.scope === 'global' ? 'رویداد جهانی' : 'رویداد صنعتی'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pb-3">
            <p className="text-[12px] text-white/70 text-center leading-5">{event.description}</p>
          </div>

          {/* Effect indicator */}
          <div className="mx-4 mb-3 rounded-[14px] px-4 py-3 text-center"
            style={{
              background: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${isPositive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            {isInstant ? (
              <p className={`text-xl font-black font-fa ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {isPositive ? '+' : ''}{event.description.match(/[+-][\d,]+/) || effectText}
              </p>
            ) : (
              <>
                <p className={`text-2xl font-black font-fa ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {effectText}
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  {scopeText} · {durationMins} دقیقه
                </p>
              </>
            )}
          </div>

          {/* Response options */}
          {template?.responseOptions && !event.responded && !responded && (
            <div className="px-4 pb-3 space-y-2">
              <p className="text-[10px] text-white/40 text-center">واکنش نشان دهید:</p>
              {template.responseOptions.map((opt) => {
                const canAfford = balance >= opt.cost;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleRespond(opt.id)}
                    disabled={!canAfford}
                    className="w-full rounded-[14px] px-4 py-3 flex items-center gap-3 transition-all active:scale-[0.97] disabled:opacity-40"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1 text-right">
                      <p className="text-[12px] font-bold text-white">{opt.label}</p>
                      <p className="text-[9px] text-white/40">{opt.description}</p>
                    </div>
                    <span className="text-[12px] font-black font-fa text-[#FBBF24]">{opt.cost.toLocaleString('fa-IR')}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Responded confirmation */}
          {(event.responded || responded) && template?.responseOptions && (
            <div className="px-4 pb-3 text-center">
              <p className="text-[11px] text-[#6366F1] font-bold">✅ واکنش اعمال شد!</p>
            </div>
          )}

          {/* Dismiss button */}
          <div className="px-4 pt-1 pb-5">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-[18px] font-black text-sm text-white active:scale-[0.96] transition-all"
              style={{
                background: isPositive
                  ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                  : 'linear-gradient(135deg, #EF4444, #DC2626)',
                boxShadow: isPositive
                  ? '0 6px 25px rgba(34,197,94,0.35)'
                  : '0 6px 25px rgba(239,68,68,0.35)',
              }}
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
