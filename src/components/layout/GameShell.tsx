'use client';

import { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function GameShell({ children }: { children: ReactNode }) {
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
