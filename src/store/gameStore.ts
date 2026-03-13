import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  NewsArticle,
  OfficeTier,
  DailyBonusState,
  RushHourState,
} from '@/types';
import {
  mockPlayer,
  mockBusinesses,
  mockProducts,
  mockListings,
  mockLeaderboard,
  mockFridayMarket,
  businessTemplates,
  mockNews,
  getOfficeTier,
  OFFICE_TIERS,
  DAILY_BONUS_REWARDS,
  RUSH_HOUR,
} from '@/data/mock';

// ==================== Helper Functions ====================

// محاسبه درآمد واقعی — ضریب کارمندان (با سطح نیرو) با سقف 3.5x + بوست مطلق محصولات
export function calcEffectiveRevenue(biz: Business): number {
  // بوست هر نیرو بر اساس سطح: L1=base, L2=+50%, L3=+100%
  const staffBoostSum = biz.employees.reduce((sum, e) => {
    const levelMultiplier = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
    return sum + e.revenueBoost * levelMultiplier;
  }, 0);
  const staffMultiplier = Math.min(1 + staffBoostSum, 3.5); // حداکثر ۲۵۰٪ بوست
  // محصولات با سطح شرکت رشد می‌کنند: baseBoost × (1 + level × 0.1)
  const productBoost = biz.products
    .filter((p) => p.unlocked)
    .reduce((sum, p) => sum + Math.round(p.revenueBoost * (1 + biz.level * 0.1)), 0);
  // بونوس سطح سازمانی (Enterprise) — سطح ۲۰: +۲۰٪ تولید
  const enterpriseMultiplier = biz.level >= 20 ? 1.2 : 1.0;
  return Math.round(biz.baseRevenue * staffMultiplier * enterpriseMultiplier) + productBoost;
}

// محاسبه هزینه‌های کل (حقوق + هزینه پایه + اجاره دفتر)
export function calcTotalExpenses(biz: Business): number {
  const salaries = biz.employees.reduce((s, e) => s + e.salary, 0);
  const officeTier = getOfficeTier(biz.officeLevel ?? 1);
  return biz.expenses + salaries + officeTier.rent;
}

// آیا شرکت حسابدار دارد؟
export function hasAccountant(biz: Business): boolean {
  return biz.employees.some((e) => e.autoCollect);
}

// ارزش امپراتوری = موجودی + مجموع (درآمد پایه × سطح × ۱۰)
export function calcEmpireValue(player: PlayerProfile, businesses: Business[]): number {
  const businessesValue = businesses.reduce((sum, b) => sum + b.baseRevenue * b.level * 10, 0);
  return player.balance + businessesValue;
}

// ==================== Next Unlock Helper ====================

export type UnlockType = 'employee' | 'product' | 'office' | 'enterprise';

export interface NextUnlock {
  type: UnlockType;
  level: number;         // سطح مورد نیاز
  name: string;          // نام آیتم
  icon: string;
  description: string;
}

/**
 * پیدا کردن آنلاک بعدی شرکت بر اساس سطح فعلی
 * بررسی نیروها، محصولات، دفتر و سطح enterprise
 */
export function getNextUnlock(biz: Business, template: BusinessTemplate): NextUnlock | null {
  const currentLevel = biz.level;
  const candidates: NextUnlock[] = [];

  // نیروهای قابل آنلاک (استخدام نشده + سطح بالاتر از فعلی)
  for (const emp of template.availableEmployees) {
    const alreadyHired = biz.employees.some((e) => e.templateId === emp.id);
    if (!alreadyHired && emp.unlockLevel > currentLevel) {
      candidates.push({
        type: 'employee',
        level: emp.unlockLevel,
        name: emp.name,
        icon: emp.icon,
        description: emp.description,
      });
    }
  }

  // محصولات قابل آنلاک
  for (const prod of biz.products) {
    if (!prod.unlocked && prod.requirements?.businessLevel && prod.requirements.businessLevel > currentLevel) {
      candidates.push({
        type: 'product',
        level: prod.requirements.businessLevel,
        name: prod.name,
        icon: prod.icon,
        description: prod.description,
      });
    }
  }

  // ارتقا دفتر
  const officeLevel = biz.officeLevel ?? 1;
  if (officeLevel < OFFICE_TIERS.length) {
    const nextTier = OFFICE_TIERS[officeLevel]; // next tier (0-indexed: officeLevel=1 → index 1 = tier 2)
    if (nextTier.requiredBusinessLevel > currentLevel) {
      candidates.push({
        type: 'office',
        level: nextTier.requiredBusinessLevel,
        name: nextTier.name,
        icon: nextTier.icon,
        description: `ظرفیت ${nextTier.maxEmployees} نیرو، ${nextTier.maxProducts} محصول`,
      });
    }
  }

  // Enterprise bonus at level 20
  if (currentLevel < 20) {
    candidates.push({
      type: 'enterprise',
      level: 20,
      name: 'سطح سازمانی',
      icon: '🏆',
      description: 'بونوس ۲۰٪ تولید',
    });
  }

  if (candidates.length === 0) return null;

  // نزدیک‌ترین آنلاک
  candidates.sort((a, b) => a.level - b.level);
  return candidates[0];
}

interface GameState {
  player: PlayerProfile;
  businesses: Business[];
  products: Product[];
  listings: MarketListing[];
  leaderboard: LeaderboardEntry[];
  fridayMarket: FridayMarketItem[];
  news: NewsArticle[];
  businessTemplates: BusinessTemplate[];

  currency: string;
  setCurrency: (currency: string) => void;

  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Player
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateBalance: (amount: number) => void;

  // Business — ساخت و ارتقا
  createBusiness: (template: BusinessTemplate, customName: string) => void;
  upgradeBusiness: (businessId: string) => void;

  // Business — سیستم درآمد تایمری
  tickBusinesses: () => void;
  collectRevenue: (businessId: string) => void;

  // Business — دفتر، استخدام، ارتقا و محصول
  upgradeOffice: (businessId: string) => void;
  hireEmployee: (businessId: string, template: EmployeeTemplate) => void;
  upgradeEmployee: (businessId: string, employeeId: string) => void;
  unlockProduct: (businessId: string, productId: string) => void;

  // Market
  buyListing: (listingId: string, quantity: number) => void;
  buyFridayItem: (itemId: string) => void;
  updateMarketPrices: () => void;

  // Hooks & Rewards
  dailyBonus: DailyBonusState;
  rushHour: RushHourState;
  claimDailyBonus: () => number | null;  // returns amount or null if already claimed
  canClaimDailyBonus: () => boolean;
  isRushHourActive: () => boolean;
  getRushHourTimeLeft: () => number;     // ms until rush hour ends (0 if inactive)
  getNextRushHour: () => number;         // ms until next rush hour starts

  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useGameStore = create<GameState>()(persist((set, get) => ({
  player: mockPlayer,
  businesses: mockBusinesses,
  products: mockProducts,
  listings: mockListings,
  leaderboard: mockLeaderboard,
  news: mockNews,
  fridayMarket: mockFridayMarket,
  businessTemplates: businessTemplates,

  currency: 'تومان',
  setCurrency: (currency) => set({ currency }),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),

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

    const startOffice = getOfficeTier(1);
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
      officeLevel: 1,
      maxEmployees: startOffice.maxEmployees,
      maxProducts: startOffice.maxProducts,
      maxLevel: template.maxLevel,
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
    if (biz.level >= biz.maxLevel) return; // حداکثر سطح

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              level: b.level + 1,
              baseRevenue: Math.round(b.baseRevenue * 1.22),
              upgradeCost: Math.round(b.upgradeCost * 1.5),
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
        // Rush Hour ×2 multiplier
        const rushMultiplier = get().isRushHourActive() ? RUSH_HOUR.multiplier : 1;
        const netPerCycle = Math.max(0, Math.round((effectiveRevenue - totalExpenses) * rushMultiplier));

        // سیکل‌های عادی (تا سقف) + بازده کاهشی (۲۰٪ بعد از سقف)
        const normalCycles = Math.min(completedCycles, biz.maxPendingCycles);
        const overflowCycles = Math.max(0, completedCycles - biz.maxPendingCycles);
        const normalRevenue = netPerCycle * normalCycles;
        const overflowRevenue = Math.round(netPerCycle * 0.2 * overflowCycles);
        const newPending = biz.pendingRevenue + normalRevenue + overflowRevenue;
        const maxPending = netPerCycle * biz.maxPendingCycles + overflowRevenue;

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

  // ==================== Business — دفتر کار ====================

  upgradeOffice: (businessId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const currentLevel = biz.officeLevel ?? 1;
    if (currentLevel >= OFFICE_TIERS.length) return;
    const nextTier = getOfficeTier(currentLevel + 1);
    if (player.balance < nextTier.upgradeCost) return;
    if (biz.level < nextTier.requiredBusinessLevel) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              officeLevel: currentLevel + 1,
              maxEmployees: nextTier.maxEmployees,
              maxProducts: nextTier.maxProducts,
            }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - nextTier.upgradeCost },
    }));
  },

  // ==================== Business — استخدام و محصول ====================

  hireEmployee: (businessId, template) => {
    const { player, businesses } = get();
    if (player.balance < template.hireCost) return;
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    // بررسی سطح شرکت
    if (biz.level < template.unlockLevel) return;

    set((state) => ({
      businesses: state.businesses.map((b) => {
        if (b.id !== businessId) return b;
        // جلوگیری از استخدام تکراری
        if (b.employees.some((e) => e.templateId === template.id)) return b;
        // بررسی ظرفیت
        if (b.employees.length >= b.maxEmployees) return b;
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
              employeeLevel: 1,
              maxUpgradeLevel: template.maxUpgradeLevel,
              baseHireCost: template.hireCost,
            },
          ],
        };
      }),
      player: { ...state.player, balance: state.player.balance - template.hireCost },
    }));
  },

  upgradeEmployee: (businessId, employeeId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const emp = biz.employees.find((e) => e.id === employeeId);
    if (!emp) return;
    // بررسی حداکثر سطح
    if (emp.employeeLevel >= emp.maxUpgradeLevel) return;
    // هزینه ارتقا: L1→L2 = hireCost×2, L2→L3 = hireCost×4
    const upgradeCost = emp.baseHireCost * Math.pow(2, emp.employeeLevel);
    if (player.balance < upgradeCost) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              employees: b.employees.map((e) =>
                e.id === employeeId
                  ? { ...e, employeeLevel: e.employeeLevel + 1 }
                  : e
              ),
            }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - upgradeCost },
    }));
  },

  unlockProduct: (businessId, productId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const prod = biz.products.find((p) => p.id === productId);
    if (!prod || prod.unlocked || player.balance < prod.unlockCost) return;
    // بررسی ظرفیت محصولات
    const unlockedCount = biz.products.filter((p) => p.unlocked).length;
    if (unlockedCount >= biz.maxProducts) return;
    // بررسی پیش‌نیازها
    if (prod.requirements) {
      const req = prod.requirements;
      if (req.officeLevel && (biz.officeLevel ?? 1) < req.officeLevel) return;
      if (req.businessLevel && biz.level < req.businessLevel) return;
      if (req.employees) {
        for (const empReq of req.employees) {
          const count = biz.employees.filter((e) => e.role === empReq.role).length;
          if (count < empReq.count) return;
        }
      }
    }

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

  // ==================== موتور اقتصاد — بروزرسانی قیمت‌های بازار ====================

  updateMarketPrices: () => {
    set((state) => ({
      products: state.products.map((prod) => {
        // تغییر تصادفی ±5-15%
        const changePercent = (Math.random() * 0.10 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
        const newPrice = Math.max(
          Math.round(prod.basePrice * 0.5),
          Math.min(
            Math.round(prod.basePrice * 2.0),
            Math.round(prod.currentPrice * (1 + changePercent))
          )
        );

        // تغییر عرضه و تقاضا
        const supplyChange = Math.round((Math.random() - 0.5) * 50);
        const demandChange = Math.round((Math.random() - 0.5) * 50);

        // بروزرسانی تاریخچه قیمت (۷ عنصر آخر)
        const newHistory = [...prod.priceHistory.slice(-6), newPrice];

        return {
          ...prod,
          currentPrice: newPrice,
          supply: Math.max(10, prod.supply + supplyChange),
          demand: Math.max(10, prod.demand + demandChange),
          priceHistory: newHistory,
        };
      }),
    }));
  },

  // ==================== Hooks & Rewards ====================

  dailyBonus: { lastClaimDate: null, streak: 0 },
  rushHour: { lastStartedAt: 0 },

  canClaimDailyBonus: () => {
    const { dailyBonus } = get();
    const today = new Date().toISOString().slice(0, 10);
    return dailyBonus.lastClaimDate !== today;
  },

  claimDailyBonus: () => {
    const { dailyBonus, player } = get();
    const today = new Date().toISOString().slice(0, 10);
    if (dailyBonus.lastClaimDate === today) return null;

    // بررسی streak — آیا دیروز claim شده؟
    let newStreak = 1;
    if (dailyBonus.lastClaimDate) {
      const lastDate = new Date(dailyBonus.lastClaimDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        // streak ادامه دارد
        newStreak = (dailyBonus.streak % 7) + 1;
      }
      // اگر بیش از 1 روز → ریست
    }

    const rewardIndex = Math.min(newStreak - 1, DAILY_BONUS_REWARDS.length - 1);
    const amount = DAILY_BONUS_REWARDS[rewardIndex].amount;

    set({
      dailyBonus: { lastClaimDate: today, streak: newStreak },
      player: { ...player, balance: player.balance + amount },
    });

    return amount;
  },

  isRushHourActive: () => {
    const { rushHour } = get();
    const now = Date.now();
    const elapsed = now - rushHour.lastStartedAt;
    // آیا در بازه فعال هستیم؟
    if (elapsed < RUSH_HOUR.durationMs) return true;
    // بررسی شروع جدید بر اساس interval
    const cyclePosition = now % RUSH_HOUR.intervalMs;
    return cyclePosition < RUSH_HOUR.durationMs;
  },

  getRushHourTimeLeft: () => {
    const now = Date.now();
    const cyclePosition = now % RUSH_HOUR.intervalMs;
    if (cyclePosition < RUSH_HOUR.durationMs) {
      return RUSH_HOUR.durationMs - cyclePosition;
    }
    return 0;
  },

  getNextRushHour: () => {
    const now = Date.now();
    const cyclePosition = now % RUSH_HOUR.intervalMs;
    if (cyclePosition < RUSH_HOUR.durationMs) return 0; // الان فعاله
    return RUSH_HOUR.intervalMs - cyclePosition;
  },

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}), {
  name: 'jabolgha-save',
  partialize: (state) => ({
    player: state.player,
    businesses: state.businesses,
    products: state.products,
    listings: state.listings,
    theme: state.theme,
    currency: state.currency,
    dailyBonus: state.dailyBonus,
    rushHour: state.rushHour,
  }),
}));
