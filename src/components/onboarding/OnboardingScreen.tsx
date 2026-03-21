'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BusinessType } from '@/types';

/* ────────── intro slides ────────── */
const SLIDES = [
  {
    emoji: '🏙️',
    title: 'به جابلقابیز خوش اومدی!',
    subtitle: 'شهری پر از فرصت منتظرته',
    desc: 'کسب‌وکار بساز، در بازار بفروش، ثروتمندترین امپراتور جابلقا بشو.',
  },
  {
    emoji: '🏭',
    title: 'امپراتوری بساز',
    subtitle: 'از مزرعه تا استارتاپ',
    desc: 'کسب‌وکارهای مختلف بساز، کارمند استخدام کن، تولید رو بهینه کن.',
  },
  {
    emoji: '📈',
    title: 'بازار واقعیه',
    subtitle: 'عرضه و تقاضا حاکمه',
    desc: 'هر چی بیشتر بفروشی قیمت‌ها پایین میان — توازن ایجاد کن.',
  },
  {
    emoji: '⚡',
    title: 'زندگی رو مدیریت کن',
    subtitle: 'انرژی = قدرت تولید',
    desc: 'انرژی، شادی و گرسنگیت رو کنترل کن تا کسب‌وکارت بهتر بره.',
  },
];

/* ────────── avatars ────────── */
const AVATARS = ['👤', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🍳', '👩‍🌾', '🧑‍🔧', '🦸', '🧙', '🤠', '👸', '🥷'];

/* ────────── affordable starter businesses ────────── */
const STARTER_BUSINESSES: {
  type: BusinessType;
  icon: string;
  name: string;
  desc: string;
  cost: number;
}[] = [
  { type: 'farming', icon: '🌾', name: 'مزرعه', desc: 'ارزان‌ترین شروع، تولید سریع', cost: 30_000 },
  { type: 'app_startup', icon: '📱', name: 'استارتاپ', desc: 'نرم‌افزار بساز، آینده دیجیتال', cost: 40_000 },
  { type: 'supermarket', icon: '🏪', name: 'سوپرمارکت', desc: 'فروش مستقیم، درآمد پایدار', cost: 75_000 },
  { type: 'restaurant', icon: '🍽️', name: 'رستوران', desc: 'حاشیه سود بالا', cost: 80_000 },
];

/* ────────── step enum ────────── */
type Step = 'slides' | 'name' | 'avatar' | 'business';

export default function OnboardingScreen() {
  const completeOnboarding = useGameStore((s) => s.completeOnboarding);

  const [slideIdx, setSlideIdx] = useState(0);
  const [step, setStep] = useState<Step>('slides');
  const [username, setUsername] = useState('');
  const [nameError, setNameError] = useState('');
  const [avatar, setAvatar] = useState('👤');
  const [selectedBiz, setSelectedBiz] = useState<BusinessType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'name' && inputRef.current) inputRef.current.focus();
  }, [step]);

  /* ── slide navigation ── */
  const handleSlideNext = () => {
    if (slideIdx < SLIDES.length - 1) setSlideIdx((s) => s + 1);
    else setStep('name');
  };

  /* ── name validation ── */
  const handleNameNext = () => {
    const name = username.trim();
    if (!name) { setNameError('اسمت رو بنویس!'); return; }
    if (name.length < 2) { setNameError('حداقل ۲ حرف'); return; }
    if (name.length > 20) { setNameError('حداکثر ۲۰ حرف'); return; }
    setStep('avatar');
  };

  /* ── avatar confirm ── */
  const handleAvatarNext = () => setStep('business');

  /* ── final: start game ── */
  const handleStart = () => {
    if (!selectedBiz) return;
    completeOnboarding(username.trim(), avatar, selectedBiz);
  };

  const current = SLIDES[slideIdx];

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center px-6"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 40%, #0f172a 100%)',
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm flex flex-col items-center text-center">

        {/* ═══════════ STEP: intro slides ═══════════ */}
        {step === 'slides' && (
          <>
            {/* dots */}
            <div className="flex gap-1.5 mb-8">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === slideIdx ? 20 : 6,
                    height: 6,
                    background: i === slideIdx ? '#a78bfa' : 'rgba(167,139,250,0.25)',
                  }}
                />
              ))}
            </div>

            <div key={slideIdx} className="flex flex-col items-center gap-6 animate-fade-in">
              <div
                className="w-28 h-28 rounded-[32px] flex items-center justify-center text-6xl"
                style={{
                  background: 'rgba(139,92,246,0.1)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  boxShadow: '0 0 40px rgba(139,92,246,0.12)',
                }}
              >
                {current.emoji}
              </div>
              <div className="space-y-2">
                <p className="text-purple-300/70 text-xs font-bold tracking-widest uppercase">
                  {current.subtitle}
                </p>
                <h1 className="text-2xl font-black text-white leading-tight">{current.title}</h1>
                <p className="text-sm text-white/50 leading-relaxed mt-3">{current.desc}</p>
              </div>

              <button onClick={handleSlideNext} className="ob-btn mt-4">
                {slideIdx === SLIDES.length - 1 ? 'بزن بریم! 🚀' : 'بعدی →'}
              </button>

              {slideIdx > 0 && (
                <button onClick={() => setSlideIdx((s) => s - 1)} className="text-white/30 text-xs font-medium">
                  ← برگشت
                </button>
              )}
            </div>
          </>
        )}

        {/* ═══════════ STEP: name ═══════════ */}
        {step === 'name' && (
          <div className="w-full flex flex-col items-center gap-5 animate-fade-in">
            <div className="text-5xl mb-2">👤</div>
            <h1 className="text-2xl font-black text-white leading-tight">اسمت چیه؟</h1>
            <p className="text-sm text-white/50">این اسم تو لیدربورد نشون داده میشه</p>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setNameError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
              placeholder="نام کاربری..."
              maxLength={20}
              className="w-full text-center text-white font-bold text-lg bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 placeholder:text-white/25 focus:outline-none focus:border-purple-400/60 transition-all"
              style={{ direction: 'rtl' }}
            />
            {nameError && <p className="text-red-400 text-xs font-bold -mt-2">{nameError}</p>}
            <button onClick={handleNameNext} className="ob-btn">ادامه →</button>
            <button onClick={() => setStep('slides')} className="text-white/30 text-xs font-medium">← برگشت</button>
          </div>
        )}

        {/* ═══════════ STEP: avatar ═══════════ */}
        {step === 'avatar' && (
          <div className="w-full flex flex-col items-center gap-5 animate-fade-in">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-all"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '2px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 30px rgba(139,92,246,0.2)',
              }}
            >
              {avatar}
            </div>
            <h1 className="text-2xl font-black text-white leading-tight">آواتار انتخاب کن</h1>
            <p className="text-sm text-white/50">کدوم بیشتر بهت میاد؟</p>

            <div className="grid grid-cols-6 gap-2 w-full">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className="text-3xl rounded-2xl py-2.5 transition-all active:scale-90"
                  style={{
                    background: a === avatar ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.03)',
                    border: a === avatar ? '2px solid rgba(139,92,246,0.6)' : '2px solid rgba(255,255,255,0.06)',
                    boxShadow: a === avatar ? '0 0 16px rgba(139,92,246,0.3)' : 'none',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            <button onClick={handleAvatarNext} className="ob-btn">ادامه →</button>
            <button onClick={() => setStep('name')} className="text-white/30 text-xs font-medium">← برگشت</button>
          </div>
        )}

        {/* ═══════════ STEP: business selection ═══════════ */}
        {step === 'business' && (
          <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
            <h1 className="text-2xl font-black text-white leading-tight">اولین کسب‌وکارت</h1>
            <p className="text-sm text-white/50">با ۵۰,۰۰۰ تومن شروع می‌کنی — کدوم رو می‌خوای؟</p>

            <div className="w-full space-y-2 mt-1">
              {STARTER_BUSINESSES.map((b) => {
                const affordable = b.cost <= 50_000;
                const selected = selectedBiz === b.type;
                return (
                  <button
                    key={b.type}
                    onClick={() => affordable && setSelectedBiz(b.type)}
                    className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-right transition-all active:scale-[0.98]"
                    style={{
                      background: selected
                        ? 'rgba(139,92,246,0.2)'
                        : affordable
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(255,255,255,0.01)',
                      border: selected
                        ? '2px solid rgba(139,92,246,0.6)'
                        : affordable
                          ? '2px solid rgba(255,255,255,0.06)'
                          : '2px solid rgba(255,255,255,0.03)',
                      opacity: affordable ? 1 : 0.4,
                      boxShadow: selected ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                    }}
                    disabled={!affordable}
                  >
                    <span className="text-3xl shrink-0">{b.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">{b.name}</span>
                        <span className="text-white/40 text-xs font-fa font-bold">{b.cost.toLocaleString('fa-IR')} ت</span>
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{b.desc}</p>
                    </div>
                    {!affordable && (
                      <span className="text-[10px] text-red-400/60 font-bold shrink-0">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleStart}
              disabled={!selectedBiz}
              className="ob-btn mt-2"
              style={{ opacity: selectedBiz ? 1 : 0.4 }}
            >
              شروع بازی 🎮
            </button>
            <button onClick={() => setStep('avatar')} className="text-white/30 text-xs font-medium">← برگشت</button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease forwards;
        }
        .ob-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 16px;
          color: white;
          font-weight: 900;
          font-size: 16px;
          transition: all 0.15s;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          box-shadow: 0 0 30px rgba(139,92,246,0.35);
        }
        .ob-btn:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}
