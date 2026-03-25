import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a] z-50 transition-opacity duration-300">
       <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-[#2AABEE]/20 dark:border-[#2AABEE]/10"></div>
          <div className="w-20 h-20 rounded-full border-4 border-[#2AABEE] border-t-transparent animate-spin absolute top-0 left-0"></div>
       </div>
       <p className="mt-6 text-zinc-500 dark:text-zinc-400 font-bold tracking-tight text-sm flex items-center gap-2">
          Kuting, yuklanmoqda... 
       </p>
    </div>
  );
}
