'use client';

import { useState, useEffect } from 'react';
import { useGameStore, getActiveManagerBoosts } from '@/store/gameStore';
import { MANAGER_TEMPLATES } from '@/data/mock';
import { Crown, TrendingUp, Zap, ShoppingCart, Clock } from 'lucide-react';

function formatMs(ms: number) {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}ث`;
}

export default function ManagersPage() {
  const player = useGameStore((s) => s.player);
  const managers = useGameStore((s) => s.managers);
  const hireManager = useGameStore((s) => s.hireManager);
  const activateManager = useGameStore((s) => s.activateManager);
  const useManagerAbility = useGameStore((s) => s.useManagerAbility);

  const boosts = getActiveManagerBoosts(managers);
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();

  // سوپر مدیر = اولین تمپلیت قابل استخدام
  const template = MANAGER_TEMPLATES.find((t) => player.level >= t.unlockLevel);
  const lockedTemplate = !template ? MANAGER_TEMPLATES[0] : undefined;

  // مدیر استخدام‌شده (اگر باشه)
  const hired = template ? managers.hiredManagers.find((m) => m.templateId === template.id) ?? null : null;
  const isInSlot = hired ? managers.activeSlots.includes(hired.id) : false;

  const abilityIsActive = hired && hired.abilityActiveUntil && hired.abilityActiveUntil > now;
  const abilityTimeLeft = hired && hired.abilityActiveUntil ? Math.max(0, hired.abilityActiveUntil - now) : 0;
  const cooldownEnds = hired && hired.lastAbilityUsedAt ? hired.lastAbilityUsedAt + hired.ability.cooldownMs : 0;
  const onCooldown = cooldownEnds > now && !abilityIsActive;
  const cooldownLeft = Math.max(0, cooldownEnds - now);

  const canAfford = template ? player.balance >= template.hireCost : false;

  const hasBoost = boosts.revenueMultiplier > 1 || boosts.productionSpeedMultiplier > 1 || boosts.saleRateMultiplier > 1;
  const boostItems = [
    { key: 'rev', active: boosts.revenueMultiplier > 1, value: boosts.revenueMultiplier, label: 'درآمد', icon: TrendingUp, color: '#22C55E' },
    { key: 'prod', active: boosts.productionSpeedMultiplier > 1, value: boosts.productionSpeedMultiplier, label: 'سرعت', icon: Zap, color: '#3B82F6' },
    { key: 'sale', active: boosts.saleRateMultiplier > 1, value: boosts.saleRateMultiplier, label: 'فروش', icon: ShoppingCart, color: '#F59E0B' },
  ].filter((b) => b.active);

  const passiveLabel =
    template?.passiveEffect.type === 'revenue' ? 'درآمد'
    : template?.passiveEffect.type === 'production_speed' ? 'سرعت تولید'
    : 'نرخ فروش';

  return (
    <div className="space-y-5 py-3 pb-24">

      {/* Hero */}
      <div className="relative text-center py-5">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-[#F59E0B]/8 blur-[80px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/10 border border-[#F59E0B]/20 mb-2">
            <Crown size={26} className="text-[#F59E0B]" />
          </div>
          <h1 className="text-xl font-black text-fg">سوپر مدیر</h1>
          <p className="text-[10px] text-fg-muted mt-1">
            {isInSlot ? '✅ فعال است' : hired ? 'استخدام‌شده — فعال‌سازی کنید' : 'استخدام مدیر ارشد'}
          </p>
        </div>
      </div>

      {/* Active boosts */}
      {hasBoost && (
        <div className="flex gap-2 justify-center flex-wrap">
          {boostItems.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.key}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
                style={{ background: `${b.color}08`, borderColor: `${b.color}25` }}
              >
                <Icon size={12} style={{ color: b.color }} />
                <span className="text-xs font-black font-fa" style={{ color: b.color }}>
                  +{Math.round((b.value - 1) * 100)}%
                </span>
                <span className="text-[9px] text-fg-muted">{b.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Manager card */}
      {(template || lockedTemplate) && (() => {
        const tmpl = template ?? lockedTemplate!;
        const isLocked = !template;

        return (
          <div
            className="rounded-[22px] p-5 border space-y-4"
            style={{
              background: isInSlot
                ? 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))'
                : 'transparent',
              borderColor: isInSlot ? 'rgba(245,158,11,0.3)' : 'rgba(212,212,216,0.25)',
              boxShadow: isInSlot ? '0 0 24px rgba(245,158,11,0.12)' : undefined,
            }}
          >
            {/* Row 1: Icon + Name + Status */}
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-[18px] flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.08))' }}
              >
                {tmpl.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-[15px] font-black text-fg">{tmpl.name}</h2>
                  {isLocked && (
                    <span className="text-[9px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">
                      🔒 سطح {tmpl.unlockLevel}
                    </span>
                  )}
                  {isInSlot && (
                    <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/12 px-2 py-0.5 rounded-full">
                      ✅ فعال
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-fg-muted mt-0.5">{tmpl.description}</p>
              </div>
            </div>

            {/* Row 2: Effect */}
            <div className="bg-surface-card/60 rounded-[14px] p-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-fg-faint">تأثیر ثابت</p>
                <p className="text-[15px] font-black text-[#22C55E] font-fa mt-0.5">
                  +{Math.round(tmpl.passiveEffect.value * 100)}% {passiveLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-fg-faint">توانایی ویژه</p>
                <p className="text-[11px] font-black text-[#F59E0B] mt-0.5">
                  {tmpl.ability.icon} {tmpl.ability.name}
                </p>
                <p className="text-[9px] text-fg-muted">{tmpl.ability.description}</p>
              </div>
            </div>

            {/* Row 3: Actions */}
            {!isLocked && (
              <div className="space-y-2">
                {/* Hire or Activate */}
                {!hired && (
                  <button
                    onClick={() => hireManager(tmpl.id)}
                    disabled={!canAfford}
                    className="w-full py-3.5 rounded-[14px] text-[13px] font-black text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all disabled:opacity-40"
                    style={{
                      background: canAfford
                        ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                        : undefined,
                      backgroundColor: canAfford ? undefined : 'rgba(0,0,0,0.1)',
                      boxShadow: canAfford ? '0 4px 20px rgba(245,158,11,0.35)' : undefined,
                    }}
                  >
                    <Crown size={16} />
                    استخدام — <span className="font-fa">{tmpl.hireCost.toLocaleString('fa-IR')}</span> تومان
                  </button>
                )}

                {hired && !isInSlot && (
                  <button
                    onClick={() => activateManager(hired.id, 0)}
                    className="w-full py-3.5 rounded-[14px] text-[13px] font-black text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                      boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                    }}
                  >
                    ⚡ فعال‌سازی مدیر
                  </button>
                )}

                {/* Ability button */}
                {isInSlot && (
                  <button
                    onClick={() => !abilityIsActive && !onCooldown && useManagerAbility(hired!.id)}
                    disabled={!!abilityIsActive || onCooldown}
                    className="w-full py-3.5 rounded-[14px] text-[13px] font-black flex items-center justify-center gap-2 active:scale-[0.97] transition-all disabled:opacity-50"
                    style={
                      abilityIsActive
                        ? { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E' }
                        : onCooldown
                        ? { background: 'transparent', border: '1px solid rgba(212,212,216,0.2)', color: '#6B7280' }
                        : { background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)', color: 'white' }
                    }
                  >
                    {abilityIsActive ? (
                      <>
                        <Clock size={15} />
                        {tmpl.ability.icon} فعال — {formatMs(abilityTimeLeft)} مانده
                      </>
                    ) : onCooldown ? (
                      <>
                        <Clock size={15} />
                        کولدان {formatMs(cooldownLeft)}
                      </>
                    ) : (
                      <>
                        {tmpl.ability.icon} {tmpl.ability.name}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Locked message */}
            {isLocked && (
              <div className="text-center py-2">
                <p className="text-[11px] text-fg-muted">
                  برای آنلاک، به سطح <span className="font-fa font-bold text-fg">{tmpl.unlockLevel}</span> برسید
                </p>
                <p className="text-[10px] text-fg-faint mt-1">سطح فعلی شما: {player.level}</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Empty state */}
      {!template && !lockedTemplate && (
        <div className="text-center py-16">
          <span className="text-4xl opacity-20">👑</span>
          <p className="text-sm text-fg-muted mt-3">هیچ مدیری در دسترس نیست</p>
        </div>
      )}
    </div>
  );
}
