import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Index');

  return (
    <div className="flex flex-col flex-1 min-h-screen items-center justify-center p-6 sm:p-8 bg-zinc-50 dark:bg-[#0a0a0a] font-sans">
      <main className="flex flex-col items-center gap-8 max-w-2xl text-center w-full">
        
        {/* Sarlavha Qismi */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#2AABEE]/10 text-[#2AABEE] text-sm font-semibold mb-2">
            🚀 MVP Versiyasi v1.0
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            {t('title')}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto pb-4">
            {t('description')} — Uylaringizni, ijarachi (kvartirantlarni) va har oylik to'lovlarni bitta aqlli tizim orqali onlayn shaklda boshqaring!
          </p>
        </div>

        {/* Test tugmalari (Menyulari) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
          
          <Link href="/uz/login" className="flex flex-col items-start p-6 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-500 transition-all group scale-100 active:scale-[0.98]">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#2AABEE] transition-colors">🔐 Tizimga Kirish</h2>
            <p className="text-sm text-zinc-500 mt-2 text-left leading-relaxed">Platformaga barcha uy egalari telefon raqami yoki Telegram orqali avtorizatsiya qiluvchi oyna.</p>
          </Link>
          
          <Link href="/uz/dashboard" className="flex flex-col items-start p-6 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-500 transition-all group scale-100 active:scale-[0.98]">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#2AABEE] transition-colors">📊 Asosiy panel (Dashboard)</h2>
            <p className="text-sm text-zinc-500 mt-2 text-left leading-relaxed">Jami oylik tushumlar, aktiv uylar va ijarachilarning dolzarb holatini ko'rsatuvchi xususiy kabinet dizayni.</p>
          </Link>

          <Link href="/uz/invoice/123" className="flex flex-col items-start p-6 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-zinc-500 transition-all group sm:col-span-2 scale-100 active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-rose-500 transition-colors">💳 Ijarachi uchun Onlayn to'lov varaqasi</h2>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-[10px] font-bold rounded flex items-center gap-1 uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Demo</span>
            </div>
            <p className="text-sm text-zinc-500 mt-2 text-left leading-relaxed">Xar oyi to'lov sanasi yetganda ijarchining mobil telefoniga to'g'ridan to'g'ri jo'natiluvchi invoice. Ichida "Click/Payme" orqali darhol to'lash tugmasi bor.</p>
          </Link>

        </div>

      </main>
    </div>
  );
}
