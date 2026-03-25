import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PaymentActions } from '@/components/PaymentActions';
import { CheckCircle2, Clock, Sparkles, CreditCard, Receipt, Calendar } from 'lucide-react';

export default async function InvoicePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      agreement: {
        include: { tenant: true, property: { include: { landlord: true } } }
      }
    }
  });

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a]">
        <p className="text-zinc-500 font-medium">Kvitansiya topilmadi</p>
      </div>
    );
  }

  const isPaid = payment.status === 'PAID';

  const referenceDate = payment.paidAt || new Date();
  const d1 = new Date(referenceDate); d1.setHours(0,0,0,0);
  const d2 = new Date(payment.dueDate); d2.setHours(0,0,0,0);
  
  const hasDiscount = payment.paymentType === 'RENT' && payment.agreement.discountAmount && d1 <= d2;
  const finalAmount = hasDiscount && payment.agreement.discountAmount ? (payment.amount - payment.agreement.discountAmount) : payment.amount;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 sm:p-8 flex flex-col items-center justify-center font-sans tracking-tight selection:bg-[#2AABEE]/30">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 transition-all relative overflow-hidden">
        
        {/* Background glow based on status */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none ${isPaid ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>

        <div className="text-center mb-10 relative z-10">
           <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 relative shadow-sm ring-1 ring-inset ${isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 ring-emerald-100 dark:ring-emerald-500/20 text-emerald-500' : 'bg-rose-50 dark:bg-rose-500/10 ring-rose-100 dark:ring-rose-500/20 text-rose-500'}`}>
              <span className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${isPaid ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
              {isPaid ? <CheckCircle2 className="w-12 h-12" /> : <Clock className="w-12 h-12" />}
           </div>
           <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">
             {isPaid ? "To'lov qabul qilingan" : "To'lov kutilmoqda"}
           </h1>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium px-4">
             {isPaid ? "Rahmat! To'lovingiz tasdiqlangan va arxivlangan" : "Iltimos quyidagi to'lovni belgilangan muddatda amalga oshiring"}
           </p>
        </div>

        <div className="space-y-6 mb-10 relative z-10">
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> To'lov turi</span>
            <span className="text-zinc-900 dark:text-white font-bold px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] shadow-sm">
               {payment.title || (payment.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Oylik Ijara')}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Ijarachi</span>
            <span className="text-zinc-900 dark:text-white font-extrabold">{payment.agreement.tenant.name || payment.agreement.tenant.phone}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Eng so'nggi muddat</span>
            <span className={`px-3 py-1.5 rounded-lg font-bold shadow-sm ${isPaid ? "bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-white ring-1 ring-zinc-200 dark:ring-zinc-700" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-500/20"}`}>
              {payment.dueDate.toLocaleDateString()}
            </span>
          </div>

          {!isPaid && hasDiscount && (
             <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 my-4 shadow-sm">
                <p className="text-emerald-700 dark:text-emerald-400 text-sm font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                   <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Halol chegirma (Erta to'lov)</span>
                   <span className="whitespace-nowrap px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 rounded-md">-{payment.agreement.discountAmount?.toLocaleString()} UZS</span>
                </p>
             </div>
          )}
          {isPaid && hasDiscount && (
             <p className="text-emerald-600 dark:text-emerald-400 text-xs text-right font-bold mt-2 flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3" /> Avvalgi to'lovda chegirma qo'llanilgan.
             </p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4 gap-2 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">Jami to'lanadigan summa</span>
            <div className="text-right flex items-center gap-3">
              {hasDiscount && (
                 <span className="text-zinc-400 line-through text-sm font-semibold">{payment.amount.toLocaleString()}</span>
              )}
              <span className="text-black dark:text-white font-black text-3xl tracking-tight leading-none">{finalAmount.toLocaleString()} <span className="text-xl text-zinc-400 font-bold">{payment.currency}</span></span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {!isPaid && payment.status !== 'UNDER_REVIEW' && (
             <PaymentActions paymentId={payment.id} cardNumber={payment.agreement.property.landlord.cardNumber || ''} />
          )}
          
          {payment.status === 'UNDER_REVIEW' && (
             <div className="p-5 rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-500/20 flex flex-col items-center shadow-sm">
               <Clock className="w-8 h-8 mb-3 animate-pulse" />
               <span className="text-lg tracking-tight">Tasdiqlash kutilmoqda</span>
               <p className="text-xs font-medium opacity-80 mt-1.5">Uy egasi chekni ko'rib chiqyapti...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
