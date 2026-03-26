'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Banknote, CalendarCheck, ShieldCheck, Tag, Phone, PlusCircle, AlertTriangle } from 'lucide-react';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    tenantPhone: '+998',
    paymentDay: '1',
    deposit: '',
    discountAmount: '',
    durationMonths: '12'
  });

  const handleNumberInput = (field: string, value: string) => {
     const raw = value.replace(/\D/g, '');
     const formatted = raw ? Number(raw).toLocaleString('en-US') : '';
     setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: formData.price.replace(/,/g, ''),
        deposit: formData.deposit.replace(/,/g, ''),
        discountAmount: formData.discountAmount.replace(/,/g, '')
      };

      const res = await fetch('/api/property/create', {
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans selection:bg-[#2AABEE]/30 pb-24">
      <header className="mb-10 flex justify-between items-center max-w-xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <Home className="w-8 h-8 text-[#2AABEE]" /> Yangi Mulk
          </h1>
          <p className="text-sm mt-2 text-zinc-500 dark:text-zinc-400 font-medium">Ijaraga berilayotgan obyekt va mijoz tafsilotlari</p>
        </div>
        <a href="/uz/dashboard" className="hidden sm:flex items-center px-4 py-2.5 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white rounded-full text-sm font-bold shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> Bekor qilish
        </a>
      </header>

      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2AABEE]/5 rounded-full blur-[80px] pointer-events-none"></div>

        {error && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 flex items-center gap-3 text-sm font-bold shadow-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <Home className="w-4 h-4 text-zinc-400" /> Mulk Nomi yoki Manzili
             </label>
             <input 
                type="text" 
                required
                placeholder="Masalan: Yunusobod 4-kv, 12-dom"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-semibold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:text-zinc-400 placeholder:font-normal"
             />
          </div>

          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <Banknote className="w-4 h-4 text-zinc-400" /> Oylik Ijara Narxi (UZS)
             </label>
             <input 
                type="text" 
                inputMode="numeric"
                required
                placeholder="4,000,000"
                value={formData.price}
                onChange={(e) => handleNumberInput('price', e.target.value)}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:text-zinc-400 placeholder:font-normal text-lg tracking-wide"
             />
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
             <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                   <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                     <CalendarCheck className="w-4 h-4 text-zinc-400" /> Necha oyga?
                   </label>
                   <div className="relative">
                      <input 
                         type="number" 
                         min="1" max="120"
                         required
                         value={formData.durationMonths}
                         onChange={(e) => setFormData({...formData, durationMonths: e.target.value})}
                         className="w-full rounded-2xl border-0 py-4 px-5 pr-12 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all text-lg"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">oy</span>
                   </div>
                </div>
                <div className="flex-1">
                   <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                     <CalendarCheck className="w-4 h-4 text-zinc-400" /> To'lov sanasi
                   </label>
                   <div className="relative">
                      <input 
                         type="number" 
                         min="1" max="31"
                         required
                         value={formData.paymentDay}
                         onChange={(e) => setFormData({...formData, paymentDay: e.target.value})}
                         className="w-full rounded-2xl border-0 py-4 px-5 pr-14 text-zinc-900 font-bold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all text-lg"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">sana</span>
                   </div>
                </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                   <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
                     <ShieldCheck className="w-4 h-4 text-zinc-400" /> Zaklad (Ixtiyoriy)
                   </label>
                   <input 
                      type="text" 
                      inputMode="numeric"
                      placeholder="0"
                      value={formData.deposit}
                      onChange={(e) => handleNumberInput('deposit', e.target.value)}
                      className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-semibold shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:font-normal"
                   />
                </div>
                <div className="flex-1">
                   <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-emerald-400 mb-3 uppercase tracking-wider">
                     <Tag className="w-4 h-4 text-zinc-400 dark:text-emerald-500" /> Halol Chegirma
                   </label>
                   <input 
                      type="text" 
                      inputMode="numeric"
                      placeholder="0"
                      value={formData.discountAmount}
                      onChange={(e) => handleNumberInput('discountAmount', e.target.value)}
                      className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-semibold shadow-sm ring-1 ring-inset ring-emerald-200 focus:ring-2 focus:ring-inset focus:ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 dark:text-emerald-400 dark:ring-emerald-500/30 outline-none transition-all placeholder:font-normal text-emerald-700"
                   />
                </div>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed font-medium bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl">
               * Agar ijarachi belgilangan to'lov sanasidan oldin qarzni yopsa, tizim avtomatik ravishda Halol chegirma summasini hisobdan chegirib tashlaydi.
             </p>
          </div>

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
             <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-300 mb-3 uppercase tracking-wider">
               <Phone className="w-4 h-4 text-zinc-400" /> Ijarachining Raqami
             </label>
             <input 
                type="tel" 
                required
                placeholder="+998901234567"
                value={formData.tenantPhone}
                onChange={(e) => setFormData({...formData, tenantPhone: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 font-bold tracking-wide shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all placeholder:font-normal text-lg"
             />
             <p className="text-xs text-zinc-500 font-medium mt-3">* Tizim shu raqam egasiga shartnomani telegram orqali avtomatik yuboradi.</p>
          </div>

          <div className="pt-8">
             <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center w-full py-4.5 text-base font-bold text-white bg-black dark:bg-white dark:text-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_5px_20px_rgba(255,255,255,0.1)] gap-2"
             >
                {loading ? 'Bazaga yozilmoqda...' : <><PlusCircle className="w-5 h-5" /> Mulkni Bazaga Qo'shish</>}
             </button>
          </div>
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
