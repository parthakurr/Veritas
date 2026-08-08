'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Calendar as CalendarIcon, TrendingUp, Flame, Dumbbell, Award } from 'lucide-react';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function AnalyticsPage() {
  const { dateMealLogs, user } = useAuth();

  const targetProtein = user?.macroGoals.protein || 150;
  const targetCalories = user?.macroGoals.calories || 2150;

  const generatePastDays = (numDays: number) => {
    const days = [];
    const today = new Date();
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const meals = dateMealLogs[dateKey] || [];
      const totalCals = meals.reduce((acc, m) => acc + m.totals.calories, 0);
      const totalProtein = meals.reduce((acc, m) => acc + m.totals.protein, 0);
      days.push({
        dateKey,
        dayNum: d.getDate(),
        weekday: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        mealsCount: meals.length,
        totalCals,
        totalProtein,
        hitProtein: totalProtein >= targetProtein,
      });
    }
    return days;
  };

  const days30 = generatePastDays(28);
  const loggedDays = days30.filter((d) => d.mealsCount > 0);
  const proteinGoalDaysCount = days30.filter((d) => d.hitProtein).length;
  const avgCals = loggedDays.length > 0 ? Math.round(loggedDays.reduce((a, b) => a + b.totalCals, 0) / loggedDays.length) : 0;
  const avgProtein = loggedDays.length > 0 ? Math.round((loggedDays.reduce((a, b) => a + b.totalProtein, 0) / loggedDays.length) * 10) / 10 : 0;

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-slate-900 dark:text-white bg-ambient-glow flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-16 transition-colors">
        <Navbar />

        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-8 flex-1 pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-[#E03E2D] dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Progress &amp; Consistency Analytics</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Day-by-day historical macro tracking &amp; consistency heatmaps</p>
            </div>
          </div>

          {/* Top Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-sans text-slate-500 dark:text-slate-400 font-bold">Days Tracked</span>
                <CalendarIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{loggedDays.length} / 28</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">Active logging days</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-sans text-emerald-700 dark:text-emerald-400 font-bold">Protein Target Hit</span>
                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{proteinGoalDaysCount} days</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">≥ {targetProtein}g Protein Goal</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-sans text-amber-700 dark:text-amber-400 font-bold">Avg Calories</span>
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{avgCals} kcal</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">Target: {targetCalories} kcal</span>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-sans text-[#E03E2D] dark:text-rose-400 font-bold">Avg Daily Protein</span>
                <Dumbbell className="w-4 h-4 text-[#E03E2D] dark:text-rose-400" />
              </div>
              <span className="text-2xl font-extrabold text-[#E03E2D] dark:text-rose-400">{avgProtein}g</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">Target: {targetProtein}g</span>
            </div>
          </div>

          {/* 28-Day Calendar Heatmap Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>28-Day Tracking Consistency</span>
              </h2>
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" />
                  <span>Protein Goal Hit</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-md bg-amber-400" />
                  <span>Logged Meal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <span>No Log</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
              {days30.map((d) => {
                let statusBg = 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400';
                if (d.hitProtein) {
                  statusBg = 'bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm';
                } else if (d.mealsCount > 0) {
                  statusBg = 'bg-amber-400 text-amber-950 border-amber-500 font-extrabold shadow-sm';
                }

                return (
                  <div
                    key={d.dateKey}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col items-center justify-between border text-[10px] font-mono transition-transform hover:scale-105 cursor-pointer ${statusBg}`}
                    title={`${d.dateKey}: ${d.totalCals} kcal, ${d.totalProtein}g protein (${d.mealsCount} meals)`}
                  >
                    <span className="text-[9px] uppercase tracking-tighter opacity-80">{d.weekday}</span>
                    <span className="text-xs font-extrabold">{d.dayNum}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
}
