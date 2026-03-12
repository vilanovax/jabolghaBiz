'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import NewsCard from '@/components/news/NewsCard';
import LeaderboardRow from '@/components/social/LeaderboardRow';
import Card from '@/components/ui/Card';
import { NewsCategory } from '@/types';

type NewsTab = 'all' | 'market' | 'ranking' | 'finance' | 'stock';

const tabFilters: Record<NewsTab, NewsCategory[] | null> = {
  all: null,
  market: ['market', 'event'],
  ranking: [],  // special: shows leaderboard
  finance: ['gold', 'currency', 'crypto'],
  stock: ['stock'],
};

export default function NewsPage() {
  const news = useGameStore((s) => s.news);
  const leaderboard = useGameStore((s) => s.leaderboard);
  const [activeTab, setActiveTab] = useState<NewsTab>('all');

  const totalWealth = leaderboard.reduce((sum, e) => sum + e.wealth, 0);

  const tabs: { key: NewsTab; label: string }[] = [
    { key: 'all', label: 'همه' },
    { key: 'market', label: '🏪 بازار' },
    { key: 'ranking', label: '🏆 رتبه‌بندی' },
    { key: 'finance', label: '💰 ارز و طلا' },
    { key: 'stock', label: '📈 بورس' },
  ];

  const filteredNews = activeTab === 'all'
    ? news
    : activeTab === 'ranking'
    ? []
    : news.filter((n) => tabFilters[activeTab]?.includes(n.category));

  // اخبار فوری بالا
  const breakingNews = filteredNews.filter((n) => n.isBreaking);
  const regularNews = filteredNews.filter((n) => !n.isBreaking);

  return (
    <div className="space-y-4 py-4 pb-24">
      {/* هدر */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">📰</span>
        <h1 className="text-xl font-black">روزنامه جابلقا</h1>
      </div>

      {/* تب‌ها */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              activeTab === t.key
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* تب رتبه‌بندی */}
      {activeTab === 'ranking' ? (
        <div className="space-y-3">
          <Card className="text-center py-3">
            <p className="text-[10px] text-zinc-500 tracking-wider">اقتصاد کل</p>
            <p className="text-xl font-black text-amber-400 font-fa">
              {new Intl.NumberFormat('fa-IR').format(totalWealth)} تومان
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{leaderboard.length} بازیکن فعال</p>
          </Card>
          <div className="space-y-2">
            {leaderboard.map((entry) => (
              <LeaderboardRow key={entry.playerId} entry={entry} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* اخبار فوری */}
          {breakingNews.length > 0 && (
            <div className="space-y-2">
              {breakingNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* اخبار عادی */}
          {regularNews.length > 0 ? (
            <div className="space-y-2">
              {regularNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : breakingNews.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-xs text-zinc-400">خبری در این دسته‌بندی نیست</p>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
