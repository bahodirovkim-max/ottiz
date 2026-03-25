'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, CreditCard, Send, CheckCircle2 } from 'lucide-react';

export function PaymentActions({ paymentId, cardNumber }: { paymentId: string, cardNumber: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    await fetch('/api/payments/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });
    router.refresh();
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (cardNumber) {
      navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  let displayCard = cardNumber || "Karta ulanmagan";
  if (cardNumber && cardNumber.length === 16) {
     displayCard = `**** **** **** ${cardNumber.slice(-4)}`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-2xl p-5 sm:p-6 text-left shadow-sm">
         <h4 className="font-extrabold text-sky-800 dark:text-sky-400 mb-4 flex items-center gap-2 text-base">To'lov qilish bo'yicha qo'llanma:</h4>
         <ol className="text-sm text-sky-700 dark:text-sky-300 space-y-3.5 font-bold leading-relaxed">
            <li className="flex items-start gap-2.5">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-500/30 flex items-center justify-center text-sky-800 dark:text-sky-200 text-xs">1</span> 
               Pastdagi uy egasi karta raqamini "Nusxalash" yozuvi orqali nusxalang.
            </li>
            <li className="flex items-start gap-2.5">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-500/30 flex items-center justify-center text-sky-800 dark:text-sky-200 text-xs">2</span> 
               Telefoningizdan Click, Payme yoki Uzum ilovasiga kirib shu kartaga pul o'tkazing.
            </li>
            <li className="flex items-start gap-2.5">
               <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 dark:bg-sky-500/30 flex items-center justify-center text-sky-800 dark:text-sky-200 text-xs">3</span> 
               Pul muvaffaqiyatli tushgach, ushbu sahifaga qaytib markaziy ko'k tugmani bosing.
            </li>
         </ol>
      </div>

      <div className="p-5 bg-white dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Uy egasi Karta Raqami
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-2xl sm:text-3xl tracking-[0.1em] sm:tracking-[0.15em] font-mono font-black text-black dark:text-white">
            {displayCard}
          </p>
          <button 
             onClick={copyToClipboard}
             disabled={!cardNumber}
             className={`flex items-center justify-center gap-2 text-sm w-full sm:w-auto px-6 py-3.5 rounded-xl transition-all font-bold shadow-md ${copied ? 'bg-emerald-500 text-white hover:bg-emerald-600 ring-4 ring-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600'} disabled:opacity-50`}
          >
            {copied ? <><CheckCircle2 className="w-4 h-4" /> Nusxalandi</> : <><Copy className="w-4 h-4" /> Nusxalash</>}
          </button>
        </div>
      </div>

      <button 
        disabled={loading || !cardNumber}
        onClick={handleReview}
        className="group relative flex items-center justify-center gap-2 w-full py-5 bg-[#2AABEE] hover:bg-[#1f8fc9] text-white rounded-2xl text-lg font-black transition-all shadow-[0_4px_20px_0_rgba(42,171,238,0.4)] hover:shadow-[0_6px_25px_rgba(42,171,238,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none uppercase tracking-wide"
      >
        {loading ? 'Yuborilmoqda...' : <><CheckCircle2 className="w-6 h-6 flex-shrink-0" /> To'lovni qildim, tasdiqlash</>}
      </button>
      
      <p className="text-sm text-center text-zinc-500 font-bold px-2 leading-relaxed opacity-80 mt-4 flex items-center justify-center gap-2">
         <Send className="w-4 h-4 flex-shrink-0" /> Bosilganda uy egasiga tasdiq jo'natiladi
      </p>
    </div>
  );
}
