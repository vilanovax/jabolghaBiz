'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, ShoppingCart, Heart, User } from 'lucide-react';

const navItems = [
  { label: 'خانه', href: '/', icon: Home },
  { label: 'کسب‌وکار', href: '/business', icon: Briefcase },
  { label: 'بازار', href: '/market', icon: ShoppingCart },
  { label: 'زندگی', href: '/life', icon: Heart },
  { label: 'پروفایل', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-line-subtle">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-[14px] transition-all min-w-[56px]
                ${isActive
                  ? 'text-[#818cf8] bg-[#6366F1]/10'
                  : 'text-fg-muted hover:text-fg-secondary'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
