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
          <p className="text-xs text-zinc-500">by {listing.sellerName}</p>
        </div>
        <div className="text-right">
          <p className="text-amber-400 font-mono text-sm font-bold">${listing.pricePerUnit}</p>
          <p className="text-[10px] text-zinc-500">per unit</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-400">
          Qty: <span className="text-white font-medium">{listing.quantity}</span>
          <span className="text-zinc-600 ml-1">(Total: ${totalCost.toLocaleString()})</span>
        </span>
        {!isOwn && (
          <Button
            onClick={() => buyListing(listing.id, 1)}
            disabled={!canAfford}
            size="sm"
            variant="success"
          >
            Buy 1
          </Button>
        )}
        {isOwn && (
          <span className="text-xs text-indigo-400 font-medium">Your listing</span>
        )}
      </div>
    </Card>
  );
}
