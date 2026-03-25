'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

  if (!agreementId) {
    return <div className="p-10 text-center text-zinc-500">Xatolik: Shartnoma ID topilmadi.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      const res = await fetch('/api/utility/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, agreementId })
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
      <div className="max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-[2rem] p-6 sm:p-10 shadow-sm border border-zinc-100 dark:border-zinc-800">
        {error && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Xizmat turi</label>
             <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             >
                <option value="Elektr Energiya (Svet)">Elektr Energiya (Svet)</option>
                <option value="Tabiiy Gaz">Tabiiy Gaz</option>
                <option value="Ichimlik Suvi">Ichimlik Suvi</option>
                <option value="Axlat (Musor) yig'ish">Axlat (Musor) yig'ish</option>
                <option value="Boshqa kommunal qarz">Boshqa xizmat qarz</option>
             </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">To'lov miqdori (UZS)</label>
             <input 
                type="number" 
                required
                placeholder="Misol: 75000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Ijarachi uchun so'ngi qarz muddati</label>
             <input 
                type="date" 
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-[#2AABEE] bg-white dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 outline-none transition-all"
             />
          </div>

          <div className="pt-6">
             <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-sm font-bold text-black bg-amber-400 rounded-2xl hover:bg-amber-500 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
             >
                {loading ? 'Yuborilmoqda...' : 'Kvitansiya Yuborish 💡'}
             </button>
          </div>
        </form>
      </div>
  );
}

export default function NewUtilityPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Kommunal Qarz Qo'shish</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Ijarachiga qoshimcha tolov cheki yuborildi</p>
        </div>
        <a href="/uz/dashboard" className="text-sm font-bold px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors block">
          &larr; Chiqish
        </a>
      </header>

      <Suspense fallback={<div className="text-zinc-500 text-center p-10">Yuklanmoqda...</div>}>
         <UtilityForm />
      </Suspense>
    </div>
  );
}
