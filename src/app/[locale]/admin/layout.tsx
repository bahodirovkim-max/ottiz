import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default async function AdminLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/uz/login');

  const user = await prisma.user.findUnique({ where: { id: token } });
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/uz/dashboard');
  }

  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white flex-shrink-0 flex flex-col hidden md:flex border-r border-zinc-800">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg">A</div>
            <span className="font-black text-xl tracking-tight">SuperAdmin</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 text-white font-bold transition-colors">
            Umumiy Xulosa
          </Link>
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors mt-auto">
            <ArrowLeft className="w-5 h-5" /> Dashboardga qaytish
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <ShieldAlert className="w-5 h-5 text-amber-500" />
             <h1 className="font-bold text-zinc-900 dark:text-white text-lg">Tizim Boshqaruvi</h1>
          </div>
          <ThemeToggle />
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
