'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, ShoppingCart, Trophy, User } from 'lucide-react';

const navItems = [
  { label: 'خانه', href: '/', icon: Home },
  { label: 'کسب‌وکار', href: '/business', icon: Briefcase },
  { label: 'بازار', href: '/market', icon: ShoppingCart },
  { label: 'رتبه‌بندی', href: '/leaderboard', icon: Trophy },
  { label: 'پروفایل', href: '/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]
                ${isActive
                  ? 'text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-300'
                }
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
