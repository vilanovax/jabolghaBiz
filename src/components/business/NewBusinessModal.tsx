'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X, ChevronRight, ChevronLeft, TrendingUp, Clock, Wallet } from 'lucide-react';
import { BusinessTemplate } from '@/types';

const STEP_LABELS = [
  { key: 'type' as const, label: 'نوع', icon: '🏢' },
  { key: 'details' as const, label: 'تایید', icon: '✅' },
];

export default function NewBusinessModal({ onClose }: { onClose: () => void }) {
  const templates = useGameStore((s) => s.businessTemplates);
  const createBusiness = useGameStore((s) => s.createBusiness);
  const balance = useGameStore((s) => s.player.balance);
  const businesses = useGameStore((s) => s.businesses);
  const cities = useGameStore((s) => s.cities);

  const [step, setStep] = useState<'type' | 'details'>('type');
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const selectedTemplate = templates.find((t) => t.type === selected);
  const selectedCityData = cities.find((c) => c.id === selectedCity);
  const stepIndex = STEP_LABELS.findIndex((s) => s.key === step);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m}:${s.toString().padStart(2, '0')}`;
    if (m > 0) return `${m} دقیقه`;
    return `${s} ثانیه`;
  };

  const profitPerMinute = (t: BusinessTemplate) => {
    const netProfit = t.baseProductionRate - t.baseExpenses;
    return Math.round((netProfit / t.cycleDuration) * 60);
  };

  const bestAffordable = templates
    .filter((t) => balance >= t.startCost && !businesses.some((b) => b.type === t.type))
    .sort((a, b) => profitPerMinute(b) - profitPerMinute(a))[0];

  const handleCreate = useCallback(() => {
    if (!selectedTemplate) return;
    setCreating(true);
    setTimeout(() => {
      createBusiness(selectedTemplate, customName.trim(), undefined);
      setCreating(false);
      setCreated(true);
      setTimeout(() => onClose(), 1500);
    }, 800);
  }, [selectedTemplate, customName, createBusiness, onClose]);

  const goToDetails = () => { if (selected) setStep('details'); };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-end justify-center">
      <div className="bg-surface-elevated w-full max-w-lg rounded-t-3xl max-h-[90vh] flex flex-col">

        {/* ═══════ هدر ثابت ═══════ */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          <div className="w-10 h-1 bg-fg-faint/30 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step !== 'type' && !creating && !created && (
                <button
                  onClick={() => setStep('type')}
                  className="p-1.5 hover:bg-surface-card rounded-lg transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              )}
              <h2 className="text-base font-black">راه‌اندازی کسب‌وکار</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-surface-card rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* نوار مراحل */}
          {!creating && !created && (
            <div className="flex items-center gap-0">
              {STEP_LABELS.map((s, i) => {
                const isActive = stepIndex === i;
                const isDone = stepIndex > i;
                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1 gap-1">
                      <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-indigo-500' : isDone ? 'bg-indigo-500/50' : 'bg-surface-card'
                      }`} />
                      <span className={`text-[9px] font-bold transition-colors ${
                        isActive ? 'text-indigo-400' : isDone ? 'text-fg-muted' : 'text-fg-faint'
                      }`}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════ محتوای اسکرول‌شونده ═══════ */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* حالت موفقیت */}
          {created && (
            <div className="text-center py-16 animate-collect">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <p className="text-lg font-black text-emerald-400">شرکت شما ایجاد شد!</p>
              <p className="text-xs text-fg-secondary mt-2">
                {customName.trim() || selectedTemplate?.defaultName}
              </p>
              {selectedCityData && (
                <p className="text-[10px] text-fg-muted mt-1">
                  {selectedCityData.icon} {selectedCityData.name}
                </p>
              )}
            </div>
          )}

          {/* حالت ساخت */}
          {creating && !created && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">🏗️</span>
              </div>
              <p className="text-sm text-fg-secondary font-bold">در حال ساخت شرکت...</p>
            </div>
          )}

          {/* ══════════════ مرحله ۱: انتخاب نوع ══════════════ */}
          {!creating && !created && step === 'type' && (
            <div className="space-y-2">
              {templates.map((t) => {
                const canAfford = balance >= t.startCost;
                const alreadyOwned = businesses.some((b) => b.type === t.type);
                const isSelected = selected === t.type;
                const netProfit = t.baseProductionRate - t.baseExpenses;
                const isBest = bestAffordable?.type === t.type;
                const ppm = profitPerMinute(t);

                return (
                  <button
                    key={t.type}
                    onClick={() => {
                      if (canAfford && !alreadyOwned) {
                        setSelected(t.type);
                        setCustomName('');
                        setSelectedCity(null);
                      }
                    }}
                    disabled={!canAfford || alreadyOwned}
                    className={`relative w-full text-right p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                        : 'border-transparent bg-surface-card/50'
                    } ${!canAfford || alreadyOwned ? 'opacity-35 grayscale' : 'hover:bg-surface-card/80 active:scale-[0.98]'}`}
                  >
                    <div className="absolute top-2.5 left-2.5 flex gap-1">
                      {isBest && canAfford && !alreadyOwned && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                          ⭐ پیشنهاد
                        </span>
                      )}
                      {alreadyOwned && (
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          ✅ دارید
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-indigo-500/15' : 'bg-surface-inset/30'
                      }`}>
                        <span className="text-2xl">{t.icon}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-fg truncate">{t.defaultName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-0.5 text-[10px] text-accent-positive">
                            <TrendingUp size={10} />
                            <span className="font-fa font-bold">{netProfit.toLocaleString('fa-IR')}</span>/سیکل
                          </span>
                          <span className="flex items-center gap-0.5 text-[10px] text-fg-muted">
                            <Clock size={10} />
                            <span className="font-fa">{formatDuration(t.cycleDuration)}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-left flex-shrink-0">
                        <p className="text-[10px] text-fg-muted">سرمایه</p>
                        <p className={`text-xs font-black font-fa ${canAfford ? 'text-accent-money' : 'text-red-400'}`}>
                          {t.startCost.toLocaleString('fa-IR')}
                        </p>
                        <p className="text-[9px] text-fg-faint font-fa">{ppm.toLocaleString('fa-IR')}/دقیقه</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ══════════════ مرحله ۲: جزئیات و تایید ══════════════ */}
          {!creating && !created && step === 'details' && selectedTemplate && (
            <div className="space-y-3">
              {/* خلاصه */}
              <Card className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{selectedTemplate.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black">{selectedTemplate.defaultName}</p>
                    <p className="text-[10px] text-fg-muted mt-0.5">{selectedTemplate.description}</p>
                  </div>
                </div>

                {/* پیش‌بینی عملکرد */}
                <div className="bg-surface-card/60 rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-bold text-fg-secondary">📈 پیش‌بینی عملکرد</p>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">درآمد/سیکل</p>
                      <p className="text-accent-positive font-fa font-black text-sm mt-0.5">
                        {selectedTemplate.baseProductionRate.toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">هزینه/سیکل</p>
                      <p className="text-accent-negative font-fa font-black text-sm mt-0.5">
                        {selectedTemplate.baseExpenses.toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">مدت سیکل</p>
                      <p className="text-fg font-fa font-black text-sm mt-0.5">
                        {formatDuration(selectedTemplate.cycleDuration)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-line-subtle pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-fg-muted">💰 سود تقریبی در ساعت</span>
                      <span className="text-accent-money font-fa font-black text-sm">
                        {(profitPerMinute(selectedTemplate) * 60).toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* انتخاب شهر (اختیاری) */}
              <div>
                <label className="text-[11px] font-bold text-fg-secondary mb-1.5 block">📍 شهر (اختیاری)</label>
                <div className="flex gap-2 flex-wrap">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(selectedCity === city.id ? null : city.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all text-[11px] font-bold ${
                        selectedCity === city.id
                          ? 'border-indigo-500 bg-indigo-950/20 text-fg'
                          : 'border-transparent bg-surface-card/50 text-fg-muted hover:bg-surface-card/80'
                      }`}
                    >
                      <span>{city.icon}</span>
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* نام شرکت */}
              <div>
                <label className="text-[11px] font-bold text-fg-secondary mb-1.5 block">✏️ نام شرکت</label>
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
        </div>

        {/* ═══════ فوتر ثابت ═══════ */}
        {!creating && !created && (
          <div className="flex-shrink-0 px-5 pt-3 pb-8 border-t border-line-subtle/50 bg-surface-elevated">
            {step === 'type' && (
              <Button onClick={goToDetails} disabled={!selected} fullWidth size="lg">
                {selected ? (
                  <span className="flex items-center justify-center gap-1.5">
                    ادامه <ChevronLeft size={16} />
                  </span>
                ) : 'یک کسب‌وکار انتخاب کنید'}
              </Button>
            )}

            {step === 'details' && selectedTemplate && (
              <Button
                onClick={handleCreate}
                disabled={balance < selectedTemplate.startCost}
                fullWidth
                size="lg"
                variant="success"
              >
                {balance < selectedTemplate.startCost ? (
                  'موجودی کافی نیست'
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    🚀 راه‌اندازی — <span className="font-fa">{selectedTemplate.startCost.toLocaleString('fa-IR')}</span> تومان
                  </span>
                )}
              </Button>
            )}

            <p className="text-center text-[10px] text-fg-muted mt-2">
              💳 <span className="text-accent-money font-fa font-bold">{balance.toLocaleString('fa-IR')}</span> تومان
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
