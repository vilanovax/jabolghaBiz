'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Clock, CheckCircle2, Gift, Target, Trophy, Sparkles, Star } from 'lucide-react';
import type { ActiveMission, BusinessType } from '@/types';
import { SPECIALTY_MILESTONES } from '@/data/mock';

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  daily:     { label: 'روزانه',  color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/15' },
  weekly:    { label: 'هفتگی',  color: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF6]/15' },
  one_time:  { label: 'یکبار',  color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/15' },
  specialty: { label: 'تخصصی', color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/15' },
};

const bizTypeLabels: Record<BusinessType, string> = {
  farming:     'کشاورزی',
  factory:     'کارخانه',
  supermarket: 'سوپرمارکت',
  restaurant:  'رستوران',
  app_startup: 'استارتاپ',
  transport:   'حمل‌ونقل',
};

function MissionCard({ mission, isSpecialty }: { mission: ActiveMission; isSpecialty?: boolean }) {
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);

  const progressPct = Math.min(100, Math.round((mission.progress / mission.target) * 100));
  const displayTypeKey = isSpecialty ? 'specialty' : mission.type;
  const typeInfo = typeLabels[displayTypeKey];

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
                : isSpecialty
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]'
                : 'bg-gradient-to-r from-[#3B82F6] to-[#6366F1]'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

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

type TabKey = 'daily' | 'weekly' | 'one_time' | 'specialty';

export default function MissionsPanel() {
  const missions = useGameStore((s) => s.missions);
  const refreshMissions = useGameStore((s) => s.refreshMissions);
  const [activeTab, setActiveTab] = useState<TabKey>('daily');

  useEffect(() => {
    refreshMissions();
  }, [refreshMissions]);

  const dailyMissions = missions.activeMissions
    .filter((m) => m.type === 'daily')
    .sort((a, b) => (a.claimed ? 1 : 0) - (b.claimed ? 1 : 0));
  const weeklyMissions = missions.activeMissions
    .filter((m) => m.type === 'weekly')
    .sort((a, b) => (a.claimed ? 1 : 0) - (b.claimed ? 1 : 0));
  const oneTimeMissions = missions.activeMissions
    .filter((m) => m.type === 'one_time' && !m.businessTypeFilter)
    .sort((a, b) => (a.claimed ? 1 : 0) - (b.claimed ? 1 : 0));
  const specialtyMissions = missions.activeMissions
    .filter((m) => m.businessTypeFilter)
    .sort((a, b) => (a.claimed ? 1 : 0) - (b.claimed ? 1 : 0));

  // Group specialty by business type
  const specialtyByType = specialtyMissions.reduce<Record<string, ActiveMission[]>>((acc, m) => {
    const key = m.businessTypeFilter!;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const claimableCount = missions.activeMissions.filter((m) => m.completed && !m.claimed).length;
  const specialtyClaimable = specialtyMissions.filter((m) => m.completed && !m.claimed).length;

  const tabs: { key: TabKey; label: string; count: number; color: string }[] = [
    { key: 'daily',     label: 'روزانه',  count: dailyMissions.filter((m) => m.completed && !m.claimed).length,   color: '#3B82F6' },
    { key: 'weekly',    label: 'هفتگی',  count: weeklyMissions.filter((m) => m.completed && !m.claimed).length,  color: '#8B5CF6' },
    { key: 'one_time',  label: 'دستاوردها', count: oneTimeMissions.filter((m) => m.completed && !m.claimed).length, color: '#F59E0B' },
    { key: 'specialty', label: 'تخصصی', count: specialtyClaimable, color: '#22C55E' },
  ];

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

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[11px] font-bold transition-all ${
              activeTab === tab.key
                ? 'text-white shadow-sm'
                : 'bg-surface-card/40 text-fg-muted'
            }`}
            style={activeTab === tab.key ? { backgroundColor: tab.color } : {}}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[8px] px-1 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#EF4444]/15 text-[#EF4444]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'daily' && (
        <div className="space-y-2">
          {dailyMissions.length === 0 ? (
            <p className="text-[11px] text-fg-muted text-center py-6">ماموریت روزانه‌ای موجود نیست</p>
          ) : (
            dailyMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="space-y-2">
          {weeklyMissions.length === 0 ? (
            <p className="text-[11px] text-fg-muted text-center py-6">ماموریت هفتگی‌ای موجود نیست</p>
          ) : (
            weeklyMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'one_time' && (
        <div className="space-y-2">
          {oneTimeMissions.length === 0 ? (
            <p className="text-[11px] text-fg-muted text-center py-6">تمام دستاوردها تکمیل شده‌اند 🎉</p>
          ) : (
            oneTimeMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'specialty' && (
        <div className="space-y-4">
          {Object.keys(specialtyByType).length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Star size={32} className="mx-auto text-fg-faint" />
              <p className="text-[11px] text-fg-muted">
                برای مشاهده ماموریت‌های تخصصی، ابتدا یک کسب‌وکار بساز
              </p>
            </div>
          ) : (
            Object.entries(specialtyByType).map(([bizType, typeMissions]) => {
              const milestones = SPECIALTY_MILESTONES[bizType as BusinessType];
              const typeIcon = milestones[0].icon;
              return (
                <div key={bizType}>
                  <p className="text-[11px] text-[#22C55E] font-bold mb-2 flex items-center gap-1.5">
                    <span>{typeIcon}</span>
                    {bizTypeLabels[bizType as BusinessType]}
                  </p>
                  <div className="space-y-2">
                    {typeMissions.map((m) => (
                      <MissionCard key={m.id} mission={m} isSpecialty />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
