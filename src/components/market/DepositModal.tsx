'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BANK_TEMPLATES } from '@/data/mock';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { X, AlertTriangle, Check } from 'lucide-react';

const PERSONALITY_COLORS: Record<string, string> = {
  conservative: '#22C55E',
  moderate: '#3B82F6',
  risky: '#F97316',
};

function msToMinutes(ms: number): number {
  return Math.round(ms / 60_000);
}

interface DepositModalProps {
  bankId: string;
  onClose: () => void;
}

export default function DepositModal({ bankId, onClose }: DepositModalProps) {
  const canDeposit = useGameStore((s) => s.canDeposit);
  const deposit = useGameStore((s) => s.deposit);
  const playerBalance = useGameStore((s) => s.player.balance);

  const [amount, setAmount] = useState<number>(0);

  const bank = BANK_TEMPLATES.find((b) => b.id === bankId);
  if (!bank) return null;

  const color = PERSONALITY_COLORS[bank.personality] ?? '#3B82F6';
  const intervalMinutes = msToMinutes(bank.depositInterestIntervalMs);
  const interestPreview = Math.round(amount * bank.depositInterestRate);
  const check = canDeposit(bankId, amount);

  function handleQuickSelect(pct: number) {
    const raw = Math.floor(playerBalance * pct);
    setAmount(Math.min(raw, bank!.maxDepositAmount));
  }

  function handleConfirm() {
    deposit(bankId, amount);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-surface-elevated w-full max-w-lg rounded-t-3xl max-h-[90vh] flex flex-col">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-fg-faint/30 rounded-full mx-auto mt-3 mb-2" />

        {/* Header */}
        <div className="flex-shrink-0 px-5 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-fg-primary flex items-center gap-2">
              <span className="text-lg">{bank.icon}</span>
              <span>{bank.name}</span>
              <span className="text-fg-secondary">- سپرده‌گذاری</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-surface-card/50 text-fg-secondary hover:text-fg-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-4">
          {/* Info rows */}
          <div className="rounded-[16px] bg-surface-card/60 border border-line-subtle p-4 space-y-2">
            {/* Interest rate */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-fg-secondary">نرخ سود سپرده</span>
              <span className="text-[10px] font-bold font-fa" style={{ color }}>
                {(bank.depositInterestRate * 100).toLocaleString('fa-IR')}% هر{' '}
                {intervalMinutes.toLocaleString('fa-IR')} دقیقه
              </span>
            </div>

            {/* Withdrawal penalty */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-fg-secondary">جریمه برداشت زودهنگام</span>
              <span
                className={`text-[10px] font-bold font-fa ${
                  bank.earlyWithdrawalPenaltyRate > 0 ? 'text-orange-400' : 'text-[#22C55E]'
                }`}
              >
                {bank.earlyWithdrawalPenaltyRate > 0
                  ? `${(bank.earlyWithdrawalPenaltyRate * 100).toLocaleString('fa-IR')}% از سود`
                  : 'بدون جریمه'}
              </span>
            </div>

            {/* Min / Max */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-fg-secondary">حداقل / حداکثر</span>
              <span className="text-[10px] font-bold font-fa text-fg-primary">
                {bank.minDepositAmount.toLocaleString('fa-IR')} /{' '}
                {bank.maxDepositAmount.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              placeholder="مبلغ سپرده"
              className="w-full bg-surface-card/50 rounded-[12px] px-4 py-3 text-center text-lg font-bold font-fa border border-line-subtle text-fg-primary placeholder:text-fg-faint/50 outline-none focus:border-fg-secondary transition-colors"
              min={0}
            />
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] text-fg-faint font-fa">
                حداقل: {bank.minDepositAmount.toLocaleString('fa-IR')}
              </span>
              <span className="text-[9px] text-fg-faint font-fa">
                حداکثر: {bank.maxDepositAmount.toLocaleString('fa-IR')}
              </span>
            </div>
          </div>

          {/* Quick-select buttons */}
          <div className="flex gap-2">
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <button
                key={pct}
                onClick={() => handleQuickSelect(pct)}
                className="flex-1 py-1.5 rounded-[999px] text-[10px] font-bold bg-surface-card/50 border border-line-subtle text-fg-secondary hover:text-fg-primary hover:border-fg-faint transition-colors active:scale-[0.97]"
              >
                {(pct * 100).toLocaleString('fa-IR')}%
              </button>
            ))}
          </div>

          {/* Interest preview */}
          {amount > 0 && (
            <div className="rounded-[12px] bg-surface-card/40 border border-line-subtle p-3 text-center">
              <span className="text-[10px] text-fg-secondary">
                سود تقریبی هر {intervalMinutes.toLocaleString('fa-IR')} دقیقه:{' '}
              </span>
              <span className="text-[11px] font-bold font-fa" style={{ color }}>
                {interestPreview.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          )}

          {/* Early withdrawal warning */}
          {bank.earlyWithdrawalPenaltyRate > 0 && (
            <div className="flex items-center gap-2 rounded-[12px] bg-orange-500/10 border border-orange-500/20 px-3 py-2">
              <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />
              <span className="text-[10px] text-orange-400 font-fa">
                برداشت زودهنگام:{' '}
                {(bank.earlyWithdrawalPenaltyRate * 100).toLocaleString('fa-IR')}% از سود کسر
                می‌شود
              </span>
            </div>
          )}

          {/* Confirm button */}
          <div className="pt-1">
            {!check.eligible && amount > 0 && (
              <div className="flex items-center gap-1.5 justify-center mb-2">
                <AlertTriangle size={11} className="text-fg-faint" />
                <span className="text-[10px] text-fg-faint">{check.reason}</span>
              </div>
            )}
            <button
              onClick={handleConfirm}
              disabled={!check.eligible}
              className={`w-full py-2.5 rounded-[999px] text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                check.eligible ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ backgroundColor: color }}
            >
              <Check size={14} />
              سپرده‌گذاری
              {amount > 0 && (
                <span className="font-fa mr-1">
                  {amount.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
