'use client';

import React from 'react';
import { Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';
import { MacroCard } from './MacroCard';
import { DailyTotals, MacroGoals } from '@/types/nutrition';

interface MacroSummaryProps {
  totals: DailyTotals;
  goals: MacroGoals;
}

export const MacroSummary: React.FC<MacroSummaryProps> = ({ totals, goals }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <MacroCard
          label="Calories"
          consumed={totals.calories}
          target={goals.calories}
          unit="kcal"
          icon={Flame}
          colorScheme="cyan"
        />

        {/* Protein Card */}
        <MacroCard
          label="Protein"
          consumed={totals.protein}
          target={goals.protein}
          unit="g"
          icon={Dumbbell}
          colorScheme="emerald"
        />

        {/* Carbs Card */}
        <MacroCard
          label="Carbohydrates"
          consumed={totals.carbs}
          target={goals.carbs}
          unit="g"
          icon={Wheat}
          colorScheme="amber"
        />

        {/* Fats Card */}
        <MacroCard
          label="Fats"
          consumed={totals.fat}
          target={goals.fat}
          unit="g"
          icon={Droplet}
          colorScheme="rose"
        />
      </div>
    </section>
  );
};
