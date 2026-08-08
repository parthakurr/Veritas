'use client';

import React, { useState, useEffect } from 'react';
import { X, Target, Check, RefreshCw } from 'lucide-react';
import { MacroGoals } from '@/types/nutrition';

interface GoalsModalProps {
  isOpen: boolean;
  currentGoals: MacroGoals;
  onClose: () => void;
  onSave: (newGoals: MacroGoals) => void;
}

export const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  currentGoals,
  onClose,
  onSave,
}) => {
  const [goals, setGoals] = useState<MacroGoals>(currentGoals);

  useEffect(() => {
    setGoals(currentGoals);
  }, [currentGoals]);

  if (!isOpen) return null;

  const handleChange = (field: keyof MacroGoals, value: number) => {
    setGoals((prev) => ({
      ...prev,
      [field]: Math.max(1, value),
    }));
  };

  const handlePreset = (type: 'cutting' | 'maintenance' | 'bulking') => {
    switch (type) {
      case 'cutting':
        setGoals({ calories: 1800, protein: 160, carbs: 150, fat: 50 });
        break;
      case 'maintenance':
        setGoals({ calories: 2200, protein: 150, carbs: 220, fat: 65 });
        break;
      case 'bulking':
        setGoals({ calories: 2800, protein: 180, carbs: 320, fat: 80 });
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Configure Daily Targets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Quick Macro Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePreset('cutting')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-cyan-400 border border-cyan-500/20 transition"
              >
                Cutting (1800 kcal)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('maintenance')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-emerald-400 border border-emerald-500/20 transition"
              >
                Maintenance (2200 kcal)
              </button>
              <button
                type="button"
                onClick={() => handlePreset('bulking')}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-amber-400 border border-amber-500/20 transition"
              >
                Bulking (2800 kcal)
              </button>
            </div>
          </div>

          {/* Goal Inputs */}
          <div className="space-y-3 font-mono">
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-sans mb-1">
                Daily Calories (kcal)
              </label>
              <input
                type="number"
                value={goals.calories}
                onChange={(e) => handleChange('calories', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 text-cyan-300 text-sm font-bold rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-400 font-sans mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={goals.protein}
                  onChange={(e) => handleChange('protein', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-emerald-400 text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 font-sans mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={goals.carbs}
                  onChange={(e) => handleChange('carbs', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-amber-400 text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-400 font-sans mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={goals.fat}
                  onChange={(e) => handleChange('fat', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-rose-400 text-xs font-bold rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Goals</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
