'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MoneyDisplay from '@/components/ui/MoneyDisplay';
import { X } from 'lucide-react';

export default function NewBusinessModal({ onClose }: { onClose: () => void }) {
  const templates = useGameStore((s) => s.businessTemplates);
  const createBusiness = useGameStore((s) => s.createBusiness);
  const balance = useGameStore((s) => s.player.balance);
  const [selected, setSelected] = useState<string | null>(null);

  const handleCreate = () => {
    const template = templates.find((t) => t.type === selected);
    if (template) {
      createBusiness(template);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-end justify-center">
      <div className="bg-zinc-900 w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">کسب‌وکار جدید</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-5">
          {templates.map((t) => {
            const canAfford = balance >= t.startCost;
            return (
              <Card
                key={t.type}
                onClick={() => canAfford && setSelected(t.type)}
                className={`${selected === t.type ? 'border-indigo-500 bg-indigo-950/30' : ''} ${!canAfford ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm">{t.name}</h3>
                      <MoneyDisplay amount={t.startCost} size="sm" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{t.description}</p>
                    <div className="flex gap-4 mt-2 text-[10px] text-zinc-500">
                      <span>درآمد: {t.baseRevenue.toLocaleString('fa-IR')}/روز</span>
                      <span>هزینه: {t.baseExpenses.toLocaleString('fa-IR')}/روز</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button onClick={handleCreate} disabled={!selected} fullWidth size="lg">
          ساخت کسب‌وکار
        </Button>
      </div>
    </div>
  );
}
