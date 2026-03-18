'use client';

import { useState } from 'react';
import { useGameStore, getActiveManagerBoosts } from '@/store/gameStore';
import { MANAGER_TEMPLATES, MANAGER_CONFIG } from '@/data/mock';
import ManagerSlot from '@/components/managers/ManagerSlot';
import { HiredManagerCard, TemplateManagerCard } from '@/components/managers/ManagerCard';
import { Crown, TrendingUp, Zap, ShoppingCart } from 'lucide-react';

type Tab = 'active' | 'all' | 'locked';

const tabConfig: { id: Tab; label: string; icon: string }[] = [
  { id: 'active', label: 'تیم من', icon: '👥' },
  { id: 'all', label: 'استخدام', icon: '🔍' },
  { id: 'locked', label: 'قفل', icon: '🔒' },
];

export default function ManagersPage() {
  const [tab, setTab] = useState<Tab>('all');
  const player = useGameStore((s) => s.player);
  const managers = useGameStore((s) => s.managers);
  const hireManager = useGameStore((s) => s.hireManager);
  const activateManager = useGameStore((s) => s.activateManager);
  const deactivateManager = useGameStore((s) => s.deactivateManager);
  const useManagerAbility = useGameStore((s) => s.useManagerAbility);
  const upgradeManager = useGameStore((s) => s.upgradeManager);
  const completeManagerUpgrade = useGameStore((s) => s.completeManagerUpgrade);

  const boosts = getActiveManagerBoosts(managers);
  const hiredIds = managers.hiredManagers.map((m) => m.templateId);

  const unlockedTemplates = MANAGER_TEMPLATES.filter(
    (t) => player.level >= t.unlockLevel && !hiredIds.includes(t.id)
  );
  const lockedTemplates = MANAGER_TEMPLATES.filter(
    (t) => player.level < t.unlockLevel && !hiredIds.includes(t.id)
  );

  const availableSlotIndices = managers.activeSlots
    .map((id, i) => (id === null && i < managers.maxSlots ? i : -1))
    .filter((i) => i !== -1);

  const activeManagerCount = managers.activeSlots.filter(Boolean).length;
  const hasActiveBoost = boosts.revenueMultiplier > 1 || boosts.productionSpeedMultiplier > 1 || boosts.saleRateMultiplier > 1;

  const boostItems = [
    { key: 'rev', active: boosts.revenueMultiplier > 1, value: boosts.revenueMultiplier, label: 'درآمد', icon: TrendingUp, color: '#22C55E' },
    { key: 'prod', active: boosts.productionSpeedMultiplier > 1, value: boosts.productionSpeedMultiplier, label: 'سرعت', icon: Zap, color: '#3B82F6' },
    { key: 'sale', active: boosts.saleRateMultiplier > 1, value: boosts.saleRateMultiplier, label: 'فروش', icon: ShoppingCart, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-5 py-3 pb-24">

      {/* =================== Hero Header =================== */}
      <div className="relative text-center py-5">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-[#F59E0B]/8 blur-[80px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#D97706]/10 border border-[#F59E0B]/20 mb-2">
            <Crown size={26} className="text-[#F59E0B]" />
          </div>
          <h1 className="text-xl font-black text-fg">مدیران ارشد</h1>
          <p className="text-[10px] text-fg-muted mt-1">
            {activeManagerCount}/{managers.maxSlots} مدیر فعال
            {managers.hiredManagers.length > 0 && ` · ${managers.hiredManagers.length} استخدام‌شده`}
          </p>
        </div>
      </div>

      {/* =================== Active Boosts =================== */}
      {hasActiveBoost && (
        <div className="flex gap-2 justify-center">
          {boostItems.filter(b => b.active).map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.key}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
                style={{
                  background: `linear-gradient(135deg, ${b.color}08, ${b.color}03)`,
                  borderColor: `${b.color}25`,
                }}
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

      {/* =================== Slots =================== */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-1 h-4 rounded-full bg-[#F59E0B]" />
          <p className="text-xs font-bold text-fg">اسلات‌های فعال</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => {
            const slotId = managers.activeSlots[i];
            const mgr = slotId ? managers.hiredManagers.find((m) => m.id === slotId) ?? null : null;
            const locked = i >= managers.maxSlots;
            return (
              <ManagerSlot
                key={i}
                index={i}
                manager={mgr}
                locked={locked}
                unlockLevel={MANAGER_CONFIG.slot2UnlockLevel}
                onRemove={() => deactivateManager(i)}
                onClick={() => setTab('active')}
              />
            );
          })}
        </div>
      </div>

      {/* =================== Tabs =================== */}
      <div className="flex gap-1 bg-surface-card/30 rounded-[16px] p-1 border border-line-subtle/30">
        {tabConfig.map((t) => {
          const count = t.id === 'active' ? managers.hiredManagers.length
            : t.id === 'all' ? unlockedTemplates.length
            : lockedTemplates.length;
          const isSelected = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                flex-1 flex items-center justify-center gap-1 py-2.5 rounded-[12px]
                text-xs font-bold transition-all
                ${isSelected
                  ? 'bg-[#6366F1]/15 text-[#818cf8] shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                  : 'text-fg-muted hover:text-fg-secondary'
                }
              `}
            >
              <span className="text-[11px]">{t.icon}</span>
              {t.label}
              <span className={`text-[9px] font-fa ${isSelected ? 'text-[#818cf8]/70' : 'text-fg-faint'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =================== Content =================== */}
      <div className="space-y-3">
        {/* Active / Hired */}
        {tab === 'active' && managers.hiredManagers.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl opacity-20">👤</span>
            <p className="text-sm text-fg-muted mt-3">هنوز مدیری استخدام نکردی</p>
            <button
              onClick={() => setTab('all')}
              className="mt-3 text-xs font-bold text-[#818cf8] bg-[#6366F1]/10 px-4 py-2 rounded-full hover:bg-[#6366F1]/20 transition-colors"
            >
              مشاهده مدیران
            </button>
          </div>
        )}
        {tab === 'active' && managers.hiredManagers.map((mgr) => (
          <HiredManagerCard
            key={mgr.id}
            manager={mgr}
            isActive={managers.activeSlots.includes(mgr.id)}
            balance={player.balance}
            onActivate={(slot) => activateManager(mgr.id, slot)}
            onUseAbility={() => useManagerAbility(mgr.id)}
            onUpgrade={() => upgradeManager(mgr.id)}
            onCompleteUpgrade={() => completeManagerUpgrade(mgr.id)}
            availableSlots={availableSlotIndices}
          />
        ))}

        {/* All unlocked */}
        {tab === 'all' && unlockedTemplates.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl opacity-20">✅</span>
            <p className="text-sm text-fg-muted mt-3">همه مدیران آنلاک‌شده رو استخدام کردی!</p>
          </div>
        )}
        {tab === 'all' && unlockedTemplates.map((tmpl) => (
          <TemplateManagerCard
            key={tmpl.id}
            template={tmpl}
            balance={player.balance}
            playerLevel={player.level}
            isUnlocked={true}
            onHire={() => hireManager(tmpl.id)}
          />
        ))}

        {/* Locked */}
        {tab === 'locked' && lockedTemplates.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl opacity-20">🎉</span>
            <p className="text-sm text-fg-muted mt-3">همه مدیران آنلاک شدن!</p>
          </div>
        )}
        {tab === 'locked' && lockedTemplates.map((tmpl) => (
          <TemplateManagerCard
            key={tmpl.id}
            template={tmpl}
            balance={player.balance}
            playerLevel={player.level}
            isUnlocked={false}
            onHire={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
