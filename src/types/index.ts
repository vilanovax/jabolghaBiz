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
export type EmployeeRole =
  | 'base'        // نیروی پایه (برنامه‌نویس، کشاورز، آشپز...)
  | 'manager'     // مدیر — ضریب افزایش درآمد
  | 'accountant'  // حسابدار — جمع‌آوری اتوماتیک درآمد
  | 'marketer'    // بازاریاب — افزایش درآمد محصولات
  | 'sales';      // فروش — افزایش سرعت فروش

// تایر نیرو — سطح‌بندی
export type EmployeeTier = 'worker' | 'senior' | 'manager' | 'accountant' | 'marketer' | 'legendary';

export interface EmployeeTemplate {
  id: string;
  name: string;
  role: EmployeeRole;
  roleName: string;       // نام فارسی نقش
  icon: string;
  salary: number;         // حقوق در هر سیکل
  revenueBoost: number;   // درصد افزایش درآمد (مثلاً 0.2 = 20%)
  autoCollect: boolean;   // آیا جمع‌آوری اتوماتیک فعال میکنه؟
  hireCost: number;       // هزینه استخدام
  description: string;
  // سیستم درخت رشد
  unlockLevel: number;    // سطح شرکت برای آنلاک
  tier: EmployeeTier;     // تایر نیرو
  maxUpgradeLevel: number; // حداکثر سطح نیرو (1 یا 3)
  expenseReduction?: number; // کاهش هزینه (برای مکانیک و مدیر زنجیره تأمین)
  cycleDurationReduction?: number; // کاهش زمان سیکل (برای نیروهای legendary)
}

export interface HiredEmployee {
  id: string;
  templateId: string;
  name: string;
  role: EmployeeRole;
  roleName: string;
  icon: string;
  salary: number;
  revenueBoost: number;
  autoCollect: boolean;
  hiredAt: number;
  // سیستم ارتقا
  employeeLevel: number;  // سطح فعلی نیرو (1-3)
  maxUpgradeLevel: number;
  baseHireCost: number;   // هزینه اولیه — برای محاسبه هزینه ارتقا
  // ارتقا زمان‌دار
  upgradeStartedAt: number | null;  // timestamp شروع ارتقا (null = در حال ارتقا نیست)
  upgradeEndsAt: number | null;     // timestamp پایان ارتقا
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
  revenueBoost: number;   // افزایش درآمد هر سیکل
  unlocked: boolean;
  requirements?: ProductRequirements;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  level: number;
  icon: string;

  // موقعیت مکانی
  neighborhoodId?: string;       // آیدی محله

  // سیستم درآمد تایمری
  baseRevenue: number;        // درآمد پایه هر سیکل
  cycleDuration: number;      // مدت هر سیکل (ثانیه)
  lastCycleAt: number;        // timestamp آخرین سیکل
  pendingRevenue: number;     // درآمد جمع‌نشده
  maxPendingCycles: number;   // حداکثر سیکل‌های انباشته

  // هزینه‌ها
  expenses: number;           // هزینه‌های هر سیکل
  upgradeCost: number;

  // نیروها و محصولات
  employees: HiredEmployee[];
  products: BusinessProduct[];

  // دفتر کار
  officeLevel: number;    // سطح دفتر (1-4)

  // ظرفیت‌ها (مشتق از سطح دفتر)
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
  baseRevenue: number;
  cycleDuration: number;       // ثانیه
  baseExpenses: number;
  maxPendingCycles: number;
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

export type NewsCategory = 'market' | 'ranking' | 'gold' | 'currency' | 'crypto' | 'stock' | 'event';

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
  | 'complete_missions';     // تکمیل N ماموریت

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

// ==================== NAVIGATION ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
