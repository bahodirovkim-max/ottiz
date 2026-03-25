import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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

  async function updateProfile(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const cardNumberRaw = formData.get('cardNumber') as string;
    
    const cleanCard = cardNumberRaw ? cardNumberRaw.replace(/\D/g, '').substring(0, 16) : null;

    if (name) {
      await prisma.user.update({
        where: { id: token },
        data: { name, cardNumber: cleanCard }
      });
      revalidatePath('/uz/profile');
    }
  }

  let formattedCard = user.cardNumber || '';
  if (formattedCard && formattedCard.length === 16) {
     formattedCard = formattedCard.match(/.{1,4}/g)?.join(' ') || formattedCard;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans pb-20">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Mening Profilim</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Shaxsiy sozlamalar va to'lov kartasi</p>
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
             </p>
           </div>
        </div>

        <form action={updateProfile} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">To'liq ismingiz</label>
             <input 
                type="text" 
                name="name"
                required
                defaultValue={user.name || ''}
                placeholder="Alisher Rustamov"
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all font-semibold"
             />
          </div>

          <div className="pt-2">
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Daromad qabul qilinadigan Karta raqami</label>
             <input 
                type="text" 
                name="cardNumber"
                placeholder="8600 1234 5678 9012"
                maxLength={19}
                defaultValue={formattedCard}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all tracking-widest font-mono text-lg font-bold"
             />
             <p className="text-xs text-zinc-500 mt-2">* Ijarachilar siz belgilagan to'lov pulini aynan ushbu karta raqamiga o'tkazishadi. Raqamni aniq kiriting.</p>
          </div>

          <div className="pt-6 border-b border-zinc-100 dark:border-zinc-800 pb-8">
             <button type="submit" className="w-full py-4 text-sm font-bold text-white bg-[#2AABEE] rounded-2xl hover:bg-[#239cdb] active:scale-[0.98] transition-all shadow-sm">
               O'zgarishlarni Saqlash ✅
             </button>
          </div>
        </form>

        <form action={handleLogout} className="pt-6">
           <button type="submit" className="w-full flex justify-center py-4 rounded-2xl text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-[0.98] transition-all">
              Tizimdan chiqish (Logout)
           </button>
        </form>
      </div>
    </div>
  );
}
