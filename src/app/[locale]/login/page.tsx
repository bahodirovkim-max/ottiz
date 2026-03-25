'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.success) setStep('OTP');
      else setError(data.error || 'Noma`lum xatolik');
    } catch (err) {
      setError('Tarmoq xatosi');
    }
    setLoading(false);
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/uz/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Noto`g`ri kod');
      }
    } catch (err) {
      setError('Tarmoq xatosi');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-[#0a0a0a] font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tizimga kirish
          </h2>
          <p className="mt-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
            {step === 'PHONE' ? "Arenda boshqaruvchisiga xush kelibsiz" : "Telefoningizga SMS kod yuborildi"}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form className="mt-8 space-y-6" onSubmit={sendOtp}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                Telefon raqam
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:focus:ring-white transition-all outline-none"
                  placeholder="+998901234567"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-2xl bg-black px-4 py-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Kuting...' : 'Davom etish'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={verifyOtp}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                SMS tasdiqlash kodi
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full rounded-2xl border-0 py-3.5 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 dark:bg-zinc-800/50 dark:text-white dark:ring-zinc-700 dark:focus:ring-white transition-all outline-none text-center tracking-[0.5em] font-bold text-xl"
                  placeholder="12345"
                  maxLength={5}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-2xl bg-black px-4 py-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
