'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { SpecialOrder } from '@/types';

interface Props {
  order: SpecialOrder;
}

type Urgency = 'hot' | 'warm' | 'cool';

const URGENCY_CONFIG = {
  hot:  {
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.3)',
    barColor: '#EF4444',
    btnBg: 'linear-gradient(135deg, #EF4444, #DC2626)',
    btnShadow: '0 4px 14px rgba(239,68,68,0.35)',
    timeLabel: '🔥',
    pulse: true,
  },
  warm: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.05)',
    border: 'rgba(245,158,11,0.25)',
    barColor: '#F59E0B',
    btnBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
    btnShadow: '0 4px 14px rgba(245,158,11,0.3)',
    timeLabel: '⏳',
    pulse: false,
  },
  cool: {
    color: '#6366F1',
    bg: 'transparent',
    border: 'rgba(212,212,216,0.4)',
    barColor: '#6366F1',
    btnBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    btnShadow: '0 4px 14px rgba(99,102,241,0.3)',
    timeLabel: '📋',
    pulse: false,
  },
};

export default function SpecialOrderCard({ order }: Props) {
  const businesses = useGameStore((s) => s.businesses);
  const acceptOrder = useGameStore((s) => s.acceptOrder);
  const [showBizPicker, setShowBizPicker] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState(() => Math.max(0, order.deadline - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      setDeadlineMs(Math.max(0, order.deadline - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.deadline]);

  const deadlineMins = Math.ceil(deadlineMs / 60000);
  const deadlineSecs = Math.floor((deadlineMs % 60000) / 1000);
  const urgency: Urgency = deadlineMins <= 5 ? 'hot' : deadlineMins <= 15 ? 'warm' : 'cool';
  const u = URGENCY_CONFIG[urgency];

  // Bar: countdown from 30 min max
  const barPct = Math.min(100, (deadlineMs / (30 * 60 * 1000)) * 100);

  const matchingBiz = businesses.filter((b) => b.inventory.productId === order.productId);

  const handleAccept = (bizId: string) => {
    acceptOrder(order.id, bizId);
    setShowBizPicker(false);
  };

  const formatTime = () => {
    if (deadlineMins <= 1) return `${deadlineSecs}ث`;
    return `${deadlineMins} دقیقه`;
  };

  return (
    <div
      className="rounded-[18px] p-4 space-y-3 overflow-hidden"
      style={{ background: u.bg, border: `1px solid ${u.border}` }}
    >
      {/* Row 1: Company + time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{order.companyIcon}</span>
          <div>
            <p className="text-[12px] font-black text-fg truncate">{order.companyName}</p>
            <p className="text-[9px] text-fg-muted">{order.productName} · <span className="font-fa">{order.quantity}</span> واحد</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${u.pulse ? 'animate-warning-pulse' : ''}`}
          style={{ background: `${u.color}18`, color: u.color }}
        >
          <span>{u.timeLabel}</span>
          <span className="font-fa">{formatTime()}</span>
        </div>
      </div>

      {/* Row 2: Payment — hero number */}
      <div className="text-center py-1">
        <p className="text-[28px] font-black font-fa leading-none" style={{ color: u.color }}>
          {order.totalPayment.toLocaleString('fa-IR')}
        </p>
        <p className="text-[9px] text-fg-faint mt-0.5">
          تومان · <span className="font-fa">{order.pricePerUnit.toLocaleString('fa-IR')}</span>/واحد
        </p>
      </div>

      {/* Row 3: Deadline bar */}
      <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${barPct}%`, backgroundColor: u.barColor }}
        />
      </div>

      {/* Row 4: Accept */}
      {!showBizPicker ? (
        <button
          onClick={() => matchingBiz.length === 1 ? handleAccept(matchingBiz[0].id) : setShowBizPicker(true)}
          disabled={matchingBiz.length === 0}
          className="w-full py-3 rounded-[14px] text-[12px] font-black text-white active:scale-[0.97] transition-all disabled:opacity-40"
          style={{ background: u.btnBg, boxShadow: u.btnShadow }}
        >
          {matchingBiz.length === 0 ? '❌ شرکت مناسب ندارید' : '✅ قبول سفارش'}
        </button>
      ) : (
        <div className="space-y-1.5">
          <p className="text-[9px] text-fg-muted">انتخاب شرکت:</p>
          {matchingBiz.map((biz) => (
            <button
              key={biz.id}
              onClick={() => handleAccept(biz.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] border border-line-subtle bg-surface-card/60 active:scale-[0.97] transition-all text-right"
            >
              <span>{biz.icon}</span>
              <span className="text-[11px] font-bold flex-1 truncate">{biz.name}</span>
              <span className="text-[9px] text-fg-muted font-fa">📦 {biz.inventory.quantity}</span>
            </button>
          ))}
          <button onClick={() => setShowBizPicker(false)} className="w-full text-[10px] text-fg-muted py-1">
            انصراف
          </button>
        </div>
      )}
    </div>
  );
}
