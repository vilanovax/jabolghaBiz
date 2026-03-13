'use client';

import Card from '@/components/ui/Card';
import { NewsArticle, NewsCategory } from '@/types';

const categoryLabels: Record<NewsCategory, string> = {
  market: 'بازار',
  ranking: 'رتبه‌بندی',
  gold: 'طلا',
  currency: 'ارز',
  crypto: 'رمزارز',
  stock: 'بورس',
  event: 'رویداد',
};

const categoryColors: Record<NewsCategory, string> = {
  market: '#6366f1',
  ranking: '#f59e0b',
  gold: '#eab308',
  currency: '#22c55e',
  crypto: '#8b5cf6',
  stock: '#3b82f6',
  event: '#ec4899',
};

const categoryGlow: Record<NewsCategory, 'primary' | 'profit' | 'gold'> = {
  market: 'primary',
  ranking: 'gold',
  gold: 'gold',
  currency: 'profit',
  crypto: 'primary',
  stock: 'primary',
  event: 'primary',
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'الان';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days} روز پیش`;
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card
      className={`${article.isBreaking ? 'animate-pulse-glow' : ''}`}
      glow={article.isBreaking ? categoryGlow[article.category] : 'none'}
    >
      <div className="flex gap-3">
        <span className="text-2xl shrink-0">{article.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {article.isBreaking && (
              <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">فوری</span>
            )}
            <span
              className="text-[8px] text-white px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: categoryColors[article.category] }}
            >
              {categoryLabels[article.category]}
            </span>
            <span className="text-[9px] text-fg-faint mr-auto font-fa">{timeAgo(article.timestamp)}</span>
          </div>
          <h3 className="text-xs font-bold text-fg leading-relaxed">{article.title}</h3>
          <p className="text-[10px] text-fg-secondary mt-1 leading-relaxed">{article.summary}</p>
        </div>
      </div>
    </Card>
  );
}
