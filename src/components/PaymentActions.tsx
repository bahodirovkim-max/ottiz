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
    <div className="space-y-4">
      <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 shadow-inner">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Uy egasining karta raqami
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-2xl tracking-[0.2em] font-mono font-extrabold text-zinc-900 dark:text-white">
            {displayCard}
          </p>
          <button 
             onClick={copyToClipboard}
             disabled={!cardNumber}
             className={`flex justify-center items-center gap-2 text-xs w-full sm:w-auto px-5 py-3 rounded-xl transition-all font-bold shadow-sm ${copied ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/30' : 'bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600 ring-1 ring-zinc-200 dark:ring-zinc-600'} disabled:opacity-50`}
          >
            {copied ? <><CheckCircle2 className="w-4 h-4" /> Nusxalandi</> : <><Copy className="w-4 h-4 text-zinc-400" /> Nusxalash</>}
          </button>
        </div>
      </div>

      <button 
        disabled={loading || !cardNumber}
        onClick={handleReview}
        className="group relative flex items-center justify-center gap-2 w-full py-4.5 bg-[#2AABEE] hover:bg-[#1f8fc9] text-white rounded-2xl text-base font-extrabold transition-all shadow-[0_4px_14px_0_rgba(42,171,238,0.3)] hover:shadow-[0_6px_20px_rgba(42,171,238,0.23)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
      >
        {loading ? 'Yuborilmoqda...' : <><CheckCircle2 className="w-5 h-5 flex-shrink-0" /> To'lov qildim, tasdiqqa yuborish</>}
      </button>
      
      <p className="text-xs text-center text-zinc-500 font-medium px-2 leading-relaxed opacity-80 mt-3 flex items-center justify-center gap-1.5">
         <Send className="w-3.5 h-3.5 flex-shrink-0" /> Markaziy tizimga so'rov yuboriladi
      </p>
    </div>
  );
}
