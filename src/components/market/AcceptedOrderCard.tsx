'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { SpecialOrder } from '@/types';
import { Package } from 'lucide-react';

interface Props {
  order: SpecialOrder;
}

export default function AcceptedOrderCard({ order }: Props) {
  const deliverOrder = useGameStore((s) => s.deliverOrder);
  const businesses = useGameStore((s) => s.businesses);
  const biz = businesses.find((b) => b.id === order.businessId);
  const [deadlineMs, setDeadlineMs] = useState(() => Math.max(0, order.deadline - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setDeadlineMs(Math.max(0, order.deadline - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.deadline]);

  const deadlineMins = Math.ceil(deadlineMs / 60000);
  const deadlineSecs = Math.floor((deadlineMs % 60000) / 1000);
  const isHot = deadlineMins <= 5;
  const isWarm = deadlineMins <= 15;

  const progressPct = Math.min(100, (order.deliveredQuantity / order.quantity) * 100);
  const remaining = order.quantity - order.deliveredQuantity;
  const inventoryQty = biz?.inventory.quantity ?? 0;
  const deliverQty = Math.min(inventoryQty, remaining);
  const canDeliver = deliverQty > 0 && remaining > 0;
  const isDone = remaining <= 0;

  const borderColor = isHot ? 'rgba(239,68,68,0.3)' : isWarm ? 'rgba(245,158,11,0.2)' : 'rgba(212,212,216,0.4)';
  const bgColor = isHot ? 'rgba(239,68,68,0.06)' : isWarm ? 'rgba(245,158,11,0.04)' : 'transparent';
  const accentColor = isHot ? '#EF4444' : isWarm ? '#F59E0B' : '#22C55E';
  const barFill = isDone ? '#22C55E' : isHot ? '#EF4444' : '#6366F1';

  const formatTime = () => {
    if (deadlineMins <= 1) return `${deadlineSecs}ث`;
    return `${deadlineMins} دقیقه`;
  };

  return (
    <div
      className="rounded-[18px] p-4 space-y-3"
      style={{ background: bgColor, border: `1px solid ${borderColor}` }}
    >
      {/* Row 1: Company + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{order.companyIcon}</span>
          <div>
            <p className="text-[12px] font-black text-fg truncate">{order.companyName}</p>
            <p className="text-[9px] text-fg-muted">{order.productName}</p>
          </div>
        </div>
        {!isDone && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${isHot ? 'animate-warning-pulse' : ''}`}
            style={{ background: `${accentColor}18`, color: accentColor }}
          >
            <span>{isHot ? '🔥' : isWarm ? '⏳' : '⏱'}</span>
            <span className="font-fa">{formatTime()}</span>
          </div>
        )}
        {isDone && (
          <span className="text-[10px] font-black text-[#22C55E] bg-[#22C55E]/12 px-2 py-1 rounded-full">
            ✅ تکمیل
          </span>
        )}
      </div>

      {/* Row 2: Delivery progress */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1.5">
          <span className="text-fg-muted flex items-center gap-1">
            <Package size={10} />
            <span className="font-fa font-bold">{order.deliveredQuantity}/{order.quantity}</span> واحد
          </span>
          <span className="font-fa font-black" style={{ color: isDone ? '#22C55E' : accentColor }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, backgroundColor: barFill }}
          />
        </div>
      </div>

      {/* Row 3: Biz info + payment + deliver button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          {biz && (
            <p className="text-[9px] text-fg-muted">
              {biz.icon} {biz.name} · <span className="font-fa font-bold text-fg-secondary">📦 {inventoryQty}</span>
            </p>
          )}
          <p className="text-[14px] font-black font-fa text-accent-money mt-0.5">
            {order.totalPayment.toLocaleString('fa-IR')} <span className="text-[9px] text-fg-faint font-normal">تومان</span>
          </p>
        </div>
        <button
          onClick={() => deliverOrder(order.id)}
          disabled={!canDeliver}
          className="shrink-0 px-4 py-2.5 rounded-[12px] text-[11px] font-black text-white active:scale-[0.97] transition-all disabled:opacity-40"
          style={{
            background: canDeliver
              ? `linear-gradient(135deg, ${accentColor}, ${isHot ? '#DC2626' : isWarm ? '#D97706' : '#16A34A'})`
              : undefined,
            backgroundColor: canDeliver ? undefined : 'rgba(0,0,0,0.1)',
            boxShadow: canDeliver ? `0 4px 12px ${accentColor}40` : undefined,
          }}
        >
          {isDone ? 'تکمیل شد ✓' : `🚚 تحویل (${deliverQty})`}
        </button>
      </div>
    </div>
  );
}
