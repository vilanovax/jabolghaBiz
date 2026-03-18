'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { SHELF_PRODUCTS, SUPERMARKET_TIERS, SUPERMARKET_CONFIG, getSupermarketTier } from '@/data/mock';
import { Business, ShelfProduct, ShelfSlot, SupermarketOrder } from '@/types';
import { Package, ShoppingCart, Timer, Zap, X, ChevronDown, ChevronUp, Check, AlertTriangle } from 'lucide-react';

interface Props {
  business: Business;
}

// ===== شلف (قفسه) =====
function ShelfCard({
  shelf,
  business,
  onStock,
  onClear,
}: {
  shelf: ShelfSlot;
  business: Business;
  onStock: (shelfId: string, productId: string, qty: number) => void;
  onClear: (shelfId: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [stockQty, setStockQty] = useState(10);
  const tier = getSupermarketTier(business.level);
  const product = shelf.productId ? SHELF_PRODUCTS.find((p) => p.id === shelf.productId) : null;
  const availableProducts = SHELF_PRODUCTS.filter((p) => p.unlockTier <= tier.tier);

  const fillPercent = shelf.maxCapacity > 0 ? Math.round((shelf.quantity / shelf.maxCapacity) * 100) : 0;

  return (
    <Card className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-60">قفسه {shelf.id.replace('shelf-', '')}</span>
        {product && shelf.quantity > 0 && (
          <button onClick={() => onClear(shelf.id)} className="text-xs opacity-40 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {product ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{product.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{product.name}</p>
              <p className="text-[10px] opacity-50">{product.description}</p>
            </div>
          </div>

          {/* موجودی */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] mb-0.5">
              <span>{shelf.quantity} / {shelf.maxCapacity}</span>
              <span>{fillPercent}%</span>
            </div>
            <ProgressBar
              value={shelf.quantity}
              max={shelf.maxCapacity}
              color={fillPercent < 20 ? 'muted' : fillPercent < 50 ? 'gold' : 'profit'}
            />
          </div>

          {/* آمار */}
          <div className="grid grid-cols-2 gap-1 text-[10px] mb-2">
            <div className="flex items-center gap-1">
              <span className="opacity-50">💰 سود:</span>
              <span className="font-bold text-green-400">{product.sellPrice - product.buyPrice}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="opacity-50">⚡ سرعت:</span>
              <span className="font-bold">{product.salesSpeed}/دقیقه</span>
            </div>
          </div>

          {/* پر کردن */}
          <div className="flex items-center gap-1.5">
            <select
              value={stockQty}
              onChange={(e) => setStockQty(Number(e.target.value))}
              className="flex-1 text-xs rounded-md px-1.5 py-1 bg-[var(--surface-elevated)] border border-[var(--line-subtle)]"
            >
              <option value={5}>5 عدد</option>
              <option value={10}>10 عدد</option>
              <option value={20}>20 عدد</option>
              <option value={30}>پر کردن</option>
            </select>
            <Button
              size="sm"
              onClick={() => {
                const qty = stockQty >= 30 ? shelf.maxCapacity - shelf.quantity : stockQty;
                onStock(shelf.id, product.id, qty);
              }}
              disabled={shelf.quantity >= shelf.maxCapacity}
            >
              <Package className="w-3 h-3 ml-0.5" />
              پر کن
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* قفسه خالی — انتخاب کالا */}
          {!showPicker ? (
            <button
              onClick={() => setShowPicker(true)}
              className="w-full py-6 flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity"
            >
              <Package className="w-8 h-8" />
              <span className="text-xs">انتخاب کالا</span>
            </button>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <button
                onClick={() => setShowPicker(false)}
                className="text-[10px] opacity-50 hover:opacity-80 flex items-center gap-0.5"
              >
                <ChevronUp className="w-3 h-3" /> بستن
              </button>
              {availableProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onStock(shelf.id, p.id, 10);
                    setShowPicker(false);
                  }}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors text-right"
                >
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[9px] opacity-50">
                      سود {p.sellPrice - p.buyPrice} · {p.salesSpeed}/دقیقه
                    </p>
                  </div>
                  <span className="text-[9px] opacity-40">T{p.unlockTier}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ===== سفارش ویژه =====
function OrderCard({
  order,
  onAccept,
}: {
  order: SupermarketOrder;
  onAccept: () => void;
}) {
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

  return (
    <Card className={`${order.completed ? 'border-green-500/30' : order.failed || isExpired ? 'border-red-500/30 opacity-60' : 'border-yellow-500/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{order.icon}</span>
          <span className="text-sm font-bold">{order.title}</span>
        </div>
        {order.completed ? (
          <span className="text-[10px] text-green-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> تکمیل</span>
        ) : order.failed || isExpired ? (
          <span className="text-[10px] text-red-400 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> منقضی</span>
        ) : (
          <span className="text-[10px] flex items-center gap-0.5 text-yellow-400">
            <Timer className="w-3 h-3" /> {timeLeft}
          </span>
        )}
      </div>

      {/* محصولات مورد نیاز */}
      <div className="space-y-1 mb-2">
        {order.requiredProducts.map((req) => {
          const product = SHELF_PRODUCTS.find((p) => p.id === req.productId);
          return (
            <div key={req.productId} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span>{product?.icon}</span>
                <span>{product?.name}</span>
              </div>
              <span className="font-mono">{req.quantity} عدد</span>
            </div>
          );
        })}
      </div>

      {/* پاداش */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] flex items-center gap-0.5 text-emerald-400">
          <Zap className="w-3 h-3" />
          ×{order.bonusMultiplier} سود
        </span>
        {!order.accepted && !order.completed && !order.failed && !isExpired && (
          <Button size="sm" variant="primary" onClick={onAccept}>
            قبول سفارش
          </Button>
        )}
        {order.accepted && !order.completed && !order.failed && (
          <span className="text-[10px] opacity-50">در حال انجام...</span>
        )}
      </div>
    </Card>
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

  const currency = useGameStore((s) => s.currency);
  const smState = supermarketStates[business.id];

  // مقداردهی اولیه + tick
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
  const completedOrders = smState.activeOrders.filter((o) => o.completed);
  const activeBoosts = smState.boosts.filter((b) => b.expiresAt > Date.now());

  return (
    <div className="space-y-4">
      {/* === هدر تایر === */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tier.icon}</span>
            <div>
              <h3 className="text-sm font-bold">{tier.name}</h3>
              <p className="text-[10px] opacity-50">تایر {tier.tier} از ۵</p>
            </div>
          </div>
          {nextTier && (
            <div className="text-left text-[10px]">
              <p className="opacity-50">بعدی: {nextTier.icon} {nextTier.name}</p>
              <p className="opacity-40">سطح {nextTier.requiredLevel}</p>
            </div>
          )}
        </div>

        {/* قابلیت‌های فعلی */}
        <div className="flex flex-wrap gap-1">
          {tier.features.map((f, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-elevated)] opacity-70">
              {f}
            </span>
          ))}
        </div>
      </Card>

      {/* === آمار لحظه‌ای === */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="text-center py-2">
          <p className="text-lg font-bold">{smState.customersInStore}</p>
          <p className="text-[10px] opacity-50">👥 مشتری</p>
        </Card>
        <Card className="text-center py-2">
          <p className="text-lg font-bold">{smState.totalShelfProductsSold.toLocaleString('fa-IR')}</p>
          <p className="text-[10px] opacity-50">📦 فروش کل</p>
        </Card>
        <Card className="text-center py-2">
          <p className="text-lg font-bold text-emerald-400">{smState.totalShelfRevenue.toLocaleString('fa-IR')}</p>
          <p className="text-[10px] opacity-50">💰 درآمد</p>
        </Card>
      </div>

      {/* === بوست‌های فعال === */}
      {activeBoosts.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeBoosts.map((boost, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-400 flex items-center gap-1 animate-pulse"
            >
              <Zap className="w-3 h-3" />
              {boost.label}
            </span>
          ))}
        </div>
      )}

      {/* === صندوق‌ها === */}
      <Card>
        <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
          <ShoppingCart className="w-3.5 h-3.5" />
          صندوق‌ها ({smState.checkouts.filter((c) => c.unlocked).length}/{tier.checkoutLanes})
        </h4>
        <div className="flex gap-2">
          {smState.checkouts.map((checkout) => (
            <div
              key={checkout.id}
              className={`flex-1 text-center py-2 rounded-lg border ${
                checkout.unlocked
                  ? 'border-green-500/20 bg-green-500/5'
                  : 'border-[var(--line-subtle)] opacity-30'
              }`}
            >
              <span className="text-lg">💳</span>
              <p className="text-[10px] mt-0.5">
                {checkout.unlocked ? `${checkout.speed}/دقیقه` : '🔒'}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* === قفسه‌ها === */}
      <div>
        <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          قفسه‌ها ({smState.shelves.length})
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {smState.shelves.map((shelf) => (
            <ShelfCard
              key={shelf.id}
              shelf={shelf}
              business={business}
              onStock={(...args) => stockShelf(business.id, ...args)}
              onClear={(shelfId) => clearShelf(business.id, shelfId)}
            />
          ))}
        </div>
      </div>

      {/* === سفارش‌های ویژه === */}
      {tier.tier >= 3 && (
        <div>
          <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5" />
            سفارش‌های ویژه
            {activeOrders.length > 0 && (
              <span className="text-[10px] text-yellow-400">({activeOrders.length} فعال)</span>
            )}
          </h4>
          {smState.activeOrders.length > 0 ? (
            <div className="space-y-2">
              {smState.activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => acceptSupermarketOrder(business.id, order.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-4 opacity-40">
              <p className="text-xs">هنوز سفارشی نیومده...</p>
              <p className="text-[10px]">کالا بذار رو قفسه تا سفارش بیاد</p>
            </Card>
          )}
        </div>
      )}

      {/* === تایرهای آینده === */}
      {nextTier && (
        <Card className="opacity-60">
          <h4 className="text-xs font-bold mb-1.5">🔮 قابلیت‌های آینده</h4>
          <div className="space-y-1">
            {SUPERMARKET_TIERS.filter((t) => t.tier > tier.tier).slice(0, 2).map((t) => (
              <div key={t.tier} className="flex items-center gap-2 text-[10px]">
                <span>{t.icon}</span>
                <span className="font-medium">{t.name} (سطح {t.requiredLevel})</span>
                <span className="opacity-40">— {t.features.join(' · ')}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
