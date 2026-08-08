'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MacroCardProps {
  label: string;
  consumed: number;
  target: number;
  unit: string;
  icon: LucideIcon;
  colorScheme: 'cyan' | 'emerald' | 'amber' | 'rose';
}

export const MacroCard: React.FC<MacroCardProps> = ({
  label,
  consumed,
  target,
  unit,
  icon: Icon,
  colorScheme,
}) => {
  const percentage = Math.min(100, Math.round((consumed / (target || 1)) * 100));
  const remaining = Math.max(0, Math.round((target - consumed) * 10) / 10);
  const isOver = consumed > target;

  const colorStyles = {
    cyan: {
      bgIcon: 'bg-slate-100 text-slate-900 border-slate-200',
      bar: 'from-slate-900 to-slate-700',
      textGlow: 'text-slate-900',
      borderGlow: 'hover:border-slate-300',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar: 'from-emerald-600 to-teal-500',
      textGlow: 'text-emerald-700',
      borderGlow: 'hover:border-emerald-300',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-700 border-amber-200',
      bar: 'from-amber-500 to-orange-500',
      textGlow: 'text-amber-700',
      borderGlow: 'hover:border-amber-300',
    },
    rose: {
      bgIcon: 'bg-rose-50 text-[#E03E2D] border-rose-200',
      bar: 'from-[#E03E2D] to-rose-600',
      textGlow: 'text-[#E03E2D]',
      borderGlow: 'hover:border-rose-300',
    },
  }[colorScheme];

  return (
    <div className={`group bg-white rounded-2xl p-5 border border-slate-200 shadow-md shadow-slate-200/50 transition-all duration-300 ${colorStyles.borderGlow}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`p-2.5 rounded-xl border ${colorStyles.bgIcon}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</h3>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">{consumed}</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">/ {target} {unit}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-extrabold font-mono ${isOver ? 'text-rose-600' : colorStyles.textGlow}`}>
            {percentage}%
          </span>
          <p className="text-[10px] text-slate-500 font-semibold">
            {isOver ? `${Math.round(consumed - target)} ${unit} over` : `${remaining} ${unit} left`}
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorStyles.bar} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
