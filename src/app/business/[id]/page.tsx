'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useGameStore, calcEffectiveRevenue, calcTotalExpenses, hasAccountant } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { businessTemplates } from '@/data/mock';
import {
  ArrowUpCircle, Users, Package, ChevronRight,
  Lock, Unlock, Clock, Coins,
} from 'lucide-react';
import Link from 'next/link';

type Tab = 'overview' | 'employees' | 'products';

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const biz = useGameStore((s) => s.businesses.find((b) => b.id === id));
  const balance = useGameStore((s) => s.player.balance);
  const collectRevenue = useGameStore((s) => s.collectRevenue);
  const upgradeBusiness = useGameStore((s) => s.upgradeBusiness);
  const hireEmployee = useGameStore((s) => s.hireEmployee);
  const upgradeEmployee = useGameStore((s) => s.upgradeEmployee);
  const unlockProduct = useGameStore((s) => s.unlockProduct);

  const [tab, setTab] = useState<Tab>('overview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(0);
  const [collectAnim, setCollectAnim] = useState<number | null>(null);

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
        <p className="text-zinc-400">کسب‌وکار یافت نشد</p>
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
        <Link href="/business" className="text-zinc-500 hover:text-zinc-300">
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
          <p className="text-[10px] text-zinc-500 mt-0.5">💻 {biz.initialEquipment}</p>
          <div className="flex items-center gap-2.5 text-[10px] mt-0.5">
            <span className="text-zinc-500">
              درآمد: <span className="text-emerald-400 font-fa font-bold">{effectiveRevenue.toLocaleString('fa-IR')}</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">
              هزینه: <span className="text-red-400 font-fa font-bold">{totalExpenses.toLocaleString('fa-IR')}</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">
              سود: <span className={`font-fa font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
              <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="7" />
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
              <span className="text-[8px] text-zinc-500">تا تولید بعدی</span>
            </div>
          </div>

          {/* وضعیت + دکمه */}
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-[10px] text-zinc-500">
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
              <p className="text-[10px] text-zinc-600">
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
      <div className="flex bg-zinc-800/50 rounded-xl p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ==================== تب کلی ==================== */}
      {tab === 'overview' && (
        <div className="space-y-3">
          {/* نوار پیشرفت سطح */}
          <Card className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">📊 پیشرفت سطح</p>
              <span className="text-[10px] text-zinc-400 font-fa">
                سطح {biz.level.toLocaleString('fa-IR')} از {biz.maxLevel.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
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
                <span className="text-zinc-500">مدت سیکل:</span>
                <span className="text-white font-fa">{formatDuration(biz.cycleDuration)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>📦</span>
                <span className="text-zinc-500">حداکثر انباشت:</span>
                <span className="text-white font-fa">{biz.maxPendingCycles.toLocaleString('fa-IR')} سیکل</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👥</span>
                <span className="text-zinc-500">نیرو:</span>
                <span className="text-white font-fa">{biz.employees.length}/{biz.maxEmployees}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🧪</span>
                <span className="text-zinc-500">محصولات:</span>
                <span className="text-white font-fa">{biz.products.filter((p) => p.unlocked).length}/{biz.maxProducts}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>💎</span>
                <span className="text-zinc-500">ارزش شرکت:</span>
                <span className="text-amber-400 font-fa font-bold">{companyValue.toLocaleString('fa-IR')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏆</span>
                <span className="text-zinc-500">حداکثر سطح:</span>
                <span className="text-white font-fa">{biz.maxLevel.toLocaleString('fa-IR')}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ==================== تب نیروها ==================== */}
      {tab === 'employees' && (
        <div className="space-y-3">
          {/* نیروهای فعلی */}
          {biz.employees.length > 0 && (
            <div>
              <p className="text-[10px] font-bold mb-2 text-zinc-400">نیروهای فعلی</p>
              <div className="space-y-1.5">
                {biz.employees.map((emp) => {
                  const canUpgrade = emp.employeeLevel < emp.maxUpgradeLevel;
                  const upgCost = canUpgrade ? emp.baseHireCost * Math.pow(2, emp.employeeLevel) : 0;
                  const canAffordUpg = balance >= upgCost;
                  const levelBoost = (1 + (emp.employeeLevel - 1) * 0.5);
                  const effectiveBoost = emp.revenueBoost * levelBoost;
                  return (
                    <div key={emp.id} className="bg-zinc-800/60 rounded-xl px-3 py-2.5 border border-zinc-700/30">
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
                          <p className="text-[9px] text-zinc-500">
                            {emp.revenueBoost > 0 && (
                              <span className="text-emerald-400">+{(effectiveBoost * 100).toFixed(0)}% درآمد 📈</span>
                            )}
                            {emp.autoCollect && <span className="text-emerald-400">🧮 جمع‌آوری خودکار</span>}
                            {' · '}
                            <span className="font-fa text-zinc-600">{emp.salary.toLocaleString('fa-IR')}/سیکل</span>
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
                          <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all"
                              style={{ width: `${(emp.employeeLevel / emp.maxUpgradeLevel) * 100}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-zinc-500 font-fa">{emp.employeeLevel}/{emp.maxUpgradeLevel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* درخت رشد — استخدام */}
          <p className="text-[10px] font-bold text-zinc-400">
            درخت رشد نیروها ({biz.employees.length}/{biz.maxEmployees})
          </p>
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
                      ? 'bg-zinc-900/40 border-zinc-800/30 opacity-60'
                      : 'bg-zinc-800/40 border-zinc-700/30'
                  }`}
                >
                  <span className={`text-lg ${isLocked ? 'grayscale' : ''}`}>{et.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs font-bold truncate ${isLocked ? 'text-zinc-500' : ''}`}>{et.name}</p>
                      {et.tier === 'legendary' && !isLocked && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">افسانه‌ای</span>
                      )}
                    </div>
                    <p className="text-[9px] text-zinc-500">
                      {isLocked ? (
                        <span className="text-zinc-600">🔒 سطح {et.unlockLevel.toLocaleString('fa-IR')} شرکت</span>
                      ) : (
                        <>
                          {et.revenueBoost > 0 && <span className="text-emerald-400">+{(et.revenueBoost * 100).toFixed(0)}% درآمد</span>}
                          {et.autoCollect && <span className="text-emerald-400">جمع‌آوری خودکار</span>}
                          {et.expenseReduction && <span className="text-sky-400"> · هزینه -{(et.expenseReduction * 100).toFixed(0)}%</span>}
                          {et.cycleDurationReduction && <span className="text-purple-400"> · سیکل -{(et.cycleDurationReduction * 100).toFixed(0)}%</span>}
                          {' · '}
                          <span className="font-fa text-zinc-600">{et.salary.toLocaleString('fa-IR')}/سیکل</span>
                        </>
                      )}
                    </p>
                  </div>
                  {isLocked ? (
                    <span className="text-[9px] text-zinc-600 shrink-0 flex items-center gap-0.5">
                      <Lock size={10} /> LV{et.unlockLevel}
                    </span>
                  ) : capacityFull ? (
                    <span className="text-[9px] text-zinc-500 shrink-0">ظرفیت پر</span>
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
          {biz.products.map((prod) => (
            <div key={prod.id} className="bg-zinc-800/40 rounded-xl px-3 py-3 border border-zinc-700/30 space-y-2">
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
                      <Lock size={10} className="text-zinc-600" />
                    )}
                  </div>
                  <p className="text-[9px] text-zinc-500">{prod.description}</p>
                  <p className="text-[10px] mt-0.5">
                    <span className="text-zinc-500">درآمد محصول: </span>
                    <span className="text-emerald-400 font-bold font-fa">+{prod.revenueBoost.toLocaleString('fa-IR')}</span>
                    <span className="text-zinc-500"> تومان/سیکل</span>
                  </p>
                </div>
              </div>
              {!prod.unlocked && (
                <button
                  onClick={() => unlockProduct(biz.id, prod.id)}
                  disabled={balance < prod.unlockCost}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all"
                >
                  آنلاک — <span className="font-fa">{prod.unlockCost.toLocaleString('fa-IR')}</span> تومان
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* دکمه ارتقا — ثابت پایین صفحه با پیش‌نمایش */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
        <div className="max-w-lg mx-auto space-y-1.5">
          {/* پیش‌نمایش ارتقا */}
          {biz.level < biz.maxLevel && (
            <div className="bg-zinc-900/95 backdrop-blur-md rounded-xl px-3 py-2 border border-zinc-700/50 flex items-center justify-between text-[10px]">
              <span className="text-zinc-400">سطح {biz.level + 1}:</span>
              <span className="text-zinc-500">
                سود{' '}
                <span className="text-zinc-400 font-fa">{netProfit.toLocaleString('fa-IR')}</span>
                <span className="text-zinc-600 mx-1">→</span>
                <span className="text-emerald-400 font-fa font-bold">{nextNetProfit.toLocaleString('fa-IR')}</span>
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">
                ارتقای بعد{' '}
                <span className="text-amber-400 font-fa">{nextUpgradeCost.toLocaleString('fa-IR')}</span>
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
