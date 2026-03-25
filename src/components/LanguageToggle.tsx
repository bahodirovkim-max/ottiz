'use client';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const newLocale = locale === 'uz' ? 'ru' : 'uz';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  return (
    <button
      onClick={toggleLang}
      className="flex items-center justify-center gap-2 px-4 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-bold text-sm uppercase"
      title="Tilni o'zgartirish / Язык"
    >
      <Globe className="w-4 h-4" />
      {locale}
    </button>
  );
}
