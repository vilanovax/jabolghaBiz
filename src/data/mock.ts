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
  EventTemplate,
  City,
  Neighborhood,
  MissionTemplate,
  Achievement,
  LifeAction,
  PlayerStats,
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

// نام‌های سطوح دفتر/مکان متناسب با نوع کسب‌وکار
import type { BusinessType } from '@/types';
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
  revenue: string;         // "درآمد" → "فروش غذا" / "درآمد پروژه"
  expenses: string;        // "هزینه" → "هزینه مواد اولیه" / "هزینه سرور"
  cycle: string;           // "سیکل" → "سرو" / "اسپرینت"
  production: string;      // "تولید" → "سرو غذا" / "توسعه نرم‌افزار"
  collect: string;         // "جمع‌آوری" → "دریافت فروش" / "تسویه پروژه"
  upgrade: string;         // "ارتقا" → "توسعه رستوران" / "رشد استارتاپ"
  workers: string;         // "نیرو" → "تیم" / "پرسنل"
  pending: string;         // "آماده" → "فروش آماده" / "پروژه تکمیل‌شده"
  autoCollect: string;     // "جمع‌آوری خودکار" → "تسویه خودکار"
  waitingProd: string;     // "در انتظار تولید" → "در حال پخت" / "در حال توسعه"
  levelUpBenefit: string;  // "سود بیشتر" → "کیفیت بالاتر" / "پروژه‌های بزرگتر"
}

export const BUSINESS_VOCABULARY: Record<BusinessType, BusinessVocabulary> = {
  app_startup: {
    revenue: 'درآمد پروژه',
    expenses: 'هزینه سرور و نیرو',
    cycle: 'اسپرینت',
    production: 'توسعه نرم‌افزار',
    collect: 'تسویه پروژه',
    upgrade: 'رشد استارتاپ',
    workers: 'تیم',
    pending: 'پروژه تکمیل‌شده',
    autoCollect: 'تسویه خودکار',
    waitingProd: 'در حال توسعه...',
    levelUpBenefit: 'پروژه‌های بزرگتر',
  },
  restaurant: {
    revenue: 'فروش غذا',
    expenses: 'هزینه مواد اولیه',
    cycle: 'سرو',
    production: 'پخت و سرو',
    collect: 'دریافت فروش',
    upgrade: 'توسعه رستوران',
    workers: 'پرسنل',
    pending: 'فروش آماده',
    autoCollect: 'صندوق خودکار',
    waitingProd: 'در حال پخت...',
    levelUpBenefit: 'منوی بهتر',
  },
  supermarket: {
    revenue: 'فروش روزانه',
    expenses: 'هزینه تأمین کالا',
    cycle: 'شیفت فروش',
    production: 'فروش محصولات',
    collect: 'تخلیه صندوق',
    upgrade: 'گسترش فروشگاه',
    workers: 'کارکنان',
    pending: 'صندوق پر',
    autoCollect: 'صندوق خودکار',
    waitingProd: 'در حال فروش...',
    levelUpBenefit: 'تنوع بیشتر',
  },
  factory: {
    revenue: 'فروش تولیدات',
    expenses: 'هزینه تولید',
    cycle: 'خط تولید',
    production: 'تولید کالا',
    collect: 'فروش محصولات',
    upgrade: 'توسعه کارخانه',
    workers: 'کارگران',
    pending: 'کالای آماده فروش',
    autoCollect: 'فروش خودکار',
    waitingProd: 'در حال تولید...',
    levelUpBenefit: 'ظرفیت بالاتر',
  },
  farming: {
    revenue: 'فروش محصول',
    expenses: 'هزینه کشت',
    cycle: 'فصل برداشت',
    production: 'کشت و برداشت',
    collect: 'فروش برداشت',
    upgrade: 'توسعه مزرعه',
    workers: 'کشاورزان',
    pending: 'محصول آماده فروش',
    autoCollect: 'فروش خودکار',
    waitingProd: 'در حال رشد...',
    levelUpBenefit: 'زمین بیشتر',
  },
  transport: {
    revenue: 'کرایه حمل',
    expenses: 'هزینه سوخت و تعمیر',
    cycle: 'سفر',
    production: 'حمل بار',
    collect: 'دریافت کرایه',
    upgrade: 'توسعه ناوگان',
    workers: 'رانندگان',
    pending: 'کرایه آماده',
    autoCollect: 'واریز خودکار',
    waitingProd: 'در مسیر...',
    levelUpBenefit: 'مسیرهای بیشتر',
  },
};

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

// ==================== LIFE ACTIONS ====================

// کاهش خودکار stat‌ها هر ۵ دقیقه
export const STAT_DECAY_INTERVAL = 5 * 60 * 1000; // 5 min
export const STAT_DECAY_AMOUNTS: Partial<Record<keyof PlayerStats, number>> = {
  energy: -3,
  hunger: 4,       // گرسنگی بالا میره (بد)
  happiness: -2,
};

// ضریب‌های stat روی گیم‌پلی
export const STAT_GAMEPLAY_EFFECTS = {
  // energy < 20 → سیکل ۲۵٪ کندتر | energy > 80 → سیکل ۱۰٪ سریعتر
  energyCycleMultiplier: (energy: number) =>
    energy < 20 ? 0.75 : energy > 80 ? 1.1 : 1.0,
  // happiness > 70 → +۱۰٪ درآمد | happiness < 30 → -۱۵٪ درآمد
  happinessRevenueMultiplier: (happiness: number) =>
    happiness > 70 ? 1.1 : happiness < 30 ? 0.85 : 1.0,
  // hunger > 80 → -۱۰٪ درآمد (خیلی گرسنه)
  hungerRevenueMultiplier: (hunger: number) =>
    hunger > 80 ? 0.9 : 1.0,
  // intelligence > 70 → -۵٪ هزینه ارتقا
  intelligenceUpgradeDiscount: (intelligence: number) =>
    intelligence > 70 ? 0.95 : 1.0,
};

export const LIFE_ACTIONS: LifeAction[] = [
  // غذا
  {
    id: 'eat-sandwich', name: 'ساندویچ', icon: '🥪', description: 'یه ساندویچ ساده',
    category: 'food', cost: 200, cooldownMs: 10 * 60 * 1000,
    effect: { hunger: -20, energy: 5 },
  },
  {
    id: 'eat-kebab', name: 'چلوکباب', icon: '🍖', description: 'یه پرس چلوکباب مفصل',
    category: 'food', cost: 800, cooldownMs: 30 * 60 * 1000,
    effect: { hunger: -50, happiness: 10, energy: 10 },
  },
  {
    id: 'eat-pizza', name: 'پیتزا', icon: '🍕', description: 'پیتزا مخصوص',
    category: 'food', cost: 500, cooldownMs: 20 * 60 * 1000,
    effect: { hunger: -35, happiness: 8 },
  },
  // استراحت
  {
    id: 'rest-nap', name: 'چرت کوتاه', icon: '😴', description: '۲۰ دقیقه استراحت',
    category: 'rest', cost: 0, cooldownMs: 15 * 60 * 1000,
    effect: { energy: 15 },
  },
  {
    id: 'rest-sleep', name: 'خواب کامل', icon: '🛏️', description: 'یه خواب حسابی',
    category: 'rest', cost: 0, cooldownMs: 60 * 60 * 1000,
    effect: { energy: 40, happiness: 5 },
  },
  {
    id: 'rest-cafe', name: 'کافه', icon: '☕', description: 'یه قهوه توی کافه',
    category: 'rest', cost: 300, cooldownMs: 15 * 60 * 1000,
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
    category: 'fitness', cost: 0, cooldownMs: 20 * 60 * 1000,
    effect: { energy: 10, happiness: 5, hunger: 10 },
  },
  {
    id: 'fit-gym', name: 'باشگاه', icon: '💪', description: 'یه ساعت ورزش',
    category: 'fitness', cost: 500, cooldownMs: 45 * 60 * 1000,
    effect: { energy: -10, happiness: 15, hunger: 15 },
  },
  // سرگرمی
  {
    id: 'fun-movie', name: 'سینما', icon: '🎬', description: 'رفتن سینما',
    category: 'entertainment', cost: 600, cooldownMs: 60 * 60 * 1000,
    effect: { happiness: 25, energy: -5 },
  },
  {
    id: 'fun-game', name: 'بازی ویدیویی', icon: '🎮', description: 'یه ساعت بازی',
    category: 'entertainment', cost: 0, cooldownMs: 30 * 60 * 1000,
    effect: { happiness: 15, energy: -8 },
  },
  {
    id: 'fun-park', name: 'پارک', icon: '🌳', description: 'گردش در پارک',
    category: 'entertainment', cost: 0, cooldownMs: 25 * 60 * 1000,
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
// L1→L2: 15 دقیقه, L2→L3: 30 دقیقه
export function getEmployeeUpgradeDuration(currentLevel: number): number {
  return currentLevel * 15 * 60 * 1000; // 15min × سطح فعلی
}

// مدت زمان ارتقای شرکت (بر حسب میلی‌ثانیه)
// هر سطح ۱۰ دقیقه بیشتر: LV1→2: 10min, LV2→3: 20min, LV5→6: 50min
export function getBusinessUpgradeDuration(currentLevel: number): number {
  return currentLevel * 10 * 60 * 1000; // 10min × سطح فعلی
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

// ==================== ACHIEVEMENTS ====================

export const ACHIEVEMENTS_TEMPLATES: Achievement[] = [
  // ===== کسب‌وکار =====
  { id: 'ach-first-biz', title: 'کارآفرین', description: 'اولین شرکت رو بساز', icon: '🏢', tier: 'bronze', condition: 'create_business', target: 1, unlockedAt: null, badge: '🥉' },
  { id: 'ach-3-biz', title: 'سرمایه‌گذار', description: '۳ شرکت همزمان داشته باش', icon: '🏗️', tier: 'silver', condition: 'own_businesses', target: 3, unlockedAt: null, badge: '🥈' },
  { id: 'ach-5-biz', title: 'امپراتور', description: '۵ شرکت همزمان داشته باش', icon: '👑', tier: 'gold', condition: 'own_businesses', target: 5, unlockedAt: null, badge: '🥇' },

  // ===== سطح =====
  { id: 'ach-level-5', title: 'تازه‌کار حرفه‌ای', description: 'یک شرکت رو به سطح ۵ برسون', icon: '⭐', tier: 'bronze', condition: 'reach_business_level', target: 5, unlockedAt: null, badge: '⭐' },
  { id: 'ach-level-10', title: 'باتجربه', description: 'یک شرکت رو به سطح ۱۰ برسون', icon: '🌟', tier: 'silver', condition: 'reach_business_level', target: 10, unlockedAt: null, badge: '🌟' },
  { id: 'ach-level-20', title: 'سازمانی', description: 'یک شرکت رو به سطح ۲۰ برسون', icon: '💫', tier: 'diamond', condition: 'reach_business_level', target: 20, unlockedAt: null, badge: '💫' },

  // ===== ثروت =====
  { id: 'ach-100k', title: 'صدهزاری', description: 'موجودی ۱۰۰ هزار تومان', icon: '💰', tier: 'bronze', condition: 'reach_balance', target: 100_000, unlockedAt: null, badge: '💰' },
  { id: 'ach-500k', title: 'نیم میلیونر', description: 'موجودی ۵۰۰ هزار تومان', icon: '💵', tier: 'silver', condition: 'reach_balance', target: 500_000, unlockedAt: null, badge: '💵' },
  { id: 'ach-1m', title: 'میلیونر', description: 'موجودی ۱ میلیون تومان', icon: '🤑', tier: 'gold', condition: 'reach_balance', target: 1_000_000, unlockedAt: null, badge: '🤑' },
  { id: 'ach-5m', title: 'مولتی‌میلیونر', description: 'موجودی ۵ میلیون تومان', icon: '💎', tier: 'diamond', condition: 'reach_balance', target: 5_000_000, unlockedAt: null, badge: '💎' },

  // ===== نیرو =====
  { id: 'ach-hire-1', title: 'رئیس', description: 'اولین نیرو رو استخدام کن', icon: '🤝', tier: 'bronze', condition: 'hire_employee', target: 1, unlockedAt: null, badge: '🤝' },
  { id: 'ach-hire-5', title: 'مدیر', description: '۵ نیروی کار داشته باش', icon: '👥', tier: 'silver', condition: 'total_employees', target: 5, unlockedAt: null, badge: '👥' },
  { id: 'ach-hire-15', title: 'رهبر', description: '۱۵ نیرو داشته باش', icon: '🏛️', tier: 'gold', condition: 'total_employees', target: 15, unlockedAt: null, badge: '🏛️' },

  // ===== دفتر =====
  { id: 'ach-office-2', title: 'دفتردار', description: 'دفتر رو ارتقا بده', icon: '🏠', tier: 'bronze', condition: 'upgrade_office', target: 1, unlockedAt: null, badge: '🏠' },
  { id: 'ach-office-4', title: 'ساختمان‌ساز', description: 'به ساختمان تجاری برس', icon: '🏛️', tier: 'gold', condition: 'upgrade_office', target: 3, unlockedAt: null, badge: '🏢' },

  // ===== ماموریت =====
  { id: 'ach-mission-10', title: 'ماموریت‌باز', description: '۱۰ ماموریت تکمیل کن', icon: '📋', tier: 'bronze', condition: 'collect_revenue', target: 10, unlockedAt: null, badge: '📋' },
  { id: 'ach-mission-50', title: 'حرفه‌ای ماموریت', description: '۵۰ ماموریت تکمیل کن', icon: '🎖️', tier: 'gold', condition: 'collect_revenue', target: 50, unlockedAt: null, badge: '🎖️' },
];

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
];
