'use client';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { ArrowLeft, Target, TrendingUp, Globe, Wallet, ChevronRight, Activity, ShieldCheck, Zap, XCircle, Building, Key, CheckCircle, Wrench } from 'lucide-react';

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

      {/* RENTPAY BUSINESS DEEP DIVE SECTION */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
           <div className="flex flex-col items-center text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-widest mb-6 ring-1 ring-amber-200 dark:ring-amber-500/30">
                Premium Extension
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-6">RentPay <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Business</span></h2>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
                Platformamizning ikkinchi biznes modeli. Xuddi **Yandex Arenda** yoki **ZappyRent (Italiya)** kabi uyni 100% boshqaruvga olish, kafolatli to'lov va to'liq servis taqdim etish.
              </p>
           </div>

           <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 sm:p-12 shadow-2xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] -z-10 group-hover:bg-amber-400/20 transition-colors"></div>
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-amber-500" /> Uy Egasi uchun qulaylik (Landlord)</h3>
                 <ul className="space-y-6">
                   <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4" /></div>
                     <div>
                       <strong className="block text-zinc-900 dark:text-white mb-1">To'lovlar Kafolati (Guaranteed Rent)</strong>
                       <span className="text-zinc-500 text-sm">Bizning eng kuchli qurolimiz. Agar ijarachi pul to'lamasa yoki uydan chiqmasa ham, RentPay Biznes Sug'urta fondi uy egasiga har oyning qat'iy sanasida o'z yonidan pul tashlab beradi.</span>
                     </div>
                   </li>
                   <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4" /></div>
                     <div>
                       <strong className="block text-zinc-900 dark:text-white mb-1">Mol-mulk Monitoringi</strong>
                       <span className="text-zinc-500 text-sm">Biz uyni professional 3D rasmga olamiz, kalitlarni o'zimiz topshiramiz. Har oy yoki chorakda uyning jismoniy holati (sostoyaniyasi) bo'yicha vizual hisobot beramiz.</span>
                     </div>
                   </li>
                   <li className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5"><CheckCircle className="w-4 h-4" /></div>
                     <div>
                       <strong className="block text-zinc-900 dark:text-white mb-1">100% Passiv Daromad</strong>
                       <span className="text-zinc-500 text-sm">Uy egasi umuman uchrashuvga bormaydi. Telefon qilib asabiylashmaydi. Hammasi elektron smart-kontrakt orqali xuddi bank depoziti yechish kabi passiv kechadi.</span>
                     </div>
                   </li>
                 </ul>
              </div>

              <div className="space-y-6">
                 <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex gap-6 hover:border-amber-500/50 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 text-amber-500 border border-amber-100 dark:border-amber-500/20">
                      <Wrench className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Qo'shimcha Xizmatlar (Cross-Sell)</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-4">Ijarachilar to'g'ridan-to'g'ri ilova orqali "Klining" (haftalik/oylik uyni tozalash), Santexnik yoki Elektrik chaqira oladi. Bu xizmatlardan olinadigan marginlar bizga sof foyda (upselling) keltirib beradi.</p>
                      <div className="inline-flex text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full">+15% Qo'shimcha Sof Daromad</div>
                    </div>
                 </div>

                 <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm flex gap-6 hover:border-[#2AABEE]/50 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center flex-shrink-0 text-[#2AABEE] border border-sky-100 dark:border-sky-500/20">
                      <Key className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Ijarachi uchun Mehmonxona darajasi</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-4">Trendlar shuni ko'rsatmoqdaki, zamonaviy yoshlar (Gen-Z) o'ziga uy xarid qilishdan ko'ra nufuzli Premium Co-Living uylarda qimmatroq ijara evaziga yashashni afzal ko'rmoqda. Biz ularni ayni janjalsiz, sifatli va "Mehmonxona darajasi"dagi servis bilan qamrab olamiz.</p>
                      <div className="inline-flex text-xs font-bold text-[#2AABEE] bg-sky-50 dark:bg-sky-500/10 px-3 py-1 rounded-full">Global Co-Living Trend yechimi</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3rem] p-10 sm:p-14 text-white relative overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.3)]">
              <div className="absolute inset-0 bg-black/10 opacity-40"></div>
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                 <div>
                    <h3 className="text-3xl sm:text-4xl font-black mb-4">RentPay Business Modeli Moliyasi</h3>
                    <p className="text-amber-100/80 text-lg mb-6 leading-relaxed">Agentlar, brokelar va maklerlarni to'liq siqib chiqarish orqali yuqori daromadli ekotizim o'rnatamiz.</p>
                    <div className="flex flex-wrap gap-4">
                       <span className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/10">1 To'lov Tizimi</span>
                       <span className="px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-sm font-bold border border-white/10">Makler Komissiyasi 0%</span>
                    </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20">
                    <div className="flex items-end justify-between mb-4 border-b border-white/10 pb-4">
                       <span className="text-amber-100 font-medium">Boshqaruv Komissiyasi:</span>
                       <span className="text-2xl font-black">7% - 15% / Oylik</span>
                    </div>
                    <div className="flex items-end justify-between mb-4 border-b border-white/10 pb-4">
                       <span className="text-amber-100 font-medium">LTV (Mijozning yashash muddati):</span>
                       <span className="text-xl font-bold">+40% (x1.4 LTV) oshish</span>
                    </div>
                    <div className="flex items-end justify-between">
                       <span className="text-amber-100 font-medium">Sof Oylik Daromad strategiyasi:</span>
                       <span className="text-xl font-bold text-emerald-300">Ijara bozorining ~15% ini egallash</span>
                    </div>
                 </div>
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
