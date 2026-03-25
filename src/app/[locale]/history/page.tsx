import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({
    where: { id: token },
    include: {
      properties: {
        include: { agreements: { include: { payments: { where: { status: 'PAID' }, orderBy: { paidAt: 'desc' } }, tenant: true } } }
      },
      agreements: {
        include: { property: { include: { landlord: true } }, payments: { where: { status: 'PAID' }, orderBy: { paidAt: 'desc' } } }
      }
    }
  });

  if (!user) redirect('/uz/login');

  const receivedPayments = user.properties.flatMap(p => p.agreements.flatMap(a => a.payments.map(pay => ({
     ...pay,
     role: 'Uy Egasi',
     title: pay.title || (pay.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Oylik Ijara'),
     counterparty: a.tenant.name || a.tenant.phone,
     propertyName: p.name
  }))));

  const sentPayments = user.agreements.flatMap(a => a.payments.map(pay => ({
     ...pay,
     role: 'Ijarachi',
     title: pay.title || (pay.paymentType === 'DEPOSIT' ? 'Zaklad (Depozit)' : 'Oylik Ijara'),
     counterparty: a.property.landlord.name || a.property.landlord.phone,
     propertyName: a.property.name
  })));

  const allHistory = [...receivedPayments, ...sentPayments].sort((x, y) => (y.paidAt?.getTime() || 0) - (x.paidAt?.getTime() || 0));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] p-4 sm:p-8 font-sans pb-20">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">To'lovlar Tarixi</h1>
          <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">Barcha muvaffaqiyatli tranzaksiyalar (Arxiv)</p>
        </div>
        <a href="/uz/dashboard" className="text-sm font-bold px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors block">
          &larr; Orqaga
        </a>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden max-w-5xl mx-auto">
        {allHistory.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">Hali hech qanday to'lov tarixi mavjud emas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 sm:px-8 py-5 font-semibold">Sana</th>
                  <th className="px-6 sm:px-8 py-5 font-semibold">To'lov Turi</th>
                  <th className="px-6 sm:px-8 py-5 font-semibold">Mulk & Sizning Rolingiz</th>
                  <th className="px-6 sm:px-8 py-5 font-semibold">Shaxs</th>
                  <th className="px-6 sm:px-8 py-5 font-semibold">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {allHistory.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 sm:px-8 py-6 text-zinc-600 dark:text-zinc-300">
                      {p.paidAt ? p.paidAt.toLocaleDateString() + ' ' + p.paidAt.toLocaleTimeString().slice(0, 5) : (p.dueDate ? p.dueDate.toLocaleDateString() : 'Noma`lum')}
                    </td>
                    <td className="px-6 sm:px-8 py-6">
                      <span className="font-semibold text-zinc-900 dark:text-white px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">{p.title}</span>
                    </td>
                    <td className="px-6 sm:px-8 py-6">
                      <p className="font-medium text-zinc-900 dark:text-white">{p.propertyName}</p>
                      <p className="text-xs text-zinc-500 mt-1">{p.role}</p>
                    </td>
                    <td className="px-6 sm:px-8 py-6 text-zinc-600 dark:text-zinc-300">{p.counterparty}</td>
                    <td className="px-6 sm:px-8 py-6">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+{p.amount?.toLocaleString()} UZS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
