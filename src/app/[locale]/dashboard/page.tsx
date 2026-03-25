import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({
    where: { id: token },
    include: {
      properties: {
        include: { agreements: { include: { tenant: true, payments: true } } }
      },
      agreements: {
        include: { property: { include: { landlord: true } }, payments: true }
      }
    }
  });

  if (!user) redirect('/uz/login');

  // LANDLORD LOGIC
  let upcomingTotal = 0;
  let receivedTotal = 0;
  let lateTenants = 0;

  const currentMonth = new Date().getMonth();
  const allAgreements = user.properties.flatMap((p: any) => p.agreements);
  
  const formattedTenants = allAgreements.filter((a: any) => a.status !== 'REJECTED' && a.status !== 'ENDED').map((agreement: any) => {
    const currentPayment = agreement.payments.find((p: any) => p.dueDate.getMonth() === currentMonth);
    const amount = currentPayment ? currentPayment.amount : agreement.monthlyAmount;
    
    if (currentPayment?.status === 'PAID') {
      receivedTotal += amount;
    } else if (currentPayment) {
      upcomingTotal += amount;
      if (currentPayment.dueDate < new Date()) {
         lateTenants++;
      }
    }

    return {
      id: agreement.tenant.id,
      agreementId: agreement.id,
      paymentId: currentPayment?.id,
      trustScore: agreement.tenant.trustScore,
      name: agreement.tenant.name || agreement.tenant.phone,
      phone: agreement.tenant.phone,
      property: user.properties.find((p: any) => p.id === agreement.propertyId)?.name,
      amount: amount,
      dueDate: currentPayment?.dueDate.toLocaleDateString() || agreement.startDate.toLocaleDateString(),
      status: agreement.status === 'PENDING' ? 'AGREEMENT_PENDING' : (currentPayment?.status || 'PENDING')
    };
  });

  // SERVER ACTIONS
  async function acceptPayment(formData: FormData) {
    'use server';
    const paymentId = formData.get('paymentId') as string;
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'PAID', paidAt: new Date() }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  async function endAgreement(formData: FormData) {
    'use server';
    const agreementId = formData.get('agreementId') as string;
    await prisma.rentAgreement.update({
       where: { id: agreementId },
       data: { status: 'ENDED', isActive: false, endDate: new Date() }
    });
    revalidatePath('/uz/dashboard');
  }

  // TENANT SERVER ACTIONS
  async function confirmRentAgreement(formData: FormData) {
    'use server';
    const agreementId = formData.get('agreementId') as string;
    const agreement = await prisma.rentAgreement.findUnique({ where: { id: agreementId } });
    
    if (agreement && agreement.status === 'PENDING') {
      await prisma.rentAgreement.update({
        where: { id: agreementId },
        data: { status: 'ACTIVE', isActive: true }
      });
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      
      await prisma.payment.create({
         data: {
           agreementId: agreement.id,
           amount: agreement.monthlyAmount,
           dueDate: dueDate,
           status: 'PENDING'
         }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  async function rejectRentAgreement(formData: FormData) {
    'use server';
    const agreementId = formData.get('agreementId') as string;
    await prisma.rentAgreement.update({
      where: { id: agreementId },
      data: { status: 'REJECTED', isActive: false }
    });
    revalidatePath('/uz/dashboard');
  }

  const rentedAgreements = user.agreements.filter((a: any) => a.status !== 'REJECTED' && a.status !== 'ENDED');

  const showTabs = true;
  const defaultView = user.role === 'LANDLORD' || (rentedAgreements.length === 0 && allAgreements.length > 0) ? 'landlord' : 'tenant';
  const currentView = view || defaultView;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans transition-colors duration-300 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Salom, {user.name || user.phone}</h1>
            <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Ijara to'lovlari markaziga xush kelibsiz</p>
          </div>
          <a href="/uz/profile" className="sm:hidden w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
            👤
          </a>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <a href="/uz/history" className="hidden sm:flex px-5 py-3.5 rounded-2xl text-sm font-bold bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap">
            To'lov Tarixi 📚
          </a>
          <a href="/uz/profile" className="hidden sm:flex px-5 py-3.5 rounded-2xl text-sm font-bold bg-white text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap">
            Profil sozlamalari
          </a>
          <a href="/uz/property/new" className="flex-1 sm:flex-none justify-center flex bg-black text-white dark:bg-white dark:text-black px-5 py-3.5 rounded-2xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-sm whitespace-nowrap">
            + Yangi mulk
          </a>
        </div>
      </header>

      {/* --- ROLE TAB SWITCHER --- */}
      {showTabs && (
        <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 p-1.5 rounded-2xl mb-8 max-w-sm mx-auto sm:mx-0">
           <a href="?view=tenant" className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'tenant' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
             🔑 Ijarachi sifatida
           </a>
           <a href="?view=landlord" className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all ${currentView === 'landlord' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
             🏠 Uy Egasi sifatida
           </a>
        </div>
      )}

      {/* --- TENANT SECTION (Only shows if they are renting properties) --- */}
      {currentView === 'tenant' && rentedAgreements.length > 0 && (
         <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1 flex items-center gap-2">
               <span>🔑</span> Ijaraga olgan uylarim
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentedAgreements.map((agr: any) => {
                const currentPayment = agr.payments.find((p: any) => p.dueDate.getMonth() === currentMonth);
                
                return (
                  <div key={agr.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start mb-4">
                         <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{agr.property.name}</h3>
                         {agr.status === 'PENDING' && <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">Yangi so'rov</span>}
                         {agr.status === 'ACTIVE' && <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-xs font-bold">Faol mulk</span>}
                       </div>
                       
                       <div className="space-y-2 mb-6">
                          <p className="text-sm text-zinc-500 flex justify-between">
                             <span>Uy egasi:</span> 
                             <span className="font-semibold text-zinc-900 dark:text-white">{agr.property.landlord.name || agr.property.landlord.phone}</span>
                          </p>
                          <p className="text-sm text-zinc-500 flex justify-between">
                             <span>Ijara narxi:</span> 
                             <span className="font-semibold text-zinc-900 dark:text-white">{agr.monthlyAmount.toLocaleString()} UZS</span>
                          </p>
                       </div>
                     </div>

                     {agr.status === 'PENDING' ? (
                       <div className="flex gap-2">
                         <form action={rejectRentAgreement} className="flex-1">
                           <input type="hidden" name="agreementId" value={agr.id} />
                           <button className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">Rad etish</button>
                         </form>
                         <form action={confirmRentAgreement} className="flex-1">
                           <input type="hidden" name="agreementId" value={agr.id} />
                           <button className="w-full py-3 bg-[#2AABEE] text-white rounded-xl font-bold hover:bg-[#1f8fc9] transition-colors shadow-sm">Tasdiqlash</button>
                         </form>
                       </div>
                     ) : (
                       <div>
                         {currentPayment ? (
                           <a href={`/uz/invoice/${currentPayment.id}`} className="block text-center w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm">
                             To'lovlarni boshqarish &rarr;
                           </a>
                         ) : (
                           <button disabled className="w-full py-3 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600 rounded-xl font-bold cursor-not-allowed">
                             Hozircha ochiq hisob yo'q
                           </button>
                         )}
                       </div>
                     )}
                  </div>
                )
              })}
            </div>
         </div>
      )}


      {/* --- LANDLORD SECTION --- */}
      {currentView === 'landlord' && allAgreements.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1 flex items-center gap-2">
             <span>🏠</span> Ijaraga berilgan mulklarim
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Kutilayotgan to'lovlar</h3>
              <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
                {upcomingTotal.toLocaleString()} <span className="text-xl text-zinc-400">UZS</span>
              </p>
              <div className="mt-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${lateTenants > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {lateTenants} ta kechikmoqda
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Joriy oydagi tushumlar</h3>
              <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
                {receivedTotal.toLocaleString()} <span className="text-xl text-zinc-400">UZS</span>
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Faol mulklar</h3>
              <p className="text-3xl sm:text-4xl font-bold mt-4 text-zinc-900 dark:text-white tracking-tight">
                {user.properties.length} <span className="text-xl text-zinc-400">ta</span>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            {formattedTenants.length === 0 ? (
              <div className="p-10 text-center text-zinc-500">Hali hech qanday ijarachi yo'q</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 sm:px-8 py-5 font-semibold">Ijarachi</th>
                      <th className="px-6 sm:px-8 py-5 font-semibold">Mulk</th>
                      <th className="px-6 sm:px-8 py-5 font-semibold">Muddat</th>
                      <th className="px-6 sm:px-8 py-5 font-semibold">Xolati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {formattedTenants.map((t: any, idx: number) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 sm:px-8 py-6">
                          <p className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                             {t.name}
                             <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full font-bold shadow-sm whitespace-nowrap">⭐️ {t.trustScore}</span>
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">{t.phone}</p>
                        </td>
                        <td className="px-6 sm:px-8 py-6 text-zinc-600 dark:text-zinc-300">{t.property}</td>
                        <td className="px-6 sm:px-8 py-6 text-zinc-600 dark:text-zinc-300">{t.dueDate}</td>
                        <td className="px-6 sm:px-8 py-6">
                          {t.status === 'AGREEMENT_PENDING' ? (
                             <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 mr-2">Ijarachi tasdig'i kutilmoqda ⏳</span>
                          ) : t.status === 'UNDER_REVIEW' ? (
                            <form action={acceptPayment} className="flex items-center">
                              <input type="hidden" name="paymentId" value={t.paymentId} />
                              <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 mr-3">Tekshiruvda O'tkazma ⏳</span>
                              <button type="submit" className="px-3 py-1.5 bg-[#2AABEE] text-white text-xs font-bold rounded-xl hover:bg-[#1f8fc9] transition-all">Qabul ✅</button>
                            </form>
                          ) : (
                            <div className="flex items-center gap-2">
                              {t.status === 'PAID' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>To'landi</span>}
                              {t.status === 'PENDING' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2"></span>Kutamiz</span>}
                              
                              <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-200 dark:border-zinc-700 pl-3">
                                <a href={`/uz/utility/new?agreementId=${t.agreementId}`} title="Kommunal to'lov qo'shish" className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-all shadow-sm active:scale-[0.98] text-xs font-bold whitespace-nowrap">
                                  Svet/Gaz 💡
                                </a>
                                <form action={endAgreement}>
                                  <input type="hidden" name="agreementId" value={t.agreementId} />
                                  <button type="submit" title="Shartnomani yakunlash va arxivlash" className="px-2 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-400 rounded-xl transition-all shadow-sm active:scale-[0.98] text-xs font-bold">
                                    Yakunlash 🛑
                                  </button>
                                </form>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {allAgreements.length === 0 && rentedAgreements.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-6">📄</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Hali hech qanday shartnomangiz yo'q</h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">Uy egasi bo'lsangiz yangi mulk qo'shing, yoki ijarachi bo'lsangiz uy egasidan sizga ulanishini so'rang.</p>
            <a href="/uz/property/new" className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold shadow-sm hover:scale-105 transition-all">
              + Yangi Mulk Qo'shish
            </a>
         </div>
      )}
    </div>
  );
}
