'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { SpecialOrder } from '@/types';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Clock, Package } from 'lucide-react';

interface Props {
  order: SpecialOrder;
}

export default function SpecialOrderCard({ order }: Props) {
  const businesses = useGameStore((s) => s.businesses);
  const acceptOrder = useGameStore((s) => s.acceptOrder);
  const [showBizPicker, setShowBizPicker] = useState(false);

  // Find businesses that produce this product
  const matchingBiz = businesses.filter((b) => b.inventory.productId === order.productId);
  const deadlineMs = Math.max(0, order.deadline - Date.now());
  const deadlineMins = Math.ceil(deadlineMs / 60000);

  const handleAccept = (bizId: string) => {
    acceptOrder(order.id, bizId);
    setShowBizPicker(false);
  };

  return (
    <div className="rounded-[16px] border border-line-subtle bg-surface-card/50 p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{order.companyIcon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{order.companyName}</p>
          <p className="text-[9px] text-fg-muted">{order.productName}</p>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-fg-faint">
          <Clock size={10} />
          <span className="font-fa">{deadlineMins} دقیقه</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1 text-fg-muted">
          <Package size={10} />
          <span className="font-fa font-bold">{order.quantity}</span> واحد
        </div>
        <div>
          <span className="text-fg-muted">قیمت واحد: </span>
          <span className="text-accent-money font-fa font-bold">{order.pricePerUnit.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-surface-inset/30 rounded-[10px] px-2.5 py-1.5">
        <span className="text-[10px] text-fg-muted">کل پرداخت</span>
        <MoneyDisplay amount={order.totalPayment} size="sm" />
      </div>

      {/* Accept */}
      {!showBizPicker ? (
        <button
          onClick={() => matchingBiz.length === 1 ? handleAccept(matchingBiz[0].id) : setShowBizPicker(true)}
          disabled={matchingBiz.length === 0}
          className="w-full py-2 rounded-[999px] text-[11px] font-bold text-white bg-[#4F46E5] hover:bg-[#6366F1] disabled:opacity-40 active:scale-[0.97] transition-all"
        >
          {matchingBiz.length === 0 ? 'شرکت مناسب ندارید' : 'قبول سفارش'}
        </button>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[9px] text-fg-muted">انتخاب شرکت:</p>
          {matchingBiz.map((biz) => (
            <button
              key={biz.id}
              onClick={() => handleAccept(biz.id)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] border border-line-subtle bg-surface-card/40 hover:bg-surface-card/80 transition-colors text-right"
            >
              <span>{biz.icon}</span>
              <span className="text-[10px] font-bold flex-1 truncate">{biz.name}</span>
              <span className="text-[9px] text-fg-muted font-fa">📦 {biz.inventory.quantity}</span>
            </button>
          ))}
          <button
            onClick={() => setShowBizPicker(false)}
            className="w-full text-[10px] text-fg-muted py-1"
          >
            انصراف
          </button>
        </div>
      )}
    </div>
  );
}
