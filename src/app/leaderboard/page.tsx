'use client';

import { useGameStore } from '@/store/gameStore';
import LeaderboardRow from '@/components/social/LeaderboardRow';
import Card from '@/components/ui/Card';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboard = useGameStore((s) => s.leaderboard);

  const totalWealth = leaderboard.reduce((sum, e) => sum + e.wealth, 0);

  return (
    <div className="space-y-5 py-4">
      <div className="flex items-center gap-2">
        <Trophy size={22} className="text-yellow-400" />
        <h1 className="text-xl font-black">رتبه‌بندی</h1>
      </div>

      <Card className="text-center py-4">
        <p className="text-[10px] text-fg-muted tracking-wider">اقتصاد کل</p>
        <p className="text-2xl font-black text-accent-money font-fa">
          {new Intl.NumberFormat('fa-IR').format(totalWealth)} تومان
        </p>
        <p className="text-xs text-fg-muted mt-1">{leaderboard.length} بازیکن فعال</p>
      </Card>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <LeaderboardRow key={entry.playerId} entry={entry} />
        ))}
      </div>
    </div>
  );
}
