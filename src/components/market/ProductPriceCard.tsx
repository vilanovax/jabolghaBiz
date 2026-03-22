'use client';

import { Product } from '@/types';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';

interface ProductPriceCardProps {
  product: Product;
  producerLabel?: string;
  isMyProduct?: boolean;
}

export default function ProductPriceCard({ product, producerLabel, isMyProduct }: ProductPriceCardProps) {
  const businesses = useGameStore((s) => s.businesses);
  const priceDiff = product.currentPrice - product.basePrice;
  const pricePct = Math.round((priceDiff / product.basePrice) * 100);
  const isUp = priceDiff >= 0;
  const isHot = Math.abs(pricePct) >= 15;

  // پیدا کردن شرکت من که این محصول رو تولید می‌کنه
  const myBiz = businesses.find((b) => b.inventory.productId === product.id);
  const myInventory = myBiz ? myBiz.inventory.quantity : 0;

  // محاسبه سود تقریبی اگه الان بفروشم
  const potentialProfit = myInventory * product.currentPrice;

  // توصیه ساده
  const tip = isUp && isHot
    ? '📈 قیمت بالاست — وقت فروشه!'
    : !isUp && isHot
    ? '📉 قیمت پایینه — صبر کن'
    : '⚖️ قیمت عادیه';
  const tipColor = isUp && isHot ? '#22C55E' : !isUp && isHot ? '#EF4444' : '#6B7280';

  return (
    <div
      className={`rounded-[18px] border overflow-hidden transition-all ${
        isMyProduct
          ? isUp && isHot ? 'border-[#22C55E]/30' : !isUp && isHot ? 'border-[#EF4444]/30' : 'border-[#6366F1]/20'
          : 'border-line-subtle'
      }`}
      style={{
        background: isMyProduct
          ? isUp && isHot
            ? 'linear-gradient(135deg, rgba(34,197,94,0.06), transparent)'
            : !isUp && isHot
            ? 'linear-gradient(135deg, rgba(239,68,68,0.06), transparent)'
            : 'rgba(99,102,241,0.03)'
          : 'var(--surface-card)',
      }}
    >
      <div className="p-3">
        {/* آیکون + نام + قیمت */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{product.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-black truncate">{product.name}</p>
            {isMyProduct && (
              <span className="text-[7px] font-bold text-[#6366F1] bg-[#6366F1]/10 px-1.5 py-0.5 rounded-full">محصول من</span>
            )}
          </div>
        </div>

        {/* قیمت بزرگ + تغییر */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-[8px] text-fg-faint mb-0.5">قیمت فعلی</p>
            <p className="text-[18px] font-black font-fa text-accent-money leading-none">
              {product.currentPrice.toLocaleString('fa-IR')}
              <span className="text-[9px] text-fg-faint mr-1">ت</span>
            </p>
          </div>
          <div className={`text-left px-2 py-1 rounded-lg ${isUp ? 'bg-[#22C55E]/10' : 'bg-[#EF4444]/10'}`}>
            <p className={`text-[13px] font-black font-fa ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{pricePct}%
            </p>
          </div>
        </div>

        {/* نوار تغییر قیمت — بصری */}
        <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, 50 + pricePct)}%`,
              backgroundColor: isUp ? '#22C55E' : '#EF4444',
            }}
          />
        </div>

        {/* توصیه */}
        <p className="text-[9px] font-bold" style={{ color: tipColor }}>
          {tip}
        </p>
      </div>

      {/* فوتر — فقط برای محصول من */}
      {isMyProduct && myBiz && (
        <Link
          href={`/business/${myBiz.id}`}
          className="block px-3 py-2 border-t border-line-subtle/20 active:bg-surface-card/40 transition-colors"
          style={{ background: 'rgba(0,0,0,0.02)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-fg-faint">📦 انبار: <span className="font-bold font-fa">{myInventory}</span> واحد</span>
            {potentialProfit > 0 && (
              <span className="text-[8px] font-bold text-[#22C55E]">
                ≈ {potentialProfit.toLocaleString('fa-IR')} ت
              </span>
            )}
          </div>
        </Link>
      )}
    </div>
  );
}
