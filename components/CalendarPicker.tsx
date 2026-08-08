'use client';

import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Flame, Dumbbell } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';

export const CalendarPicker: React.FC = () => {
  const { selectedDate, setSelectedDate, workoutLogs, macroLogs } = useWorkout();

  // Generate 7 days around selected date
  const generate7Days = () => {
    const days = [];
    const current = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(current);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      days.push({ iso, dayName, dayNum });
    }
    return days;
  };

  const daysStrip = generate7Days();

  const handleDateChange = (daysOffset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + daysOffset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none space-y-3 transition-colors">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Workout &amp; Macro Timeline
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  {selectedDate}
                </span>
                {isToday && (
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full">
                    TODAY
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 font-mono text-xs">
            <button
              onClick={() => handleDateChange(-7)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-3 py-1.5 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 text-xs"
            >
              Today
            </button>

            <button
              onClick={() => handleDateChange(7)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Visual Day Strip */}
        <div className="grid grid-cols-7 gap-1.5 font-mono">
          {daysStrip.map((day) => {
            const isSelected = day.iso === selectedDate;
            const hasWorkout = (workoutLogs[day.iso] || []).length > 0;
            const hasMacros = (macroLogs[day.iso]?.calories || 0) > 0;

            return (
              <button
                key={day.iso}
                onClick={() => setSelectedDate(day.iso)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-between transition-all border text-center relative ${
                  isSelected
                    ? 'bg-[#E03E2D] text-white border-[#E03E2D] shadow-md shadow-rose-500/20 scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-[10px] font-sans font-bold uppercase opacity-70 block">
                  {day.dayName}
                </span>

                <span className="text-sm font-extrabold my-1">{day.dayNum}</span>

                {/* Badges Row */}
                <div className="flex items-center space-x-1 mt-0.5">
                  {hasWorkout && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Workout Logged" />
                  )}
                  {hasMacros && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Macros Logged" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
