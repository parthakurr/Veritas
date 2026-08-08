'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Activity, CheckCircle, Save, Target } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';

export const ManualMacroLogger: React.FC = () => {
  const { selectedDate, macroLogs, macroGoals, saveManualMacroLog, setMacroGoals } = useWorkout();

  const currentLog = macroLogs[selectedDate] || {
    date: selectedDate,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  const [calories, setCalories] = useState<number>(currentLog.calories);
  const [protein, setProtein] = useState<number>(currentLog.protein);
  const [carbs, setCarbs] = useState<number>(currentLog.carbs);
  const [fat, setFat] = useState<number>(currentLog.fat);

  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState(false);
  const [targetCalories, setTargetCalories] = useState(macroGoals.calories);
  const [targetProtein, setTargetProtein] = useState(macroGoals.protein);
  const [targetCarbs, setTargetCarbs] = useState(macroGoals.carbs);
  const [targetFat, setTargetFat] = useState(macroGoals.fat);

  useEffect(() => {
    setCalories(currentLog.calories);
    setProtein(currentLog.protein);
    setCarbs(currentLog.carbs);
    setFat(currentLog.fat);
  }, [selectedDate, currentLog.calories, currentLog.protein, currentLog.carbs, currentLog.fat]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveManualMacroLog({
      date: selectedDate,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    setMacroGoals({
      calories: Number(targetCalories) || 2000,
      protein: Number(targetProtein) || 150,
      carbs: Number(targetCarbs) || 200,
      fat: Number(targetFat) || 60,
    });
    setIsGoalsModalOpen(false);
  };

  const calPct = Math.min(100, Math.round((calories / (macroGoals.calories || 1)) * 100));
  const protPct = Math.min(100, Math.round((protein / (macroGoals.protein || 1)) * 100));
  const carbsPct = Math.min(100, Math.round((carbs / (macroGoals.carbs || 1)) * 100));
  const fatPct = Math.min(100, Math.round((fat / (macroGoals.fat || 1)) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 shadow-sm">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Manual Nutrition &amp; Macro Logger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Direct manual entry for Calories, Protein, Carbs, and Fat</p>
          </div>
        </div>

        <button
          onClick={() => setIsGoalsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition text-xs font-bold border border-slate-200 dark:border-slate-700"
        >
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Set Macro Targets</span>
        </button>
      </div>

      {/* Live Target Progress Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-sans font-extrabold text-slate-700 dark:text-slate-300">Calories</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{calPct}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-slate-900 dark:bg-white h-full rounded-full transition-all duration-500" style={{ width: `${calPct}%` }} />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">{calories} / {macroGoals.calories} kcal</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 space-y-2">
          <div className="flex justify-between items-center text-xs text-emerald-900 dark:text-emerald-300">
            <span className="font-sans font-extrabold">Protein</span>
            <span className="font-extrabold">{protPct}%</span>
          </div>
          <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/60 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${protPct}%` }} />
          </div>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold block">{protein} / {macroGoals.protein}g</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 space-y-2">
          <div className="flex justify-between items-center text-xs text-amber-900 dark:text-amber-300">
            <span className="font-sans font-extrabold">Carbs</span>
            <span className="font-extrabold">{carbsPct}%</span>
          </div>
          <div className="w-full bg-amber-200/60 dark:bg-amber-900/60 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${carbsPct}%` }} />
          </div>
          <span className="text-[11px] text-amber-800 dark:text-amber-400 font-bold block">{carbs} / {macroGoals.carbs}g</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 space-y-2">
          <div className="flex justify-between items-center text-xs text-rose-900 dark:text-rose-300">
            <span className="font-sans font-extrabold">Fat</span>
            <span className="font-extrabold">{fatPct}%</span>
          </div>
          <div className="w-full bg-rose-200/60 dark:bg-rose-900/60 h-2 rounded-full overflow-hidden">
            <div className="bg-[#E03E2D] dark:bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${fatPct}%` }} />
          </div>
          <span className="text-[11px] text-rose-800 dark:text-rose-400 font-bold block">{fat} / {macroGoals.fat}g</span>
        </div>
      </div>

      {/* Manual Input Form */}
      <form onSubmit={handleSave} className="bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
          Enter Daily Totals ({selectedDate})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 block">Total Calories (kcal)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-[#E03E2D]"
              placeholder="e.g. 2400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 block">Protein (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-800 rounded-xl px-3 py-2 font-mono text-sm font-extrabold text-emerald-800 dark:text-emerald-300 focus:outline-none focus:border-emerald-600"
              placeholder="e.g. 170"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 block">Carbohydrates (g)</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 rounded-xl px-3 py-2 font-mono text-sm font-extrabold text-amber-800 dark:text-amber-300 focus:outline-none focus:border-amber-600"
              placeholder="e.g. 250"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 block">Fat (g)</label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-800 rounded-xl px-3 py-2 font-mono text-sm font-extrabold text-[#E03E2D] dark:text-rose-400 focus:outline-none focus:border-[#E03E2D]"
              placeholder="e.g. 65"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs transition shadow-md"
          >
            <Save className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Save Nutrition Totals</span>
          </button>
        </div>
      </form>

      {/* Target Goals Modal */}
      {isGoalsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveGoals} className="bg-white dark:bg-slate-900 p-6 rounded-3xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Set Daily Target Goals</h4>
            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Target Calories (kcal)</label>
                <input
                  type="number"
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-emerald-700 dark:text-emerald-400 block mb-1">Target Protein (g)</label>
                <input
                  type="number"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-amber-700 dark:text-amber-400 block mb-1">Target Carbs (g)</label>
                <input
                  type="number"
                  value={targetCarbs}
                  onChange={(e) => setTargetCarbs(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-rose-700 dark:text-rose-400 block mb-1">Target Fat (g)</label>
                <input
                  type="number"
                  value={targetFat}
                  onChange={(e) => setTargetFat(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGoalsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#E03E2D] text-white rounded-xl shadow-md"
              >
                Save Goals
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
