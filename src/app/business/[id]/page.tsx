'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { businessTemplates, getOfficeTier, OFFICE_TIERS } from '@/data/mock';
import {
  ArrowUpCircle, Users, Package, ChevronRight,
  Lock, Unlock, Clock, Coins, Building2, X, ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { BusinessProduct, Business, EmployeeRole } from '@/types';
import MoneyDisplay from '@/components/ui/MoneyDisplay';

type Tab = 'overview' | 'employees' | 'products';

const roleLabels: Record<EmployeeRole, string> = {
  base: 'نیروی پایه',
  manager: 'مدیر',
  accountant: 'حسابدار',
  marketer: 'بازاریاب',
  sales: 'فروش',
};

function checkProductReqs(biz: Business, prod: BusinessProduct): { label: string; met: boolean }[] {
  const req = prod.requirements;
  if (!req) return [];
  const checks: { label: string; met: boolean }[] = [];
  if (req.officeLevel) {
    const office = getOfficeTier(req.officeLevel);
    checks.push({
      label: `${office.icon} ${office.name}`,
      met: (biz.officeLevel ?? 1) >= req.officeLevel,
    });
  }
  if (req.businessLevel) {
    checks.push({
      label: `سطح ${req.businessLevel} شرکت`,
      met: biz.level >= req.businessLevel,
    });
  }
  if (req.employees) {
    for (const empReq of req.employees) {
      const count = biz.employees.filter((e) => e.role === empReq.role).length;
      checks.push({
        label: `${empReq.count} ${roleLabels[empReq.role]}`,
        met: count >= empReq.count,
      });
    }
  }
  return checks;
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const biz = useGameStore((s) => s.businesses.find((b) => b.id === id));
  const balance = useGameStore((s) => s.player.balance);
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const upgradeOffice = useGameStore((s) => s.upgradeOffice);
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const upgradeEmployee = useGameStore((s) => s.upgradeEmployee);
  const unlockProduct = useGameStore((s) => s.unlockProduct);

  const [tab, setTab] = useState<Tab>('overview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [collectAnim, setCollectAnim] = useState<number | null>(null);
  const [showOfficeSheet, setShowOfficeSheet] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (biz) {
        const elapsed = (Date.now() - biz.lastCycleAt) / 1000;
        const remaining = Math.max(0, biz.cycleDuration - (elapsed % biz.cycleDuration));
        setTimeLeft(Math.ceil(remaining));
        setProgress(((biz.cycleDuration - remaining) / biz.cycleDuration) * 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [biz]);

  const handleCollect = useCallback(() => {
    if (!biz || biz.pendingRevenue <= 0) return;
    const amount = biz.pendingRevenue;
    collectRevenue(biz.id);
    setCollectAnim(amount);
    setTimeout(() => setCollectAnim(null), 1500);
  }, [biz, collectRevenue]);

  if (!biz) {
    return (
      <div className="py-20 text-center">
        <p className="text-fg-secondary">کسب‌وکار یافت نشد</p>
        <Link href="/business" className="text-indigo-400 text-sm mt-2 inline-block">بازگشت</Link>
      </div>
    );
  }

  const template = businessTemplates.find((t) => t.type === biz.type);
  const effectiveRevenue = calcEffectiveRevenue(biz);
  const totalExpenses = calcTotalExpenses(biz);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(biz);
  const hasPending = biz.pendingRevenue > 0;
  const companyValue = biz.baseRevenue * biz.level * 10;

  // پیش‌نمایش ارتقا
  const nextBaseRevenue = Math.round(biz.baseRevenue * 1.25);
  const nextUpgradeCost = Math.round(biz.upgradeCost * 1.6);
  const nextEffectiveRevenue = calcEffectiveRevenue({ ...biz, baseRevenue: nextBaseRevenue });
  const nextNetProfit = nextEffectiveRevenue - totalExpenses;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0 && s > 0) return `${m} دقیقه و ${s} ثانیه`;
    if (m > 0) return `${m} دقیقه`;
    return `${s} ثانیه`;
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'کلی', icon: Coins },
    { key: 'employees', label: 'نیروها', icon: Users },
    { key: 'products', label: 'محصولات', icon: Package },
  ];

  const levelProgress = (biz.level / biz.maxLevel) * 100;

  return (
    <div className="space-y-3 py-4 pb-32">
      {/* هدر — نام + سطح + تجهیزات + مالی */}
      <div className="flex items-center gap-3">
        <Link href="/business" className="text-fg-muted hover:text-fg-secondary">
          <ChevronRight size={20} />
        </Link>
        <span className="text-2xl">{biz.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black truncate">{biz.name}</h1>
            <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/15 px-1.5 py-0.5 rounded shrink-0">
              LV {biz.level}
            </span>
          </div>
          <p className="text-[10px] text-fg-muted mt-0.5">💻 {biz.initialEquipment}</p>
          <div className="flex items-center gap-2.5 text-[10px] mt-0.5">
            <span className="text-fg-muted">
              درآمد: <span className="text-accent-positive font-fa font-bold">{effectiveRevenue.toLocaleString('fa-IR')}</span>
            </span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted">
              هزینه: <span className="text-accent-negative font-fa font-bold">{totalExpenses.toLocaleString('fa-IR')}</span>
            </span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted">
              سود: <span className={`font-fa font-bold ${netProfit >= 0 ? 'text-accent-positive' : 'text-accent-negative'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fa-IR')}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* تایمر فشرده + جمع‌آوری */}
      <Card
        glow={hasPending ? '#10b981' : '#3f3f46'}
        className={`text-center py-3 relative overflow-hidden ${hasPending ? 'animate-pulse-glow' : ''}`}
      >
        {/* انیمیشن جمع‌آوری */}
        {collectAnim !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-emerald-400 font-black text-lg font-fa animate-collect">
              +{collectAnim.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          {/* حلقه تایمر کوچک */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" style={{ stroke: 'var(--ring-bg)' }} strokeWidth="7" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={hasPending ? '#10b981' : '#6366f1'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black font-fa">{formatTime(timeLeft)}</span>
              <span className="text-[8px] text-fg-muted">تا تولید بعدی</span>
            </div>
          </div>

          {/* وضعیت + دکمه */}
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-[10px] text-fg-muted">
              {hasPending ? '✅ آماده جمع‌آوری' : `⏱ ${formatTime(timeLeft)} تا تولید بعدی`}
            </p>

            {hasPending ? (
              <button
                onClick={handleCollect}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg font-bold text-[11px] active:scale-95 transition-all"
              >
                💰 جمع‌آوری <span className="font-fa">{biz.pendingRevenue.toLocaleString('fa-IR')}</span>
              </button>
            ) : (
              <p className="text-[10px] text-fg-faint">
                {isAuto ? '🧮 جمع‌آوری خودکار فعال' : 'در انتظار سیکل بعدی...'}
              </p>
            )}

            {isAuto && hasPending && (
              <p className="text-[9px] text-emerald-400">🧮 حسابدار فعال</p>
            )}
          </div>
        </div>
      </Card>

      {/* تب‌ها */}
      <div className="flex bg-surface-card/50 rounded-xl p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-indigo-600 text-white' : 'text-fg-secondary hover:text-fg'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ==================== تب کلی ==================== */}
      {tab === 'overview' && (() => {
        const officeLevel = biz.officeLevel ?? 1;
        const currentOffice = getOfficeTier(officeLevel);
        const isMaxOffice = officeLevel >= OFFICE_TIERS.length;
        const nextOffice = !isMaxOffice ? getOfficeTier(officeLevel + 1) : null;
        const empFill = biz.employees.length / currentOffice.maxEmployees;
        const prodFill = biz.products.filter((p) => p.unlocked).length / currentOffice.maxProducts;
        return (
        <div className="space-y-3">
          {/* کارت دفتر — استایل بازی */}
          <button
            onClick={() => setShowOfficeSheet(true)}
            className="w-full text-right active:scale-[0.98] transition-transform"
          >
            <div className="rounded-2xl border border-line bg-surface-card/60 overflow-hidden">
              {/* نوار بالا */}
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-line/50">
                <div className="flex items-center gap-1.5">
                  <Building2 size={12} className="text-fg-secondary" />
                  <span className="text-[9px] font-bold text-fg-secondary">دفتر کار</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-fg-muted font-bold">LV {officeLevel}</span>
                  <ChevronUp size={12} className="text-fg-muted" />
                </div>
              </div>

              <div className="p-3 space-y-2.5">
                {/* آیکون + نام + متراژ */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-inset/50 border border-line/50 flex items-center justify-center text-2xl">
                    {currentOffice.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black">{currentOffice.name}</p>
                    <p className="text-[10px] text-fg-muted font-fa">{currentOffice.area} متر مربع · اجاره {currentOffice.rent.toLocaleString('fa-IR')}/سیکل</p>
                  </div>
                  {nextOffice && (
                    <div className="shrink-0 bg-surface-inset/50 border border-line/50 rounded-lg px-2 py-1 text-center">
                      <p className="text-[8px] text-fg-muted font-bold">ارتقا</p>
                      <p className="text-[8px]">{nextOffice.icon}</p>
                    </div>
                  )}
                </div>

                {/* بارهای ظرفیت */}
                <div className="space-y-1.5">
                  <div>
                    <div className="flex items-center justify-between text-[9px] mb-0.5">
                      <span className="text-fg-muted">👥 نیروی انسانی</span>
                      <span className="text-fg font-fa font-bold">{biz.employees.length}/{currentOffice.maxEmployees}</span>
                    </div>
                    <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all bg-fg-muted"
                        style={{ width: `${empFill * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[9px] mb-0.5">
                      <span className="text-fg-muted">🧪 محصولات</span>
                      <span className="text-fg font-fa font-bold">{biz.products.filter((p) => p.unlocked).length}/{currentOffice.maxProducts}</span>
                    </div>
                    <div className="h-1.5 bg-progress-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all bg-fg-muted"
                        style={{ width: `${prodFill * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center gap-1 text-[10px] text-fg-secondary font-bold pt-0.5">
                  <span>مشاهده سطوح دفتر و ارتقا</span>
                  <ChevronUp size={14} />
                </div>
              </div>
            </div>
          </button>

          {/* نوار پیشرفت سطح */}
          <Card className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">📊 پیشرفت سطح</p>
              <span className="text-[10px] text-fg-secondary font-fa">
                سطح {biz.level.toLocaleString('fa-IR')} از {biz.maxLevel.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="h-2 bg-progress-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </Card>

          {/* اطلاعات شرکت — گرید ۲ ستونه */}
          <Card className="space-y-2.5">
            <p className="text-xs font-bold">🏢 اطلاعات شرکت</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span>⏱</span>
                <span className="text-fg-muted">مدت سیکل:</span>
                <span className="text-fg font-fa">{formatDuration(biz.cycleDuration)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>📦</span>
                <span className="text-fg-muted">حداکثر انباشت:</span>
                <span className="text-fg font-fa">{biz.maxPendingCycles.toLocaleString('fa-IR')} سیکل</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👥</span>
                <span className="text-fg-muted">نیرو:</span>
                <span className="text-fg font-fa">{biz.employees.length}/{biz.maxEmployees}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🧪</span>
                <span className="text-fg-muted">محصولات:</span>
                <span className="text-fg font-fa">{biz.products.filter((p) => p.unlocked).length}/{biz.maxProducts}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>💎</span>
                <span className="text-fg-muted">ارزش شرکت:</span>
                <span className="text-accent-money font-fa font-bold">{companyValue.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏆</span>
                <span className="text-fg-muted">حداکثر سطح:</span>
                <span className="text-fg font-fa">{biz.maxLevel.toLocaleString('fa-IR')}</span>
              </div>
            </div>
          </Card>
        </div>
        );
      })()}

      {/* ==================== باتن‌شیت دفتر کار ==================== */}
      {showOfficeSheet && (() => {
        const officeLevel = biz.officeLevel ?? 1;
        const nextOffice = officeLevel < OFFICE_TIERS.length ? getOfficeTier(officeLevel + 1) : null;
        return (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setShowOfficeSheet(false)}
          />
          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto bg-surface-elevated rounded-t-3xl border-t border-x border-line overflow-hidden">
              {/* Handle + Header */}
              <div className="flex flex-col items-center pt-3 pb-2 px-4 border-b border-line/50">
                <div className="w-10 h-1 rounded-full bg-fg-faint/30 mb-3" />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-fg-secondary" />
                    <h2 className="text-sm font-black">ارتقا دفتر کار</h2>
                  </div>
                  <button
                    onClick={() => setShowOfficeSheet(false)}
                    className="p-1.5 rounded-full hover:bg-surface-card transition-colors text-fg-muted"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Tier List */}
              <div className="px-4 py-3 space-y-2.5 max-h-[65vh] overflow-y-auto">
                {OFFICE_TIERS.map((tier, index) => {
                  const isCurrent = tier.level === officeLevel;
                  const isOwned = tier.level < officeLevel;
                  const isNext = tier.level === officeLevel + 1;
                  const isLocked = tier.level > officeLevel + 1;
                  const canAfford = balance >= tier.upgradeCost;
                  const prevTier = index > 0 ? OFFICE_TIERS[index - 1] : null;

                  return (
                    <div key={tier.level} className="relative">
                      {/* خط اتصال عمودی */}
                      {index > 0 && (
                        <div className={`absolute -top-2.5 right-[26px] w-0.5 h-2.5 ${
                          isOwned || isCurrent ? 'bg-fg-muted' : 'bg-fg-faint/20'
                        }`} />
                      )}

                      <div className={`rounded-2xl border overflow-hidden transition-all ${
                        isCurrent
                          ? 'border-fg-muted bg-surface-card/80'
                          : isNext
                            ? 'border-line bg-surface-card/60'
                            : isOwned
                              ? 'border-line/30 bg-surface-card/40 opacity-60'
                              : 'border-line/30 bg-surface-card/30 opacity-40'
                      }`}>
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            {/* آیکون بزرگ */}
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-surface-inset/50 border border-line/30">
                              {isLocked ? <Lock size={22} className="text-fg-faint" /> : tier.icon}
                            </div>

                            {/* اطلاعات */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-black">{tier.name}</p>
                                {isCurrent && (
                                  <span className="text-[8px] bg-fg-muted/20 text-fg-secondary px-1.5 py-0.5 rounded-full font-bold">فعلی</span>
                                )}
                                {isOwned && (
                                  <span className="text-[8px] bg-fg-faint/15 text-fg-muted px-1.5 py-0.5 rounded-full font-bold">قبلی</span>
                                )}
                              </div>
                              <p className="text-[10px] text-fg-muted font-fa">{tier.area} متر مربع</p>

                              {/* آمار — گرید */}
                              <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-2">
                                <div className="text-center">
                                  <p className="text-lg font-black text-fg font-fa">{tier.maxEmployees}</p>
                                  <p className="text-[8px] text-fg-muted">ظرفیت نیرو</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-black text-fg font-fa">{tier.maxProducts}</p>
                                  <p className="text-[8px] text-fg-muted">ظرفیت محصول</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-black text-fg font-fa">{tier.rent.toLocaleString('fa-IR')}</p>
                                  <p className="text-[8px] text-fg-muted">اجاره/سیکل</p>
                                </div>
                              </div>

                              {/* پیشرفت نسبت به سطح قبل */}
                              {prevTier && !isOwned && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  <span className="text-[8px] bg-surface-inset/50 text-fg-secondary px-1.5 py-0.5 rounded-full font-bold">
                                    +{tier.maxEmployees - prevTier.maxEmployees} نیرو
                                  </span>
                                  <span className="text-[8px] bg-surface-inset/50 text-fg-secondary px-1.5 py-0.5 rounded-full font-bold">
                                    +{tier.maxProducts - prevTier.maxProducts} محصول
                                  </span>
                                  <span className="text-[8px] bg-surface-inset/50 text-fg-secondary px-1.5 py-0.5 rounded-full font-bold">
                                    +{(tier.rent - prevTier.rent).toLocaleString('fa-IR')} اجاره
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* دکمه ارتقا */}
                          {isNext && (
                            <button
                              onClick={() => {
                                upgradeOffice(biz.id);
                                if (canAfford) setShowOfficeSheet(false);
                              }}
                              disabled={!canAfford}
                              className="w-full mt-3 bg-accent-positive hover:opacity-90 disabled:opacity-40 disabled:bg-surface-inset text-white py-2.5 rounded-xl text-xs font-black active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                            >
                              <ArrowUpCircle size={16} />
                              ارتقا — <span className="font-fa">{tier.upgradeCost.toLocaleString('fa-IR')}</span> تومان
                            </button>
                          )}
                          {isLocked && (
                            <div className="mt-2 text-center">
                              <p className="text-[9px] text-fg-faint flex items-center justify-center gap-1">
                                <Lock size={10} /> ابتدا سطح قبلی را ارتقا دهید
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* فوتر — موجودی */}
              <div className="px-4 py-3 border-t border-line/50 bg-surface-card/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-muted">موجودی شما:</span>
                  <span className="text-accent-money font-fa font-bold">{balance.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            </div>
          </div>
        </>
        );
      })()}

      {/* ==================== تب نیروها ==================== */}
      {tab === 'employees' && (
        <div className="space-y-3">
          {/* نیروهای فعلی */}
          {biz.employees.length > 0 && (
            <div>
              <p className="text-[10px] font-bold mb-2 text-fg-secondary">نیروهای فعلی</p>
              <div className="space-y-1.5">
                {biz.employees.map((emp) => {
                  const canUpgrade = emp.employeeLevel < emp.maxUpgradeLevel;
                  const upgCost = canUpgrade ? emp.baseHireCost * Math.pow(2, emp.employeeLevel) : 0;
                  const canAffordUpg = balance >= upgCost;
                  const levelBoost = (1 + (emp.employeeLevel - 1) * 0.5);
                  const effectiveBoost = emp.revenueBoost * levelBoost;
                  return (
                    <div key={emp.id} className="bg-surface-card/60 rounded-xl px-3 py-2.5 border border-line/30">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{emp.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate">{emp.name}</p>
                            {emp.maxUpgradeLevel > 1 && (
                              <span className="text-[8px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-bold shrink-0">
                                L{emp.employeeLevel}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-fg-muted">
                            {emp.revenueBoost > 0 && (
                              <span className="text-emerald-400">+{(effectiveBoost * 100).toFixed(0)}% درآمد 📈</span>
                            )}
                            {emp.autoCollect && <span className="text-emerald-400">🧮 جمع‌آوری خودکار</span>}
                            {' · '}
                            <span className="font-fa text-fg-faint">{emp.salary.toLocaleString('fa-IR')}/سیکل</span>
                          </p>
                        </div>
                        {canUpgrade ? (
                          <button
                            onClick={() => upgradeEmployee(biz.id, emp.id)}
                            disabled={!canAffordUpg}
                            className="shrink-0 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white px-2 py-1 rounded-lg text-[9px] font-bold active:scale-95 transition-all"
                          >
                            ⬆ L{emp.employeeLevel + 1}
                            <br />
                            <span className="font-fa">{upgCost.toLocaleString('fa-IR')}</span>
                          </button>
                        ) : (
                          <span className="text-emerald-400 text-xs shrink-0">✅</span>
                        )}
                      </div>
                      {/* نوار پیشرفت سطح */}
                      {emp.maxUpgradeLevel > 1 && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="flex-1 h-1 bg-progress-bg rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all"
                              style={{ width: `${(emp.employeeLevel / emp.maxUpgradeLevel) * 100}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-fg-muted font-fa">{emp.employeeLevel}/{emp.maxUpgradeLevel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* درخت رشد — استخدام */}
          <p className="text-[10px] font-bold text-fg-secondary">
            درخت رشد نیروها ({biz.employees.length}/{biz.maxEmployees})
          </p>
          {biz.employees.length >= biz.maxEmployees && (biz.officeLevel ?? 1) < OFFICE_TIERS.length && (
            <p className="text-[9px] text-amber-400 bg-amber-500/10 rounded-lg px-2 py-1.5 flex items-center gap-1">
              <Building2 size={12} /> ظرفیت دفتر پر است — برای استخدام بیشتر دفتر را ارتقا دهید
            </p>
          )}
          <div className="space-y-1.5">
            {template?.availableEmployees.map((et) => {
              const alreadyHired = biz.employees.some((e) => e.templateId === et.id);
              const isLocked = biz.level < et.unlockLevel;
              const capacityFull = biz.employees.length >= biz.maxEmployees;
              const canAfford = balance >= et.hireCost;

              if (alreadyHired) return null; // نمایش در لیست فعلی بالا

              return (
                <div
                  key={et.id}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border ${
                    isLocked
                      ? 'bg-surface-elevated/40 border-line/30 opacity-60'
                      : 'bg-surface-card/40 border-line/30'
                  }`}
                >
                  <span className={`text-lg ${isLocked ? 'grayscale' : ''}`}>{et.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${isLocked ? 'text-fg-muted' : ''}`}>{et.name}</p>
                      {et.tier === 'legendary' && !isLocked && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">افسانه‌ای</span>
                      )}
                    </div>
                    <p className="text-[9px] text-fg-muted">
                      {isLocked ? (
                        <span className="text-fg-faint">🔒 سطح {et.unlockLevel.toLocaleString('fa-IR')} شرکت</span>
                      ) : (
                        <>
                          {et.revenueBoost > 0 && <span className="text-emerald-400">+{(et.revenueBoost * 100).toFixed(0)}% درآمد</span>}
                          {et.autoCollect && <span className="text-emerald-400">جمع‌آوری خودکار</span>}
                          {et.expenseReduction && <span className="text-sky-400"> · هزینه -{(et.expenseReduction * 100).toFixed(0)}%</span>}
                          {et.cycleDurationReduction && <span className="text-purple-400"> · سیکل -{(et.cycleDurationReduction * 100).toFixed(0)}%</span>}
                          {' · '}
                          <span className="font-fa text-fg-faint">{et.salary.toLocaleString('fa-IR')}/سیکل</span>
                        </>
                      )}
                    </p>
                  </div>
                  {isLocked ? (
                    <span className="text-[9px] text-fg-faint shrink-0 flex items-center gap-0.5">
                      <Lock size={10} /> LV{et.unlockLevel}
                    </span>
                  ) : capacityFull ? (
                    <span className="text-[9px] text-fg-muted shrink-0">ظرفیت پر</span>
                  ) : (
                    <button
                      onClick={() => hireEmployee(biz.id, et)}
                      disabled={!canAfford}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold active:scale-95 transition-all"
                    >
                      <span className="font-fa">{et.hireCost.toLocaleString('fa-IR')}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== تب محصولات ==================== */}
      {tab === 'products' && (
        <div className="space-y-2">
          {biz.products.map((prod) => {
            const reqChecks = checkProductReqs(biz, prod);
            const allMet = reqChecks.every((r) => r.met);
            const unlockedCount = biz.products.filter((p) => p.unlocked).length;
            const capacityFull = unlockedCount >= biz.maxProducts;
            const canUnlock = allMet && !capacityFull && balance >= prod.unlockCost;

            return (
            <div key={prod.id} className="bg-surface-card/40 rounded-xl px-3 py-3 border border-line/30 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{prod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate">{prod.name}</p>
                    {prod.unlocked ? (
                      <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                        <Unlock size={9} /> فعال
                      </span>
                    ) : (
                      <Lock size={10} className="text-fg-faint" />
                    )}
                  </div>
                  <p className="text-[9px] text-fg-muted">{prod.description}</p>
                  <p className="text-[10px] mt-0.5">
                    <span className="text-fg-muted">درآمد محصول: </span>
                    <span className="text-accent-positive font-bold font-fa">+{prod.revenueBoost.toLocaleString('fa-IR')}</span>
                    <span className="text-fg-muted"> تومان/سیکل</span>
                  </p>
                </div>
              </div>
              {/* پیش‌نیازها */}
              {!prod.unlocked && reqChecks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {reqChecks.map((r, i) => (
                    <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      r.met
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {r.met ? '✅' : '❌'} {r.label}
                    </span>
                  ))}
                </div>
              )}
              {!prod.unlocked && (
                <>
                  {capacityFull ? (
                    <p className="text-[9px] text-amber-400 text-center">ظرفیت محصولات پر — دفتر را ارتقا دهید</p>
                  ) : (
                    <button
                      onClick={() => unlockProduct(biz.id, prod.id)}
                      disabled={!canUnlock}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                    >
                      آنلاک — <span className="font-fa">{prod.unlockCost.toLocaleString('fa-IR')}</span> تومان
                    </button>
                  )}
                </>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* دکمه ارتقا — ثابت پایین صفحه با پیش‌نمایش */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div className="max-w-lg mx-auto space-y-1.5">
          {/* پیش‌نمایش ارتقا */}
          {biz.level < biz.maxLevel && (
            <div className="bg-nav/95 backdrop-blur-md rounded-xl px-3 py-2 border border-line-subtle flex items-center justify-between text-[10px]">
              <span className="text-fg-secondary">سطح {biz.level + 1}:</span>
              <span className="text-fg-muted">
                سود{' '}
                <span className="text-fg-secondary font-fa">{netProfit.toLocaleString('fa-IR')}</span>
                <span className="text-fg-faint mx-1">→</span>
                <span className="text-accent-positive font-fa font-bold">{nextNetProfit.toLocaleString('fa-IR')}</span>
              </span>
              <span className="text-fg-faint">|</span>
              <span className="text-fg-muted">
                ارتقای بعد{' '}
                <span className="text-accent-money font-fa">{nextUpgradeCost.toLocaleString('fa-IR')}</span>
              </span>
            </div>
          )}
          <Button
            onClick={() => upgradeBusiness(biz.id)}
            disabled={balance < biz.upgradeCost || biz.level >= biz.maxLevel}
            fullWidth
            variant="success"
          >
            <span className="flex items-center justify-center gap-1.5">
              <ArrowUpCircle size={16} />
              {biz.level >= biz.maxLevel
                ? 'حداکثر سطح'
                : `ارتقا به سطح ${biz.level + 1} — ${biz.upgradeCost.toLocaleString('fa-IR')} تومان`}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
