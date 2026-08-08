'use client';

import React, { useState } from 'react';
import { Utensils, Clock, Trash2, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { MealLog } from '@/types/nutrition';

interface MealFeedProps {
  meals: MealLog[];
  onEditMeal: (meal: MealLog) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const MealFeed: React.FC<MealFeedProps> = ({ meals, onEditMeal, onDeleteMeal }) => {
  const [expandedMealIds, setExpandedMealIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedMealIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getMealTypeBadge = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'lunch':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'dinner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
  };

  if (meals.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8">
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-md flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            <Utensils className="w-8 h-8 opacity-80" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No meals logged yet for this date</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Type what you ate in the box above in plain English (e.g. &quot;6 eggs boiled&quot; or &quot;100gm chicken and 500gm biryani&quot;). Veritas AI will calculate your macros instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => {
        const isExpanded = expandedMealIds[meal.id] ?? true;

        return (
          <div
            key={meal.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 overflow-hidden transition-all duration-200 hover:border-slate-300"
          >
            {/* Meal Header Summary */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 shrink-0 shadow-2xs">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold tracking-wider border rounded-full uppercase font-mono ${getMealTypeBadge(
                        meal.mealType
                      )}`}
                    >
                      {meal.mealType}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{meal.timestamp}</span>
                    </span>
                  </div>
                  {/* Clean Modern Sans-Serif Typography */}
                  <h4 className="text-sm font-extrabold text-slate-900 truncate mt-0.5 font-sans">
                    &quot;{meal.prompt}&quot;
                  </h4>
                </div>
              </div>

              {/* Totals Pill & Actions */}
              <div className="flex items-center space-x-3 shrink-0">
                <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 font-mono text-xs">
                  <span className="font-extrabold text-slate-900">{meal.totals.calories} kcal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 font-bold">{meal.totals.protein}g P</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-amber-700 font-bold">{meal.totals.carbs}g C</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#E03E2D] font-bold">{meal.totals.fat}g F</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditMeal(meal)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Edit Breakdown"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand(meal.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Macro Bar */}
            <div className="sm:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between font-mono text-xs">
              <span className="font-extrabold text-slate-900">{meal.totals.calories} kcal</span>
              <div className="flex space-x-2 text-[11px]">
                <span className="text-emerald-700 font-bold">{meal.totals.protein}g P</span>
                <span className="text-amber-700 font-bold">{meal.totals.carbs}g C</span>
                <span className="text-[#E03E2D] font-bold">{meal.totals.fat}g F</span>
              </div>
            </div>

            {/* Itemized Food Breakdown Table */}
            {isExpanded && (
              <div className="p-4 sm:p-5 bg-white">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      <th className="pb-2 font-semibold">Food Item & Portion</th>
                      <th className="pb-2 text-right font-semibold">Calories</th>
                      <th className="pb-2 text-right font-semibold text-emerald-700">Protein</th>
                      <th className="pb-2 text-right font-semibold text-amber-700">Carbs</th>
                      <th className="pb-2 text-right font-semibold text-[#E03E2D]">Fat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {meal.items.map((item) => {
                      const cleanServing = item.servingSize.replace(/^\(\((.*)\)\)$/, '($1)').replace(/^\((.*)\)$/, '$1');
                      return (
                        <tr key={item.id} className="group/row hover:bg-slate-50/80 transition">
                          <td className="py-2.5 pr-2">
                            <span className="font-bold text-slate-900 block">{item.name}</span>
                            <span className="text-[11px] text-slate-500 font-sans font-medium">({cleanServing})</span>
                          </td>
                          <td className="py-2.5 text-right font-mono font-bold text-slate-900">{item.calories} <span className="text-[10px] font-normal text-slate-400">kcal</span></td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-700">{item.protein}g</td>
                          <td className="py-2.5 text-right font-mono font-bold text-amber-700">{item.carbs}g</td>
                          <td className="py-2.5 text-right font-mono font-bold text-[#E03E2D]">{item.fat}g</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
