'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ExerciseChart } from '@/components/ExerciseChart';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function WorkoutsPage() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-slate-900 dark:text-white bg-ambient-glow flex flex-col font-sans pb-16 transition-colors">
        <Navbar />

        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-8 mt-6 flex-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Workout Splits &amp; Strength Progression</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track sets, weight (kg), reps, and visual strength gains over time</p>
          </div>

          <ExerciseChart />

          <WorkoutLogger />
        </main>
      </div>
    </WorkoutProvider>
  );
}
