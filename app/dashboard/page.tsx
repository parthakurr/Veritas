'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { CalendarPicker } from '@/components/CalendarPicker';
import { Anatomy360HUD } from '@/components/Anatomy360HUD';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { ExerciseChart } from '@/components/ExerciseChart';
import { ManualMacroLogger } from '@/components/ManualMacroLogger';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function DashboardPage() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#020914] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16 transition-colors">
        <Navbar />

        {/* Calendar Date Switcher */}
        <CalendarPicker />

        <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 space-y-8 flex-1">
          {/* Section 1: Dedicated 360° Holographic Electric Blue Anatomy HUD */}
          <section>
            <Anatomy360HUD />
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
