'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, UserPlus, Phone, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function InviteLandlordPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    landlordPhone: '',
    propertyName: '',
    address: '',
    monthlyAmount: '',
    paymentDay: '1',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/property/ghost-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        // Muvaffaqiyatli jo'natildi
        router.push(`/${params.locale}/dashboard?view=tenant&invited=true`);
      } else {
        setError(data.error || 'Xatolik yuz berdi');
      }
    } catch (err) {
      setError('Server bilan ulanishda xato');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href={`/${params.locale}/dashboard?view=tenant`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-bold text-sm bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <ArrowLeft className="w-4 h-4" /> Orqaga
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2AABEE]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-[#2AABEE]/10 flex items-center justify-center text-[#2AABEE] shadow-inner border border-[#2AABEE]/20 relative z-10">
              <UserPlus className="w-8 h-8" />
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mt-1">Uy egasini taklif qilish</h1>
              <p className="text-zinc-500 font-medium text-sm mt-1">Ushbu forma orqali siz uy egangiz nomidan ijara obyektini yaratib, unga SMS taklifnoma jo'natasiz.</p>
            </div>
          </div>

          {error && (
            <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-sm font-bold text-center border border-rose-200 dark:border-rose-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-6">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <Phone className="w-5 h-5 text-zinc-400" /> Uy egasi ma'lumotlari
              </h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Telefon raqami</label>
                <div className="flex rounded-2xl shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden focus-within:ring-2 focus-within:ring-[#2AABEE] h-14">
                  <span className="flex select-none items-center pl-5 pr-3 text-zinc-400 font-bold border-r border-zinc-200 dark:border-zinc-700 mr-2 bg-white dark:bg-zinc-800">+998</span>
                  <input
                    type="tel"
                    required
                    maxLength={9}
                    placeholder="90 123 45 67"
                    className="block w-full border-0 bg-transparent py-4 px-2 text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600 font-bold tracking-widest outline-none h-full"
                    onChange={(e) => setFormData({...formData, landlordPhone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-2 font-medium">Ushbu raqamga SMS taklifnoma yuboriladi</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 mt-8">
                <Building2 className="w-5 h-5 text-zinc-400" /> Mulk va Shartnoma
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Mulk nomi</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: 3 xonali kvartira (Chilonzor)"
                    className="block w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 font-medium outline-none"
                    onChange={(e) => setFormData({...formData, propertyName: e.target.value})}
                  />
                </div>
                
                <div>
                   <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">To'lov kuni (Har oyning...)</label>
                   <select
                     required
                     className="block w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 font-bold outline-none cursor-pointer appearance-none"
                     onChange={(e) => setFormData({...formData, paymentDay: e.target.value})}
                     value={formData.paymentDay}
                   >
                     {[...Array(28)].map((_, i) => (
                       <option key={i+1} value={i+1}>{i+1}-sanasi</option>
                     ))}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Oylik ijara narxi (UZS)</label>
                <input
                  type="number"
                  required
                  placeholder="5000000"
                  className="block w-full rounded-2xl border-0 py-4 px-5 text-zinc-900 dark:text-white shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-[#2AABEE] bg-zinc-50 dark:bg-zinc-800/50 font-black text-xl outline-none tracking-wider"
                  onChange={(e) => setFormData({...formData, monthlyAmount: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || formData.landlordPhone.length !== 9}
                className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-zinc-900 dark:bg-white px-4 py-5 text-lg font-black text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Yaratilmoqda...' : <>Taklifnoma yuborish va Shartnoma tuzish <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
