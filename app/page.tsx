'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Anatomy360HUD } from '@/components/Anatomy360HUD';
import { CalendarPicker } from '@/components/CalendarPicker';
import { WorkoutProvider } from '@/context/WorkoutContext';

export default function VeritasHomePage() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-[#020914] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden pb-12">
        {/* Floating Horizontal Navigation Dashboard */}
        <Navbar />

        {/* Calendar Timeline Strip */}
        <CalendarPicker />

        {/* Hero Experience: Dedicated 360° Holographic Electric Blue Anatomy HUD */}
        <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 flex-1 my-2">
          <Anatomy360HUD />
        </main>
      </div>
    </WorkoutProvider>
  );
}
