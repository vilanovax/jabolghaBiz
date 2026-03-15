'use client';

import { useGameStore } from '@/store/gameStore';
import BankCard from './BankCard';
import { useState } from 'react';
import LoanModal from './LoanModal';
import DepositModal from './DepositModal';
import MoneyDisplay from '@/components/ui/MoneyDisplay';

export default function BankingTab() {
  const banking = useGameStore((s) => s.banking);
  const bankTemplates = useGameStore((s) => s.bankTemplates);
  const player = useGameStore((s) => s.player);
  const withdraw = useGameStore((s) => s.withdraw);

  const [loanBankId, setLoanBankId] = useState<string | null>(null);
  const [depositBankId, setDepositBankId] = useState<string | null>(null);

  const totalLoans = banking.loans.length;
  const totalDeposits = banking.deposits.length;
  const netInterest = banking.totalInterestEarned - banking.totalInterestPaid;

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="bg-surface-card/50 rounded-[10px] px-2.5 py-1.5 text-[10px] flex items-center gap-1">
          <span className="text-fg-muted">{'\u0648\u0627\u0645\u200C\u0647\u0627:'}</span>
          <span className="font-fa font-bold">{totalLoans}</span>
        </div>
        <div className="bg-surface-card/50 rounded-[10px] px-2.5 py-1.5 text-[10px] flex items-center gap-1">
          <span className="text-fg-muted">{'\u0633\u067E\u0631\u062F\u0647\u200C\u0647\u0627:'}</span>
          <span className="font-fa font-bold">{totalDeposits}</span>
        </div>
        <div className="bg-surface-card/50 rounded-[10px] px-2.5 py-1.5 text-[10px] flex items-center gap-1">
          <span className="text-fg-muted">{'\u0633\u0648\u062F \u062E\u0627\u0644\u0635:'}</span>
          <MoneyDisplay amount={netInterest} size="sm" showSign />
        </div>
      </div>

      {/* Bank cards */}
      {bankTemplates.map((bank) => {
        const activeLoan = banking.loans.find((l) => l.bankId === bank.id);
        const activeDeposit = banking.deposits.find((d) => d.bankId === bank.id);

        return (
          <BankCard
            key={bank.id}
            bank={bank}
            activeLoan={activeLoan}
            activeDeposit={activeDeposit}
            playerLevel={player.level}
            onTakeLoan={() => setLoanBankId(bank.id)}
            onDeposit={() => setDepositBankId(bank.id)}
            onWithdraw={() => withdraw(bank.id)}
          />
        );
      })}

      {/* Modals */}
      {loanBankId && (
        <LoanModal
          bankId={loanBankId}
          onClose={() => setLoanBankId(null)}
        />
      )}
      {depositBankId && (
        <DepositModal
          bankId={depositBankId}
          onClose={() => setDepositBankId(null)}
        />
      )}
    </div>
  );
}
