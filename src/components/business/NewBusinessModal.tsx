'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X } from 'lucide-react';
import { BusinessTemplate } from '@/types';

export default function NewBusinessModal({ onClose }: { onClose: () => void }) {
  const templates = useGameStore((s) => s.businessTemplates);
  const createBusiness = useGameStore((s) => s.createBusiness);
  const balance = useGameStore((s) => s.player.balance);
  const businesses = useGameStore((s) => s.businesses);

  const [selected, setSelected] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const selectedTemplate = templates.find((t) => t.type === selected);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m} دقیقه و ${s} ثانیه`;
    if (m > 0) return `${m} دقیقه`;
    return `${s} ثانیه`;
  };

  // سود در دقیقه
  const profitPerMinute = (t: BusinessTemplate) => {
    const netProfit = t.baseRevenue - t.baseExpenses;
    return Math.round((netProfit / t.cycleDuration) * 60);
  };

  // پیشنهاد هوشمند: بهترین سود/دقیقه که قابل خرید باشد
  const bestAffordable = templates
    .filter((t) => balance >= t.startCost && !businesses.some((b) => b.type === t.type))
    .sort((a, b) => profitPerMinute(b) - profitPerMinute(a))[0];

  const handleCreate = useCallback(() => {
    if (!selectedTemplate) return;
    setCreating(true);
    setTimeout(() => {
      createBusiness(selectedTemplate, customName.trim());
      setCreating(false);
      setCreated(true);
      setTimeout(() => onClose(), 1500);
    }, 800);
  }, [selectedTemplate, customName, createBusiness, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-end justify-center">
      <div className="bg-surface-elevated w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[85vh] overflow-y-auto">
        {/* هدر */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">🚀 راه‌اندازی کسب‌وکار</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface-card rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* حالت موفقیت */}
        {created && (
          <div className="text-center py-12 animate-collect">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-lg font-black text-emerald-400">شرکت شما ایجاد شد!</p>
            <p className="text-xs text-fg-secondary mt-2">
              {customName.trim() || selectedTemplate?.defaultName}
            </p>
          </div>
        )}

        {/* حالت ساخت */}
        {creating && !created && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3 animate-pulse">🏗️</p>
            <p className="text-sm text-fg-secondary font-bold">در حال ساخت شرکت...</p>
          </div>
        )}

        {/* فرم اصلی */}
        {!creating && !created && (
          <>
            {/* بخش ۱: انتخاب نوع */}
            <p className="text-xs font-bold text-fg-secondary mb-2">انتخاب نوع کسب‌وکار</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {templates.map((t) => {
                const canAfford = balance >= t.startCost;
                const alreadyOwned = businesses.some((b) => b.type === t.type);
                const isSelected = selected === t.type;
                const netProfit = t.baseRevenue - t.baseExpenses;
                const isBest = bestAffordable?.type === t.type;

                return (
                  <button
                    key={t.type}
                    onClick={() => {
                      if (canAfford && !alreadyOwned) {
                        setSelected(t.type);
                        setCustomName('');
                      }
                    }}
                    disabled={!canAfford || alreadyOwned}
                    className={`relative text-right p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30'
                        : 'border-line-subtle bg-surface-card/40'
                    } ${!canAfford || alreadyOwned ? 'opacity-40' : 'hover:border-line-hover active:scale-[0.98]'}`}
                  >
                    {/* بج پیشنهاد */}
                    {isBest && canAfford && !alreadyOwned && (
                      <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-bold">
                        ⭐ پیشنهاد
                      </span>
                    )}

                    <span className="text-2xl block mb-1">{t.icon}</span>
                    <p className="text-xs font-bold text-fg truncate">{t.defaultName}</p>
                    <div className="mt-1.5 space-y-0.5 text-[9px]">
                      <p className="text-fg-muted">
                        سود: <span className="text-accent-positive font-fa font-bold">{netProfit.toLocaleString('fa-IR')}</span>/سیکل
                      </p>
                      <p className="text-fg-muted">
                        سیکل: <span className="text-fg font-fa">{formatDuration(t.cycleDuration)}</span>
                      </p>
                      <p className="text-fg-muted">
                        سرمایه: <span className="text-accent-money font-fa font-bold">{t.startCost.toLocaleString('fa-IR')}</span>
                      </p>
                    </div>
                    {alreadyOwned && (
                      <p className="text-[8px] text-fg-muted mt-1">✅ دارید</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* بخش ۲: جدول مقایسه */}
            {!selected && (
              <div className="mb-4">
                <p className="text-xs font-bold text-fg-secondary mb-2">📊 مقایسه سود/دقیقه</p>
                <div className="bg-surface-card/40 rounded-xl overflow-hidden">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="text-fg-muted border-b border-line-subtle">
                        <th className="text-right py-1.5 px-2 font-medium">کسب‌وکار</th>
                        <th className="text-right py-1.5 px-2 font-medium">سرمایه</th>
                        <th className="text-right py-1.5 px-2 font-medium">سود/دقیقه</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...templates]
                        .sort((a, b) => profitPerMinute(b) - profitPerMinute(a))
                        .map((t) => (
                        <tr key={t.type} className="border-b border-line-subtle last:border-0">
                          <td className="py-1.5 px-2 text-fg">{t.icon} {t.defaultName}</td>
                          <td className="py-1.5 px-2 text-accent-money font-fa">{t.startCost.toLocaleString('fa-IR')}</td>
                          <td className="py-1.5 px-2 text-accent-positive font-fa font-bold">{profitPerMinute(t).toLocaleString('fa-IR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* بخش ۳: اطلاعات کسب‌وکار انتخابی */}
            {selectedTemplate && (
              <div className="space-y-3 mb-4">
                {/* اطلاعات کلی */}
                <Card className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedTemplate.icon}</span>
                    <p className="text-sm font-bold">{selectedTemplate.defaultName}</p>
                  </div>
                  <p className="text-[10px] text-fg-muted">{selectedTemplate.description}</p>

                  {/* پیش‌بینی عملکرد */}
                  <div className="bg-surface-card/60 rounded-lg p-2.5 space-y-1.5">
                    <p className="text-[10px] font-bold text-fg-secondary">📈 پیش‌بینی عملکرد</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <p className="text-fg-muted">درآمد/سیکل</p>
                        <p className="text-accent-positive font-fa font-bold">{selectedTemplate.baseRevenue.toLocaleString('fa-IR')}</p>
                      </div>
                      <div>
                        <p className="text-fg-muted">هزینه/سیکل</p>
                        <p className="text-accent-negative font-fa font-bold">{selectedTemplate.baseExpenses.toLocaleString('fa-IR')}</p>
                      </div>
                      <div>
                        <p className="text-fg-muted">سود خالص</p>
                        <p className="text-accent-positive font-fa font-bold">
                          {(selectedTemplate.baseRevenue - selectedTemplate.baseExpenses).toLocaleString('fa-IR')}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-line-subtle pt-1.5 mt-1">
                      <p className="text-[10px] text-fg-muted">
                        💰 درآمد تقریبی در ساعت:{' '}
                        <span className="text-accent-money font-fa font-bold">
                          {(profitPerMinute(selectedTemplate) * 60).toLocaleString('fa-IR')}
                        </span>
                        {' '}تومان
                      </p>
                    </div>
                  </div>

                  {/* تجهیزات اولیه */}
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-fg-muted">🔧 تجهیزات اولیه:</span>
                    <span className="text-fg">{selectedTemplate.initialEquipment}</span>
                  </div>

                  {/* ریسک و رشد */}
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-fg-muted">
                      ⚡ ریسک:{' '}
                      <span className={selectedTemplate.startCost <= 50_000 ? 'text-emerald-400' : selectedTemplate.startCost <= 100_000 ? 'text-amber-400' : 'text-red-400'}>
                        {selectedTemplate.startCost <= 50_000 ? 'کم' : selectedTemplate.startCost <= 100_000 ? 'متوسط' : 'زیاد'}
                      </span>
                    </span>
                    <span className="text-fg-muted">
                      📊 رشد:{' '}
                      <span className={profitPerMinute(selectedTemplate) >= 2000 ? 'text-emerald-400' : profitPerMinute(selectedTemplate) >= 1000 ? 'text-amber-400' : 'text-fg-secondary'}>
                        {profitPerMinute(selectedTemplate) >= 2000 ? 'بالا' : profitPerMinute(selectedTemplate) >= 1000 ? 'متوسط' : 'آهسته'}
                      </span>
                    </span>
                  </div>
                </Card>

                {/* نام شرکت */}
                <div>
                  <label className="text-xs font-bold text-fg-secondary mb-1.5 block">✏️ نام شرکت</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={selectedTemplate.defaultName}
                    className="w-full bg-surface-card border border-line rounded-xl px-4 py-2.5 text-sm text-fg placeholder-fg-faint focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* دکمه ساخت */}
            <Button
              onClick={handleCreate}
              disabled={!selected || balance < (selectedTemplate?.startCost ?? Infinity)}
              fullWidth
              size="lg"
              variant={selected ? 'success' : 'primary'}
            >
              {!selected ? (
                'یک کسب‌وکار انتخاب کنید'
              ) : balance < (selectedTemplate?.startCost ?? 0) ? (
                <span className="flex items-center justify-center gap-1.5">
                  موجودی کافی نیست
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  🚀 راه‌اندازی کسب‌وکار — <span className="font-fa">{selectedTemplate?.startCost.toLocaleString('fa-IR')}</span> تومان
                </span>
              )}
            </Button>

            {/* موجودی فعلی */}
            <p className="text-center text-[10px] text-fg-muted mt-2">
              💳 موجودی شما: <span className="text-accent-money font-fa font-bold">{balance.toLocaleString('fa-IR')}</span> تومان
            </p>
          </>
        )}
      </div>
    </div>
  );
}
