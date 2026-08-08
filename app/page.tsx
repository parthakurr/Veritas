'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-mono text-xs font-bold text-slate-500">
      Loading Veritas Lift &amp; Macro Hub...
    </div>
  );
}
