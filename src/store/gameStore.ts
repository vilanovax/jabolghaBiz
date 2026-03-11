import { create } from 'zustand';
import {
  PlayerProfile,
  Business,
  Product,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
  BusinessTemplate,
  PlayerStats,
  EmployeeTemplate,
} from '@/types';
import {
  mockPlayer,
  mockBusinesses,
  mockProducts,
  mockListings,
  mockLeaderboard,
  mockFridayMarket,
  businessTemplates,
} from '@/data/mock';

// محاسبه درآمد واقعی یک شرکت با احتساب بوست‌ها
export function calcEffectiveRevenue(biz: Business): number {
  let revenue = biz.baseRevenue;
  // بوست از محصولات آنلاک‌شده
  for (const p of biz.products) {
    if (p.unlocked) revenue += p.revenueBoost;
  }
  // بوست از کارمندان
  for (const e of biz.employees) {
    revenue += biz.baseRevenue * e.revenueBoost;
  }
  return Math.round(revenue);
}

// محاسبه هزینه‌های کل (حقوق + هزینه پایه)
export function calcTotalExpenses(biz: Business): number {
  const salaries = biz.employees.reduce((s, e) => s + e.salary, 0);
  return biz.expenses + salaries;
}

// آیا شرکت حسابدار دارد؟
export function hasAccountant(biz: Business): boolean {
  return biz.employees.some((e) => e.autoCollect);
}

interface GameState {
  player: PlayerProfile;
  businesses: Business[];
  products: Product[];
  listings: MarketListing[];
  leaderboard: LeaderboardEntry[];
  fridayMarket: FridayMarketItem[];
  businessTemplates: BusinessTemplate[];

  currency: string;
  setCurrency: (currency: string) => void;

  // Player
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateBalance: (amount: number) => void;

  // Business — ساخت و ارتقا
  createBusiness: (template: BusinessTemplate, customName: string) => void;
  upgradeBusiness: (businessId: string) => void;

  // Business — سیستم درآمد تایمری
  tickBusinesses: () => void;            // بروزرسانی سیکل‌ها (هر ثانیه صدا زده میشه)
  collectRevenue: (businessId: string) => void; // جمع‌آوری دستی درآمد

  // Business — استخدام و محصول
  hireEmployee: (businessId: string, template: EmployeeTemplate) => void;
  unlockProduct: (businessId: string, productId: string) => void;

  // Market
  buyListing: (listingId: string, quantity: number) => void;
  buyFridayItem: (itemId: string) => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  player: mockPlayer,
  businesses: mockBusinesses,
  products: mockProducts,
  listings: mockListings,
  leaderboard: mockLeaderboard,
  fridayMarket: mockFridayMarket,
  businessTemplates: businessTemplates,

  currency: 'تومان',
  setCurrency: (currency) => set({ currency }),

  // ==================== Player ====================

  updatePlayerStats: (stats) =>
    set((state) => ({
      player: { ...state.player, stats: { ...state.player.stats, ...stats } },
    })),

  updateBalance: (amount) =>
    set((state) => ({
      player: { ...state.player, balance: state.player.balance + amount },
    })),

  // ==================== Business — ساخت ====================

  createBusiness: (template, customName) => {
    const { player } = get();
    if (player.balance < template.startCost) return;

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      ownerId: player.id,
      name: customName || template.defaultName,
      type: template.type,
      level: 1,
      icon: template.icon,
      baseRevenue: template.baseRevenue,
      cycleDuration: template.cycleDuration,
      lastCycleAt: Date.now(),
      pendingRevenue: 0,
      maxPendingCycles: template.maxPendingCycles,
      expenses: template.baseExpenses,
      upgradeCost: Math.round(template.startCost * 1.5),
      employees: [],
      products: template.availableProducts.map((p) => ({ ...p })),
      initialEquipment: template.initialEquipment,
    };

    set((state) => ({
      businesses: [...state.businesses, newBiz],
      player: { ...state.player, balance: state.player.balance - template.startCost },
    }));
  },

  upgradeBusiness: (businessId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz || player.balance < biz.upgradeCost) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              level: b.level + 1,
              baseRevenue: Math.round(b.baseRevenue * 1.25),
              upgradeCost: Math.round(b.upgradeCost * 1.6),
            }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - biz.upgradeCost },
    }));
  },

  // ==================== Business — تایمر درآمد ====================

  tickBusinesses: () => {
    const now = Date.now();
    set((state) => {
      let balanceAdd = 0;
      const updatedBiz = state.businesses.map((biz) => {
        const elapsed = (now - biz.lastCycleAt) / 1000;
        const completedCycles = Math.floor(elapsed / biz.cycleDuration);
        if (completedCycles <= 0) return biz;

        const effectiveRevenue = calcEffectiveRevenue(biz);
        const totalExpenses = calcTotalExpenses(biz);
        const netPerCycle = Math.max(0, effectiveRevenue - totalExpenses);
        const cappedCycles = Math.min(completedCycles, biz.maxPendingCycles);
        const newPending = biz.pendingRevenue + netPerCycle * cappedCycles;
        const maxPending = netPerCycle * biz.maxPendingCycles;

        const isAuto = hasAccountant(biz);
        const actualPending = Math.min(newPending, maxPending);

        if (isAuto) {
          balanceAdd += actualPending;
          return {
            ...biz,
            lastCycleAt: biz.lastCycleAt + completedCycles * biz.cycleDuration * 1000,
            pendingRevenue: 0,
          };
        }

        return {
          ...biz,
          lastCycleAt: biz.lastCycleAt + completedCycles * biz.cycleDuration * 1000,
          pendingRevenue: actualPending,
        };
      });

      return {
        businesses: updatedBiz,
        player: balanceAdd > 0
          ? { ...state.player, balance: state.player.balance + balanceAdd }
          : state.player,
      };
    });
  },

  collectRevenue: (businessId) => {
    set((state) => {
      const biz = state.businesses.find((b) => b.id === businessId);
      if (!biz || biz.pendingRevenue <= 0) return state;

      return {
        businesses: state.businesses.map((b) =>
          b.id === businessId ? { ...b, pendingRevenue: 0 } : b
        ),
        player: {
          ...state.player,
          balance: state.player.balance + biz.pendingRevenue,
        },
      };
    });
  },

  // ==================== Business — استخدام و محصول ====================

  hireEmployee: (businessId, template) => {
    const { player } = get();
    if (player.balance < template.hireCost) return;

    set((state) => ({
      businesses: state.businesses.map((b) => {
        if (b.id !== businessId) return b;
        // جلوگیری از استخدام تکراری
        if (b.employees.some((e) => e.templateId === template.id)) return b;
        return {
          ...b,
          employees: [
            ...b.employees,
            {
              id: `he-${Date.now()}`,
              templateId: template.id,
              name: template.name,
              role: template.role,
              roleName: template.roleName,
              icon: template.icon,
              salary: template.salary,
              revenueBoost: template.revenueBoost,
              autoCollect: template.autoCollect,
              hiredAt: Date.now(),
            },
          ],
        };
      }),
      player: { ...state.player, balance: state.player.balance - template.hireCost },
    }));
  },

  unlockProduct: (businessId, productId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const prod = biz.products.find((p) => p.id === productId);
    if (!prod || prod.unlocked || player.balance < prod.unlockCost) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              products: b.products.map((p) =>
                p.id === productId ? { ...p, unlocked: true } : p
              ),
            }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - prod.unlockCost },
    }));
  },

  // ==================== Market ====================

  buyListing: (listingId, quantity) => {
    const { player, listings } = get();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing || quantity > listing.quantity) return;
    const totalCost = listing.pricePerUnit * quantity;
    if (player.balance < totalCost) return;

    set((state) => ({
      listings: state.listings
        .map((l) => (l.id === listingId ? { ...l, quantity: l.quantity - quantity } : l))
        .filter((l) => l.quantity > 0),
      player: { ...state.player, balance: state.player.balance - totalCost },
    }));
  },

  buyFridayItem: (itemId) => {
    const { player, fridayMarket } = get();
    const item = fridayMarket.find((i) => i.id === itemId);
    if (!item || !item.available || player.balance < item.price) return;

    const newStats = { ...player.stats };
    for (const [key, value] of Object.entries(item.effect)) {
      const statKey = key as keyof PlayerStats;
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value as number)));
    }

    set((state) => ({
      player: { ...state.player, balance: state.player.balance - item.price, stats: newStats },
    }));
  },

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
