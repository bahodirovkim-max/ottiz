'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'LANDLORD'|'TENANT'>('LANDLORD');
  const [loading, setLoading] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role })
    });
    const data = await res.json();
    if(data.success) {
      if (role === 'LANDLORD') router.push('/uz/dashboard');
      else router.push('/uz/dashboard'); // For MVP, both go to same place
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Xush kelibsiz! 👋</h1>
          <p className="text-sm text-zinc-500 mt-2">Dasturdan qanday maqsadda foydalanasiz?</p>
        </div>

        <form onSubmit={saveProfile} className="space-y-8">
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => setRole('LANDLORD')}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${role === 'LANDLORD' ? 'border-[#2AABEE] bg-[#2AABEE]/5 dark:bg-[#2AABEE]/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
            >
              <div className="text-2xl mb-2">🏠</div>
              <div className="font-bold text-sm text-zinc-900 dark:text-white">Uy Egasi</div>
            </button>
            <button 
              type="button" 
              onClick={() => setRole('TENANT')}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${role === 'TENANT' ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
            >
              <div className="text-2xl mb-2">🔑</div>
              <div className="font-bold text-sm text-zinc-900 dark:text-white">Ijarachi</div>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-2">Ism va Familiya</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alisher Rustamov"
              className="w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-black dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 transition-all outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !name}
            className="w-full py-4 text-sm font-bold text-white bg-black dark:text-black dark:bg-white rounded-2xl hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Soniya...' : 'Tanlovni saqlash'}
          </button>
        </form>
      </div>
    </div>
  );
}
