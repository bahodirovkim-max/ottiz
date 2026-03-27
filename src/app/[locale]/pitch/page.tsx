'use client';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { ArrowLeft, Target, TrendingUp, Globe, Wallet, ChevronRight, Activity, ShieldCheck, Zap, XCircle, Building } from 'lucide-react';

const revenueData = [
  { year: '2026', mrr: 15 },
  { year: '2027', mrr: 65 },
  { year: '2028', mrr: 180 },
  { year: '2029', mrr: 450 },
  { year: '2030', mrr: 1200 },
];

const usersData = [
  { year: '2026', users: 15000, landlords: 3000 },
  { year: '2027', users: 75000, landlords: 15000 },
  { year: '2028', users: 200000, landlords: 40000 },
  { year: '2029', users: 600000, landlords: 120000 },
  { year: '2030', users: 1500000, landlords: 300000 },
];

export default function PitchDeck() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-amber-500/30">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/uz" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide uppercase">Ortga</span>
          </Link>
          <div className="px-4 py-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest rounded-full ring-1 ring-amber-200 dark:ring-amber-500/20">
            For Investors
          </div>
        </div>
      </nav>

      {/* Hero Slide */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center min-h-[80vh] flex flex-col justify-center items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black font-bold text-sm mb-8 z-10 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> Pitch Deck 2026
        </div>
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-6 z-10">
          Ijara bozorining <br />
          bilinmas <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Unikorni</span>.
        </h1>
        <p className="text-xl sm:text-3xl font-medium text-zinc-500 dark:text-zinc-400 max-w-3xl leading-snug z-10 mt-6">
          Biz nafaqat O'zbekiston, balki MDH davlatlaridagi yashirin qora ijara bozorini ochiq, qulay va inqilobiy FinTech platformasiga ko'chiryapmiz.
        </p>
      </section>

      {/* Market Problem & Solution */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-6">Nima uchun <span className="text-[#2AABEE]">RentPay?</span></h2>
            <div className="space-y-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-rose-500 border border-rose-100 dark:border-rose-500/20"><XCircle className="w-5 h-5" /></div>
                <div>
                   <h3 className="font-bold text-lg mb-1">Eskirgan va xavfli yuzma-yuz munosabat</h3>
                   <p className="text-zinc-500">MDHda ijaraning juda katta qismi hala ham "naqd pul" va kartadan-kartaga to'g'ridan to'g'ri ishonchsiz P2P ko'rinishida aylanadi. Muddatlar chalkashadi, soliq va xavfsizlik nazoratsiz.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-500 border border-amber-100 dark:border-amber-500/20"><Zap className="w-5 h-5" /></div>
                <div>
                   <h3 className="font-bold text-lg mb-1">Jarima va penyadan qochish xohishi</h3>
                   <p className="text-zinc-500">Ijarachilar "Riba" deb qaraladigan penyalardan qochishadi, uy egalari esa pulini vaqtida undirolmaydi.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20"><ShieldCheck className="w-5 h-5" /></div>
                <div>
                   <h3 className="font-bold text-lg mb-1">RentPay Yechimi: Trust Score & Halol Chegirma</h3>
                   <p className="text-zinc-500">O'zbek bozoriga 100% tushadigan "Halol Chegirma" orqali pulni ertaroq yig'ib olish mexanikasi va ikkala tomonni himoya qiladigan avtomatlashtirilgan kvitansiya (ledger) tizimi yozildi.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl relative border border-zinc-100 dark:border-zinc-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-bl-[100px] -z-10 blur-xl"></div>
             <div className="text-center mb-10">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-600 mb-2">$1,2 mlrd+</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">O'zbekiston P2P Ijara Bozori (TAM)</div>
             </div>
             <div className="text-center mb-10">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#2AABEE] to-emerald-500 mb-2">$240 mln</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Mobil ilovalarga O'tish ehtimoli bor hajm (SAM)</div>
             </div>
             <div className="text-center">
                <div className="text-3xl font-black text-zinc-900 dark:text-white mb-2">$15 mln+</div>
                <div className="text-sm font-bold text-zinc-500 uppercase tracking-wider">3-Yillik Real Maqsadli Daromad (SOM)</div>
             </div>
          </div>
        </div>
      </section>

      {/* Monetization Strategy */}
      <section className="py-24 px-6 bg-zinc-900 text-white border-y border-zinc-800 relative z-0">
         <div className="absolute inset-0 bg-[#2AABEE]/5 w-full h-full pattern-grid-lg opacity-50 -z-10"></div>
         <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-16 text-center">Pul qanday ishlanadi? <span className="text-amber-400">(Monetizatsiya)</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-zinc-800/40 rounded-[2rem] p-8 border border-zinc-700/50 backdrop-blur-xl">
                  <div className="w-14 h-14 bg-[#2AABEE]/10 rounded-2xl flex items-center justify-center text-[#2AABEE] mb-6"><Target className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-3">B2C Premium Subscriptions</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Uy egalari bitta mulkini tizimga tekin ulab nazorat qiladi. 2 ta va undan ko'p xonadon vakillari va maklerlar uchun oylik tarif.
                  </p>
                  <div className="text-2xl font-black text-white">49,000 UZS <span className="text-sm font-medium text-zinc-500">/oylik</span></div>
               </div>

               <div className="bg-zinc-800/40 rounded-[2rem] p-8 border border-zinc-700/50 backdrop-blur-xl">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6"><Wallet className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-3">Tranzaksiya Komissiyalari</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Bank ekvayringi va mahalliy to'lov agregatorlari bilan API integratsiya orqali "Avto-to'lov" funksiyasi yoqilganda P2P pul o'tkazmalaridan daromad.
                  </p>
                  <div className="text-2xl font-black text-emerald-400">0.5% - 1% <span className="text-sm font-medium text-zinc-500">/tushumdan</span></div>
               </div>

               <div className="bg-zinc-800/40 rounded-[2rem] p-8 border border-zinc-700/50 backdrop-blur-xl">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6"><Activity className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-3">Kommunal & API Xizmatlari</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Svet, gaz idoralariga billur tizimi yordamida to'lov qilinganda vositachilik komissiyasi (Uztelecom/Hududgaz).
                  </p>
                  <div className="text-2xl font-black text-purple-400">+1.0% <span className="text-sm font-medium text-zinc-500">/xizmat</span></div>
               </div>

               <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[2rem] p-8 border border-amber-500/30 backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-6"><Building className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">RentPay Business <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] uppercase rounded-full tracking-wider">Premium</span></h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium">
                    (Yandex Arenda analogi). Uy egalari uyni 100% bizning agentlikka ishonib topshiradi. Biz ijarachini topamiz, sug'urta qilamiz va to'lovni kafolatlaymiz. O'ta yuqori marja.
                  </p>
                  <div className="text-2xl font-black text-amber-400">7-10% <span className="text-sm font-medium text-zinc-400">/oylik summadan</span></div>
               </div>
            </div>
         </div>
      </section>

      {/* 5-Year Roadmap & Projections */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-16 text-center text-zinc-900 dark:text-white">5 yillik <span className="text-emerald-500">Maqsadlar va Strategiya</span></h2>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Projected MRR Inflow (Ming USD)</h3>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="year" axisLine={false} tickLine={false} className="text-xs font-bold" />
                   <YAxis axisLine={false} tickLine={false} className="text-xs font-bold font-mono" />
                   <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                   <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
             <p className="text-xs font-medium text-zinc-500 text-center mt-6">Optimistic 5-year Monthly Recurring Revenue (MRR) tracking trajectory based on user adoption phase.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-[#2AABEE]" /> Foydalanuvchilar o'sishi (Kishilar)</h3>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={usersData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                   <XAxis dataKey="year" axisLine={false} tickLine={false} className="text-xs font-bold" />
                   <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                   <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                   <Bar dataKey="users" name="Ijarachilar" fill="#2AABEE" radius={[6, 6, 0, 0]} />
                   <Bar dataKey="landlords" name="Uy egalari" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <p className="text-xs font-medium text-zinc-500 text-center mt-6">Target: Converting 15% of the total unregistered rental market into verified platform users.</p>
          </div>
        </div>

        {/* Timeline Expansion */}
        <div className="relative">
           <div className="absolute left-4 sm:left-1/2 w-0.5 h-full bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2 hidden sm:block"></div>
           
           <div className="space-y-12 relative">
             <div className="flex flex-col sm:flex-row items-center justify-between w-full relative sm:even:flex-row-reverse group">
                <div className="w-full sm:w-5/12 sm:text-right pr-0 sm:pr-8 pb-4 sm:pb-0">
                   <div className="text-[#2AABEE] font-black text-2xl mb-1">2026 - Mahalliy Bozor</div>
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Toshkent Bozori Domineysheni</h3>
                   <p className="text-zinc-500 leading-relaxed text-sm">RentPay MVP 1.0 ishga tushirilishi. Toshkent shahridagi minglab ijara obyektlarini "Trust Score" tizimiga integratsiyalash. Telegram Mini App orqali onbordingni pikkacho'qqiga chiqarish.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-[#2AABEE] shadow-[0_0_15px_rgba(42,171,238,0.3)] z-10 absolute left-4 sm:left-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform"></div>
                <div className="w-full sm:w-5/12 pl-12 sm:pl-8"></div>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-between w-full relative sm:flex-row-reverse group">
                <div className="w-full sm:w-5/12 sm:text-left pl-12 sm:pl-8 pb-4 sm:pb-0">
                   <div className="text-emerald-500 font-black text-2xl mb-1">2027-2028 - MDH Bozoriga</div>
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Qozog'iston & Qirg'iziston Integratsiyasi</h3>
                   <p className="text-zinc-500 leading-relaxed text-sm">Olmota va Astana poytaxt bozoridagi elita ijara sistemalarini kiritish, Qozog'iston banklari (Kaspi, Halyk) bilan Open API ekvayring qilish. Davlat soliqlari bilan to'g'ridan-to'g'ri hisobot marshruti shakllantirish.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10 absolute left-4 sm:left-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform"></div>
                <div className="w-full sm:w-5/12 pr-0 sm:pr-8"></div>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-between w-full relative group">
                <div className="w-full sm:w-5/12 sm:text-right pl-12 sm:pr-8 pb-4 sm:pb-0">
                   <div className="text-purple-500 font-black text-2xl mb-1">2029+ Global Scale</div>
                   <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Tokenizatsiya & Broker Agregator</h3>
                   <p className="text-zinc-500 leading-relaxed text-sm">AI yordamida har bir hududning dinamik narxlash (Dynamic Pricing) datchigini yoqish. Katta agentlik obyektlarini yagona blokcheyn ko'chmas mulk reestriga aylantirish va aqlli shartnomalar.</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] z-10 absolute left-4 sm:left-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform"></div>
                <div className="w-full sm:w-5/12"></div>
             </div>
           </div>
        </div>
      </section>

      <footer className="py-24 text-center bg-zinc-900 text-white mt-10">
         <h2 className="text-3xl sm:text-5xl font-black mb-8 px-6">Biz bilan bu marralarni zabt eting.</h2>
         <Link href="/uz/login" className="inline-flex items-center gap-2 px-10 py-5 bg-amber-400 text-black rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_40px_rgba(251,191,36,0.3)]">
            Platformani Test Qilish <ChevronRight className="w-6 h-6" />
         </Link>
      </footer>
    </div>
  );
}
