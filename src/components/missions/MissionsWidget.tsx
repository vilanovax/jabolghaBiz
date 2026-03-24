'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Target, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ActiveMission } from '@/types';

function FeaturedMission({ mission }: { mission: ActiveMission }) {
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);
  const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const isClaimable = mission.completed && !mission.claimed;

  return (
    <div
      className={`relative px-3.5 py-3 rounded-[16px] border transition-all ${
        isClaimable
          ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10'
          : 'border-[#3B82F6]/25 bg-[#3B82F6]/5'
      }`}
      style={{
        boxShadow: isClaimable
          ? '0 0 16px rgba(245,158,11,0.12)'
          : '0 0 12px rgba(59,130,246,0.08)',
      }}
    >
      {/* Active label */}
      {!isClaimable && (
        <span className="absolute -top-2 right-3 text-[8px] font-black text-[#3B82F6] bg-[#3B82F6]/12 px-2 py-0.5 rounded-full">
          ماموریت فعال
        </span>
      )}

      <div className="flex items-center gap-3">
        <span className="text-2xl shrink-0">{mission.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold leading-tight">{mission.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-full bg-progress-bg overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isClaimable
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] animate-pulse'
                    : 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1]'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-fg-faint font-mono shrink-0">{pct}%</span>
          </div>
        </div>
        {isClaimable ? (
          <button
            onClick={(e) => { e.preventDefault(); claimMissionReward(mission.id); }}
            className="shrink-0 px-3 py-2 rounded-[12px] bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Sparkles size={12} />
            جایزه
          </button>
        ) : (
          <span className="shrink-0 text-[11px] text-accent-money font-bold font-fa">
            +{mission.reward.toLocaleString('fa-IR')}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniMission({ mission }: { mission: ActiveMission }) {
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);
  const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const isClaimable = mission.completed && !mission.claimed;

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] border transition-all ${
      isClaimable
        ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10'
        : 'border-line-subtle bg-surface-card/40'
    }`}>
      <span className="text-lg shrink-0">{mission.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold truncate">{mission.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 rounded-full bg-progress-bg overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isClaimable
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] animate-pulse'
                  : 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[9px] text-fg-faint font-mono shrink-0">{pct}%</span>
        </div>
      </div>
      {isClaimable ? (
        <button
          onClick={(e) => { e.preventDefault(); claimMissionReward(mission.id); }}
          className="shrink-0 px-2.5 py-1.5 rounded-[10px] bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
        >
          <Sparkles size={10} />
          جایزه
        </button>
      ) : (
        <span className="shrink-0 text-[10px] text-accent-money font-bold font-fa">
          {mission.reward.toLocaleString('fa-IR')}
        </span>
      )}
    </div>
  );
}

export default function MissionsWidget() {
  const missions = useGameStore((s) => s.missions);
  const refreshMissions = useGameStore((s) => s.refreshMissions);

  useEffect(() => {
    refreshMissions();
  }, [refreshMissions]);

  // Priority: claimable first, then closest to completion, max 3
  const activeMissions = missions.activeMissions
    .filter((m) => !m.claimed)
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? -1 : 1;
      const aPct = a.progress / a.target;
      const bPct = b.progress / b.target;
      return bPct - aPct;
    })
    .slice(0, 3);

  const claimableCount = missions.activeMissions.filter((m) => m.completed && !m.claimed).length;
  const totalActive = missions.activeMissions.filter((m) => !m.claimed).length;

  if (activeMissions.length === 0) return null;

  const [featured, ...rest] = activeMissions;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Target size={14} className="text-[#F59E0B]" />
          <span className="text-xs font-bold">ماموریت‌ها</span>
          {claimableCount > 0 && (
            <span className="text-[9px] bg-[#EF4444]/15 text-[#EF4444] px-1.5 py-0.5 rounded-[99px] font-bold animate-pulse">
              {claimableCount}
            </span>
          )}
        </div>
        <Link href="/missions" className="text-[10px] text-accent-primary flex items-center gap-0.5 hover:opacity-80">
          همه ({totalActive})
          <ChevronLeft size={12} />
        </Link>
      </div>

      {/* Featured (first) mission — larger */}
      <FeaturedMission mission={featured} />

      {/* Secondary missions */}
      {rest.length > 0 && (
        <div className="space-y-1.5">
          {rest.map((m) => (
            <MiniMission key={m.id} mission={m} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Returns the active mission conditions for cross-section linking.
 * Used by Home page to highlight related businesses/market items.
 */
export function useActiveMissionContext() {
  const missions = useGameStore((s) => s.missions);

  const activeMissions = missions.activeMissions
    .filter((m) => !m.claimed && !m.completed)
    .slice(0, 3);

  // Business types that have active missions
  const missionBusinessTypes = new Set(
    activeMissions
      .filter((m) => m.businessTypeFilter)
      .map((m) => m.businessTypeFilter!)
  );

  // Mission conditions for market linking
  const missionConditions = new Set(activeMissions.map((m) => m.condition));

  // Does any mission benefit from market activity?
  const needsMarket = missionConditions.has('sell_units') || missionConditions.has('earn_total');

  // Does any mission benefit from business upgrades?
  const needsUpgrade = missionConditions.has('upgrade_business');

  // Does any mission benefit from hiring?
  const needsHiring = missionConditions.has('hire_employee') || missionConditions.has('total_employees');

  return {
    missionBusinessTypes,
    missionConditions,
    needsMarket,
    needsUpgrade,
    needsHiring,
    activeMissions,
  };
}
