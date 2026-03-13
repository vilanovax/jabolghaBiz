'use client';

import { ReactNode, useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useGameTick } from '@/hooks/useGameTick';
import { useGameStore } from '@/store/gameStore';
import { X, CheckCircle2, Circle } from 'lucide-react';
import DailyBonusModal from '@/components/hooks/DailyBonusModal';

const dailyTasks = [
  { text: 'یک کارمند جدید استخدام کن', done: false },
  { text: 'یک کسب‌وکار را ارتقا بده', done: false },
  { text: 'محصولی در بازار بفروش', done: true },
];

export default function GameShell({ children }: { children: ReactNode }) {
  useGameTick();

  const theme = useGameStore((s) => s.theme);
  const canClaimDailyBonus = useGameStore((s) => s.canClaimDailyBonus);
  const [hydrated, setHydrated] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);

  useEffect(() => setHydrated(true), []);

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

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="text-2xl animate-pulse text-fg">loading...</span>
      </div>
    );
  }

  const doneCount = dailyTasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen bg-surface text-fg">
      <TopBar onMissionsClick={() => setShowMissions(true)} />
      <main className="max-w-lg mx-auto pt-16 pb-20 px-4">
        {children}
      </main>
      <BottomNav />

      {/* Daily Bonus Modal */}
      {showDailyBonus && <DailyBonusModal onClose={() => setShowDailyBonus(false)} />}

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
                      {doneCount}/{dailyTasks.length}
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
                {dailyTasks.map((task, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 border ${
                      task.done
                        ? 'bg-surface-card/40 border-line/30'
                        : 'bg-surface-card/60 border-line/50'
                    }`}
                  >
                    {task.done ? (
                      <CheckCircle2 size={18} className="text-accent-positive shrink-0" />
                    ) : (
                      <Circle size={18} className="text-fg-faint shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${task.done ? 'text-fg-muted line-through' : 'text-fg-secondary'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* پیشرفت کلی */}
              <div className="px-4 py-3 border-t border-line/50">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-fg-muted">پیشرفت روزانه</span>
                  <span className="text-fg-secondary font-fa font-bold">{doneCount}/{dailyTasks.length}</span>
                </div>
                <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-positive rounded-full transition-all"
                    style={{ width: `${(doneCount / dailyTasks.length) * 100}%` }}
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
