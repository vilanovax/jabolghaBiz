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
  SpecialOrder,
  OrderBoardState,
  BankingState,
  BankTemplate,
  AIRival,
  RivalsState,
  SupermarketState,
  ShelfSlot,
  SupermarketBoost,
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
  FICTIONAL_COMPANIES,
  ORDER_CONFIG,
  BANK_TEMPLATES,
  BANK_CONFIG,
  RIVAL_TEMPLATES,
  RIVAL_CONFIG,
  RIVAL_NEWS_TEMPLATES,
  SPECIALTY_MISSION_TEMPLATES,
  SHELF_PRODUCTS,
  SUPERMARKET_TIERS,
  SUPERMARKET_CONFIG,
  createInitialSupermarketState,
  getSupermarketTier,
  generateSupermarketOrder,
} from '@/data/mock';

// ==================== Helper Functions ====================

// محاسبه نرخ تولید واقعی (واحد در هر سیکل) — بوست کارمندان تولید + محصولات
export function calcEffectiveRevenue(biz: Business): number {
  const base = biz.baseProductionRate;
  // بوست کارمندان تولید بر اساس سطح: L1=base, L2=+50%, L3=+100%
  const employeeBoost = biz.employees
    .filter((e) => e.role === 'production')
    .reduce((sum, e) => {
      const levelMultiplier = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
      return sum + e.productionBoost * levelMultiplier;
    }, 0);
  // بوست محصولات آنلاک‌شده
  const productBoost = biz.products
    .filter((p) => p.unlocked)
    .reduce((sum, p) => sum + p.productionBoost, 0);
  return base + employeeBoost + productBoost;
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

// ارزش امپراتوری = موجودی + مجموع (نرخ تولید پایه × سطح × ۱۰)
export function calcEmpireValue(player: PlayerProfile, businesses: Business[]): number {
  const businessesValue = businesses.reduce((sum, b) => sum + b.baseProductionRate * b.level * 10, 0);
  return player.balance + businessesValue;
}

// ==================== Natural Demand (Ecosystem Bonus) ====================
// هر نوع کسب‌وکار از وجود سایرین سود می‌بره — بدون اجبار، فقط فرصت

export interface EcosystemBonus {
  saleRateBonus: number;   // واحد اضافه فروش در دقیقه
  revenueBonus: number;    // ضریب اضافه درآمد (0.05 = +5٪)
  label: string;           // نام اثر برای نمایش
  count: number;           // تعداد کسب‌وکارهای تاثیرگذار
}

export function calcEcosystemBonus(biz: Business, allBusinesses: Business[]): EcosystemBonus {
  const others = allBusinesses.filter((b) => b.id !== biz.id);

  if (biz.type === 'transport') {
    // هر کارخانه/مزرعه/سوپرمارکت/رستوران = تقاضای حمل‌ونقل بیشتر
    const shippers = others.filter((b) =>
      b.type === 'factory' || b.type === 'farming' || b.type === 'supermarket' || b.type === 'restaurant'
    ).length;
    return { saleRateBonus: shippers * 0.4, revenueBonus: 0, label: 'تقاضای لجستیک', count: shippers };
  }

  if (biz.type === 'app_startup') {
    // هر کسب‌وکار = مشتری بالقوه نرم‌افزار
    const clients = others.length;
    return { saleRateBonus: 0, revenueBonus: clients * 0.04, label: 'مشتریان B2B', count: clients };
  }

  if (biz.type === 'restaurant') {
    // کارمندان کسب‌وکارهای دیگه = مشتری رستوران
    const workplaces = others.filter((b) => b.type !== 'restaurant').length;
    return { saleRateBonus: workplaces * 0.3, revenueBonus: 0, label: 'مشتریان محل کار', count: workplaces };
  }

  if (biz.type === 'supermarket') {
    // مزرعه‌های محلی = کالای تازه، تقاضای بیشتر
    const farms = others.filter((b) => b.type === 'farming').length;
    return { saleRateBonus: farms * 0.5, revenueBonus: farms * 0.03, label: 'تامین محلی', count: farms };
  }

  if (biz.type === 'farming') {
    // هر سوپرمارکت/رستوران = خریدار محصول
    const buyers = others.filter((b) => b.type === 'supermarket' || b.type === 'restaurant').length;
    return { saleRateBonus: 0, revenueBonus: buyers * 0.05, label: 'خریداران محصول', count: buyers };
  }

  if (biz.type === 'factory') {
    // شرکت‌های حمل‌ونقل = توزیع سریع‌تر کالا
    const transporters = others.filter((b) => b.type === 'transport').length;
    return { saleRateBonus: transporters * 0.5, revenueBonus: 0, label: 'شبکه توزیع', count: transporters };
  }

  return { saleRateBonus: 0, revenueBonus: 0, label: '', count: 0 };
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
  progressMission: (condition: MissionCondition, amount?: number, businessType?: BusinessType) => void;
  claimMissionReward: (missionId: string) => void;
  checkAchievements: () => void;

  // Special Orders
  orderBoard: OrderBoardState;
  acceptOrder: (orderId: string, businessId: string) => void;
  deliverOrder: (orderId: string) => void;
  generateOrders: () => void;
  expireOrders: () => void;

  // Banking
  banking: BankingState;
  bankTemplates: BankTemplate[];
  canTakeLoan: (bankId: string, packageId: string) => { eligible: boolean; reason?: string };
  takeLoan: (bankId: string, packageId: string) => boolean;
  processInstallments: () => void;
  canDeposit: (bankId: string, amount: number) => { eligible: boolean; reason?: string };
  deposit: (bankId: string, amount: number) => boolean;
  withdraw: (bankId: string) => void;
  accrueDepositInterest: () => void;

  // AI Rivals
  rivals: RivalsState;
  tickRivals: () => void;
  getDynamicLeaderboard: () => LeaderboardEntry[];

  // Supermarket Deep System
  supermarketStates: Record<string, SupermarketState>;
  initSupermarketState: (businessId: string) => void;
  stockShelf: (businessId: string, shelfId: string, productId: string, quantity: number) => void;
  clearShelf: (businessId: string, shelfId: string) => void;
  tickSupermarket: (businessId: string) => void;
  acceptSupermarketOrder: (businessId: string, orderId: string) => void;
  getSupermarketState: (businessId: string) => SupermarketState | null;

  // Achievement Toast
  achievementToastQueue: Achievement[];
  dismissAchievementToast: () => void;

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
      baseProductionRate: template.baseProductionRate,
      baseSaleRate: template.baseSaleRate,
      cycleDuration: template.cycleDuration,
      lastCycleAt: Date.now(),
      inventory: {
        productId: template.productId,
        quantity: 0,
        maxCapacity: template.baseInventoryCapacity,
      },
      fractionalProduced: 0,
      fractionalSold: 0,
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
    // per-type dispatch for specialty missions
    const newBizType = template.type;
    const typeCount = get().businesses.filter((b) => b.type === newBizType).length;
    get().progressMission('own_businesses', typeCount, newBizType);
    get().checkAchievements();
    get().refreshMissions(); // activate specialty missions for newly owned type
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
              baseProductionRate: Math.round(b.baseProductionRate * 1.22),
              upgradeCost: Math.round(b.upgradeCost * 1.5),
              upgradeStartedAt: null,
              upgradeEndsAt: null,
            }
          : b
      ),
    }));

    // Increment total upgrades counter
    set((state) => ({
      missions: { ...state.missions, totalUpgrades: (state.missions.totalUpgrades ?? 0) + 1 },
    }));

    get().progressMission('upgrade_business', 1);
    const allBiz = get().businesses;
    const maxLevel = Math.max(...allBiz.map((b) => b.level));
    get().progressMission('reach_business_level', maxLevel);
    // per-type dispatch for specialty missions (biz.type unchanged by upgrade)
    const typeMaxLevel = Math.max(...allBiz.filter((b) => b.type === biz.type).map((b) => b.level));
    get().progressMission('reach_business_level', typeMaxLevel, biz.type);
    get().checkAchievements();
  },

  // ==================== Business — تایمر درآمد ====================

  tickBusinesses: () => {
    const now = Date.now();
    set((state) => {
      let balanceAdd = 0;
      let totalProduced = 0;
      let totalSold = 0;
      const producedByType: Partial<Record<BusinessType, number>> = {};
      const soldByType: Partial<Record<BusinessType, number>> = {};
      const earnedByType: Partial<Record<BusinessType, number>> = {};
      const { stats } = state.player;
      const energyCycleMult = STAT_GAMEPLAY_EFFECTS.energyCycleMultiplier(stats.energy);
      const happinessRevMult = STAT_GAMEPLAY_EFFECTS.happinessRevenueMultiplier(stats.happiness);
      const hungerRevMult = STAT_GAMEPLAY_EFFECTS.hungerRevenueMultiplier(stats.hunger);
      const statRevenueMult = happinessRevMult * hungerRevMult;

      const updatedBiz = state.businesses.map((biz) => {
        const elapsed = (now - biz.lastCycleAt) / 1000;
        const nb = biz.neighborhoodId ? getNeighborhood(biz.neighborhoodId) : undefined;
        const trafficMult = nb ? nb.customerTraffic : 1.0;
        const effectiveCycleDuration = Math.max(10, Math.round(biz.cycleDuration / (trafficMult * energyCycleMult)));
        const completedCycles = Math.floor(elapsed / effectiveCycleDuration);

        // --- Production (only on cycle completion) ---
        let newQuantity = biz.inventory.quantity;
        let newFracProd = biz.fractionalProduced;
        let newLastCycleAt = biz.lastCycleAt;
        // Capacity with warehouse employee boost
        const warehouseBoost = biz.employees
          .filter((e) => e.role === 'warehouse')
          .reduce((sum, e) => {
            const levelMult = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
            return sum + e.capacityBoost * levelMult;
          }, 0);
        const productCapBoost = biz.products
          .filter((p) => p.unlocked)
          .reduce((sum, p) => sum + p.capacityBoost, 0);
        const maxCap = biz.inventory.maxCapacity + warehouseBoost + productCapBoost;

        if (completedCycles > 0) {
          const productionRate = calcEffectiveRevenue(biz); // units per cycle
          const rawProduced = productionRate * completedCycles + newFracProd;
          const wholeProduced = Math.floor(rawProduced);
          newFracProd = rawProduced - wholeProduced;
          newQuantity = Math.min(maxCap, newQuantity + wholeProduced);
          totalProduced += wholeProduced;
          producedByType[biz.type] = (producedByType[biz.type] ?? 0) + wholeProduced;
          newLastCycleAt = biz.lastCycleAt + completedCycles * effectiveCycleDuration * 1000;
        }

        // --- Auto-sales (continuous) ---
        const salesBoost = biz.employees
          .filter((e) => e.role === 'sales')
          .reduce((sum, e) => {
            const levelMult = 1 + ((e.employeeLevel ?? 1) - 1) * 0.5;
            return sum + e.salesBoost * levelMult;
          }, 0);
        const ecosystem = calcEcosystemBonus(biz, state.businesses);
        const totalSaleRate = biz.baseSaleRate + salesBoost + ecosystem.saleRateBonus; // units per minute
        const elapsedMin = elapsed / 60;
        const rawSold = totalSaleRate * elapsedMin + biz.fractionalSold;
        const wholeSold = Math.floor(rawSold);
        const actualSold = Math.min(wholeSold, newQuantity);
        const newFracSold = actualSold < wholeSold ? 0 : rawSold - wholeSold;

        if (actualSold > 0) {
          newQuantity -= actualSold;
          totalSold += actualSold;
          soldByType[biz.type] = (soldByType[biz.type] ?? 0) + actualSold;
          // Calculate income
          const marketProduct = state.products.find((p) => p.id === biz.inventory.productId);
          const unitPrice = marketProduct ? marketProduct.currentPrice : 1000;
          const eventMult = get().getEventMultiplier(biz.type);
          const rushMultiplier = get().isRushHourActive() ? RUSH_HOUR.multiplier : 1;
          // Profit margin multiplier from unlocked products (e.g. برند خصوصی, کارت وفاداری)
          const productRevMult = 1 + biz.products
            .filter((p) => p.unlocked && p.revenueMultiplier)
            .reduce((sum, p) => sum + (p.revenueMultiplier ?? 0), 0);
          // Chain store bonus: owning 2+ supermarkets at Tier 5 (Lv18+) gives +15% to all
          const chainBonus = biz.type === 'supermarket' && biz.level >= 18 &&
            state.businesses.filter((b) => b.type === 'supermarket').length >= 2 ? 0.15 : 0;
          // Ecosystem (natural demand) revenue bonus
          const totalRevMult = productRevMult + chainBonus + ecosystem.revenueBonus;
          const income = Math.round(actualSold * unitPrice * statRevenueMult * eventMult.revenueMultiplier * rushMultiplier * totalRevMult);
          // Subtract expenses proportional to elapsed time
          const totalExpenses = calcTotalExpenses(biz);
          const expensePerSec = totalExpenses / biz.cycleDuration;
          const expenseCost = Math.round(expensePerSec * elapsed * eventMult.expenseMultiplier);
          const netIncome = Math.max(0, income - expenseCost);
          balanceAdd += netIncome;
          earnedByType[biz.type] = (earnedByType[biz.type] ?? 0) + netIncome;
        }

        return {
          ...biz,
          lastCycleAt: completedCycles > 0 ? newLastCycleAt : biz.lastCycleAt,
          inventory: { ...biz.inventory, quantity: newQuantity, maxCapacity: maxCap },
          fractionalProduced: newFracProd,
          fractionalSold: newFracSold,
        };
      });

      // Progress missions — global
      if (totalProduced > 0) {
        setTimeout(() => get().progressMission('produce_units', totalProduced), 0);
      }
      if (totalSold > 0) {
        setTimeout(() => get().progressMission('sell_units', totalSold), 0);
      }
      // Progress missions — per type (for specialty missions)
      for (const [type, count] of Object.entries(producedByType) as [BusinessType, number][]) {
        if (count > 0) setTimeout(() => get().progressMission('produce_units', count, type), 0);
      }
      for (const [type, count] of Object.entries(soldByType) as [BusinessType, number][]) {
        if (count > 0) setTimeout(() => get().progressMission('sell_units', count, type), 0);
      }
      for (const [type, amount] of Object.entries(earnedByType) as [BusinessType, number][]) {
        if (amount > 0) setTimeout(() => get().progressMission('earn_total', amount, type), 0);
      }

      return {
        businesses: updatedBiz,
        player: balanceAdd > 0
          ? { ...state.player, balance: state.player.balance + balanceAdd }
          : state.player,
      };
    });
  },

  collectRevenue: () => {
    // No longer needed — auto-sales handle income
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
              productionBoost: template.productionBoost ?? 0,
              salesBoost: template.salesBoost ?? 0,
              capacityBoost: template.capacityBoost ?? 0,
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
    get().checkAchievements();
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

    get().checkAchievements();
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
    const activeRivals = get().rivals.rivals.filter((r) => r.active);
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
        let supplyChange = Math.round((Math.random() - 0.5) * 50);
        let demandChange = Math.round((Math.random() - 0.5) * 50);

        // تاثیر رقبا روی عرضه و تقاضا
        for (const rival of activeRivals) {
          if (Math.random() < rival.marketInfluence * 0.3) {
            const shift = Math.round((Math.random() - 0.5) * RIVAL_CONFIG.marketShiftRange * rival.marketInfluence);
            supplyChange += shift;
            demandChange -= shift;
          }
        }

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

  // ==================== Special Orders ====================

  orderBoard: {
    availableOrders: [],
    acceptedOrders: [],
    completedOrderIds: [],
    failedOrderIds: [],
    lastOrderGenerationAt: 0,
  } as OrderBoardState,

  acceptOrder: (orderId, businessId) => {
    const { orderBoard, businesses } = get();
    const order = orderBoard.availableOrders.find((o) => o.id === orderId);
    if (!order) return;
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;
    if (biz.inventory.productId !== order.productId) return;
    if (orderBoard.acceptedOrders.length >= ORDER_CONFIG.maxAcceptedOrders) return;

    set({
      orderBoard: {
        ...orderBoard,
        availableOrders: orderBoard.availableOrders.filter((o) => o.id !== orderId),
        acceptedOrders: [...orderBoard.acceptedOrders, { ...order, status: 'accepted', acceptedAt: Date.now(), businessId }],
      },
    });
  },

  deliverOrder: (orderId) => {
    const { orderBoard, businesses, player } = get();
    const order = orderBoard.acceptedOrders.find((o) => o.id === orderId);
    if (!order || !order.businessId) return;
    const biz = businesses.find((b) => b.id === order.businessId);
    if (!biz) return;

    const available = biz.inventory.quantity;
    const toDeliver = Math.min(available, order.quantity - order.deliveredQuantity);
    if (toDeliver <= 0) return;

    const newDelivered = order.deliveredQuantity + toDeliver;
    const isComplete = newDelivered >= order.quantity;
    const payment = isComplete ? order.totalPayment : Math.round(toDeliver * order.pricePerUnit);

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === order.businessId
          ? { ...b, inventory: { ...b.inventory, quantity: b.inventory.quantity - toDeliver } }
          : b
      ),
      player: { ...state.player, balance: state.player.balance + payment },
      orderBoard: {
        ...state.orderBoard,
        acceptedOrders: isComplete
          ? state.orderBoard.acceptedOrders.filter((o) => o.id !== orderId)
          : state.orderBoard.acceptedOrders.map((o) =>
              o.id === orderId ? { ...o, deliveredQuantity: newDelivered } : o
            ),
        completedOrderIds: isComplete
          ? [...state.orderBoard.completedOrderIds, orderId]
          : state.orderBoard.completedOrderIds,
      },
    }));

    if (isComplete) {
      get().progressMission('complete_special_order', 1);
      get().progressMission('earn_total', payment);
      get().progressMission('reach_balance', get().player.balance);
      get().checkAchievements();
    }
  },

  generateOrders: () => {
    const { orderBoard, businesses, products } = get();
    const now = Date.now();
    if (now - orderBoard.lastOrderGenerationAt < ORDER_CONFIG.generationIntervalMs) return;
    if (orderBoard.availableOrders.length >= ORDER_CONFIG.maxAvailableOrders) return;
    if (businesses.length === 0) return;

    const count = 1 + Math.floor(Math.random() * 3); // 1-3 orders
    const newOrders: SpecialOrder[] = [];

    for (let i = 0; i < count; i++) {
      if (orderBoard.availableOrders.length + newOrders.length >= ORDER_CONFIG.maxAvailableOrders) break;
      const biz = businesses[Math.floor(Math.random() * businesses.length)];
      const product = products.find((p) => p.id === biz.inventory.productId);
      if (!product) continue;

      const company = FICTIONAL_COMPANIES[Math.floor(Math.random() * FICTIONAL_COMPANIES.length)];
      const quantity = 5 + Math.floor(Math.random() * 20);
      const priceMult = ORDER_CONFIG.priceMultiplierMin + Math.random() * (ORDER_CONFIG.priceMultiplierMax - ORDER_CONFIG.priceMultiplierMin);
      const pricePerUnit = Math.round(product.currentPrice * priceMult);
      const deadlineMs = (ORDER_CONFIG.deadlineMinMs + Math.random() * (ORDER_CONFIG.deadlineMaxMs - ORDER_CONFIG.deadlineMinMs));

      newOrders.push({
        id: `order-${now}-${i}`,
        companyName: company.name,
        companyIcon: company.icon,
        productId: biz.inventory.productId,
        productName: product.name,
        quantity,
        pricePerUnit,
        totalPayment: pricePerUnit * quantity,
        deadline: now + deadlineMs,
        createdAt: now,
        status: 'available',
        deliveredQuantity: 0,
        penaltyRate: ORDER_CONFIG.penaltyRate,
      });
    }

    // Rival order snatching
    const activeRivals = get().rivals.rivals.filter((r) => r.active);
    const snatchedIndices: number[] = [];
    const snatchNews: NewsArticle[] = [];
    const rivalUpdates: Record<string, number> = {}; // id -> wealth bonus

    for (let i = 0; i < newOrders.length; i++) {
      for (const rival of activeRivals) {
        if (Math.random() < rival.orderAggressiveness * RIVAL_CONFIG.orderSnatchBaseChance) {
          snatchedIndices.push(i);
          rivalUpdates[rival.id] = (rivalUpdates[rival.id] || 0) + Math.round(newOrders[i].totalPayment * 0.3);
          const tpl = RIVAL_NEWS_TEMPLATES.orderSnatched(rival.name, newOrders[i].productName, newOrders[i].totalPayment);
          snatchNews.push({
            id: `news-rival-order-${now}-${i}`,
            title: tpl.title, summary: tpl.summary,
            category: 'rival', icon: rival.avatar, timestamp: now,
          });
          break; // only one rival snatches each order
        }
      }
    }

    const survivingOrders = newOrders.filter((_, i) => !snatchedIndices.includes(i));
    const currentNews = get().news;

    // Apply rival wealth bonuses
    if (Object.keys(rivalUpdates).length > 0) {
      const updatedRivals = get().rivals.rivals.map((r) =>
        rivalUpdates[r.id] ? { ...r, wealth: r.wealth + rivalUpdates[r.id] } : r
      );
      set({ rivals: { ...get().rivals, rivals: updatedRivals } });
    }

    set({
      orderBoard: {
        ...orderBoard,
        availableOrders: [...orderBoard.availableOrders, ...survivingOrders],
        lastOrderGenerationAt: now,
      },
      news: [...snatchNews, ...currentNews].slice(0, 20),
    });
  },

  expireOrders: () => {
    const { orderBoard, player } = get();
    const now = Date.now();
    let penalty = 0;
    const failedIds: string[] = [];

    // Expire available orders past deadline
    const validAvailable = orderBoard.availableOrders.filter((o) => o.deadline > now);

    // Check accepted orders past deadline
    const validAccepted: SpecialOrder[] = [];
    for (const order of orderBoard.acceptedOrders) {
      if (order.deadline <= now) {
        // Penalty: penaltyRate × remaining undelivered value
        const remaining = order.quantity - order.deliveredQuantity;
        penalty += Math.round(remaining * order.pricePerUnit * order.penaltyRate);
        failedIds.push(order.id);
      } else {
        validAccepted.push(order);
      }
    }

    if (validAvailable.length !== orderBoard.availableOrders.length || failedIds.length > 0) {
      set({
        orderBoard: {
          ...orderBoard,
          availableOrders: validAvailable,
          acceptedOrders: validAccepted,
          failedOrderIds: [...orderBoard.failedOrderIds, ...failedIds],
        },
        player: penalty > 0
          ? { ...player, balance: Math.max(0, player.balance - penalty) }
          : player,
      });
    }
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
    totalUpgrades: 0,
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
        expiresAt: 0,
      });
      needsUpdate = true;
    }

    // ماموریت‌های تخصصی — فقط برای انواعی که بازیکن داره
    const ownedTypes = [...new Set(businesses.map((b) => b.type))];
    const activeSpecialtyIds = updated.filter((m) => m.businessTypeFilter).map((m) => m.templateId);
    for (const t of SPECIALTY_MISSION_TEMPLATES) {
      if (!t.businessTypeFilter) continue;
      if (!ownedTypes.includes(t.businessTypeFilter)) continue;
      if (missions.completedMissionIds.includes(t.id)) continue;
      if (activeSpecialtyIds.includes(t.id)) continue;
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
        expiresAt: 0,
        businessTypeFilter: t.businessTypeFilter,
      });
      needsUpdate = true;
    }

    // بررسی اولیه progress برای ماموریت‌های وضعیتی
    for (const m of updated) {
      if (m.completed) continue;
      let currentValue = 0;
      if (m.condition === 'own_businesses') {
        currentValue = m.businessTypeFilter
          ? businesses.filter((b) => b.type === m.businessTypeFilter).length
          : businesses.length;
      } else if (m.condition === 'reach_balance') {
        currentValue = get().player.balance;
      } else if (m.condition === 'total_employees') {
        currentValue = businesses.reduce((s, b) => s + b.employees.length, 0);
      } else if (m.condition === 'reach_business_level') {
        const relevant = m.businessTypeFilter
          ? businesses.filter((b) => b.type === m.businessTypeFilter)
          : businesses;
        currentValue = relevant.length > 0 ? Math.max(...relevant.map((b) => b.level)) : 0;
      } else {
        continue;
      }

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

  progressMission: (condition, amount = 1, businessType?) => {
    const { missions } = get();
    let changed = false;
    const updated = missions.activeMissions.map((m) => {
      if (m.completed || m.claimed) return m;
      if (m.condition !== condition) return m;

      // ماموریت‌های تخصصی: فقط پیش بره اگه نوع کسب‌وکار مطابقت داشته باشه
      if (m.businessTypeFilter && businessType !== m.businessTypeFilter) return m;

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
    const newlyUnlocked: Achievement[] = [];

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
        case 'own_all_business_types': {
          const uniqueTypes = new Set(businesses.map((b) => b.type));
          currentValue = uniqueTypes.size;
          break;
        }
        case 'reach_stat_intelligence':
          currentValue = player.stats.intelligence;
          break;
        case 'reach_stat_happiness':
          currentValue = player.stats.happiness;
          break;
        case 'reach_stat_energy':
          currentValue = player.stats.energy;
          break;
        case 'reach_player_level':
          currentValue = player.level;
          break;
        case 'total_upgrades':
          currentValue = missions.totalUpgrades ?? 0;
          break;
        case 'complete_missions':
          currentValue = missions.totalMissionsCompleted;
          break;
      }

      const updated = { ...ach, progress: Math.min(currentValue, ach.target) };

      if (currentValue >= ach.target) {
        updated.unlockedAt = now;
        newlyUnlocked.push(updated);
      }
      return updated;
    });

    if (newlyUnlocked.length > 0) {
      // Grant rewards
      let bonusMoney = 0;
      const statBoosts: Partial<PlayerStats> = {};
      for (const ach of newlyUnlocked) {
        if (ach.reward?.money) bonusMoney += ach.reward.money;
        if (ach.reward?.statBoost) {
          for (const [k, v] of Object.entries(ach.reward.statBoost)) {
            const key = k as keyof PlayerStats;
            statBoosts[key] = Math.min(100, (statBoosts[key] ?? player.stats[key]) + (v as number));
          }
        }
      }

      const newStats = { ...player.stats, ...statBoosts };

      set({
        missions: { ...missions, achievements: updatedAch },
        player: { ...player, balance: player.balance + bonusMoney, stats: newStats },
        achievementToastQueue: [...get().achievementToastQueue, ...newlyUnlocked],
      });
    } else {
      // Still update progress even if nothing unlocked
      const hasProgressChange = updatedAch.some((a, i) => a.progress !== missions.achievements[i].progress);
      if (hasProgressChange) {
        set({ missions: { ...missions, achievements: updatedAch } });
      }
    }
  },

  achievementToastQueue: [],
  dismissAchievementToast: () => {
    set((state) => ({
      achievementToastQueue: state.achievementToastQueue.slice(1),
    }));
  },

  // ==================== Banking ====================

  banking: {
    loans: [],
    deposits: [],
    totalLoansTaken: 0,
    totalDepositsOpened: 0,
    totalInterestPaid: 0,
    totalInterestEarned: 0,
  },
  bankTemplates: BANK_TEMPLATES,

  canTakeLoan: (bankId, packageId) => {
    const { player, businesses, banking } = get();
    const bank = BANK_TEMPLATES.find((b) => b.id === bankId);
    if (!bank) return { eligible: false, reason: 'بانک یافت نشد' };
    if (player.level < bank.unlockLevel) return { eligible: false, reason: `سطح ${bank.unlockLevel} لازم است` };
    const pkg = bank.loanPackages.find((p) => p.id === packageId);
    if (!pkg) return { eligible: false, reason: 'بسته وام یافت نشد' };
    if (player.level < pkg.requiredLevel) return { eligible: false, reason: `سطح ${pkg.requiredLevel} لازم است` };
    const totalAssets = calcEmpireValue(player, businesses);
    if (totalAssets < pkg.requiredAssets) return { eligible: false, reason: `حداقل ${pkg.requiredAssets.toLocaleString('fa-IR')} دارایی لازم است` };
    if (banking.loans.find((l) => l.bankId === bankId)) return { eligible: false, reason: 'وام فعال از این بانک دارید' };
    if (banking.loans.length >= BANK_CONFIG.maxTotalLoans) return { eligible: false, reason: 'حداکثر تعداد وام فعال' };
    return { eligible: true };
  },

  takeLoan: (bankId, packageId) => {
    const { canTakeLoan } = get();
    const check = canTakeLoan(bankId, packageId);
    if (!check.eligible) return false;
    const bank = BANK_TEMPLATES.find((b) => b.id === bankId)!;
    const pkg = bank.loanPackages.find((p) => p.id === packageId)!;
    set((state) => ({
      player: { ...state.player, balance: state.player.balance + pkg.amount },
      banking: {
        ...state.banking,
        totalLoansTaken: state.banking.totalLoansTaken + 1,
        loans: [...state.banking.loans, {
          id: `loan-${Date.now()}`,
          bankId,
          packageId,
          originalAmount: pkg.amount,
          totalPayback: pkg.totalPayback,
          installmentAmount: pkg.installmentAmount,
          installmentCount: pkg.installmentCount,
          paidInstallments: 0,
          installmentIntervalMs: pkg.installmentIntervalMs,
          nextInstallmentAt: Date.now() + pkg.installmentIntervalMs,
          latePenaltyRate: pkg.latePenaltyRate,
          accruedPenalty: 0,
          takenAt: Date.now(),
          missedPayments: 0,
        }],
      },
    }));
    return true;
  },

  processInstallments: () => {
    const { banking, player } = get();
    if (banking.loans.length === 0) return;
    const now = Date.now();
    let balance = player.balance;
    let totalInterestPaid = banking.totalInterestPaid;
    const updatedLoans = banking.loans.filter((loan) => {
      if (now < loan.nextInstallmentAt) return true; // not due yet
      const totalDue = loan.installmentAmount + loan.accruedPenalty;
      if (balance >= totalDue) {
        balance -= totalDue;
        const interestPortion = (loan.totalPayback - loan.originalAmount) / loan.installmentCount;
        totalInterestPaid += interestPortion + loan.accruedPenalty;
        loan.paidInstallments += 1;
        loan.accruedPenalty = 0;
        loan.missedPayments = 0;
        if (loan.paidInstallments >= loan.installmentCount) {
          return false; // fully paid — remove
        }
        loan.nextInstallmentAt = now + loan.installmentIntervalMs;
      } else {
        // insufficient balance — penalty
        const penalty = Math.round(loan.installmentAmount * loan.latePenaltyRate);
        loan.accruedPenalty += penalty;
        loan.missedPayments += 1;
        loan.nextInstallmentAt = now + loan.installmentIntervalMs;
      }
      return true;
    });
    set((state) => ({
      player: { ...state.player, balance },
      banking: { ...state.banking, loans: updatedLoans, totalInterestPaid },
    }));
  },

  canDeposit: (bankId, amount) => {
    const { player, banking } = get();
    const bank = BANK_TEMPLATES.find((b) => b.id === bankId);
    if (!bank) return { eligible: false, reason: 'بانک یافت نشد' };
    if (player.level < bank.unlockLevel) return { eligible: false, reason: `سطح ${bank.unlockLevel} لازم است` };
    if (banking.deposits.find((d) => d.bankId === bankId)) return { eligible: false, reason: 'سپرده فعال در این بانک دارید' };
    if (banking.deposits.length >= BANK_CONFIG.maxTotalDeposits) return { eligible: false, reason: 'حداکثر تعداد سپرده فعال' };
    if (amount < bank.minDepositAmount) return { eligible: false, reason: `حداقل ${bank.minDepositAmount.toLocaleString('fa-IR')} تومان` };
    if (amount > bank.maxDepositAmount) return { eligible: false, reason: `حداکثر ${bank.maxDepositAmount.toLocaleString('fa-IR')} تومان` };
    if (player.balance < amount) return { eligible: false, reason: 'موجودی کافی نیست' };
    return { eligible: true };
  },

  deposit: (bankId, amount) => {
    const { canDeposit } = get();
    const check = canDeposit(bankId, amount);
    if (!check.eligible) return false;
    const bank = BANK_TEMPLATES.find((b) => b.id === bankId)!;
    set((state) => ({
      player: { ...state.player, balance: state.player.balance - amount },
      banking: {
        ...state.banking,
        totalDepositsOpened: state.banking.totalDepositsOpened + 1,
        deposits: [...state.banking.deposits, {
          id: `dep-${Date.now()}`,
          bankId,
          amount,
          interestRate: bank.depositInterestRate,
          depositedAt: Date.now(),
          accruedInterest: 0,
          lastInterestAt: Date.now(),
          interestIntervalMs: bank.depositInterestIntervalMs,
        }],
      },
    }));
    return true;
  },

  withdraw: (bankId) => {
    const { banking } = get();
    const deposit = banking.deposits.find((d) => d.bankId === bankId);
    if (!deposit) return;
    const bank = BANK_TEMPLATES.find((b) => b.id === bankId)!;
    const netInterest = Math.round(deposit.accruedInterest * (1 - bank.earlyWithdrawalPenaltyRate));
    const totalReturn = deposit.amount + netInterest;
    set((state) => ({
      player: { ...state.player, balance: state.player.balance + totalReturn },
      banking: {
        ...state.banking,
        totalInterestEarned: state.banking.totalInterestEarned + netInterest,
        deposits: state.banking.deposits.filter((d) => d.bankId !== bankId),
      },
    }));
  },

  accrueDepositInterest: () => {
    const { banking } = get();
    if (banking.deposits.length === 0) return;
    const now = Date.now();
    let changed = false;
    const updatedDeposits = banking.deposits.map((dep) => {
      if (now - dep.lastInterestAt >= dep.interestIntervalMs) {
        changed = true;
        const interest = Math.round(dep.amount * dep.interestRate);
        return { ...dep, accruedInterest: dep.accruedInterest + interest, lastInterestAt: now };
      }
      return dep;
    });
    if (changed) {
      set((state) => ({
        banking: { ...state.banking, deposits: updatedDeposits },
      }));
    }
  },

  // ==================== AI Rivals ====================

  rivals: {
    rivals: RIVAL_TEMPLATES.map((t) => ({
      ...t,
      wealth: t.unlockLevel * 50_000,
      level: Math.max(1, t.unlockLevel - 2),
      businessCount: Math.max(1, Math.floor(t.unlockLevel / 3)),
      lastLevelUpAt: 0,
      lastNewsAt: 0,
      active: false,
    })),
    lastRivalTickAt: 0,
  },

  tickRivals: () => {
    const { player, rivals, news } = get();
    const now = Date.now();
    const updatedNews = [...news];
    let changed = false;

    const updatedRivals = rivals.rivals.map((rival) => {
      const r = { ...rival };

      // Unlock check
      if (!r.active && player.level >= r.unlockLevel) {
        r.active = true;
        changed = true;
        const tpl = RIVAL_NEWS_TEMPLATES.unlocked(r.name);
        updatedNews.unshift({
          id: `news-rival-unlock-${r.id}-${now}`,
          title: tpl.title,
          summary: tpl.summary,
          category: 'rival',
          icon: r.avatar,
          timestamp: now,
          isBreaking: true,
        });
      }

      if (!r.active) return r;
      changed = true;

      // Wealth growth
      const mult = RIVAL_CONFIG.personalityMultipliers[r.personality] ?? 1.0;
      const growth = r.baseGrowthRate * r.level * mult * (1 + Math.random() * 0.3);
      r.wealth = Math.round(r.wealth + growth);

      // Level up check
      if (r.level < RIVAL_CONFIG.maxRivalLevel && r.wealth > r.level * RIVAL_CONFIG.levelUpWealthThreshold) {
        r.level += 1;
        r.lastLevelUpAt = now;
        if (Math.random() < 0.4) r.businessCount += 1;
        if (now - r.lastNewsAt > RIVAL_CONFIG.newsMinIntervalMs) {
          const tpl = RIVAL_NEWS_TEMPLATES.levelUp(r.name, r.level);
          updatedNews.unshift({
            id: `news-rival-lvl-${r.id}-${now}`,
            title: tpl.title, summary: tpl.summary,
            category: 'rival', icon: r.avatar, timestamp: now,
          });
          r.lastNewsAt = now;
        }
      }

      // Random news (~10% chance, throttled)
      if (Math.random() < 0.10 && now - r.lastNewsAt > RIVAL_CONFIG.newsMinIntervalMs) {
        const roll = Math.random();
        let tpl;
        if (roll < 0.4) {
          tpl = RIVAL_NEWS_TEMPLATES.newBusiness(r.name, r.businessCount);
        } else {
          // Wealth milestone (round to nearest 100k)
          const milestone = Math.floor(r.wealth / 100_000) * 100_000;
          tpl = RIVAL_NEWS_TEMPLATES.wealthMilestone(r.name, milestone);
        }
        updatedNews.unshift({
          id: `news-rival-${r.id}-${now}`,
          title: tpl.title, summary: tpl.summary,
          category: 'rival', icon: r.avatar, timestamp: now,
        });
        r.lastNewsAt = now;
      }

      return r;
    });

    if (changed) {
      set({
        rivals: { rivals: updatedRivals, lastRivalTickAt: now },
        news: updatedNews.slice(0, 20),
      });
    }
  },

  getDynamicLeaderboard: () => {
    const { player, businesses, rivals } = get();
    const playerEntry: LeaderboardEntry = {
      rank: 0,
      playerId: player.id,
      username: player.username,
      avatar: player.avatar,
      wealth: player.balance,
      level: player.level,
      businessCount: businesses.length,
    };
    const rivalEntries: LeaderboardEntry[] = rivals.rivals
      .filter((r) => r.active)
      .map((r) => ({
        rank: 0,
        playerId: r.id,
        username: r.name,
        avatar: r.avatar,
        wealth: r.wealth,
        level: r.level,
        businessCount: r.businessCount,
      }));
    return [playerEntry, ...rivalEntries]
      .sort((a, b) => b.wealth - a.wealth)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));
  },

  // ==================== Supermarket Deep System ====================

  supermarketStates: {},

  initSupermarketState: (businessId) => {
    const { supermarketStates, businesses } = get();
    if (supermarketStates[businessId]) return;
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz || biz.type !== 'supermarket') return;

    const tier = getSupermarketTier(biz.level);
    const initial = createInitialSupermarketState();
    // تعداد قفسه و صندوق بر اساس تایر
    while (initial.shelves.length < tier.shelfSlots) {
      initial.shelves.push({
        id: `shelf-${initial.shelves.length + 1}`,
        productId: null,
        quantity: 0,
        maxCapacity: 30,
      });
    }
    while (initial.checkouts.length < tier.checkoutLanes) {
      initial.checkouts.push({
        id: initial.checkouts.length + 1,
        speed: SUPERMARKET_CONFIG.checkoutBaseSpeed,
        unlocked: true,
      });
    }
    initial.currentTier = tier.tier;

    set({ supermarketStates: { ...get().supermarketStates, [businessId]: initial } });
  },

  stockShelf: (businessId, shelfId, productId, quantity) => {
    const { supermarketStates, player, businesses } = get();
    const smState = supermarketStates[businessId];
    if (!smState) return;
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return;

    const shelf = smState.shelves.find((s) => s.id === shelfId);
    if (!shelf) return;

    const product = SHELF_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    // بررسی تایر
    const tier = getSupermarketTier(biz.level);
    if (product.unlockTier > tier.tier) return;

    // اگه قفسه محصول دیگه‌ای داره باید اول خالی بشه
    if (shelf.productId && shelf.productId !== productId) return;

    const spaceLeft = shelf.maxCapacity - shelf.quantity;
    const actualQty = Math.min(quantity, spaceLeft);
    if (actualQty <= 0) return;

    const cost = Math.round(actualQty * product.buyPrice * SUPERMARKET_CONFIG.shelfRestockCost);
    if (player.balance < cost) return;

    set((state) => ({
      supermarketStates: {
        ...state.supermarketStates,
        [businessId]: {
          ...smState,
          shelves: smState.shelves.map((s) =>
            s.id === shelfId
              ? { ...s, productId, quantity: s.quantity + actualQty }
              : s
          ),
        },
      },
      player: { ...state.player, balance: state.player.balance - cost },
    }));
  },

  clearShelf: (businessId, shelfId) => {
    const { supermarketStates } = get();
    const smState = supermarketStates[businessId];
    if (!smState) return;

    set((state) => ({
      supermarketStates: {
        ...state.supermarketStates,
        [businessId]: {
          ...smState,
          shelves: smState.shelves.map((s) =>
            s.id === shelfId
              ? { ...s, productId: null, quantity: 0 }
              : s
          ),
        },
      },
    }));
  },

  tickSupermarket: (businessId) => {
    const { supermarketStates, businesses, player } = get();
    const smState = supermarketStates[businessId];
    if (!smState) return;
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz || biz.type !== 'supermarket') return;

    const now = Date.now();
    const elapsed = (now - smState.lastCustomerTickAt) / 1000;
    if (elapsed < SUPERMARKET_CONFIG.customerTickInterval) return;

    const tier = getSupermarketTier(biz.level);
    const tierMult = SUPERMARKET_CONFIG.tierCustomerMultiplier[tier.tier - 1] ?? 1;

    // --- بروزرسانی تایر (اگه لول بالا رفته) ---
    let updatedShelves = [...smState.shelves];
    let updatedCheckouts = [...smState.checkouts];
    if (tier.tier > smState.currentTier) {
      // اضافه کردن قفسه‌های جدید
      while (updatedShelves.length < tier.shelfSlots) {
        updatedShelves.push({
          id: `shelf-${updatedShelves.length + 1}`,
          productId: null,
          quantity: 0,
          maxCapacity: 30,
        });
      }
      // اضافه کردن صندوق‌های جدید
      while (updatedCheckouts.length < tier.checkoutLanes) {
        updatedCheckouts.push({
          id: updatedCheckouts.length + 1,
          speed: SUPERMARKET_CONFIG.checkoutBaseSpeed,
          unlocked: true,
        });
      }
    }

    // --- بوست‌های فعال ---
    const activeBoosts = smState.boosts.filter((b) => b.expiresAt > now);
    const salesSpeedBoost = activeBoosts
      .filter((b) => b.type === 'sales_speed')
      .reduce((m, b) => m * b.multiplier, 1);
    const revenueBoost = activeBoosts
      .filter((b) => b.type === 'revenue')
      .reduce((m, b) => m * b.multiplier, 1);

    // --- فروش از قفسه‌ها ---
    const elapsedMin = elapsed / 60;
    // کل ظرفیت صندوق (مشتری/دقیقه)
    const checkoutCapacity = updatedCheckouts
      .filter((c) => c.unlocked)
      .reduce((sum, c) => sum + c.speed, 0);
    // حداکثر مشتری = ظرفیت صندوق × زمان × ضریب تایر
    const maxCustomers = Math.floor(checkoutCapacity * elapsedMin * tierMult);

    let totalSold = 0;
    let totalRevenue = 0;
    let customersServed = 0;
    let remainingCustomerDemand = maxCustomers;

    // فروش از هر قفسه بر اساس سرعت فروش محصول
    updatedShelves = updatedShelves.map((shelf) => {
      if (!shelf.productId || shelf.quantity <= 0 || remainingCustomerDemand <= 0) return shelf;

      const product = SHELF_PRODUCTS.find((p) => p.id === shelf.productId);
      if (!product) return shelf;

      // حداکثر فروش = سرعت فروش ذاتی × زمان × بوست
      const maxSellable = Math.floor(product.salesSpeed * elapsedMin * salesSpeedBoost);
      const actualSold = Math.min(maxSellable, shelf.quantity, remainingCustomerDemand);

      if (actualSold > 0) {
        totalSold += actualSold;
        totalRevenue += actualSold * product.sellPrice;
        customersServed += Math.ceil(actualSold / 2); // هر مشتری ~2 محصول
        remainingCustomerDemand -= actualSold;
      }

      return { ...shelf, quantity: shelf.quantity - actualSold };
    });

    // اعمال بوست درآمد
    totalRevenue = Math.round(totalRevenue * revenueBoost);

    // --- سفارش‌های ویژه: پیشرفت ---
    let updatedOrders = smState.activeOrders.map((order) => {
      if (order.completed || order.failed) return order;
      if (now > order.deadline) return { ...order, failed: true };
      if (!order.accepted) return order;

      // بررسی تکمیل سفارش
      const allMet = order.requiredProducts.every((req) => {
        const shelf = updatedShelves.find((s) => s.productId === req.productId);
        return shelf && shelf.quantity >= req.quantity;
      });

      if (allMet) {
        // کم کردن از قفسه‌ها
        updatedShelves = updatedShelves.map((shelf) => {
          const req = order.requiredProducts.find((r) => r.productId === shelf.productId);
          if (!req) return shelf;
          return { ...shelf, quantity: shelf.quantity - req.quantity };
        });

        // محاسبه پاداش
        const orderRevenue = order.requiredProducts.reduce((sum, req) => {
          const product = SHELF_PRODUCTS.find((p) => p.id === req.productId);
          return sum + (product ? product.sellPrice * req.quantity : 0);
        }, 0);
        totalRevenue += Math.round(orderRevenue * order.bonusMultiplier);

        return { ...order, completed: true };
      }
      return order;
    });

    // --- تولید سفارش جدید ---
    const activeOrderCount = updatedOrders.filter((o) => !o.completed && !o.failed).length;
    if (tier.tier >= 3 && activeOrderCount < SUPERMARKET_CONFIG.maxActiveOrders) {
      const stockedIds = updatedShelves.filter((s) => s.productId).map((s) => s.productId!);
      const newOrder = generateSupermarketOrder(tier.tier, stockedIds);
      if (newOrder) {
        updatedOrders = [...updatedOrders, newOrder];
      }
    }

    // --- حذف سفارش‌های قدیمی (بعد از ۵ دقیقه) ---
    updatedOrders = updatedOrders.filter(
      (o) => !(o.completed || o.failed) || now - o.createdAt < 300_000
    );

    // --- بوست از تکمیل سفارش ---
    const justCompleted = updatedOrders.filter(
      (o) => o.completed && !smState.activeOrders.find((old) => old.id === o.id && old.completed)
    );
    const newBoosts: SupermarketBoost[] = [...activeBoosts];
    for (const _ of justCompleted) {
      newBoosts.push({
        type: 'sales_speed',
        multiplier: 1.5,
        expiresAt: now + SUPERMARKET_CONFIG.boostDuration,
        label: '×1.5 سرعت فروش',
      });
      // Progress mission
      setTimeout(() => get().progressMission('complete_special_order', 1, 'supermarket'), 0);
    }

    set((state) => ({
      supermarketStates: {
        ...state.supermarketStates,
        [businessId]: {
          ...smState,
          shelves: updatedShelves,
          checkouts: updatedCheckouts,
          activeOrders: updatedOrders,
          boosts: newBoosts,
          customersInStore: Math.min(remainingCustomerDemand > 0 ? maxCustomers - remainingCustomerDemand : maxCustomers, 20),
          customersServed: smState.customersServed + customersServed,
          totalShelfProductsSold: smState.totalShelfProductsSold + totalSold,
          totalShelfRevenue: smState.totalShelfRevenue + totalRevenue,
          lastCustomerTickAt: now,
          currentTier: tier.tier,
        },
      },
      player: totalRevenue > 0
        ? { ...state.player, balance: state.player.balance + totalRevenue }
        : state.player,
    }));

    // Mission progress
    if (totalSold > 0) {
      setTimeout(() => get().progressMission('sell_units', totalSold, 'supermarket'), 0);
    }
    if (totalRevenue > 0) {
      setTimeout(() => get().progressMission('earn_total', totalRevenue, 'supermarket'), 0);
    }
  },

  acceptSupermarketOrder: (businessId, orderId) => {
    const { supermarketStates } = get();
    const smState = supermarketStates[businessId];
    if (!smState) return;

    set((state) => ({
      supermarketStates: {
        ...state.supermarketStates,
        [businessId]: {
          ...smState,
          activeOrders: smState.activeOrders.map((o) =>
            o.id === orderId ? { ...o, accepted: true } : o
          ),
        },
      },
    }));
  },

  getSupermarketState: (businessId) => {
    return get().supermarketStates[businessId] ?? null;
  },

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}), {
  name: 'jabolgha-save',
  version: 6,
  migrate: (persisted: unknown, version: number) => {
    const state = persisted as Record<string, unknown>;
    if (version < 2 && state.missions) {
      const missions = state.missions as Record<string, unknown>;
      if (!('totalUpgrades' in missions)) {
        missions.totalUpgrades = 0;
      }
      if (Array.isArray(missions.achievements)) {
        missions.achievements = missions.achievements.map((a: Record<string, unknown>) => ({
          ...a,
          progress: a.unlockedAt ? (a.target as number) : 0,
          rarity: a.rarity ?? (a.tier === 'diamond' ? 'legendary' : a.tier === 'gold' ? 'epic' : a.tier === 'silver' ? 'rare' : 'common'),
          category: a.category ?? 'milestone',
          reward: a.reward ?? { money: 0 },
        }));
      }
    }
    if (version < 3) {
      // Migrate businesses
      if (Array.isArray(state.businesses)) {
        state.businesses = (state.businesses as Record<string, unknown>[]).map((biz) => {
          // Add new fields
          if (!('baseProductionRate' in biz)) biz.baseProductionRate = (biz.baseRevenue as number) ?? 3;
          if (!('baseSaleRate' in biz)) biz.baseSaleRate = 2;
          if (!('inventory' in biz)) {
            biz.inventory = { productId: 'prod-generic', quantity: 0, maxCapacity: 30 };
          }
          if (!('fractionalProduced' in biz)) biz.fractionalProduced = 0;
          if (!('fractionalSold' in biz)) biz.fractionalSold = 0;
          // Remove old fields
          delete biz.pendingRevenue;
          delete biz.maxPendingCycles;
          delete biz.baseRevenue;
          // Migrate employees
          if (Array.isArray(biz.employees)) {
            biz.employees = (biz.employees as Record<string, unknown>[]).map((emp) => {
              if (!('productionBoost' in emp)) {
                const oldRole = emp.role as string;
                // Map old roles to new
                if (oldRole === 'base') emp.role = 'production';
                else if (['manager', 'marketer', 'sales'].includes(oldRole)) emp.role = 'sales';
                else if (oldRole === 'accountant') emp.role = 'warehouse';
                // Map boosts
                emp.productionBoost = emp.role === 'production' ? (emp.revenueBoost ?? 0) : 0;
                emp.salesBoost = emp.role === 'sales' ? (emp.revenueBoost ?? 0) : 0;
                emp.capacityBoost = emp.role === 'warehouse' ? 5 : 0;
              }
              delete emp.revenueBoost;
              delete emp.autoCollect;
              return emp;
            });
          }
          // Migrate products
          if (Array.isArray(biz.products)) {
            biz.products = (biz.products as Record<string, unknown>[]).map((prod) => {
              if (!('productionBoost' in prod)) {
                prod.productionBoost = (prod.revenueBoost as number) ?? 0;
                prod.capacityBoost = 0;
              }
              delete prod.revenueBoost;
              return prod;
            });
          }
          return biz;
        });
      }
      // Initialize orderBoard
      if (!state.orderBoard) {
        state.orderBoard = {
          availableOrders: [],
          acceptedOrders: [],
          completedOrderIds: [],
          failedOrderIds: [],
          lastOrderGenerationAt: 0,
        };
      }
    }
    if (version < 4) {
      if (!state.banking) {
        state.banking = {
          loans: [],
          deposits: [],
          totalLoansTaken: 0,
          totalDepositsOpened: 0,
          totalInterestPaid: 0,
          totalInterestEarned: 0,
        };
      }
    }
    if (version < 5) {
      if (!state.rivals) {
        state.rivals = {
          rivals: RIVAL_TEMPLATES.map((t) => ({
            ...t,
            wealth: t.unlockLevel * 50_000,
            level: Math.max(1, t.unlockLevel - 2),
            businessCount: Math.max(1, Math.floor(t.unlockLevel / 3)),
            lastLevelUpAt: 0,
            lastNewsAt: 0,
            active: false,
          })),
          lastRivalTickAt: 0,
        };
      }
    }
    if (version < 6) {
      if (!state.supermarketStates) {
        state.supermarketStates = {};
      }
    }
    return state;
  },
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
    orderBoard: state.orderBoard,
    banking: state.banking,
    rivals: state.rivals,
    supermarketStates: state.supermarketStates,
  }),
}));
