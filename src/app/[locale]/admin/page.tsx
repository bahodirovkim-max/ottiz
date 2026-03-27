import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Users, Building2, Wallet, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { DashboardChart } from '@/components/DashboardChart'; // Using the existing component temporarily

export default async function AdminDashboardPage() {
  const t = await getTranslations('Dashboard');
  
  // Stats Fetching
  const userCount = await prisma.user.count();
  const propertyCount = await prisma.property.count();
  
  const activeAgreements = await prisma.rentAgreement.findMany({ 
    where: { status: 'ACTIVE', isActive: true } 
  });
  
  const mrr = activeAgreements.reduce((sum, a) => sum + a.monthlyAmount, 0);
  // Estimate RentPay's commission revenue (e.g., 1%)
  const estimatedRevenue = mrr * 0.01;

  const recentPayments = await prisma.payment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { 
      agreement: { 
        include: { 
          tenant: true, 
          property: { include: { landlord: true } } 
        } 
      } 
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-8 text-white shadow-lg border border-zinc-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
         <div className="relative z-10">
           <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Platforma Ma'lumotlari</h2>
           <p className="text-zinc-400 font-medium max-w-lg">RentPay aylanmasi va foydalanuvchilar o'sishini real vaqtda kuzating.</p>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500"><TrendingUp className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Aylanma (MRR)</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{mrr.toLocaleString()} <span className="text-sm font-bold text-zinc-400">UZS</span></h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Wallet className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Sof Daromad (1%)</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{estimatedRevenue.toLocaleString()} <span className="text-sm font-bold text-zinc-400">UZS</span></h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500"><Users className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Jami Foydalanuvchilar</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{userCount} <span className="text-sm font-bold text-zinc-400">ta</span></h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-500"><Building2 className="w-6 h-6" /></div>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold uppercase tracking-wider mb-1">Faol Obyektlar</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white">{propertyCount} <span className="text-sm font-bold text-zinc-400">ta uylar</span></h3>
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <h3 className="text-xl font-black mb-6">So'nggi Tranzaksiyalar</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <th className="pb-4 pl-4 font-bold">Summa</th>
                <th className="pb-4 font-bold">Uy egasi / Ijarachi</th>
                <th className="pb-4 font-bold">Sana</th>
                <th className="pb-4 text-right pr-4 font-bold">Holati</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500">Hech qanday to'lov yo'q</td>
                </tr>
              ) : (
                recentPayments.map((p) => (
                  <tr key={p.id} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 pl-4 font-black">{p.amount.toLocaleString()} UZS</td>
                    <td className="py-4 text-zinc-500">
                      <div className="font-bold text-zinc-900 dark:text-zinc-300">{p.agreement.property.landlord.name || p.agreement.property.landlord.phone}</div>
                      <div className="text-xs">→ {p.agreement.tenant?.name || p.agreement.tenant?.phone || 'Biriktirilmagan'}</div>
                    </td>
                    <td className="py-4 text-zinc-500 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-4 text-right pr-4">
                      {p.status === 'PAID' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-bold"><CheckCircle className="w-3 h-3" /> To'langan</span>}
                      {p.status === 'PENDING' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-full text-xs font-bold"><Clock className="w-3 h-3" /> Kutilmoqda</span>}
                      {p.status === 'UNDER_REVIEW' && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-full text-xs font-bold"><Clock className="w-3 h-3 animate-pulse" /> Tekshiruvda</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
