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

export interface Employee {
  id: string;
  name: string;
  role: string;
  salary: number;
  efficiency: number; // 0-100
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  type: BusinessType;
  level: number;
  employees: Employee[];
  productionCapacity: number;
  expenses: number;
  revenue: number;
  profit: number;
  icon: string;
  upgradeCost: number;
}

export interface BusinessTemplate {
  type: BusinessType;
  name: string;
  icon: string;
  description: string;
  startCost: number;
  baseRevenue: number;
  baseExpenses: number;
  baseProductionCapacity: number;
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
  duration: number; // seconds
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

// ==================== NAVIGATION ====================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}
