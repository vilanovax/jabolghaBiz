'use client';

import { MarketListing } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface MarketListingCardProps {
  listing: MarketListing;
}

export default function MarketListingCard({ listing }: MarketListingCardProps) {
  const buyListing = useGameStore((s) => s.buyListing);
  const playerId = useGameStore((s) => s.player.id);
  const balance = useGameStore((s) => s.player.balance);
  const products = useGameStore((s) => s.products);

  const isOwn = listing.sellerId === playerId;
  const canAfford = balance >= listing.pricePerUnit;
  const product = products.find((p) => p.id === listing.productId);
  const totalCost = listing.pricePerUnit * listing.quantity;

  // Is this a good deal? (below market price)
  const marketPrice = product?.currentPrice ?? listing.pricePerUnit;
  const discount = ((marketPrice - listing.pricePerUnit) / marketPrice) * 100;
  const isGoodDeal = discount >= 5;

  return (
    <div
      className={`rounded-[18px] border overflow-hidden transition-all ${
        isGoodDeal ? 'border-[#22C55E]/30' : 'border-line-subtle'
      }`}
      style={{
        background: isGoodDeal
          ? 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))'
          : undefined,
        boxShadow: isGoodDeal ? '0 0 12px rgba(34,197,94,0.08)' : undefined,
      }}
    >
      {/* Deal badge */}
      {isGoodDeal && (
        <div
          className="px-3 py-1 text-[9px] font-bold text-white flex items-center gap-1"
          style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}
        >
          💰 پیشنهاد ویژه — {discount.toFixed(0)}% زیر قیمت بازار
        </div>
      )}

      <div className="p-3">
        {/* Row 1: Product info */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-2xl shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {product?.icon || '📦'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-black truncate">{listing.productName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-fg-muted">🏪 {listing.sellerName}</span>
              <span className="text-fg-faint">·</span>
              <span className="text-[9px] text-fg-muted font-fa">{listing.quantity}×</span>
            </div>
          </div>
          <div className="text-left shrink-0">
            <p className="text-[16px] font-black font-fa text-accent-money">{listing.pricePerUnit.toLocaleString('fa-IR')}</p>
            <p className="text-[8px] text-fg-faint text-center">هر واحد</p>
          </div>
        </div>

        {/* Row 2: Total + Buy */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-fg-muted">
              مجموع: <span className="font-fa font-bold text-fg-secondary">{totalCost.toLocaleString('fa-IR')}</span>
            </span>
            {product && listing.pricePerUnit !== product.currentPrice && (
              <span className={`text-[9px] font-bold ${listing.pricePerUnit < product.currentPrice ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {listing.pricePerUnit < product.currentPrice ? '▼' : '▲'} vs بازار
              </span>
            )}
          </div>
          {!isOwn ? (
            <button
              onClick={() => buyListing(listing.id, 1)}
              disabled={!canAfford}
              className="text-white px-5 py-2 rounded-[999px] text-[11px] font-black active:scale-95 transition-all disabled:opacity-40"
              style={{
                background: canAfford
                  ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                  : undefined,
                boxShadow: canAfford
                  ? '0 4px 14px rgba(34,197,94,0.3)'
                  : undefined,
              }}
            >
              🛒 خرید
            </button>
          ) : (
            <span className="text-[10px] text-[#6366F1] font-bold bg-[#6366F1]/10 px-3 py-1.5 rounded-[999px]">آگهی شما</span>
          )}
        </div>
      </div>
    </div>
  );
}
