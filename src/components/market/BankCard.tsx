'use client';

import type { BankTemplate, ActiveLoan, ActiveDeposit, BankPersonality } from '@/types';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { Lock, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';

interface Props {
  bank: BankTemplate;
  activeLoan?: ActiveLoan;
  activeDeposit?: ActiveDeposit;
  playerLevel: number;
  onTakeLoan: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

const personalityColor: Record<BankPersonality, string> = {
  conservative: '#22C55E',
  moderate: '#3B82F6',
  risky: '#F97316',
};

const personalityLabel: Record<BankPersonality, string> = {
  conservative: '\u0645\u062D\u0627\u0641\u0638\u0647\u200C\u06A9\u0627\u0631',
  moderate: '\u0645\u062A\u0639\u0627\u062F\u0644',
  risky: '\u067E\u0631\u0631\u06CC\u0633\u06A9',
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return '\u0633\u0631\u0631\u0633\u06CC\u062F';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}\u0633 ${m}\u062F`;
  if (m > 0) return `${m}\u062F ${s}\u062B`;
  return `${s}\u062B`;
}

export default function BankCard({
  bank,
  activeLoan,
  activeDeposit,
  playerLevel,
  onTakeLoan,
  onDeposit,
  onWithdraw,
}: Props) {
  const locked = playerLevel < bank.unlockLevel;
  const color = personalityColor[bank.personality];

  return (
    <div className="relative rounded-[16px] border border-line-subtle bg-surface-card/50 p-3 space-y-2">
      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[16px] bg-black/60">
          <Lock size={20} className="text-fg-faint mb-1" />
          <p className="text-[10px] text-fg-faint font-fa">
            {'\u0633\u0637\u062D'} {bank.unlockLevel} {'\u0644\u0627\u0632\u0645\u0647'}
          </p>
        </div>
      )}

      <div className={locked ? 'opacity-50' : undefined}>
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{bank.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate">{bank.name}</p>
          </div>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-[999px]"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {personalityLabel[bank.personality]}
          </span>
        </div>

        {/* Description */}
        <p className="text-[9px] text-fg-muted">{bank.description}</p>

        {/* Active Loan Section */}
        {activeLoan && (
          <div className="space-y-1.5 bg-surface-inset/30 rounded-[10px] px-2.5 py-2">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-fg-muted">
                <Wallet size={10} />
                <span>{'\u0648\u0627\u0645 \u0641\u0639\u0627\u0644'}</span>
              </div>
              <MoneyDisplay amount={activeLoan.originalAmount} size="sm" />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(activeLoan.paidInstallments / activeLoan.installmentCount) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-fg-muted font-fa">
              <span>
                {activeLoan.paidInstallments}/{activeLoan.installmentCount} {'\u0642\u0633\u0637'}
              </span>
              <span>
                {'\u0628\u0639\u062F\u06CC:'} {formatCountdown(activeLoan.nextInstallmentAt - Date.now())}
              </span>
            </div>

            {/* Penalty */}
            {activeLoan.accruedPenalty > 0 && (
              <div className="flex items-center gap-1 text-[9px] text-[#EF4444]">
                <AlertTriangle size={10} />
                <span>{'\u062C\u0631\u06CC\u0645\u0647 \u062F\u06CC\u0631\u06A9\u0631\u062F:'}</span>
                <MoneyDisplay amount={activeLoan.accruedPenalty} size="sm" />
              </div>
            )}
          </div>
        )}

        {/* Active Deposit Section */}
        {activeDeposit && (
          <div className="space-y-1.5 bg-surface-inset/30 rounded-[10px] px-2.5 py-2">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1 text-fg-muted">
                <TrendingUp size={10} />
                <span>{'\u0633\u067E\u0631\u062F\u0647 \u0641\u0639\u0627\u0644'}</span>
              </div>
              <MoneyDisplay amount={activeDeposit.amount} size="sm" />
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-fg-muted">{'\u0633\u0648\u062F \u062A\u0639\u0644\u0642\u200C\u06CC\u0627\u0641\u062A\u0647'}</span>
              <span className="text-[#22C55E] font-fa font-bold">
                +{new Intl.NumberFormat('fa-IR').format(Math.round(activeDeposit.accruedInterest))}
              </span>
            </div>
            <button
              onClick={onWithdraw}
              className="text-[10px] px-3 py-1 rounded-[999px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ backgroundColor: color }}
            >
              {'\u0628\u0631\u062F\u0627\u0634\u062A'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {!locked && (
          <div className="flex gap-2">
            {!activeLoan && (
              <button
                onClick={onTakeLoan}
                className="flex-1 py-2 rounded-[999px] text-[11px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ backgroundColor: color }}
              >
                {'\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645'}
              </button>
            )}
            {!activeDeposit && (
              <button
                onClick={onDeposit}
                className="flex-1 py-2 rounded-[999px] text-[11px] font-bold text-white active:scale-[0.97] transition-all"
                style={{ backgroundColor: color }}
              >
                {'\u0633\u067E\u0631\u062F\u0647\u200C\u06AF\u0630\u0627\u0631\u06CC'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
