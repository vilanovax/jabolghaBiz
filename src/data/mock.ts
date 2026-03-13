import {
  PlayerProfile,
  Business,
  BusinessTemplate,
  Product,
  NewsArticle,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
  EmployeeTemplate,
  BusinessProduct,
  OfficeTier,
} from '@/types';

// ==================== PLAYER ====================

export const mockPlayer: PlayerProfile = {
  id: 'player-1',
  avatar: '👤',
  username: 'تاجرباشی',
  level: 5,
  reputation: 72,
  balance: 150_000,
  stats: {
    happiness: 75,
    hunger: 60,
    energy: 80,
    intelligence: 65,
    experience: 45,
  },
  createdAt: '1404-10-25',
};

// ==================== EMPLOYEE TEMPLATES ====================
// هر شرکت ۷ نیرو — درخت رشد با unlockLevel و tier

const appStartupEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-as-1', name: 'برنامه‌نویس', role: 'base', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 1_500, revenueBoost: 0.2, autoCollect: false, hireCost: 12_000,
    description: 'افزایش ۲۰٪ درآمد تولید',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-as-2', name: 'برنامه‌نویس دوم', role: 'base', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 1_500, revenueBoost: 0.2, autoCollect: false, hireCost: 12_000,
    description: 'افزایش ۲۰٪ درآمد تولید',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-as-3', name: 'مدیر پروژه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_000, revenueBoost: 0.35, autoCollect: false, hireCost: 40_000,
    description: 'افزایش ۳۵٪ درآمد کل شرکت',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-as-4', name: 'حسابدار شرکت', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_500, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-as-5', name: 'بازاریاب دیجیتال', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, revenueBoost: 0.25, autoCollect: false, hireCost: 20_000,
    description: 'افزایش ۲۵٪ درآمد محصولات',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-as-7', name: 'CTO', role: 'manager', roleName: 'مدیر فنی', icon: '🧠',
    salary: 5_000, revenueBoost: 0.5, autoCollect: false, hireCost: 80_000,
    description: 'افزایش ۵۰٪ درآمد + کاهش ۱۰٪ زمان سیکل',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1, cycleDurationReduction: 0.1,
  },
];

const farmingEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-fm-1', name: 'کشاورز', role: 'base', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 1_000, revenueBoost: 0.2, autoCollect: false, hireCost: 8_000,
    description: 'افزایش ۲۰٪ برداشت محصول',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-fm-2', name: 'کشاورز دوم', role: 'base', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 1_000, revenueBoost: 0.2, autoCollect: false, hireCost: 8_000,
    description: 'افزایش ۲۰٪ برداشت محصول',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-fm-5', name: 'مدیر مزرعه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 2_800, revenueBoost: 0.35, autoCollect: false, hireCost: 40_000,
    description: 'افزایش ۳۵٪ درآمد مزرعه',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fm-4', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_000, revenueBoost: 0, autoCollect: true, hireCost: 25_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fm-6', name: 'بازاریاب', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 1_800, revenueBoost: 0.2, autoCollect: false, hireCost: 18_000,
    description: 'افزایش ۲۰٪ درآمد محصولات',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fm-7', name: 'متخصص کشاورزی ارگانیک', role: 'manager', roleName: 'متخصص', icon: '🌿',
    salary: 4_500, revenueBoost: 0.5, autoCollect: false, hireCost: 70_000,
    description: 'افزایش ۵۰٪ درآمد + محصول ویژه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
  },
];

const restaurantEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-rs-1', name: 'آشپز', role: 'base', roleName: 'آشپز', icon: '👨‍🍳',
    salary: 1_500, revenueBoost: 0.25, autoCollect: false, hireCost: 15_000,
    description: 'افزایش ۲۵٪ کیفیت و درآمد',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-rs-2', name: 'گارسون', role: 'base', roleName: 'گارسون', icon: '🍽️',
    salary: 1_000, revenueBoost: 0.15, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۱۵٪ رضایت مشتری',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-rs-5', name: 'مدیر رستوران', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_000, revenueBoost: 0.35, autoCollect: false, hireCost: 45_000,
    description: 'افزایش ۳۵٪ درآمد رستوران',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-rs-4', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_200, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-rs-6', name: 'بازاریاب', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 1_800, revenueBoost: 0.2, autoCollect: false, hireCost: 20_000,
    description: 'افزایش ۲۰٪ درآمد محصولات',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-rs-7', name: 'سرآشپز ستاره میشلن', role: 'manager', roleName: 'سرآشپز ویژه', icon: '⭐',
    salary: 5_500, revenueBoost: 0.5, autoCollect: false, hireCost: 85_000,
    description: 'افزایش ۵۰٪ درآمد + منوی VIP',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
  },
];

const factoryEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-fc-1', name: 'کارگر خط تولید', role: 'base', roleName: 'کارگر', icon: '👷',
    salary: 1_200, revenueBoost: 0.2, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۲۰٪ تولید',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-fc-2', name: 'کارگر دوم', role: 'base', roleName: 'کارگر', icon: '👷',
    salary: 1_200, revenueBoost: 0.2, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۲۰٪ تولید',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-fc-5', name: 'مدیر کارخانه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_500, revenueBoost: 0.35, autoCollect: false, hireCost: 50_000,
    description: 'افزایش ۳۵٪ درآمد کارخانه',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fc-4', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_500, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fc-6', name: 'بازاریاب صنعتی', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, revenueBoost: 0.2, autoCollect: false, hireCost: 22_000,
    description: 'افزایش ۲۰٪ فروش محصولات صنعتی',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-fc-7', name: 'مهندس ارشد اتوماسیون', role: 'manager', roleName: 'مهندس ارشد', icon: '🏗️',
    salary: 6_000, revenueBoost: 0.5, autoCollect: false, hireCost: 90_000,
    description: 'افزایش ۵۰٪ درآمد + کاهش ۱۵٪ هزینه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1, expenseReduction: 0.15,
  },
];

const supermarketEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-sm-1', name: 'صندوقدار', role: 'base', roleName: 'صندوقدار', icon: '🛒',
    salary: 1_000, revenueBoost: 0.15, autoCollect: false, hireCost: 8_000,
    description: 'افزایش ۱۵٪ سرعت فروش',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-sm-2', name: 'انباردار', role: 'base', roleName: 'انباردار', icon: '📦',
    salary: 1_200, revenueBoost: 0.2, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۲۰٪ ظرفیت انبار',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-sm-5', name: 'مدیر فروشگاه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_000, revenueBoost: 0.35, autoCollect: false, hireCost: 45_000,
    description: 'افزایش ۳۵٪ درآمد فروشگاه',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-sm-4', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_200, revenueBoost: 0, autoCollect: true, hireCost: 28_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-sm-6', name: 'بازاریاب', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, revenueBoost: 0.25, autoCollect: false, hireCost: 20_000,
    description: 'افزایش ۲۵٪ جذب مشتری',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-sm-7', name: 'مدیر زنجیره تأمین', role: 'manager', roleName: 'مدیر تأمین', icon: '🎯',
    salary: 5_000, revenueBoost: 0.4, autoCollect: false, hireCost: 75_000,
    description: 'افزایش ۴۰٪ درآمد + کاهش ۲۰٪ هزینه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1, expenseReduction: 0.2,
  },
];

const transportEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-tr-1', name: 'راننده کامیون', role: 'base', roleName: 'راننده', icon: '🚛',
    salary: 1_500, revenueBoost: 0.2, autoCollect: false, hireCost: 12_000,
    description: 'افزایش ۲۰٪ ظرفیت حمل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-tr-2', name: 'راننده دوم', role: 'base', roleName: 'راننده', icon: '🚛',
    salary: 1_500, revenueBoost: 0.2, autoCollect: false, hireCost: 12_000,
    description: 'افزایش ۲۰٪ ظرفیت حمل',
    unlockLevel: 3, tier: 'worker', maxUpgradeLevel: 3,
  },
  {
    id: 'emp-tr-5', name: 'مدیر ناوگان', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_500, revenueBoost: 0.35, autoCollect: false, hireCost: 50_000,
    description: 'افزایش ۳۵٪ درآمد ناوگان',
    unlockLevel: 4, tier: 'manager', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-tr-4', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_500, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
    unlockLevel: 6, tier: 'accountant', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-tr-6', name: 'بازاریاب', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, revenueBoost: 0.2, autoCollect: false, hireCost: 20_000,
    description: 'افزایش ۲۰٪ سفارشات',
    unlockLevel: 10, tier: 'marketer', maxUpgradeLevel: 1,
  },
  {
    id: 'emp-tr-7', name: 'مدیر لجستیک بین‌المللی', role: 'manager', roleName: 'مدیر لجستیک', icon: '🗺️',
    salary: 6_000, revenueBoost: 0.5, autoCollect: false, hireCost: 90_000,
    description: 'افزایش ۵۰٪ درآمد + کاهش ۱۵٪ زمان سیکل',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1, cycleDurationReduction: 0.15,
  },
];

// ==================== OFFICE TIERS ====================

export const OFFICE_TIERS: OfficeTier[] = [
  { level: 1, name: 'اتاق کار', icon: '🏠', area: 30, maxEmployees: 3, maxProducts: 1, rent: 500, upgradeCost: 0, requiredBusinessLevel: 1 },
  { level: 2, name: 'دفتر', icon: '🏢', area: 60, maxEmployees: 5, maxProducts: 2, rent: 1_500, upgradeCost: 25_000, requiredBusinessLevel: 8 },
  { level: 3, name: 'دفتر بزرگ', icon: '🏗️', area: 120, maxEmployees: 7, maxProducts: 3, rent: 3_500, upgradeCost: 60_000, requiredBusinessLevel: 14 },
  { level: 4, name: 'ساختمان تجاری', icon: '🏛️', area: 250, maxEmployees: 10, maxProducts: 5, rent: 7_000, upgradeCost: 150_000, requiredBusinessLevel: 18 },
];

export function getOfficeTier(level: number): OfficeTier {
  return OFFICE_TIERS[Math.min(Math.max(level, 1), OFFICE_TIERS.length) - 1];
}

// ==================== BUSINESS PRODUCT TEMPLATES ====================

const appStartupProducts: BusinessProduct[] = [
  { id: 'bp-a1', name: 'اپلیکیشن فروشگاهی', icon: '🛒', description: 'طراحی و توسعه اپ فروشگاه آنلاین', unlockCost: 30_000, revenueBoost: 3_000, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-a2', name: 'سامانه حسابداری', icon: '📊', description: 'نرم‌افزار مدیریت مالی', unlockCost: 50_000, revenueBoost: 5_000, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-a3', name: 'بازی موبایل', icon: '🎮', description: 'توسعه بازی موبایلی پرطرفدار', unlockCost: 80_000, revenueBoost: 8_000, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const farmingProducts: BusinessProduct[] = [
  { id: 'bp-f1', name: 'گلخانه', icon: '🌿', description: 'کشت محصولات گلخانه‌ای', unlockCost: 20_000, revenueBoost: 2_000, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-f2', name: 'دامداری', icon: '🐄', description: 'پرورش دام و تولید لبنیات', unlockCost: 40_000, revenueBoost: 4_000, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-f3', name: 'زنبورداری', icon: '🍯', description: 'تولید عسل طبیعی', unlockCost: 15_000, revenueBoost: 1_500, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const restaurantProducts: BusinessProduct[] = [
  { id: 'bp-r1', name: 'منوی ویژه', icon: '⭐', description: 'غذاهای ویژه با حاشیه سود بالا', unlockCost: 25_000, revenueBoost: 2_500, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-r2', name: 'سرویس بیرون‌بر', icon: '🛵', description: 'ارسال غذا به درب منزل', unlockCost: 35_000, revenueBoost: 3_500, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-r3', name: 'کترینگ', icon: '🎉', description: 'سرویس‌دهی به مراسم و مهمانی‌ها', unlockCost: 50_000, revenueBoost: 5_000, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const factoryProducts: BusinessProduct[] = [
  { id: 'bp-fc1', name: 'خط بسته‌بندی', icon: '📦', description: 'بسته‌بندی محصولات برای فروش مستقیم', unlockCost: 35_000, revenueBoost: 3_000, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-fc2', name: 'خط تولید دوم', icon: '⚙️', description: 'افزایش ظرفیت تولید', unlockCost: 60_000, revenueBoost: 5_500, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-fc3', name: 'آزمایشگاه کنترل کیفیت', icon: '🔬', description: 'ارتقای کیفیت و ارزش محصولات', unlockCost: 90_000, revenueBoost: 8_000, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const supermarketProducts: BusinessProduct[] = [
  { id: 'bp-sm1', name: 'بخش نانوایی', icon: '🍞', description: 'تولید و فروش نان تازه', unlockCost: 20_000, revenueBoost: 2_000, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-sm2', name: 'بخش آنلاین', icon: '🛒', description: 'فروشگاه اینترنتی و ارسال به درب منزل', unlockCost: 45_000, revenueBoost: 4_000, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-sm3', name: 'بازار میوه و تره‌بار', icon: '🍎', description: 'بخش ویژه محصولات تازه', unlockCost: 60_000, revenueBoost: 5_500, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const transportProducts: BusinessProduct[] = [
  { id: 'bp-tr1', name: 'خط شهری', icon: '🏙️', description: 'سرویس حمل‌ونقل درون‌شهری', unlockCost: 40_000, revenueBoost: 3_500, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-tr2', name: 'خط بین‌شهری', icon: '🛤️', description: 'حمل بار بین شهرها', unlockCost: 70_000, revenueBoost: 6_000, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-tr3', name: 'انبار سردخانه‌دار', icon: '❄️', description: 'حمل کالاهای یخچالی با سود بیشتر', unlockCost: 100_000, revenueBoost: 9_000, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

// ==================== BUSINESS TEMPLATES ====================

export const businessTemplates: BusinessTemplate[] = [
  {
    type: 'app_startup', defaultName: 'داده‌پردازان', icon: '📱',
    description: 'شرکت برنامه‌نویسی. با یک برنامه‌نویس ساده و تجهیزات سخت‌افزاری شروع کنید.',
    startCost: 50_000, baseRevenue: 5_000, cycleDuration: 180, baseExpenses: 1_000,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'لپتاپ و میز کار',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'farming', defaultName: 'مزرعه سبز', icon: '🌾',
    description: 'کشت محصول و پرورش دام. پایه زنجیره تأمین.',
    startCost: 30_000, baseRevenue: 3_000, cycleDuration: 120, baseExpenses: 800,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'زمین کشاورزی و ابزار دستی',
    availableEmployees: farmingEmployees, availableProducts: farmingProducts,
  },
  {
    type: 'restaurant', defaultName: 'رستوران لذیذ', icon: '🍽️',
    description: 'تبدیل مواد اولیه به غذا. حاشیه سود بالا با مدیریت خوب.',
    startCost: 80_000, baseRevenue: 8_000, cycleDuration: 150, baseExpenses: 2_000,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'آشپزخانه صنعتی و سالن غذاخوری',
    availableEmployees: restaurantEmployees, availableProducts: restaurantProducts,
  },
  {
    type: 'factory', defaultName: 'کارخانه تولیدی', icon: '🏭',
    description: 'فرآوری مواد خام به کالاهای نهایی با سود بیشتر.',
    startCost: 120_000, baseRevenue: 10_000, cycleDuration: 240, baseExpenses: 3_000,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'خط تولید اولیه',
    availableEmployees: factoryEmployees, availableProducts: factoryProducts,
  },
  {
    type: 'supermarket', defaultName: 'هایپرمارکت', icon: '🏪',
    description: 'فروش مستقیم محصولات. حجم بالا، درآمد پایدار.',
    startCost: 70_000, baseRevenue: 6_000, cycleDuration: 90, baseExpenses: 1_500,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'قفسه‌ها و صندوق فروش',
    availableEmployees: supermarketEmployees, availableProducts: supermarketProducts,
  },
  {
    type: 'transport', defaultName: 'حمل‌ونقل سریع', icon: '🚛',
    description: 'جابجایی کالا بین کسب‌وکارها. ضروری برای زنجیره تأمین.',
    startCost: 150_000, baseRevenue: 12_000, cycleDuration: 300, baseExpenses: 4_000,
    maxPendingCycles: 100, maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'یک کامیون و راننده',
    availableEmployees: transportEmployees, availableProducts: transportProducts,
  },
];

// ==================== PLAYER BUSINESSES ====================

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1', ownerId: 'player-1', name: 'داده‌پردازان نوین', type: 'app_startup', level: 2, icon: '📱',
    baseRevenue: 5_000, cycleDuration: 180, lastCycleAt: Date.now() - 100_000, pendingRevenue: 5_000,
    maxPendingCycles: 100, expenses: 1_000, upgradeCost: 75_000,
    officeLevel: 1, maxEmployees: 3, maxProducts: 1, maxLevel: 20,
    employees: [{
      id: 'he-1', templateId: 'emp-as-1', name: 'برنامه‌نویس', role: 'base', roleName: 'برنامه‌نویس',
      icon: '👨‍💻', salary: 1_500, revenueBoost: 0.2, autoCollect: false, hiredAt: Date.now() - 86400000,
      employeeLevel: 1, maxUpgradeLevel: 3, baseHireCost: 12_000,
    }],
    products: [
      { ...appStartupProducts[0], unlocked: true },
      { ...appStartupProducts[1] },
      { ...appStartupProducts[2] },
    ],
    initialEquipment: 'لپتاپ و میز کار',
  },
];

// ==================== PRODUCTS ====================

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'گندم', category: 'raw_material', icon: '🌾', basePrice: 10, currentPrice: 12, supply: 500, demand: 450, priceHistory: [10, 11, 9, 12, 11, 13, 12] },
  { id: 'prod-2', name: 'آرد', category: 'processed', icon: '🫘', basePrice: 25, currentPrice: 28, supply: 300, demand: 350, priceHistory: [25, 26, 24, 27, 28, 30, 28] },
  { id: 'prod-3', name: 'نان', category: 'finished_good', icon: '🍞', basePrice: 50, currentPrice: 55, supply: 200, demand: 280, priceHistory: [50, 48, 52, 53, 55, 54, 55] },
  { id: 'prod-4', name: 'گوجه', category: 'raw_material', icon: '🍅', basePrice: 8, currentPrice: 7, supply: 600, demand: 400, priceHistory: [8, 9, 7, 6, 7, 8, 7] },
  { id: 'prod-5', name: 'شیر', category: 'raw_material', icon: '🥛', basePrice: 15, currentPrice: 18, supply: 250, demand: 320, priceHistory: [15, 16, 17, 16, 18, 17, 18] },
  { id: 'prod-6', name: 'پنیر', category: 'processed', icon: '🧀', basePrice: 40, currentPrice: 45, supply: 150, demand: 200, priceHistory: [40, 42, 38, 43, 44, 46, 45] },
  { id: 'prod-7', name: 'پیتزا', category: 'food', icon: '🍕', basePrice: 80, currentPrice: 85, supply: 100, demand: 180, priceHistory: [80, 78, 82, 83, 85, 84, 85] },
  { id: 'prod-8', name: 'اپلیکیشن موبایل', category: 'tech', icon: '📱', basePrice: 200, currentPrice: 220, supply: 50, demand: 120, priceHistory: [200, 210, 190, 215, 220, 225, 220] },
];

// ==================== MARKET LISTINGS ====================

export const mockListings: MarketListing[] = [
  { id: 'list-1', sellerId: 'player-2', sellerName: 'شاه‌مزرعه', productId: 'prod-1', productName: 'گندم', quantity: 50, pricePerUnit: 11, listedAt: '2026-03-10T14:00:00Z' },
  { id: 'list-2', sellerId: 'player-3', sellerName: 'نانوایی‌باشی', productId: 'prod-3', productName: 'نان', quantity: 20, pricePerUnit: 52, listedAt: '2026-03-10T15:30:00Z' },
  { id: 'list-3', sellerId: 'player-4', sellerName: 'ملکه‌لبنیات', productId: 'prod-5', productName: 'شیر', quantity: 100, pricePerUnit: 16, listedAt: '2026-03-10T12:00:00Z' },
  { id: 'list-4', sellerId: 'player-5', sellerName: 'جادوگرفناوری', productId: 'prod-8', productName: 'اپلیکیشن موبایل', quantity: 5, pricePerUnit: 210, listedAt: '2026-03-10T16:00:00Z' },
];

// ==================== LEADERBOARD ====================

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerId: 'player-10', username: 'سلطان‌تجارت', avatar: '👑', wealth: 2_500_000, level: 18, businessCount: 8 },
  { rank: 2, playerId: 'player-11', username: 'مگاکورپ', avatar: '🦈', wealth: 1_800_000, level: 15, businessCount: 6 },
  { rank: 3, playerId: 'player-12', username: 'طلاجو', avatar: '💰', wealth: 1_200_000, level: 12, businessCount: 5 },
  { rank: 4, playerId: 'player-2', username: 'شاه‌مزرعه', avatar: '🌾', wealth: 950_000, level: 10, businessCount: 4 },
  { rank: 5, playerId: 'player-3', username: 'نانوایی‌باشی', avatar: '🍞', wealth: 780_000, level: 9, businessCount: 3 },
  { rank: 6, playerId: 'player-1', username: 'تاجرباشی', avatar: '👤', wealth: 150_000, level: 5, businessCount: 1 },
  { rank: 7, playerId: 'player-4', username: 'ملکه‌لبنیات', avatar: '🥛', wealth: 120_000, level: 4, businessCount: 2 },
  { rank: 8, playerId: 'player-5', username: 'جادوگرفناوری', avatar: '📱', wealth: 85_000, level: 3, businessCount: 1 },
];

// ==================== FRIDAY MARKET ====================

export const mockFridayMarket: FridayMarketItem[] = [
  { id: 'fm-1', name: 'نوشیدنی انرژی‌زا', icon: '⚡', price: 500, effect: { energy: 20 }, available: true },
  { id: 'fm-2', name: 'کتاب آموزشی', icon: '📚', price: 2_000, effect: { intelligence: 10 }, available: true },
  { id: 'fm-3', name: 'بشقاب کباب', icon: '🍖', price: 300, effect: { hunger: -30, happiness: 10 }, available: true },
  { id: 'fm-4', name: 'قهوه', icon: '☕', price: 150, effect: { energy: 10, happiness: 5 }, available: true },
  { id: 'fm-5', name: 'کنسول بازی', icon: '🎮', price: 5_000, effect: { happiness: 25 }, available: false },
  { id: 'fm-6', name: 'اشتراک باشگاه', icon: '💪', price: 1_000, effect: { energy: 15, happiness: 10 }, available: true },
];

// ==================== NEWS ====================

const now = Date.now();
const HOUR = 3600_000;

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1', title: 'رشد ۱۵٪ قیمت گندم در بازار', summary: 'قیمت گندم به دلیل کاهش عرضه و افزایش تقاضای نانوایی‌ها رشد چشمگیری داشت.',
    category: 'market', icon: '🌾', timestamp: now - HOUR * 1, isBreaking: true, relatedBusinessType: 'farming',
  },
  {
    id: 'news-2', title: 'سلطان‌تجارت رکورد ثروت را شکست', summary: 'بازیکن سلطان‌تجارت با عبور از مرز ۲.۵ میلیون تومان، رکورد جدیدی ثبت کرد.',
    category: 'ranking', icon: '👑', timestamp: now - HOUR * 2,
  },
  {
    id: 'news-3', title: 'طلا به بالاترین قیمت ۳ ماهه رسید', summary: 'هر گرم طلای ۱۸ عیار به ۳,۸۵۰,۰۰۰ تومان رسید. کارشناسان ادامه رشد را پیش‌بینی می‌کنند.',
    category: 'gold', icon: '🥇', timestamp: now - HOUR * 3,
  },
  {
    id: 'news-4', title: 'دلار در بازار آزاد ثابت ماند', summary: 'نرخ دلار در محدوده ۶۵ هزار تومان تثبیت شد. بازار ارز در آرامش نسبی است.',
    category: 'currency', icon: '💵', timestamp: now - HOUR * 5,
  },
  {
    id: 'news-5', title: 'بیت‌کوین از مرز ۱۰۰ هزار دلار عبور کرد', summary: 'بیت‌کوین با رشد ۸٪ در ۲۴ ساعت اخیر، رکورد تاریخی جدیدی ثبت کرد.',
    category: 'crypto', icon: '₿', timestamp: now - HOUR * 6, isBreaking: true,
  },
  {
    id: 'news-6', title: 'شاخص بورس ۲٪ رشد کرد', summary: 'شاخص کل بورس با معاملات مثبت گروه‌های خودرویی و بانکی، ۲ درصد رشد کرد.',
    category: 'stock', icon: '📈', timestamp: now - HOUR * 8,
  },
  {
    id: 'news-7', title: 'افت تقاضای پنیر در بازار', summary: 'با افزایش عرضه شیر، قیمت پنیر ۱۰٪ کاهش یافت. فرصتی برای خرید ارزان!',
    category: 'market', icon: '🧀', timestamp: now - HOUR * 10,
  },
  {
    id: 'news-8', title: 'جشنواره بهاره: تخفیف ۲۰٪ استخدام', summary: 'به مناسبت بهار، تمام هزینه‌های استخدام نیرو تا پایان هفته ۲۰٪ تخفیف دارد!',
    category: 'event', icon: '🎉', timestamp: now - HOUR * 12,
  },
  {
    id: 'news-9', title: 'رستوران‌ها پرسودترین کسب‌وکار ماه شدند', summary: 'با افزایش تقاضای غذا، حاشیه سود رستوران‌ها به بالاترین سطح رسید.',
    category: 'market', icon: '🍽️', timestamp: now - HOUR * 15, relatedBusinessType: 'restaurant',
  },
  {
    id: 'news-10', title: 'اتریوم ۵٪ رشد کرد', summary: 'قیمت اتریوم با اعلام آپدیت جدید شبکه، ۵ درصد افزایش یافت.',
    category: 'crypto', icon: 'Ξ', timestamp: now - HOUR * 18,
  },
];

// ==================== DAILY BONUS ====================

export const DAILY_BONUS_REWARDS = [
  { day: 1, amount: 5_000,   icon: '🎁', label: 'روز ۱' },
  { day: 2, amount: 10_000,  icon: '🎁', label: 'روز ۲' },
  { day: 3, amount: 20_000,  icon: '🎁', label: 'روز ۳' },
  { day: 4, amount: 40_000,  icon: '🎁', label: 'روز ۴' },
  { day: 5, amount: 70_000,  icon: '💎', label: 'روز ۵' },
  { day: 6, amount: 100_000, icon: '💎', label: 'روز ۶' },
  { day: 7, amount: 200_000, icon: '🏆', label: 'روز ۷' },
];

// ==================== RUSH HOUR ====================

export const RUSH_HOUR = {
  durationMs: 15 * 60 * 1000,    // 15 دقیقه
  intervalMs: 3 * 60 * 60 * 1000, // هر 3 ساعت
  multiplier: 2,                   // ×2 تولید
};
