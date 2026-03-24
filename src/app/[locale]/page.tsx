import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Index');

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8 bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-center text-zinc-900 dark:text-zinc-50">
          {t('title')}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center">
          {t('description')}
        </p>
      </main>
    </div>
  );
}
