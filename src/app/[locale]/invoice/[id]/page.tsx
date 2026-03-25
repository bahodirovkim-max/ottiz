import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function InvoicePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      agreement: {
        include: { tenant: true, property: true }
      }
    }
  });

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a]">
        <p className="text-zinc-500">Kvitansiya topilmadi</p>
      </div>
    );
  }

  const isPaid = payment.status === 'PAID';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8 flex flex-col items-center justify-center font-sans tracking-tight">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900/40 p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 dark:border-zinc-800 transition-all">
        
        <div className="text-center mb-10">
           <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 relative ${isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}>
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 ${isPaid ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              {isPaid ? (
                 <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                 </svg>
              ) : (
                 <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
              )}
           </div>
           <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
             {isPaid ? "To'lov o'tgan" : "To'lov kutilmoqda"}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
             {isPaid ? "Rahmat! Ijarangiz to'langan" : "Ushbu oy uchun to'lovingizni amalga oshiring"}
           </p>
        </div>

        <div className="space-y-5 mb-10">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100/80 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Ijarachi</span>
            <span className="text-zinc-900 dark:text-white font-semibold">{payment.agreement.tenant.name || payment.agreement.tenant.phone}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100/80 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Mulk manzili</span>
            <span className="text-zinc-900 dark:text-white font-semibold text-right max-w-[150px] truncate">{payment.agreement.property.name}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100/80 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Eng so'ngi muddat</span>
            <span className={isPaid ? "text-zinc-900 dark:text-white font-bold" : "text-rose-600 dark:text-rose-400 font-bold"}>
              {payment.dueDate.toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">Jami summa</span>
            <span className="text-black dark:text-white font-bold text-2xl">{payment.amount.toLocaleString()} {payment.currency}</span>
          </div>
        </div>

        {!isPaid && (
          <div className="space-y-4">
            <button className="w-full py-4 bg-[#00AEEF] hover:bg-[#009bda] text-white rounded-2xl font-bold transition-all shadow-sm flex justify-center items-center gap-2 active:scale-[0.98]">
              Payme orqali to'lash
            </button>
            <button className="w-full py-4 bg-[#020b14] hover:bg-black text-[#00c853] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border dark:border-zinc-700 rounded-2xl font-bold transition-all shadow-sm flex justify-center items-center gap-2 active:scale-[0.98]">
              Click orqali to'lash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
