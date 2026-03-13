// JabolghaBiz — Game UI Design Tokens
// All game components should reference these tokens for consistency.

export const colors = {
  primary: {
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  economy: {
    money: '#FBBF24',
    profit: '#22C55E',
    expense: '#EF4444',
    upgrade: '#8B5CF6',
  },
  neutral: {
    bgMain: '#0B0B0F',
    bgCard: '#18181B',
    border: '#27272A',
    textMain: '#FAFAFA',
    textMuted: '#71717A',
  },
} as const;

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '18px',
  xl: '24px',
  pill: '999px',
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
} as const;

export const shadows = {
  card: '0 2px 10px rgba(0,0,0,0.3)',
  glow: '0 0 20px rgba(99,102,241,0.5)',
  profitGlow: '0 0 20px rgba(34,197,94,0.5)',
  goldGlow: '0 0 16px rgba(251,191,36,0.3)',
} as const;

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

// Max items on screen at once
export const UI_DENSITY = {
  maxCardsPerView: 3,
  maxActionsPerView: 3,
} as const;

// Max container width
export const MAX_WIDTH = 420;
