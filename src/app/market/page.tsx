'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import MarketListingCard from '@/components/market/MarketListingCard';
import ProductPriceCard from '@/components/market/ProductPriceCard';

type Tab = 'prices' | 'listings';

export default function MarketPage() {
  const products = useGameStore((s) => s.products);
  const listings = useGameStore((s) => s.listings);
  const [tab, setTab] = useState<Tab>('prices');

  return (
    <div className="space-y-5 py-4">
      <h1 className="text-xl font-black">بازار</h1>

      {/* تب‌ها */}
      <div className="flex bg-zinc-800/50 rounded-xl p-1">
        <button
          onClick={() => setTab('prices')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'prices' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          قیمت‌ها ({products.length})
        </button>
        <button
          onClick={() => setTab('listings')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'listings' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          آگهی‌ها ({listings.length})
        </button>
      </div>

      {/* محتوا */}
      {tab === 'prices' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">
            قیمت لحظه‌ای محصولات بر اساس عرضه و تقاضا
          </p>
          {products.map((product) => (
            <ProductPriceCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {tab === 'listings' && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-500">
            از بازیکنان دیگر خرید کنید یا محصولات خود را بفروشید
          </p>
          {listings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm text-zinc-400">آگهی‌ای موجود نیست</p>
            </div>
          ) : (
            listings.map((listing) => (
              <MarketListingCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
