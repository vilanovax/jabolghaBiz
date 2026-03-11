import { create } from 'zustand';
import {
  PlayerProfile,
  Business,
  Product,
  MarketListing,
  LeaderboardEntry,
  FridayMarketItem,
  BusinessTemplate,
  PlayerStats,
} from '@/types';
import {
  mockPlayer,
  mockBusinesses,
  mockProducts,
  mockListings,
  mockLeaderboard,
  mockFridayMarket,
  businessTemplates,
} from '@/data/mock';

interface GameState {
  // Data
  player: PlayerProfile;
  businesses: Business[];
  products: Product[];
  listings: MarketListing[];
  leaderboard: LeaderboardEntry[];
  fridayMarket: FridayMarketItem[];
  businessTemplates: BusinessTemplate[];

  // Actions - Player
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  updateBalance: (amount: number) => void;

  // Actions - Business
  createBusiness: (template: BusinessTemplate) => void;
  upgradeBusiness: (businessId: string) => void;

  // Actions - Market
  buyListing: (listingId: string, quantity: number) => void;
  buyFridayItem: (itemId: string) => void;

  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial data
  player: mockPlayer,
  businesses: mockBusinesses,
  products: mockProducts,
  listings: mockListings,
  leaderboard: mockLeaderboard,
  fridayMarket: mockFridayMarket,
  businessTemplates: businessTemplates,

  // Player actions
  updatePlayerStats: (stats) =>
    set((state) => ({
      player: {
        ...state.player,
        stats: { ...state.player.stats, ...stats },
      },
    })),

  updateBalance: (amount) =>
    set((state) => ({
      player: {
        ...state.player,
        balance: state.player.balance + amount,
      },
    })),

  // Business actions
  createBusiness: (template) => {
    const { player } = get();
    if (player.balance < template.startCost) return;

    const newBusiness: Business = {
      id: `biz-${Date.now()}`,
      ownerId: player.id,
      name: `My ${template.name}`,
      type: template.type,
      level: 1,
      employees: [],
      productionCapacity: template.baseProductionCapacity,
      expenses: template.baseExpenses,
      revenue: template.baseRevenue,
      profit: template.baseRevenue - template.baseExpenses,
      icon: template.icon,
      upgradeCost: template.startCost * 1.5,
    };

    set((state) => ({
      businesses: [...state.businesses, newBusiness],
      player: {
        ...state.player,
        balance: state.player.balance - template.startCost,
      },
    }));
  },

  upgradeBusiness: (businessId) => {
    const { player, businesses } = get();
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz || player.balance < biz.upgradeCost) return;

    set((state) => ({
      businesses: state.businesses.map((b) =>
        b.id === businessId
          ? {
              ...b,
              level: b.level + 1,
              productionCapacity: Math.round(b.productionCapacity * 1.3),
              revenue: Math.round(b.revenue * 1.25),
              profit: Math.round(b.revenue * 1.25) - b.expenses,
              upgradeCost: Math.round(b.upgradeCost * 1.6),
            }
          : b
      ),
      player: {
        ...state.player,
        balance: state.player.balance - biz.upgradeCost,
      },
    }));
  },

  // Market actions
  buyListing: (listingId, quantity) => {
    const { player, listings } = get();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing || quantity > listing.quantity) return;

    const totalCost = listing.pricePerUnit * quantity;
    if (player.balance < totalCost) return;

    set((state) => ({
      listings: state.listings
        .map((l) =>
          l.id === listingId
            ? { ...l, quantity: l.quantity - quantity }
            : l
        )
        .filter((l) => l.quantity > 0),
      player: {
        ...state.player,
        balance: state.player.balance - totalCost,
      },
    }));
  },

  buyFridayItem: (itemId) => {
    const { player, fridayMarket } = get();
    const item = fridayMarket.find((i) => i.id === itemId);
    if (!item || !item.available || player.balance < item.price) return;

    const newStats = { ...player.stats };
    for (const [key, value] of Object.entries(item.effect)) {
      const statKey = key as keyof PlayerStats;
      newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + (value as number)));
    }

    set((state) => ({
      player: {
        ...state.player,
        balance: state.player.balance - item.price,
        stats: newStats,
      },
    }));
  },

  // UI
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
