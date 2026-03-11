'use client';

import { useGameStore } from '@/store/gameStore';
import Card from '@/components/ui/Card';
import { Settings, Coins, Volume2, Bell, Globe, Info } from 'lucide-react';

const currencyOptions = ['تومان', 'ریال', 'دلار', 'یورو', 'سکه'];

export default function SettingsPage() {
  const currency = useGameStore((s) => s.currency);
  const setCurrency = useGameStore((s) => s.setCurrency);

  return (
    <div className="space-y-5 py-4">
      <div className="flex items-center gap-2">
        <Settings size={22} className="text-zinc-400" />
        <h1 className="text-xl font-black">تنظیمات</h1>
      </div>

      {/* واحد پولی */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-amber-400" />
          <h2 className="font-bold text-sm">واحد پولی</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {currencyOptions.map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`py-2 rounded-xl text-sm font-semibold transition-all
                ${currency === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }
              `}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* صدا */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-indigo-400" />
            <h2 className="font-bold text-sm">صدای بازی</h2>
          </div>
          <ToggleSwitch />
        </div>
      </Card>

      {/* اعلان‌ها */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-pink-400" />
            <h2 className="font-bold text-sm">اعلان‌ها</h2>
          </div>
          <ToggleSwitch />
        </div>
      </Card>

      {/* زبان */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-emerald-400" />
            <h2 className="font-bold text-sm">زبان</h2>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">فارسی</span>
        </div>
      </Card>

      {/* درباره */}
      <Card className="space-y-2">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-zinc-400" />
          <h2 className="font-bold text-sm">درباره بازی</h2>
        </div>
        <p className="text-xs text-zinc-500">
          جابلقابیز — بازی شبیه‌سازی کسب‌وکار
        </p>
        <p className="text-[10px] text-zinc-600">نسخه ۰.۱.۰</p>
      </Card>
    </div>
  );
}

function ToggleSwitch() {
  return (
    <button className="w-11 h-6 bg-zinc-700 rounded-full relative transition-colors">
      <div className="absolute top-1 right-1 w-4 h-4 bg-zinc-400 rounded-full transition-transform" />
    </button>
  );
}
