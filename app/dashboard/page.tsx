'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { CalendarPicker } from '@/components/CalendarPicker';
import { AnatomyHUD } from '@/components/AnatomyHUD';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { ExerciseChart } from '@/components/ExerciseChart';
import { ManualMacroLogger } from '@/components/ManualMacroLogger';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function DashboardPage() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#090D16] text-slate-900 dark:text-white bg-ambient-glow flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-16 transition-colors">
        <Navbar />

        {/* Calendar Date Switcher */}
        <CalendarPicker />

        <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 space-y-8 flex-1">
          {/* Section 1: Tesla Cockpit Anatomical Body & Muscle Growth HUD */}
          <section>
            <AnatomyHUD />
          </section>

          {/* Section 2: Exercise Strength Progression Graph (Day vs Weight) */}
          <section>
            <ExerciseChart />
          </section>

          {/* Section 3 & 4: Workout Logger & Manual Macro Logger */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workout Logger */}
            <section>
              <WorkoutLogger />
            </section>

            {/* Manual Macro Logger */}
            <section>
              <ManualMacroLogger />
            </section>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  );
}
