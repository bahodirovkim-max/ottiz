import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] font-sans selection:bg-[#2AABEE]/30">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2AABEE] flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(42,171,238,0.5)]">R</div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">RentPay</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/uz/pitch" className="hidden sm:flex items-center text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-full ring-1 ring-amber-200 dark:ring-amber-500/20">
              <span className="animate-bounce">🚀</span> Pitch Deck
            </Link>
            <Link href="/uz/login" className="hidden sm:block text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">
              Tizimga kirish
            </Link>
            <Link href="/uz/login" className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-transform">
              Boshlash &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:pt-48 sm:pb-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2AABEE]/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-300 mb-8 mt-4 hover:border-[#2AABEE] transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-[#2AABEE] animate-pulse"></span>
            O'rta Osiyo va O'zbekiston uchun moslashgan
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1] mb-8">
            Uy ijarasini boshqarishning <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2AABEE] to-emerald-500">eng shaffof va halol</span> usuli.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ijarachilar va uy egalari o'rtasidagi to'lovlarni P2P vositasiz marshrut orqali raqamlashtiring. Penya emas, <strong>100% Halol Chegirma</strong> mexanikasi asosida ziddiyatlarsiz yashang!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/uz/login" className="w-full sm:w-auto px-8 py-4 bg-[#2AABEE] hover:bg-[#1f8fc9] text-white rounded-full text-base font-bold shadow-[0_0_20px_rgba(42,171,238,0.3)] hover:scale-105 transition-all">
              Hozir bepul o'tib ko'rish
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-base font-bold transition-all">
              Qanday ishlaydi?
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-zinc-200 dark:divide-zinc-800/50">
          <div className="border-t-0 pl-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#2AABEE]">0%</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-2">Vositachi Komissiya (P2P)</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-500">100%</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-2">Halol chegirma mantiqi</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">Tg</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-2">Mini App formatiga mos</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500">1+</div>
            <div className="text-xs sm:text-sm font-medium text-zinc-500 mt-2">Daqiqada Onbording</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 px-6 max-w-6xl mx-auto">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">Inqilobiy model ustiga qurilgan xavfsiz boshqaruv</h2>
          <p className="mt-4 text-lg text-zinc-500">Eskicha ijara daftariga nosharaf yoziladigan qarzlar va foizlardan voz keching. Dastur to'g'ridan to'g'ri bank aqlingizga tushadi.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-10 border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-6 ring-1 ring-zinc-200 dark:ring-zinc-700">🤝</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">0% Komissiya, Toza P2P</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">Biz foydalanuvchi ko'payguncha pullaringizdan foiz ushlab qolmaymiz. Ijarachi kvitansiyada ko'ringan Karta raqamga Paymedan tushiradi va tasdig'ini bosadi.</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-10 border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 ring-1 ring-emerald-200 dark:ring-emerald-500/20">🕋</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Islomiy Halol Mexanika</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">Zarracha "Riba" xavfidan qochish uchun penya umuman yo'q! Uning o'rniga muddatida to'laganga "Chegirma berish" kabi mustahkam motivatsiya tizimi ishlaydi.</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 sm:p-10 border border-zinc-100 dark:border-zinc-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-none hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-2xl mb-6 ring-1 ring-amber-200 dark:ring-amber-500/20">⭐</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Trust Score (Reyting)</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">Har bir ijara to'lovida firibgarlik yo'qligi va intizomli to'lov qaytarilishini ta'minlash maqsadida xar bir foydalanuvchida 100 balli ishonch yulduzi mavjud.</p>
          </div>
        </div>
      </section>

      {/* Dual Role Section */}
      <section className="py-24 sm:py-32 bg-black text-white px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 mb-6 font-mono uppercase tracking-wider">
              Super-Akkount Arxitersurasi
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Ham Ijarachi.<br />Ham Uy egasi.
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed font-medium">
              RentPay'ning aqlli "Tab Switcher" mexanizmi orqali bitta akkauntdan ham o'zingiz ijaraga olgan uylaringizni to'laysiz, ham o'zingiz boshqalarga topshirgan ob'yektlardan ijara qabul qilasiz. Shunchaki tepadan rol tanlaysiz bo'ldi!
            </p>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 text-zinc-300">
                <div className="w-8 h-8 rounded-full bg-[#2AABEE]/20 flex items-center justify-center text-[#2AABEE] text-sm">1</div>
                Oylik Invoice & Kvitansiyalar generatsiyasi
              </li>
              <li className="flex items-center gap-4 text-zinc-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">2</div>
                Kommunal qarzlar (Svet, Gaz, Issiqlik) modullari
              </li>
              <li className="flex items-center gap-4 text-zinc-300">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">3</div>
                To'lovlar arxiv daftari (History Ledger)
              </li>
            </ul>
          </div>
          
          <div className="relative z-10 mt-10 md:mt-0 perspective-1000">
             <div className="absolute inset-0 bg-[#2AABEE]/20 w-full h-full rounded-full blur-[100px] pointer-events-none"></div>
             <div className="bg-zinc-900 border border-zinc-700/50 rounded-[2.5rem] p-6 sm:p-8 relative shadow-2xl rotate-y-[5deg] hover:rotate-y-0 transition-transform duration-700 ring-1 ring-white/10">
                <div className="flex gap-2 mb-8 bg-black/60 p-1.5 rounded-2xl border border-zinc-800 w-fit mx-auto relative overflow-hidden backdrop-blur-xl">
                   <div className="px-5 py-2.5 bg-zinc-800 text-white rounded-[14px] text-xs sm:text-sm font-bold shadow-sm cursor-pointer relative z-10">🏠 Uy Egasi sifatida</div>
                   <div className="px-5 py-2.5 text-zinc-500 rounded-[14px] text-xs sm:text-sm font-bold cursor-pointer hover:text-zinc-300 transition-colors relative z-10">🔑 Ijarachi sifatida</div>
                </div>
                
                <div className="space-y-4">
                   <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 p-5 flex justify-between items-center group hover:bg-zinc-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl">🏢</div>
                        <div>
                          <div className="w-24 h-4 bg-zinc-700 rounded-md mb-2 group-hover:bg-zinc-600 transition-colors"></div>
                          <div className="w-32 h-3 bg-zinc-800 rounded-md"></div>
                        </div>
                      </div>
                      <div className="w-9 h-9 border-2 border-[#2AABEE] text-[#2AABEE] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(42,171,238,0.3)]">✓</div>
                   </div>
                   <div className="bg-zinc-800/60 rounded-2xl border border-zinc-700/50 p-5 flex justify-between items-center group hover:bg-zinc-800 transition-colors opacity-60">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-xl">💡</div>
                        <div>
                          <div className="w-24 h-4 bg-zinc-700 rounded-md mb-2"></div>
                          <div className="w-32 h-3 bg-zinc-800 rounded-md"></div>
                        </div>
                      </div>
                      <div className="w-9 h-9 border-2 border-zinc-700 text-zinc-500 rounded-full flex items-center justify-center text-xs font-bold">⏳</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="py-24 sm:py-32 px-6 text-center border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-[#0a0a0a]">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">Investitsion qadam tashlash vaqti keldi.</h2>
        <p className="text-lg text-zinc-500 mb-10 max-w-xl mx-auto">Vercel va PostgreSQL orqali qurilgan MVP holatidagi jonli platformada har qanday stress testlarni o'tkazib ko'rishingiz kafolatlanadi.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link href="/uz/login" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 bg-black text-white dark:bg-white dark:text-black rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
             Tizimga kirish <span className="text-xl">&rarr;</span>
           </Link>
           <Link href="/uz/pitch" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 bg-amber-400 text-black rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_10px_40px_rgba(251,191,36,0.2)]">
             <span className="text-xl">📊</span> Investor Pitch
           </Link>
        </div>
        <div className="mt-20 text-zinc-400 font-medium text-xs sm:text-sm">
           © 2026 RentPay SaaS. MFY, Bozor va Halol biznes mantiqlari bilan sug'orilgan platforma.
        </div>
      </footer>
    </div>
  );
}
