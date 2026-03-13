'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant, getNextUnlock } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import ProgressRing from '@/components/ui/ProgressRing';
import { businessTemplates, getOfficeTier, OFFICE_TIERS } from '@/data/mock';
import {
  ArrowUpCircle, Users, Package, ChevronRight,
  Lock, Unlock, Coins, Building2, X, ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { BusinessProduct, Business, EmployeeRole } from '@/types';

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
    checks.push({ label: `${office.icon} ${office.name}`, met: (biz.officeLevel ?? 1) >= req.officeLevel });
  }
  if (req.businessLevel) {
    checks.push({ label: `سطح ${req.businessLevel} شرکت`, met: biz.level >= req.businessLevel });
  }
  if (req.employees) {
    for (const empReq of req.employees) {
      const count = biz.employees.filter((e) => e.role === empReq.role).length;
      checks.push({ label: `${empReq.count} ${roleLabels[empReq.role]}`, met: count >= empReq.count });
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
        <Link href="/business" className="text-accent-primary text-sm mt-2 inline-block">بازگشت</Link>
      </div>
    );
  }

  const template = businessTemplates.find((t) => t.type === biz.type);
  const effectiveRevenue = calcEffectiveRevenue(biz);
  const totalExpenses = calcTotalExpenses(biz);
  const netProfit = effectiveRevenue - totalExpenses;
  const isAuto = hasAccountant(biz);
  const hasPending = biz.pendingRevenue > 0;

  const nextBaseRevenue = Math.round(biz.baseRevenue * 1.22);
  const nextUpgradeCost = Math.round(biz.upgradeCost * 1.5);
  const nextEffectiveRevenue = calcEffectiveRevenue({ ...biz, baseRevenue: nextBaseRevenue });
  const nextNetProfit = nextEffectiveRevenue - totalExpenses;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'کلی', icon: Coins },
    { key: 'employees', label: 'نیروها', icon: Users },
    { key: 'products', label: 'محصولات', icon: Package },
  ];

  return (
    <div className="space-y-3 py-4 pb-32">
      {/* ==================== هدر ==================== */}
      <div className="flex items-center gap-3">
        <Link href="/business" className="text-fg-muted hover:text-fg-secondary">
          <ChevronRight size={20} />
        </Link>
        <span className="text-2xl">{biz.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black truncate">{biz.name}</h1>
            <span className="text-[10px] text-accent-primary font-bold bg-accent-primary/15 px-1.5 py-0.5 rounded-[999px] shrink-0">
              LV {biz.level}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] mt-0.5">
            <span className="text-[#22C55E] font-bold font-fa">+{netProfit.toLocaleString('fa-IR')}</span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted font-fa">{effectiveRevenue.toLocaleString('fa-IR')} درآمد</span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted font-fa">{totalExpenses.toLocaleString('fa-IR')} هزینه</span>
          </div>
        </div>
      </div>

      {/* ==================== تولید — تایمر + جمع‌آوری ==================== */}
      <div className={`relative rounded-[18px] border border-line-subtle p-4 overflow-hidden transition-all ${
        hasPending ? 'shadow-[var(--shadow-collect)] animate-shimmer' : 'shadow-[var(--shadow-card)]'
      }`}>
        {collectAnim !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-[#22C55E] font-black text-xl font-fa animate-collect">
              +{collectAnim.toLocaleString('fa-IR')}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-5">
          <ProgressRing
            progress={progress}
            size={80}
            strokeWidth={7}
            color={hasPending ? '#22C55E' : '#6366F1'}
          >
            <span className="text-sm font-black font-fa">{formatTime(timeLeft)}</span>
            <span className="text-[7px] text-fg-muted">سیکل</span>
          </ProgressRing>

          <div className="flex flex-col items-start gap-2">
            {hasPending ? (
              <button
                onClick={handleCollect}
                className="bg-[#22C55E] hover:bg-emerald-400 text-white px-5 py-2 rounded-[999px] font-black text-[12px] active:scale-95 transition-all shadow-[var(--shadow-collect)]"
              >
                💰 جمع‌آوری <span className="font-fa">{biz.pendingRevenue.toLocaleString('fa-IR')}</span>
              </button>
            ) : (
              <p className="text-[11px] text-fg-muted">
                {isAuto ? '🧮 جمع‌آوری خودکار' : 'در انتظار تولید...'}
              </p>
            )}
            {isAuto && hasPending && (
              <p className="text-[9px] text-[#22C55E]">🧮 حسابدار فعال</p>
            )}
          </div>
        </div>
      </div>

      {/* ==================== تب‌ها ==================== */}
      <div className="flex bg-surface-card/50 rounded-[999px] p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-[999px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-[#4F46E5] text-white' : 'text-fg-muted hover:text-fg'
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
        return (
        <div className="space-y-3">
          {/* دفتر کار */}
          <button onClick={() => setShowOfficeSheet(true)} className="w-full text-right active:scale-[0.98] transition-transform">
            <div className="rounded-[18px] border border-line-subtle bg-surface-card/40 p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-surface-inset/50 flex items-center justify-center text-xl">
                  {currentOffice.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black">{currentOffice.name}</p>
                    <span className="text-[9px] text-fg-muted font-fa">LV {officeLevel}</span>
                  </div>
                  <p className="text-[9px] text-fg-muted font-fa">{currentOffice.area}m² · {currentOffice.rent.toLocaleString('fa-IR')}/سیکل</p>
                </div>
                {nextOffice && <ChevronUp size={16} className="text-fg-faint" />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ProgressBar value={biz.employees.length} max={currentOffice.maxEmployees} label="👥 نیرو" showValue color="primary" />
                <ProgressBar value={biz.products.filter((p) => p.unlocked).length} max={currentOffice.maxProducts} label="🧪 محصول" showValue color="profit" />
              </div>
            </div>
          </button>

          {/* سطح */}
          <div className="px-1">
            <ProgressBar value={biz.level} max={biz.maxLevel} label="📊 پیشرفت سطح" showValue color="upgrade" size="md" />
          </div>

          {/* آمار */}
          <div className="space-y-1 text-[11px] px-1">
            {[
              { icon: '⏱', label: 'سیکل', value: `${Math.floor(biz.cycleDuration / 60)}:${(biz.cycleDuration % 60).toString().padStart(2, '0')}` },
              { icon: '📦', label: 'انباشت', value: `${biz.maxPendingCycles} سیکل` },
              { icon: '💎', label: 'ارزش', value: (biz.baseRevenue * biz.level * 10).toLocaleString('fa-IR') },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1 border-b border-line-subtle/50 last:border-0">
                <span className="text-fg-muted">{row.icon} {row.label}</span>
                <span className="text-fg font-fa font-bold">{row.value}</span>
              </div>
            ))}
          </div>

          {/* آنلاک بعدی */}
          {(() => {
            const nextUnlock = template ? getNextUnlock(biz, template) : null;
            if (!nextUnlock) return null;
            const levelsLeft = nextUnlock.level - biz.level;
            const typeLabel = { employee: 'نیرو', product: 'محصول', office: 'دفتر', enterprise: 'ویژه' }[nextUnlock.type];
            return (
              <div className="rounded-[18px] border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-[12px] bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center text-xl">
                    {nextUnlock.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black truncate">{nextUnlock.name}</p>
                      <span className="text-[8px] bg-[#FBBF24]/15 text-[#FBBF24] px-1.5 py-0.5 rounded-[999px] font-bold">{typeLabel}</span>
                    </div>
                    <p className="text-[9px] text-fg-muted mt-0.5">{nextUnlock.description}</p>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-lg font-black text-[#FBBF24] font-fa">LV {nextUnlock.level}</p>
                    <p className="text-[8px] text-fg-muted font-fa">{levelsLeft} سطح مانده</p>
                  </div>
                </div>
                <ProgressBar value={biz.level} max={nextUnlock.level} color="gold" className="mt-2" />
              </div>
            );
          })()}
        </div>
        );
      })()}

      {/* ==================== باتن‌شیت دفتر ==================== */}
      {showOfficeSheet && (() => {
        const officeLevel = biz.officeLevel ?? 1;
        return (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowOfficeSheet(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto bg-surface-elevated rounded-t-[24px] border-t border-x border-line overflow-hidden">
              <div className="flex flex-col items-center pt-3 pb-2 px-4 border-b border-line/50">
                <div className="w-10 h-1 rounded-[999px] bg-fg-faint/30 mb-3" />
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-sm font-black">ارتقا دفتر</h2>
                  <button onClick={() => setShowOfficeSheet(false)} className="p-1.5 rounded-full hover:bg-surface-card text-fg-muted"><X size={18} /></button>
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 max-h-[65vh] overflow-y-auto">
                {OFFICE_TIERS.map((tier, index) => {
                  const isCurrent = tier.level === officeLevel;
                  const isOwned = tier.level < officeLevel;
                  const isNext = tier.level === officeLevel + 1;
                  const isLocked = tier.level > officeLevel + 1;
                  const canAfford = balance >= tier.upgradeCost;
                  const prevTier = index > 0 ? OFFICE_TIERS[index - 1] : null;
                  return (
                    <div key={tier.level} className="relative">
                      {index > 0 && <div className={`absolute -top-2 right-[22px] w-0.5 h-2 ${isOwned || isCurrent ? 'bg-fg-muted' : 'bg-fg-faint/20'}`} />}
                      <div className={`rounded-[18px] border overflow-hidden transition-all ${
                        isCurrent ? 'border-fg-muted bg-surface-card/80' : isNext ? 'border-line bg-surface-card/60' : isOwned ? 'border-line/30 bg-surface-card/40 opacity-60' : 'border-line/30 bg-surface-card/30 opacity-40'
                      }`}>
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-2xl shrink-0 bg-surface-inset/50 border border-line/30">
                              {isLocked ? <Lock size={20} className="text-fg-faint" /> : tier.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-sm font-black">{tier.name}</p>
                                {isCurrent && <span className="text-[8px] bg-fg-muted/20 text-fg-secondary px-1.5 py-0.5 rounded-[999px] font-bold">فعلی</span>}
                              </div>
                              <p className="text-[10px] text-fg-muted font-fa">{tier.area}m²</p>
                              <div className="grid grid-cols-3 gap-x-2 mt-1.5 text-center">
                                <div><p className="text-base font-black font-fa">{tier.maxEmployees}</p><p className="text-[7px] text-fg-muted">نیرو</p></div>
                                <div><p className="text-base font-black font-fa">{tier.maxProducts}</p><p className="text-[7px] text-fg-muted">محصول</p></div>
                                <div><p className="text-base font-black font-fa">{tier.rent.toLocaleString('fa-IR')}</p><p className="text-[7px] text-fg-muted">اجاره</p></div>
                              </div>
                              {prevTier && !isOwned && (
                                <div className="flex gap-1.5 mt-1.5">
                                  <span className="text-[8px] bg-surface-inset/50 text-fg-secondary px-1.5 py-0.5 rounded-[999px] font-bold">+{tier.maxEmployees - prevTier.maxEmployees} نیرو</span>
                                  <span className="text-[8px] bg-surface-inset/50 text-fg-secondary px-1.5 py-0.5 rounded-[999px] font-bold">+{tier.maxProducts - prevTier.maxProducts} محصول</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isNext && (
                            <button
                              onClick={() => { upgradeOffice(biz.id); if (canAfford) setShowOfficeSheet(false); }}
                              disabled={!canAfford}
                              className="w-full mt-3 bg-[#8B5CF6] hover:bg-violet-400 disabled:opacity-40 disabled:bg-surface-inset text-white py-2.5 rounded-[999px] text-xs font-black active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                            >
                              <ArrowUpCircle size={16} />
                              ارتقا — <span className="font-fa">{tier.upgradeCost.toLocaleString('fa-IR')}</span>
                            </button>
                          )}
                          {isLocked && <p className="text-[9px] text-fg-faint text-center mt-2 flex items-center justify-center gap-1"><Lock size={10} /> ابتدا سطح قبل</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t border-line/50 bg-surface-card/30">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-muted">موجودی:</span>
                  <span className="text-accent-money font-fa font-bold">{balance.toLocaleString('fa-IR')}</span>
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
          {biz.employees.length > 0 && (
            <div>
              <p className="text-[10px] font-bold mb-2 text-fg-secondary">نیروهای فعلی</p>
              <div className="space-y-1.5">
                {biz.employees.map((emp) => {
                  const canUpgrade = emp.employeeLevel < emp.maxUpgradeLevel;
                  const upgCost = canUpgrade ? emp.baseHireCost * Math.pow(2, emp.employeeLevel) : 0;
                  const canAffordUpg = balance >= upgCost;
                  const levelBoost = 1 + (emp.employeeLevel - 1) * 0.5;
                  const effectiveBoost = emp.revenueBoost * levelBoost;
                  return (
                    <div key={emp.id} className="bg-surface-card/60 rounded-[18px] px-3 py-2.5 border border-line/30">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{emp.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate">{emp.name}</p>
                            {emp.maxUpgradeLevel > 1 && (
                              <span className="text-[8px] bg-accent-primary/15 text-accent-primary px-1.5 py-0.5 rounded-[999px] font-bold shrink-0">L{emp.employeeLevel}</span>
                            )}
                          </div>
                          <p className="text-[9px] text-fg-muted">
                            {emp.revenueBoost > 0 && <span className="text-[#22C55E]">+{(effectiveBoost * 100).toFixed(0)}% </span>}
                            {emp.autoCollect && <span className="text-[#22C55E]">🧮 خودکار </span>}
                            <span className="font-fa text-fg-faint">{emp.salary.toLocaleString('fa-IR')}/سیکل</span>
                          </p>
                        </div>
                        {canUpgrade ? (
                          <button
                            onClick={() => upgradeEmployee(biz.id, emp.id)}
                            disabled={!canAffordUpg}
                            className="shrink-0 bg-[#8B5CF6] hover:bg-violet-400 disabled:opacity-40 text-white px-2.5 py-1.5 rounded-[999px] text-[9px] font-bold active:scale-95 transition-all"
                          >
                            ⬆ L{emp.employeeLevel + 1}
                          </button>
                        ) : (
                          <span className="text-[#22C55E] text-xs shrink-0">✅</span>
                        )}
                      </div>
                      {emp.maxUpgradeLevel > 1 && (
                        <div className="mt-1.5"><ProgressBar value={emp.employeeLevel} max={emp.maxUpgradeLevel} color="upgrade" /></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p className="text-[10px] font-bold text-fg-secondary">درخت رشد ({biz.employees.length}/{biz.maxEmployees})</p>
          {biz.employees.length >= biz.maxEmployees && (biz.officeLevel ?? 1) < OFFICE_TIERS.length && (
            <p className="text-[9px] text-accent-gold bg-accent-gold/10 rounded-[12px] px-2 py-1.5 flex items-center gap-1">
              <Building2 size={12} /> ظرفیت پر — دفتر را ارتقا دهید
            </p>
          )}
          <div className="space-y-1.5">
            {template?.availableEmployees.map((et) => {
              const alreadyHired = biz.employees.some((e) => e.templateId === et.id);
              const isLocked = biz.level < et.unlockLevel;
              const capacityFull = biz.employees.length >= biz.maxEmployees;
              const canAfford = balance >= et.hireCost;
              if (alreadyHired) return null;
              return (
                <div key={et.id} className={`flex items-center gap-2.5 rounded-[18px] px-3 py-2.5 border ${isLocked ? 'bg-surface-elevated/40 border-line/30 opacity-50' : 'bg-surface-card/40 border-line/30'}`}>
                  <span className={`text-lg ${isLocked ? 'grayscale' : ''}`}>{et.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${isLocked ? 'text-fg-muted' : ''}`}>{et.name}</p>
                      {et.tier === 'legendary' && !isLocked && (
                        <span className="text-[8px] bg-accent-gold/15 text-accent-gold px-1.5 py-0.5 rounded-[999px] font-bold">افسانه‌ای</span>
                      )}
                    </div>
                    <p className="text-[9px] text-fg-muted">
                      {isLocked ? (
                        <span className="text-fg-faint">🔒 LV {et.unlockLevel}</span>
                      ) : (
                        <>
                          {et.revenueBoost > 0 && <span className="text-[#22C55E]">+{(et.revenueBoost * 100).toFixed(0)}% </span>}
                          {et.autoCollect && <span className="text-[#22C55E]">خودکار </span>}
                          {et.expenseReduction && <span className="text-accent-info">هزینه -{(et.expenseReduction * 100).toFixed(0)}% </span>}
                          <span className="font-fa text-fg-faint">{et.salary.toLocaleString('fa-IR')}/سیکل</span>
                        </>
                      )}
                    </p>
                  </div>
                  {isLocked ? (
                    <span className="text-[9px] text-fg-faint shrink-0 flex items-center gap-0.5"><Lock size={10} /> LV{et.unlockLevel}</span>
                  ) : capacityFull ? (
                    <span className="text-[9px] text-fg-muted shrink-0">پر</span>
                  ) : (
                    <button onClick={() => hireEmployee(biz.id, et)} disabled={!canAfford} className="shrink-0 bg-[#4F46E5] hover:bg-[#6366F1] disabled:opacity-40 text-white px-3 py-1.5 rounded-[999px] text-[10px] font-bold active:scale-95 transition-all">
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
              <div key={prod.id} className="bg-surface-card/40 rounded-[18px] px-3 py-3 border border-line/30 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{prod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold truncate">{prod.name}</p>
                      {prod.unlocked ? (
                        <span className="text-[9px] bg-[#22C55E]/15 text-[#22C55E] px-1.5 py-0.5 rounded-[999px] font-bold flex items-center gap-0.5"><Unlock size={9} /> فعال</span>
                      ) : (
                        <Lock size={10} className="text-fg-faint" />
                      )}
                    </div>
                    <p className="text-[9px] text-fg-muted">{prod.description}</p>
                    <p className="text-[10px] mt-0.5">
                      <span className="text-[#22C55E] font-bold font-fa">+{prod.revenueBoost.toLocaleString('fa-IR')}</span>
                      <span className="text-fg-muted"> /سیکل</span>
                    </p>
                  </div>
                </div>
                {!prod.unlocked && reqChecks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {reqChecks.map((r, i) => (
                      <span key={i} className={`text-[9px] px-2 py-0.5 rounded-[999px] font-bold ${r.met ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {r.met ? '✅' : '❌'} {r.label}
                      </span>
                    ))}
                  </div>
                )}
                {!prod.unlocked && (
                  capacityFull ? (
                    <p className="text-[9px] text-accent-gold text-center">ظرفیت پر — دفتر را ارتقا دهید</p>
                  ) : (
                    <button onClick={() => unlockProduct(biz.id, prod.id)} disabled={!canUnlock} className="w-full bg-[#4F46E5] hover:bg-[#6366F1] disabled:opacity-40 text-white py-2 rounded-[999px] text-[11px] font-bold active:scale-95 transition-all">
                      آنلاک — <span className="font-fa">{prod.unlockCost.toLocaleString('fa-IR')}</span>
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== CTA ارتقا ==================== */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div className="max-w-lg mx-auto space-y-1.5">
          {biz.level < biz.maxLevel && (() => {
            const profitDiff = nextNetProfit - netProfit;
            const profitPercent = netProfit > 0 ? Math.round((profitDiff / netProfit) * 100) : profitDiff > 0 ? 100 : 0;
            return (
              <div className="bg-nav/95 backdrop-blur-md rounded-[18px] px-3 py-2 border border-line-subtle">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-fg-secondary font-bold">LV {biz.level + 1}</span>
                  <span className="text-[#22C55E] font-fa font-bold">+{profitPercent}% سود (+{profitDiff.toLocaleString('fa-IR')})</span>
                </div>
              </div>
            );
          })()}
          <Button onClick={() => upgradeBusiness(biz.id)} disabled={balance < biz.upgradeCost || biz.level >= biz.maxLevel} fullWidth variant="upgrade">
            <span className="flex items-center justify-center gap-1.5">
              <ArrowUpCircle size={16} />
              {biz.level >= biz.maxLevel ? 'حداکثر سطح' : `ارتقا — ${biz.upgradeCost.toLocaleString('fa-IR')}`}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
