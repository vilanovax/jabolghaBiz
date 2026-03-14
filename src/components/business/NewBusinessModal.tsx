'use client';

import { useState, useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { X, ChevronRight, ChevronLeft, MapPin, TrendingUp, Clock, Wallet } from 'lucide-react';
import { BusinessTemplate, Neighborhood } from '@/types';

const STEP_LABELS = [
  { key: 'type' as const, label: 'نوع', icon: '🏢' },
  { key: 'location' as const, label: 'محله', icon: '📍' },
  { key: 'details' as const, label: 'تایید', icon: '✅' },
];

export default function NewBusinessModal({ onClose }: { onClose: () => void }) {
  const templates = useGameStore((s) => s.businessTemplates);
  const createBusiness = useGameStore((s) => s.createBusiness);
  const balance = useGameStore((s) => s.player.balance);
  const playerLevel = useGameStore((s) => s.player.level);
  const businesses = useGameStore((s) => s.businesses);
  const cities = useGameStore((s) => s.cities);

  const [step, setStep] = useState<'type' | 'location' | 'details'>('type');
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const selectedTemplate = templates.find((t) => t.type === selected);
  const activeCity = cities.find((c) => c.id === selectedCity);
  const activeNeighborhood = useMemo(() => {
    if (!activeCity || !selectedNeighborhood) return undefined;
    return activeCity.neighborhoods.find((n) => n.id === selectedNeighborhood);
  }, [activeCity, selectedNeighborhood]);

  const stepIndex = STEP_LABELS.findIndex((s) => s.key === step);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m}:${s.toString().padStart(2, '0')}`;
    if (m > 0) return `${m} دقیقه`;
    return `${s} ثانیه`;
  };

  const profitPerMinute = (t: BusinessTemplate, nb?: Neighborhood) => {
    const revMult = nb ? nb.revenueMultiplier * (nb.bestFor.includes(t.type) ? 1.1 : 1.0) : 1.0;
    const expMult = nb ? nb.expenseMultiplier : 1.0;
    const trafficMult = nb ? nb.customerTraffic : 1.0;
    const effectiveRevenue = Math.round(t.baseRevenue * revMult);
    const effectiveExpense = Math.round(t.baseExpenses * expMult);
    const netProfit = effectiveRevenue - effectiveExpense;
    const effectiveCycle = Math.max(10, Math.round(t.cycleDuration / trafficMult));
    return Math.round((netProfit / effectiveCycle) * 60);
  };

  const bestAffordable = templates
    .filter((t) => balance >= t.startCost && !businesses.some((b) => b.type === t.type))
    .sort((a, b) => profitPerMinute(b) - profitPerMinute(a))[0];

  const handleCreate = useCallback(() => {
    if (!selectedTemplate) return;
    setCreating(true);
    setTimeout(() => {
      createBusiness(selectedTemplate, customName.trim(), selectedNeighborhood || undefined);
      setCreating(false);
      setCreated(true);
      setTimeout(() => onClose(), 1500);
    }, 800);
  }, [selectedTemplate, customName, selectedNeighborhood, createBusiness, onClose]);

  const goToLocation = () => { if (selected) setStep('location'); };
  const goToDetails = () => { if (selectedNeighborhood) setStep('details'); };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-end justify-center">
      <div className="bg-surface-elevated w-full max-w-lg rounded-t-3xl max-h-[90vh] flex flex-col">

        {/* ═══════ هدر ثابت ═══════ */}
        <div className="flex-shrink-0 px-5 pt-5 pb-3">
          {/* دستگیره */}
          <div className="w-10 h-1 bg-fg-faint/30 rounded-full mx-auto mb-4" />

          {/* عنوان + بستن */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step !== 'type' && !creating && !created && (
                <button
                  onClick={() => setStep(step === 'details' ? 'location' : 'type')}
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

          {/* ═══════ نوار مراحل ═══════ */}
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
              {activeNeighborhood && activeCity && (
                <p className="text-[10px] text-fg-muted mt-1">
                  {activeCity.icon} {activeCity.name} — {activeNeighborhood.icon} {activeNeighborhood.name}
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
                const netProfit = t.baseRevenue - t.baseExpenses;
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
                        setSelectedNeighborhood(null);
                      }
                    }}
                    disabled={!canAfford || alreadyOwned}
                    className={`relative w-full text-right p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                        : 'border-transparent bg-surface-card/50'
                    } ${!canAfford || alreadyOwned ? 'opacity-35 grayscale' : 'hover:bg-surface-card/80 active:scale-[0.98]'}`}
                  >
                    {/* بج‌ها */}
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
                      {/* آیکون بزرگ */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-indigo-500/15' : 'bg-surface-inset/30'
                      }`}>
                        <span className="text-2xl">{t.icon}</span>
                      </div>

                      {/* اطلاعات */}
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

                      {/* قیمت */}
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

          {/* ══════════════ مرحله ۲: انتخاب شهر و محله ══════════════ */}
          {!creating && !created && step === 'location' && selectedTemplate && (
            <>
              {/* خلاصه انتخاب */}
              <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-surface-card/40">
                <span className="text-lg">{selectedTemplate.icon}</span>
                <p className="text-xs font-bold text-fg">{selectedTemplate.defaultName}</p>
                <span className="text-[9px] text-fg-muted mr-auto">سود پایه: <span className="font-fa text-accent-positive">{profitPerMinute(selectedTemplate).toLocaleString('fa-IR')}</span>/دقیقه</span>
              </div>

              {/* انتخاب شهر */}
              <p className="text-[11px] font-bold text-fg-secondary mb-2">شهر</p>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
                {cities.map((city) => {
                  const isActive = selectedCity === city.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.id);
                        setSelectedNeighborhood(null);
                      }}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl border-2 transition-all text-center min-w-[80px] ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-950/20'
                          : 'border-transparent bg-surface-card/50 hover:bg-surface-card/80'
                      }`}
                    >
                      <span className="text-xl block">{city.icon}</span>
                      <p className="text-[11px] font-bold text-fg mt-1">{city.name}</p>
                    </button>
                  );
                })}
              </div>

              {/* محله‌ها */}
              {activeCity && (
                <>
                  <p className="text-[11px] font-bold text-fg-secondary mb-2">محله‌های {activeCity.name}</p>
                  <div className="space-y-2 mb-2">
                    {activeCity.neighborhoods.map((nb) => {
                      const isLocked = nb.unlockLevel > playerLevel;
                      const isSelected = selectedNeighborhood === nb.id;
                      const isBestFor = nb.bestFor.includes(selectedTemplate.type);
                      const ppm = profitPerMinute(selectedTemplate, nb);
                      const basePpm = profitPerMinute(selectedTemplate);
                      const ppmDiff = ppm - basePpm;

                      return (
                        <button
                          key={nb.id}
                          onClick={() => !isLocked && setSelectedNeighborhood(nb.id)}
                          disabled={isLocked}
                          className={`w-full text-right p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                              : 'border-transparent bg-surface-card/50'
                          } ${isLocked ? 'opacity-35 grayscale' : 'hover:bg-surface-card/80 active:scale-[0.99]'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-indigo-500/15' : 'bg-surface-inset/30'
                            }`}>
                              <span className="text-lg">{nb.icon}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-fg">{nb.name}</p>
                                {isBestFor && (
                                  <span className="text-[7px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                                    مناسب {selectedTemplate.icon}
                                  </span>
                                )}
                                {isLocked && (
                                  <span className="text-[7px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded-full font-bold">
                                    🔒 سطح {nb.unlockLevel.toLocaleString('fa-IR')}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-fg-muted mt-0.5 line-clamp-1">{nb.description}</p>
                            </div>

                            {/* تفاوت سود */}
                            <div className="text-left flex-shrink-0">
                              <p className={`text-[11px] font-fa font-black ${ppmDiff >= 0 ? 'text-accent-positive' : 'text-accent-negative'}`}>
                                {ppmDiff >= 0 ? '+' : ''}{ppmDiff.toLocaleString('fa-IR')}
                              </p>
                              <p className="text-[8px] text-fg-faint">/دقیقه</p>
                            </div>
                          </div>

                          {/* نوارهای ضریب */}
                          <div className="flex gap-2.5 mt-2.5 mr-[52px] text-[8px]">
                            {[
                              { label: 'درآمد', val: nb.revenueMultiplier, goodHigh: true },
                              { label: 'هزینه', val: nb.expenseMultiplier, goodHigh: false },
                              { label: 'تردد', val: nb.customerTraffic, goodHigh: true },
                              { label: 'اجاره', val: nb.rentMultiplier, goodHigh: false },
                            ].map((stat) => {
                              const pct = Math.round((stat.val - 1) * 100);
                              const isGood = stat.goodHigh ? pct > 0 : pct < 0;
                              const isBad = stat.goodHigh ? pct < 0 : pct > 0;
                              return (
                                <span key={stat.label} className="flex items-center gap-0.5">
                                  <span className="text-fg-faint">{stat.label}</span>
                                  <span className={`font-fa font-bold ${isGood ? 'text-emerald-400' : isBad ? 'text-red-400' : 'text-fg-muted'}`}>
                                    {pct > 0 ? '+' : ''}{pct}%
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ══════════════ مرحله ۳: جزئیات و تایید ══════════════ */}
          {!creating && !created && step === 'details' && selectedTemplate && (
            <div className="space-y-3">
              {/* خلاصه انتخاب‌ها */}
              <Card className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{selectedTemplate.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black">{selectedTemplate.defaultName}</p>
                    {activeNeighborhood && activeCity && (
                      <p className="text-[10px] text-fg-muted flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />
                        {activeCity.icon} {activeCity.name} — {activeNeighborhood.icon} {activeNeighborhood.name}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-fg-muted">{selectedTemplate.description}</p>

                {/* پیش‌بینی عملکرد با ضریب محله */}
                <div className="bg-surface-card/60 rounded-xl p-3 space-y-2">
                  <p className="text-[10px] font-bold text-fg-secondary">📈 پیش‌بینی عملکرد (با ضریب محله)</p>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">درآمد/سیکل</p>
                      <p className="text-accent-positive font-fa font-black text-sm mt-0.5">
                        {Math.round(selectedTemplate.baseRevenue * (activeNeighborhood?.revenueMultiplier ?? 1) * (activeNeighborhood?.bestFor.includes(selectedTemplate.type) ? 1.1 : 1)).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">هزینه/سیکل</p>
                      <p className="text-accent-negative font-fa font-black text-sm mt-0.5">
                        {Math.round(selectedTemplate.baseExpenses * (activeNeighborhood?.expenseMultiplier ?? 1)).toLocaleString('fa-IR')}
                      </p>
                    </div>
                    <div className="bg-surface-inset/20 rounded-lg p-2 text-center">
                      <p className="text-fg-faint text-[9px]">مدت سیکل</p>
                      <p className="text-fg font-fa font-black text-sm mt-0.5">
                        {formatDuration(Math.max(10, Math.round(selectedTemplate.cycleDuration / (activeNeighborhood?.customerTraffic ?? 1))))}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-line-subtle pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-fg-muted">💰 سود تقریبی در ساعت</span>
                      <span className="text-accent-money font-fa font-black text-sm">
                        {(profitPerMinute(selectedTemplate, activeNeighborhood) * 60).toLocaleString('fa-IR')}
                      </span>
                    </div>
                  </div>
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
                    <span className={profitPerMinute(selectedTemplate, activeNeighborhood) >= 2000 ? 'text-emerald-400' : profitPerMinute(selectedTemplate, activeNeighborhood) >= 1000 ? 'text-amber-400' : 'text-fg-secondary'}>
                      {profitPerMinute(selectedTemplate, activeNeighborhood) >= 2000 ? 'بالا' : profitPerMinute(selectedTemplate, activeNeighborhood) >= 1000 ? 'متوسط' : 'آهسته'}
                    </span>
                  </span>
                </div>
              </Card>

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

        {/* ═══════ فوتر ثابت (sticky) ═══════ */}
        {!creating && !created && (
          <div className="flex-shrink-0 px-5 pt-3 pb-8 border-t border-line-subtle/50 bg-surface-elevated">
            {step === 'type' && (
              <Button onClick={goToLocation} disabled={!selected} fullWidth size="lg">
                {selected ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <MapPin size={16} /> انتخاب محله <ChevronLeft size={16} />
                  </span>
                ) : 'یک کسب‌وکار انتخاب کنید'}
              </Button>
            )}

            {step === 'location' && (
              <Button onClick={goToDetails} disabled={!selectedNeighborhood} fullWidth size="lg">
                {selectedNeighborhood ? (
                  <span className="flex items-center justify-center gap-1.5">
                    ادامه <ChevronLeft size={16} />
                  </span>
                ) : 'یک محله انتخاب کنید'}
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
