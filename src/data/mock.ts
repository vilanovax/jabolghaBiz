import {
  PlayerProfile,
  Business,
  BusinessTemplate,
  Product,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
} from '@/types';

// ==================== PLAYER ====================

export const mockPlayer: PlayerProfile = {
  id: 'player-1',
  avatar: '👤',
  username: 'BizMaster',
  level: 5,
  reputation: 72,
  balance: 15_400,
  stats: {
    happiness: 75,
    hunger: 60,
    energy: 80,
    intelligence: 65,
    experience: 45,
  },
  createdAt: '2026-01-15',
};

// ==================== BUSINESS TEMPLATES ====================

export const businessTemplates: BusinessTemplate[] = [
  {
    type: 'farming',
    name: 'Farm',
    icon: '🌾',
    description: 'Grow crops and raise livestock. The foundation of the supply chain.',
    startCost: 2_000,
    baseRevenue: 500,
    baseExpenses: 200,
    baseProductionCapacity: 100,
  },
  {
    type: 'factory',
    name: 'Factory',
    icon: '🏭',
    description: 'Process raw materials into finished goods for higher profit.',
    startCost: 8_000,
    baseRevenue: 1_500,
    baseExpenses: 800,
    baseProductionCapacity: 200,
  },
  {
    type: 'supermarket',
    name: 'Supermarket',
    icon: '🏪',
    description: 'Sell products directly to consumers. High volume, steady income.',
    startCost: 5_000,
    baseRevenue: 1_200,
    baseExpenses: 600,
    baseProductionCapacity: 150,
  },
  {
    type: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Turn ingredients into meals. High margins with good management.',
    startCost: 6_000,
    baseRevenue: 1_800,
    baseExpenses: 1_000,
    baseProductionCapacity: 80,
  },
  {
    type: 'app_startup',
    name: 'App Startup',
    icon: '📱',
    description: 'Build digital products. Low cost, high potential returns.',
    startCost: 3_000,
    baseRevenue: 2_000,
    baseExpenses: 500,
    baseProductionCapacity: 50,
  },
  {
    type: 'transport',
    name: 'Transport Co.',
    icon: '🚛',
    description: 'Move goods between businesses. Essential for the supply chain.',
    startCost: 10_000,
    baseRevenue: 2_500,
    baseExpenses: 1_500,
    baseProductionCapacity: 300,
  },
];

// ==================== PLAYER BUSINESSES ====================

export const mockBusinesses: Business[] = [
  {
    id: 'biz-1',
    ownerId: 'player-1',
    name: "Mo's Farm",
    type: 'farming',
    level: 3,
    employees: [
      { id: 'emp-1', name: 'Ali', role: 'Farmer', salary: 150, efficiency: 70 },
      { id: 'emp-2', name: 'Sara', role: 'Farmer', salary: 150, efficiency: 85 },
    ],
    productionCapacity: 180,
    expenses: 500,
    revenue: 1_200,
    profit: 700,
    icon: '🌾',
    upgradeCost: 3_000,
  },
  {
    id: 'biz-2',
    ownerId: 'player-1',
    name: 'QuickBite Restaurant',
    type: 'restaurant',
    level: 2,
    employees: [
      { id: 'emp-3', name: 'Reza', role: 'Chef', salary: 300, efficiency: 90 },
      { id: 'emp-4', name: 'Mina', role: 'Waiter', salary: 120, efficiency: 75 },
      { id: 'emp-5', name: 'Dara', role: 'Waiter', salary: 120, efficiency: 65 },
    ],
    productionCapacity: 120,
    expenses: 1_400,
    revenue: 3_200,
    profit: 1_800,
    icon: '🍽️',
    upgradeCost: 5_000,
  },
];

// ==================== PRODUCTS ====================

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wheat',
    category: 'raw_material',
    icon: '🌾',
    basePrice: 10,
    currentPrice: 12,
    supply: 500,
    demand: 450,
    priceHistory: [10, 11, 9, 12, 11, 13, 12],
  },
  {
    id: 'prod-2',
    name: 'Flour',
    category: 'processed',
    icon: '🫘',
    basePrice: 25,
    currentPrice: 28,
    supply: 300,
    demand: 350,
    priceHistory: [25, 26, 24, 27, 28, 30, 28],
  },
  {
    id: 'prod-3',
    name: 'Bread',
    category: 'finished_good',
    icon: '🍞',
    basePrice: 50,
    currentPrice: 55,
    supply: 200,
    demand: 280,
    priceHistory: [50, 48, 52, 53, 55, 54, 55],
  },
  {
    id: 'prod-4',
    name: 'Tomato',
    category: 'raw_material',
    icon: '🍅',
    basePrice: 8,
    currentPrice: 7,
    supply: 600,
    demand: 400,
    priceHistory: [8, 9, 7, 6, 7, 8, 7],
  },
  {
    id: 'prod-5',
    name: 'Milk',
    category: 'raw_material',
    icon: '🥛',
    basePrice: 15,
    currentPrice: 18,
    supply: 250,
    demand: 320,
    priceHistory: [15, 16, 17, 16, 18, 17, 18],
  },
  {
    id: 'prod-6',
    name: 'Cheese',
    category: 'processed',
    icon: '🧀',
    basePrice: 40,
    currentPrice: 45,
    supply: 150,
    demand: 200,
    priceHistory: [40, 42, 38, 43, 44, 46, 45],
  },
  {
    id: 'prod-7',
    name: 'Pizza',
    category: 'food',
    icon: '🍕',
    basePrice: 80,
    currentPrice: 85,
    supply: 100,
    demand: 180,
    priceHistory: [80, 78, 82, 83, 85, 84, 85],
  },
  {
    id: 'prod-8',
    name: 'Smartphone App',
    category: 'tech',
    icon: '📱',
    basePrice: 200,
    currentPrice: 220,
    supply: 50,
    demand: 120,
    priceHistory: [200, 210, 190, 215, 220, 225, 220],
  },
];

// ==================== MARKET LISTINGS ====================

export const mockListings: MarketListing[] = [
  {
    id: 'list-1',
    sellerId: 'player-2',
    sellerName: 'FarmKing',
    productId: 'prod-1',
    productName: 'Wheat',
    quantity: 50,
    pricePerUnit: 11,
    listedAt: '2026-03-10T14:00:00Z',
  },
  {
    id: 'list-2',
    sellerId: 'player-3',
    sellerName: 'BakerBoss',
    productId: 'prod-3',
    productName: 'Bread',
    quantity: 20,
    pricePerUnit: 52,
    listedAt: '2026-03-10T15:30:00Z',
  },
  {
    id: 'list-3',
    sellerId: 'player-4',
    sellerName: 'DairyQueen',
    productId: 'prod-5',
    productName: 'Milk',
    quantity: 100,
    pricePerUnit: 16,
    listedAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'list-4',
    sellerId: 'player-5',
    sellerName: 'TechWiz',
    productId: 'prod-8',
    productName: 'Smartphone App',
    quantity: 5,
    pricePerUnit: 210,
    listedAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'list-5',
    sellerId: 'player-1',
    sellerName: 'BizMaster',
    productId: 'prod-4',
    productName: 'Tomato',
    quantity: 80,
    pricePerUnit: 7,
    listedAt: '2026-03-10T10:00:00Z',
  },
];

// ==================== LEADERBOARD ====================

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, playerId: 'player-10', username: 'TycoonX', avatar: '👑', wealth: 250_000, level: 18, businessCount: 8 },
  { rank: 2, playerId: 'player-11', username: 'MegaCorp', avatar: '🦈', wealth: 180_000, level: 15, businessCount: 6 },
  { rank: 3, playerId: 'player-12', username: 'GoldRush', avatar: '💰', wealth: 120_000, level: 12, businessCount: 5 },
  { rank: 4, playerId: 'player-2', username: 'FarmKing', avatar: '🌾', wealth: 95_000, level: 10, businessCount: 4 },
  { rank: 5, playerId: 'player-3', username: 'BakerBoss', avatar: '🍞', wealth: 78_000, level: 9, businessCount: 3 },
  { rank: 6, playerId: 'player-1', username: 'BizMaster', avatar: '👤', wealth: 15_400, level: 5, businessCount: 2 },
  { rank: 7, playerId: 'player-4', username: 'DairyQueen', avatar: '🥛', wealth: 12_000, level: 4, businessCount: 2 },
  { rank: 8, playerId: 'player-5', username: 'TechWiz', avatar: '📱', wealth: 8_500, level: 3, businessCount: 1 },
];

// ==================== FRIDAY MARKET ====================

export const mockFridayMarket: FridayMarketItem[] = [
  { id: 'fm-1', name: 'Energy Drink', icon: '⚡', price: 50, effect: { energy: 20 }, available: true },
  { id: 'fm-2', name: 'Brain Book', icon: '📚', price: 200, effect: { intelligence: 10 }, available: true },
  { id: 'fm-3', name: 'Kebab Plate', icon: '🍖', price: 30, effect: { hunger: -30, happiness: 10 }, available: true },
  { id: 'fm-4', name: 'Coffee', icon: '☕', price: 15, effect: { energy: 10, happiness: 5 }, available: true },
  { id: 'fm-5', name: 'Game Console', icon: '🎮', price: 500, effect: { happiness: 25 }, available: false },
  { id: 'fm-6', name: 'Gym Pass', icon: '💪', price: 100, effect: { energy: 15, happiness: 10 }, available: true },
];
