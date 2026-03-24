import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8 font-sans transition-colors duration-300">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Asosiy panel</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Jami tushumlar va ijarachilar holati</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-2xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm">
          + Yangi mulkni qo'shish
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            Kutilayotgan to'lovlar
          </h3>
          <p className="text-4xl font-bold mt-4 text-zinc-900 dark:text-white pb-2 tracking-tight">4,500,000 <span className="text-xl text-zinc-400 font-medium">UZS</span></p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">2 ta kechikmoqda</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            Joriy oydagi tushumlar
          </h3>
          <p className="text-4xl font-bold mt-4 text-zinc-900 dark:text-white pb-2 tracking-tight">12,000,000 <span className="text-xl text-zinc-400 font-medium">UZS</span></p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">+14% o'sish</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Faol mulklar</h3>
          <p className="text-4xl font-bold mt-4 text-zinc-900 dark:text-white pb-2 tracking-tight">5 <span className="text-xl text-zinc-400 font-medium">ta</span></p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">1 ta bo'sh mulk</span>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1">Ijarachilar ro'yxati</h2>
      <div className="bg-white dark:bg-zinc-900/40 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-semibold">Ijarachi</th>
                <th className="px-8 py-5 font-semibold">Obyekt (Mulk)</th>
                <th className="px-8 py-5 font-semibold">To'lov sanasi</th>
                <th className="px-8 py-5 font-semibold">Summa</th>
                <th className="px-8 py-5 font-semibold">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <p className="font-semibold text-zinc-900 dark:text-white">Azizov Sardor</p>
                  <p className="text-xs text-zinc-500 mt-1">+998 90 123 45 67</p>
                </td>
                <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">Chilonzor 3-kvartal, 12-uy</td>
                <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">25-Mart</td>
                <td className="px-8 py-6 font-semibold text-zinc-900 dark:text-white">400$</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                    To'landi
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <p className="font-semibold text-zinc-900 dark:text-white">Malika Karimova</p>
                  <p className="text-xs text-zinc-500 mt-1">+998 93 987 65 43</p>
                </td>
                <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">Yunusobod 11, 45-uy</td>
                <td className="px-8 py-6 text-rose-600 font-medium">20-Mart (O'tib ketgan)</td>
                <td className="px-8 py-6 font-semibold text-zinc-900 dark:text-white">350$</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
                    Kechikmoqda
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <p className="font-semibold text-zinc-900 dark:text-white">Umid Rustamov</p>
                  <p className="text-xs text-zinc-500 mt-1">+998 94 444 33 22</p>
                </td>
                <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">Darxon, Asaka ko'chasi 5</td>
                <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">30-Mart</td>
                <td className="px-8 py-6 font-semibold text-zinc-900 dark:text-white">800$</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
                    Kutilmoqda
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
