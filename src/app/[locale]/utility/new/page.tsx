'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lightbulb, Zap, Droplets, Trash2, Receipt, FilePlus, AlertCircle } from 'lucide-react';

function UtilityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agreementId = searchParams.get('agreementId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'Elektr Energiya (Svet)',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleNumberInput = (value: string) => {
     const raw = value.replace(/\D/g, '');
     const formatted = raw ? Number(raw).toLocaleString('en-US') : '';
     setFormData(prev => ({ ...prev, amount: formatted }));
  };

  if (!agreementId) {
    return <div className="p-10 text-center text-zinc-500 font-bold bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">Xatolik: Shartnoma ID topilmadi. Ortga qayting.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      const payload = {
        ...formData,
        amount: formData.amount.replace(/,/g, ''),
        agreementId
      };

      const res = await fetch('/api/utility/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/uz/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Noma\'lum xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan aloqada xatolik');
    }
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
     if (type.includes('Svet')) return <Zap className="w-4 h-4 text-zinc-400" />;
     if (type.includes('Gaz')) return <Lightbulb className="w-4 h-4 text-zinc-400" />;
     if (type.includes('Suvi')) return <Droplets className="w-4 h-4 text-zinc-400" />;
     if (type.includes('Axlat')) return <Trash2 className="w-4 h-4 text-zinc-400" />;
     return <Receipt className="w-4 h-4 text-zinc-400" />;
  }

  return (
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        {error && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 flex items-center gap-3 text-sm font-bold shadow-sm relative z-10">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               {getTypeIcon(formData.type)} Xizmat turi
             </label>
             <div className="relative">
                <select 
                   value={formData.type}
                   onChange={(e) => setFormData({...formData, type: e.target.value})}
                   className="w-full appearance-none rounded-2xl border-0 py-4 px-5 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-amber-400 bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all cursor-pointer text-lg"
                >
                   <option value="Elektr Energiya (Svet)">Elektr Energiya (Svet)</option>
                   <option value="Tabiiy Gaz">Tabiiy Gaz</option>
                   <option value="Ichimlik Suvi">Ichimlik Suvi</option>
                   <option value="Axlat (Musor) yig'ish">Axlat (Musor) yig'ish</option>
                   <option value="Boshqa kommunal qarz">Boshqa xizmat qarz</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
             </div>
          </div>

          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <Receipt className="w-4 h-4 text-zinc-400" /> To'lov miqdori (UZS)
             </label>
             <input 
                type="text" 
                inputMode="numeric"
                required
                placeholder="Misol: 75,000"
                value={formData.amount}
                onChange={(e) => handleNumberInput(e.target.value)}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-extrabold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-amber-400 bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:text-zinc-400 placeholder:font-normal tracking-wide text-xl"
             />
          </div>

          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <CalendarCheck className="w-4 h-4 text-zinc-400" /> Kvitansiyaning so'nggi muddati
             </label>
             <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-amber-400 bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all text-lg cursor-text"
             />
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
             <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4.5 text-base font-extrabold text-black bg-amber-400 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_14px_0_rgba(251,191,36,0.2)] disabled:opacity-50 disabled:hover:scale-100"
             >
                {loading ? 'Yuborilmoqda...' : <><FilePlus className="w-5 h-5 flex-shrink-0" /> Ijarachiga Kvitansiya Yuborish</>}
             </button>
             <p className="text-xs text-center text-zinc-500 mt-4 font-medium px-4 leading-relaxed">Pugcha bosilganda ijarachining kvitansiyalar panelida alohida kommunal to'lov chiqadi.</p>
          </div>
        </form>
      </div>
  );
}

import { CalendarCheck } from 'lucide-react';

export default function NewUtilityPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans pb-24 selection:bg-[#2AABEE]/30">
      <header className="mb-10 flex justify-between items-center max-w-xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
             <Zap className="w-8 h-8 text-amber-400" /> Kommunal Qarz
          </h1>
          <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400 font-medium">Ijarachiga qo'shimcha to'lov cheki yuborish</p>
        </div>
        <a href="/uz/dashboard" className="hidden sm:flex items-center px-4 py-2.5 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white rounded-full text-sm font-bold shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Bekor qilish
        </a>
      </header>

      <Suspense fallback={<div className="flex items-center justify-center h-40 text-zinc-500 font-bold bg-white dark:bg-zinc-900 rounded-[2.5rem] max-w-xl mx-auto">Yuklanmoqda...</div>}>
         <UtilityForm />
      </Suspense>

      {/* Mobile Back Button */}
      <div className="sm:hidden fixed bottom-6 left-6 right-6 z-50">
         <a href="/uz/dashboard" className="flex items-center justify-center w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold shadow-lg active:scale-95 transition-transform ring-1 ring-zinc-700">
            <ArrowLeft className="w-5 h-5 mr-2" /> Orqaga qaytish
         </a>
      </div>
    </div>
  );
}
