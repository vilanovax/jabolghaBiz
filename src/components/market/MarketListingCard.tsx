'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MarketListing } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface MarketListingCardProps {
  listing: MarketListing;
}

export default function MarketListingCard({ listing }: MarketListingCardProps) {
  const buyListing = useGameStore((s) => s.buyListing);
  const playerId = useGameStore((s) => s.player.id);
  const balance = useGameStore((s) => s.player.balance);

  const isOwn = listing.sellerId === playerId;
  const totalCost = listing.pricePerUnit * listing.quantity;
  const canAfford = balance >= listing.pricePerUnit;

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">{listing.productName}</h3>
          <p className="text-xs text-fg-muted">توسط {listing.sellerName}</p>
        </div>
        <div className="text-left">
          <p className="text-accent-money font-fa text-sm font-bold">{listing.pricePerUnit.toLocaleString('fa-IR')}</p>
          <p className="text-[10px] text-fg-muted">هر واحد</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-secondary">
          تعداد: <span className="text-fg font-medium">{listing.quantity}</span>
          <span className="text-fg-faint me-1">(مجموع: {totalCost.toLocaleString('fa-IR')})</span>
        </span>
        {!isOwn && (
          <Button
            onClick={() => buyListing(listing.id, 1)}
            disabled={!canAfford}
            size="sm"
            variant="success"
          >
            خرید ۱
          </Button>
        )}
        {isOwn && (
          <span className="text-xs text-indigo-400 font-medium">آگهی شما</span>
        )}
      </div>
    </Card>
  );
}
