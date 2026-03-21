import {
  PlayerProfile,
  Business,
  BusinessTemplate,
  BusinessType,
  Product,
  NewsArticle,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
  EmployeeTemplate,
  BusinessProduct,
  OfficeTier,
  EventTemplate,
  City,
  Neighborhood,
  MissionTemplate,
  Achievement,
  LifeAction,
  PlayerStats,
  OrderBoardState,
  BankTemplate,
  AIRival,
  SpecialtyMilestone,
  ManagerTemplate,
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
    happiness: 85,
    hunger: 15,
    energy: 90,
    intelligence: 65,
    experience: 45,
  },
  createdAt: '1404-10-25',
};

// ==================== EMPLOYEE TEMPLATES ====================
// هر شرکت ۷ نیرو — درخت رشد با unlockLevel و tier

const appStartupEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-as-1', name: 'برنامه‌نویس', role: 'production', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 1_500, hireCost: 12_000,
    description: '+۱ واحد تولید ماژول در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 1,
  },
  {
    id: 'emp-as-2', name: 'برنامه‌نویس ارشد', role: 'production', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 2_000, hireCost: 18_000,
    description: '+۲ واحد تولید ماژول در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-as-3', name: 'مدیر پروژه', role: 'sales', roleName: 'بازاریاب', icon: '👔',
    salary: 3_000, hireCost: 40_000,
    description: '+۲ واحد فروش ماژول در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 2,
  },
  {
    id: 'emp-as-4', name: 'مدیر سرور', role: 'warehouse', roleName: 'مدیر سرور', icon: '🖥️',
    salary: 2_500, hireCost: 30_000,
    description: '+۱۵ ظرفیت سرور',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 15,
  },
  {
    id: 'emp-as-5', name: 'بازاریاب دیجیتال', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, hireCost: 20_000,
    description: '+۱ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 1, orderQualityBoost: 0.15,
  },
  {
    id: 'emp-as-7', name: 'CTO', role: 'production', roleName: 'مدیر فنی', icon: '🧠',
    salary: 5_000, hireCost: 80_000,
    description: '+۳ تولید + ۲ فروش + کاهش ۱۰٪ زمان سیکل',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    productionBoost: 3, salesBoost: 2, cycleDurationReduction: 0.1,
  },
];

const farmingEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-fm-1', name: 'کشاورز', role: 'production', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 1_000, hireCost: 8_000,
    description: '+۱ تن محصول در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 1,
  },
  {
    id: 'emp-fm-2', name: 'کشاورز باتجربه', role: 'production', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 1_500, hireCost: 12_000,
    description: '+۲ تن محصول در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-fm-5', name: 'واسطه بازار', role: 'sales', roleName: 'واسطه', icon: '🤝',
    salary: 2_800, hireCost: 40_000,
    description: '+۲ واحد فروش محصول در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 2,
  },
  {
    id: 'emp-fm-4', name: 'انباردار', role: 'warehouse', roleName: 'انباردار', icon: '📦',
    salary: 2_000, hireCost: 25_000,
    description: '+۲۰ ظرفیت انبار',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 20,
  },
  {
    id: 'emp-fm-6', name: 'بازاریاب', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 1_800, hireCost: 18_000,
    description: '+۱ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 1, orderQualityBoost: 0.1,
  },
  {
    id: 'emp-fm-7', name: 'متخصص کشاورزی ارگانیک', role: 'production', roleName: 'متخصص', icon: '🌿',
    salary: 4_500, hireCost: 70_000,
    description: '+۳ تن محصول + ۲ فروش + کاهش ۱۰٪ هزینه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    productionBoost: 3, salesBoost: 2, expenseReduction: 0.1,
  },
];

const restaurantEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-rs-1', name: 'آشپز', role: 'production', roleName: 'آشپز', icon: '👨‍🍳',
    salary: 1_500, hireCost: 15_000,
    description: '+۱ پرس غذا در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 1,
  },
  {
    id: 'emp-rs-2', name: 'آشپز ارشد', role: 'production', roleName: 'آشپز', icon: '👨‍🍳',
    salary: 2_000, hireCost: 20_000,
    description: '+۲ پرس غذا در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-rs-5', name: 'گارسون', role: 'sales', roleName: 'گارسون', icon: '🍽️',
    salary: 3_000, hireCost: 45_000,
    description: '+۲ واحد فروش غذا در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 2,
  },
  {
    id: 'emp-rs-4', name: 'انباردار', role: 'warehouse', roleName: 'انباردار', icon: '🧊',
    salary: 2_200, hireCost: 30_000,
    description: '+۱۰ ظرفیت یخچال',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 10,
  },
  {
    id: 'emp-rs-6', name: 'بازاریاب', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 1_800, hireCost: 20_000,
    description: '+۱ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 1, orderQualityBoost: 0.15,
  },
  {
    id: 'emp-rs-7', name: 'سرآشپز ستاره میشلن', role: 'production', roleName: 'سرآشپز ویژه', icon: '⭐',
    salary: 5_500, hireCost: 85_000,
    description: '+۳ پرس غذا + ۲ فروش + کاهش ۱۰٪ زمان سیکل',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    productionBoost: 3, salesBoost: 2, cycleDurationReduction: 0.1,
  },
];

const factoryEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-fc-1', name: 'کارگر خط تولید', role: 'production', roleName: 'کارگر', icon: '👷',
    salary: 1_200, hireCost: 10_000,
    description: '+۱ واحد تولید در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 1,
  },
  {
    id: 'emp-fc-2', name: 'کارگر ارشد', role: 'production', roleName: 'کارگر', icon: '👷',
    salary: 1_800, hireCost: 15_000,
    description: '+۲ واحد تولید در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-fc-5', name: 'مدیر فروش', role: 'sales', roleName: 'بازاریاب', icon: '👔',
    salary: 3_500, hireCost: 50_000,
    description: '+۲ واحد فروش محصول در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 2,
  },
  {
    id: 'emp-fc-4', name: 'انباردار', role: 'warehouse', roleName: 'انباردار', icon: '📦',
    salary: 2_500, hireCost: 30_000,
    description: '+۲۵ ظرفیت انبار',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 25,
  },
  {
    id: 'emp-fc-6', name: 'بازاریاب صنعتی', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, hireCost: 22_000,
    description: '+۱ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 1, orderQualityBoost: 0.12,
  },
  {
    id: 'emp-fc-7', name: 'مهندس ارشد اتوماسیون', role: 'production', roleName: 'مهندس ارشد', icon: '🏗️',
    salary: 6_000, hireCost: 90_000,
    description: '+۳ تولید + ۲ فروش + کاهش ۱۵٪ هزینه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    productionBoost: 3, salesBoost: 2, expenseReduction: 0.15,
  },
];

const supermarketEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-sm-1', name: 'چیدمانچی', role: 'production', roleName: 'چیدمانچی', icon: '🛒',
    salary: 1_000, hireCost: 8_000,
    description: '+۲ واحد چیدن کالا در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-sm-2', name: 'چیدمانچی ارشد', role: 'production', roleName: 'چیدمانچی', icon: '🛒',
    salary: 1_500, hireCost: 12_000,
    description: '+۳ واحد چیدن کالا در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 3,
  },
  {
    id: 'emp-sm-5', name: 'صندوقدار', role: 'sales', roleName: 'صندوقدار', icon: '💳',
    salary: 3_000, hireCost: 45_000,
    description: '+۳ واحد فروش کالا در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 3,
  },
  {
    id: 'emp-sm-4', name: 'انباردار', role: 'warehouse', roleName: 'انباردار', icon: '📦',
    salary: 2_200, hireCost: 28_000,
    description: '+۲۰ ظرفیت انبار فروشگاه',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 20,
  },
  {
    id: 'emp-sm-6', name: 'بازاریاب', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, hireCost: 20_000,
    description: '+۲ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 2, orderQualityBoost: 0.15,
  },
  {
    id: 'emp-sm-7', name: 'مدیر زنجیره تأمین', role: 'sales', roleName: 'مدیر تأمین', icon: '🎯',
    salary: 5_000, hireCost: 75_000,
    description: '+۳ فروش + ۲ تولید + کاهش ۲۰٪ هزینه',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    salesBoost: 3, productionBoost: 2, expenseReduction: 0.2,
  },
];

const transportEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-tr-1', name: 'راننده کامیون', role: 'production', roleName: 'راننده', icon: '🚛',
    salary: 1_500, hireCost: 12_000,
    description: '+۱ واحد حمل بار در هر سیکل',
    unlockLevel: 1, tier: 'worker', maxUpgradeLevel: 3,
    productionBoost: 1,
  },
  {
    id: 'emp-tr-2', name: 'راننده باتجربه', role: 'production', roleName: 'راننده', icon: '🚛',
    salary: 2_000, hireCost: 18_000,
    description: '+۲ واحد حمل بار در هر سیکل',
    unlockLevel: 3, tier: 'senior', maxUpgradeLevel: 3,
    productionBoost: 2,
  },
  {
    id: 'emp-tr-5', name: 'مدیر ناوگان', role: 'sales', roleName: 'بازاریاب', icon: '👔',
    salary: 3_500, hireCost: 50_000,
    description: '+۲ واحد فروش سرویس در دقیقه',
    unlockLevel: 4, tier: 'senior', maxUpgradeLevel: 1,
    salesBoost: 2,
  },
  {
    id: 'emp-tr-4', name: 'انباردار', role: 'warehouse', roleName: 'انباردار', icon: '📦',
    salary: 2_500, hireCost: 30_000,
    description: '+۲۵ ظرفیت انبار',
    unlockLevel: 6, tier: 'senior', maxUpgradeLevel: 1,
    capacityBoost: 25,
  },
  {
    id: 'emp-tr-6', name: 'بازاریاب', role: 'sales', roleName: 'بازاریاب', icon: '📢',
    salary: 2_000, hireCost: 20_000,
    description: '+۱ فروش در دقیقه + شانس سفارش ویژه',
    unlockLevel: 10, tier: 'expert', maxUpgradeLevel: 1,
    salesBoost: 1, orderQualityBoost: 0.12,
  },
  {
    id: 'emp-tr-7', name: 'مدیر لجستیک بین‌المللی', role: 'sales', roleName: 'مدیر لجستیک', icon: '🗺️',
    salary: 6_000, hireCost: 90_000,
    description: '+۳ فروش + ۲ تولید + کاهش ۱۵٪ زمان سیکل',
    unlockLevel: 15, tier: 'legendary', maxUpgradeLevel: 1,
    salesBoost: 3, productionBoost: 2, cycleDurationReduction: 0.15,
  },
];

// ==================== OFFICE TIERS ====================

export const OFFICE_TIERS: OfficeTier[] = [
  { level: 1, name: 'اتاق کار', icon: '🏠', area: 30, maxEmployees: 3, maxProducts: 1, rent: 500, upgradeCost: 0, requiredBusinessLevel: 1 },
  { level: 2, name: 'دفتر', icon: '🏢', area: 60, maxEmployees: 5, maxProducts: 2, rent: 1_500, upgradeCost: 25_000, requiredBusinessLevel: 8 },
  { level: 3, name: 'دفتر بزرگ', icon: '🏗️', area: 120, maxEmployees: 7, maxProducts: 3, rent: 3_500, upgradeCost: 60_000, requiredBusinessLevel: 14 },
  { level: 4, name: 'ساختمان تجاری', icon: '🏛️', area: 250, maxEmployees: 10, maxProducts: 5, rent: 7_000, upgradeCost: 150_000, requiredBusinessLevel: 18 },
];

// نام‌های سطوح دفتر/مکان متناسب با نوع کسب‌وکار
export const OFFICE_NAMES_BY_TYPE: Record<BusinessType, { name: string; icon: string }[]> = {
  app_startup: [
    { name: 'اتاق کار', icon: '🏠' },
    { name: 'دفتر استارتاپ', icon: '🏢' },
    { name: 'دفتر بزرگ', icon: '🏗️' },
    { name: 'ساختمان شرکت', icon: '🏛️' },
  ],
  restaurant: [
    { name: 'کافه کوچک', icon: '☕' },
    { name: 'رستوران متوسط', icon: '🍽️' },
    { name: 'رستوران بزرگ', icon: '🏪' },
    { name: 'مجتمع غذایی', icon: '🏬' },
  ],
  supermarket: [
    { name: 'بقالی', icon: '🏪' },
    { name: 'مغازه', icon: '🛒' },
    { name: 'سوپرمارکت', icon: '🏬' },
    { name: 'هایپرمارکت', icon: '🏛️' },
  ],
  factory: [
    { name: 'کارگاه کوچک', icon: '🔧' },
    { name: 'کارخونه', icon: '🏭' },
    { name: 'کارخونه بزرگ', icon: '🏗️' },
    { name: 'مجتمع صنعتی', icon: '🏛️' },
  ],
  farming: [
    { name: 'زمین کوچک', icon: '🌱' },
    { name: 'مزرعه', icon: '🌾' },
    { name: 'مزرعه بزرگ', icon: '🚜' },
    { name: 'مجتمع کشاورزی', icon: '🏛️' },
  ],
  transport: [
    { name: 'گاراژ', icon: '🚐' },
    { name: 'پایانه کوچک', icon: '🚛' },
    { name: 'شرکت حمل‌ونقل', icon: '🏢' },
    { name: 'ناوگان بزرگ', icon: '🏛️' },
  ],
};

export function getOfficeTier(level: number): OfficeTier {
  return OFFICE_TIERS[Math.min(Math.max(level, 1), OFFICE_TIERS.length) - 1];
}

// دریافت نام و آیکون متناسب با نوع کسب‌وکار
export function getOfficeName(level: number, businessType: BusinessType): { name: string; icon: string } {
  const names = OFFICE_NAMES_BY_TYPE[businessType];
  const idx = Math.min(Math.max(level, 1), names.length) - 1;
  return names[idx];
}

// ==================== واژه‌نامه اختصاصی هر کسب‌وکار ====================

export interface BusinessVocabulary {
  revenue: string;           // "درآمد" → "فروش غذا" / "درآمد پروژه"
  expenses: string;          // "هزینه" → "هزینه مواد اولیه" / "هزینه سرور"
  cycle: string;             // "سیکل" → "سرو" / "اسپرینت"
  production: string;        // "تولید" → "سرو غذا" / "توسعه نرم‌افزار"
  autoSale: string;          // "فروش خودکار" → "فروش خودکار غذا" / "فروش خودکار ماژول"
  upgrade: string;           // "ارتقا" → "توسعه رستوران" / "رشد استارتاپ"
  workers: string;           // "نیرو" → "تیم" / "پرسنل"
  levelUpBenefit: string;    // "سود بیشتر" → "کیفیت بالاتر" / "پروژه‌های بزرگتر"
  productUnit: string;       // "پرس غذا" / "ماژول" / "تن محصول"
  inventoryName: string;     // "یخچال" / "سرور" / "انبار"
  productionWorker: string;  // "آشپز" / "برنامه‌نویس" / "کشاورز"
  salesWorker: string;       // "گارسون" / "بازاریاب" / "واسطه"
  warehouseWorker: string;   // "انباردار" / "مدیر سرور"
}

export const BUSINESS_VOCABULARY: Record<BusinessType, BusinessVocabulary> = {
  app_startup: {
    revenue: 'درآمد پروژه',
    expenses: 'هزینه سرور و نیرو',
    cycle: 'اسپرینت',
    production: 'توسعه نرم‌افزار',
    autoSale: 'فروش خودکار ماژول',
    upgrade: 'رشد استارتاپ',
    workers: 'تیم',
    levelUpBenefit: 'پروژه‌های بزرگتر',
    productUnit: 'ماژول',
    inventoryName: 'سرور',
    productionWorker: 'برنامه‌نویس',
    salesWorker: 'بازاریاب',
    warehouseWorker: 'مدیر سرور',
  },
  restaurant: {
    revenue: 'فروش غذا',
    expenses: 'هزینه مواد اولیه',
    cycle: 'سرو',
    production: 'پخت و سرو',
    autoSale: 'فروش خودکار غذا',
    upgrade: 'توسعه رستوران',
    workers: 'پرسنل',
    levelUpBenefit: 'منوی بهتر',
    productUnit: 'پرس غذا',
    inventoryName: 'یخچال',
    productionWorker: 'آشپز',
    salesWorker: 'گارسون',
    warehouseWorker: 'انباردار',
  },
  supermarket: {
    revenue: 'فروش روزانه',
    expenses: 'هزینه تأمین کالا',
    cycle: 'شیفت فروش',
    production: 'چیدن کالا',
    autoSale: 'فروش خودکار کالا',
    upgrade: 'گسترش فروشگاه',
    workers: 'کارکنان',
    levelUpBenefit: 'تنوع بیشتر',
    productUnit: 'بسته کالا',
    inventoryName: 'انبار فروشگاه',
    productionWorker: 'چیدمانچی',
    salesWorker: 'صندوقدار',
    warehouseWorker: 'انباردار',
  },
  factory: {
    revenue: 'فروش تولیدات',
    expenses: 'هزینه تولید',
    cycle: 'خط تولید',
    production: 'تولید کالا',
    autoSale: 'فروش خودکار محصول',
    upgrade: 'توسعه کارخانه',
    workers: 'کارگران',
    levelUpBenefit: 'ظرفیت بالاتر',
    productUnit: 'واحد کالا',
    inventoryName: 'انبار',
    productionWorker: 'کارگر',
    salesWorker: 'بازاریاب',
    warehouseWorker: 'انباردار',
  },
  farming: {
    revenue: 'فروش محصول',
    expenses: 'هزینه کشت',
    cycle: 'فصل برداشت',
    production: 'کشت و برداشت',
    autoSale: 'فروش خودکار محصول',
    upgrade: 'توسعه مزرعه',
    workers: 'کشاورزان',
    levelUpBenefit: 'زمین بیشتر',
    productUnit: 'تن محصول',
    inventoryName: 'انبار',
    productionWorker: 'کشاورز',
    salesWorker: 'واسطه',
    warehouseWorker: 'انباردار',
  },
  transport: {
    revenue: 'کرایه حمل',
    expenses: 'هزینه سوخت و تعمیر',
    cycle: 'سفر',
    production: 'حمل بار',
    autoSale: 'فروش خودکار سرویس',
    upgrade: 'توسعه ناوگان',
    workers: 'رانندگان',
    levelUpBenefit: 'مسیرهای بیشتر',
    productUnit: 'سرویس حمل',
    inventoryName: 'پارکینگ',
    productionWorker: 'راننده',
    salesWorker: 'بازاریاب',
    warehouseWorker: 'انباردار',
  },
};

// ==================== BUSINESS PRODUCT TEMPLATES ====================

const appStartupProducts: BusinessProduct[] = [
  { id: 'bp-a1', name: 'اپلیکیشن فروشگاهی', icon: '🛒', description: 'طراحی و توسعه اپ فروشگاه آنلاین', unlockCost: 30_000, productionBoost: 1, capacityBoost: 5, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-a2', name: 'سامانه حسابداری', icon: '📊', description: 'نرم‌افزار مدیریت مالی', unlockCost: 50_000, productionBoost: 2, capacityBoost: 10, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-a3', name: 'بازی موبایل', icon: '🎮', description: 'توسعه بازی موبایلی پرطرفدار', unlockCost: 80_000, productionBoost: 4, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const farmingProducts: BusinessProduct[] = [
  { id: 'bp-f1', name: 'گلخانه', icon: '🌿', description: 'کشت محصولات گلخانه‌ای', unlockCost: 20_000, productionBoost: 1, capacityBoost: 10, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-f2', name: 'دامداری', icon: '🐄', description: 'پرورش دام و تولید لبنیات', unlockCost: 40_000, productionBoost: 2, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-f3', name: 'زنبورداری', icon: '🍯', description: 'تولید عسل طبیعی', unlockCost: 15_000, productionBoost: 1, capacityBoost: 5, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const restaurantProducts: BusinessProduct[] = [
  { id: 'bp-r1', name: 'منوی ویژه', icon: '⭐', description: 'غذاهای ویژه با حاشیه سود بالا', unlockCost: 25_000, productionBoost: 1, capacityBoost: 8, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-r2', name: 'سرویس بیرون‌بر', icon: '🛵', description: 'ارسال غذا به درب منزل', unlockCost: 35_000, productionBoost: 2, capacityBoost: 10, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-r3', name: 'کترینگ', icon: '🎉', description: 'سرویس‌دهی به مراسم و مهمانی‌ها', unlockCost: 50_000, productionBoost: 3, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const factoryProducts: BusinessProduct[] = [
  { id: 'bp-fc1', name: 'خط بسته‌بندی', icon: '📦', description: 'بسته‌بندی محصولات برای فروش مستقیم', unlockCost: 35_000, productionBoost: 1, capacityBoost: 10, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-fc2', name: 'خط تولید دوم', icon: '⚙️', description: 'افزایش ظرفیت تولید', unlockCost: 60_000, productionBoost: 3, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-fc3', name: 'آزمایشگاه کنترل کیفیت', icon: '🔬', description: 'ارتقای کیفیت و ارزش محصولات', unlockCost: 90_000, productionBoost: 4, capacityBoost: 20, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

const supermarketProducts: BusinessProduct[] = [
  // ---- محور ظرفیت انبار (Stock Capacity) ----
  { id: 'bp-sm1', name: 'بخش نانوایی', icon: '🍞', description: '+۲ تولید، +۱۰ ظرفیت انبار', unlockCost: 20_000, productionBoost: 2, capacityBoost: 10, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-sm3', name: 'بازار میوه و تره‌بار', icon: '🍎', description: '+۳ تولید، +۲۵ ظرفیت انبار', unlockCost: 60_000, productionBoost: 3, capacityBoost: 25, unlocked: false,
    requirements: { businessLevel: 14, officeLevel: 3 },
  },
  // ---- محور سرعت فروش (Sales Speed) ----
  { id: 'bp-sm2', name: 'فروشگاه آنلاین', icon: '🛒', description: '+۳ تولید، +۱۵ ظرفیت — فروش آنلاین ۲۴ساعته', unlockCost: 45_000, productionBoost: 3, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 10 },
  },
  // ---- محور حاشیه سود (Profit Margin) ----
  { id: 'bp-sm4', name: 'برند خصوصی', icon: '🏷️', description: 'محصولات با برچسب اختصاصی — +۱۰٪ درآمد هر فروش', unlockCost: 55_000, productionBoost: 0, capacityBoost: 0, revenueMultiplier: 0.10, unlocked: false,
    requirements: { businessLevel: 9 },
  },
  { id: 'bp-sm5', name: 'کارت وفاداری', icon: '💳', description: 'باشگاه مشتریان — +۱۵٪ درآمد و مشتری دائمی', unlockCost: 90_000, productionBoost: 0, capacityBoost: 0, revenueMultiplier: 0.15, unlocked: false,
    requirements: { businessLevel: 14, officeLevel: 2 },
  },
];

const transportProducts: BusinessProduct[] = [
  { id: 'bp-tr1', name: 'خط شهری', icon: '🏙️', description: 'سرویس حمل‌ونقل درون‌شهری', unlockCost: 40_000, productionBoost: 2, capacityBoost: 15, unlocked: false,
    requirements: { businessLevel: 5 },
  },
  { id: 'bp-tr2', name: 'خط بین‌شهری', icon: '🛤️', description: 'حمل بار بین شهرها', unlockCost: 70_000, productionBoost: 3, capacityBoost: 20, unlocked: false,
    requirements: { businessLevel: 12 },
  },
  { id: 'bp-tr3', name: 'انبار سردخانه‌دار', icon: '❄️', description: 'حمل کالاهای یخچالی با سود بیشتر', unlockCost: 100_000, productionBoost: 4, capacityBoost: 25, unlocked: false,
    requirements: { businessLevel: 18, officeLevel: 3 },
  },
];

// ==================== CITIES & NEIGHBORHOODS ====================

export const CITIES: City[] = [
  {
    id: 'city-tehran',
    name: 'تهران',
    icon: '🏙️',
    description: 'پایتخت و بزرگ‌ترین شهر. بازار بزرگ، رقابت بالا.',
    neighborhoods: [
      {
        id: 'nb-tehran-center', name: 'مرکز شهر', icon: '🏛️',
        description: 'تردد بالا، اجاره گرون، مناسب فروشگاه و رستوران',
        revenueMultiplier: 1.4, expenseMultiplier: 1.3, customerTraffic: 1.3,
        rentMultiplier: 1.5, bestFor: ['supermarket', 'restaurant'], unlockLevel: 1,
      },
      {
        id: 'nb-tehran-north', name: 'شمال تهران', icon: '🌲',
        description: 'محله لوکس، مشتری‌های ثروتمند، هزینه بالا',
        revenueMultiplier: 1.6, expenseMultiplier: 1.5, customerTraffic: 1.1,
        rentMultiplier: 1.8, bestFor: ['restaurant', 'app_startup'], unlockLevel: 5,
      },
      {
        id: 'nb-tehran-south', name: 'جنوب تهران', icon: '🏘️',
        description: 'اجاره ارزون، حجم بالا، حاشیه سود کمتر',
        revenueMultiplier: 0.9, expenseMultiplier: 0.7, customerTraffic: 1.2,
        rentMultiplier: 0.6, bestFor: ['supermarket', 'factory', 'transport'], unlockLevel: 1,
      },
      {
        id: 'nb-tehran-pardis', name: 'پردیس فناوری', icon: '💻',
        description: 'مرکز فناوری، بهترین جا برای استارتاپ‌ها',
        revenueMultiplier: 1.5, expenseMultiplier: 1.2, customerTraffic: 1.0,
        rentMultiplier: 1.3, bestFor: ['app_startup'], unlockLevel: 3,
      },
      {
        id: 'nb-tehran-industrial', name: 'شهرک صنعتی', icon: '🏭',
        description: 'زمین ارزون، مناسب کارخانه و حمل‌ونقل',
        revenueMultiplier: 1.1, expenseMultiplier: 0.8, customerTraffic: 0.7,
        rentMultiplier: 0.5, bestFor: ['factory', 'transport'], unlockLevel: 2,
      },
    ],
  },
  {
    id: 'city-isfahan',
    name: 'اصفهان',
    icon: '🕌',
    description: 'نصف جهان. شهر صنعت و گردشگری.',
    neighborhoods: [
      {
        id: 'nb-isfahan-bazaar', name: 'بازار بزرگ', icon: '🏪',
        description: 'بازار تاریخی، تردد گردشگری بالا',
        revenueMultiplier: 1.3, expenseMultiplier: 1.1, customerTraffic: 1.4,
        rentMultiplier: 1.2, bestFor: ['supermarket', 'restaurant'], unlockLevel: 3,
      },
      {
        id: 'nb-isfahan-industrial', name: 'شهرک صنعتی ذوب‌آهن', icon: '⚙️',
        description: 'قطب صنعتی، هزینه کم، ظرفیت بالا',
        revenueMultiplier: 1.2, expenseMultiplier: 0.7, customerTraffic: 0.8,
        rentMultiplier: 0.5, bestFor: ['factory', 'transport'], unlockLevel: 4,
      },
      {
        id: 'nb-isfahan-farm', name: 'حاشیه زاینده‌رود', icon: '🌊',
        description: 'زمین حاصلخیز، مناسب کشاورزی',
        revenueMultiplier: 1.3, expenseMultiplier: 0.8, customerTraffic: 0.9,
        rentMultiplier: 0.4, bestFor: ['farming'], unlockLevel: 3,
      },
    ],
  },
  {
    id: 'city-shiraz',
    name: 'شیراز',
    icon: '🌹',
    description: 'شهر باغ و شعر. گردشگری و کشاورزی قوی.',
    neighborhoods: [
      {
        id: 'nb-shiraz-center', name: 'بلوار زند', icon: '🛍️',
        description: 'مرکز تجاری شیراز، مشتری متوسط به بالا',
        revenueMultiplier: 1.2, expenseMultiplier: 1.1, customerTraffic: 1.2,
        rentMultiplier: 1.1, bestFor: ['supermarket', 'restaurant', 'app_startup'], unlockLevel: 2,
      },
      {
        id: 'nb-shiraz-garden', name: 'باغ‌های شیراز', icon: '🌿',
        description: 'بهترین زمین کشاورزی، درآمد کشاورزی بالا',
        revenueMultiplier: 1.5, expenseMultiplier: 0.7, customerTraffic: 0.8,
        rentMultiplier: 0.3, bestFor: ['farming'], unlockLevel: 1,
      },
      {
        id: 'nb-shiraz-sadra', name: 'شهر جدید صدرا', icon: '🏗️',
        description: 'شهر جدید، اجاره پایین، رشد آینده',
        revenueMultiplier: 0.9, expenseMultiplier: 0.6, customerTraffic: 0.9,
        rentMultiplier: 0.4, bestFor: ['factory', 'transport'], unlockLevel: 2,
      },
    ],
  },
  {
    id: 'city-tabriz',
    name: 'تبریز',
    icon: '⛰️',
    description: 'مرکز تجارت با ترکیه و قفقاز. صادرات قوی.',
    neighborhoods: [
      {
        id: 'nb-tabriz-bazaar', name: 'بازار تبریز', icon: '🏬',
        description: 'بزرگ‌ترین بازار سرپوشیده جهان، تجارت فعال',
        revenueMultiplier: 1.4, expenseMultiplier: 1.2, customerTraffic: 1.3,
        rentMultiplier: 1.3, bestFor: ['supermarket', 'transport'], unlockLevel: 5,
      },
      {
        id: 'nb-tabriz-border', name: 'منطقه آزاد تجاری', icon: '🚢',
        description: 'واردات و صادرات، حمل‌ونقل بین‌المللی',
        revenueMultiplier: 1.5, expenseMultiplier: 1.0, customerTraffic: 1.1,
        rentMultiplier: 0.8, bestFor: ['transport', 'factory'], unlockLevel: 7,
      },
    ],
  },
];

// هلپر: پیدا کردن محله با آیدی
export function getNeighborhood(neighborhoodId: string): Neighborhood | undefined {
  for (const city of CITIES) {
    const nb = city.neighborhoods.find((n) => n.id === neighborhoodId);
    if (nb) return nb;
  }
  return undefined;
}

// هلپر: پیدا کردن شهر یک محله
export function getCityByNeighborhood(neighborhoodId: string): City | undefined {
  return CITIES.find((c) => c.neighborhoods.some((n) => n.id === neighborhoodId));
}

// ==================== BUSINESS TEMPLATES ====================

export const businessTemplates: BusinessTemplate[] = [
  {
    type: 'app_startup', defaultName: 'داده‌پردازان', icon: '📱',
    description: 'شرکت برنامه‌نویسی. با یک برنامه‌نویس ساده و تجهیزات سخت‌افزاری شروع کنید.',
    startCost: 40_000, baseProductionRate: 3, baseSaleRate: 1.5, baseInventoryCapacity: 15,
    productId: 'prod-8', cycleDuration: 160, baseExpenses: 900,
    maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'لپتاپ و میز کار',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'farming', defaultName: 'مزرعه سبز', icon: '🌾',
    description: 'کشت محصول و پرورش دام. پایه زنجیره تأمین.',
    startCost: 30_000, baseProductionRate: 5, baseSaleRate: 2, baseInventoryCapacity: 30,
    productId: 'prod-1', cycleDuration: 120, baseExpenses: 800,
    maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'زمین کشاورزی و ابزار دستی',
    availableEmployees: farmingEmployees, availableProducts: farmingProducts,
  },
  {
    type: 'restaurant', defaultName: 'رستوران لذیذ', icon: '🍽️',
    description: 'تبدیل مواد اولیه به غذا. حاشیه سود بالا با مدیریت خوب.',
    startCost: 80_000, baseProductionRate: 4, baseSaleRate: 3, baseInventoryCapacity: 20,
    productId: 'prod-7', cycleDuration: 150, baseExpenses: 2_000,
    maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'آشپزخانه صنعتی و سالن غذاخوری',
    availableEmployees: restaurantEmployees, availableProducts: restaurantProducts,
  },
  {
    type: 'factory', defaultName: 'کارخانه تولیدی', icon: '🏭',
    description: 'فرآوری مواد خام به کالاهای نهایی با سود بیشتر.',
    startCost: 120_000, baseProductionRate: 3, baseSaleRate: 1.5, baseInventoryCapacity: 40,
    productId: 'prod-2', cycleDuration: 240, baseExpenses: 3_000,
    maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'خط تولید اولیه',
    availableEmployees: factoryEmployees, availableProducts: factoryProducts,
  },
  {
    type: 'supermarket', defaultName: 'هایپرمارکت', icon: '🏪',
    description: 'فروش مستقیم محصولات. حجم بالا، درآمد پایدار.',
    startCost: 75_000, baseProductionRate: 5, baseSaleRate: 3, baseInventoryCapacity: 45,
    productId: 'prod-3', cycleDuration: 100, baseExpenses: 1_800,
    maxEmployees: 6, maxProducts: 5, maxLevel: 20,
    initialEquipment: 'قفسه‌ها و صندوق فروش',
    availableEmployees: supermarketEmployees, availableProducts: supermarketProducts,
  },
  {
    type: 'transport', defaultName: 'حمل‌ونقل سریع', icon: '🚛',
    description: 'جابجایی کالا بین کسب‌وکارها. بیشترین ظرفیت انبار و درآمد بالا در بلندمدت.',
    startCost: 100_000, baseProductionRate: 5, baseSaleRate: 3, baseInventoryCapacity: 80,
    productId: 'prod-6', cycleDuration: 200, baseExpenses: 2_500,
    maxEmployees: 6, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'یک کامیون و راننده',
    availableEmployees: transportEmployees, availableProducts: transportProducts,
  },
];

// ==================== PLAYER BUSINESSES ====================

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1', ownerId: 'player-1', name: 'داده‌پردازان نوین', type: 'app_startup', level: 2, icon: '📱',
    baseProductionRate: 3, baseSaleRate: 1.5, cycleDuration: 160, lastCycleAt: Date.now() - 100_000,
    inventory: { productId: 'prod-8', quantity: 0, maxCapacity: 15 },
    fractionalProduced: 0, fractionalSold: 0,
    expenses: 900, upgradeCost: 54_000,
    officeLevel: 1, maxEmployees: 3, maxProducts: 1, maxLevel: 20,
    employees: [{
      id: 'he-1', templateId: 'emp-as-1', name: 'برنامه‌نویس', role: 'production', roleName: 'برنامه‌نویس',
      icon: '👨‍💻', salary: 1_500, productionBoost: 1, salesBoost: 0, capacityBoost: 0,
      hiredAt: Date.now() - 86400000,
      employeeLevel: 1, maxUpgradeLevel: 3, baseHireCost: 12_000,
      upgradeStartedAt: null, upgradeEndsAt: null,
    }],
    products: [
      { ...appStartupProducts[0], unlocked: true },
      { ...appStartupProducts[1] },
      { ...appStartupProducts[2] },
    ],
    initialEquipment: 'لپتاپ و میز کار',
    upgradeStartedAt: null,
    upgradeEndsAt: null,
  },
];

// ==================== PRODUCTS ====================

export const mockProducts: Product[] = [
  { id: 'prod-1', name: 'گندم', category: 'raw_material', icon: '🌾', basePrice: 420, currentPrice: 440, supply: 500, demand: 450, baseSupply: 500, baseDemand: 450, priceHistory: [420, 410, 430, 440, 425, 445, 440] },
  { id: 'prod-2', name: 'آرد', category: 'processed', icon: '🫘', basePrice: 800, currentPrice: 820, supply: 300, demand: 350, baseSupply: 300, baseDemand: 350, priceHistory: [800, 790, 810, 820, 800, 830, 820] },
  { id: 'prod-3', name: 'نان', category: 'finished_good', icon: '🍞', basePrice: 600, currentPrice: 620, supply: 200, demand: 280, baseSupply: 200, baseDemand: 280, priceHistory: [600, 590, 610, 620, 605, 625, 620] },
  { id: 'prod-4', name: 'گوجه', category: 'raw_material', icon: '🍅', basePrice: 100, currentPrice: 90, supply: 600, demand: 400, baseSupply: 600, baseDemand: 400, priceHistory: [100, 110, 95, 85, 90, 95, 90] },
  { id: 'prod-5', name: 'شیر', category: 'raw_material', icon: '🥛', basePrice: 180, currentPrice: 200, supply: 250, demand: 320, baseSupply: 250, baseDemand: 320, priceHistory: [180, 185, 175, 190, 200, 195, 200] },
  { id: 'prod-6', name: 'پنیر', category: 'processed', icon: '🧀', basePrice: 400, currentPrice: 420, supply: 150, demand: 200, baseSupply: 150, baseDemand: 200, priceHistory: [400, 390, 410, 415, 420, 410, 420] },
  { id: 'prod-7', name: 'پیتزا', category: 'food', icon: '🍕', basePrice: 450, currentPrice: 465, supply: 100, demand: 180, baseSupply: 100, baseDemand: 180, priceHistory: [450, 440, 455, 460, 465, 455, 465] },
  { id: 'prod-8', name: 'اپلیکیشن موبایل', category: 'tech', icon: '📱', basePrice: 450, currentPrice: 470, supply: 50, demand: 120, baseSupply: 50, baseDemand: 120, priceHistory: [450, 440, 460, 465, 470, 460, 470] },
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

// ==================== LIFE ACTIONS ====================

// کاهش خودکار stat‌ها هر ۱۰ دقیقه
export const STAT_DECAY_INTERVAL = 10 * 60 * 1000; // 10 min
export const STAT_DECAY_AMOUNTS: Partial<Record<keyof PlayerStats, number>> = {
  energy: -2,
  hunger: 2,       // گرسنگی بالا میره (بد)
  happiness: -1,
};

// ضریب‌های stat روی گیم‌پلی
export const STAT_GAMEPLAY_EFFECTS = {
  // energy < 20 → سیکل ۱۵٪ کندتر | energy > 80 → سیکل ۱۰٪ سریعتر
  energyCycleMultiplier: (energy: number) =>
    energy < 20 ? 0.85 : energy > 80 ? 1.1 : 1.0,
  // happiness > 70 → +۱۰٪ درآمد | happiness < 30 → -۱۰٪ درآمد
  happinessRevenueMultiplier: (happiness: number) =>
    happiness > 70 ? 1.1 : happiness < 30 ? 0.90 : 1.0,
  // hunger > 80 → -۵٪ درآمد (خیلی گرسنه)
  hungerRevenueMultiplier: (hunger: number) =>
    hunger > 80 ? 0.95 : 1.0,
  // intelligence > 70 → -۵٪ هزینه ارتقا
  intelligenceUpgradeDiscount: (intelligence: number) =>
    intelligence > 70 ? 0.95 : 1.0,
};

export const LIFE_ACTIONS: LifeAction[] = [
  // غذا
  {
    id: 'eat-sandwich', name: 'ساندویچ', icon: '🥪', description: 'یه ساندویچ ساده',
    category: 'food', cost: 200, cooldownMs: 5 * 60 * 1000,
    effect: { hunger: -20, energy: 5 },
  },
  {
    id: 'eat-kebab', name: 'چلوکباب', icon: '🍖', description: 'یه پرس چلوکباب مفصل',
    category: 'food', cost: 800, cooldownMs: 12 * 60 * 1000,
    effect: { hunger: -50, happiness: 10, energy: 10 },
  },
  {
    id: 'eat-pizza', name: 'پیتزا', icon: '🍕', description: 'پیتزا مخصوص',
    category: 'food', cost: 500, cooldownMs: 8 * 60 * 1000,
    effect: { hunger: -35, happiness: 8 },
  },
  // استراحت
  {
    id: 'rest-nap', name: 'چرت کوتاه', icon: '😴', description: '۲۰ دقیقه استراحت',
    category: 'rest', cost: 0, cooldownMs: 6 * 60 * 1000,
    effect: { energy: 15 },
  },
  {
    id: 'rest-sleep', name: 'خواب کامل', icon: '🛏️', description: 'یه خواب حسابی',
    category: 'rest', cost: 0, cooldownMs: 20 * 60 * 1000,
    effect: { energy: 40, happiness: 5 },
  },
  {
    id: 'rest-cafe', name: 'کافه', icon: '☕', description: 'یه قهوه توی کافه',
    category: 'rest', cost: 300, cooldownMs: 6 * 60 * 1000,
    effect: { energy: 12, happiness: 8 },
  },
  // آموزش
  {
    id: 'edu-book', name: 'مطالعه کتاب', icon: '📖', description: 'یه ساعت مطالعه',
    category: 'education', cost: 0, cooldownMs: 30 * 60 * 1000,
    effect: { intelligence: 8, energy: -10 },
  },
  {
    id: 'edu-course', name: 'دوره آنلاین', icon: '💻', description: 'شرکت در دوره آموزشی',
    category: 'education', cost: 2_000, cooldownMs: 60 * 60 * 1000,
    effect: { intelligence: 20, experience: 10, energy: -15 },
  },
  {
    id: 'edu-podcast', name: 'پادکست', icon: '🎧', description: 'گوش دادن به پادکست کسب‌وکار',
    category: 'education', cost: 0, cooldownMs: 20 * 60 * 1000,
    effect: { intelligence: 5, experience: 3 },
  },
  // ورزش
  {
    id: 'fit-walk', name: 'پیاده‌روی', icon: '🚶', description: 'نیم ساعت قدم زدن',
    category: 'fitness', cost: 0, cooldownMs: 8 * 60 * 1000,
    effect: { energy: 10, happiness: 5, hunger: 10 },
  },
  {
    id: 'fit-gym', name: 'باشگاه', icon: '💪', description: 'یه ساعت ورزش',
    category: 'fitness', cost: 500, cooldownMs: 18 * 60 * 1000,
    effect: { energy: -10, happiness: 15, hunger: 15 },
  },
  // سرگرمی
  {
    id: 'fun-movie', name: 'سینما', icon: '🎬', description: 'رفتن سینما',
    category: 'entertainment', cost: 600, cooldownMs: 20 * 60 * 1000,
    effect: { happiness: 25, energy: -5 },
  },
  {
    id: 'fun-game', name: 'بازی ویدیویی', icon: '🎮', description: 'یه ساعت بازی',
    category: 'entertainment', cost: 0, cooldownMs: 10 * 60 * 1000,
    effect: { happiness: 15, energy: -8 },
  },
  {
    id: 'fun-park', name: 'پارک', icon: '🌳', description: 'گردش در پارک',
    category: 'entertainment', cost: 0, cooldownMs: 8 * 60 * 1000,
    effect: { happiness: 12, energy: 5 },
  },
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

// ==================== RANDOM EVENTS ====================

export const EVENT_CONFIG = {
  checkIntervalMs: 60 * 1000,        // چک هر 60 ثانیه
  minTimeBetweenMs: 2 * 60 * 1000,   // حداقل 2 دقیقه بین رویدادها
  triggerChance: 0.35,                // 35% شانس هر چک
  maxActiveEvents: 2,
};

// ==================== EMPLOYEE UPGRADE ====================

// مدت زمان ارتقای نیرو (بر حسب میلی‌ثانیه)
// L1→L2: 8 دقیقه, L2→L3: 16min — سقف ۴۵ دقیقه
export function getEmployeeUpgradeDuration(currentLevel: number): number {
  return Math.min(currentLevel * 8, 45) * 60 * 1000;
}

// مدت زمان ارتقای شرکت (بر حسب میلی‌ثانیه)
// LV1→2: 5min, LV5→6: 25min, LV10→11: 50min — سقف ۶۰ دقیقه
export function getBusinessUpgradeDuration(currentLevel: number): number {
  return Math.min(currentLevel * 5, 60) * 60 * 1000;
}

// ==================== MISSIONS ====================

export const DAILY_MISSIONS: MissionTemplate[] = [
  { id: 'dm-collect-3', title: 'جمع‌آوری درآمد', description: '۳ بار درآمد شرکت‌ها رو جمع کن', icon: '💰', type: 'daily', condition: 'collect_revenue', target: 3, reward: 5_000 },
  { id: 'dm-collect-5', title: 'جمع‌آوری حرفه‌ای', description: '۵ بار درآمد جمع کن', icon: '💵', type: 'daily', condition: 'collect_revenue', target: 5, reward: 10_000 },
  { id: 'dm-earn-20k', title: 'درآمدزایی', description: '۲۰,۰۰۰ تومان کسب کن', icon: '📈', type: 'daily', condition: 'earn_total', target: 20_000, reward: 8_000 },
  { id: 'dm-earn-50k', title: 'سودآوری', description: '۵۰,۰۰۰ تومان کسب کن', icon: '🤑', type: 'daily', condition: 'earn_total', target: 50_000, reward: 15_000 },
  { id: 'dm-daily-bonus', title: 'حضور روزانه', description: 'بونوس روزانه رو دریافت کن', icon: '🎁', type: 'daily', condition: 'claim_daily_bonus', target: 1, reward: 3_000 },
  { id: 'dm-upgrade-1', title: 'ارتقاگر', description: 'یک شرکت رو ارتقا بده', icon: '⬆️', type: 'daily', condition: 'upgrade_business', target: 1, reward: 7_000 },
  { id: 'dm-event-1', title: 'واکنش سریع', description: 'به یک رویداد پاسخ بده', icon: '⚡', type: 'daily', condition: 'respond_to_event', target: 1, reward: 6_000 },
];

export const WEEKLY_MISSIONS: MissionTemplate[] = [
  { id: 'wm-collect-20', title: 'جمع‌آوری هفتگی', description: '۲۰ بار درآمد جمع کن', icon: '💎', type: 'weekly', condition: 'collect_revenue', target: 20, reward: 30_000 },
  { id: 'wm-earn-200k', title: 'کارآفرین هفته', description: '۲۰۰,۰۰۰ تومان کسب کن', icon: '🏆', type: 'weekly', condition: 'earn_total', target: 200_000, reward: 50_000 },
  { id: 'wm-hire-2', title: 'تیم‌ساز', description: '۲ نیرو استخدام کن', icon: '👥', type: 'weekly', condition: 'hire_employee', target: 2, reward: 25_000 },
  { id: 'wm-upgrade-3', title: 'رشد مداوم', description: '۳ بار شرکت رو ارتقا بده', icon: '📊', type: 'weekly', condition: 'upgrade_business', target: 3, reward: 35_000 },
  { id: 'wm-product-1', title: 'محصول جدید', description: 'یک محصول آنلاک کن', icon: '🔓', type: 'weekly', condition: 'unlock_product', target: 1, reward: 20_000 },
];

export const ONE_TIME_MISSIONS: MissionTemplate[] = [
  { id: 'otm-first-biz', title: 'اولین قدم', description: 'اولین شرکتت رو بساز', icon: '🎯', type: 'one_time', condition: 'create_business', target: 1, reward: 10_000, xpReward: 10 },
  { id: 'otm-hire-first', title: 'اولین استخدام', description: 'اولین نیرو رو استخدام کن', icon: '🤝', type: 'one_time', condition: 'hire_employee', target: 1, reward: 8_000, xpReward: 5 },
  { id: 'otm-upgrade-5', title: 'رشد پایدار', description: 'یک شرکت رو به سطح ۵ برسون', icon: '📈', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 25_000, xpReward: 15 },
  { id: 'otm-upgrade-10', title: 'شرکت قدرتمند', description: 'یک شرکت رو به سطح ۱۰ برسون', icon: '💪', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 60_000, xpReward: 30 },
  { id: 'otm-3-biz', title: 'امپراتوری کوچک', description: '۳ شرکت همزمان داشته باش', icon: '🏢', type: 'one_time', condition: 'own_businesses', target: 3, reward: 50_000, xpReward: 25 },
  { id: 'otm-office-2', title: 'دفتر بزرگتر', description: 'دفتر یک شرکت رو ارتقا بده', icon: '🏗️', type: 'one_time', condition: 'upgrade_office', target: 1, reward: 15_000, xpReward: 10 },
  { id: 'otm-100k', title: 'صد هزاری', description: 'به ۱۰۰,۰۰۰ تومان موجودی برس', icon: '💰', type: 'one_time', condition: 'reach_balance', target: 100_000, reward: 20_000, xpReward: 10 },
  { id: 'otm-500k', title: 'نیم میلیونر', description: 'به ۵۰۰,۰۰۰ تومان موجودی برس', icon: '💵', type: 'one_time', condition: 'reach_balance', target: 500_000, reward: 50_000, xpReward: 20 },
  { id: 'otm-1m', title: 'میلیونر', description: 'به ۱,۰۰۰,۰۰۰ تومان موجودی برس', icon: '🤑', type: 'one_time', condition: 'reach_balance', target: 1_000_000, reward: 100_000, xpReward: 50 },
];

// ==================== SPECIALTY MILESTONES ====================

export const SPECIALTY_MILESTONES: Record<BusinessType, SpecialtyMilestone[]> = {
  farming: [
    { levelThreshold: 1,  name: 'زمیندار کوچک',      icon: '🌱', description: 'یه زمین کوچیک داری' },
    { levelThreshold: 4,  name: 'کشاورز',              icon: '🚜', description: 'کشاورزی حرفه‌ای' },
    { levelThreshold: 8,  name: 'مزرعه‌دار',           icon: '🌾', description: 'مزرعه متوسط' },
    { levelThreshold: 13, name: 'کشاورز بزرگ',         icon: '🏡', description: 'مزرعه بزرگ' },
    { levelThreshold: 18, name: 'امپراتوری کشاورزی',   icon: '👑', description: 'بزرگترین مزرعه‌دار' },
  ],
  factory: [
    { levelThreshold: 1,  name: 'کارگاه کوچک',        icon: '🔧', description: 'یه کارگاه ساده' },
    { levelThreshold: 4,  name: 'کارگاه',              icon: '⚙️', description: 'کارگاه فعال' },
    { levelThreshold: 8,  name: 'کارخانه',             icon: '🏭', description: 'کارخانه متوسط' },
    { levelThreshold: 13, name: 'صنعتگر بزرگ',         icon: '🏗️', description: 'صنعتگر برجسته' },
    { levelThreshold: 18, name: 'غول صنعتی',           icon: '🌋', description: 'بزرگترین صنعتگر' },
  ],
  supermarket: [
    { levelThreshold: 1,  name: 'دکان محلی',           icon: '🛖', description: 'یه دکان کوچیک' },
    { levelThreshold: 4,  name: 'مینی‌مارکت',           icon: '🏪', description: 'مینی‌مارکت محله' },
    { levelThreshold: 8,  name: 'سوپرمارکت',           icon: '🏬', description: 'سوپرمارکت شناخته‌شده' },
    { levelThreshold: 13, name: 'هایپرمارکت',           icon: '🏢', description: 'هایپرمارکت بزرگ' },
    { levelThreshold: 18, name: 'شبکه فروشگاهی',       icon: '🌐', description: 'زنجیره ملی' },
  ],
  restaurant: [
    { levelThreshold: 1,  name: 'غذاخوری',             icon: '🍜', description: 'غذاخوری ساده' },
    { levelThreshold: 4,  name: 'رستوران',              icon: '🍽️', description: 'رستوران واقعی' },
    { levelThreshold: 8,  name: 'رستوران مشهور',        icon: '⭐', description: 'رستوران پرطرفدار' },
    { levelThreshold: 13, name: 'زنجیره رستوران',       icon: '🌟', description: 'زنجیره رستورانی' },
    { levelThreshold: 18, name: 'امپراتوری غذایی',      icon: '👑', description: 'بزرگترین زنجیره' },
  ],
  app_startup: [
    { levelThreshold: 1,  name: 'فریلنسر',             icon: '💻', description: 'فریلنسر مستقل' },
    { levelThreshold: 4,  name: 'استودیو کوچک',        icon: '🖥️', description: 'استودیوی نوپا' },
    { levelThreshold: 8,  name: 'شرکت نرم‌افزاری',     icon: '📱', description: 'شرکت نرم‌افزاری' },
    { levelThreshold: 13, name: 'تک‌استارتاپ',         icon: '🚀', description: 'استارتاپ موفق' },
    { levelThreshold: 18, name: 'هلدینگ دیجیتال',      icon: '🌐', description: 'هلدینگ دیجیتال' },
  ],
  transport: [
    { levelThreshold: 1,  name: 'وانت‌بار',             icon: '🚐', description: 'یه وانت ساده' },
    { levelThreshold: 4,  name: 'آژانس تاکسی',         icon: '🚕', description: 'آژانس کوچیک' },
    { levelThreshold: 8,  name: 'شرکت باربری',         icon: '🚚', description: 'شرکت باربری' },
    { levelThreshold: 13, name: 'ناوگان حمل‌ونقل',     icon: '🚛', description: 'ناوگان بزرگ' },
    { levelThreshold: 18, name: 'لجستیک ملی',          icon: '🗺️', description: 'لجستیک سراسری' },
  ],
};

// ==================== SPECIALTY MISSIONS ====================

export const SPECIALTY_MISSION_TEMPLATES: MissionTemplate[] = [
  // ---- FARMING ----
  { id: 'sp-fm-1', title: 'اولین برداشت', description: '۵۰ واحد محصول کشاورزی تولید کن', icon: '🌾', type: 'one_time', condition: 'produce_units', target: 50, reward: 10_000, businessTypeFilter: 'farming' },
  { id: 'sp-fm-2', title: 'کشاورز حرفه‌ای', description: 'مزرعه رو به سطح ۵ برسون', icon: '🚜', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 25_000, businessTypeFilter: 'farming' },
  { id: 'sp-fm-3', title: 'فروشنده محصول', description: '۲۰۰ واحد محصول کشاورزی بفروش', icon: '🏪', type: 'one_time', condition: 'sell_units', target: 200, reward: 35_000, businessTypeFilter: 'farming' },
  { id: 'sp-fm-4', title: 'مزرعه بزرگ', description: 'مزرعه رو به سطح ۱۰ برسون', icon: '🌻', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 70_000, businessTypeFilter: 'farming' },
  // ---- FACTORY ----
  { id: 'sp-fc-1', title: 'خط تولید', description: '۱۰۰ واحد محصول کارخانه تولید کن', icon: '⚙️', type: 'one_time', condition: 'produce_units', target: 100, reward: 20_000, businessTypeFilter: 'factory' },
  { id: 'sp-fc-2', title: 'کارخانه‌دار', description: 'کارخانه رو به سطح ۵ برسون', icon: '🏭', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 45_000, businessTypeFilter: 'factory' },
  { id: 'sp-fc-3', title: 'فروش صنعتی', description: '۵۰۰ واحد کالای کارخانه بفروش', icon: '📦', type: 'one_time', condition: 'sell_units', target: 500, reward: 80_000, businessTypeFilter: 'factory' },
  { id: 'sp-fc-4', title: 'غول صنعتی', description: 'کارخانه رو به سطح ۱۰ برسون', icon: '🔩', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 120_000, businessTypeFilter: 'factory' },
  // ---- SUPERMARKET ----
  { id: 'sp-sm-1', title: 'فروش اول', description: '۵۰ واحد کالا در سوپرمارکت بفروش', icon: '🛒', type: 'one_time', condition: 'sell_units', target: 50, reward: 15_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-2', title: 'مینی‌مارکت', description: 'سوپرمارکت رو به سطح ۵ برسون', icon: '🏪', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 40_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-3', title: 'گردش مالی بالا', description: '۵۰۰,۰۰۰ تومان از سوپرمارکت کسب کن', icon: '💰', type: 'one_time', condition: 'earn_total', target: 500_000, reward: 60_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-4', title: 'زنجیره فروشگاهی', description: '۲ سوپرمارکت همزمان داشته باش', icon: '🏬', type: 'one_time', condition: 'own_businesses', target: 2, reward: 80_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-5', title: 'هایپرمارکت', description: 'سوپرمارکت رو به سطح ۱۰ برسون', icon: '🌐', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 150_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-6', title: 'فروش کلان', description: '۱,۰۰۰ واحد کالا در سوپرمارکت بفروش', icon: '📊', type: 'one_time', condition: 'sell_units', target: 1_000, reward: 120_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-7', title: 'سفارش‌های ویژه', description: '۵ سفارش ویژه در سوپرمارکت تکمیل کن', icon: '📦', type: 'one_time', condition: 'complete_special_order', target: 5, reward: 80_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-8', title: 'درآمد میلیونی', description: '۱,۰۰۰,۰۰۰ تومان از سوپرمارکت کسب کن', icon: '💎', type: 'one_time', condition: 'earn_total', target: 1_000_000, reward: 200_000, businessTypeFilter: 'supermarket' },
  { id: 'sp-sm-9', title: 'شبکه فروشگاهی', description: 'سوپرمارکت رو به سطح ۱۵ برسون', icon: '🏆', type: 'one_time', condition: 'reach_business_level', target: 15, reward: 300_000, businessTypeFilter: 'supermarket' },
  // ---- RESTAURANT ----
  { id: 'sp-rs-1', title: 'اولین سرویس', description: '۵۰ واحد غذا بفروش', icon: '🍽️', type: 'one_time', condition: 'sell_units', target: 50, reward: 12_000, businessTypeFilter: 'restaurant' },
  { id: 'sp-rs-2', title: 'رستوران واقعی', description: 'رستوران رو به سطح ۵ برسون', icon: '⭐', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 35_000, businessTypeFilter: 'restaurant' },
  { id: 'sp-rs-3', title: 'زنجیره رستوران', description: '۲ رستوران همزمان داشته باش', icon: '🌟', type: 'one_time', condition: 'own_businesses', target: 2, reward: 60_000, businessTypeFilter: 'restaurant' },
  { id: 'sp-rs-4', title: 'امپراتوری غذایی', description: 'رستوران رو به سطح ۱۰ برسون', icon: '👑', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 100_000, businessTypeFilter: 'restaurant' },
  // ---- APP_STARTUP ----
  { id: 'sp-as-1', title: 'اولین ماژول', description: '۳۰ ماژول نرم‌افزاری تولید کن', icon: '💻', type: 'one_time', condition: 'produce_units', target: 30, reward: 20_000, businessTypeFilter: 'app_startup' },
  { id: 'sp-as-2', title: 'استارتاپ جدی', description: 'استارتاپ رو به سطح ۵ برسون', icon: '🚀', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 50_000, businessTypeFilter: 'app_startup' },
  { id: 'sp-as-3', title: 'فروش دیجیتال', description: '۱۵۰ واحد محصول دیجیتال بفروش', icon: '📲', type: 'one_time', condition: 'sell_units', target: 150, reward: 75_000, businessTypeFilter: 'app_startup' },
  { id: 'sp-as-4', title: 'هلدینگ دیجیتال', description: 'استارتاپ رو به سطح ۱۰ برسون', icon: '🌐', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 150_000, businessTypeFilter: 'app_startup' },
  // ---- TRANSPORT ----
  { id: 'sp-tr-1', title: 'اولین سرویس', description: '۳۰ واحد بار حمل کن', icon: '🚐', type: 'one_time', condition: 'sell_units', target: 30, reward: 15_000, businessTypeFilter: 'transport' },
  { id: 'sp-tr-2', title: 'شرکت حمل‌ونقل', description: 'شرکت حمل‌ونقل رو به سطح ۵ برسون', icon: '🚕', type: 'one_time', condition: 'reach_business_level', target: 5, reward: 40_000, businessTypeFilter: 'transport' },
  { id: 'sp-tr-3', title: 'ناوگان', description: '۲ شرکت حمل‌ونقل همزمان داشته باش', icon: '🚛', type: 'one_time', condition: 'own_businesses', target: 2, reward: 70_000, businessTypeFilter: 'transport' },
  { id: 'sp-tr-4', title: 'لجستیک ملی', description: 'شرکت حمل‌ونقل رو به سطح ۱۰ برسون', icon: '🗺️', type: 'one_time', condition: 'reach_business_level', target: 10, reward: 120_000, businessTypeFilter: 'transport' },
];

// ==================== ACHIEVEMENTS ====================

export const ACHIEVEMENTS_TEMPLATES: Achievement[] = [
  // ===== کسب‌وکار (milestone) =====
  { id: 'ach-first-biz', title: 'کارآفرین', description: 'اولین شرکت رو بساز', icon: '🏢', tier: 'bronze', rarity: 'common', category: 'milestone', condition: 'create_business', target: 1, progress: 0, unlockedAt: null, badge: '🥉', reward: { money: 5_000 } },
  { id: 'ach-3-biz', title: 'سرمایه‌گذار', description: '۳ شرکت همزمان داشته باش', icon: '🏗️', tier: 'silver', rarity: 'rare', category: 'milestone', condition: 'own_businesses', target: 3, progress: 0, unlockedAt: null, badge: '🥈', reward: { money: 30_000 } },
  { id: 'ach-5-biz', title: 'امپراتور', description: '۵ شرکت همزمان داشته باش', icon: '👑', tier: 'gold', rarity: 'epic', category: 'milestone', condition: 'own_businesses', target: 5, progress: 0, unlockedAt: null, badge: '🥇', reward: { money: 100_000 } },

  // ===== سطح (milestone) =====
  { id: 'ach-level-5', title: 'تازه‌کار حرفه‌ای', description: 'یک شرکت رو به سطح ۵ برسون', icon: '⭐', tier: 'bronze', rarity: 'common', category: 'milestone', condition: 'reach_business_level', target: 5, progress: 0, unlockedAt: null, badge: '⭐', reward: { money: 10_000 } },
  { id: 'ach-level-10', title: 'باتجربه', description: 'یک شرکت رو به سطح ۱۰ برسون', icon: '🌟', tier: 'silver', rarity: 'rare', category: 'milestone', condition: 'reach_business_level', target: 10, progress: 0, unlockedAt: null, badge: '🌟', reward: { money: 50_000 } },
  { id: 'ach-level-20', title: 'سازمانی', description: 'یک شرکت رو به سطح ۲۰ برسون', icon: '💫', tier: 'diamond', rarity: 'legendary', category: 'milestone', condition: 'reach_business_level', target: 20, progress: 0, unlockedAt: null, badge: '💫', reward: { money: 200_000 } },

  // ===== ثروت (milestone) =====
  { id: 'ach-100k', title: 'صدهزاری', description: 'موجودی ۱۰۰ هزار تومان', icon: '💰', tier: 'bronze', rarity: 'common', category: 'milestone', condition: 'reach_balance', target: 100_000, progress: 0, unlockedAt: null, badge: '💰', reward: { money: 10_000 } },
  { id: 'ach-500k', title: 'نیم میلیونر', description: 'موجودی ۵۰۰ هزار تومان', icon: '💵', tier: 'silver', rarity: 'rare', category: 'milestone', condition: 'reach_balance', target: 500_000, progress: 0, unlockedAt: null, badge: '💵', reward: { money: 50_000 } },
  { id: 'ach-1m', title: 'میلیونر', description: 'موجودی ۱ میلیون تومان', icon: '🤑', tier: 'gold', rarity: 'epic', category: 'milestone', condition: 'reach_balance', target: 1_000_000, progress: 0, unlockedAt: null, badge: '🤑', reward: { money: 100_000 } },
  { id: 'ach-5m', title: 'مولتی‌میلیونر', description: 'موجودی ۵ میلیون تومان', icon: '💎', tier: 'diamond', rarity: 'legendary', category: 'milestone', condition: 'reach_balance', target: 5_000_000, progress: 0, unlockedAt: null, badge: '💎', reward: { money: 500_000 } },
  { id: 'ach-10m', title: 'ده‌میلیونر', description: 'موجودی ۱۰ میلیون تومان', icon: '👑', tier: 'diamond', rarity: 'legendary', category: 'milestone', condition: 'reach_balance', target: 10_000_000, progress: 0, unlockedAt: null, badge: '💎', reward: { money: 1_000_000 } },

  // ===== نیرو (milestone) =====
  { id: 'ach-hire-1', title: 'رئیس', description: 'اولین نیرو رو استخدام کن', icon: '🤝', tier: 'bronze', rarity: 'common', category: 'milestone', condition: 'hire_employee', target: 1, progress: 0, unlockedAt: null, badge: '🤝', reward: { money: 5_000 } },
  { id: 'ach-hire-5', title: 'مدیر', description: '۵ نیروی کار داشته باش', icon: '👥', tier: 'silver', rarity: 'rare', category: 'milestone', condition: 'total_employees', target: 5, progress: 0, unlockedAt: null, badge: '👥', reward: { money: 25_000 } },
  { id: 'ach-hire-15', title: 'رهبر', description: '۱۵ نیرو داشته باش', icon: '🏛️', tier: 'gold', rarity: 'epic', category: 'milestone', condition: 'total_employees', target: 15, progress: 0, unlockedAt: null, badge: '🏛️', reward: { money: 75_000 } },

  // ===== دفتر (milestone) =====
  { id: 'ach-office-2', title: 'دفتردار', description: 'دفتر رو ارتقا بده', icon: '🏠', tier: 'bronze', rarity: 'common', category: 'milestone', condition: 'upgrade_office', target: 1, progress: 0, unlockedAt: null, badge: '🏠', reward: { money: 10_000 } },
  { id: 'ach-office-4', title: 'ساختمان‌ساز', description: 'به ساختمان تجاری برس', icon: '🏛️', tier: 'gold', rarity: 'epic', category: 'milestone', condition: 'upgrade_office', target: 3, progress: 0, unlockedAt: null, badge: '🏢', reward: { money: 80_000 } },

  // ===== مجموعه (collection) =====
  { id: 'ach-all-types', title: 'تاجر جهانی', description: 'از هر نوع کسب‌وکار یکی داشته باش', icon: '🌍', tier: 'diamond', rarity: 'legendary', category: 'collection', condition: 'own_all_business_types', target: 6, progress: 0, unlockedAt: null, badge: '🌍', reward: { money: 300_000, statBoost: { experience: 15 } } },

  // ===== آمار (stat) =====
  { id: 'ach-int-100', title: 'نابغه', description: 'هوش رو به ۱۰۰ برسون', icon: '🧠', tier: 'gold', rarity: 'epic', category: 'stat', condition: 'reach_stat_intelligence', target: 100, progress: 0, unlockedAt: null, badge: '🧠', reward: { money: 100_000, statBoost: { experience: 20 } } },
  { id: 'ach-happy-100', title: 'شادمان', description: 'شادی رو به ۱۰۰ برسون', icon: '😄', tier: 'silver', rarity: 'rare', category: 'stat', condition: 'reach_stat_happiness', target: 100, progress: 0, unlockedAt: null, badge: '😄', reward: { money: 50_000 } },
  { id: 'ach-energy-100', title: 'پرانرژی', description: 'انرژی رو به ۱۰۰ برسون', icon: '⚡', tier: 'silver', rarity: 'rare', category: 'stat', condition: 'reach_stat_energy', target: 100, progress: 0, unlockedAt: null, badge: '⚡', reward: { money: 50_000 } },
  { id: 'ach-player-level-10', title: 'حرفه‌ای', description: 'به سطح ۱۰ بازیکن برس', icon: '🎯', tier: 'silver', rarity: 'rare', category: 'stat', condition: 'reach_player_level', target: 10, progress: 0, unlockedAt: null, badge: '🎯', reward: { money: 75_000 } },
  { id: 'ach-player-level-20', title: 'افسانه‌ای', description: 'به سطح ۲۰ بازیکن برس', icon: '🏆', tier: 'diamond', rarity: 'legendary', category: 'stat', condition: 'reach_player_level', target: 20, progress: 0, unlockedAt: null, badge: '🏆', reward: { money: 200_000, statBoost: { experience: 25 } } },

  // ===== عملکرد (action) =====
  { id: 'ach-upgrade-5', title: 'ارتقاچی', description: '۵ بار ارتقا انجام بده', icon: '🔧', tier: 'bronze', rarity: 'common', category: 'action', condition: 'total_upgrades', target: 5, progress: 0, unlockedAt: null, badge: '🔧', reward: { money: 20_000 } },
  { id: 'ach-upgrade-20', title: 'معمار', description: '۲۰ بار ارتقا انجام بده', icon: '🏗️', tier: 'silver', rarity: 'rare', category: 'action', condition: 'total_upgrades', target: 20, progress: 0, unlockedAt: null, badge: '🏗️', reward: { money: 80_000 } },
  { id: 'ach-upgrade-50', title: 'مهندس ارشد', description: '۵۰ بار ارتقا انجام بده', icon: '⚙️', tier: 'gold', rarity: 'epic', category: 'action', condition: 'total_upgrades', target: 50, progress: 0, unlockedAt: null, badge: '⚙️', reward: { money: 200_000 } },
  { id: 'ach-mission-10', title: 'ماموریت‌باز', description: '۱۰ ماموریت تکمیل کن', icon: '📋', tier: 'bronze', rarity: 'common', category: 'action', condition: 'complete_missions', target: 10, progress: 0, unlockedAt: null, badge: '📋', reward: { money: 15_000 } },
  { id: 'ach-mission-50', title: 'حرفه‌ای ماموریت', description: '۵۰ ماموریت تکمیل کن', icon: '🎖️', tier: 'gold', rarity: 'epic', category: 'action', condition: 'complete_missions', target: 50, progress: 0, unlockedAt: null, badge: '🎖️', reward: { money: 100_000 } },
];

// ==================== FICTIONAL COMPANIES ====================
export const FICTIONAL_COMPANIES = [
  { name: 'شرکت آریان تجارت', icon: '🏢' },
  { name: 'گروه صنعتی پارسیان', icon: '🏭' },
  { name: 'فروشگاه زنجیره‌ای رفاه', icon: '🏪' },
  { name: 'هلدینگ سپهر', icon: '🏛️' },
  { name: 'شرکت نوآوران فردا', icon: '💡' },
  { name: 'مجتمع تولیدی البرز', icon: '⛰️' },
  { name: 'شرکت بازرگانی ایرانیان', icon: '🌐' },
  { name: 'گروه غذایی گلستان', icon: '🌻' },
  { name: 'شرکت حمل‌ونقل سریع‌بار', icon: '🚛' },
  { name: 'فناوری اطلاعات پیشگام', icon: '💻' },
  { name: 'شرکت ساختمانی عمران', icon: '🏗️' },
  { name: 'مجتمع کشاورزی سبز', icon: '🌿' },
  { name: 'شرکت پخش مروارید', icon: '📦' },
  { name: 'رستوران زنجیره‌ای چلوکباب', icon: '🍖' },
  { name: 'شرکت دارویی حیات', icon: '💊' },
  { name: 'گروه توسعه فناوری نوین', icon: '🔬' },
  { name: 'بازرگانی آسیا تجارت', icon: '🌏' },
  { name: 'شرکت خدمات مهندسی تدبیر', icon: '⚙️' },
  { name: 'صنایع غذایی بهنوش', icon: '🥤' },
  { name: 'مجموعه هتل‌های پارسیان', icon: '🏨' },
  { name: 'شرکت لبنیات میهن', icon: '🥛' },
  { name: 'ایران خودرو', icon: '🚗' },
  { name: 'پتروشیمی جم', icon: '🛢️' },
  { name: 'شرکت مخابرات نوین', icon: '📡' },
  { name: 'صنایع فولاد اصفهان', icon: '🔩' },
  { name: 'شرکت بیمه ایران', icon: '🛡️' },
  { name: 'گروه صنعتی ایران‌تایر', icon: '🔄' },
  { name: 'شرکت نساجی مازندران', icon: '🧵' },
  { name: 'مجتمع معدنی چادرملو', icon: '⛏️' },
  { name: 'شرکت کشتیرانی جنوب', icon: '🚢' },
];

// ==================== ORDER CONFIG ====================
export const ORDER_CONFIG = {
  generationIntervalMs: 3 * 60 * 1000,  // هر ۳ دقیقه
  minOrders: 1,
  maxOrders: 3,
  priceMultiplierMin: 1.2,
  priceMultiplierMax: 1.8,
  deadlineMinMs: 5 * 60 * 1000,    // ۵ دقیقه
  deadlineMaxMs: 30 * 60 * 1000,   // ۳۰ دقیقه
  penaltyRate: 0.2,                 // ۲۰٪ جریمه
  maxAvailableOrders: 8,
  maxAcceptedOrders: 3,
};

export const EVENT_TEMPLATES: EventTemplate[] = [
  // ===== GLOBAL =====
  {
    id: 'evt-boom', title: 'رونق اقتصادی', description: 'اقتصاد در شرایط عالی است! درآمد تمام شرکت‌ها افزایش می‌یابد.',
    icon: '📈', severity: 'major', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.3, durationMs: 5 * 60 * 1000, isPositive: true,
    newsTitle: 'رونق اقتصادی: درآمدها ۳۰٪ افزایش یافت', newsSummary: 'شاخص‌های اقتصادی مثبت شد. تمام کسب‌وکارها از رشد بهره‌مند هستند.',
  },
  {
    id: 'evt-recession', title: 'رکود اقتصادی', description: 'بازار دچار رکود شده. درآمد همه شرکت‌ها کاهش می‌یابد.',
    icon: '📉', severity: 'major', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 0.7, durationMs: 5 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-recession-ad', label: 'کمپین تبلیغاتی', icon: '📢', cost: 15_000, effectMultiplier: 0.5, description: 'با تبلیغات، اثر رکود را کاهش دهید' }],
    newsTitle: 'رکود اقتصادی: کاهش ۳۰٪ درآمدها', newsSummary: 'رکود بازار باعث افت درآمد کسب‌وکارها شده است.',
  },
  {
    id: 'evt-tax-audit', title: 'بازرسی مالیاتی', description: 'سازمان مالیات از شما بازرسی کرد! جریمه پرداخت شد.',
    icon: '🏛️', severity: 'major', scope: 'global',
    effect: 'instant_balance', effectValue: -0.07, durationMs: 0, isPositive: false,
    newsTitle: 'بازرسی مالیاتی از کسب‌وکارها', newsSummary: 'سازمان امور مالیاتی جریمه‌هایی صادر کرد.',
  },
  {
    id: 'evt-subsidy', title: 'یارانه دولتی', description: 'دولت به کسب‌وکارها یارانه پرداخت کرد!',
    icon: '🏦', severity: 'major', scope: 'global',
    effect: 'instant_balance', effectValue: 0.05, durationMs: 0, isPositive: true,
    newsTitle: 'پرداخت یارانه دولتی به کارآفرینان', newsSummary: 'دولت بسته حمایتی ویژه‌ای برای کسب‌وکارها تصویب کرد.',
  },

  // ===== FARMING =====
  {
    id: 'evt-drought', title: 'خشکسالی', description: 'خشکسالی شدید مزارع را تحت تأثیر قرار داده.',
    icon: '🏜️', severity: 'major', scope: 'business_type', targetBusinessType: 'farming',
    effect: 'revenue_multiplier', effectValue: 0.5, durationMs: 4 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-drought-irrigation', label: 'آبیاری اضطراری', icon: '💧', cost: 10_000, effectMultiplier: 0.5, description: 'نصب آبیاری اضطراری برای کاهش خسارت' }],
    newsTitle: 'خشکسالی: برداشت محصول ۵۰٪ کاهش یافت', newsSummary: 'خشکسالی شدید در مناطق کشاورزی باعث افت تولید شده.',
  },
  {
    id: 'evt-harvest', title: 'فصل برداشت عالی', description: 'شرایط آب و هوایی عالی! محصولات فراوان.',
    icon: '🌾', severity: 'minor', scope: 'business_type', targetBusinessType: 'farming',
    effect: 'revenue_multiplier', effectValue: 1.5, durationMs: 4 * 60 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-harvest-invest', label: 'سرمایه‌گذاری بیشتر', icon: '🌱', cost: 8_000, effectMultiplier: 1.3, description: 'با سرمایه‌گذاری، سود برداشت را بیشتر کنید' }],
    newsTitle: 'فصل برداشت: رکورد تولید شکسته شد', newsSummary: 'شرایط جوی مناسب باعث برداشت فوق‌العاده شد.',
  },

  // ===== RESTAURANT =====
  {
    id: 'evt-food-critic', title: 'بازدید منتقد غذا', description: 'یک منتقد معروف از رستوران شما تعریف کرد!',
    icon: '⭐', severity: 'major', scope: 'business_type', targetBusinessType: 'restaurant',
    effect: 'revenue_multiplier', effectValue: 1.8, durationMs: 3 * 60 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-critic-menu', label: 'منوی ویژه ارائه بده', icon: '🍽️', cost: 12_000, effectMultiplier: 1.2, description: 'منوی VIP برای جذب مشتری بیشتر' }],
    newsTitle: 'منتقد غذا: این رستوران فوق‌العاده است!', newsSummary: 'بازدید منتقد مشهور باعث هجوم مشتریان شد.',
  },
  {
    id: 'evt-food-scandal', title: 'مسمومیت غذایی', description: 'گزارش مسمومیت غذایی! مشتریان ناراضی هستند.',
    icon: '🤢', severity: 'major', scope: 'business_type', targetBusinessType: 'restaurant',
    effect: 'revenue_multiplier', effectValue: 0.4, durationMs: 4 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-scandal-pr', label: 'بحران‌مدیری', icon: '📋', cost: 20_000, effectMultiplier: 0.4, description: 'استخدام تیم روابط عمومی برای مدیریت بحران' }],
    newsTitle: 'بحران بهداشتی در رستوران‌ها', newsSummary: 'گزارش مسمومیت غذایی باعث کاهش شدید مشتریان شد.',
  },

  // ===== FACTORY =====
  {
    id: 'evt-breakdown', title: 'خرابی تجهیزات', description: 'خط تولید از کار افتاده! تعمیرات ضروری است.',
    icon: '🔧', severity: 'minor', scope: 'business_type', targetBusinessType: 'factory',
    effect: 'revenue_multiplier', effectValue: 0.6, durationMs: 3 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-breakdown-fix', label: 'تعمیر فوری', icon: '🛠️', cost: 15_000, effectMultiplier: 0.0, description: 'تیم تعمیرات اضطراری بفرستید' }],
    newsTitle: 'توقف تولید در کارخانه‌ها', newsSummary: 'خرابی تجهیزات باعث کاهش ظرفیت تولید شد.',
  },
  {
    id: 'evt-automation-grant', title: 'کمک‌هزینه اتوماسیون', description: 'دولت برای اتوماسیون کارخانه‌ها کمک‌هزینه داد!',
    icon: '🤖', severity: 'minor', scope: 'business_type', targetBusinessType: 'factory',
    effect: 'revenue_multiplier', effectValue: 1.4, durationMs: 5 * 60 * 1000, isPositive: true,
    newsTitle: 'کمک‌هزینه اتوماسیون صنعتی', newsSummary: 'دولت از اتوماسیون کارخانه‌ها حمایت مالی می‌کند.',
  },

  // ===== APP_STARTUP =====
  {
    id: 'evt-viral', title: 'اپ وایرال شد!', description: 'اپلیکیشن شما در شبکه‌های اجتماعی ترند شد!',
    icon: '🚀', severity: 'major', scope: 'business_type', targetBusinessType: 'app_startup',
    effect: 'revenue_multiplier', effectValue: 2.0, durationMs: 2 * 60 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-viral-ads', label: 'تبلیغات بیشتر', icon: '📢', cost: 20_000, effectMultiplier: 1.3, description: 'از فرصت استفاده کنید و تبلیغ کنید' }],
    newsTitle: 'اپلیکیشن ایرانی در صدر دانلودها!', newsSummary: 'یک استارتاپ ایرانی با رشد انفجاری کاربران مواجه شد.',
  },
  {
    id: 'evt-server-crash', title: 'سرور از کار افتاد', description: 'سرورها داون شدند! کاربران نمی‌توانند وارد شوند.',
    icon: '💥', severity: 'minor', scope: 'business_type', targetBusinessType: 'app_startup',
    effect: 'revenue_multiplier', effectValue: 0.3, durationMs: 3 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-server-fix', label: 'سرور ابری بخر', icon: '☁️', cost: 25_000, effectMultiplier: 0.0, description: 'مهاجرت فوری به سرور ابری' }],
    newsTitle: 'قطعی سرویس: کاربران ناراضی', newsSummary: 'مشکلات فنی باعث قطعی طولانی سرویس شد.',
  },

  // ===== SUPERMARKET =====
  {
    id: 'evt-supplier-deal', title: 'قرارداد ویژه تأمین‌کننده', description: 'یک تأمین‌کننده تخفیف ویژه داد! هزینه‌ها کاهش یافت.',
    icon: '🤝', severity: 'minor', scope: 'business_type', targetBusinessType: 'supermarket',
    effect: 'expense_multiplier', effectValue: 0.7, durationMs: 5 * 60 * 1000, isPositive: true,
    newsTitle: 'تخفیف ویژه تأمین‌کنندگان به فروشگاه‌ها', newsSummary: 'قراردادهای جدید باعث کاهش هزینه‌های فروشگاه‌ها شد.',
  },
  {
    id: 'evt-shoplifting', title: 'موج سرقت از فروشگاه', description: 'سرقت‌های مکرر خسارت مالی وارد کرد!',
    icon: '🦹', severity: 'minor', scope: 'business_type', targetBusinessType: 'supermarket',
    effect: 'instant_balance', effectValue: -0.03, durationMs: 0, isPositive: false,
    newsTitle: 'افزایش سرقت از فروشگاه‌ها', newsSummary: 'موج سرقت باعث خسارت مالی به فروشگاه‌ها شد.',
  },

  // ===== TRANSPORT =====
  {
    id: 'evt-fuel-spike', title: 'جهش قیمت سوخت', description: 'قیمت بنزین و گازوئیل ناگهان افزایش یافت!',
    icon: '⛽', severity: 'minor', scope: 'business_type', targetBusinessType: 'transport',
    effect: 'expense_multiplier', effectValue: 1.5, durationMs: 4 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-fuel-electric', label: 'اجاره خودرو برقی', icon: '🔋', cost: 18_000, effectMultiplier: 0.5, description: 'با اجاره خودروی برقی هزینه سوخت را کاهش دهید' }],
    newsTitle: 'جهش قیمت سوخت: هزینه حمل‌ونقل بالا رفت', newsSummary: 'افزایش ناگهانی قیمت سوخت فشار زیادی بر ناوگان وارد کرد.',
  },
  {
    id: 'evt-big-contract', title: 'قرارداد بزرگ حمل', description: 'یک قرارداد حمل سنگین به شرکت شما رسید!',
    icon: '📋', severity: 'minor', scope: 'business_type', targetBusinessType: 'transport',
    effect: 'revenue_multiplier', effectValue: 1.5, durationMs: 5 * 60 * 1000, isPositive: true,
    newsTitle: 'قرارداد بزرگ حمل‌ونقل امضا شد', newsSummary: 'یک شرکت حمل‌ونقل قرارداد سنگین جدیدی بست.',
  },

  // ===== GOLDEN OPPORTUNITIES (کوتاه‌مدت، هیجانی) =====
  {
    id: 'evt-flash-order', title: '🔥 سفارش فوری!', description: 'یک مشتری بزرگ سفارش اضطراری داد. ۹۰ ثانیه وقت داری!',
    icon: '⚡', severity: 'major', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.4, durationMs: 90 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-flash-priority', label: 'اولویت‌بندی فوری', icon: '🚀', cost: 5_000, effectMultiplier: 1.5, description: 'با هزینه کم، درآمد رو ۵۰٪ بیشتر کن' }],
    newsTitle: 'سفارش فوری بازار: درآمد ۴۰٪ بالا رفت', newsSummary: 'تقاضای ناگهانی باعث جهش قیمت‌ها شد.',
  },
  {
    id: 'evt-cheap-supply', title: '📦 تامین ارزان فوری', description: 'یه تأمین‌کننده موجودی مازاد داره. فقط ۲ دقیقه مهلت!',
    icon: '📦', severity: 'minor', scope: 'global',
    effect: 'expense_multiplier', effectValue: 0.65, durationMs: 2 * 60 * 1000, isPositive: true,
    newsTitle: 'فروش فوری تأمین‌کنندگان', newsSummary: 'تأمین‌کنندگان موجودی مازاد خود را با تخفیف عرضه کردند.',
  },
  {
    id: 'evt-vip-customer', title: '👑 مشتری VIP', description: 'یک مشتری ثروتمند وارد شد. درآمد ۵ دقیقه بالاست!',
    icon: '👑', severity: 'minor', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.6, durationMs: 5 * 60 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-vip-deal', label: 'پیشنهاد ویژه بده', icon: '🎁', cost: 8_000, effectMultiplier: 1.4, description: 'تخفیف ویژه بده، درآمد دوچندان میشه' }],
    newsTitle: 'مشتری VIP وارد بازار شد', newsSummary: 'حضور خریداران بزرگ باعث رونق موقت بازار شد.',
  },
  {
    id: 'evt-market-window', title: '📈 پنجره بازار باز شد', description: 'تقاضا ناگهان اوج گرفت. ۳ دقیقه وقت داری!',
    icon: '📈', severity: 'minor', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.35, durationMs: 3 * 60 * 1000, isPositive: true,
    newsTitle: 'تقاضای ناگهانی در بازار', newsSummary: 'موج جدید خرید در بازار شکل گرفت.',
  },

  // ===== DECISION EVENTS (تصمیم کارمند/رقیب) =====
  {
    id: 'evt-employee-raise', title: '👨‍💼 درخواست افزایش حقوق', description: 'یکی از کارمندان حقوق بیشتری می‌خواد. قبول کنی، عملکرد بهتر میشه.',
    icon: '👨‍💼', severity: 'minor', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.0, durationMs: 4 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-raise-accept', label: 'قبول (+20% عملکرد)', icon: '✅', cost: 12_000, effectMultiplier: 1.2, description: 'حقوق بده، درآمد بیشتر میشه' }],
    newsTitle: 'موج درخواست افزایش حقوق در بازار کار', newsSummary: 'کارمندان در پی افزایش حقوق در شرایط اقتصادی جدید هستند.',
  },
  {
    id: 'evt-rival-discount', title: '⚔️ رقیب تخفیف داد!', description: 'یه رقیب ۲۰٪ تخفیف اعلام کرد. مشتریا دارن میرن پیشش.',
    icon: '⚔️', severity: 'major', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 0.8, durationMs: 4 * 60 * 1000, isPositive: false,
    responseOptions: [{ id: 'resp-rival-match', label: 'مقابله با تخفیف', icon: '🔥', cost: 10_000, effectMultiplier: 0.0, description: 'با هزینه‌ای کم اثر رو خنثی کن' }],
    newsTitle: 'رقبا وارد جنگ قیمتی شدند', newsSummary: 'رقابت شدید قیمتی در بازار آغاز شد.',
  },
  {
    id: 'evt-partnership-offer', title: '🤝 پیشنهاد مشارکت', description: 'یه شرکت میخواد باهات کار کنه. سرمایه‌گذاری کوچیک، سود بزرگ.',
    icon: '🤝', severity: 'minor', scope: 'global',
    effect: 'revenue_multiplier', effectValue: 1.0, durationMs: 3 * 60 * 1000, isPositive: true,
    responseOptions: [{ id: 'resp-partner-accept', label: 'مشارکت رو قبول کن', icon: '🤝', cost: 20_000, effectMultiplier: 1.5, description: 'سرمایه‌گذاری کوچیک، درآمد بالاتر' }],
    newsTitle: 'موج مشارکت‌های تجاری جدید', newsSummary: 'شرکت‌ها با مشارکت‌های استراتژیک دنبال رشد هستند.',
  },
];

// ==================== BANKING ====================

export const BANK_CONFIG = {
  installmentCheckIntervalMs: 60 * 1000,
  depositInterestIntervalMs: 60 * 1000,
  maxLoansPerBank: 1,
  maxDepositsPerBank: 1,
  maxTotalLoans: 3,
  maxTotalDeposits: 3,
};

export const BANK_TEMPLATES: BankTemplate[] = [
  {
    id: 'bank-aramesh',
    name: 'بانک آرامش',
    icon: '🏦',
    description: 'بانکی محافظه‌کار با سود کم اما مطمئن. جریمه‌های ملایم.',
    personality: 'conservative',
    unlockLevel: 1,
    loanPackages: [
      {
        id: 'loan-aramesh-s', name: 'وام خُرد',
        amount: 50_000, interestRate: 0.04, totalPayback: 52_000,
        installmentCount: 5, installmentAmount: 10_400,
        installmentIntervalMs: 3 * 60 * 1000,
        latePenaltyRate: 0.05, requiredLevel: 1, requiredAssets: 0,
      },
      {
        id: 'loan-aramesh-m', name: 'وام متوسط',
        amount: 120_000, interestRate: 0.06, totalPayback: 127_200,
        installmentCount: 8, installmentAmount: 15_900,
        installmentIntervalMs: 3 * 60 * 1000,
        latePenaltyRate: 0.05, requiredLevel: 3, requiredAssets: 50_000,
      },
      {
        id: 'loan-aramesh-l', name: 'وام کلان',
        amount: 250_000, interestRate: 0.08, totalPayback: 270_000,
        installmentCount: 12, installmentAmount: 22_500,
        installmentIntervalMs: 3 * 60 * 1000,
        latePenaltyRate: 0.05, requiredLevel: 6, requiredAssets: 150_000,
      },
    ],
    depositInterestRate: 0.02,
    depositInterestIntervalMs: 5 * 60 * 1000,
    earlyWithdrawalPenaltyRate: 0.0,
    minDepositAmount: 10_000,
    maxDepositAmount: 500_000,
  },
  {
    id: 'bank-forsat',
    name: 'بانک فرصت',
    icon: '🏛️',
    description: 'بانکی متعادل با سود خوب و شرایط منصفانه.',
    personality: 'moderate',
    unlockLevel: 3,
    loanPackages: [
      {
        id: 'loan-forsat-s', name: 'وام رشد',
        amount: 80_000, interestRate: 0.08, totalPayback: 86_400,
        installmentCount: 6, installmentAmount: 14_400,
        installmentIntervalMs: 2.5 * 60 * 1000,
        latePenaltyRate: 0.10, requiredLevel: 3, requiredAssets: 30_000,
      },
      {
        id: 'loan-forsat-m', name: 'وام توسعه',
        amount: 200_000, interestRate: 0.10, totalPayback: 220_000,
        installmentCount: 10, installmentAmount: 22_000,
        installmentIntervalMs: 2.5 * 60 * 1000,
        latePenaltyRate: 0.10, requiredLevel: 5, requiredAssets: 100_000,
      },
      {
        id: 'loan-forsat-l', name: 'وام سرمایه‌گذاری',
        amount: 400_000, interestRate: 0.12, totalPayback: 448_000,
        installmentCount: 14, installmentAmount: 32_000,
        installmentIntervalMs: 2.5 * 60 * 1000,
        latePenaltyRate: 0.10, requiredLevel: 8, requiredAssets: 250_000,
      },
    ],
    depositInterestRate: 0.035,
    depositInterestIntervalMs: 4 * 60 * 1000,
    earlyWithdrawalPenaltyRate: 0.3,
    minDepositAmount: 20_000,
    maxDepositAmount: 800_000,
  },
  {
    id: 'bank-atlas',
    name: 'بانک اطلس',
    icon: '💎',
    description: 'بانکی پرریسک با سودهای بالا اما جریمه‌های سنگین!',
    personality: 'risky',
    unlockLevel: 5,
    loanPackages: [
      {
        id: 'loan-atlas-s', name: 'وام جسورانه',
        amount: 150_000, interestRate: 0.15, totalPayback: 172_500,
        installmentCount: 6, installmentAmount: 28_750,
        installmentIntervalMs: 2 * 60 * 1000,
        latePenaltyRate: 0.20, requiredLevel: 5, requiredAssets: 80_000,
      },
      {
        id: 'loan-atlas-m', name: 'وام بزرگ',
        amount: 350_000, interestRate: 0.18, totalPayback: 413_000,
        installmentCount: 10, installmentAmount: 41_300,
        installmentIntervalMs: 2 * 60 * 1000,
        latePenaltyRate: 0.20, requiredLevel: 8, requiredAssets: 200_000,
      },
      {
        id: 'loan-atlas-l', name: 'وام طلایی',
        amount: 700_000, interestRate: 0.22, totalPayback: 854_000,
        installmentCount: 14, installmentAmount: 61_000,
        installmentIntervalMs: 2 * 60 * 1000,
        latePenaltyRate: 0.20, requiredLevel: 12, requiredAssets: 500_000,
      },
    ],
    depositInterestRate: 0.06,
    depositInterestIntervalMs: 3 * 60 * 1000,
    earlyWithdrawalPenaltyRate: 0.5,
    minDepositAmount: 50_000,
    maxDepositAmount: 1_500_000,
  },
];

// ==================== AI RIVALS ====================

export const RIVAL_CONFIG = {
  tickIntervalMs: 60 * 1000,
  newsMinIntervalMs: 5 * 60 * 1000,
  levelUpWealthThreshold: 500_000,
  maxRivalLevel: 20,
  orderSnatchBaseChance: 0.15,
  marketShiftRange: 20,
  personalityMultipliers: {
    aggressive: 1.3,
    steady: 1.0,
    cautious: 0.7,
    opportunist: 1.1,
    flashy: 1.2,
    grinder: 0.9,
  } as Record<string, number>,
};

export const RIVAL_TEMPLATES: Omit<AIRival, 'wealth' | 'level' | 'businessCount' | 'lastLevelUpAt' | 'lastNewsAt' | 'active'>[] = [
  {
    id: 'rival-1', name: 'حاج‌آقا بازاری', avatar: '🧔', personality: 'steady',
    unlockLevel: 3, baseGrowthRate: 150, orderAggressiveness: 0.08, marketInfluence: 0.3,
  },
  {
    id: 'rival-2', name: 'خانم کارآفرین', avatar: '👩‍💼', personality: 'opportunist',
    unlockLevel: 5, baseGrowthRate: 200, orderAggressiveness: 0.15, marketInfluence: 0.4,
  },
  {
    id: 'rival-3', name: 'آقای ملک‌پور', avatar: '🏠', personality: 'cautious',
    unlockLevel: 8, baseGrowthRate: 100, orderAggressiveness: 0.05, marketInfluence: 0.2,
  },
  {
    id: 'rival-4', name: 'سلطان دیجیتال', avatar: '🤖', personality: 'aggressive',
    unlockLevel: 10, baseGrowthRate: 350, orderAggressiveness: 0.22, marketInfluence: 0.6,
  },
  {
    id: 'rival-5', name: 'جناب سرمایه‌دار', avatar: '💎', personality: 'flashy',
    unlockLevel: 13, baseGrowthRate: 400, orderAggressiveness: 0.18, marketInfluence: 0.5,
  },
  {
    id: 'rival-6', name: 'استاد صنعت', avatar: '🏭', personality: 'grinder',
    unlockLevel: 16, baseGrowthRate: 250, orderAggressiveness: 0.12, marketInfluence: 0.35,
  },
];

export const RIVAL_NEWS_TEMPLATES = {
  orderSnatched: (name: string, product: string, amount: number) => ({
    title: `${name} سفارش ${product} را قاپید!`,
    summary: `${name} سفارشی به مبلغ ${amount.toLocaleString('fa-IR')} تومان را قبل از شما قبول کرد.`,
  }),
  levelUp: (name: string, level: number) => ({
    title: `${name} به سطح ${level} رسید`,
    summary: `رقیب شما ${name} پیشرفت کرد و حالا در سطح ${level} فعالیت می‌کند.`,
  }),
  newBusiness: (name: string, count: number) => ({
    title: `${name} شرکت جدید زد`,
    summary: `${name} حالا ${count} کسب‌وکار فعال دارد.`,
  }),
  wealthMilestone: (name: string, amount: number) => ({
    title: `${name} از مرز ${amount.toLocaleString('fa-IR')} تومان گذشت`,
    summary: `ثروت ${name} به بیش از ${amount.toLocaleString('fa-IR')} تومان رسید!`,
  }),
  unlocked: (name: string) => ({
    title: `رقیب جدید: ${name}`,
    summary: `${name} وارد بازار شد و با شما رقابت می‌کند!`,
  }),
};

// ==================== SUPERMARKET DEEP SYSTEM ====================

import {
  ShelfProduct,
  ShelfSlot,
  CheckoutLane,
  SupermarketTier,
  SupermarketState,
  SupermarketOrder,
} from '@/types';

// ---------- کاتالوگ کالاهای قفسه ----------

export const SHELF_PRODUCTS: ShelfProduct[] = [
  // --- Tier 1: مغازه محلی (ضروریات) ---
  { id: 'sp-bread',   name: 'نان',         icon: '🍞', category: 'essential', buyPrice: 30,  sellPrice: 55,  salesSpeed: 12, unlockTier: 1, description: 'ارزون و پرفروش' },
  { id: 'sp-milk',    name: 'شیر',         icon: '🥛', category: 'essential', buyPrice: 40,  sellPrice: 70,  salesSpeed: 10, unlockTier: 1, description: 'مصرف روزانه بالا' },
  { id: 'sp-rice',    name: 'برنج',        icon: '🍚', category: 'essential', buyPrice: 80,  sellPrice: 130, salesSpeed: 6,  unlockTier: 1, description: 'سود متوسط، فروش ثابت' },

  // --- Tier 2: مینی‌مارکت (تنوع بیشتر) ---
  { id: 'sp-soda',    name: 'نوشابه',      icon: '🥤', category: 'essential', buyPrice: 25,  sellPrice: 50,  salesSpeed: 14, unlockTier: 2, description: 'ارزون و خیلی سریع' },
  { id: 'sp-fruit',   name: 'میوه',        icon: '🍎', category: 'fresh',     buyPrice: 60,  sellPrice: 110, salesSpeed: 8,  unlockTier: 2, description: 'تازه و پرسود' },
  { id: 'sp-egg',     name: 'تخم‌مرغ',     icon: '🥚', category: 'essential', buyPrice: 50,  sellPrice: 90,  salesSpeed: 9,  unlockTier: 2, description: 'فروش ثابت و مطمئن' },

  // --- Tier 3: سوپرمارکت (سفارش ویژه + صندوق دوم) ---
  { id: 'sp-meat',    name: 'گوشت',        icon: '🥩', category: 'fresh',     buyPrice: 200, sellPrice: 350, salesSpeed: 4,  unlockTier: 3, description: 'گرون ولی سود بالا' },
  { id: 'sp-cheese',  name: 'پنیر',        icon: '🧀', category: 'fresh',     buyPrice: 100, sellPrice: 180, salesSpeed: 5,  unlockTier: 3, description: 'حاشیه سود خوب' },
  { id: 'sp-snack',   name: 'تنقلات',      icon: '🍿', category: 'luxury',    buyPrice: 35,  sellPrice: 75,  salesSpeed: 11, unlockTier: 3, description: 'سریع ولی سود کم' },

  // --- Tier 4: هایپرمارکت (فروش همزمان + مشتری بیشتر) ---
  { id: 'sp-deterg',  name: 'شوینده',      icon: '🧴', category: 'household', buyPrice: 120, sellPrice: 220, salesSpeed: 3,  unlockTier: 4, description: 'کند ولی سود عالی' },
  { id: 'sp-cosmetic',name: 'لوازم آرایشی',icon: '💄', category: 'luxury',    buyPrice: 150, sellPrice: 300, salesSpeed: 2,  unlockTier: 4, description: 'گرون‌ترین و کندترین' },
  { id: 'sp-baby',    name: 'لوازم بچه',   icon: '🍼', category: 'household', buyPrice: 180, sellPrice: 320, salesSpeed: 3,  unlockTier: 4, description: 'سود بالا، فروش کند' },

  // --- Tier 5: شبکه فروشگاهی (شعبه + passive) ---
  { id: 'sp-elec',    name: 'لوازم الکترونیکی', icon: '📱', category: 'luxury', buyPrice: 500, sellPrice: 900, salesSpeed: 1, unlockTier: 5, description: 'گرون‌ترین، بیشترین سود' },
  { id: 'sp-organic', name: 'محصولات ارگانیک',  icon: '🌿', category: 'fresh',  buyPrice: 250, sellPrice: 450, salesSpeed: 3, unlockTier: 5, description: 'لوکس و پرسود' },
];

// ---------- تایرهای پیشرفت سوپرمارکت ----------

export const SUPERMARKET_TIERS: SupermarketTier[] = [
  {
    tier: 1, name: 'مغازه محلی', icon: '🛖', requiredLevel: 1,
    shelfSlots: 2, checkoutLanes: 1,
    features: ['۳ کالای پایه', 'فروش ساده'],
  },
  {
    tier: 2, name: 'مینی‌مارکت', icon: '🏪', requiredLevel: 5,
    shelfSlots: 3, checkoutLanes: 1,
    features: ['+۳ کالای جدید', 'فروش سریع‌تر'],
  },
  {
    tier: 3, name: 'سوپرمارکت', icon: '🏬', requiredLevel: 10,
    shelfSlots: 4, checkoutLanes: 2,
    features: ['سفارش ویژه', 'صندوق دوم', '+۳ کالای تازه'],
  },
  {
    tier: 4, name: 'هایپرمارکت', icon: '🏢', requiredLevel: 15,
    shelfSlots: 6, checkoutLanes: 3,
    features: ['فروش همزمان', 'مشتری بیشتر', '+۳ کالای لوکس'],
  },
  {
    tier: 5, name: 'شبکه فروشگاهی', icon: '🌐', requiredLevel: 20,
    shelfSlots: 8, checkoutLanes: 4,
    features: ['شعبه (Passive)', '+۲ کالای ویژه', 'سفارش‌های کلان'],
  },
];

// ---------- تولید سفارش‌های ویژه سوپرمارکتی ----------

const SM_ORDER_TITLES = [
  { title: 'سفارش مدرسه', icon: '🏫' },
  { title: 'سفارش هتل', icon: '🏨' },
  { title: 'سفارش مراسم', icon: '🎉' },
  { title: 'سفارش ادارات', icon: '🏢' },
  { title: 'سفارش بیمارستان', icon: '🏥' },
  { title: 'سفارش رستوران', icon: '🍽️' },
];

export function generateSupermarketOrder(tier: number, availableProducts: string[]): SupermarketOrder | null {
  if (tier < 3 || availableProducts.length === 0) return null;

  const template = SM_ORDER_TITLES[Math.floor(Math.random() * SM_ORDER_TITLES.length)];
  // انتخاب 1-2 محصول تصادفی
  const numProducts = tier >= 4 ? 2 : 1;
  const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(numProducts, shuffled.length));

  const requiredProducts = selected.map((pid) => {
    const product = SHELF_PRODUCTS.find((p) => p.id === pid);
    const baseQty = tier >= 5 ? 40 : tier >= 4 ? 25 : 15;
    const qty = baseQty + Math.floor(Math.random() * 15);
    return { productId: pid, quantity: qty };
  });

  const bonusMultiplier = 1.3 + (tier - 3) * 0.2 + Math.random() * 0.2;
  const deadlineMinutes = tier >= 5 ? 5 : tier >= 4 ? 4 : 3;

  return {
    id: `smo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: template.title,
    icon: template.icon,
    requiredProducts,
    bonusMultiplier: Math.round(bonusMultiplier * 100) / 100,
    deadline: Date.now() + deadlineMinutes * 60 * 1000,
    createdAt: Date.now(),
    accepted: false,
    completed: false,
    failed: false,
  };
}

// ---------- ساخت state اولیه سوپرمارکت ----------

export function createInitialSupermarketState(): SupermarketState {
  return {
    shelves: [
      { id: 'shelf-1', productId: null, quantity: 0, maxCapacity: 30 },
      { id: 'shelf-2', productId: null, quantity: 0, maxCapacity: 30 },
    ],
    checkouts: [
      { id: 1, speed: 8, unlocked: true },
    ],
    activeOrders: [],
    boosts: [],
    customersInStore: 0,
    customersServed: 0,
    totalShelfProductsSold: 0,
    totalShelfRevenue: 0,
    lastCustomerTickAt: Date.now(),
    currentTier: 1,
  };
}

// ---------- محاسبه تایر فعلی بر اساس سطح ----------

export function getSupermarketTier(level: number): SupermarketTier {
  let result = SUPERMARKET_TIERS[0];
  for (const t of SUPERMARKET_TIERS) {
    if (level >= t.requiredLevel) result = t;
  }
  return result;
}

// ---------- کانفیگ سوپرمارکت ----------

export const SUPERMARKET_CONFIG = {
  customerTickInterval: 3,          // هر ۳ ثانیه tick مشتری
  baseCustomerRate: 2,              // مشتری پایه در دقیقه
  shelfRestockCost: 1.0,            // ضریب هزینه پر کردن قفسه (× buyPrice)
  orderGenerationInterval: 120_000, // هر ۲ دقیقه چک سفارش جدید
  maxActiveOrders: 2,
  boostDuration: 60_000,            // بوست‌ها ۱ دقیقه
  tierCustomerMultiplier: [1, 1.2, 1.5, 2.0, 2.5], // مشتری بیشتر در تایرهای بالا
  checkoutBaseSpeed: 8,             // سرعت پایه هر صندوق (مشتری/دقیقه)
};

// ==================== MANAGERS ====================

// ---------- ثابت‌های مدیران ----------

export const MANAGER_CONFIG = {
  upgradeCostMultiplier: 1.5,       // هزینه ارتقا = hireCost × 1.5^level
  upgradeDurationMinutes: 12,       // هر لول × 12 دقیقه
  levelPassiveBoost: 0.15,          // هر لول +15% به passive
  salaryPerLevelMultiplier: 1.3,    // حقوق × 1.3 هر لول
  slot2UnlockLevel: 10,             // لول آنلاک اسلات دوم
};

export function getManagerUpgradeDuration(level: number): number {
  return level * MANAGER_CONFIG.upgradeDurationMinutes * 60 * 1000; // ms
}

export function getManagerUpgradeCost(baseHireCost: number, currentLevel: number): number {
  return Math.round(baseHireCost * Math.pow(MANAGER_CONFIG.upgradeCostMultiplier, currentLevel));
}

// ---------- تمپلیت مدیران ----------

export const MANAGER_TEMPLATES: ManagerTemplate[] = [
  // ===== مالی =====
  {
    id: 'mgr_financial_common',
    name: 'حسابدار ارشد',
    icon: '💰',
    description: 'درآمد کل شرکت‌ها رو افزایش میده',
    managerClass: 'financial',
    rarity: 'common',
    hireCost: 50_000,
    salary: 500,
    passiveEffect: { type: 'revenue', value: 0.05 },
    ability: {
      id: 'ab_fin_common',
      name: 'جهش مالی',
      description: 'درآمد ×۱.۵ برای ۶۰ ثانیه',
      icon: '💵',
      effectType: 'revenue_boost',
      effectMultiplier: 1.5,
      durationMs: 60_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 3,
    maxLevel: 5,
  },
  {
    id: 'mgr_financial_rare',
    name: 'مدیر مالی',
    icon: '🏦',
    description: 'با تجربه بانکی، درآمد رو بهینه می‌کنه',
    managerClass: 'financial',
    rarity: 'rare',
    hireCost: 200_000,
    salary: 1_500,
    passiveEffect: { type: 'revenue', value: 0.08 },
    ability: {
      id: 'ab_fin_rare',
      name: 'سونامی سود',
      description: 'درآمد ×۱.۸ برای ۶۰ ثانیه',
      icon: '🌊',
      effectType: 'revenue_boost',
      effectMultiplier: 1.8,
      durationMs: 60_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 8,
    unlockCondition: { type: 'upgrade_business', target: 5 },
    maxLevel: 5,
  },
  {
    id: 'mgr_financial_epic',
    name: 'معاون مالی',
    icon: '👔',
    description: 'استراتژیست مالی با بیشترین تاثیر روی درآمد',
    managerClass: 'financial',
    rarity: 'epic',
    hireCost: 800_000,
    salary: 4_000,
    passiveEffect: { type: 'revenue', value: 0.12 },
    ability: {
      id: 'ab_fin_epic',
      name: 'انفجار درآمد',
      description: 'درآمد ×۲ برای ۶۰ ثانیه',
      icon: '💎',
      effectType: 'revenue_boost',
      effectMultiplier: 2.0,
      durationMs: 60_000,
      cooldownMs: 25 * 60_000,
    },
    unlockLevel: 15,
    unlockCondition: { type: 'earn_total', target: 5_000_000 },
    maxLevel: 5,
  },

  // ===== عملیاتی =====
  {
    id: 'mgr_operational_common',
    name: 'سرکارگر',
    icon: '⚙️',
    description: 'سرعت تولید همه شرکت‌ها رو بالا می‌بره',
    managerClass: 'operational',
    rarity: 'common',
    hireCost: 40_000,
    salary: 400,
    passiveEffect: { type: 'production_speed', value: 0.08 },
    ability: {
      id: 'ab_ops_common',
      name: 'شتاب تولید',
      description: 'سرعت تولید ×۱.۵ برای ۴۵ ثانیه',
      icon: '⚡',
      effectType: 'production_boost',
      effectMultiplier: 1.5,
      durationMs: 45_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 3,
    maxLevel: 5,
  },
  {
    id: 'mgr_operational_rare',
    name: 'مدیر عملیات',
    icon: '🔧',
    description: 'بهینه‌ساز خط تولید با تجربه صنعتی',
    managerClass: 'operational',
    rarity: 'rare',
    hireCost: 180_000,
    salary: 1_200,
    passiveEffect: { type: 'production_speed', value: 0.12 },
    ability: {
      id: 'ab_ops_rare',
      name: 'توربو تولید',
      description: 'سرعت تولید ×۱.۸ برای ۴۵ ثانیه',
      icon: '🚀',
      effectType: 'production_boost',
      effectMultiplier: 1.8,
      durationMs: 45_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 8,
    unlockCondition: { type: 'produce_units', target: 500 },
    maxLevel: 5,
  },
  {
    id: 'mgr_operational_epic',
    name: 'معاون عملیات',
    icon: '🏭',
    description: 'مهندس ارشد با حداکثر بازدهی تولید',
    managerClass: 'operational',
    rarity: 'epic',
    hireCost: 700_000,
    salary: 3_500,
    passiveEffect: { type: 'production_speed', value: 0.18 },
    ability: {
      id: 'ab_ops_epic',
      name: 'انقلاب صنعتی',
      description: 'سرعت تولید ×۲ برای ۴۵ ثانیه',
      icon: '🔥',
      effectType: 'production_boost',
      effectMultiplier: 2.0,
      durationMs: 45_000,
      cooldownMs: 25 * 60_000,
    },
    unlockLevel: 15,
    unlockCondition: { type: 'total_upgrades', target: 15 },
    maxLevel: 5,
  },

  // ===== بازاریابی =====
  {
    id: 'mgr_marketing_common',
    name: 'بازاریاب',
    icon: '📢',
    description: 'سرعت فروش محصولات رو افزایش میده',
    managerClass: 'marketing',
    rarity: 'common',
    hireCost: 45_000,
    salary: 450,
    passiveEffect: { type: 'sale_rate', value: 0.05 },
    ability: {
      id: 'ab_mkt_common',
      name: 'کمپین فروش',
      description: 'فروش ×۱.۵ برای ۶۰ ثانیه',
      icon: '📣',
      effectType: 'sales_boost',
      effectMultiplier: 1.5,
      durationMs: 60_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 3,
    maxLevel: 5,
  },
  {
    id: 'mgr_marketing_rare',
    name: 'مدیر بازاریابی',
    icon: '📊',
    description: 'متخصص بازار با شبکه فروش گسترده',
    managerClass: 'marketing',
    rarity: 'rare',
    hireCost: 190_000,
    salary: 1_300,
    passiveEffect: { type: 'sale_rate', value: 0.08 },
    ability: {
      id: 'ab_mkt_rare',
      name: 'موج تبلیغات',
      description: 'فروش ×۱.۸ برای ۶۰ ثانیه',
      icon: '📺',
      effectType: 'sales_boost',
      effectMultiplier: 1.8,
      durationMs: 60_000,
      cooldownMs: 20 * 60_000,
    },
    unlockLevel: 8,
    unlockCondition: { type: 'sell_units', target: 500 },
    maxLevel: 5,
  },
  {
    id: 'mgr_marketing_epic',
    name: 'معاون بازاریابی',
    icon: '🎯',
    description: 'گورو فروش با بیشترین تاثیر بر بازار',
    managerClass: 'marketing',
    rarity: 'epic',
    hireCost: 750_000,
    salary: 3_800,
    passiveEffect: { type: 'sale_rate', value: 0.12 },
    ability: {
      id: 'ab_mkt_epic',
      name: 'انفجار فروش',
      description: 'فروش ×۲ برای ۶۰ ثانیه',
      icon: '💥',
      effectType: 'sales_boost',
      effectMultiplier: 2.0,
      durationMs: 60_000,
      cooldownMs: 25 * 60_000,
    },
    unlockLevel: 15,
    unlockCondition: { type: 'own_businesses', target: 3 },
    maxLevel: 5,
  },
];
