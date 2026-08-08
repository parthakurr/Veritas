'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-ambient-glow flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16">
      <Navbar />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-10 flex-1 pt-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Unlimited AI Nutrition Tracking
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Start completely free with zero API key configuration required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Free Tier */}
          <div className="glass-panel rounded-3xl p-8 border border-slate-800 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Free Starter</span>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-mono">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Perfect for everyday meal logging & macro tracking.</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unlimited Natural Language Logging</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Mifflin-St Jeor TDEE Onboarding</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Day-by-Day Calendar Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Quick-Commerce & Biryani Dum Engine</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center border border-slate-700 transition"
            >
              Start Free Now
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="glass-panel rounded-3xl p-8 border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold uppercase tracking-wider">
              Popular
            </div>

            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Pro Athlete</span>
              <div className="mt-2 flex items-baseline">
                <span className="text-4xl font-extrabold text-white font-mono">$9</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">For athletes & fitness professionals requiring deep analytics.</p>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Gemini 1.5 Pro High-Precision AI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>28-Day Consistency Heatmaps</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Export Macro Reports to CSV</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-xs text-center shadow-lg shadow-rose-500/20 transition"
            >
              Get Pro Access
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
