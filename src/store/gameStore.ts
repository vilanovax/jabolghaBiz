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
  RandomEventState,
  ActiveEvent,
  BusinessType,
  City,
  MissionsState,
  ActiveMission,
  MissionCondition,
  Achievement,
  LifeState,
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
  EVENT_CONFIG,
  EVENT_TEMPLATES,
  CITIES,
  getNeighborhood,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  ONE_TIME_MISSIONS,
  ACHIEVEMENTS_TEMPLATES,
  getEmployeeUpgradeDuration,
  getBusinessUpgradeDuration,
  STAT_DECAY_INTERVAL,
  STAT_DECAY_AMOUNTS,
  LIFE_ACTIONS,
  STAT_GAMEPLAY_EFFECTS,
} from '@/data/mock';

// ==================== Helper Functions ====================

// محاسبه درآمد واقعی — ضریب کارمندان (با سطح نیرو) با سقف 3.5x + بوست مطلق محصولات + ضریب محله
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
  // ضریب محله
  const nb = biz.neighborhoodId ? getNeighborhood(biz.neighborhoodId) : undefined;
  const neighborhoodRevMult = nb ? nb.revenueMultiplier : 1.0;
  // بونوس محله مناسب (+10% اگر نوع شرکت در bestFor محله باشد)
  const bestForBonus = nb?.bestFor.includes(biz.type) ? 1.1 : 1.0;
  return Math.round(biz.baseRevenue * staffMultiplier * enterpriseMultiplier * neighborhoodRevMult * bestForBonus) + productBoost;
}

// محاسبه هزینه‌های کل (حقوق + هزینه پایه + اجاره دفتر × ضریب محله)
export function calcTotalExpenses(biz: Business): number {
  const salaries = biz.employees.reduce((s, e) => s + e.salary, 0);
  const officeTier = getOfficeTier(biz.officeLevel ?? 1);
  // ضریب محله روی هزینه و اجاره
  const nb = biz.neighborhoodId ? getNeighborhood(biz.neighborhoodId) : undefined;
  const expenseMult = nb ? nb.expenseMultiplier : 1.0;
  const rentMult = nb ? nb.rentMultiplier : 1.0;
  return Math.round(biz.expenses * expenseMult) + salaries + Math.round(officeTier.rent * rentMult);
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

  // Location
  cities: City[];

  // Business — ساخت و ارتقا
  createBusiness: (template: BusinessTemplate, customName: string, neighborhoodId?: string) => void;
  upgradeBusiness: (businessId: string) => void;
  completeBusinessUpgrade: (businessId: string) => void;

  // Business — سیستم درآمد تایمری
  tickBusinesses: () => void;
  collectRevenue: (businessId: string) => void;

  // Business — دفتر، استخدام، ارتقا و محصول
  upgradeOffice: (businessId: string) => void;
  hireEmployee: (businessId: string, template: EmployeeTemplate) => void;
  upgradeEmployee: (businessId: string, employeeId: string) => void;
  completeEmployeeUpgrade: (businessId: string, employeeId: string) => void;
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

  // Random Events
  randomEvents: RandomEventState;
  triggerRandomEvent: () => void;
  respondToEvent: (eventId: string, responseOptionId: string) => void;
  expireEvents: () => void;
  dismissPendingEvent: () => void;
  getEventMultiplier: (businessType: BusinessType) => { revenueMultiplier: number; expenseMultiplier: number };

  // Life System
  life: LifeState;
  performLifeAction: (actionId: string) => boolean;  // returns success
  decayStats: () => void;
  getActionCooldownLeft: (actionId: string) => number; // ms left

  // Missions & Achievements
  missions: MissionsState;
  refreshMissions: () => void;           // ریفرش ماموریت‌های روزانه/هفتگی
  progressMission: (condition: MissionCondition, amount?: number) => void;
  claimMissionReward: (missionId: string) => void;
  checkAchievements: () => void;

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
  cities: CITIES,

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

  createBusiness: (template, customName, neighborhoodId) => {
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
      neighborhoodId,
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
      upgradeStartedAt: null,
      upgradeEndsAt: null,
    };

    set((state) => ({
      businesses: [...state.businesses, newBiz],
      player: { ...state.player, balance: state.player.balance - template.startCost },
    }));

    get().progressMission('create_business', 1);
    get().progressMission('own_businesses', get().businesses.length);
    get().checkAchievements();
  },

  upgradeBusiness: (businessId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz || player.balance < biz.upgradeCost) return;
    if (biz.level >= biz.maxLevel) return;
    // اگر در حال ارتقاست، اجازه شروع مجدد نده
    if (biz.upgradeStartedAt !== null) return;

    const now = Date.now();
    const duration = getBusinessUpgradeDuration(biz.level);

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? { ...b, upgradeStartedAt: now, upgradeEndsAt: now + duration }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - biz.upgradeCost },
    }));
  },

  completeBusinessUpgrade: (businessId) => {
    const biz = get().businesses.find((b) => b.id === businessId);
    if (!biz || !biz.upgradeEndsAt) return;
    // هنوز تموم نشده
    if (Date.now() < biz.upgradeEndsAt) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              level: b.level + 1,
              baseRevenue: Math.round(b.baseRevenue * 1.22),
              upgradeCost: Math.round(b.upgradeCost * 1.5),
              upgradeStartedAt: null,
              upgradeEndsAt: null,
            }
          : b
      ),
    }));

    get().progressMission('upgrade_business', 1);
    const maxLevel = Math.max(...get().businesses.map((b) => b.level));
    get().progressMission('reach_business_level', maxLevel);
    get().checkAchievements();
  },

  // ==================== Business — تایمر درآمد ====================

  tickBusinesses: () => {
    const now = Date.now();
    set((state) => {
      let balanceAdd = 0;
      // ضریب‌های stat بازیکن
      const { stats } = state.player;
      const energyCycleMult = STAT_GAMEPLAY_EFFECTS.energyCycleMultiplier(stats.energy);
      const happinessRevMult = STAT_GAMEPLAY_EFFECTS.happinessRevenueMultiplier(stats.happiness);
      const hungerRevMult = STAT_GAMEPLAY_EFFECTS.hungerRevenueMultiplier(stats.hunger);
      const statRevenueMult = happinessRevMult * hungerRevMult;

      const updatedBiz = state.businesses.map((biz) => {
        const elapsed = (now - biz.lastCycleAt) / 1000;
        // ضریب تردد محله — سیکل سریعتر
        const nb = biz.neighborhoodId ? getNeighborhood(biz.neighborhoodId) : undefined;
        const trafficMult = nb ? nb.customerTraffic : 1.0;
        // ضریب انرژی بازیکن روی سرعت سیکل
        const effectiveCycleDuration = Math.max(10, Math.round(biz.cycleDuration / (trafficMult * energyCycleMult)));
        const completedCycles = Math.floor(elapsed / effectiveCycleDuration);
        if (completedCycles <= 0) return biz;

        const effectiveRevenue = calcEffectiveRevenue(biz);
        const totalExpenses = calcTotalExpenses(biz);
        // Event multipliers
        const eventMult = get().getEventMultiplier(biz.type);
        // ضریب stat‌ها روی درآمد
        const adjustedRevenue = Math.round(effectiveRevenue * eventMult.revenueMultiplier * statRevenueMult);
        const adjustedExpenses = Math.round(totalExpenses * eventMult.expenseMultiplier);
        // Rush Hour ×2 multiplier
        const rushMultiplier = get().isRushHourActive() ? RUSH_HOUR.multiplier : 1;
        const netPerCycle = Math.max(0, Math.round((adjustedRevenue - adjustedExpenses) * rushMultiplier));

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
            lastCycleAt: biz.lastCycleAt + completedCycles * effectiveCycleDuration * 1000,
            pendingRevenue: 0,
          };
        }

        return {
          ...biz,
          lastCycleAt: biz.lastCycleAt + completedCycles * effectiveCycleDuration * 1000,
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
    const biz = get().businesses.find((b) => b.id === businessId);
    if (!biz || biz.pendingRevenue <= 0) return;
    const amount = biz.pendingRevenue;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId ? { ...b, pendingRevenue: 0 } : b
      ),
      player: {
        ...state.player,
        balance: state.player.balance + amount,
      },
    }));

    // Mission progress
    get().progressMission('collect_revenue', 1);
    get().progressMission('earn_total', amount);
    get().progressMission('reach_balance', get().player.balance);
    get().checkAchievements();
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

    get().progressMission('upgrade_office', 1);
    get().checkAchievements();
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
              upgradeStartedAt: null,
              upgradeEndsAt: null,
            },
          ],
        };
      }),
      player: { ...state.player, balance: state.player.balance - template.hireCost },
    }));

    get().progressMission('hire_employee', 1);
    const totalEmp = get().businesses.reduce((s, b) => s + b.employees.length, 0);
    get().progressMission('total_employees', totalEmp);
    get().checkAchievements();
  },

  upgradeEmployee: (businessId, employeeId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const emp = biz.employees.find((e) => e.id === employeeId);
    if (!emp) return;
    // بررسی حداکثر سطح
    if (emp.employeeLevel >= emp.maxUpgradeLevel) return;
    // بررسی اینکه در حال ارتقا نباشه
    if (emp.upgradeStartedAt !== null) return;
    // هزینه ارتقا: L1→L2 = hireCost×2, L2→L3 = hireCost×4
    const upgradeCost = emp.baseHireCost * Math.pow(2, emp.employeeLevel);
    if (player.balance < upgradeCost) return;

    const now = Date.now();
    const duration = getEmployeeUpgradeDuration(emp.employeeLevel);

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              employees: b.employees.map((e) =>
                e.id === employeeId
                  ? { ...e, upgradeStartedAt: now, upgradeEndsAt: now + duration }
                  : e
              ),
            }
          : b
      ),
      player: { ...state.player, balance: state.player.balance - upgradeCost },
    }));
  },

  completeEmployeeUpgrade: (businessId, employeeId) => {
    const biz = get().businesses.find((b) => b.id === businessId);
    if (!biz) return;
    const emp = biz.employees.find((e) => e.id === employeeId);
    if (!emp || !emp.upgradeEndsAt) return;
    // بررسی اینکه زمان تمام شده
    if (Date.now() < emp.upgradeEndsAt) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              employees: b.employees.map((e) =>
                e.id === employeeId
                  ? { ...e, employeeLevel: e.employeeLevel + 1, upgradeStartedAt: null, upgradeEndsAt: null }
                  : e
              ),
            }
          : b
      ),
    }));

    get().progressMission('upgrade_business', 1);
    get().checkAchievements();
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

    get().progressMission('unlock_product', 1);
    get().checkAchievements();
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

  // ==================== Life System ====================

  life: {
    lastActionAt: {},
    lastStatDecayAt: Date.now(),
  },

  performLifeAction: (actionId) => {
    const { player, life } = get();
    const action = LIFE_ACTIONS.find((a) => a.id === actionId);
    if (!action) return false;

    // چک سطح
    if (action.requiredLevel && player.level < action.requiredLevel) return false;

    // چک پول
    if (player.balance < action.cost) return false;

    // چک کولداون
    const lastUsed = life.lastActionAt[actionId] || 0;
    if (Date.now() - lastUsed < action.cooldownMs) return false;

    // اعمال افکت‌ها
    const newStats = { ...player.stats };
    for (const [key, value] of Object.entries(action.effect)) {
      const statKey = key as keyof PlayerStats;
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value as number)));
    }

    set((state) => ({
      player: {
        ...state.player,
        balance: state.player.balance - action.cost,
        stats: newStats,
      },
      life: {
        ...state.life,
        lastActionAt: { ...state.life.lastActionAt, [actionId]: Date.now() },
      },
    }));

    return true;
  },

  decayStats: () => {
    const { life } = get();
    const now = Date.now();
    if (now - life.lastStatDecayAt < STAT_DECAY_INTERVAL) return;

    // محاسبه تعداد دوره‌های کاهش
    const periods = Math.floor((now - life.lastStatDecayAt) / STAT_DECAY_INTERVAL);
    if (periods <= 0) return;

    set((state) => {
      const newStats = { ...state.player.stats };
      for (const [key, value] of Object.entries(STAT_DECAY_AMOUNTS)) {
        const statKey = key as keyof PlayerStats;
        const delta = (value as number) * periods;
        newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + delta));
      }
      return {
        player: { ...state.player, stats: newStats },
        life: { ...state.life, lastStatDecayAt: now },
      };
    });
  },

  getActionCooldownLeft: (actionId) => {
    const action = LIFE_ACTIONS.find((a) => a.id === actionId);
    if (!action) return 0;
    const lastUsed = get().life.lastActionAt[actionId] || 0;
    return Math.max(0, action.cooldownMs - (Date.now() - lastUsed));
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

    get().progressMission('claim_daily_bonus', 1);
    get().progressMission('reach_balance', get().player.balance);
    get().checkAchievements();

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

  // ==================== Random Events ====================

  randomEvents: { activeEvents: [], lastEventCheckAt: 0, pendingEventId: null },

  triggerRandomEvent: () => {
    const { randomEvents, player, businesses, news } = get();
    const now = Date.now();

    // حداقل فاصله بین رویدادها
    if (now - randomEvents.lastEventCheckAt < EVENT_CONFIG.minTimeBetweenMs) {
      set({ randomEvents: { ...randomEvents, lastEventCheckAt: now } });
      return;
    }

    // حداکثر رویداد فعال
    if (randomEvents.activeEvents.length >= EVENT_CONFIG.maxActiveEvents) {
      set({ randomEvents: { ...randomEvents, lastEventCheckAt: now } });
      return;
    }

    // شانس
    if (Math.random() > EVENT_CONFIG.triggerChance) {
      set({ randomEvents: { ...randomEvents, lastEventCheckAt: now } });
      return;
    }

    // فیلتر رویدادهای واجد شرایط
    const activeTemplateIds = randomEvents.activeEvents.map((e) => e.templateId);
    const playerBusinessTypes = new Set(businesses.map((b) => b.type));

    const eligible = EVENT_TEMPLATES.filter((t) => {
      if (activeTemplateIds.includes(t.id)) return false;
      if (t.scope === 'business_type' && t.targetBusinessType && !playerBusinessTypes.has(t.targetBusinessType)) return false;
      return true;
    });

    if (eligible.length === 0) {
      set({ randomEvents: { ...randomEvents, lastEventCheckAt: now } });
      return;
    }

    // انتخاب تصادفی
    const template = eligible[Math.floor(Math.random() * eligible.length)];

    // اثر فوری روی موجودی
    if (template.effect === 'instant_balance') {
      const amount = Math.round(player.balance * template.effectValue);
      const finalAmount = template.isPositive ? Math.max(amount, 5_000) : amount;

      // خبر اضافه کن
      const newsItem: NewsArticle = {
        id: `news-evt-${now}`, title: template.newsTitle, summary: template.newsSummary,
        category: 'event', icon: template.icon, timestamp: now,
        isBreaking: template.severity === 'major',
        relatedBusinessType: template.targetBusinessType,
      };

      set({
        player: { ...player, balance: player.balance + finalAmount },
        news: [newsItem, ...news].slice(0, 20),
        randomEvents: {
          ...randomEvents,
          lastEventCheckAt: now,
          pendingEventId: template.severity === 'major' ? `evt-inst-${now}` : null,
        },
      });

      // برای مودال instant، یک ActiveEvent موقتی بساز (expires بعد 10 ثانیه)
      if (template.severity === 'major') {
        const instantEvent: ActiveEvent = {
          id: `evt-inst-${now}`, templateId: template.id,
          title: template.title, description: template.description + ` (${finalAmount > 0 ? '+' : ''}${finalAmount.toLocaleString('fa-IR')})`,
          icon: template.icon, severity: template.severity, scope: template.scope,
          targetBusinessType: template.targetBusinessType,
          effect: template.effect, effectValue: template.effectValue,
          isPositive: template.isPositive, startedAt: now, expiresAt: now + 10_000,
          responded: true, // instant events have no response
        };
        set((s) => ({
          randomEvents: { ...s.randomEvents, activeEvents: [...s.randomEvents.activeEvents, instantEvent], pendingEventId: instantEvent.id },
        }));
      }
      return;
    }

    // رویداد مدت‌دار
    const activeEvent: ActiveEvent = {
      id: `evt-${now}`, templateId: template.id,
      title: template.title, description: template.description,
      icon: template.icon, severity: template.severity, scope: template.scope,
      targetBusinessType: template.targetBusinessType,
      effect: template.effect, effectValue: template.effectValue,
      isPositive: template.isPositive, startedAt: now, expiresAt: now + template.durationMs,
      responded: false,
    };

    const newsItem: NewsArticle = {
      id: `news-evt-${now}`, title: template.newsTitle, summary: template.newsSummary,
      category: 'event', icon: template.icon, timestamp: now,
      isBreaking: template.severity === 'major',
      relatedBusinessType: template.targetBusinessType,
    };

    set({
      randomEvents: {
        activeEvents: [...randomEvents.activeEvents, activeEvent],
        lastEventCheckAt: now,
        pendingEventId: template.severity === 'major' ? activeEvent.id : null,
      },
      news: [newsItem, ...news].slice(0, 20),
    });
  },

  respondToEvent: (eventId, responseOptionId) => {
    const { randomEvents, player } = get();
    const event = randomEvents.activeEvents.find((e) => e.id === eventId);
    if (!event || event.responded) return;

    const template = EVENT_TEMPLATES.find((t) => t.id === event.templateId);
    if (!template?.responseOptions) return;
    const option = template.responseOptions.find((o) => o.id === responseOptionId);
    if (!option || player.balance < option.cost) return;

    // محاسبه effectValue جدید
    let newEffectValue = event.effectValue;
    if (option.effectMultiplier === 0) {
      newEffectValue = 1.0; // کامل نفی
    } else if (event.isPositive) {
      newEffectValue = event.effectValue * option.effectMultiplier; // تقویت
    } else {
      // کاهش خسارت: حرکت به سمت 1.0
      const penalty = 1 - event.effectValue;
      newEffectValue = 1 - penalty * (1 - option.effectMultiplier);
    }

    set({
      randomEvents: {
        ...randomEvents,
        activeEvents: randomEvents.activeEvents.map((e) =>
          e.id === eventId
            ? { ...e, effectValue: newEffectValue, responded: true, responseUsed: responseOptionId }
            : e
        ),
      },
      player: { ...player, balance: player.balance - option.cost },
    });

    get().progressMission('respond_to_event', 1);
  },

  expireEvents: () => {
    const now = Date.now();
    const { randomEvents } = get();
    const filtered = randomEvents.activeEvents.filter((e) => e.expiresAt > now);
    if (filtered.length !== randomEvents.activeEvents.length) {
      set({ randomEvents: { ...randomEvents, activeEvents: filtered } });
    }
  },

  dismissPendingEvent: () => {
    set((s) => ({ randomEvents: { ...s.randomEvents, pendingEventId: null } }));
  },

  getEventMultiplier: (businessType) => {
    const { randomEvents } = get();
    let revenueMultiplier = 1;
    let expenseMultiplier = 1;
    for (const evt of randomEvents.activeEvents) {
      if (evt.scope === 'global' || evt.targetBusinessType === businessType) {
        if (evt.effect === 'revenue_multiplier') revenueMultiplier *= evt.effectValue;
        if (evt.effect === 'expense_multiplier') expenseMultiplier *= evt.effectValue;
      }
    }
    return { revenueMultiplier, expenseMultiplier };
  },

  // ==================== Missions & Achievements ====================

  missions: {
    activeMissions: [],
    completedMissionIds: [],
    lastDailyRefresh: null,
    lastWeeklyRefresh: null,
    achievements: ACHIEVEMENTS_TEMPLATES.map((a) => ({ ...a })),
    totalMissionsCompleted: 0,
  },

  refreshMissions: () => {
    const { missions, businesses } = get();
    const today = new Date().toISOString().slice(0, 10);
    const now = Date.now();

    // محاسبه شماره هفته
    const getWeekKey = (d: Date) => {
      const jan1 = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400_000 + jan1.getDay() + 1) / 7);
      return `${d.getFullYear()}-W${weekNum}`;
    };
    const currentWeek = getWeekKey(new Date());

    let updated = [...missions.activeMissions];
    let needsUpdate = false;

    // حذف ماموریت‌های منقضی
    const before = updated.length;
    updated = updated.filter((m) => m.expiresAt === 0 || m.expiresAt > now || (m.completed && !m.claimed));
    if (updated.length !== before) needsUpdate = true;

    // ریفرش روزانه
    if (missions.lastDailyRefresh !== today) {
      // حذف ماموریت‌های روزانه قبلی (که claim شده یا expire شده)
      updated = updated.filter((m) => m.type !== 'daily');
      // انتخاب ۳ ماموریت روزانه تصادفی
      const shuffled = [...DAILY_MISSIONS].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      const dailyExpiry = new Date(today);
      dailyExpiry.setDate(dailyExpiry.getDate() + 1);
      for (const t of picked) {
        updated.push({
          id: `mission-${t.id}-${now}`,
          templateId: t.id,
          title: t.title,
          description: t.description,
          icon: t.icon,
          type: 'daily',
          condition: t.condition,
          target: t.target,
          progress: 0,
          reward: t.reward,
          xpReward: t.xpReward ?? 0,
          completed: false,
          claimed: false,
          assignedAt: now,
          expiresAt: dailyExpiry.getTime(),
        });
      }
      needsUpdate = true;
    }

    // ریفرش هفتگی
    if (missions.lastWeeklyRefresh !== currentWeek) {
      updated = updated.filter((m) => m.type !== 'weekly');
      const shuffled = [...WEEKLY_MISSIONS].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 2);
      const weekExpiry = now + 7 * 24 * 60 * 60 * 1000;
      for (const t of picked) {
        updated.push({
          id: `mission-${t.id}-${now}`,
          templateId: t.id,
          title: t.title,
          description: t.description,
          icon: t.icon,
          type: 'weekly',
          condition: t.condition,
          target: t.target,
          progress: 0,
          reward: t.reward,
          xpReward: t.xpReward ?? 0,
          completed: false,
          claimed: false,
          assignedAt: now,
          expiresAt: weekExpiry,
        });
      }
      needsUpdate = true;
    }

    // ماموریت‌های یکبار مصرف (اگر قبلاً انجام نشده)
    const activeOneTimeIds = updated.filter((m) => m.type === 'one_time').map((m) => m.templateId);
    for (const t of ONE_TIME_MISSIONS) {
      if (missions.completedMissionIds.includes(t.id)) continue;
      if (activeOneTimeIds.includes(t.id)) continue;
      updated.push({
        id: `mission-${t.id}-${now}`,
        templateId: t.id,
        title: t.title,
        description: t.description,
        icon: t.icon,
        type: 'one_time',
        condition: t.condition,
        target: t.target,
        progress: 0,
        reward: t.reward,
        xpReward: t.xpReward ?? 0,
        completed: false,
        claimed: false,
        assignedAt: now,
        expiresAt: 0, // never expires
      });
      needsUpdate = true;
    }

    // بررسی اولیه progress برای ماموریت‌های وضعیتی
    for (const m of updated) {
      if (m.completed) continue;
      let currentValue = 0;
      if (m.condition === 'own_businesses') currentValue = businesses.length;
      else if (m.condition === 'reach_balance') currentValue = get().player.balance;
      else if (m.condition === 'total_employees') currentValue = businesses.reduce((s, b) => s + b.employees.length, 0);
      else if (m.condition === 'reach_business_level') currentValue = Math.max(0, ...businesses.map((b) => b.level));
      else continue;

      if (currentValue !== m.progress) {
        m.progress = currentValue;
        needsUpdate = true;
        if (m.progress >= m.target && !m.completed) {
          m.completed = true;
        }
      }
    }

    if (needsUpdate) {
      set({
        missions: {
          ...missions,
          activeMissions: updated,
          lastDailyRefresh: today,
          lastWeeklyRefresh: currentWeek,
        },
      });
    }
  },

  progressMission: (condition, amount = 1) => {
    const { missions } = get();
    let changed = false;
    const updated = missions.activeMissions.map((m) => {
      if (m.completed || m.claimed) return m;
      if (m.condition !== condition) return m;

      // برای شرایط "وضعیتی" (reach_balance, own_businesses, ...) مقدار مستقیم ست میشه
      const isStateCondition = ['reach_balance', 'own_businesses', 'total_employees', 'reach_business_level'].includes(condition);
      const newProgress = isStateCondition ? amount : m.progress + amount;

      if (newProgress === m.progress) return m;
      changed = true;
      const completed = newProgress >= m.target;
      return { ...m, progress: newProgress, completed };
    });

    if (changed) {
      set({ missions: { ...missions, activeMissions: updated } });
    }
  },

  claimMissionReward: (missionId) => {
    const { missions, player } = get();
    const mission = missions.activeMissions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    const updatedMissions = missions.activeMissions.map((m) =>
      m.id === missionId ? { ...m, claimed: true } : m
    );

    const completedIds = mission.type === 'one_time'
      ? [...missions.completedMissionIds, mission.templateId]
      : missions.completedMissionIds;

    set({
      missions: {
        ...missions,
        activeMissions: updatedMissions,
        completedMissionIds: completedIds,
        totalMissionsCompleted: missions.totalMissionsCompleted + 1,
      },
      player: {
        ...player,
        balance: player.balance + mission.reward,
        stats: mission.xpReward > 0
          ? { ...player.stats, experience: Math.min(100, player.stats.experience + mission.xpReward) }
          : player.stats,
      },
    });
  },

  checkAchievements: () => {
    const { missions, businesses, player } = get();
    const now = Date.now();
    let changed = false;

    const updatedAch = missions.achievements.map((ach) => {
      if (ach.unlockedAt) return ach; // already unlocked

      let currentValue = 0;
      switch (ach.condition) {
        case 'create_business':
        case 'own_businesses':
          currentValue = businesses.length;
          break;
        case 'reach_business_level':
          currentValue = Math.max(0, ...businesses.map((b) => b.level));
          break;
        case 'reach_balance':
          currentValue = player.balance;
          break;
        case 'hire_employee':
        case 'total_employees':
          currentValue = businesses.reduce((s, b) => s + b.employees.length, 0);
          break;
        case 'upgrade_office':
          currentValue = Math.max(0, ...businesses.map((b) => (b.officeLevel ?? 1) - 1));
          break;
        case 'collect_revenue':
          // special: missions completed count
          if (ach.id.startsWith('ach-mission')) {
            currentValue = missions.totalMissionsCompleted;
          }
          break;
      }

      if (currentValue >= ach.target) {
        changed = true;
        return { ...ach, unlockedAt: now };
      }
      return ach;
    });

    if (changed) {
      set({ missions: { ...missions, achievements: updatedAch } });
    }
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
    randomEvents: state.randomEvents,
    missions: state.missions,
    life: state.life,
  }),
}));
