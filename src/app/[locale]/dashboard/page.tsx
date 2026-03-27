import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Building, Key, Plus, User, Receipt, ShieldCheck, Zap, XCircle, CheckCircle, Clock, X, FileSearch, ArrowRight, Trash2, ChartBar, Activity, CalendarDays, FastForward, UserPlus } from 'lucide-react';
import { ConfirmButton } from '@/components/ConfirmButton';
import { DashboardChart } from '@/components/DashboardChart';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const t = await getTranslations('Dashboard');
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
  const currentYear = new Date().getFullYear();
  const allAgreements = user.properties.flatMap((p: any) => p.agreements);
  
  let activePropertiesCount = new Set(
    allAgreements
       .filter((a: any) => a.status !== 'REJECTED' && a.status !== 'ENDED')
       .map((a: any) => a.propertyId)
  ).size;
  
  const actionablePayments: any[] = [];
  
  allAgreements.forEach((agreement: any) => {
      if (agreement.status === 'REJECTED' || agreement.status === 'ENDED') return;
      
      const aTotalMonths = agreement.durationMonths || 12;
      const aPaidMonths = agreement.payments.filter((xp: any) => xp.paymentType === 'RENT' && xp.status === 'PAID').length;

      agreement.payments.forEach((p: any) => {
         const dueDateObj = new Date(p.dueDate);
         
         if (p.status === 'PAID') {
             const paidDateObj = p.paidAt ? new Date(p.paidAt) : new Date(p.updatedAt);
             if (paidDateObj.getMonth() === currentMonth && paidDateObj.getFullYear() === currentYear) {
                 receivedTotal += (p.paidAmount || p.amount);
             }
         } else {
             if (dueDateObj.getMonth() === currentMonth && dueDateObj.getFullYear() === currentYear) {
                 upcomingTotal += p.amount;
                 if (dueDateObj < new Date()) lateTenants++;
             }
         }
         
         const isPaidThisMonth = p.status === 'PAID' && (p.paidAt ? new Date(p.paidAt) : new Date(p.updatedAt)).getMonth() === currentMonth;
         if (p.status !== 'PAID' || isPaidThisMonth) {
             actionablePayments.push({
                id: agreement.tenant.id,
                agreementId: agreement.id,
                paymentId: p.id,
                trustScore: agreement.tenant.trustScore,
                name: agreement.tenant.name || agreement.tenant.phone,
                phone: agreement.tenant.phone,
                property: user.properties.find((prop: any) => prop.id === agreement.propertyId)?.name,
                amount: p.amount,
                paidAmount: p.paidAmount,
                title: p.title || (p.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Ijara tolovi'),
                paymentType: p.paymentType,
                dueDate: p.dueDate.toLocaleDateString(),
                rawDueDate: p.dueDate,
                status: p.status,
                agreementStatus: agreement.status,
                totalMonths: aTotalMonths,
                paidMonths: aPaidMonths,
                startDate: agreement.startDate || agreement.createdAt
             });
         }
      });
      
      if (agreement.payments.length === 0 && agreement.status === 'PENDING') {
         actionablePayments.push({
            id: agreement.tenant.id,
            agreementId: agreement.id,
            paymentId: null,
            trustScore: agreement.tenant.trustScore,
            name: agreement.tenant.name || agreement.tenant.phone,
            phone: agreement.tenant.phone,
            property: user.properties.find((prop: any) => prop.id === agreement.propertyId)?.name,
            amount: agreement.monthlyAmount,
            title: 'Yangi Shartnoma',
            dueDate: 'Kutilmoqda',
            rawDueDate: new Date(8640000000000000), 
            status: 'AGREEMENT_PENDING',
            agreementStatus: agreement.status,
            totalMonths: aTotalMonths,
            paidMonths: aPaidMonths,
            startDate: agreement.startDate || agreement.createdAt
         });
      }
  });

  actionablePayments.sort((a, b) => new Date(a.rawDueDate).getTime() - new Date(b.rawDueDate).getTime());

  // GENERATE CHART DATA
  const chartData = [];
  const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
  for (let i = 5; i >= 0; i--) {
     let m = currentMonth - i;
     let y = currentYear;
     if (m < 0) { m += 12; y -= 1; }
     
     let totalForMonth = 0;
     allAgreements.forEach((agr: any) => {
       agr.payments.forEach((p: any) => {
         if (p.status === 'PAID') {
           const pd = p.paidAt ? new Date(p.paidAt) : new Date(p.updatedAt);
           if (pd.getMonth() === m && pd.getFullYear() === y) {
             totalForMonth += (p.paidAmount || p.amount);
           }
         }
       });
     });
     chartData.push({ month: monthNames[m], total: totalForMonth });
  }

  // GENERATE ACTIVITY FEED
  const activityFeed: any[] = [];
  allAgreements.forEach((agr: any) => {
     if (agr.status === 'ACTIVE' || agr.status === 'PENDING') {
        activityFeed.push({
           type: 'AGREEMENT',
           title: 'Yangi ijarachi so\'rovi',
           date: agr.createdAt,
           desc: `${agr.tenant?.phone || 'Mijoz'} (${user.properties.find((pr: any) => pr.id === agr.propertyId)?.name})`
        });
     }
     agr.payments.forEach((p: any) => {
        if (p.status === 'PAID') {
          activityFeed.push({
             type: 'PAYMENT_PAID',
             title: 'To\'lov qabul qilindi',
             date: p.paidAt || p.updatedAt,
             desc: `+${(p.paidAmount || p.amount).toLocaleString()} UZS (${agr.tenant?.name || agr.tenant?.phone})`
          });
        } else if (p.status === 'UNDER_REVIEW') {
          activityFeed.push({
             type: 'PAYMENT_REVIEW',
             title: 'To\'lov yuborildi',
             date: p.updatedAt,
             desc: `${(p.amount).toLocaleString()} UZS (${agr.tenant?.name || agr.tenant?.phone})`
          });
        }
     });
  });
  activityFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentActivities = activityFeed.slice(0, 5);

  // SERVER ACTIONS
  async function acceptPayment(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    if (!sessionId) return;
    
    const paymentId = formData.get('paymentId') as string;
    if (paymentId) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { agreement: { include: { property: true } } }
      });
      if (payment?.agreement.property.landlordId === sessionId) {
        const now = new Date();
        const d1 = new Date(now); d1.setHours(0,0,0,0);
        const d2 = new Date(payment.dueDate); d2.setHours(0,0,0,0);
        
        let actualPaid = payment.amount;
        if (payment.paymentType === 'RENT' && payment.agreement.discountAmount && d1 <= d2) {
           actualPaid -= payment.agreement.discountAmount;
        }

        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'PAID', paidAt: now, paidAmount: actualPaid }
        });
        revalidatePath('/uz/dashboard');
      }
    }
  }

  async function rejectPayment(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    if (!sessionId) return;
    
    const paymentId = formData.get('paymentId') as string;
    if (paymentId) {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { agreement: { include: { property: true, tenant: true } } }
      });
      if (payment?.agreement.property.landlordId === sessionId) {
        await prisma.payment.update({
          where: { id: paymentId },
          data: { status: 'PENDING', paidAt: null }
        });
        const newScore = Math.max(0, payment.agreement.tenant.trustScore - 15);
        await prisma.user.update({
           where: { id: payment.agreement.tenantId },
           data: { trustScore: newScore }
        });
        revalidatePath('/uz/dashboard');
      }
    }
  }

  async function endAgreement(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const agreementId = formData.get('agreementId') as string;
    if (!sessionId || !agreementId) return;

    const agreement = await prisma.rentAgreement.findUnique({ where: { id: agreementId }, include: { property: true } });
    if (agreement?.property.landlordId === sessionId) {
      await prisma.rentAgreement.update({
         where: { id: agreementId },
         data: { status: 'ENDED', isActive: false, endDate: new Date() }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  async function deletePendingAgreement(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const agreementId = formData.get('agreementId') as string;
    if (!sessionId || !agreementId) return;

    const agreement = await prisma.rentAgreement.findUnique({
       where: { id: agreementId },
       include: { property: true }
    });
    
    if (agreement && agreement.status === 'PENDING' && agreement.property.landlordId === sessionId) {
       await prisma.payment.deleteMany({ where: { agreementId: agreement.id } });
       await prisma.rentAgreement.delete({ where: { id: agreement.id } });
       await prisma.property.delete({ where: { id: agreement.propertyId } });
       
       revalidatePath('/uz/dashboard');
    }
  }

  async function deletePayment(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const paymentId = formData.get('paymentId') as string;
    if (!sessionId || !paymentId) return;

    const payment = await prisma.payment.findUnique({
       where: { id: paymentId },
       include: { agreement: { include: { property: true } } }
    });
    
    if (payment && payment.agreement.property.landlordId === sessionId && payment.status === 'PENDING' && payment.paymentType !== 'RENT') {
       await prisma.payment.delete({ where: { id: payment.id } });
       revalidatePath('/uz/dashboard');
    }
  }

  // TENANT SERVER ACTIONS
  async function generateAdvancePayment(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const agreementId = formData.get('agreementId') as string;
    if (!sessionId || !agreementId) return;

    const agreement = await prisma.rentAgreement.findUnique({
      where: { id: agreementId },
      include: { payments: { where: { paymentType: 'RENT' }, orderBy: { dueDate: 'desc' }, take: 1 } }
    });
    
    if (agreement && agreement.tenantId === sessionId && agreement.status === 'ACTIVE') {
       let nextDueDate = new Date();
       if (agreement.payments && agreement.payments.length > 0) {
          nextDueDate = new Date(agreement.payments[0].dueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
       } else {
          nextDueDate.setDate(agreement.paymentDay || 1);
       }
       
       await prisma.payment.create({
         data: {
           agreementId: agreement.id,
           amount: agreement.monthlyAmount,
           dueDate: nextDueDate,
           status: 'PENDING',
           paymentType: 'RENT',
           title: 'Oylik Ijara (Oldindan)'
         }
       });
       revalidatePath('/uz/dashboard');
    }
  }

  async function confirmRentAgreement(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const agreementId = formData.get('agreementId') as string;
    if (!sessionId || !agreementId) return;

    const agreement = await prisma.rentAgreement.findUnique({ where: { id: agreementId } });
    
    if (agreement && agreement.status === 'PENDING' && agreement.tenantId === sessionId) {
      await prisma.rentAgreement.update({
        where: { id: agreementId },
        data: { status: 'ACTIVE', isActive: true }
      });
      
      const dueDate = new Date();
      dueDate.setDate(agreement.paymentDay || 1);
      if (dueDate < new Date()) {
         dueDate.setMonth(dueDate.getMonth() + 1); // move to next month if day passed
      }
      
      await prisma.payment.create({
         data: {
           agreementId: agreement.id,
           amount: agreement.monthlyAmount,
           dueDate: dueDate,
           status: 'PENDING',
           paymentType: 'RENT',
           title: 'Oylik Ijara'
         }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  async function rejectRentAgreement(formData: FormData) {
    'use server';
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth-token')?.value;
    const agreementId = formData.get('agreementId') as string;
    if (!sessionId || !agreementId) return;

    const agreement = await prisma.rentAgreement.findUnique({ where: { id: agreementId } });
    if (agreement && agreement.tenantId === sessionId) {
      await prisma.rentAgreement.update({
        where: { id: agreementId },
        data: { status: 'REJECTED', isActive: false }
      });
      revalidatePath('/uz/dashboard');
    }
  }

  const rentedAgreements = user.agreements.filter((a: any) => a.status !== 'REJECTED' && a.status !== 'ENDED');

  const showTabs = true;
  const defaultView = user.role === 'LANDLORD' || (rentedAgreements.length === 0 && allAgreements.length > 0) ? 'landlord' : 'tenant';
  const currentView = view || defaultView;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans transition-colors duration-300 pb-20 selection:bg-[#2AABEE]/30">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">{t('greeting', { name: user.name || user.phone })}</h1>
            <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">{t('welcomeSubtitle')}</p>
          </div>
          <a href="/uz/profile" className="sm:hidden w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
            <User className="w-5 h-5" />
          </a>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar pl-1">
          <div className="flex items-center gap-2 mr-1">
             <ThemeToggle />
             <LanguageToggle />
          </div>
          <a href="/uz/history" className="hidden sm:flex items-center px-5 py-3.5 rounded-full text-sm font-bold bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap">
            <Receipt className="w-4 h-4 mr-2 text-zinc-500" /> {t('historyBtn')}
          </a>
          <a href="/uz/profile" className="hidden sm:flex items-center px-5 py-3.5 rounded-full text-sm font-bold bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-all shadow-sm active:scale-[0.98] whitespace-nowrap">
            <User className="w-4 h-4 mr-2 text-zinc-500" /> {t('profileBtn')}
          </a>
          {currentView === 'landlord' ? (
            <a href="/uz/property/new" className="flex-1 sm:flex-none justify-center items-center flex bg-black text-white dark:bg-white dark:text-black px-6 py-3.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] whitespace-nowrap">
              <Plus className="w-4 h-4 mr-1.5" /> {t('newPropertyBtn')}
            </a>
          ) : (
            <a href="/uz/invite-landlord" className="flex-1 sm:flex-none justify-center items-center flex bg-[#2AABEE] text-white px-6 py-3.5 rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-[0_4px_14px_0_rgba(42,171,238,0.3)] whitespace-nowrap">
              <UserPlus className="w-4 h-4 mr-1.5" /> Uy Egasini Chaqirish
            </a>
          )}
        </div>
      </header>

      {/* --- ROLE TAB SWITCHER --- */}
      {showTabs && (
        <div className="flex bg-zinc-200/60 dark:bg-zinc-800/60 p-1.5 rounded-2xl mb-10 max-w-sm mx-auto sm:mx-0 backdrop-blur-md">
           <a href="?view=tenant" className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'tenant' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
             <Key className={`w-4 h-4 mr-2 ${currentView === 'tenant' ? 'text-black dark:text-white' : 'text-zinc-400'}`} /> {t('tabTenant')}
           </a>
           <a href="?view=landlord" className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'landlord' ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
             <Building className={`w-4 h-4 mr-2 ${currentView === 'landlord' ? 'text-black dark:text-white' : 'text-zinc-400'}`} /> {t('tabLandlord')}
           </a>
        </div>
      )}

      {/* --- TENANT SECTION --- */}
      {currentView === 'tenant' && (
         <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1 flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                 <Key className="w-4 h-4 text-indigo-500" />
               </div>
               {t('tenantProperties')}
            </h2>
            
            {rentedAgreements.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-[#2AABEE]/10 flex items-center justify-center mb-4 text-[#2AABEE]">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Hali ijara shartnomasi qilinmagan</h3>
                <p className="text-zinc-500 mb-6 max-w-sm text-sm">Uy egangiz tizimga ro'yxatdan o'tmagan bo'lsa, uni shu yerdan taklif qilib barcha to'lovlarni oson nazorat qiling.</p>
                <a href="/uz/invite-landlord" className="bg-zinc-900 text-white dark:bg-white dark:text-black px-6 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-xl">
                  Uy Egasini Taklif Qilish
                </a>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentedAgreements.map((agr: any) => {
                const pendingPayments = agr.payments.filter((p: any) => p.status === 'PENDING' || p.status === 'UNDER_REVIEW').sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                
                return (
                  <div key={agr.id} className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between group hover:shadow-md transition-all">
                     <div>
                       <div className="flex justify-between items-start mb-4">
                         <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                           {agr.property.name}
                         </h3>
                         {agr.status === 'PENDING' && <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-amber-200 dark:bg-amber-500/10 dark:ring-amber-500/20 animate-pulse">{t('statusNew')}</span>}
                         {agr.status === 'ACTIVE' && <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/20">{t('statusActive')}</span>}
                       </div>
                       
                       <div className="space-y-3 mb-8">
                          <p className="text-sm text-zinc-500 flex justify-between items-center border-b border-zinc-50 dark:border-zinc-800/50 pb-2">
                             <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {t('ownerPrefix')}</span> 
                             <span className="font-semibold text-zinc-900 dark:text-white px-2 py-1 bg-zinc-50 dark:bg-zinc-800 rounded-md">{agr.property.landlord.name || agr.property.landlord.phone}</span>
                          </p>
                          <p className="text-sm text-zinc-500 flex justify-between items-center">
                             <span className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> {t('rentAmount')}</span> 
                             <span className="font-bold text-zinc-900 dark:text-white">{agr.monthlyAmount.toLocaleString()} UZS</span>
                          </p>
                       </div>
                     </div>

                     {agr.status === 'PENDING' ? (
                       <div className="flex gap-2 mt-4">
                         <form action={rejectRentAgreement} className="flex-1">
                           <input type="hidden" name="agreementId" value={agr.id} />
                           <button className="w-full flex items-center justify-center py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-2xl font-bold transition-colors">
                             {t('rejectBtn')}
                           </button>
                         </form>
                         <form action={confirmRentAgreement} className="flex-1">
                           <input type="hidden" name="agreementId" value={agr.id} />
                           <button className="w-full flex items-center justify-center py-3.5 bg-[#2AABEE] text-white hover:bg-[#1f8fc9] rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(42,171,238,0.3)]">
                             Tasdiqlash
                           </button>
                         </form>
                       </div>
                     ) : (
                       <div className="mt-4 space-y-2">
                         {pendingPayments.length > 0 ? (
                           pendingPayments.map((p: any) => (
                             <a key={p.id} href={`/uz/invoice/${p.id}`} className="flex items-center justify-between px-5 py-4 bg-black text-white dark:bg-white dark:text-black rounded-2xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
                               <div className="flex flex-col items-start gap-0.5">
                                 <span className="text-xs uppercase tracking-wider opacity-60 flex items-center gap-1"><Receipt className="w-3 h-3" /> {p.title || 'To\'lov cheki'}</span>
                                 <span className="text-sm">{p.amount.toLocaleString()} UZS</span>
                               </div>
                               <ArrowRight className="w-5 h-5 flex-shrink-0" />
                             </a>
                           ))
                         ) : (
                           <form action={generateAdvancePayment} className="w-full">
                              <input type="hidden" name="agreementId" value={agr.id} />
                              <button type="submit" className="flex flex-col items-center justify-center w-full py-4.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 rounded-2xl font-bold border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-all text-sm group active:scale-[0.98]">
                                Barcha ochiq qarzlar to'langan
                                <span className="text-xs font-bold opacity-90 flex items-center gap-1.5 mt-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                                   <FastForward className="w-3.5 h-3.5" /> {t('advanceBtn')}
                                </span>
                              </button>
                           </form>
                         )}
                       </div>
                     )}
                  </div>
                )
              })}
             </div>
            )}
         </div>
      )}


      {/* --- LANDLORD SECTION --- */}
      {currentView === 'landlord' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {user.properties.length === 0 && allAgreements.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm mt-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <Building className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Sizda ijara obyektlari yo'q</h3>
                <p className="text-zinc-500 mb-6 max-w-sm text-sm">Ijara to'lovlarini avtomatlashtirish uchun darhol mulkingizni tizimga qo'shing va ijarachilarni taklif qiling.</p>
                <a href="/uz/property/new" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-95">
                  Yangi Mulk Qo'shish
                </a>
              </div>
          ) : (
           <>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-1 flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                 <Building className="w-4 h-4 text-emerald-500" />
               </div>
               {t('landlordProperties')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Clock className="w-4 h-4" /> {t('pendingPaymentsBox')}</h3>
              <p className="text-3xl sm:text-4xl font-extrabold mt-4 text-zinc-900 dark:text-white tracking-tight">
                {upcomingTotal.toLocaleString()} <span className="text-xl text-zinc-400 font-medium">UZS</span>
              </p>
              <div className="mt-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${lateTenants > 0 ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {lateTenants > 0 ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />} 
                  {lateTenants} ta kechikmoqda
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2"><Receipt className="w-4 h-4" /> {t('currentMonthIncomeBox')}</h3>
              <p className="text-3xl sm:text-4xl font-extrabold mt-4 text-zinc-900 dark:text-white tracking-tight">
                {receivedTotal.toLocaleString()} <span className="text-xl text-zinc-400 font-medium">UZS</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6 uppercase tracking-wider">
                 <ChartBar className="w-4 h-4 text-[#2AABEE]" /> {t('yearlyIncomeChart')}
               </h3>
               <DashboardChart data={chartData} />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-zinc-100 dark:border-zinc-800 relative overflow-hidden flex flex-col">
               <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-6 uppercase tracking-wider">
                 <Activity className="w-4 h-4 text-emerald-500" /> {t('recentActivities')}
               </h3>
               <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {recentActivities.length > 0 ? recentActivities.map((act, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${act.type === 'PAYMENT_PAID' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : act.type === 'AGREEMENT' ? 'bg-indigo-500' : 'bg-amber-500 animate-pulse'}`}></div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{act.title}</p>
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{act.desc}</p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1 font-medium">{new Date(act.date).toLocaleString('uz-UZ', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-zinc-500 text-center mt-10">{t('noActions')}</p>
                  )}
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            {actionablePayments.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                   <FileSearch className="w-8 h-8" />
                 </div>
                 <p className="text-zinc-500 font-medium">{t('noActiveInvoices')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">{t('tablePropType')}</th>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">Muddat / Oy</th>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">{t('tableTenant')}</th>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">{t('tableAmount')}</th>
                      <th className="px-6 sm:px-8 py-5 font-bold uppercase tracking-wider text-xs">{t('tableStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {actionablePayments.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 sm:px-8 py-6 align-top">
                           <p className="font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                              {item.property}
                           </p>
                           <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded shadow-sm inline-block">{item.title}</p>
                           <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2 font-medium">{t('tableDue')} {item.dueDate}</p>
                        </td>
                        <td className="px-6 sm:px-8 py-6 align-top">
                           {item.totalMonths && item.agreementStatus !== 'PENDING' ? (
                              <div className="space-y-3">
                                 <div className="flex items-center gap-2">
                                   <div className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                                     {item.totalMonths} Oylik Shartnoma
                                   </div>
                                   <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-md text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border border-emerald-100 dark:border-emerald-500/20 shadow-sm relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 dark:via-emerald-500/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                     {item.paidMonths} Oy To'landi
                                   </div>
                                 </div>
                                 <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                                   {Array.from({ length: item.totalMonths }).map((_, i) => {
                                      const isPaid = i < item.paidMonths;
                                      const m = new Date(item.startDate || Date.now());
                                      m.setMonth(m.getMonth() + i);
                                      const monthName = m.toLocaleString('uz-UZ', { month: 'short' }).substring(0, 3);
                                      return (
                                        <div key={i} title={`${i+1}-oy: ${isPaid ? "To'langan" : "Kutilmoqda"}`} className={`flex items-center justify-center w-8 h-8 rounded border border-transparent text-[9px] font-extrabold tracking-wide uppercase transition-all duration-300 ${isPaid ? 'bg-[#00D06C] text-black shadow-[0_4px_10px_rgba(0,208,108,0.2)]' : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 cursor-help'}`}>
                                          {monthName}
                                        </div>
                                      )
                                   })}
                                 </div>
                              </div>
                           ) : (
                             <p className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 italic px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg inline-block border border-zinc-100 dark:border-zinc-800">Shartnoma kutilmoqda...</p>
                           )}
                        </td>
                        <td className="px-6 sm:px-8 py-6 align-top">
                          <p className="font-bold text-zinc-900 dark:text-white flex flex-col items-start gap-2">
                             {item.name}
                             <span className="flex items-center gap-1 text-[10px] px-2 py-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 rounded-md font-bold shadow-sm ring-1 ring-yellow-200 dark:ring-yellow-500/20">
                               <ShieldCheck className="w-3 h-3" /> {item.trustScore}
                             </span>
                          </p>
                          <p className="text-xs text-zinc-400 mt-1 font-medium tracking-wide">{item.phone}</p>
                        </td>
                        <td className="px-6 sm:px-8 py-6">
                           <p className="text-zinc-900 dark:text-white font-extrabold text-xl tracking-tight">{(item.paidAmount || item.amount)?.toLocaleString()}</p>
                           {item.paidAmount && <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1">Chegirma qo'llandi</p>}
                        </td>
                        <td className="px-6 sm:px-8 py-6">
                          {item.status === 'AGREEMENT_PENDING' ? (
                             <div className="flex items-center gap-2">
                               <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 shadow-sm border border-zinc-200 dark:border-zinc-700">Tasdiq kutilmoqda <Clock className="w-3.5 h-3.5 ml-2" /></span>
                               <form action={deletePendingAgreement}>
                                  <input type="hidden" name="agreementId" value={item.agreementId} />
                                  <ConfirmButton text="Ushbu so'rovni butunlay bekor qilib o'chirib tashlamoqchimisiz?" title="O'chirish ({t('btnCancel')})" className="flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-xl transition-all shadow-sm">
                                    <Trash2 className="w-4 h-4" />
                                  </ConfirmButton>
                               </form>
                             </div>
                          ) : item.status === 'UNDER_REVIEW' ? (
                            <div className="flex flex-col items-start gap-3">
                              <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-amber-400 shadow-inner ring-1 ring-amber-200 dark:ring-amber-500/30">
                                Tekshiruvda <Clock className="w-3.5 h-3.5 ml-2 animate-pulse" />
                              </span>
                              <div className="flex gap-2">
                                 <form action={rejectPayment}>
                                   <input type="hidden" name="paymentId" value={item.paymentId} />
                                   <button type="submit" title={`To'lov tushmadi (${t('rejectBtn')})`} className="flex items-center px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 rounded-xl text-xs font-bold transition-all shadow-sm">
                                     {t('rejectBtn')} <XCircle className="w-3.5 h-3.5 ml-1" />
                                   </button>
                                 </form>
                                 <form action={acceptPayment}>
                                   <input type="hidden" name="paymentId" value={item.paymentId} />
                                   <button type="submit" title="Pul kelib tushdi (Tasdiqlash)" className="flex items-center px-4 py-2 bg-[#2AABEE] text-white text-xs font-bold rounded-xl hover:bg-[#1f8fc9] transition-all shadow-md shadow-[#2AABEE]/20 hover:shadow-lg">
                                     Tasdiqlash <CheckCircle className="w-3.5 h-3.5 ml-1" />
                                   </button>
                                 </form>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start gap-3">
                              {item.status === 'PAID' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>To'landi</span>}
                              {item.status === 'PENDING' && <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span>To'lanmadi</span>}
                              
                              <div className="flex items-center gap-2 relative">
                                <a href={`/uz/utility/new?agreementId=${item.agreementId}`} title="Kommunal to'lov yozish" className="flex items-center px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 rounded-xl transition-all shadow-sm text-xs font-bold whitespace-nowrap">
                                  + Qarz yozish <Zap className="w-3.5 h-3.5 ml-1" />
                                </a>
                                {item.paymentType === 'RENT' && (
                                   <form action={endAgreement}>
                                     <input type="hidden" name="agreementId" value={item.agreementId} />
                                     <ConfirmButton text="Rostdan ham ijara shartnomasini yakunlab arxivlamoqchimisiz? Bu jarayon orqaga qaytarilmaydi!" title={`${t('btnEndContract')} (Arxiv)`} className="flex items-center px-2 py-2 bg-white text-zinc-500 hover:text-rose-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-rose-400 rounded-xl transition-all text-xs font-bold ring-1 ring-zinc-200 dark:ring-zinc-800 hover:ring-rose-200 dark:hover:ring-rose-500/30">
                                       <X className="w-4 h-4" />
                                     </ConfirmButton>
                                   </form>
                                )}
                                {item.paymentType !== 'RENT' && item.status === 'PENDING' && (
                                   <form action={deletePayment}>
                                     <input type="hidden" name="paymentId" value={item.paymentId} />
                                     <ConfirmButton text="Ushbu kiritilgan qarz kvitansiyasini o'chirib tashlamoqchimisiz?" title="Qarzni o'chirish" className="flex items-center px-2 py-2 bg-white text-zinc-500 hover:text-rose-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-rose-400 rounded-xl transition-all text-xs font-bold ring-1 ring-zinc-200 dark:ring-zinc-800 hover:ring-rose-200 dark:hover:ring-rose-500/30">
                                       <Trash2 className="w-4 h-4" />
                                     </ConfirmButton>
                                   </form>
                                )}
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
           </>
          )}
        </div>
      )}
      
      {allAgreements.length === 0 && rentedAgreements.length === 0 && currentView === 'landlord' && (
         <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-700">
            <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-300 dark:text-zinc-600 mb-8 border border-zinc-200 dark:border-zinc-700 shadow-sm">
               <Receipt className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-3">Sizda hali mulklar yo'q</h2>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              RentPay orqali daromadingizni raqamlashtiring. Birinchi mulkingizni qo'shing yoki uy egangizdan yuborilgan so'rovni kuting.
            </p>
            <a href="/uz/property/new" className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Yangi Mulk Qo'shish
            </a>
         </div>
      )}
    </div>
  );
}
