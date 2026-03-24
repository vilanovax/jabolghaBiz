'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Button from '@/components/ui/Button';
import { SHELF_PRODUCTS, SUPERMARKET_TIERS, SUPERMARKET_CONFIG, getSupermarketTier } from '@/data/mock';
import { Business, ShelfProduct, ShelfSlot, SupermarketOrder } from '@/types';
import { Package, ShoppingCart, Timer, Zap, X, Check, AlertTriangle, Plus } from 'lucide-react';

interface Props {
  business: Business;
}

// تایمر تحویل کالا به قفسه
function ShelfDeliveryTimer({ endsAt, qty }: { endsAt: number; qty: number }) {
  const [secs, setSecs] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const total = 15; // 15 seconds delivery
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setSecs(left);
      setPct(Math.min(100, ((total - left) / total) * 100));
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [endsAt]);

  return (
    <div className="w-full rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 py-2 px-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold text-[#F59E0B]">🚚 در حال تحویل ({qty} عدد)</span>
        <span className="text-[10px] font-black font-fa text-[#F59E0B]">{secs}ث</span>
      </div>
      <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden">
        <div className="h-full rounded-full bg-[#F59E0B] transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ===== رنگ‌بندی کتگوری محصول =====
const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  essential: { label: 'ضروری', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  fresh:     { label: 'تازه', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  luxury:    { label: 'لوکس', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  household: { label: 'خانگی', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

// ===== کارت قفسه — بازنویسی گیمی =====
function ShelfCard({
  shelf,
  business,
  index,
  onStock,
  onClear,
}: {
  shelf: ShelfSlot;
  business: Business;
  index: number;
  onStock: (shelfId: string, productId: string, qty: number) => void;
  onClear: (shelfId: string) => void;
}) {
  const balance = useGameStore((s) => s.player.balance);
  const [showPicker, setShowPicker] = useState(false);
  const tier = getSupermarketTier(business.level);
  const product = shelf.productId ? SHELF_PRODUCTS.find((p) => p.id === shelf.productId) : null;
  const availableProducts = SHELF_PRODUCTS.filter((p) => p.unlockTier <= tier.tier);

  const fillPct = shelf.maxCapacity > 0 ? Math.round((shelf.quantity / shelf.maxCapacity) * 100) : 0;
  const fillColor = fillPct < 20 ? '#EF4444' : fillPct < 50 ? '#F59E0B' : '#22C55E';

  if (product) {
    const profitPerUnit = product.sellPrice - product.buyPrice;
    const profitPerMin = Math.round(profitPerUnit * product.salesSpeed);
    const cat = CATEGORY_CONFIG[product.category] ?? CATEGORY_CONFIG.essential;
    const fillCost = Math.round((shelf.maxCapacity - shelf.quantity) * product.buyPrice);
    const canAffordFill = balance >= fillCost && fillCost > 0;

    return (
      <div className="rounded-[18px] border border-line-subtle overflow-hidden bg-surface-card/40">
        {/* هدر — نام + کتگوری */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-2xl" style={{ background: cat.bg }}>
              {product.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-black truncate">{product.name}</p>
                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
              </div>
              <p className="text-[9px] text-fg-muted mt-0.5">
                💰 <span className="font-bold text-[#22C55E]">+{profitPerMin.toLocaleString('fa-IR')}</span> تومان/دقیقه
              </p>
            </div>
            <button onClick={() => onClear(shelf.id)} className="p-1 rounded-lg hover:bg-surface-card text-fg-faint">
              <X size={12} />
            </button>
          </div>
        </div>

        {/* نوار موجودی — بزرگ و واضح */}
        <div className="px-3 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] text-fg-faint">موجودی قفسه</span>
            <span className="text-[9px] font-black font-fa" style={{ color: fillColor }}>
              {shelf.quantity}/{shelf.maxCapacity}
            </span>
          </div>
          <div className="h-3 rounded-full bg-progress-bg overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${fillPct}%`, backgroundColor: fillColor }}
            />
          </div>
          {fillPct < 20 && (
            <p className="text-[8px] text-[#EF4444] font-bold mt-0.5">⚠️ داره تموم میشه!</p>
          )}
        </div>

        {/* دکمه پر کردن / تایمر تحویل */}
        <div className="px-3 pb-3">
          {shelf.incomingAt && shelf.incomingAt > Date.now() ? (
            <ShelfDeliveryTimer endsAt={shelf.incomingAt} qty={shelf.incomingQty} />
          ) : (
            <button
              onClick={() => onStock(shelf.id, product.id, shelf.maxCapacity - shelf.quantity)}
              disabled={!canAffordFill || shelf.quantity >= shelf.maxCapacity}
              className={`w-full py-2 rounded-xl text-[10px] font-bold transition-all active:scale-[0.97] ${
                canAffordFill && shelf.quantity < shelf.maxCapacity
                  ? 'bg-[#4F46E5] text-white'
                  : 'bg-surface-card text-fg-faint'
              }`}
            >
              {shelf.quantity >= shelf.maxCapacity
                ? '✅ پره'
                : `🚚 سفارش کالا (${fillCost.toLocaleString('fa-IR')} ت)`}
            </button>
          )}
        </div>

        {/* آمار پایین */}
        <div className="px-3 py-2 border-t border-line-subtle/20 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.02)' }}>
          <span className="text-[8px] text-fg-faint">سود هر واحد: <span className="font-bold text-[#22C55E] font-fa">{profitPerUnit}</span></span>
          <span className="text-[8px] text-fg-faint">سرعت فروش: <span className="font-bold font-fa">{product.salesSpeed}/min</span></span>
        </div>
      </div>
    );
  }

  // قفسه خالی
  return (
    <div className="rounded-[18px] border border-dashed border-line-subtle/50 bg-surface-card/20">
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full py-8 flex flex-col items-center gap-2 text-fg-faint hover:text-fg-muted transition-colors"
        >
          <div className="w-12 h-12 rounded-[14px] bg-surface-card/60 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-bold">قفسه {index + 1} — انتخاب کالا</span>
        </button>
      ) : (
        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-fg-secondary">انتخاب کالا</span>
            <button onClick={() => setShowPicker(false)} className="text-[9px] text-fg-faint">✕ بستن</button>
          </div>
          {availableProducts.map((p) => {
            const profit = p.sellPrice - p.buyPrice;
            const profitMin = Math.round(profit * p.salesSpeed);
            const cat = CATEGORY_CONFIG[p.category] ?? CATEGORY_CONFIG.essential;
            const cost = Math.round(10 * p.buyPrice);
            const canAfford = balance >= cost;
            return (
              <button
                key={p.id}
                onClick={() => { onStock(shelf.id, p.id, 10); setShowPicker(false); }}
                disabled={!canAfford}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-[14px] border text-right transition-all active:scale-[0.98] ${
                  canAfford ? 'border-line-subtle bg-surface-card/40' : 'border-line-subtle/30 opacity-40'
                }`}
              >
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xl" style={{ background: cat.bg }}>
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold truncate">{p.name}</p>
                    <span className="text-[7px] font-bold px-1 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
                  </div>
                  <p className="text-[8px] text-fg-muted mt-0.5">
                    💰 <span className="text-[#22C55E] font-bold">+{profitMin.toLocaleString('fa-IR')}</span> ت/min
                    <span className="text-fg-faint mr-2">• سود {profit}/واحد</span>
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <p className="text-[9px] font-bold font-fa text-fg-secondary">{cost.toLocaleString('fa-IR')}</p>
                  <p className="text-[7px] text-fg-faint">۱۰ عدد</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== سفارش ویژه — با نمایش موجودی =====
function OrderCard({ order, shelves, onAccept }: { order: SupermarketOrder; shelves: ShelfSlot[]; onAccept: () => void }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, order.deadline - Date.now());
      const min = Math.floor(left / 60000);
      const sec = Math.floor((left % 60000) / 1000);
      setTimeLeft(`${min}:${sec.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [order.deadline]);

  const isExpired = Date.now() > order.deadline;

  // بررسی موجودی هر آیتم سفارش
  const itemStatuses = order.requiredProducts.map((req) => {
    const product = SHELF_PRODUCTS.find((p) => p.id === req.productId);
    const onShelf = shelves
      .filter((s) => s.productId === req.productId)
      .reduce((sum, s) => sum + s.quantity, 0);
    const enough = onShelf >= req.quantity;
    const missing = Math.max(0, req.quantity - onShelf);
    return { req, product, onShelf, enough, missing };
  });
  const allReady = itemStatuses.every((s) => s.enough);

  return (
    <div className={`rounded-[18px] border overflow-hidden ${
      order.completed ? 'border-[#22C55E]/30 bg-[#22C55E]/5'
        : order.failed || isExpired ? 'border-[#EF4444]/30 opacity-50'
        : allReady ? 'border-[#22C55E]/30 bg-[#22C55E]/5'
        : 'border-[#F59E0B]/30 bg-[#F59E0B]/5'
    }`}>
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{order.icon}</span>
            <div>
              <p className="text-[12px] font-black">{order.title}</p>
              <span className="text-[8px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-full inline-flex items-center gap-0.5">
                <Zap size={8} /> سود ×{order.bonusMultiplier}
              </span>
            </div>
          </div>
          {order.completed ? (
            <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/15 px-2 py-1 rounded-full flex items-center gap-0.5"><Check size={10} /> تکمیل شد</span>
          ) : order.failed || isExpired ? (
            <span className="text-[9px] font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-1 rounded-full flex items-center gap-0.5"><AlertTriangle size={10} /> منقضی</span>
          ) : (
            <div className="text-center">
              <p className="text-[13px] font-black font-fa text-[#F59E0B]">⏱ {timeLeft}</p>
              <p className="text-[7px] text-fg-faint">باقی‌مانده</p>
            </div>
          )}
        </div>

        {/* لیست کالاها — با وضعیت موجودی */}
        <div className="space-y-1.5">
          {itemStatuses.map(({ req, product, onShelf, enough, missing }) => {
            const pct = req.quantity > 0 ? Math.min(100, Math.round((onShelf / req.quantity) * 100)) : 0;
            return (
              <div key={req.productId} className="rounded-[12px] bg-surface-card/50 px-2.5 py-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{product?.icon}</span>
                    <span className="text-[10px] font-bold">{product?.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black font-fa ${enough ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {onShelf}/{req.quantity}
                    </span>
                    {enough ? (
                      <span className="text-[8px]">✅</span>
                    ) : (
                      <span className="text-[8px] text-[#EF4444] font-bold">کم: {missing}</span>
                    )}
                  </div>
                </div>
                {/* نوار پیشرفت */}
                <div className="h-1.5 rounded-full bg-progress-bg overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: enough ? '#22C55E' : pct > 50 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* فوتر — دکمه اکشن */}
      {!order.completed && !order.failed && !isExpired && (
        <div className="px-3.5 py-2.5 border-t border-line-subtle/20 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.02)' }}>
          {allReady ? (
            <>
              <span className="text-[9px] text-[#22C55E] font-bold">✅ همه کالاها آماده‌ست!</span>
              {!order.accepted ? (
                <button onClick={onAccept} className="bg-[#22C55E] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold active:scale-95 transition-all">
                  تحویل سفارش
                </button>
              ) : (
                <span className="text-[9px] text-[#22C55E] animate-pulse font-bold">در حال تحویل...</span>
              )}
            </>
          ) : (
            <>
              <span className="text-[9px] text-[#F59E0B] font-bold">📦 کالاها رو رو قفسه بذار</span>
              {!order.accepted && (
                <button onClick={onAccept} className="bg-[#F59E0B] text-white px-3 py-1.5 rounded-xl text-[10px] font-bold active:scale-95 transition-all">
                  قبول سفارش
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ===== پنل اصلی سوپرمارکت =====
export default function SupermarketPanel({ business }: Props) {
  const {
    supermarketStates,
    initSupermarketState,
    stockShelf,
    clearShelf,
    tickSupermarket,
    acceptSupermarketOrder,
  } = useGameStore();

  const smState = supermarketStates[business.id];

  useEffect(() => {
    initSupermarketState(business.id);
  }, [business.id, initSupermarketState]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickSupermarket(business.id);
    }, SUPERMARKET_CONFIG.customerTickInterval * 1000);
    return () => clearInterval(interval);
  }, [business.id, tickSupermarket]);

  if (!smState) return null;

  const tier = getSupermarketTier(business.level);
  const nextTier = SUPERMARKET_TIERS.find((t) => t.tier === tier.tier + 1);
  const activeOrders = smState.activeOrders.filter((o) => !o.completed && !o.failed);
  const activeBoosts = smState.boosts.filter((b) => b.expiresAt > Date.now());

  // درآمد خالص قفسه‌ها (تقریبی در دقیقه)
  const shelfIncomePerMin = smState.shelves.reduce((sum, shelf) => {
    if (!shelf.productId || shelf.quantity === 0) return sum;
    const p = SHELF_PRODUCTS.find((sp) => sp.id === shelf.productId);
    if (!p) return sum;
    return sum + Math.round((p.sellPrice - p.buyPrice) * p.salesSpeed);
  }, 0);

  return (
    <div className="space-y-4">

      {/* ═══ هدر تایر ═══ */}
      <div className="rounded-[20px] border border-line-subtle overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), transparent)' }}>
          <div className="w-12 h-12 rounded-[16px] bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-2xl">
            {tier.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black">{tier.name}</h3>
              <span className="text-[8px] font-bold bg-[#6366F1]/15 text-[#6366F1] px-1.5 py-0.5 rounded-full">تایر {tier.tier}</span>
            </div>
            {nextTier && (
              <p className="text-[9px] text-fg-muted mt-0.5">
                بعدی: {nextTier.icon} {nextTier.name} — سطح {nextTier.requiredLevel}
              </p>
            )}
          </div>
        </div>
        <div className="px-4 py-2 border-t border-line-subtle/30 flex flex-wrap gap-1.5">
          {tier.features.map((f, i) => (
            <span key={i} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-surface-card/60 text-fg-muted">{f}</span>
          ))}
        </div>
      </div>

      {/* ═══ آمار — ساده و واضح ═══ */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-[14px] bg-[#3B82F6]/8 p-2.5 text-center">
          <p className="text-xl font-black font-fa text-[#3B82F6]">{smState.customersInStore}</p>
          <p className="text-[8px] text-fg-muted mt-0.5">👥 مشتری الان</p>
        </div>
        <div className="rounded-[14px] bg-[#22C55E]/8 p-2.5 text-center">
          <p className="text-xl font-black font-fa text-[#22C55E]">{shelfIncomePerMin > 0 ? `+${shelfIncomePerMin.toLocaleString('fa-IR')}` : '۰'}</p>
          <p className="text-[8px] text-fg-muted mt-0.5">💰 تومان/دقیقه</p>
        </div>
        <div className="rounded-[14px] bg-[#F59E0B]/8 p-2.5 text-center">
          <p className="text-xl font-black font-fa text-[#F59E0B]">{smState.totalShelfRevenue.toLocaleString('fa-IR')}</p>
          <p className="text-[8px] text-fg-muted mt-0.5">📊 کل درآمد</p>
        </div>
      </div>

      {/* ═══ بوست‌ فعال ═══ */}
      {activeBoosts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeBoosts.map((boost, i) => (
            <span key={i} className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center gap-1 animate-pulse">
              <Zap size={10} /> {boost.label}
            </span>
          ))}
        </div>
      )}

      {/* ═══ صندوق‌ها ═══ */}
      <div>
        <p className="text-[10px] font-bold text-fg-secondary mb-2 flex items-center gap-1.5">
          <ShoppingCart size={13} /> صندوق‌ها
          <span className="text-fg-faint font-fa">{smState.checkouts.filter((c) => c.unlocked).length}/{tier.checkoutLanes}</span>
        </p>
        <div className="flex gap-2">
          {smState.checkouts.map((checkout) => (
            <div
              key={checkout.id}
              className={`flex-1 rounded-[14px] border p-2.5 text-center ${
                checkout.unlocked
                  ? 'border-[#22C55E]/25 bg-[#22C55E]/5'
                  : 'border-line-subtle/30 opacity-30'
              }`}
            >
              <span className="text-xl">{checkout.unlocked ? '💳' : '🔒'}</span>
              {checkout.unlocked ? (
                <p className="text-[9px] font-bold text-[#22C55E] mt-1">{checkout.speed} مشتری/min</p>
              ) : (
                <p className="text-[8px] text-fg-faint mt-1">قفل</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ قفسه‌ها — بخش اصلی ═══ */}
      <div>
        <p className="text-[10px] font-bold text-fg-secondary mb-2 flex items-center gap-1.5">
          <Package size={13} /> قفسه‌ها
          <span className="text-fg-faint font-fa">{smState.shelves.filter(s => s.productId).length}/{smState.shelves.length} پر</span>
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {smState.shelves.map((shelf, i) => (
            <ShelfCard
              key={shelf.id}
              shelf={shelf}
              business={business}
              index={i}
              onStock={(...args) => stockShelf(business.id, ...args)}
              onClear={(shelfId) => clearShelf(business.id, shelfId)}
            />
          ))}
        </div>
      </div>

      {/* ═══ سفارش‌های ویژه ═══ */}
      {tier.tier >= 3 && (
        <div>
          <p className="text-[10px] font-bold text-fg-secondary mb-2 flex items-center gap-1.5">
            <Timer size={13} /> سفارش‌های ویژه
            {activeOrders.length > 0 && (
              <span className="text-[8px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-full font-bold">{activeOrders.length} فعال</span>
            )}
          </p>
          {smState.activeOrders.length > 0 ? (
            <div className="space-y-2">
              {smState.activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} shelves={smState.shelves} onAccept={() => acceptSupermarketOrder(business.id, order.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-[16px] border border-dashed border-line-subtle/40 py-6 text-center">
              <p className="text-2xl mb-1">📋</p>
              <p className="text-[10px] text-fg-muted font-bold">هنوز سفارشی نیومده</p>
              <p className="text-[8px] text-fg-faint">کالا بذار رو قفسه تا سفارش بیاد</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ تایرهای آینده ═══ */}
      {nextTier && (
        <div className="rounded-[16px] border border-line-subtle/30 p-3 opacity-60">
          <p className="text-[10px] font-bold text-fg-secondary mb-2">🔮 قابلیت‌های آینده</p>
          <div className="space-y-1.5">
            {SUPERMARKET_TIERS.filter((t) => t.tier > tier.tier).slice(0, 2).map((t) => (
              <div key={t.tier} className="flex items-center gap-2">
                <span className="text-lg">{t.icon}</span>
                <div>
                  <p className="text-[10px] font-bold">{t.name} <span className="text-fg-faint font-fa">(سطح {t.requiredLevel})</span></p>
                  <p className="text-[8px] text-fg-faint">{t.features.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
