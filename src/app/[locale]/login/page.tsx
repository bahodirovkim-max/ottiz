'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, LockKeyhole, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formattedPhone = '+998' + phone.replace(/\D/g, '');

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 9) {
       setError("Iltimos, telefon raqamini to'liq kiriting (9 xona)");
       return;
    }
    setLoading(true); setError('');
    
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });
      const data = await res.json();
      if (data.success) setStep('OTP');
      else setError(data.error || 'Noma\'lum xatolik');
    } catch (err) {
      setError('Tarmoq xatosi loglarni tekshiring');
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
        body: JSON.stringify({ phone: formattedPhone, code })
      });
      const data = await res.json();
      if (data.success) {
        if (data.hasProfile) {
          router.push('/uz/dashboard');
        } else {
          router.push('/uz/profile/setup');
        }
        router.refresh();
      } else {
        setError(data.error || 'Noto\'g\'ri kod kiritildi');
      }
    } catch (err) {
      setError('Tarmoq xatosi yuz berdi');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-[#0a0a0a] font-sans selection:bg-[#2AABEE]/30 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2AABEE]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center shadow-inner mb-6 ring-1 ring-zinc-100 dark:ring-zinc-700 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#2AABEE]/20 to-transparent rounded-3xl pointer-events-none"></div>
             {step === 'PHONE' ? <Smartphone className="w-8 h-8 text-[#2AABEE] relative z-10" /> : <LockKeyhole className="w-8 h-8 text-black dark:text-white relative z-10" />}
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {step === 'PHONE' ? 'Tizimga kirish' : 'Kodni tasdiqlash'}
          </h2>
          <p className="mt-3 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {step === 'PHONE' ? "Arenda boshqaruvchisiga xush kelibsiz" : <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" />Telefoningizga SMS kod yuborildi</span>}
          </p>
        </div>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold text-center dark:bg-rose-500/10 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-500/20">
            {error}
          </div>
        )}

        {step === 'PHONE' ? (
          <form className="mt-8 space-y-6" onSubmit={sendOtp}>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                Telefon raqamingiz
              </label>
              <div className="mt-2 flex rounded-2xl shadow-sm ring-1 ring-inset ring-zinc-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#2AABEE] dark:ring-zinc-700 dark:focus-within:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden transition-all h-14">
                <span className="flex select-none items-center pl-5 pr-3 text-zinc-400 dark:text-zinc-500 font-bold sm:text-base border-r border-zinc-200 dark:border-zinc-700 mr-2 bg-white dark:bg-zinc-800">
                  +998
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                     setPhone(val);
                  }}
                  className="block w-full border-0 bg-transparent py-4 pl-2 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:ring-0 sm:text-lg outline-none font-bold tracking-widest h-full"
                  placeholder="90 123 45 67"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 9}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2AABEE] hover:bg-[#1f8fc9] shadow-[0_4px_20px_rgba(42,171,238,0.3)] px-4 py-4.5 text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
            >
              {loading ? 'Tekshirilmoqda...' : <>SMS Kod Olish <ArrowRight className="w-5 h-5 flex-shrink-0" /></>}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-8" onSubmit={verifyOtp}>
            <div>
              <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 text-center">
                SMS tasdiqlash kodi
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full rounded-2xl border-0 py-4 px-4 text-zinc-900 shadow-inner ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-black sm:leading-6 dark:bg-zinc-800/80 dark:text-white dark:ring-zinc-700 dark:focus:ring-white transition-all outline-none text-center tracking-[0.5em] font-black text-3xl h-16"
                  placeholder="12345"
                  maxLength={5}
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 5}
              className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-4.5 text-base font-bold text-white shadow-[0_5px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_5px_20px_rgba(255,255,255,0.15)] hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
            >
              {loading ? 'Tasdiqlanmoqda...' : <>Dasturga Kirish <ArrowRight className="w-5 h-5 flex-shrink-0" /></>}
            </button>
            
            <p className="text-center text-xs text-zinc-500 mt-4 cursor-pointer hover:text-black dark:hover:text-white transition-colors" onClick={() => setStep('PHONE')}>
              Raqamni xato kiritdingizmi? Ortga qaytish
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
