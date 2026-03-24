import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('Index'); 

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tizimga kirish
          </h2>
          <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Arenda va to'lovlarni avtomatlashtirish platformasi
          </p>
        </div>
        
        <form className="mt-10 space-y-6" action="/dashboard" method="GET">
          <div className="space-y-4">
            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                Telefon raqam
              </label>
              <div className="mt-2 text-zinc-500">
                <input
                  id="phone-number"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:focus:ring-white transition-all outline-none"
                  placeholder="+998 (90) 123-45-67"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                  Parol
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                    Esingizdan chiqdimi?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:focus:ring-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <Link href="/dashboard">
              <button
                type="button"
                className="group relative flex w-full justify-center rounded-2xl bg-black px-4 py-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                Tizimga kirish
              </button>
            </Link>
          </div>
          
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">Yoki telegram orqali</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
             <button type="button" className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#2AABEE]/10 px-4 py-3.5 text-sm font-semibold text-[#2AABEE] hover:bg-[#2AABEE]/20 transition-all">
               <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.9 1.22-5.36 3.55-.5.35-.95.52-1.37.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.41-1.4-.87.03-.24.34-.49.94-.75 3.68-1.6 6.13-2.66 7.36-3.17 3.49-1.46 4.22-1.72 4.69-1.72.1 0 .34.02.47.12.11.08.15.2.16.3 0 .04.01.12 0 .2z"/>
               </svg>
               @RentPayBot orqali kirish
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
