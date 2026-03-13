# JabolghaBiz - Economy System Documentation

## 1. Economy Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `player.balance` | `gameStore` / `mock.ts` | Player wallet — start: **150,000** |
| `baseRevenue` | `mock.ts` templates | Revenue per cycle before multipliers |
| `baseExpenses` | `mock.ts` templates | Fixed cost per cycle |
| `cycleDuration` | `mock.ts` templates | Seconds between production cycles (90–300s) |
| `upgradeCost` | `mock.ts` (startCost × 1.5) | Cost of next business level upgrade |
| `pendingRevenue` | `gameStore` per business | Uncollected revenue waiting for tap |
| `maxPendingCycles` | `mock.ts` templates (100) | Cap on accumulated offline cycles + 20% diminishing returns after |
| `officeLevel` | `gameStore` per business | Office tier (1–4), controls capacity |
| `employee.revenueBoost` | `mock.ts` templates | Multiplicative boost (0.15–0.5) |
| `employee.salary` | `mock.ts` templates | Recurring expense per cycle |
| `product.revenueBoost` | `mock.ts` templates | Revenue per cycle, **scales with level**: boost × (1 + level × 0.1) |
| `product.unlockCost` | `mock.ts` templates | One-time unlock price |

### Business Start Costs & Base Stats

| Type | Start Cost | Base Revenue | Cycle | Base Expenses |
|------|-----------|-------------|-------|---------------|
| Farming | 30,000 | 3,000 | 120s | 800 |
| App Startup | 50,000 | 5,000 | 180s | 1,000 |
| Restaurant | 80,000 | 8,000 | 150s | 2,000 |
| Supermarket | 70,000 | 6,000 | 90s | 1,500 |
| Factory | 120,000 | 10,000 | 240s | 3,000 |
| Transport | 150,000 | 12,000 | 300s | 4,000 |

### Office Tiers

| Level | Name | Area | Max Employees | Max Products | Rent/Cycle | Upgrade Cost |
|-------|------|------|--------------|-------------|------------|-------------|
| 1 | اتاق کار | 30m² | 3 | 1 | 500 | — |
| 2 | دفتر | 60m² | 5 | 2 | 1,500 | 25,000 |
| 3 | دفتر بزرگ | 120m² | 7 | 3 | 3,500 | 60,000 |
| 4 | ساختمان تجاری | 250m² | 10 | 5 | 7,000 | 150,000 |

---

## 2. Income Formulas

### Effective Revenue
```
staffBoostSum = SUM(employee.revenueBoost × (1 + (level - 1) × 0.5))
staffMultiplier = MIN(1 + staffBoostSum, 3.5)        // capped at 250% boost
productBoost = SUM(product.revenueBoost × (1 + level × 0.1))  // scales with business level

effectiveRevenue = ROUND(baseRevenue × staffMultiplier) + productBoost
```

### Total Expenses
```
totalExpenses = baseExpenses + SUM(employee.salary) + officeTier.rent
```

### Net Profit Per Cycle
```
netPerCycle = MAX(0, effectiveRevenue - totalExpenses)
```

### Pending Revenue (per tick)
```
completedCycles = FLOOR(elapsed / cycleDuration)
normalCycles = MIN(completedCycles, maxPendingCycles)
overflowCycles = MAX(0, completedCycles - maxPendingCycles)

normalRevenue = netPerCycle × normalCycles
overflowRevenue = ROUND(netPerCycle × 0.2 × overflowCycles)  // 20% diminishing returns
newPending = pendingRevenue + normalRevenue + overflowRevenue
```

If **accountant** hired → auto-deposits to `player.balance`.

---

## 3. Progression Scaling

| Mechanic | Formula | Multiplier |
|----------|---------|-----------|
| Business Level Revenue | `baseRevenue × 1.22` per level | ×1.22 compounding |
| Business Upgrade Cost | `upgradeCost × 1.5` per level | ×1.5 compounding |
| Employee Upgrade Cost | `hireCost × 2^level` | ×2 compounding |
| Employee Boost per Level | `boost × (1 + (lvl-1) × 0.5)` | +50% per level |
| Staff Multiplier Cap | Hard cap at 3.5× | Prevents runaway |
| Product Revenue | `boost × (1 + level × 0.1)` | +10% per business level |
| Max Business Level | 20 | Hard cap |

### Revenue Growth at Level N (staff multiplier = 1)

```
Level 1:  baseRevenue × 1.0
Level 5:  baseRevenue × 2.22
Level 10: baseRevenue × 5.99
Level 15: baseRevenue × 16.18
Level 20: baseRevenue × 43.74
```

### Upgrade Cost Growth at Level N

```
Level 1→2:   startCost × 1.5
Level 5→6:   startCost × 1.5 × 1.5^4 = startCost × 7.59
Level 10→11: startCost × 1.5 × 1.5^9 = startCost × 57.7
Level 20:    startCost × 1.5 × 1.5^19 = startCost × 2,216
```

### Product Revenue at Level N (base boost = 3,000)

```
Level 1:  3,300
Level 5:  4,500
Level 10: 6,000
Level 15: 7,500
Level 20: 9,000
```

---

## 4. Economy Loop

```
┌──────────────────────────────────────────────────────┐
│                    GAME TICK (1s)                     │
│                                                      │
│  Player Balance ←── collectRevenue ←── pendingRevenue│
│       │                                    ↑         │
│       │                          netPerCycle × cycles │
│       ▼                                    ↑         │
│  createBusiness ──→ Business ──→ effectiveRevenue     │
│  upgradeBusiness       │         - expenses           │
│  upgradeOffice         │                              │
│       │                ▼                              │
│       │         hireEmployee ──→ staff multiplier     │
│       │         upgradeEmployee  (capped 3.5×)       │
│       │                                              │
│       │         unlockProduct ──→ flat revenue boost  │
│       │                                              │
│       └──→ buyFridayItem ──→ player stats            │
│       └──→ buyListing ──→ market purchase            │
└──────────────────────────────────────────────────────┘
```

**Money Flow:**
1. **Earn** — businesses produce `netPerCycle` every `cycleDuration` seconds
2. **Collect** — player taps (or accountant auto-collects) → balance increases
3. **Spend** — upgrade business / hire employees / unlock products / upgrade office / buy items
4. **Expand** — new businesses, higher tiers, more products → higher revenue
5. **Repeat** — each investment increases income rate, enabling bigger investments

---

## 5. Employee System

### Roles & Effects

| Role | Effect | AutoCollect |
|------|--------|-------------|
| base | Revenue boost (0.15–0.25) | No |
| manager | Higher revenue boost (0.35–0.5) | No |
| accountant | AUTO-COLLECT pending revenue | Yes |
| marketer | Revenue boost for products (0.2–0.25) | No |
| sales | Revenue boost + speed boost (0.15) | No |

### Legendary Employees (Special Abilities)

| Employee | Business | Boost | Special Effect |
|----------|----------|-------|---------------|
| CTO | App Startup | 50% | 10% cycle duration reduction |
| مهندس ارشد اتوماسیون | Factory | 50% | 15% expense reduction |
| مدیر زنجیره تأمین | Supermarket | 40% | 20% expense reduction |
| مدیر لجستیک | Transport | 50% | 15% cycle duration reduction |

### Employee Upgrade Formulas

```
upgradeCost = baseHireCost × 2^currentLevel
boostAtLevel = baseBoost × (1 + (level - 1) × 0.5)
```

---

## 6. Product System

Products add **flat revenue** (not multiplicative). They bypass the 3.5× staff cap.

### Products by Business

**App Startup:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| اپلیکیشن فروشگاهی | 30,000 | +3,000 | — |
| سامانه حسابداری | 50,000 | +5,000 | Office L2, 2 base, Biz L5 |
| بازی موبایل | 80,000 | +8,000 | Office L3, 3 base + 1 marketer, Biz L10 |

**Farming:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| گلخانه | 20,000 | +2,000 | — |
| دامداری | 40,000 | +4,000 | Office L2, 2 base, Biz L5 |
| زنبورداری | 15,000 | +1,500 | Office L2, 1 base, Biz L3 |

**Restaurant:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| منوی ویژه | 25,000 | +2,500 | — |
| سرویس بیرون‌بر | 35,000 | +3,500 | Office L2, 2 base, Biz L5 |
| کترینگ | 50,000 | +5,000 | Office L3, 3 base + 1 marketer, Biz L10 |

**Factory:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| خط بسته‌بندی | 35,000 | +3,000 | — |
| خط تولید دوم | 60,000 | +5,500 | Office L2, 2 base, Biz L5 |
| آزمایشگاه کنترل کیفیت | 90,000 | +8,000 | Office L3, 3 base + 1 marketer, Biz L10 |

**Supermarket:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| بخش نانوایی | 20,000 | +2,000 | — |
| بخش آنلاین | 45,000 | +4,000 | Office L2, 2 base, Biz L5 |
| بازار میوه | 60,000 | +5,500 | Office L3, 3 base + 1 marketer, Biz L10 |

**Transport:**
| Product | Cost | Revenue | Requirements |
|---------|------|---------|-------------|
| خط شهری | 40,000 | +3,500 | — |
| خط بین‌شهری | 70,000 | +6,000 | Office L2, 2 base, Biz L5 |
| انبار سردخانه‌دار | 100,000 | +9,000 | Office L3, 3 base + 1 marketer, Biz L10 |

---

## 7. Market System

### Price Dynamics (every 5 minutes)

```
changePercent = RANDOM(±5% to ±15%)
newPrice = CLAMP(basePrice × 0.5, basePrice × 2.0, currentPrice × (1 + changePercent))
supply += RANDOM(-25 to +25)
demand += RANDOM(-25 to +25)
```

### Market Products

| Product | Category | Base Price |
|---------|----------|-----------|
| گندم | raw_material | 10 |
| آرد | processed | 25 |
| نان | finished_good | 50 |
| گوجه | raw_material | 8 |
| شیر | raw_material | 15 |
| پنیر | processed | 40 |
| پیتزا | food | 80 |
| اپلیکیشن | tech | 200 |

---

## 8. Economy Problems

### A. Revenue vs Cost Balance (IMPROVED)
- Revenue grows at 1.22× per level → Level 20 = 43.7× base
- Cost grows at 1.5× per level → Level 20 = 2,216× startCost
- Better balance than before (was 1.25/1.6 which was too punishing)

### B. No Ongoing Risk or Drain
- Once employees are hired and products unlocked, income is permanent.
- No employee turnover, no depreciation, no maintenance.

### C. Pending Revenue Cap (IMPROVED)
- `maxPendingCycles = 100` → supermarket cap reached in **150 minutes**.
- After cap: 20% diminishing returns (not lost). Idle players still earn.

### D. No Late-Game Money Sinks
- After maxing all businesses (level 20), employees, and products — money accumulates infinitely with nothing to spend on.
- Leaderboard becomes meaningless.

### E. Product Revenue (FIXED)
- Products now scale with business level: `boost × (1 + level × 0.1)`
- +3,000 at L1 → +7,500 at L15 → stays relevant throughout.

### F. Office Rent is Trivial
- Max rent 7,000/cycle vs potential revenue of 300,000+/cycle at high levels (<3%).

### G. No Inter-Business Competition
- All businesses can be owned simultaneously with no conflict, no resource sharing, no market saturation.

---

## 9. Missing Economy Systems

| System | Impact | Priority |
|--------|--------|----------|
| **Taxes** | Progressive tax on revenue (5–30% based on empire value) | High |
| **Maintenance** | Equipment degrades, requiring periodic investment | Medium |
| **Inflation** | Prices increase over time, reducing purchasing power | Medium |
| **Supply Chains** | Businesses feed into each other (farm → restaurant) | High |
| **Market Integration** | Player businesses affect/use market prices | Medium |
| **Prestige/Reset** | Soft-reset for permanent multipliers | High |
| **Events/Crises** | Random economic events (recession, boom, disaster) | Medium |
| **Loans/Debt** | Borrow money at interest to accelerate growth | Low |
| **Research/Tech Tree** | Permanent unlocks that affect all businesses | Medium |
| **Achievements** | One-time bonuses for reaching targets | Low |

---

## 10. Recommended Improvements

### A. Progressive Tax
```
tax_rate = MIN(0.30, empire_value / 10,000,000)
net_after_tax = netPerCycle × (1 - tax_rate)
```
Automatically scales as player grows. Simple money sink.

### B. Maintenance Cost
```
maintenance = baseExpenses × 0.1 × business.level
```
Adds ~10% per level to expenses. At level 20, maintenance = 200% of base expenses. Creates natural upgrade ceiling.

### C. Product Scaling Fix
```
productBoost = product.revenueBoost × (1 + business.level × 0.1)
```
Products grow 10% per business level, staying relevant throughout.

### D. Prestige System
- At empire value > threshold, player can "prestige" — reset all businesses but gain permanent multiplier (1.1×, 1.2×, etc.)
- Gives infinite replayability with meaningful progression.

### E. Supply Chain Links
```
if (player owns farming AND restaurant):
  restaurant.baseExpenses *= 0.8  // 20% cheaper ingredients
```
Reward multi-business ownership with cross-bonuses. No complex resource tracking.

### F. Smarter Idle Revenue
Instead of hard cap → diminishing returns:
```
if (cycles > maxPendingCycles):
  bonus = netPerCycle × 0.1 × (cycles - maxPendingCycles)
```
Don't punish idle players, but reward active ones.

---

## 11. Economy Curve — 4 Game Phases

| Phase | Time | Revenue Range | Player Activity |
|-------|------|--------------|-----------------|
| **Early Game** | 0–20 min | 3K → 20K | First business, first employee, first product |
| **Growth** | 20 min – 2 hr | 20K → 200K | Multiple businesses, multiple employees |
| **Expansion** | 2 hr – 10 hr | 200K → 2M | Multi-industry, upgraded offices, managers |
| **Late Game** | 10 hr+ | 2M → ∞ | Everything unlocked, prestige system |

### Core Economy Constants

```
REVENUE_GROWTH = 1.22 per level
COST_GROWTH = 1.5 per level
STAFF_CAP = 3.5×
PRODUCT_SCALING = 1 + level × 0.1
MAX_PENDING_CYCLES = 100
OVERFLOW_EFFICIENCY = 0.2 (20%)
MAX_BUSINESS_LEVEL = 20
```

### Future Systems (Not Yet Implemented)

| System | Formula | Priority |
|--------|---------|----------|
| Progressive Tax | `MIN(0.30, empireValue / 10M)` | High |
| Prestige | Reset + permanent ×1.1 multiplier at 5M empire | High |
| Cross-Business Bonus | Farm+Restaurant = -20% food cost | Medium |
| Milestones | 100K→unlock, 500K→employee, 1M→product, 5M→prestige | Medium |

---

## Source Files

| File | Contains |
|------|----------|
| `src/types/index.ts` | Type definitions for all economic entities |
| `src/data/mock.ts` | Templates, costs, products, employees, market data |
| `src/store/gameStore.ts` | All game actions, calculations, tick logic |
| `src/hooks/useGameTick.ts` | Game tick system (1s interval) |
