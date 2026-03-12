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

// ==================== BUSINESS ====================

export type BusinessType =
  | 'supermarket'
  | 'restaurant'
  | 'factory'
  | 'app_startup'
  | 'transport'
  | 'farming';

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

// ==================== NAVIGATION ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
