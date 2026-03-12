'use client';

import { ReactNode, useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useGameTick } from '@/hooks/useGameTick';
import { useGameStore } from '@/store/gameStore';

export default function GameShell({ children }: { children: ReactNode }) {
  useGameTick();

  const theme = useGameStore((s) => s.theme);

  // منتظر hydration از localStorage
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // اعمال تم روی html
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

  return (
    <div className="min-h-screen bg-surface text-fg">
      <TopBar />
      <main className="max-w-lg mx-auto pt-16 pb-20 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
