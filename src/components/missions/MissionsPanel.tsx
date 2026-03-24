'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Clock, Gift, Trophy, Sparkles, Star } from 'lucide-react';
import type { ActiveMission, BusinessType } from '@/types';
import { SPECIALTY_MILESTONES } from '@/data/mock';

const typeStyles: Record<string, { color: string; bg: string; glow: string }> = {
  daily:     { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', glow: 'rgba(59,130,246,0.12)' },
  weekly:    { color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', glow: 'rgba(139,92,246,0.12)' },
  one_time:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', glow: 'rgba(245,158,11,0.12)' },
  specialty: { color: '#22C55E', bg: 'rgba(34,197,94,0.08)',  glow: 'rgba(34,197,94,0.12)' },
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
  const style = typeStyles[displayTypeKey] ?? typeStyles.daily;

  const timeLeft = mission.expiresAt > 0 ? mission.expiresAt - Date.now() : 0;
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minsLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  const isClaimable = mission.completed && !mission.claimed;
  const isDone = mission.claimed;

  return (
    <div
      className={`relative rounded-[16px] overflow-hidden transition-all ${
        isDone
          ? 'opacity-50'
          : isClaimable
          ? 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
          : ''
      }`}
      style={{
        background: isDone ? 'rgba(34,197,94,0.06)' : isClaimable ? 'rgba(245,158,11,0.08)' : style.bg,
        border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : isClaimable ? 'rgba(245,158,11,0.35)' : 'rgba(150,150,150,0.12)'}`,
      }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* آیکون */}
        <div
          className="w-11 h-11 rounded-[14px] flex items-center justify-center text-[22px] shrink-0"
          style={{ background: isDone ? 'rgba(34,197,94,0.12)' : isClaimable ? 'rgba(245,158,11,0.12)' : `${style.color}12` }}
        >
          {isDone ? '✅' : mission.icon}
        </div>

        {/* محتوا */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold leading-tight">{mission.description}</p>

          {/* پروگرس بار + اعداد */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-progress-bg overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDone
                    ? 'bg-[#22C55E]'
                    : isClaimable
                    ? 'bg-gradient-to-r from-[#F59E0B] to-[#EF4444] animate-pulse'
                    : ''
                }`}
                style={{
                  width: `${progressPct}%`,
                  ...(!isDone && !isClaimable ? { backgroundColor: style.color } : {}),
                }}
              />
            </div>
            <span className="text-[10px] font-black font-fa shrink-0" style={{ color: isDone ? '#22C55E' : isClaimable ? '#F59E0B' : style.color }}>
              {mission.progress.toLocaleString('fa-IR')}/{mission.target.toLocaleString('fa-IR')}
            </span>
          </div>
        </div>

        {/* جایزه */}
        <div className="shrink-0 text-center">
          {isClaimable ? (
            <button
              onClick={() => claimMissionReward(mission.id)}
              className="px-3 py-2 rounded-[12px] bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
            >
              <Sparkles size={12} />
              بگیر!
            </button>
          ) : (
            <div>
              <div className="flex items-center gap-0.5 justify-center">
                <Gift size={10} className="text-[#F59E0B]" />
                <MoneyDisplay amount={mission.reward} size="sm" />
              </div>
              {mission.xpReward > 0 && (
                <p className="text-[8px] text-[#8B5CF6] mt-0.5">+{mission.xpReward} XP</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* فوتر — تایمر */}
      {timeLeft > 0 && !isDone && (
        <div className="px-3 pb-2 flex items-center gap-1 justify-end">
          <Clock size={9} className="text-fg-faint" />
          <span className="text-[9px] text-fg-faint font-fa">
            {hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`}
          </span>
        </div>
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

  const specialtyByType = specialtyMissions.reduce<Record<string, ActiveMission[]>>((acc, m) => {
    const key = m.businessTypeFilter!;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const claimableCount = missions.activeMissions.filter((m) => m.completed && !m.claimed).length;
  const specialtyClaimable = specialtyMissions.filter((m) => m.completed && !m.claimed).length;

  const tabs: { key: TabKey; label: string; icon: string; count: number; color: string }[] = [
    { key: 'daily',     label: 'روزانه',    icon: '🔥', count: dailyMissions.filter((m) => m.completed && !m.claimed).length,   color: '#3B82F6' },
    { key: 'weekly',    label: 'هفتگی',    icon: '⭐', count: weeklyMissions.filter((m) => m.completed && !m.claimed).length,  color: '#8B5CF6' },
    { key: 'one_time',  label: 'دستاوردها', icon: '🏆', count: oneTimeMissions.filter((m) => m.completed && !m.claimed).length, color: '#F59E0B' },
    { key: 'specialty', label: 'تخصصی',   icon: '💎', count: specialtyClaimable, color: '#22C55E' },
  ];

  return (
    <div className="space-y-4">
      {/* خلاصه بالا */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-[#F59E0B]" />
          <span className="text-[11px] text-fg-muted font-bold">{missions.totalMissionsCompleted} تکمیل‌شده</span>
        </div>
        {claimableCount > 0 && (
          <span className="text-[10px] bg-[#EF4444]/15 text-[#EF4444] px-2.5 py-1 rounded-full font-bold animate-pulse flex items-center gap-1">
            🎁 {claimableCount} جایزه آماده
          </span>
        )}
      </div>

      {/* تب‌ها */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] text-[11px] font-bold transition-all ${
              activeTab === tab.key
                ? 'text-white shadow-sm'
                : 'bg-surface-card/40 text-fg-muted'
            }`}
            style={activeTab === tab.key ? { backgroundColor: tab.color } : {}}
          >
            <span className="text-sm">{tab.icon}</span>
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.key ? 'bg-white/25 text-white' : 'bg-[#EF4444]/15 text-[#EF4444]'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* محتوای تب */}
      {activeTab === 'daily' && (
        <div className="space-y-2">
          {dailyMissions.length === 0 ? (
            <EmptyState icon="🌅" text="ماموریت روزانه تموم شد! فردا بیا" />
          ) : (
            dailyMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="space-y-2">
          {weeklyMissions.length === 0 ? (
            <EmptyState icon="📅" text="ماموریت هفتگی نداری" />
          ) : (
            weeklyMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'one_time' && (
        <div className="space-y-2">
          {oneTimeMissions.length === 0 ? (
            <EmptyState icon="🎉" text="همه دستاوردها رو گرفتی! افرین!" />
          ) : (
            oneTimeMissions.map((m) => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      )}

      {activeTab === 'specialty' && (
        <div className="space-y-4">
          {Object.keys(specialtyByType).length === 0 ? (
            <EmptyState icon="🏗️" text="اول یه کسب‌وکار بساز تا ماموریت تخصصی باز بشه" />
          ) : (
            Object.entries(specialtyByType).map(([bizType, typeMissions]) => {
              const milestones = SPECIALTY_MILESTONES[bizType as BusinessType];
              const typeIcon = milestones[0].icon;
              return (
                <div key={bizType}>
                  <p className="text-[11px] font-bold mb-2 flex items-center gap-1.5">
                    <span className="text-base">{typeIcon}</span>
                    <span style={{ color: '#22C55E' }}>{bizTypeLabels[bizType as BusinessType]}</span>
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

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-line-subtle/40 py-8 text-center space-y-1.5">
      <span className="text-3xl block">{icon}</span>
      <p className="text-[11px] text-fg-muted font-bold">{text}</p>
    </div>
  );
}
