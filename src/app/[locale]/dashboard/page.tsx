import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({
    where: { id: token },
    include: {
      properties: {
        include: { agreements: { include: { tenant: true, payments: true } } }
      }
    }
  });

  if (!user) redirect('/uz/login');

  let upcomingTotal = 0;
  let receivedTotal = 0;
  let lateTenants = 0;

  const currentMonth = new Date().getMonth();
  const allAgreements = user.properties.flatMap((p: any) => p.agreements);
  
  const formattedTenants = allAgreements.map((agreement: any) => {
    const currentPayment = agreement.payments.find((p: any) => p.dueDate.getMonth() === currentMonth);
    const amount = currentPayment ? currentPayment.amount : agreement.monthlyAmount;
    
    if (currentPayment?.status === 'PAID') {
      receivedTotal += amount;
    } else {
      upcomingTotal += amount;
      if (currentPayment && currentPayment.dueDate < new Date()) {
         lateTenants++;
      }
    }

    return {
      id: agreement.tenant.id,
      paymentId: currentPayment?.id,
      name: agreement.tenant.name || agreement.tenant.phone,
      phone: agreement.tenant.phone,
      property: user.properties.find((p: any) => p.id === agreement.propertyId)?.name,
      amount: amount,
      dueDate: currentPayment?.dueDate.toLocaleDateString() || agreement.startDate.toLocaleDateString(),
      status: currentPayment?.status || 'PENDING'
    };
  });

  async function acceptPayment(formData: FormData) {
    'use server';
    const paymentId = formData.get('paymentId') as string;
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', paidAt: new Date() }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans transition-colors duration-300">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Salom, {user.name}</h1>
            <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Asosiy panel va joriy oylik holat</p>
          </div>
          <Link href="/uz/profile" className="sm:hidden w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
            👤
          </Link>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/uz/profile" className="hidden sm:flex px-5 py-3.5 rounded-2xl text-sm font-bold bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm active:scale-[0.98]">
            Profil sozlamalari
          </Link>
          <button className="flex-1 sm:flex-none justify-center flex bg-black text-white dark:bg-white dark:text-black px-5 py-3.5 rounded-2xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm">
            + Yangi mulk
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Kutilayotgan to'lovlar</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
            {upcomingTotal.toLocaleString()} <span className="text-xl text-zinc-400">UZS</span>
          </p>
          <div className="mt-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${lateTenants > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
              {lateTenants} ta kechikmoqda
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Joriy oydagi tushumlar</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
            {receivedTotal.toLocaleString()} <span className="text-xl text-zinc-400">UZS</span>
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Faol mulklar</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
            {user.properties.length} <span className="text-xl text-zinc-400">ta</span>
          </p>
        </div>
      </div>

      {/* Tenants Table */}
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1">Faol Ijarachilar</h2>
      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        {formattedTenants.length === 0 ? (
           <div className="p-10 text-center text-zinc-500">Hali hech qanday ijarachi yo'q</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-8 py-5 font-semibold">Ijarachi</th>
                  <th className="px-8 py-5 font-semibold">Mulk</th>
                  <th className="px-8 py-5 font-semibold">Muddat</th>
                  <th className="px-8 py-5 font-semibold">Xolati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {formattedTenants.map((t: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-semibold text-zinc-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{t.phone}</p>
                    </td>
                    <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">{t.property}</td>
                    <td className="px-8 py-6 text-zinc-600 dark:text-zinc-300">{t.dueDate}</td>
                    <td className="px-8 py-6">
                      {t.status === 'PAID' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>To'landi</span>}
                      {t.status === 'PENDING' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>Kutilmoqda</span>}
                      {t.status === 'UNDER_REVIEW' && (
                         <form action={acceptPayment} className="flex items-center">
                           <input type="hidden" name="paymentId" value={t.paymentId} />
                           <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 mr-3">Tekshiruvda ⏳</span>
                           <button type="submit" className="px-3 py-1.5 bg-[#2AABEE] text-white text-xs font-bold rounded-xl hover:bg-[#1f8fc9] transition-all">Qabul Qilish ✅</button>
                         </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
