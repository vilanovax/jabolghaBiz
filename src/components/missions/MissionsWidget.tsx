'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Target, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import type { ActiveMission } from '@/types';

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
        <p className="text-[11px] font-bold truncate">{mission.title}</p>
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
      <div className="space-y-1.5">
        {activeMissions.map((m) => (
          <MiniMission key={m.id} mission={m} />
        ))}
      </div>
    </div>
  );
}
