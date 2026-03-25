import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArrowLeft, Clock, CalendarDays, Wallet, User as UserIcon, CheckCircle2, AlertCircle, Receipt, SearchX } from 'lucide-react';

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({
    where: { id: token },
    include: {
      properties: {
        include: { agreements: { include: { payments: { where: { status: 'PAID' }, orderBy: { paidAt: 'desc' } }, tenant: true } } }
      },
      agreements: {
        include: { property: { include: { landlord: true } }, payments: { where: { status: 'PAID' }, orderBy: { paidAt: 'desc' } } }
      }
    }
  });

  if (!user) redirect('/uz/login');

  const receivedPayments = user.properties.flatMap(p => p.agreements.flatMap(a => a.payments.map(pay => ({
     ...pay,
     role: 'Uy Egasi',
     title: pay.title || (pay.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Oylik Ijara'),
     counterparty: a.tenant.name || a.tenant.phone,
     propertyName: p.name
  }))));

  const sentPayments = user.agreements.flatMap(a => a.payments.map(pay => ({
     ...pay,
     role: 'Ijarachi',
     title: pay.title || (pay.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Oylik Ijara'),
     counterparty: a.property.landlord.name || a.property.landlord.phone,
     propertyName: a.property.name
  })));

  const allHistory = [...receivedPayments, ...sentPayments].sort((x, y) => (y.paidAt?.getTime() || 0) - (x.paidAt?.getTime() || 0));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans pb-20 selection:bg-[#2AABEE]/30">
      <header className="mb-10 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
             <Receipt className="w-8 h-8 text-[#2AABEE]" /> To'lovlar Tarixi
          </h1>
          <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400 font-medium">Barcha muvaffaqiyatli tranzaksiyalar (Kvitansiya arxivi)</p>
        </div>
        <a href="/uz/dashboard" className="hidden sm:flex items-center px-5 py-2.5 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white rounded-full text-sm font-bold shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Orqaga
        </a>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden max-w-5xl mx-auto relative">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#2AABEE]/5 rounded-full blur-3xl pointer-events-none"></div>
        {allHistory.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-6">
               <SearchX className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hozircha tarix bo'sh</h3>
            <p className="text-zinc-500 max-w-sm font-medium">Hali hech qanday tasdiqlangan va yakuniga yetgan to'lov tarixi mavjud emas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Sana</th>
                  <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs"><Receipt className="w-3.5 h-3.5 inline mr-1.5" /> To'lov Turi</th>
                  <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs"><Wallet className="w-3.5 h-3.5 inline mr-1.5" /> Mulk & Rolingiz</th>
                  <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs"><UserIcon className="w-3.5 h-3.5 inline mr-1.5" /> Shaxs</th>
                  <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">Summa (UZS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {allHistory.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors group">
                    <td className="px-6 sm:px-8 py-6">
                      <p className="text-zinc-900 dark:text-white font-bold">{p.paidAt ? p.paidAt.toLocaleDateString() : (p.dueDate ? p.dueDate.toLocaleDateString() : 'Noma`lum')}</p>
                      <p className="text-zinc-400 text-xs font-medium flex items-center mt-1"><Clock className="w-3 h-3 mr-1" /> {p.paidAt ? p.paidAt.toLocaleTimeString().slice(0, 5) : '--:--'}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-6">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700/50">{p.title}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-6">
                      <p className="font-bold text-zinc-900 dark:text-white">{p.propertyName}</p>
                      <p className={`text-xs font-bold mt-1.5 ${p.role === 'Uy Egasi' ? 'text-[#2AABEE]' : 'text-zinc-500'}`}>{p.role}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-6 text-zinc-600 dark:text-zinc-300 font-medium">{p.counterparty}</td>
                    <td className="px-6 sm:px-8 py-6">
                      <span className="inline-flex items-center font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> +{(p.paidAmount || p.amount)?.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Mobile Back Button */}
      <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
         <a href="/uz/dashboard" className="flex items-center justify-center w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 mr-2" /> Orqaga Dashbordga
         </a>
      </div>
    </div>
  );
}
