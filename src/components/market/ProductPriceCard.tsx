'use client';

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

function MiniSparkline({ data, isUp }: { data: number[]; isUp: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (w - padding * 2);
    const y = h - padding - ((val - min) / range) * (h - padding * 2);
    return `${x},${y}`;
  });

  const pathD = points.map((p, i) => (i === 0 ? `M${p}` : `L${p}`)).join(' ');
  // Area fill path
  const lastX = padding + ((data.length - 1) / (data.length - 1)) * (w - padding * 2);
  const firstX = padding;
  const areaD = `${pathD} L${lastX},${h} L${firstX},${h} Z`;

  const color = isUp ? '#22C55E' : '#EF4444';
  const fillColor = isUp ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <path d={areaD} fill={fillColor} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot on last point */}
      <circle
        cx={parseFloat(points[points.length - 1].split(',')[0])}
        cy={parseFloat(points[points.length - 1].split(',')[1])}
        r="2"
        fill={color}
      />
    </svg>
  );
}

export default function ProductPriceCard({ product }: ProductPriceCardProps) {
  const priceDiff = product.currentPrice - product.basePrice;
  const pricePct = ((priceDiff / product.basePrice) * 100).toFixed(0);
  const isUp = priceDiff >= 0;
  const isHot = Math.abs(priceDiff / product.basePrice) >= 0.2;

  // Supply vs demand indicator
  const supplyDemandRatio = product.demand > 0 ? product.supply / product.demand : 1;
  const demandLabel = supplyDemandRatio < 0.7 ? 'کمبود' : supplyDemandRatio > 1.3 ? 'مازاد' : 'متعادل';
  const demandIcon = supplyDemandRatio < 0.7 ? '🔥' : supplyDemandRatio > 1.3 ? '📦' : '⚖️';

  return (
    <div
      className={`rounded-[16px] border p-3 transition-all ${
        isHot
          ? isUp
            ? 'border-[#22C55E]/30'
            : 'border-[#EF4444]/30'
          : 'border-line-subtle'
      }`}
      style={{
        background: isHot
          ? isUp
            ? 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.02))'
          : 'rgba(255,255,255,0.03)',
        boxShadow: isHot
          ? isUp
            ? '0 0 12px rgba(34,197,94,0.1)'
            : '0 0 12px rgba(239,68,68,0.1)'
          : 'none',
      }}
    >
      {/* Row 1: Icon + Name + Price */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{product.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-black truncate">{product.name}</p>
          <p className="text-[8px] text-fg-faint">{categoryLabels[product.category]}</p>
        </div>
        <div className="text-left">
          <p className="text-[14px] font-black font-fa text-accent-money">{product.currentPrice.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      {/* Row 2: Sparkline */}
      <div className="mt-1.5">
        <MiniSparkline data={product.priceHistory} isUp={isUp} />
      </div>

      {/* Row 3: Change % + Demand indicator */}
      <div className="flex items-center justify-between mt-1">
        <span className={`text-[11px] font-black font-fa ${isUp ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{pricePct}%
        </span>
        <span className="text-[9px] text-fg-muted flex items-center gap-0.5">
          {demandIcon} {demandLabel}
        </span>
      </div>
    </div>
  );
}
