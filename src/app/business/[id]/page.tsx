'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, getNextUnlock, calcEcosystemBonus } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import ProgressRing from '@/components/ui/ProgressRing';
import { businessTemplates, getOfficeTier, getOfficeName, OFFICE_TIERS, getEmployeeUpgradeDuration, getBusinessUpgradeDuration, BUSINESS_VOCABULARY, SPECIALTY_MILESTONES, BOOST_ITEMS } from '@/data/mock';
import {
  ArrowUpCircle, Users, Package, ChevronRight,
  Lock, Unlock, Coins, Building2, X, ChevronUp,
  TrendingUp, TrendingDown, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { BusinessProduct, Business, EmployeeRole } from '@/types';
import SupermarketPanel from '@/components/business/SupermarketPanel';
import { ShoppingCart } from 'lucide-react';

type Tab = 'overview' | 'employees' | 'products' | 'supermarket';

const roleLabels: Record<EmployeeRole, string> = {
  production: 'تولید',
  sales: 'فروش',
  warehouse: 'انبار',
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
  const allBusinesses = useGameStore((s) => s.businesses);
  const balance = useGameStore((s) => s.player.balance);
  const isRushHourActive = useGameStore((s) => s.isRushHourActive);
  const getEventMultiplier = useGameStore((s) => s.getEventMultiplier);
  const activeEvents = useGameStore((s) => s.randomEvents.activeEvents);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const completeBusinessUpgrade = useGameStore((s) => s.completeBusinessUpgrade);
  const upgradeOffice = useGameStore((s) => s.upgradeOffice);
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const upgradeEmployee = useGameStore((s) => s.upgradeEmployee);
  const completeEmployeeUpgrade = useGameStore((s) => s.completeEmployeeUpgrade);
  const unlockProduct = useGameStore((s) => s.unlockProduct);
  const useUpgradeSpeedUp = useGameStore((s) => s.useUpgradeSpeedUp);

  const [tab, setTab] = useState<Tab>('overview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
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

  if (!biz) {
    return (
      <div className="py-20 text-center">
        <p className="text-fg-secondary">کسب‌وکار یافت نشد</p>
        <Link href="/business" className="text-accent-primary text-sm mt-2 inline-block">بازگشت</Link>
      </div>
    );
  }

  const template = businessTemplates.find((t) => t.type === biz.type);
  const vocab = BUSINESS_VOCABULARY[biz.type];
  const effectiveProduction = calcEffectiveRevenue(biz);
  const totalExpenses = calcTotalExpenses(biz);

  // Rush hour + events
  const rushActive = isRushHourActive();
  const eventMult = getEventMultiplier(biz.type);
  const rushMultiplier = rushActive ? 2 : 1;
  const totalRevMultiplier = rushMultiplier * eventMult.revenueMultiplier;
  const boostedProduction = Math.round(effectiveProduction * totalRevMultiplier);

  // قیمت بازار محصول این شرکت
  const products = useGameStore((s) => s.products);
  const marketProduct = products.find((p) => p.id === biz.inventory.productId);
  const unitPrice = marketProduct?.currentPrice ?? 0;

  // Active events affecting this business
  const relevantEvents = activeEvents.filter(
    (e) => e.scope === 'global' || e.targetBusinessType === biz.type
  );

  // Soft collect: inventory >= 90%?
  const productCapBoost = biz.products.filter((p) => p.unlocked).reduce((s, p) => s + p.capacityBoost, 0);
  const warehouseBoost = biz.employees.filter((e) => e.role === 'warehouse').reduce((s, e) => {
    const lm = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
    return s + e.capacityBoost * lm;
  }, 0);
  const maxCap = biz.inventory.maxCapacity + warehouseBoost + productCapBoost;
  const isSoftCollect = biz.inventory.quantity / maxCap >= 0.9;

  // نرخ فروش خودکار: پایه + بوست کارمندان فروش
  const effectiveSaleRate = biz.baseSaleRate + biz.employees
    .filter((e) => e.role === 'sales')
    .reduce((sum, e) => {
      const levelMultiplier = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
      return sum + e.salesBoost * levelMultiplier;
    }, 0);

  // ظرفیت انبار: پایه + بوست کارمندان انبار + بوست محصولات
  const effectiveCapacity = biz.inventory.maxCapacity + biz.employees
    .filter((e) => e.role === 'warehouse')
    .reduce((sum, e) => {
      const levelMultiplier = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
      return sum + e.capacityBoost * levelMultiplier;
    }, 0) + biz.products
    .filter((p) => p.unlocked)
    .reduce((sum, p) => sum + p.capacityBoost, 0);

  const inventoryPercent = effectiveCapacity > 0 ? (biz.inventory.quantity / effectiveCapacity) * 100 : 0;
  const inventoryColor = inventoryPercent > 90 ? '#EF4444' : inventoryPercent < 30 ? '#22C55E' : '#3B82F6';

  // حاشیه سود از محصولات آنلاک‌شده
  const productRevMult = biz.products
    .filter((p) => p.unlocked && p.revenueMultiplier)
    .reduce((sum, p) => sum + (p.revenueMultiplier ?? 0), 0);
  const profitMarginPct = Math.round(productRevMult * 100);
  const ecosystemBonus = calcEcosystemBonus(biz, allBusinesses);

  // درآمد به تومان — ساده و شفاف
  const incomePerMin = Math.round(effectiveSaleRate * unitPrice * totalRevMultiplier * (1 + productRevMult));
  const expensePerMin = Math.round(totalExpenses * eventMult.expenseMultiplier * (60 / biz.cycleDuration));
  const profitPerMin = incomePerMin - expensePerMin;
  const incomePerCycle = Math.round(
    Math.min(effectiveProduction, effectiveSaleRate * (biz.cycleDuration / 60)) * unitPrice * totalRevMultiplier * (1 + productRevMult)
  );
  const expensePerCycle = Math.round(totalExpenses * eventMult.expenseMultiplier);
  const netProfit = incomePerCycle - expensePerCycle;

  const nextBaseProduction = Math.round(biz.baseProductionRate * 1.15);
  const nextUpgradeCost = Math.round(biz.upgradeCost * 1.5);
  const nextEffectiveProduction = calcEffectiveRevenue({ ...biz, baseProductionRate: nextBaseProduction });

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'کلی', icon: Coins },
    ...(biz.type === 'supermarket' ? [{ key: 'supermarket' as Tab, label: 'فروشگاه', icon: ShoppingCart }] : []),
    { key: 'employees', label: vocab.workers, icon: Users },
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
            <span className="text-[#3B82F6] font-bold font-fa">{effectiveProduction} {vocab.productUnit}/سیکل</span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted font-fa">{biz.inventory.quantity}/{effectiveCapacity} {vocab.inventoryName}</span>
            <span className="text-fg-faint">|</span>
            <span className="text-fg-muted font-fa">{totalExpenses.toLocaleString('fa-IR')} {vocab.expenses}</span>
          </div>
        </div>
      </div>

      {/* ==================== Rush Hour Banner ==================== */}
      {rushActive && (
        <div
          className="rounded-[14px] px-3 py-2 flex items-center gap-2 animate-event-pulse-red"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <span className="text-base animate-pulse">🔥</span>
          <div className="flex-1">
            <p className="text-[11px] font-black text-[#EF4444]">ساعت طلایی فعاله!</p>
            <p className="text-[9px] text-fg-muted">تولید ×۲ — الان بهترین زمانه</p>
          </div>
          <span className="text-[10px] font-black text-[#EF4444] bg-[#EF4444]/12 px-2 py-1 rounded-full">×۲</span>
        </div>
      )}

      {/* ==================== Active Events ==================== */}
      {relevantEvents.length > 0 && relevantEvents.map((evt) => (
        <div
          key={evt.id}
          className={`rounded-[14px] px-3 py-2 flex items-center gap-2 ${evt.isPositive ? 'animate-event-pulse-green' : 'animate-event-pulse-red'}`}
          style={{
            background: evt.isPositive
              ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))'
              : 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
            border: `1px solid ${evt.isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          }}
        >
          <span className="text-base">{evt.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-black truncate ${evt.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{evt.title}</p>
            <p className="text-[9px] text-fg-muted">
              {evt.effect === 'revenue_multiplier' ? `درآمد ×${evt.effectValue.toFixed(1)}` : evt.effect === 'expense_multiplier' ? `هزینه ×${evt.effectValue.toFixed(1)}` : ''}
            </p>
          </div>
        </div>
      ))}

      {/* ==================== Soft Collect Warning ==================== */}
      {isSoftCollect && (
        <div className="rounded-[14px] px-3 py-2 flex items-center gap-2 bg-[#F59E0B]/8 border border-[#F59E0B]/25">
          <AlertTriangle size={16} className="text-[#F59E0B] shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] font-black text-[#F59E0B]">انبار تقریباً پر — تولید کند شد</p>
            <p className="text-[9px] text-fg-muted">سرعت تولید ۵۰٪ کاهش یافت. بفروش تا دوباره سریع بشه.</p>
          </div>
        </div>
      )}

      {/* ==================== درآمد — ساده و شفاف ==================== */}
      <div
        className="relative rounded-[22px] border p-4 overflow-hidden transition-all"
        style={{
          borderColor: rushActive ? 'rgba(239,68,68,0.3)' : relevantEvents.some(e => e.isPositive) ? 'rgba(34,197,94,0.25)' : 'var(--line-subtle)',
          background: rushActive ? 'linear-gradient(135deg, rgba(239,68,68,0.04), transparent)' : 'var(--surface-card-40)',
        }}
      >
        {/* ردیف اصلی: تایمر + درآمد */}
        <div className="flex items-center gap-4">
          <ProgressRing
            progress={progress}
            size={76}
            strokeWidth={7}
            color={rushActive ? '#EF4444' : relevantEvents.some(e => e.isPositive) ? '#22C55E' : '#6366F1'}
          >
            <span className="text-[13px] font-black font-fa">{formatTime(timeLeft)}</span>
            <span className="text-[7px] text-fg-muted">{rushActive ? '🔥 ×۲' : 'تا تولید'}</span>
          </ProgressRing>

          <div className="flex-1 min-w-0">
            {/* سود در دقیقه — مهم‌ترین عدد */}
            <p className="text-[9px] text-fg-muted mb-0.5">💰 درآمد هر دقیقه</p>
            <p className={`text-[22px] font-black font-fa leading-none ${profitPerMin >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {profitPerMin >= 0 ? '+' : ''}{profitPerMin.toLocaleString('fa-IR')}
              <span className="text-[10px] text-fg-muted mr-1">تومان</span>
            </p>

            {/* جزئیات کوچک */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[8px] text-fg-faint bg-surface-card/60 px-1.5 py-0.5 rounded-full">
                📦 هر سیکل {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('fa-IR')}
              </span>
              {profitMarginPct > 0 && (
                <span className="text-[8px] text-[#F59E0B] bg-[#F59E0B]/8 px-1.5 py-0.5 rounded-full">
                  +{profitMarginPct}% حاشیه
                </span>
              )}
            </div>
          </div>
        </div>

        {/* انبار — ساده */}
        <div className="mt-3 pt-3 border-t border-line-subtle/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-fg-muted">📦 {vocab.inventoryName}</span>
            <span className="text-[9px] font-fa font-bold" style={{ color: inventoryColor }}>
              {Math.round(inventoryPercent)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-progress-bg overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, inventoryPercent)}%`, backgroundColor: inventoryColor }}
            />
          </div>
          {isSoftCollect && (
            <p className="text-[8px] text-[#F59E0B] font-bold mt-1">⚠️ انبار پره — تولید کند شده</p>
          )}
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
        const currentOfficeName = getOfficeName(officeLevel, biz.type);
        const isMaxOffice = officeLevel >= OFFICE_TIERS.length;
        const nextOffice = !isMaxOffice ? getOfficeTier(officeLevel + 1) : null;
        return (
        <div className="space-y-3">
          {/* دفتر کار */}
          <button onClick={() => setShowOfficeSheet(true)} className="w-full text-right active:scale-[0.98] transition-transform">
            <div className="rounded-[18px] border border-line-subtle bg-surface-card/40 p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-surface-inset/50 flex items-center justify-center text-xl">
                  {currentOfficeName.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-black">{currentOfficeName.name}</p>
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

          {/* تخصص */}
          {(() => {
            const milestones = SPECIALTY_MILESTONES[biz.type];
            const currentIdx = [...milestones].map((m, i) => ({ ...m, i })).reverse().find((m) => biz.level >= m.levelThreshold)?.i ?? 0;
            const tier = milestones[currentIdx];
            const nextTier = currentIdx < milestones.length - 1 ? milestones[currentIdx + 1] : null;
            const levelsToNext = nextTier ? nextTier.levelThreshold - biz.level : 0;
            const tierProgress = nextTier ? biz.level - tier.levelThreshold : tier.levelThreshold;
            const tierMax = nextTier ? nextTier.levelThreshold - tier.levelThreshold : tier.levelThreshold;
            return (
              <div className="rounded-[18px] border border-[#22C55E]/20 bg-[#22C55E]/5 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tier.icon}</span>
                    <div>
                      <p className="text-xs font-black text-[#22C55E]">{tier.name}</p>
                      <p className="text-[9px] text-fg-muted">{tier.description}</p>
                    </div>
                  </div>
                  {nextTier ? (
                    <div className="text-center">
                      <p className="text-[8px] text-fg-muted">بعدی</p>
                      <p className="text-[10px] font-bold text-fg-secondary">{nextTier.icon} {nextTier.name}</p>
                      <p className="text-[8px] text-fg-faint font-fa">{levelsToNext} سطح مانده</p>
                    </div>
                  ) : (
                    <span className="text-[9px] text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-[999px] font-bold">
                      حداکثر تخصص
                    </span>
                  )}
                </div>
                {nextTier && (
                  <ProgressBar value={tierProgress} max={tierMax} color="profit" size="sm" />
                )}
                {/* نقشه راه تایرها */}
                <div className="flex items-center justify-between mt-2.5 px-1">
                  {milestones.map((m) => {
                    const reached = biz.level >= m.levelThreshold;
                    return (
                      <div key={m.levelThreshold} className="flex flex-col items-center gap-0.5">
                        <span className={`text-base transition-opacity ${reached ? 'opacity-100' : 'opacity-25'}`}>{m.icon}</span>
                        <span className={`text-[7px] font-fa ${reached ? 'text-[#22C55E]' : 'text-fg-faint'}`}>LV{m.levelThreshold}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* آمار */}
          <div className="space-y-1 text-[11px] px-1">
            {[
              { icon: '⏱', label: vocab.cycle, value: `${Math.floor(biz.cycleDuration / 60)}:${(biz.cycleDuration % 60).toString().padStart(2, '0')}` },
              { icon: '⚙️', label: 'تولید', value: `${effectiveProduction} ${vocab.productUnit}/سیکل` },
              { icon: '🛒', label: 'فروش خودکار', value: `${effectiveSaleRate} ${vocab.productUnit}/دقیقه` },
              { icon: '📦', label: `ظرفیت ${vocab.inventoryName}`, value: `${biz.inventory.quantity}/${effectiveCapacity}` },
              ...(profitMarginPct > 0 ? [{ icon: '💹', label: 'حاشیه سود اضافه', value: `+${profitMarginPct}٪`, highlight: true }] : []),
              ...(ecosystemBonus.count > 0 ? [{
                icon: '🌐',
                label: ecosystemBonus.label,
                value: [
                  ecosystemBonus.saleRateBonus > 0 ? `+${ecosystemBonus.saleRateBonus}/دقیقه` : '',
                  ecosystemBonus.revenueBonus > 0 ? `+${Math.round(ecosystemBonus.revenueBonus * 100)}٪` : '',
                ].filter(Boolean).join(' · '),
                highlight: true,
              }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-1 border-b border-line-subtle/50 last:border-0">
                <span className="text-fg-muted">{row.icon} {row.label}</span>
                <span className={`font-fa font-bold ${'highlight' in row && row.highlight ? 'text-[#22C55E]' : 'text-fg'}`}>{row.value}</span>
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
        const tierColors = [
          { bg: 'from-zinc-600/20 to-zinc-800/10', border: 'border-zinc-500/30', glow: '', icon: 'bg-zinc-700/30' },
          { bg: 'from-blue-600/20 to-blue-900/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]', icon: 'bg-blue-600/20' },
          { bg: 'from-purple-600/20 to-purple-900/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]', icon: 'bg-purple-600/20' },
          { bg: 'from-amber-500/20 to-amber-900/10', border: 'border-amber-500/30', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]', icon: 'bg-amber-500/20' },
        ];
        return (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowOfficeSheet(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="max-w-lg mx-auto bg-surface-elevated rounded-t-[28px] border-t border-x border-line overflow-hidden">
              {/* هدر */}
              <div className="flex flex-col items-center pt-3 pb-3 px-5">
                <div className="w-10 h-1 rounded-[999px] bg-fg-faint/30 mb-3" />
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h2 className="text-base font-black">🏢 ارتقا دفتر</h2>
                    <p className="text-[10px] text-fg-muted mt-0.5">دفتر بزرگتر = نیرو و محصول بیشتر</p>
                  </div>
                  <button onClick={() => setShowOfficeSheet(false)} className="p-2 rounded-xl hover:bg-surface-card text-fg-muted transition-colors"><X size={18} /></button>
                </div>
              </div>

              {/* مسیر پیشرفت */}
              <div className="px-5 py-3 max-h-[60vh] overflow-y-auto">
                <div className="relative">
                  {/* خط اتصال عمودی */}
                  <div className="absolute right-[23px] top-6 bottom-6 w-[3px] rounded-full bg-surface-inset/30" />
                  <div
                    className="absolute right-[23px] top-6 w-[3px] rounded-full bg-gradient-to-b from-emerald-500 to-indigo-500 transition-all duration-500"
                    style={{ height: `${Math.max(0, ((officeLevel - 1) / (OFFICE_TIERS.length - 1)) * 100)}%` }}
                  />

                  <div className="space-y-4 relative">
                    {OFFICE_TIERS.map((tier, index) => {
                      const isCurrent = tier.level === officeLevel;
                      const isOwned = tier.level < officeLevel;
                      const isNext = tier.level === officeLevel + 1;
                      const isLocked = tier.level > officeLevel + 1;
                      const canAfford = balance >= tier.upgradeCost;
                      const meetsLevel = biz.level >= tier.requiredBusinessLevel;
                      const prevTier = index > 0 ? OFFICE_TIERS[index - 1] : null;
                      const color = tierColors[index];

                      return (
                        <div key={tier.level} className="flex gap-4">
                          {/* نشانگر دایره‌ای */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className={`w-[18px] h-[18px] rounded-full border-[3px] mt-4 transition-all ${
                              isOwned ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                              isCurrent ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse' :
                              isNext ? 'bg-surface-card border-indigo-400/50' :
                              'bg-surface-card border-fg-faint/20'
                            }`}>
                              {isOwned && (
                                <svg className="w-full h-full text-white p-[1px]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              )}
                            </div>
                          </div>

                          {/* کارت تایر */}
                          <div className={`flex-1 rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                            isCurrent ? `${color.border} bg-gradient-to-l ${color.bg} ${color.glow}` :
                            isNext ? `border-indigo-500/40 bg-gradient-to-l ${color.bg} shadow-[0_0_25px_rgba(99,102,241,0.1)]` :
                            isOwned ? `border-line/20 bg-surface-card/30` :
                            'border-line/10 bg-surface-card/20'
                          }`}>
                            <div className={`p-3.5 ${isLocked ? 'opacity-40' : ''}`}>
                              {/* ردیف اول: آیکون + نام */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                                  isLocked ? 'bg-surface-inset/30' : color.icon
                                }`}>
                                  {isLocked ? <Lock size={18} className="text-fg-faint" /> : getOfficeName(tier.level, biz.type).icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-black">{getOfficeName(tier.level, biz.type).name}</p>
                                    {isCurrent && (
                                      <span className="text-[7px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-black tracking-wide">فعلی</span>
                                    )}
                                    {isOwned && (
                                      <span className="text-[7px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">✓</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-fg-muted font-fa">{tier.area}m²</p>
                                </div>
                              </div>

                              {/* آمار — سه ستون */}
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { icon: '👥', val: tier.maxEmployees, label: 'نیرو', diff: prevTier ? tier.maxEmployees - prevTier.maxEmployees : 0 },
                                  { icon: '🧪', val: tier.maxProducts, label: 'محصول', diff: prevTier ? tier.maxProducts - prevTier.maxProducts : 0 },
                                  { icon: '💰', val: tier.rent, label: 'اجاره', diff: 0, isCost: true },
                                ].map((stat) => (
                                  <div key={stat.label} className={`rounded-xl p-2 text-center ${
                                    isCurrent || isNext ? 'bg-black/10' : 'bg-surface-inset/20'
                                  }`}>
                                    <p className="text-[8px] text-fg-muted mb-0.5">{stat.icon} {stat.label}</p>
                                    <p className="text-base font-black font-fa">{stat.isCost ? stat.val.toLocaleString('fa-IR') : stat.val}</p>
                                    {stat.diff > 0 && !isOwned && (
                                      <p className="text-[8px] text-emerald-400 font-bold font-fa">+{stat.diff}</p>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* پیش‌نیاز سطح شرکت */}
                              {isNext && !meetsLevel && (
                                <div className="mt-3 flex items-center gap-1.5 text-[9px] text-amber-400 bg-amber-500/10 rounded-lg px-2.5 py-1.5">
                                  <Lock size={10} />
                                  <span>نیاز به سطح <span className="font-fa font-bold">{tier.requiredBusinessLevel}</span> شرکت</span>
                                </div>
                              )}

                              {/* دکمه ارتقا */}
                              {isNext && meetsLevel && (
                                <button
                                  onClick={() => { upgradeOffice(biz.id); if (canAfford) setShowOfficeSheet(false); }}
                                  disabled={!canAfford}
                                  className={`w-full mt-3 py-3 rounded-xl text-sm font-black active:scale-[0.97] transition-all flex items-center justify-center gap-2 ${
                                    canAfford
                                      ? 'bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)]'
                                      : 'bg-surface-inset/50 text-fg-faint'
                                  }`}
                                >
                                  <ArrowUpCircle size={18} />
                                  ارتقا — <span className="font-fa">{tier.upgradeCost.toLocaleString('fa-IR')}</span>
                                </button>
                              )}

                              {isLocked && (
                                <p className="text-[9px] text-fg-faint text-center mt-2 flex items-center justify-center gap-1">
                                  <Lock size={10} /> ابتدا سطح قبل را ارتقا دهید
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* فوتر */}
              <div className="px-5 py-3 border-t border-line/50 bg-surface-card/20">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fg-muted">💳 موجودی</span>
                  <span className="text-accent-money font-fa font-black text-sm">{balance.toLocaleString('fa-IR')}</span>
                </div>
              </div>
            </div>
          </div>
        </>
        );
      })()}

      {/* ==================== تب فروشگاه (سوپرمارکت) ==================== */}
      {tab === 'supermarket' && biz.type === 'supermarket' && (
        <SupermarketPanel business={biz} />
      )}

      {/* ==================== تب نیروها ==================== */}
      {tab === 'employees' && (
        <div className="space-y-3">
          {biz.employees.length > 0 && (
            <div>
              <p className="text-[10px] font-bold mb-2 text-fg-secondary">نیروهای فعلی</p>
              <div className="space-y-1.5">
                {biz.employees.map((emp) => {
                  const canUpgrade = emp.employeeLevel < emp.maxUpgradeLevel;
                  const isUpgrading = emp.upgradeStartedAt !== null && emp.upgradeEndsAt !== null;
                  const upgradeReady = isUpgrading && Date.now() >= (emp.upgradeEndsAt ?? 0);
                  const upgCost = canUpgrade ? emp.baseHireCost * Math.pow(2, emp.employeeLevel) : 0;
                  const canAffordUpg = balance >= upgCost;
                  const levelBoost = 1 + (emp.employeeLevel - 1) * 0.5;

                  // محاسبه زمان باقی‌مانده ارتقا
                  const upgradeTimeLeft = isUpgrading && !upgradeReady
                    ? Math.max(0, (emp.upgradeEndsAt ?? 0) - Date.now())
                    : 0;
                  const upgradeTotalDuration = isUpgrading
                    ? (emp.upgradeEndsAt ?? 0) - (emp.upgradeStartedAt ?? 0)
                    : 1;
                  const upgradeProgress = isUpgrading
                    ? Math.min(100, ((upgradeTotalDuration - upgradeTimeLeft) / upgradeTotalDuration) * 100)
                    : 0;
                  const upgMinsLeft = Math.floor(upgradeTimeLeft / 60000);
                  const upgSecsLeft = Math.floor((upgradeTimeLeft % 60000) / 1000);

                  // مدت زمان ارتقا (برای نمایش قبل شروع)
                  const upgradeDurationMs = canUpgrade ? getEmployeeUpgradeDuration(emp.employeeLevel) : 0;
                  const upgradeDurationMins = Math.round(upgradeDurationMs / 60000);

                  return (
                    <div key={emp.id} className={`rounded-[18px] px-3 py-2.5 border ${
                      isUpgrading
                        ? upgradeReady
                          ? 'bg-[#22C55E]/10 border-[#22C55E]/30 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                          : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30'
                        : 'bg-surface-card/60 border-line/30'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <span className="text-lg">{emp.icon}</span>
                          {isUpgrading && !upgradeReady && (
                            <span className="absolute -bottom-1 -right-1 text-[10px] animate-spin">⏳</span>
                          )}
                          {upgradeReady && (
                            <span className="absolute -bottom-1 -right-1 text-[10px] animate-bounce">✨</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate">{emp.name}</p>
                            {emp.maxUpgradeLevel > 1 && (
                              <span className="text-[8px] bg-accent-primary/15 text-accent-primary px-1.5 py-0.5 rounded-[999px] font-bold shrink-0">L{emp.employeeLevel}</span>
                            )}
                            {isUpgrading && !upgradeReady && (
                              <span className="text-[8px] bg-[#8B5CF6]/15 text-[#8B5CF6] px-1.5 py-0.5 rounded-[999px] font-bold shrink-0 animate-pulse">
                                در حال ارتقا
                              </span>
                            )}
                            {upgradeReady && (
                              <span className="text-[8px] bg-[#22C55E]/15 text-[#22C55E] px-1.5 py-0.5 rounded-[999px] font-bold shrink-0 animate-pulse">
                                آماده!
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-fg-muted">
                            {emp.role === 'production' && emp.productionBoost > 0 && (
                              <span className="text-[#22C55E]">+{Math.round(emp.productionBoost * levelBoost)} واحد/سیکل </span>
                            )}
                            {emp.role === 'sales' && emp.salesBoost > 0 && (
                              <span className="text-[#22C55E]">+{Math.round(emp.salesBoost * levelBoost)} واحد/دقیقه </span>
                            )}
                            {emp.role === 'warehouse' && emp.capacityBoost > 0 && (
                              <span className="text-[#22C55E]">+{Math.round(emp.capacityBoost * levelBoost)} ظرفیت </span>
                            )}
                            <span className="font-fa text-fg-faint">{emp.salary.toLocaleString('fa-IR')}/سیکل</span>
                          </p>
                        </div>

                        {/* دکمه‌ها */}
                        {upgradeReady ? (
                          <button
                            onClick={() => completeEmployeeUpgrade(biz.id, emp.id)}
                            className="shrink-0 bg-[#22C55E] hover:bg-emerald-400 text-white px-3 py-1.5 rounded-[999px] text-[9px] font-bold active:scale-95 transition-all shadow-[0_2px_8px_rgba(34,197,94,0.3)]"
                          >
                            ✨ تکمیل
                          </button>
                        ) : isUpgrading ? (
                          <div className="shrink-0 text-center">
                            <p className="text-[10px] font-bold text-[#8B5CF6] font-mono">
                              {upgMinsLeft}:{upgSecsLeft.toString().padStart(2, '0')}
                            </p>
                          </div>
                        ) : canUpgrade ? (
                          <button
                            onClick={() => upgradeEmployee(biz.id, emp.id)}
                            disabled={!canAffordUpg}
                            className="shrink-0 bg-[#8B5CF6] hover:bg-violet-400 disabled:opacity-40 text-white px-2.5 py-1.5 rounded-[999px] text-[9px] font-bold active:scale-95 transition-all"
                          >
                            <span>⬆ L{emp.employeeLevel + 1}</span>
                            <span className="block text-[7px] opacity-70 font-fa">{upgradeDurationMins} دقیقه</span>
                          </button>
                        ) : (
                          <span className="text-[#22C55E] text-xs shrink-0">✅</span>
                        )}
                      </div>

                      {/* نوار پیشرفت ارتقا */}
                      {isUpgrading && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${
                                upgradeReady
                                  ? 'bg-[#22C55E] animate-pulse'
                                  : 'bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]'
                              }`}
                              style={{ width: `${upgradeProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* نوار سطح (فقط وقتی ارتقا در حال انجام نیست) */}
                      {!isUpgrading && emp.maxUpgradeLevel > 1 && (
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
                          {et.role === 'production' && et.productionBoost && <span className="text-[#22C55E]">+{et.productionBoost} واحد/سیکل </span>}
                          {et.role === 'sales' && et.salesBoost && <span className="text-[#22C55E]">+{et.salesBoost} واحد/دقیقه </span>}
                          {et.role === 'warehouse' && et.capacityBoost && <span className="text-[#22C55E]">+{et.capacityBoost} ظرفیت </span>}
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
                      {prod.productionBoost > 0 && (
                        <span className="text-[#22C55E] font-bold font-fa">+{prod.productionBoost} تولید </span>
                      )}
                      {prod.capacityBoost > 0 && (
                        <span className="text-[#3B82F6] font-bold font-fa">+{prod.capacityBoost} ظرفیت</span>
                      )}
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
          {(() => {
            const isUpgrading = biz.upgradeStartedAt !== null && biz.upgradeEndsAt !== null;
            const upgradeReady = isUpgrading && Date.now() >= (biz.upgradeEndsAt ?? 0);
            const upgradeTimeLeft = isUpgrading && !upgradeReady
              ? Math.max(0, (biz.upgradeEndsAt ?? 0) - Date.now())
              : 0;
            const upgradeTotalDuration = isUpgrading
              ? (biz.upgradeEndsAt ?? 0) - (biz.upgradeStartedAt ?? 0)
              : 0;
            const upgradeProgress = upgradeTotalDuration > 0
              ? Math.min(100, ((upgradeTotalDuration - upgradeTimeLeft) / upgradeTotalDuration) * 100)
              : 0;
            const upgradeMins = Math.floor(upgradeTimeLeft / 60000);
            const upgradeSecs = Math.floor((upgradeTimeLeft % 60000) / 1000);
            const nextDuration = getBusinessUpgradeDuration(biz.level);
            const nextDurationMins = Math.round(nextDuration / 60000);

            if (biz.level >= biz.maxLevel) {
              return (
                <Button disabled fullWidth variant="upgrade">
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowUpCircle size={16} />
                    حداکثر سطح
                  </span>
                </Button>
              );
            }

            if (upgradeReady) {
              return (
                <Button onClick={() => completeBusinessUpgrade(biz.id)} fullWidth variant="upgrade">
                  <span className="flex items-center justify-center gap-1.5">
                    ✨ تکمیل ارتقا به LV {biz.level + 1}
                  </span>
                </Button>
              );
            }

            if (isUpgrading) {
              return (
                <div className="bg-nav/95 backdrop-blur-md rounded-[18px] px-4 py-3 border border-[#8B5CF6]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8B5CF6] font-bold flex items-center gap-1">
                      ⏳ در حال {vocab.upgrade} به LV {biz.level + 1}
                    </span>
                    <span className="text-[12px] font-mono font-black text-[#8B5CF6]">
                      {upgradeMins}:{upgradeSecs.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-progress-bg overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] transition-all duration-1000"
                      style={{ width: `${upgradeProgress}%` }}
                    />
                  </div>
                  {/* دکمه‌های تسریع */}
                  <div className="flex gap-2 mt-1">
                    {BOOST_ITEMS.filter((b) => b.category === 'upgrade_speed').map((item) => {
                      const canAfford = balance >= item.price;
                      return (
                        <button
                          key={item.id}
                          onClick={() => useUpgradeSpeedUp(item.id, biz.id)}
                          disabled={!canAfford}
                          className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all active:scale-95 ${
                            canAfford
                              ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                              : 'bg-surface-card/30 text-fg-faint'
                          }`}
                        >
                          {item.icon} {item.name} ({item.price.toLocaleString('fa-IR')})
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Normal state — show preview + upgrade button
            const productionDiff = nextEffectiveProduction - effectiveProduction;
            const productionPercent = effectiveProduction > 0 ? Math.round((productionDiff / effectiveProduction) * 100) : productionDiff > 0 ? 100 : 0;
            const nextUnlockPreview = template ? getNextUnlock(biz, template) : null;
            const unlockAtNext = nextUnlockPreview && nextUnlockPreview.level === biz.level + 1;
            const nextSaleRate = Math.round(biz.baseSaleRate * 1.1 * 10) / 10;
            const saleRateDiff = Math.round((nextSaleRate - biz.baseSaleRate) * 10) / 10;

            return (
              <>
                <div className="bg-nav/95 backdrop-blur-md rounded-[18px] px-3.5 py-3 border border-line-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-fg">پیش‌نمایش LV {biz.level + 1}</span>
                    <span className="text-[9px] font-bold text-fg-faint">⏱ {nextDurationMins} دقیقه</span>
                  </div>

                  {/* بهبودها */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 bg-[#22C55E]/8 rounded-lg px-2 py-1.5">
                      <span className="text-sm">📦</span>
                      <div>
                        <p className="text-[9px] text-fg-muted">تولید</p>
                        <p className="text-[10px] font-bold text-[#22C55E] font-fa">+{productionDiff} {vocab.productUnit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#3B82F6]/8 rounded-lg px-2 py-1.5">
                      <span className="text-sm">🛒</span>
                      <div>
                        <p className="text-[9px] text-fg-muted">فروش</p>
                        <p className="text-[10px] font-bold text-[#3B82F6] font-fa">+{saleRateDiff}/دقیقه</p>
                      </div>
                    </div>
                  </div>

                  {/* آنلاک در سطح بعدی */}
                  {unlockAtNext && (
                    <div className="flex items-center gap-2 bg-[#F59E0B]/8 rounded-lg px-2 py-1.5 border border-[#F59E0B]/15">
                      <span className="text-lg">{nextUnlockPreview.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-[#F59E0B] font-bold">🔓 آنلاک: {nextUnlockPreview.name}</p>
                        <p className="text-[8px] text-fg-muted">{nextUnlockPreview.description}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button onClick={() => upgradeBusiness(biz.id)} disabled={balance < biz.upgradeCost} fullWidth variant="upgrade">
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowUpCircle size={16} />
                    {vocab.upgrade} — {biz.upgradeCost.toLocaleString('fa-IR')} تومان
                  </span>
                </Button>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
