import {
  PlayerProfile,
  Business,
  BusinessTemplate,
  Product,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
  EmployeeTemplate,
  BusinessProduct,
} from '@/types';

// ==================== PLAYER ====================

export const mockPlayer: PlayerProfile = {
  id: 'player-1',
  avatar: '👤',
  username: 'تاجرباشی',
  level: 5,
  reputation: 72,
  balance: 15_000_000,
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

const appStartupEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-1', name: 'برنامه‌نویس ارشد', role: 'base', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 200_000, revenueBoost: 0.3, autoCollect: false, hireCost: 2_000_000,
    description: 'افزایش ۳۰٪ درآمد تولید',
  },
  {
    id: 'emp-t-2', name: 'مدیر پروژه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 350_000, revenueBoost: 0.5, autoCollect: false, hireCost: 5_000_000,
    description: 'افزایش ۵۰٪ درآمد کل شرکت',
  },
  {
    id: 'emp-t-3', name: 'حسابدار شرکت', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 250_000, revenueBoost: 0, autoCollect: true, hireCost: 3_000_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
  {
    id: 'emp-t-4', name: 'بازاریاب دیجیتال', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 180_000, revenueBoost: 0.2, autoCollect: false, hireCost: 1_500_000,
    description: 'افزایش ۲۰٪ درآمد محصولات',
  },
  {
    id: 'emp-t-5', name: 'کارشناس فروش', role: 'sales', roleName: 'فروش', icon: '🤝',
    salary: 150_000, revenueBoost: 0.15, autoCollect: false, hireCost: 1_000_000,
    description: 'افزایش ۱۵٪ سرعت فروش',
  },
];

const farmingEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-f1', name: 'کشاورز ماهر', role: 'base', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 120_000, revenueBoost: 0.25, autoCollect: false, hireCost: 1_000_000,
    description: 'افزایش ۲۵٪ برداشت محصول',
  },
  {
    id: 'emp-t-f2', name: 'مدیر مزرعه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 280_000, revenueBoost: 0.4, autoCollect: false, hireCost: 4_000_000,
    description: 'افزایش ۴۰٪ درآمد مزرعه',
  },
  {
    id: 'emp-t-f3', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 200_000, revenueBoost: 0, autoCollect: true, hireCost: 2_500_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
];

const restaurantEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-r1', name: 'سرآشپز', role: 'base', roleName: 'آشپز', icon: '👨‍🍳',
    salary: 200_000, revenueBoost: 0.35, autoCollect: false, hireCost: 2_500_000,
    description: 'افزایش ۳۵٪ کیفیت و درآمد',
  },
  {
    id: 'emp-t-r2', name: 'مدیر رستوران', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 300_000, revenueBoost: 0.45, autoCollect: false, hireCost: 4_500_000,
    description: 'افزایش ۴۵٪ درآمد رستوران',
  },
  {
    id: 'emp-t-r3', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 220_000, revenueBoost: 0, autoCollect: true, hireCost: 3_000_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
  {
    id: 'emp-t-r4', name: 'گارسون حرفه‌ای', role: 'sales', roleName: 'گارسون', icon: '🍽️',
    salary: 100_000, revenueBoost: 0.1, autoCollect: false, hireCost: 800_000,
    description: 'افزایش ۱۰٪ رضایت مشتری',
  },
];

// ==================== BUSINESS PRODUCT TEMPLATES ====================

const appStartupProducts: BusinessProduct[] = [
  { id: 'bp-a1', name: 'اپلیکیشن فروشگاهی', icon: '🛒', description: 'طراحی و توسعه اپ فروشگاه آنلاین', unlockCost: 3_000_000, revenueBoost: 300_000, unlocked: false },
  { id: 'bp-a2', name: 'سامانه حسابداری', icon: '📊', description: 'نرم‌افزار مدیریت مالی', unlockCost: 5_000_000, revenueBoost: 500_000, unlocked: false },
  { id: 'bp-a3', name: 'بازی موبایل', icon: '🎮', description: 'توسعه بازی موبایلی پرطرفدار', unlockCost: 8_000_000, revenueBoost: 800_000, unlocked: false },
];

const farmingProducts: BusinessProduct[] = [
  { id: 'bp-f1', name: 'گلخانه', icon: '🌿', description: 'کشت محصولات گلخانه‌ای', unlockCost: 2_000_000, revenueBoost: 200_000, unlocked: false },
  { id: 'bp-f2', name: 'دامداری', icon: '🐄', description: 'پرورش دام و تولید لبنیات', unlockCost: 4_000_000, revenueBoost: 400_000, unlocked: false },
  { id: 'bp-f3', name: 'زنبورداری', icon: '🍯', description: 'تولید عسل طبیعی', unlockCost: 1_500_000, revenueBoost: 150_000, unlocked: false },
];

const restaurantProducts: BusinessProduct[] = [
  { id: 'bp-r1', name: 'منوی ویژه', icon: '⭐', description: 'غذاهای ویژه با حاشیه سود بالا', unlockCost: 2_500_000, revenueBoost: 250_000, unlocked: false },
  { id: 'bp-r2', name: 'سرویس بیرون‌بر', icon: '🛵', description: 'ارسال غذا به درب منزل', unlockCost: 3_500_000, revenueBoost: 350_000, unlocked: false },
  { id: 'bp-r3', name: 'کترینگ', icon: '🎉', description: 'سرویس‌دهی به مراسم و مهمانی‌ها', unlockCost: 5_000_000, revenueBoost: 500_000, unlocked: false },
];

// ==================== BUSINESS TEMPLATES ====================

export const businessTemplates: BusinessTemplate[] = [
  {
    type: 'app_startup', defaultName: 'داده‌پردازان', icon: '📱',
    description: 'شرکت برنامه‌نویسی. با یک برنامه‌نویس ساده و تجهیزات سخت‌افزاری شروع کنید.',
    startCost: 5_000_000, baseRevenue: 500_000, cycleDuration: 180, baseExpenses: 100_000,
    maxPendingCycles: 3, initialEquipment: 'لپتاپ و میز کار',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'farming', defaultName: 'مزرعه سبز', icon: '🌾',
    description: 'کشت محصول و پرورش دام. پایه زنجیره تأمین.',
    startCost: 3_000_000, baseRevenue: 300_000, cycleDuration: 120, baseExpenses: 80_000,
    maxPendingCycles: 5, initialEquipment: 'زمین کشاورزی و ابزار دستی',
    availableEmployees: farmingEmployees, availableProducts: farmingProducts,
  },
  {
    type: 'restaurant', defaultName: 'رستوران لذیذ', icon: '🍽️',
    description: 'تبدیل مواد اولیه به غذا. حاشیه سود بالا با مدیریت خوب.',
    startCost: 8_000_000, baseRevenue: 800_000, cycleDuration: 150, baseExpenses: 200_000,
    maxPendingCycles: 3, initialEquipment: 'آشپزخانه صنعتی و سالن غذاخوری',
    availableEmployees: restaurantEmployees, availableProducts: restaurantProducts,
  },
  {
    type: 'factory', defaultName: 'کارخانه تولیدی', icon: '🏭',
    description: 'فرآوری مواد خام به کالاهای نهایی با سود بیشتر.',
    startCost: 12_000_000, baseRevenue: 1_000_000, cycleDuration: 240, baseExpenses: 300_000,
    maxPendingCycles: 3, initialEquipment: 'خط تولید اولیه',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'supermarket', defaultName: 'هایپرمارکت', icon: '🏪',
    description: 'فروش مستقیم محصولات. حجم بالا، درآمد پایدار.',
    startCost: 7_000_000, baseRevenue: 600_000, cycleDuration: 90, baseExpenses: 150_000,
    maxPendingCycles: 5, initialEquipment: 'قفسه‌ها و صندوق فروش',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'transport', defaultName: 'حمل‌ونقل سریع', icon: '🚛',
    description: 'جابجایی کالا بین کسب‌وکارها. ضروری برای زنجیره تأمین.',
    startCost: 15_000_000, baseRevenue: 1_200_000, cycleDuration: 300, baseExpenses: 400_000,
    maxPendingCycles: 3, initialEquipment: 'یک کامیون و راننده',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
];

// ==================== PLAYER BUSINESSES ====================

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1', ownerId: 'player-1', name: 'داده‌پردازان نوین', type: 'app_startup', level: 2, icon: '📱',
    baseRevenue: 500_000, cycleDuration: 180, lastCycleAt: Date.now() - 100_000, pendingRevenue: 500_000,
    maxPendingCycles: 3, expenses: 100_000, upgradeCost: 8_000_000,
    employees: [{
      id: 'he-1', templateId: 'emp-t-1', name: 'برنامه‌نویس ارشد', role: 'base', roleName: 'برنامه‌نویس',
      icon: '👨‍💻', salary: 200_000, revenueBoost: 0.3, autoCollect: false, hiredAt: Date.now() - 86400000,
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
  { rank: 1, playerId: 'player-10', username: 'سلطان‌تجارت', avatar: '👑', wealth: 250_000_000, level: 18, businessCount: 8 },
  { rank: 2, playerId: 'player-11', username: 'مگاکورپ', avatar: '🦈', wealth: 180_000_000, level: 15, businessCount: 6 },
  { rank: 3, playerId: 'player-12', username: 'طلاجو', avatar: '💰', wealth: 120_000_000, level: 12, businessCount: 5 },
  { rank: 4, playerId: 'player-2', username: 'شاه‌مزرعه', avatar: '🌾', wealth: 95_000_000, level: 10, businessCount: 4 },
  { rank: 5, playerId: 'player-3', username: 'نانوایی‌باشی', avatar: '🍞', wealth: 78_000_000, level: 9, businessCount: 3 },
  { rank: 6, playerId: 'player-1', username: 'تاجرباشی', avatar: '👤', wealth: 15_000_000, level: 5, businessCount: 1 },
  { rank: 7, playerId: 'player-4', username: 'ملکه‌لبنیات', avatar: '🥛', wealth: 12_000_000, level: 4, businessCount: 2 },
  { rank: 8, playerId: 'player-5', username: 'جادوگرفناوری', avatar: '📱', wealth: 8_500_000, level: 3, businessCount: 1 },
];

// ==================== FRIDAY MARKET ====================

export const mockFridayMarket: FridayMarketItem[] = [
  { id: 'fm-1', name: 'نوشیدنی انرژی‌زا', icon: '⚡', price: 50_000, effect: { energy: 20 }, available: true },
  { id: 'fm-2', name: 'کتاب آموزشی', icon: '📚', price: 200_000, effect: { intelligence: 10 }, available: true },
  { id: 'fm-3', name: 'بشقاب کباب', icon: '🍖', price: 30_000, effect: { hunger: -30, happiness: 10 }, available: true },
  { id: 'fm-4', name: 'قهوه', icon: '☕', price: 15_000, effect: { energy: 10, happiness: 5 }, available: true },
  { id: 'fm-5', name: 'کنسول بازی', icon: '🎮', price: 500_000, effect: { happiness: 25 }, available: false },
  { id: 'fm-6', name: 'اشتراک باشگاه', icon: '💪', price: 100_000, effect: { energy: 15, happiness: 10 }, available: true },
];
