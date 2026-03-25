import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft, User as UserIcon, CreditCard, LogOut, Save, BadgeCheck, Settings2 } from 'lucide-react';

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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans pb-24 selection:bg-[#2AABEE]/30">
      <header className="mb-10 flex justify-between items-center max-w-2xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
             <Settings2 className="w-8 h-8 text-[#2AABEE]" /> Profil Sozlamalari
          </h1>
          <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400 font-medium">Shaxsiy rekvizitlar va xavfsizlik</p>
        </div>
        <a href="/uz/dashboard" className="hidden sm:flex items-center px-4 py-2.5 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white rounded-full text-sm font-bold shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Orqaga
        </a>
      </header>

      <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2AABEE]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 border-b border-zinc-100 dark:border-zinc-800/50 pb-10 relative z-10">
           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#2AABEE] to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-[#2AABEE]/30 ring-4 ring-white dark:ring-zinc-900">
             {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10 text-white" />}
           </div>
           <div className="text-center sm:text-left mt-2 sm:mt-4">
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
               {user.name || 'Ismi kiritilmagan'}
               {user.name && <BadgeCheck className="w-5 h-5 text-[#2AABEE]" />}
             </h2>
             <p className="text-zinc-500 font-bold inline-flex items-center justify-center sm:justify-start gap-3 mt-2 text-lg tracking-wide">
               {user.phone} 
             </p>
           </div>
        </div>

        <form action={updateProfile} className="space-y-8 relative z-10">
          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <UserIcon className="w-4 h-4 text-zinc-400" /> To'liq ismingiz
             </label>
             <input 
                type="text" 
                name="name"
                required
                defaultValue={user.name || ''}
                placeholder="Alisher Rustamov"
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:font-normal"
             />
          </div>

          <div className="pt-2">
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <CreditCard className="w-4 h-4 text-zinc-400" /> To'lov Qabul Qilinadigan Karta (P2P)
             </label>
             <input 
                type="text" 
                name="cardNumber"
                placeholder="8600 1234 5678 9012"
                maxLength={19}
                defaultValue={formattedCard}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all tracking-widest font-mono text-lg font-bold placeholder:font-sans placeholder:font-normal placeholder:tracking-normal"
             />
             <p className="text-xs text-zinc-500 font-medium mt-3 bg-blue-50 dark:bg-[#2AABEE]/5 p-4 rounded-xl text-blue-800 dark:text-[#2AABEE]">
               * Ijarachilar ijara pulini Click/Payme orqali doimo mana shu 16 xonali Uzcard yoki Humo kartasiga o'tkazishadi. Tizim bevosita pul yechmaydi.
             </p>
          </div>

          <div className="pt-8 border-b border-zinc-100 dark:border-zinc-800/50 pb-10">
             <button type="submit" className="flex items-center justify-center gap-2 w-full py-4.5 text-base font-bold text-white bg-black dark:bg-white dark:text-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_20px_rgba(255,255,255,0.1)]">
               <Save className="w-5 h-5" /> Sozlamalarni Saqlash
             </button>
          </div>
        </form>

        <form action={handleLogout} className="pt-8 relative z-10">
           <button type="submit" className="w-full flex justify-center items-center gap-2 py-4 rounded-2xl text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-[0.98] transition-all">
              <LogOut className="w-4 h-4" /> Tizimdan chiqish (Logout)
           </button>
        </form>
      </div>

      {/* Mobile Back Button */}
      <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
         <a href="/uz/dashboard" className="flex items-center justify-center w-full py-4 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform ring-1 ring-zinc-700">
            <ArrowLeft className="w-5 h-5 mr-2" /> Bosh sahifaga qaytish
         </a>
      </div>
    </div>
  );
}
