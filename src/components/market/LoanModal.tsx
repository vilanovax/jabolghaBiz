'use client';

import { useGameStore } from '@/store/gameStore';
import { BANK_TEMPLATES } from '@/data/mock';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import type { LoanPackage } from '@/types';
import { X, Clock, AlertTriangle, Check } from 'lucide-react';

const PERSONALITY_COLORS: Record<string, string> = {
  conservative: '#22C55E',
  moderate: '#3B82F6',
  risky: '#F97316',
};

function msToMinutes(ms: number): number {
  return Math.round(ms / 60_000);
}

interface LoanModalProps {
  bankId: string;
  onClose: () => void;
}

export default function LoanModal({ bankId, onClose }: LoanModalProps) {
  const canTakeLoan = useGameStore((s) => s.canTakeLoan);
  const takeLoan = useGameStore((s) => s.takeLoan);

  const bank = BANK_TEMPLATES.find((b) => b.id === bankId);
  if (!bank) return null;

  const color = PERSONALITY_COLORS[bank.personality] ?? '#3B82F6';

  function handleTakeLoan(pkg: LoanPackage) {
    takeLoan(bankId, pkg.id);
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
              <span className="text-fg-secondary">- دریافت وام</span>
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
        <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
          {bank.loanPackages.map((pkg) => {
            const check = canTakeLoan(bankId, pkg.id);
            const intervalMinutes = msToMinutes(pkg.installmentIntervalMs);

            return (
              <div
                key={pkg.id}
                className={`rounded-[16px] border p-4 transition-all ${
                  check.eligible
                    ? 'bg-surface-card/60 border-line-subtle'
                    : 'bg-surface-card/30 border-line-subtle/50 opacity-60'
                }`}
              >
                {/* Package name */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold"
                    style={{ color }}
                  >
                    {pkg.name}
                  </span>
                  <MoneyDisplay amount={pkg.amount} size="sm" />
                </div>

                {/* Details grid */}
                <div className="space-y-1.5">
                  {/* Interest rate */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-fg-secondary">نرخ بهره</span>
                    <span className="text-[10px] font-bold font-fa text-fg-primary">
                      {(pkg.interestRate * 100).toLocaleString('fa-IR')}%
                    </span>
                  </div>

                  {/* Installments */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-fg-secondary flex items-center gap-1">
                      <Clock size={10} className="text-fg-faint" />
                      اقساط
                    </span>
                    <span className="text-[10px] font-bold font-fa text-fg-primary">
                      {pkg.installmentCount.toLocaleString('fa-IR')} قسط &times;{' '}
                      {pkg.installmentAmount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  {/* Interval */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-fg-secondary">فاصله اقساط</span>
                    <span className="text-[10px] font-bold font-fa text-fg-primary">
                      هر {intervalMinutes.toLocaleString('fa-IR')} دقیقه
                    </span>
                  </div>

                  {/* Late penalty */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-fg-secondary flex items-center gap-1">
                      <AlertTriangle size={10} className="text-orange-400" />
                      جریمه دیرکرد
                    </span>
                    <span className="text-[10px] font-bold font-fa text-orange-400">
                      {(pkg.latePenaltyRate * 100).toLocaleString('fa-IR')}%
                    </span>
                  </div>

                  {/* Requirements */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-fg-secondary">شرایط</span>
                    <span className="text-[10px] font-fa text-fg-secondary">
                      سطح {pkg.requiredLevel.toLocaleString('fa-IR')}
                      {pkg.requiredAssets > 0 && (
                        <> | دارایی {pkg.requiredAssets.toLocaleString('fa-IR')}</>
                      )}
                    </span>
                  </div>
                </div>

                {/* Eligibility / Action */}
                <div className="mt-3">
                  {check.eligible ? (
                    <button
                      onClick={() => handleTakeLoan(pkg)}
                      className="w-full py-2 rounded-[999px] text-[11px] font-bold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: color }}
                    >
                      <Check size={14} />
                      دریافت
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-[999px] text-[10px] font-bold text-fg-faint bg-surface-card/30 text-center flex items-center justify-center gap-1.5">
                      <AlertTriangle size={12} />
                      {check.reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
