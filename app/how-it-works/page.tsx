'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sparkles, MessageSquare, Brain, Target, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-ambient-glow flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      <Navbar />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-12 flex-1 pt-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>How Veritas AI Works</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Plain Language to Clinical Precision
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Veritas eliminates drop-down menus by combining large language model intelligence with authentic restaurant cooking mathematics.
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-start space-x-5">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 font-mono font-bold text-lg">
              01
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Natural Prompt Processing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Type whatever you ate or ordered in natural conversational language—from &quot;2 eggs with toast&quot; to packaged quick-commerce products (&quot;Amul protein lassi&quot;).
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-start space-x-5">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 font-mono font-bold text-lg">
              02
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Complex Dish Itemized Decomposition</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complex meals like Biryani or Thalis are automatically decomposed into separate items (Meat, Basmati Rice, Ghee/Birista), taking into account real dum-cooking fats and spices.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex items-start space-x-5">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 font-mono font-bold text-lg">
              03
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Mifflin-St Jeor TDEE & Macro Progress</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your daily macro totals are benchmarked against your personalized onboarding goals with real-time day-by-day calendar tracking.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-500/20 transition transform hover:scale-105"
          >
            <span>Try AI Tracker Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
