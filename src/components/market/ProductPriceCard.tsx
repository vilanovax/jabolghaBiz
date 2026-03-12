'use client';

import Card from '@/components/ui/Card';
import { Product } from '@/types';

const categoryLabels: Record<string, string> = {
  raw_material: 'ماده خام',
  processed: 'فرآوری‌شده',
  finished_good: 'کالای نهایی',
  food: 'غذا',
  tech: 'فناوری',
  service: 'خدمات',
};

interface ProductPriceCardProps {
  product: Product;
}

export default function ProductPriceCard({ product }: ProductPriceCardProps) {
  const priceDiff = product.currentPrice - product.basePrice;
  const pricePct = ((priceDiff / product.basePrice) * 100).toFixed(1);
  const isUp = priceDiff >= 0;

  const maxPrice = Math.max(...product.priceHistory);
  const minPrice = Math.min(...product.priceHistory);
  const range = maxPrice - minPrice || 1;

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{product.icon}</span>
          <div>
            <h4 className="text-sm font-bold">{product.name}</h4>
            <span className="text-[10px] text-fg-muted">{categoryLabels[product.category] || product.category}</span>
          </div>
        </div>
        <div className="text-left">
          <p className="text-accent-money font-fa font-bold">{product.currentPrice.toLocaleString('fa-IR')}</p>
          <p className={`text-[10px] font-medium ${isUp ? 'text-accent-positive' : 'text-accent-negative'}`}>
            {isUp ? '+' : ''}{pricePct}%
          </p>
        </div>
      </div>

      {/* نمودار مینی */}
      <div className="flex items-end gap-0.5 h-8">
        {product.priceHistory.map((price, i) => {
          const height = ((price - minPrice) / range) * 100;
          const isLast = i === product.priceHistory.length - 1;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm ${isLast ? (isUp ? 'bg-emerald-500' : 'bg-red-500') : 'bg-chart-bar'}`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-fg-muted mt-1">
        <span>عرضه: {product.supply}</span>
        <span>تقاضا: {product.demand}</span>
      </div>
    </Card>
  );
}
