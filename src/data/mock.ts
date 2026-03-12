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

const appStartupEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-1', name: 'برنامه‌نویس ارشد', role: 'base', roleName: 'برنامه‌نویس', icon: '👨‍💻',
    salary: 2_000, revenueBoost: 0.3, autoCollect: false, hireCost: 20_000,
    description: 'افزایش ۳۰٪ درآمد تولید',
  },
  {
    id: 'emp-t-2', name: 'مدیر پروژه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_500, revenueBoost: 0.5, autoCollect: false, hireCost: 50_000,
    description: 'افزایش ۵۰٪ درآمد کل شرکت',
  },
  {
    id: 'emp-t-3', name: 'حسابدار شرکت', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_500, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
  {
    id: 'emp-t-4', name: 'بازاریاب دیجیتال', role: 'marketer', roleName: 'بازاریاب', icon: '📢',
    salary: 1_800, revenueBoost: 0.2, autoCollect: false, hireCost: 15_000,
    description: 'افزایش ۲۰٪ درآمد محصولات',
  },
  {
    id: 'emp-t-5', name: 'کارشناس فروش', role: 'sales', roleName: 'فروش', icon: '🤝',
    salary: 1_500, revenueBoost: 0.15, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۱۵٪ سرعت فروش',
  },
];

const farmingEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-f1', name: 'کشاورز ماهر', role: 'base', roleName: 'کشاورز', icon: '🧑‍🌾',
    salary: 1_200, revenueBoost: 0.25, autoCollect: false, hireCost: 10_000,
    description: 'افزایش ۲۵٪ برداشت محصول',
  },
  {
    id: 'emp-t-f2', name: 'مدیر مزرعه', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 2_800, revenueBoost: 0.4, autoCollect: false, hireCost: 40_000,
    description: 'افزایش ۴۰٪ درآمد مزرعه',
  },
  {
    id: 'emp-t-f3', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_000, revenueBoost: 0, autoCollect: true, hireCost: 25_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
];

const restaurantEmployees: EmployeeTemplate[] = [
  {
    id: 'emp-t-r1', name: 'سرآشپز', role: 'base', roleName: 'آشپز', icon: '👨‍🍳',
    salary: 2_000, revenueBoost: 0.35, autoCollect: false, hireCost: 25_000,
    description: 'افزایش ۳۵٪ کیفیت و درآمد',
  },
  {
    id: 'emp-t-r2', name: 'مدیر رستوران', role: 'manager', roleName: 'مدیر', icon: '👔',
    salary: 3_000, revenueBoost: 0.45, autoCollect: false, hireCost: 45_000,
    description: 'افزایش ۴۵٪ درآمد رستوران',
  },
  {
    id: 'emp-t-r3', name: 'حسابدار', role: 'accountant', roleName: 'حسابدار', icon: '🧮',
    salary: 2_200, revenueBoost: 0, autoCollect: true, hireCost: 30_000,
    description: 'جمع‌آوری اتوماتیک درآمد',
  },
  {
    id: 'emp-t-r4', name: 'گارسون حرفه‌ای', role: 'sales', roleName: 'گارسون', icon: '🍽️',
    salary: 1_000, revenueBoost: 0.1, autoCollect: false, hireCost: 8_000,
    description: 'افزایش ۱۰٪ رضایت مشتری',
  },
];

// ==================== BUSINESS PRODUCT TEMPLATES ====================

const appStartupProducts: BusinessProduct[] = [
  { id: 'bp-a1', name: 'اپلیکیشن فروشگاهی', icon: '🛒', description: 'طراحی و توسعه اپ فروشگاه آنلاین', unlockCost: 30_000, revenueBoost: 3_000, unlocked: false },
  { id: 'bp-a2', name: 'سامانه حسابداری', icon: '📊', description: 'نرم‌افزار مدیریت مالی', unlockCost: 50_000, revenueBoost: 5_000, unlocked: false },
  { id: 'bp-a3', name: 'بازی موبایل', icon: '🎮', description: 'توسعه بازی موبایلی پرطرفدار', unlockCost: 80_000, revenueBoost: 8_000, unlocked: false },
];

const farmingProducts: BusinessProduct[] = [
  { id: 'bp-f1', name: 'گلخانه', icon: '🌿', description: 'کشت محصولات گلخانه‌ای', unlockCost: 20_000, revenueBoost: 2_000, unlocked: false },
  { id: 'bp-f2', name: 'دامداری', icon: '🐄', description: 'پرورش دام و تولید لبنیات', unlockCost: 40_000, revenueBoost: 4_000, unlocked: false },
  { id: 'bp-f3', name: 'زنبورداری', icon: '🍯', description: 'تولید عسل طبیعی', unlockCost: 15_000, revenueBoost: 1_500, unlocked: false },
];

const restaurantProducts: BusinessProduct[] = [
  { id: 'bp-r1', name: 'منوی ویژه', icon: '⭐', description: 'غذاهای ویژه با حاشیه سود بالا', unlockCost: 25_000, revenueBoost: 2_500, unlocked: false },
  { id: 'bp-r2', name: 'سرویس بیرون‌بر', icon: '🛵', description: 'ارسال غذا به درب منزل', unlockCost: 35_000, revenueBoost: 3_500, unlocked: false },
  { id: 'bp-r3', name: 'کترینگ', icon: '🎉', description: 'سرویس‌دهی به مراسم و مهمانی‌ها', unlockCost: 50_000, revenueBoost: 5_000, unlocked: false },
];

// ==================== BUSINESS TEMPLATES ====================

export const businessTemplates: BusinessTemplate[] = [
  {
    type: 'app_startup', defaultName: 'داده‌پردازان', icon: '📱',
    description: 'شرکت برنامه‌نویسی. با یک برنامه‌نویس ساده و تجهیزات سخت‌افزاری شروع کنید.',
    startCost: 50_000, baseRevenue: 5_000, cycleDuration: 180, baseExpenses: 1_000,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'لپتاپ و میز کار',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'farming', defaultName: 'مزرعه سبز', icon: '🌾',
    description: 'کشت محصول و پرورش دام. پایه زنجیره تأمین.',
    startCost: 30_000, baseRevenue: 3_000, cycleDuration: 120, baseExpenses: 800,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'زمین کشاورزی و ابزار دستی',
    availableEmployees: farmingEmployees, availableProducts: farmingProducts,
  },
  {
    type: 'restaurant', defaultName: 'رستوران لذیذ', icon: '🍽️',
    description: 'تبدیل مواد اولیه به غذا. حاشیه سود بالا با مدیریت خوب.',
    startCost: 80_000, baseRevenue: 8_000, cycleDuration: 150, baseExpenses: 2_000,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'آشپزخانه صنعتی و سالن غذاخوری',
    availableEmployees: restaurantEmployees, availableProducts: restaurantProducts,
  },
  {
    type: 'factory', defaultName: 'کارخانه تولیدی', icon: '🏭',
    description: 'فرآوری مواد خام به کالاهای نهایی با سود بیشتر.',
    startCost: 120_000, baseRevenue: 10_000, cycleDuration: 240, baseExpenses: 3_000,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'خط تولید اولیه',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'supermarket', defaultName: 'هایپرمارکت', icon: '🏪',
    description: 'فروش مستقیم محصولات. حجم بالا، درآمد پایدار.',
    startCost: 70_000, baseRevenue: 6_000, cycleDuration: 90, baseExpenses: 1_500,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'قفسه‌ها و صندوق فروش',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
  {
    type: 'transport', defaultName: 'حمل‌ونقل سریع', icon: '🚛',
    description: 'جابجایی کالا بین کسب‌وکارها. ضروری برای زنجیره تأمین.',
    startCost: 150_000, baseRevenue: 12_000, cycleDuration: 300, baseExpenses: 4_000,
    maxPendingCycles: 50, maxEmployees: 3, maxProducts: 2, maxLevel: 20,
    initialEquipment: 'یک کامیون و راننده',
    availableEmployees: appStartupEmployees, availableProducts: appStartupProducts,
  },
];

// ==================== PLAYER BUSINESSES ====================

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1', ownerId: 'player-1', name: 'داده‌پردازان نوین', type: 'app_startup', level: 2, icon: '📱',
    baseRevenue: 5_000, cycleDuration: 180, lastCycleAt: Date.now() - 100_000, pendingRevenue: 5_000,
    maxPendingCycles: 50, expenses: 1_000, upgradeCost: 75_000,
    maxEmployees: 4, maxProducts: 2, maxLevel: 20,
    employees: [{
      id: 'he-1', templateId: 'emp-t-1', name: 'برنامه‌نویس ارشد', role: 'base', roleName: 'برنامه‌نویس',
      icon: '👨‍💻', salary: 2_000, revenueBoost: 0.3, autoCollect: false, hiredAt: Date.now() - 86400000,
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
