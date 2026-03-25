'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PaymentActions({ paymentId, cardNumber }: { paymentId: string, cardNumber: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    if (cardNumber) navigator.clipboard.writeText(cardNumber);
    alert("Karta raqami nusxalandi!");
  };

  let displayCard = cardNumber || "Karta ulanmagan";
  if (cardNumber && cardNumber.length === 16) {
     displayCard = `**** **** **** ${cardNumber.slice(-4)}`;
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm text-zinc-500 mb-2">Uy egasining karta raqami:</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xl tracking-widest font-mono font-bold text-zinc-900 dark:text-white">
            {displayCard}
          </p>
          <button 
             onClick={copyToClipboard}
             className="text-xs w-full sm:w-auto bg-zinc-200 dark:bg-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all font-semibold"
          >
            Nusxalash
          </button>
        </div>
      </div>

      <button 
        disabled={loading || !cardNumber}
        onClick={handleReview}
        className="w-full py-4 bg-[#2AABEE] hover:bg-[#1f8fc9] text-white rounded-2xl font-bold transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Yuborilmoqda...' : 'To\'ladim, tasdiqqa jo\'natish'}
      </button>
      
      <p className="text-xs text-center text-zinc-500 mt-2">
         * Avval Karta nusxalanib bank orqali (Click/Payme) to'lanadi, so'ngra shu tugma bosiladi.
      </p>
    </div>
  );
}
