'use client';

import { useGameStore } from '@/store/gameStore';
import type { SpecialOrder } from '@/types';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Clock, Package, AlertTriangle } from 'lucide-react';

interface Props {
  order: SpecialOrder;
}

export default function AcceptedOrderCard({ order }: Props) {
  const deliverOrder = useGameStore((s) => s.deliverOrder);
  const businesses = useGameStore((s) => s.businesses);
  const biz = businesses.find((b) => b.id === order.businessId);

  const deadlineMs = Math.max(0, order.deadline - Date.now());
  const deadlineMins = Math.ceil(deadlineMs / 60000);
  const isUrgent = deadlineMins <= 5;
  const progressPct = Math.min(100, (order.deliveredQuantity / order.quantity) * 100);
  const remaining = order.quantity - order.deliveredQuantity;
  const canDeliver = biz && biz.inventory.quantity > 0 && remaining > 0;

  return (
    <div className={`rounded-[16px] border p-3 space-y-2 ${
      isUrgent
        ? 'border-[#EF4444]/30 bg-[#EF4444]/5'
        : 'border-line-subtle bg-surface-card/50'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{order.companyIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{order.companyName}</p>
          <p className="text-[9px] text-fg-muted">{order.productName}</p>
        </div>
        <div className={`flex items-center gap-1 text-[9px] ${isUrgent ? 'text-[#EF4444] animate-pulse' : 'text-fg-faint'}`}>
          {isUrgent ? <AlertTriangle size={10} /> : <Clock size={10} />}
          <span className="font-fa">{deadlineMins} دقیقه</span>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-fg-muted">
            <Package size={10} className="inline" /> تحویل: <span className="font-fa font-bold">{order.deliveredQuantity}/{order.quantity}</span>
          </span>
          <span className="text-fg-faint font-fa">{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#6366F1] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Business info */}
      {biz && (
        <div className="flex items-center gap-2 text-[9px] text-fg-muted">
          <span>{biz.icon} {biz.name}</span>
          <span className="text-fg-faint">|</span>
          <span>📦 موجودی: <span className="font-fa font-bold text-fg-secondary">{biz.inventory.quantity}</span></span>
        </div>
      )}

      {/* Payment + Deliver */}
      <div className="flex items-center justify-between">
        <MoneyDisplay amount={order.totalPayment} size="sm" />
        <button
          onClick={() => deliverOrder(order.id)}
          disabled={!canDeliver}
          className="px-4 py-1.5 rounded-[999px] text-[10px] font-bold text-white bg-[#22C55E] hover:bg-emerald-400 disabled:opacity-40 active:scale-[0.97] transition-all"
        >
          {remaining <= 0 ? 'تکمیل شد' : `تحویل (${Math.min(biz?.inventory.quantity ?? 0, remaining)})`}
        </button>
      </div>
    </div>
  );
}
