'use client';

import MissionsPanel from '@/components/missions/MissionsPanel';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MissionsPage() {
  return (
    <div className="py-4 pb-24 space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-fg-muted hover:text-fg">
          <ChevronRight size={20} />
        </Link>
        <h1 className="font-black text-lg">ماموریت‌ها و دستاوردها</h1>
      </div>
      <MissionsPanel />
    </div>
  );
}
