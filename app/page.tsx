'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { AnatomyHUD } from '@/components/AnatomyHUD';
import { Sparkles, ArrowRight, CheckCircle2, Dumbbell, Flame, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function VeritasLandingPage() {
  const { loginWithGoogle, isAuthenticated } = useAuth();

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-slate-900 dark:text-white bg-ambient-glow flex flex-col font-sans selection:bg-rose-500 selection:text-white overflow-x-hidden pb-16 transition-colors">
        {/* Floating Navbar */}
        <Navbar />

        {/* Hero Section */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 flex flex-col items-center text-center space-y-6">
          {/* Badge Callout */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700/80 text-xs font-bold text-cyan-400 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Interactive Body Blueprint &amp; Lift Tracker</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-3xl">
            Track your lifts. <br />
            <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 bg-clip-text text-transparent">
              Watch your body evolve.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
            Tesla HUD-style muscle growth progression. Log your sets, weight, and reps under your custom day splits. Watch your muscle groups level up from Novice to Titan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E03E2D] hover:bg-[#C93323] text-white font-extrabold text-xs shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E03E2D] hover:bg-[#C93323] text-white font-extrabold text-xs shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Google Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* Section 2: Interactive Tesla Cockpit Anatomy HUD Centerpiece */}
        <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 my-6">
          <AnatomyHUD />
        </section>

        {/* Feature Micro-points */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#E03E2D] w-max mb-3">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">Day Splits &amp; Sets</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans text-xs">
                Log Push, Pull, Legs or custom splits with fast -2.5kg / +2.5kg weight controls.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-max mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">Day vs Weight Graph</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans text-xs">
                Interactive SVG strength progression curves, 1RM calculations, and PR markers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 w-max mb-3">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">Manual Macro Hub</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans text-xs">
                Direct numeric manual logging for daily Calories, Protein, Carbs, and Fat.
              </p>
            </div>
          </div>
        </section>
      </div>
    </WorkoutProvider>
  );
}
