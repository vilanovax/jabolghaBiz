'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import ProductPriceCard from '@/components/market/ProductPriceCard';
import SpecialOrderCard from '@/components/market/SpecialOrderCard';
import AcceptedOrderCard from '@/components/market/AcceptedOrderCard';
import BankingTab from '@/components/market/BankingTab';
import { TrendingUp, ClipboardList, Package, Landmark } from 'lucide-react';

// کسب‌وکار تولیدکننده هر محصول
const PRODUCT_PRODUCER: Record<string, { icon: string; name: string }> = {
  'prod-1': { icon: '🌾', name: 'مزرعه' },
  'prod-2': { icon: '🏭', name: 'کارخانه' },
  'prod-3': { icon: '🏪', name: 'هایپرمارکت' },
  'prod-6': { icon: '🚛', name: 'حمل‌ونقل' },
  'prod-7': { icon: '🍽️', name: 'رستوران' },
  'prod-8': { icon: '📱', name: 'استارتاپ' },
};

type Tab = 'orders' | 'my_orders' | 'prices' | 'banking';

export default function MarketPage() {
  const products = useGameStore((s) => s.products);
  const orderBoard = useGameStore((s) => s.orderBoard);
  const banking = useGameStore((s) => s.banking);
  const businesses = useGameStore((s) => s.businesses);
  const [tab, setTab] = useState<Tab>('orders');

  // محصولاتی که کسب‌وکار من تولید می‌کند
  const myProductIds = new Set(businesses.map((b) => b.inventory.productId));

  // Sort products: hot (>20% change) first
  const sortedProducts = [...products].sort((a, b) => {
    const aChange = Math.abs((a.currentPrice - a.basePrice) / a.basePrice);
    const bChange = Math.abs((b.currentPrice - b.basePrice) / b.basePrice);
    return bChange - aChange;
  });

  const hotCount = sortedProducts.filter(
    (p) => Math.abs((p.currentPrice - p.basePrice) / p.basePrice) >= 0.2
  ).length;

  const bankingCount = banking.loans.length + banking.deposits.length;

  const tabs: { key: Tab; label: string; icon: typeof TrendingUp; count: number }[] = [
    { key: 'orders', label: 'سفارشات', icon: ClipboardList, count: orderBoard.availableOrders.length },
    { key: 'my_orders', label: 'سفارشات من', icon: Package, count: orderBoard.acceptedOrders.length },
    { key: 'prices', label: 'قیمت‌ها', icon: TrendingUp, count: products.length },
    { key: 'banking', label: 'بانک', icon: Landmark, count: bankingCount },
  ];

  const totalOrderValue = orderBoard.availableOrders.reduce((sum, o) => sum + o.totalPayment, 0);
  const urgentCount = orderBoard.availableOrders.filter(
    (o) => Math.ceil(Math.max(0, o.deadline - Date.now()) / 60000) <= 5
  ).length;

  return (
    <div className="space-y-4 py-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black">بازار</h1>
          {totalOrderValue > 0 && (
            <p className="text-[10px] text-fg-muted mt-0.5">
              <span className="font-fa font-bold text-accent-money">{totalOrderValue.toLocaleString('fa-IR')}</span> تومان سفارش فعال
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <span className="text-[10px] bg-[#EF4444]/12 text-[#EF4444] px-2 py-1 rounded-full font-black animate-warning-pulse">
              🔥 {urgentCount} فوری
            </span>
          )}
          {hotCount > 0 && (
            <span className="text-[10px] bg-[#F59E0B]/12 text-[#F59E0B] px-2 py-1 rounded-full font-black">
              📈 {hotCount} داغ
            </span>
          )}
        </div>
      </div>

      {/* تب‌ها */}
      <div className="flex bg-surface-card/50 rounded-[999px] p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-[999px] text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                tab === t.key ? 'bg-[#4F46E5] text-white shadow-[var(--shadow-glow)]' : 'text-fg-muted hover:text-fg-secondary'
              }`}
            >
              <Icon size={13} />
              {t.label}
              {t.count > 0 && (
                <span className={`text-[8px] px-1 py-0.5 rounded-full font-fa ${
                  tab === t.key ? 'bg-white/20' : 'bg-surface-card/60'
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== تابلو سفارشات ==================== */}
      {tab === 'orders' && (
        <div className="space-y-2.5">
          {orderBoard.availableOrders.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm font-bold text-fg-secondary">سفارشی نیست!</p>
              <p className="text-[10px] text-fg-muted mt-1">سفارشات جدید به‌زودی اضافه می‌شن</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] text-fg-muted">
                💡 سفارشات ویژه از شرکت‌ها — قبول کنید و از انبار تحویل دهید
              </p>
              {orderBoard.availableOrders.map((order) => (
                <SpecialOrderCard key={order.id} order={order} />
              ))}
            </>
          )}
        </div>
      )}

      {/* ==================== سفارشات من ==================== */}
      {tab === 'my_orders' && (
        <div className="space-y-2.5">
          {orderBoard.acceptedOrders.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-sm font-bold text-fg-secondary">سفارش فعالی ندارید</p>
              <p className="text-[10px] text-fg-muted mt-1">از تابلو سفارشات، یک سفارش قبول کنید</p>
            </div>
          ) : (
            <>
              {orderBoard.acceptedOrders.map((order) => (
                <AcceptedOrderCard key={order.id} order={order} />
              ))}
            </>
          )}

          {/* Completed count */}
          {orderBoard.completedOrderIds.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-[10px] text-fg-muted">
                ✅ <span className="font-fa font-bold">{orderBoard.completedOrderIds.length}</span> سفارش تکمیل شده
              </span>
              {orderBoard.failedOrderIds.length > 0 && (
                <span className="text-[10px] text-[#EF4444]">
                  ❌ <span className="font-fa font-bold">{orderBoard.failedOrderIds.length}</span> ناموفق
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== قیمت‌ها ==================== */}
      {tab === 'prices' && (
        <div className="space-y-3">
          <p className="text-[10px] text-fg-muted">
            💡 فروش بیشتر شما → عرضه بیشتر → قیمت کاهش می‌یابد
          </p>
          <div className="grid grid-cols-2 gap-2">
            {sortedProducts.map((product) => {
              const producer = PRODUCT_PRODUCER[product.id];
              const isMine = myProductIds.has(product.id);
              return (
                <ProductPriceCard
                  key={product.id}
                  product={product}
                  producerLabel={producer ? `${producer.icon} ${producer.name}` : undefined}
                  isMyProduct={isMine}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== بانک ==================== */}
      {tab === 'banking' && <BankingTab />}
    </div>
  );
}
