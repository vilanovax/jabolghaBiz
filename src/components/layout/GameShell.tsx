'use client';

import { ReactNode, useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useGameTick } from '@/hooks/useGameTick';
import { useGameStore, useHydration } from '@/store/gameStore';
import { X, CheckCircle2, Sparkles, Gift } from 'lucide-react';
import DailyBonusModal from '@/components/hooks/DailyBonusModal';
import EventModal from '@/components/hooks/EventModal';
import AchievementToast from '@/components/achievements/AchievementToast';
import LevelUpOverlay from '@/components/hooks/LevelUpOverlay';
import FloatingRewardLayer from '@/components/ui/FloatingReward';
import OnboardingScreen from '@/components/onboarding/OnboardingScreen';

export default function GameShell({ children }: { children: ReactNode }) {
  useGameTick();

  const theme = useGameStore((s) => s.theme);
  const onboardingComplete = useGameStore((s) => s.onboardingComplete);
  const canClaimDailyBonus = useGameStore((s) => s.canClaimDailyBonus);
  const pendingEventId = useGameStore((s) => s.randomEvents.pendingEventId);
  const dismissPendingEvent = useGameStore((s) => s.dismissPendingEvent);
  const missions = useGameStore((s) => s.missions);
  const claimMissionReward = useGameStore((s) => s.claimMissionReward);
  const refreshMissions = useGameStore((s) => s.refreshMissions);
  const hydrated = useHydration();
  const [showMissions, setShowMissions] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);

  // نمایش خودکار daily bonus هنگام ورود
  useEffect(() => {
    if (hydrated && canClaimDailyBonus()) {
      const timer = setTimeout(() => setShowDailyBonus(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hydrated, canClaimDailyBonus]);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // ریفرش ماموریت‌ها بعد از hydrate
  useEffect(() => {
    if (hydrated && onboardingComplete) refreshMissions();
  }, [hydrated, onboardingComplete, refreshMissions]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="text-2xl animate-pulse text-fg">loading...</span>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <OnboardingScreen />;
  }

  const dailyMissions = missions.activeMissions.filter((m) => m.type === 'daily');
  const doneCount = dailyMissions.filter((m) => m.completed).length;
  const totalDaily = dailyMissions.length;

  return (
    <div className="min-h-screen bg-surface text-fg">
      <TopBar onMissionsClick={() => setShowMissions(true)} />
      <main className="max-w-lg mx-auto pt-16 pb-20 px-4">
        {children}
      </main>
      <BottomNav />

      {/* Floating Reward Popups */}
      <FloatingRewardLayer />

      {/* Achievement Toast */}
      <AchievementToast />

      {/* Level Up Overlay */}
      <LevelUpOverlay />

      {/* Daily Bonus Modal */}
      {showDailyBonus && <DailyBonusModal onClose={() => setShowDailyBonus(false)} />}

      {/* Event Modal */}
      {pendingEventId && !showDailyBonus && (
        <EventModal eventId={pendingEventId} onClose={dismissPendingEvent} />
      )}

      {/* باتن‌شیت ماموریت‌های روزانه */}
      {showMissions && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowMissions(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto bg-surface-elevated rounded-t-3xl border-t border-x border-line overflow-hidden">
              {/* Handle + Header */}
              <div className="flex flex-col items-center pt-3 pb-2 px-4 border-b border-line/50">
                <div className="w-10 h-1 rounded-full bg-fg-faint/30 mb-3" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black">ماموریت‌های روزانه</h2>
                    <span className="text-[9px] bg-surface-card text-fg-muted px-2 py-0.5 rounded-full font-bold font-fa">
                      {doneCount}/{totalDaily}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMissions(false)}
                    className="p-1.5 rounded-full hover:bg-surface-card transition-colors text-fg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* لیست ماموریت‌ها */}
              <div className="px-4 py-3 space-y-2">
                {dailyMissions.length === 0 ? (
                  <p className="text-[11px] text-fg-muted text-center py-4">ماموریت روزانه‌ای موجود نیست</p>
                ) : (
                  dailyMissions.map((m) => {
                    const isClaimable = m.completed && !m.claimed;
                    const isDone = m.claimed;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 border ${
                          isDone
                            ? 'bg-surface-card/40 border-line/30'
                            : isClaimable
                            ? 'bg-[#F59E0B]/5 border-[#F59E0B]/30'
                            : 'bg-surface-card/60 border-line/50'
                        }`}
                      >
                        <span className="text-lg shrink-0">{isDone ? '✅' : m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-medium block ${isDone ? 'text-fg-muted line-through' : 'text-fg-secondary'}`}>
                            {m.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 rounded-full bg-progress-bg overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isDone ? 'bg-accent-positive' : isClaimable ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'}`}
                                style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                              />
                            </div>
                            <span className="text-[9px] text-fg-faint font-fa">{m.progress}/{m.target}</span>
                          </div>
                        </div>
                        {isClaimable ? (
                          <button
                            onClick={() => claimMissionReward(m.id)}
                            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EF4444] text-white text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
                          >
                            <Gift size={11} />
                            جایزه
                          </button>
                        ) : isDone ? (
                          <CheckCircle2 size={16} className="text-accent-positive shrink-0" />
                        ) : (
                          <div className="shrink-0 flex items-center gap-0.5 text-[10px] text-fg-faint">
                            <Sparkles size={10} />
                            <span className="font-fa">{m.reward.toLocaleString('fa-IR')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* پیشرفت کلی */}
              <div className="px-4 py-3 border-t border-line/50">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-fg-muted">پیشرفت روزانه</span>
                  <span className="text-fg-secondary font-fa font-bold">{doneCount}/{totalDaily}</span>
                </div>
                <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-positive rounded-full transition-all"
                    style={{ width: `${totalDaily > 0 ? (doneCount / totalDaily) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
