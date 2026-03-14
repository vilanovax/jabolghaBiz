'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Clock, CheckCircle2, Gift, Target, Trophy, Sparkles } from 'lucide-react';
import type { ActiveMission } from '@/types';

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  daily: { label: 'روزانه', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/15' },
  weekly: { label: 'هفتگی', color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/15' },
  one_time: { label: 'یکبار', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/15' },
};

function MissionCard({ mission }: { mission: ActiveMission }) {
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);

  const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const typeInfo = typeLabels[mission.type];

  // محاسبه زمان باقی‌مانده
  const timeLeft = mission.expiresAt > 0 ? mission.expiresAt - Date.now() : 0;
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minsLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  const isClaimable = mission.completed && !mission.claimed;
  const isDone = mission.claimed;

  return (
    <div
      className={`relative rounded-[16px] border p-3 transition-all ${
        isDone
          ? 'border-[#22C55E]/30 bg-[#22C55E]/5 opacity-60'
          : isClaimable
          ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
          : 'border-line-subtle bg-surface-card/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5">
        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-xl ${
          isDone ? 'bg-[#22C55E]/15' : isClaimable ? 'bg-[#F59E0B]/15' : 'bg-surface-card/60'
        }`}>
          {isDone ? '✅' : mission.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate">{mission.title}</p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[99px] ${typeInfo.bg} ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
          <p className="text-[11px] text-fg-muted mt-0.5">{mission.description}</p>
        </div>

        {/* جایزه */}
        <div className="text-left shrink-0">
          <div className="flex items-center gap-1">
            <Gift size={12} className="text-[#F59E0B]" />
            <MoneyDisplay amount={mission.reward} size="sm" />
          </div>
          {mission.xpReward > 0 && (
            <p className="text-[9px] text-[#8B5CF6] mt-0.5 text-center">+{mission.xpReward} XP</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-fg-faint font-mono">
            {mission.progress.toLocaleString('fa-IR')} / {mission.target.toLocaleString('fa-IR')}
          </span>
          <div className="flex items-center gap-2">
            {timeLeft > 0 && !isDone && (
              <span className="text-[9px] text-fg-faint flex items-center gap-0.5">
                <Clock size={9} />
                {hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`}
              </span>
            )}
            <span className="text-[10px] font-bold text-fg-secondary">{progressPct}%</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isDone
                ? 'bg-[#22C55E]'
                : isClaimable
                ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] animate-pulse'
                : 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1]'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* دکمه دریافت جایزه */}
      {isClaimable && (
        <button
          onClick={() => claimMissionReward(mission.id)}
          className="mt-2.5 w-full py-2 rounded-[12px] bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
        >
          <Sparkles size={14} />
          دریافت جایزه
        </button>
      )}
    </div>
  );
}

export default function MissionsPanel() {
  const missions = useGameStore((s) => s.missions);
  const refreshMissions = useGameStore((s) => s.refreshMissions);

  useEffect(() => {
    refreshMissions();
  }, [refreshMissions]);

  const dailyMissions = missions.activeMissions.filter((m) => m.type === 'daily');
  const weeklyMissions = missions.activeMissions.filter((m) => m.type === 'weekly');
  const oneTimeMissions = missions.activeMissions.filter((m) => m.type === 'one_time' && !m.claimed);

  const claimableCount = missions.activeMissions.filter((m) => m.completed && !m.claimed).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[#F59E0B]" />
          <h2 className="font-bold text-sm">ماموریت‌ها</h2>
          {claimableCount > 0 && (
            <span className="text-[9px] bg-[#EF4444]/15 text-[#EF4444] px-1.5 py-0.5 rounded-[999px] font-bold animate-pulse">
              {claimableCount} جایزه
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-fg-faint">
          <Trophy size={11} />
          <span>{missions.totalMissionsCompleted} تکمیل</span>
        </div>
      </div>

      {/* روزانه */}
      {dailyMissions.length > 0 && (
        <div>
          <p className="text-[11px] text-[#3B82F6] font-bold mb-2 flex items-center gap-1">
            <Clock size={11} /> روزانه
          </p>
          <div className="space-y-2">
            {dailyMissions.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}

      {/* هفتگی */}
      {weeklyMissions.length > 0 && (
        <div>
          <p className="text-[11px] text-[#8B5CF6] font-bold mb-2 flex items-center gap-1">
            <Clock size={11} /> هفتگی
          </p>
          <div className="space-y-2">
            {weeklyMissions.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}

      {/* یکبار مصرف */}
      {oneTimeMissions.length > 0 && (
        <div>
          <p className="text-[11px] text-[#F59E0B] font-bold mb-2 flex items-center gap-1">
            <Target size={11} /> دستاوردها
          </p>
          <div className="space-y-2">
            {oneTimeMissions.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
