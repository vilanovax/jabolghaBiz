'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MarketListingCard from '@/components/market/MarketListingCard';
import ProductPriceCard from '@/components/market/ProductPriceCard';
import { TrendingUp, ShoppingBag } from 'lucide-react';

type Tab = 'prices' | 'listings';

export default function MarketPage() {
  const products = useGameStore((s) => s.products);
  const listings = useGameStore((s) => s.listings);
  const [tab, setTab] = useState<Tab>('prices');

  // Sort products: hot (>20% change) first, then by absolute change
  const sortedProducts = [...products].sort((a, b) => {
    const aChange = Math.abs((a.currentPrice - a.basePrice) / a.basePrice);
    const bChange = Math.abs((b.currentPrice - b.basePrice) / b.basePrice);
    return bChange - aChange;
  });

  const hotCount = sortedProducts.filter(
    (p) => Math.abs((p.currentPrice - p.basePrice) / p.basePrice) >= 0.2
  ).length;

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-black">بازار</h1>
        {hotCount > 0 && (
          <span className="text-[10px] bg-[#EF4444]/15 text-[#EF4444] px-2 py-0.5 rounded-[999px] font-bold animate-pulse">
            🔥 {hotCount} محصول داغ
          </span>
        )}
      </div>

      {/* تب‌ها */}
      <div className="flex bg-surface-card/50 rounded-[999px] p-1">
        <button
          onClick={() => setTab('prices')}
          className={`flex-1 py-2 rounded-[999px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            tab === 'prices' ? 'bg-[#4F46E5] text-white shadow-[var(--shadow-glow)]' : 'text-fg-muted hover:text-fg-secondary'
          }`}
        >
          <TrendingUp size={14} />
          قیمت‌ها ({products.length})
        </button>
        <button
          onClick={() => setTab('listings')}
          className={`flex-1 py-2 rounded-[999px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            tab === 'listings' ? 'bg-[#4F46E5] text-white shadow-[var(--shadow-glow)]' : 'text-fg-muted hover:text-fg-secondary'
          }`}
        >
          <ShoppingBag size={14} />
          آگهی‌ها ({listings.length})
        </button>
      </div>

      {/* محتوا */}
      {tab === 'prices' && (
        <div className="grid grid-cols-2 gap-2">
          {sortedProducts.map((product) => (
            <ProductPriceCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {tab === 'listings' && (
        <div className="space-y-2.5">
          {listings.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">🏪</p>
              <p className="text-sm font-bold text-fg-secondary">بازار خالیه!</p>
              <p className="text-[10px] text-fg-muted mt-1">هنوز کسی آگهی نذاشته</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] text-fg-muted">
                💡 آگهی‌هایی که زیر قیمت بازار هستن با <span className="text-[#22C55E] font-bold">پیشنهاد ویژه</span> مشخص شدن
              </p>
              {listings.map((listing) => (
                <MarketListingCard key={listing.id} listing={listing} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
