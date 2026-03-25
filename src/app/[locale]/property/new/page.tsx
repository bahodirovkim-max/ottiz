'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    tenantPhone: '+998'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/property/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        router.push('/uz/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Nomalum xatolik');
      }
    } catch (err) {
      setError('Server xatosi');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Yangi Mulk</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Ijaraga berilayotgan uy va mijoz ma'lumotlari</p>
        </div>
        <a href="/uz/dashboard" className="text-sm font-bold px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors block">
          &larr; Bekor qilish
        </a>
      </header>

      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-10 shadow-sm border border-zinc-100 dark:border-zinc-800">
        {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-semibold">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Mulk Nomi yoki Manzili</label>
             <input 
                type="text" 
                required
                placeholder="Masalan: Yunusobod 4-kvartara, 12-dom"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Oylik Ijara Narxi (UZS)</label>
             <input 
                type="number" 
                required
                placeholder="4000000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             />
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Ijarachining Telefon Raqami</label>
             <input 
                type="tel" 
                required
                placeholder="+998901234567"
                value={formData.tenantPhone}
                onChange={(e) => setFormData({...formData, tenantPhone: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             />
             <p className="text-xs text-zinc-500 mt-2">* Tizim avtomat ravishda shu raqam egasiga birinchi oylik to'lov kvitansiyasini (invoice) yaratadi.</p>
          </div>

          <div className="pt-6">
             <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-sm font-bold text-white bg-[#2AABEE] dark:text-white dark:bg-[#2AABEE] rounded-2xl hover:bg-[#1f8fc9] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
             >
                {loading ? 'Bazaga saqlanmoqda...' : 'Mulkni Qo\'shish'}
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}
