// ==================== PLAYER ====================

export interface PlayerStats {
  happiness: number;    // 0-100
  hunger: number;       // 0-100
  energy: number;       // 0-100
  intelligence: number; // 0-100
  experience: number;   // 0-100
}

export interface PlayerProfile {
  id: string;
  avatar: string;
  username: string;
  level: number;
  reputation: number;
  balance: number;
  stats: PlayerStats;
  createdAt: string;
}

// ==================== LOCATION ====================

export type BusinessType =
  | 'supermarket'
  | 'restaurant'
  | 'factory'
  | 'app_startup'
  | 'transport'
  | 'farming';

// ==================== SPECIALTY ====================

export interface SpecialtyMilestone {
  levelThreshold: number;
  name: string;
  icon: string;
  description: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  icon: string;
  description: string;
  revenueMultiplier: number;     // ضریب درآمد (1.0 = عادی)
  expenseMultiplier: number;     // ضریب هزینه‌ها (1.0 = عادی)
  customerTraffic: number;       // تردد مشتری — ضریب سرعت سیکل (1.0 = عادی, >1 = سریعتر)
  rentMultiplier: number;        // ضریب اجاره دفتر
  bestFor: BusinessType[];       // نوع کسب‌وکارهای مناسب این محله
  unlockLevel: number;           // حداقل سطح بازیکن برای دسترسی
}

export interface City {
  id: string;
  name: string;
  icon: string;
  description: string;
  neighborhoods: Neighborhood[];
}

// ==================== BUSINESS ====================

// نقش‌های کارمندان
export type EmployeeRole = 'production' | 'sales' | 'warehouse';

// تایر نیرو — سطح‌بندی
export type EmployeeTier = 'worker' | 'senior' | 'expert' | 'legendary';

export interface EmployeeTemplate {
  id: string;
  name: string;
  role: EmployeeRole;
  roleName: string;       // نام فارسی نقش
  icon: string;
  salary: number;         // حقوق در هر سیکل
  hireCost: number;       // هزینه استخدام
  description: string;
  // سیستم درخت رشد
  unlockLevel: number;    // سطح شرکت برای آنلاک
  tier: EmployeeTier;     // تایر نیرو
  maxUpgradeLevel: number; // حداکثر سطح نیرو (1 یا 3)
  // بوست‌های تخصصی
  productionBoost?: number;       // واحد اضافه تولید در هر سیکل (نقش تولید)
  salesBoost?: number;            // واحد اضافه فروش در دقیقه (نقش فروش)
  capacityBoost?: number;         // ظرفیت اضافه انبار (نقش انبار)
  orderQualityBoost?: number;     // شانس بهتر سفارش ویژه (نقش فروش)
  expenseReduction?: number;      // کاهش هزینه
  cycleDurationReduction?: number; // کاهش زمان سیکل (legendary)
}

export interface HiredEmployee {
  id: string;
  templateId: string;
  name: string;
  role: EmployeeRole;
  roleName: string;
  icon: string;
  salary: number;
  hiredAt: number;
  // بوست‌های تخصصی
  productionBoost: number;
  salesBoost: number;
  capacityBoost: number;
  // سیستم ارتقا
  employeeLevel: number;  // سطح فعلی نیرو (1-3)
  maxUpgradeLevel: number;
  baseHireCost: number;   // هزینه اولیه — برای محاسبه هزینه ارتقا
  // ارتقا زمان‌دار
  upgradeStartedAt: number | null;
  upgradeEndsAt: number | null;
}

// سطوح دفتر کار
export interface OfficeTier {
  level: number;
  name: string;
  icon: string;
  area: number;           // متراژ (مترمربع)
  maxEmployees: number;
  maxProducts: number;
  rent: number;           // اجاره هر سیکل
  upgradeCost: number;    // هزینه ارتقا به این سطح
  requiredBusinessLevel: number; // حداقل سطح شرکت برای ارتقا
}

// پیش‌نیاز محصولات
export interface ProductRequirements {
  officeLevel?: number;
  employees?: { role: EmployeeRole; count: number }[];
  businessLevel?: number;
}

// محصولات شرکت (قابل آنلاک)
export interface BusinessProduct {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockCost: number;
  productionBoost: number;  // واحد اضافه تولید در هر سیکل
  capacityBoost: number;    // ظرفیت اضافه انبار
  revenueMultiplier?: number; // ضریب اضافه درآمد (مثلاً 0.1 = +10% سود)
  unlocked: boolean;
  requirements?: ProductRequirements;
}

export interface BusinessInventory {
  productId: string;     // نوع محصولی که تولید می‌شه
  quantity: number;      // تعداد فعلی در انبار
  maxCapacity: number;   // حداکثر ظرفیت
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  level: number;
  icon: string;

  // موقعیت مکانی
  neighborhoodId?: string;

  // سیستم تولید
  baseProductionRate: number;  // واحد تولید پایه در هر سیکل
  baseSaleRate: number;        // واحد فروش خودکار پایه در دقیقه
  cycleDuration: number;       // مدت هر سیکل (ثانیه)
  lastCycleAt: number;         // timestamp آخرین سیکل

  // انبار
  inventory: BusinessInventory;

  // ردیاب کسری (برای جلوگیری از خطای گرد کردن)
  fractionalProduced: number;
  fractionalSold: number;

  // هزینه‌ها
  expenses: number;
  upgradeCost: number;

  // نیروها و محصولات
  employees: HiredEmployee[];
  products: BusinessProduct[];

  // دفتر کار
  officeLevel: number;

  // ظرفیت‌ها
  maxEmployees: number;
  maxProducts: number;
  maxLevel: number;

  // تجهیزات اولیه
  initialEquipment: string;

  // ارتقا زمان‌دار
  upgradeStartedAt: number | null;
  upgradeEndsAt: number | null;
}

export interface BusinessTemplate {
  type: BusinessType;
  defaultName: string;
  icon: string;
  description: string;
  startCost: number;
  baseProductionRate: number;    // واحد تولید در هر سیکل
  baseSaleRate: number;          // واحد فروش خودکار در دقیقه
  baseInventoryCapacity: number; // ظرفیت پایه انبار
  productId: string;             // آیدی محصول تولیدی
  cycleDuration: number;         // ثانیه
  baseExpenses: number;
  maxEmployees: number;
  maxProducts: number;
  maxLevel: number;
  initialEquipment: string;
  availableEmployees: EmployeeTemplate[];
  availableProducts: BusinessProduct[];
}

// ==================== MARKET ====================

export type ProductCategory =
  | 'raw_material'
  | 'processed'
  | 'finished_good'
  | 'food'
  | 'tech'
  | 'service';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  icon: string;
  basePrice: number;
  currentPrice: number;
  supply: number;
  demand: number;
  baseSupply: number;
  baseDemand: number;
  priceHistory: number[];
}

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  listedAt: string;
}

export interface ProductionChain {
  input: { productId: string; quantity: number }[];
  output: { productId: string; quantity: number };
  businessType: BusinessType;
  duration: number;
}

// ==================== SOCIAL ====================

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  avatar: string;
  wealth: number;
  level: number;
  businessCount: number;
}

// ==================== AI RIVALS ====================

export type RivalPersonality = 'aggressive' | 'steady' | 'cautious' | 'opportunist' | 'flashy' | 'grinder';

export interface AIRival {
  id: string;
  name: string;
  avatar: string;
  personality: RivalPersonality;
  unlockLevel: number;
  wealth: number;
  level: number;
  businessCount: number;
  baseGrowthRate: number;
  orderAggressiveness: number;  // 0-1
  marketInfluence: number;      // 0-1
  lastLevelUpAt: number;
  lastNewsAt: number;
  active: boolean;
}

export interface RivalsState {
  rivals: AIRival[];
  lastRivalTickAt: number;
}

// ==================== LIFE ====================

export type LifeActionCategory = 'food' | 'rest' | 'education' | 'fitness' | 'entertainment';

export interface LifeAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: LifeActionCategory;
  cost: number;
  cooldownMs: number;          // زمان انتظار تا استفاده بعدی (ms)
  effect: Partial<PlayerStats>;
  requiredLevel?: number;
}

export interface LifeState {
  lastActionAt: Record<string, number>;   // actionId → timestamp آخرین استفاده
  lastStatDecayAt: number;                // timestamp آخرین کاهش خودکار
}

export interface HomeItem {
  id: string;
  name: string;
  icon: string;
  effect: Partial<PlayerStats>;
}

export interface FridayMarketItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  effect: Partial<PlayerStats>;
  available: boolean;
}

// ==================== NEWS ====================

export type NewsCategory = 'market' | 'ranking' | 'gold' | 'currency' | 'crypto' | 'stock' | 'event' | 'rival';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  icon: string;
  timestamp: number;
  isBreaking?: boolean;
  relatedBusinessType?: BusinessType;
}

// ==================== HOOKS & REWARDS ====================

export interface DailyBonusState {
  lastClaimDate: string | null;  // ISO date string (YYYY-MM-DD)
  streak: number;                // 0-7
}

export interface RushHourState {
  lastStartedAt: number;         // timestamp آخرین شروع
}

// ==================== RANDOM EVENTS ====================

export type EventSeverity = 'minor' | 'major';
export type EventEffect = 'revenue_multiplier' | 'expense_multiplier' | 'instant_balance';
export type EventScope = 'global' | 'business_type';

export interface EventResponseOption {
  id: string;
  label: string;
  icon: string;
  cost: number;
  effectMultiplier: number;  // 0=fully negate, 0.5=halve penalty, 1.3=amplify benefit
  description: string;
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: EventSeverity;
  scope: EventScope;
  targetBusinessType?: BusinessType;
  effect: EventEffect;
  effectValue: number;       // multiplier or % of balance
  durationMs: number;        // 0=instant
  isPositive: boolean;
  responseOptions?: EventResponseOption[];
  newsTitle: string;
  newsSummary: string;
}

export interface ActiveEvent {
  id: string;
  templateId: string;
  title: string;
  description: string;
  icon: string;
  severity: EventSeverity;
  scope: EventScope;
  targetBusinessType?: BusinessType;
  effect: EventEffect;
  effectValue: number;
  isPositive: boolean;
  startedAt: number;
  expiresAt: number;
  responded: boolean;
  responseUsed?: string;
}

export interface RandomEventState {
  activeEvents: ActiveEvent[];
  lastEventCheckAt: number;
  pendingEventId: string | null;  // instance id for modal
}

// ==================== SPECIAL ORDERS ====================

export type OrderStatus = 'available' | 'accepted' | 'delivered' | 'failed';

export interface SpecialOrder {
  id: string;
  companyName: string;
  companyIcon: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  totalPayment: number;
  deadline: number;           // timestamp انقضا
  createdAt: number;
  status: OrderStatus;
  acceptedAt?: number;
  deliveredQuantity: number;
  businessId?: string;        // کدوم شرکت قبول کرده
  penaltyRate: number;        // نرخ جریمه (مثلاً 0.2 = 20%)
}

export interface OrderBoardState {
  availableOrders: SpecialOrder[];
  acceptedOrders: SpecialOrder[];
  completedOrderIds: string[];
  failedOrderIds: string[];
  lastOrderGenerationAt: number;
}

// ==================== BANKING ====================

export type BankPersonality = 'conservative' | 'moderate' | 'risky';

export interface LoanPackage {
  id: string;
  name: string;
  amount: number;
  interestRate: number;           // e.g. 0.05 = 5%
  totalPayback: number;           // amount * (1 + interestRate)
  installmentCount: number;
  installmentAmount: number;      // totalPayback / installmentCount
  installmentIntervalMs: number;  // فاصله بین اقساط
  latePenaltyRate: number;        // e.g. 0.1 = 10% جریمه دیرکرد
  requiredLevel: number;
  requiredAssets: number;         // حداقل دارایی کل
}

export interface BankTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  personality: BankPersonality;
  unlockLevel: number;
  loanPackages: LoanPackage[];
  depositInterestRate: number;    // نرخ سود سپرده در هر بازه
  depositInterestIntervalMs: number;
  earlyWithdrawalPenaltyRate: number; // جریمه برداشت زودهنگام از سود
  minDepositAmount: number;
  maxDepositAmount: number;
}

export interface ActiveLoan {
  id: string;
  bankId: string;
  packageId: string;
  originalAmount: number;
  totalPayback: number;
  installmentAmount: number;
  installmentCount: number;
  paidInstallments: number;
  installmentIntervalMs: number;
  nextInstallmentAt: number;
  latePenaltyRate: number;
  accruedPenalty: number;
  takenAt: number;
  missedPayments: number;
}

export interface ActiveDeposit {
  id: string;
  bankId: string;
  amount: number;
  interestRate: number;
  depositedAt: number;
  accruedInterest: number;
  lastInterestAt: number;
  interestIntervalMs: number;
}

export interface BankingState {
  loans: ActiveLoan[];
  deposits: ActiveDeposit[];
  totalLoansTaken: number;
  totalDepositsOpened: number;
  totalInterestPaid: number;
  totalInterestEarned: number;
}

// ==================== MISSIONS & ACHIEVEMENTS ====================

export type MissionType = 'daily' | 'weekly' | 'one_time';

export type MissionCondition =
  | 'collect_revenue'        // جمع‌آوری درآمد N بار
  | 'earn_total'             // کسب N تومان (مجموع)
  | 'hire_employee'          // استخدام N نیرو
  | 'upgrade_business'       // ارتقای شرکت N بار
  | 'create_business'        // ساخت N شرکت
  | 'upgrade_office'         // ارتقای دفتر N بار
  | 'unlock_product'         // آنلاک N محصول
  | 'reach_business_level'   // رسیدن به سطح N شرکت
  | 'reach_balance'          // رسیدن به N تومان موجودی
  | 'own_businesses'         // داشتن N شرکت همزمان
  | 'total_employees'        // داشتن N نیرو مجموعا
  | 'respond_to_event'       // پاسخ به N رویداد
  | 'claim_daily_bonus'      // دریافت N بونوس روزانه
  | 'own_all_business_types' // داشتن همه انواع کسب‌وکار
  | 'reach_stat_intelligence'// رسیدن به N هوش
  | 'reach_stat_happiness'   // رسیدن به N شادی
  | 'reach_stat_energy'      // رسیدن به N انرژی
  | 'reach_player_level'     // رسیدن به سطح N بازیکن
  | 'total_upgrades'         // انجام N ارتقا مجموعا
  | 'complete_missions'      // تکمیل N ماموریت
  | 'produce_units'          // تولید N واحد محصول
  | 'sell_units'             // فروش N واحد
  | 'complete_special_order'; // تکمیل N سفارش ویژه

export interface MissionTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: MissionType;
  condition: MissionCondition;
  target: number;            // هدف (مثلاً ۳ بار جمع‌آوری)
  reward: number;            // جایزه تومانی
  xpReward?: number;         // جایزه تجربه
  businessTypeFilter?: BusinessType; // فقط برای ماموریت‌های تخصصی
}

export interface ActiveMission {
  id: string;                // instance id
  templateId: string;
  title: string;
  description: string;
  icon: string;
  type: MissionType;
  condition: MissionCondition;
  target: number;
  progress: number;          // پیشرفت فعلی
  reward: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;          // آیا جایزه دریافت شده؟
  assignedAt: number;        // timestamp اختصاص
  expiresAt: number;         // daily=24h, weekly=7d, one_time=never
  businessTypeFilter?: BusinessType; // فقط برای ماموریت‌های تخصصی
}

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type AchievementCategory = 'milestone' | 'collection' | 'stat' | 'action';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AchievementReward {
  money?: number;
  statBoost?: Partial<PlayerStats>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  rarity: AchievementRarity;
  category: AchievementCategory;
  condition: MissionCondition;
  target: number;
  progress: number;             // پیشرفت فعلی
  unlockedAt: number | null;    // timestamp یا null=قفل
  badge: string;                // ایموجی نشان
  reward: AchievementReward;    // جایزه آنلاک
}

export interface MissionsState {
  activeMissions: ActiveMission[];
  completedMissionIds: string[];   // template ids done (for one_time)
  lastDailyRefresh: string | null; // ISO date
  lastWeeklyRefresh: string | null;
  achievements: Achievement[];
  totalMissionsCompleted: number;
  totalUpgrades: number;           // شمارنده کل ارتقاها
}

// ==================== SUPERMARKET DEEP SYSTEM ====================

// دسته‌بندی کالاهای قفسه
export type ShelfCategory = 'essential' | 'fresh' | 'luxury' | 'household';

// کالای قابل چیدن روی قفسه
export interface ShelfProduct {
  id: string;
  name: string;
  icon: string;
  category: ShelfCategory;
  buyPrice: number;         // قیمت خرید (تامین) هر واحد
  sellPrice: number;        // قیمت فروش هر واحد
  salesSpeed: number;       // واحد فروش در دقیقه (سرعت فروش ذاتی)
  unlockTier: number;       // تایر آنلاک (1-5)
  description: string;
}

// یک ردیف قفسه در فروشگاه
export interface ShelfSlot {
  id: string;
  productId: string | null; // کالای چیده‌شده (null = خالی)
  quantity: number;         // موجودی فعلی
  maxCapacity: number;      // ظرفیت قفسه
}

// صندوق فروشگاه
export interface CheckoutLane {
  id: number;
  speed: number;            // مشتری سرویس‌شده در دقیقه
  unlocked: boolean;
}

// سفارش ویژه سوپرمارکتی
export interface SupermarketOrder {
  id: string;
  title: string;
  icon: string;
  requiredProducts: { productId: string; quantity: number }[];
  bonusMultiplier: number;  // ضریب سود (1.5 = +50%)
  deadline: number;         // timestamp پایان مهلت
  createdAt: number;
  accepted: boolean;
  completed: boolean;
  failed: boolean;
}

// بوست موقت سوپرمارکت
export interface SupermarketBoost {
  type: 'sales_speed' | 'customer_flow' | 'revenue';
  multiplier: number;       // مثلاً 2.0 = ×2
  expiresAt: number;        // timestamp انقضا
  label: string;
}

// تایر پیشرفت سوپرمارکت
export interface SupermarketTier {
  tier: number;
  name: string;
  icon: string;
  requiredLevel: number;
  shelfSlots: number;       // تعداد قفسه
  checkoutLanes: number;    // تعداد صندوق
  features: string[];       // قابلیت‌های آنلاک‌شده
}

// وضعیت کامل سوپرمارکت (هر بیزنس سوپرمارکتی یکی داره)
export interface SupermarketState {
  shelves: ShelfSlot[];
  checkouts: CheckoutLane[];
  activeOrders: SupermarketOrder[];
  boosts: SupermarketBoost[];
  customersInStore: number;
  customersServed: number;          // آمار کل
  totalShelfProductsSold: number;   // آمار کل فروش قفسه‌ای
  totalShelfRevenue: number;        // آمار کل درآمد قفسه‌ای
  lastCustomerTickAt: number;
  currentTier: number;
}

// ==================== MANAGERS ====================

export type ManagerClass = 'financial' | 'operational' | 'marketing';
export type ManagerRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ManagerAbility {
  id: string;
  name: string;
  description: string;
  icon: string;
  effectType: 'revenue_boost' | 'production_boost' | 'sales_boost';
  effectMultiplier: number;      // e.g. 2.0 = ×2
  durationMs: number;            // مدت فعال بودن
  cooldownMs: number;            // زمان انتظار
}

export interface ManagerTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  managerClass: ManagerClass;
  rarity: ManagerRarity;
  hireCost: number;
  salary: number;               // حقوق هر سیکل (از همه بیزنس‌ها کسر)
  passiveEffect: {
    type: 'revenue' | 'production_speed' | 'sale_rate';
    value: number;              // e.g. 0.08 = +8%
  };
  ability: ManagerAbility;
  unlockCondition?: {
    type: MissionCondition;
    target: number;
  };
  unlockLevel: number;          // حداقل لول بازیکن
  maxLevel: number;             // حداکثر لول مدیر (1-5)
}

export interface HiredManager {
  id: string;
  templateId: string;
  name: string;
  icon: string;
  managerClass: ManagerClass;
  rarity: ManagerRarity;
  salary: number;
  level: number;                // 1-5
  maxLevel: number;
  passiveEffect: {
    type: 'revenue' | 'production_speed' | 'sale_rate';
    value: number;
  };
  ability: ManagerAbility;
  lastAbilityUsedAt: number | null;
  abilityActiveUntil: number | null;
  upgradeStartedAt: number | null;
  upgradeEndsAt: number | null;
  hiredAt: number;
  baseHireCost: number;
}

export interface ManagersState {
  hiredManagers: HiredManager[];
  activeSlots: (string | null)[];  // [slot1_managerId, slot2_managerId]
  maxSlots: number;                // 1 or 2
}

// ==================== NAVIGATION ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
