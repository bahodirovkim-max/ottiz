import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({
    where: { id: token }
  });

  if (!user) redirect('/uz/login');

  async function handleLogout() {
    'use server';
    const store = await cookies();
    store.delete('auth-token');
    redirect('/uz/login');
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Mening Profilim</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Shaxsiy ma'lumotlar va kartalar</p>
        </div>
        <a href="/uz/dashboard" className="text-sm font-bold px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors block">
          &larr; Orqaga
        </a>
      </header>

      <div className="max-w-2xl bg-white dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-10 shadow-sm border border-zinc-100 dark:border-zinc-800">
        
        <div className="flex items-center gap-6 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-8">
           <div className="w-20 h-20 rounded-full bg-[#2AABEE]/10 flex items-center justify-center text-3xl font-bold text-[#2AABEE]">
             {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
           </div>
           <div>
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
             <p className="text-zinc-500 font-medium inline-flex items-center gap-2 mt-1">
               {user.phone} 
               <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-black text-white dark:bg-white dark:text-black">
                 {user.role}
               </span>
             </p>
           </div>
        </div>

        <div className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">To'lov qabul qilinadigan karta raqami</label>
             <div className="flex flex-col sm:flex-row gap-3">
               <input 
                  type="text" 
                  disabled
                  value={user.cardNumber || "Hali ulanmagan"}
                  className="w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-300 dark:ring-zinc-700 outline-none"
               />
               <button className="px-8 py-3 rounded-2xl font-bold text-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-200 active:scale-[0.98] transition-all whitespace-nowrap">
                 O'zgartirish
               </button>
             </div>
          </div>
          
          <form action={handleLogout} className="pt-6">
             <button type="submit" className="w-full flex justify-center py-4 rounded-2xl text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-[0.98] transition-all">
                Akkauntdan chiqish (Logout)
             </button>
          </form>
        </div>

      </div>
    </div>
  );
}
