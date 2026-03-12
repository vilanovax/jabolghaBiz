'use client';

import { ReactNode, useEffect, useState } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { useGameTick } from '@/hooks/useGameTick';

export default function GameShell({ children }: { children: ReactNode }) {
  useGameTick();

  // منتظر hydration از localStorage
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <span className="text-2xl animate-pulse">loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <TopBar />
      <main className="max-w-lg mx-auto pt-16 pb-20 px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
