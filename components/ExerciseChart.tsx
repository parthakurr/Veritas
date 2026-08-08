'use client';

import React, { useState } from 'react';
import { TrendingUp, Dumbbell, Trophy, Calendar, Sparkles, Activity } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';

export const ExerciseChart: React.FC = () => {
  const { splits, selectedExerciseChart, setSelectedExerciseChart, getExerciseHistory } = useWorkout();
  const [metricMode, setMetricMode] = useState<'weight' | '1rm' | 'volume'>('weight');

  // Collect all unique exercises across splits
  const allExercises = Array.from(
    new Set(splits.flatMap((s) => s.exercises))
  );

  const historyData = getExerciseHistory(selectedExerciseChart);

  const maxHistoricalWeight = historyData.length > 0
    ? Math.max(...historyData.map((d) => d.maxWeight))
    : 0;

  const latestWeight = historyData.length > 0
    ? historyData[historyData.length - 1].maxWeight
    : 0;

  const firstWeight = historyData.length > 0
    ? historyData[0].maxWeight
    : 0;

  const weightGain = historyData.length > 1 ? Math.round((latestWeight - firstWeight) * 10) / 10 : 0;

  // Calculate 1RM estimate
  const estimated1RM = Math.round(maxHistoricalWeight * 1.08);

  // Prepare SVG Curve Points
  const chartHeight = 160;
  const chartWidth = 560;

  const getMetricValue = (pt: { maxWeight: number; totalVolume: number; setsCount: number }) => {
    if (metricMode === 'weight') return pt.maxWeight;
    if (metricMode === '1rm') return Math.round(pt.maxWeight * 1.08);
    return pt.totalVolume;
  };

  const values = historyData.map(getMetricValue);
  const maxVal = values.length > 0 ? Math.max(...values) : 1;
  const minVal = values.length > 0 ? Math.min(...values) * 0.85 : 0;
  const range = maxVal - minVal || 1;

  const points = historyData.map((pt, idx) => {
    const x = historyData.length > 1 ? (idx / (historyData.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const val = getMetricValue(pt);
    const y = chartHeight - ((val - minVal) / range) * (chartHeight - 40) - 20;
    return { x, y, val, date: pt.date, isPR: pt.maxWeight === maxHistoricalWeight };
  });

  // Construct Smooth SVG Path (Catmull-Rom / Beziers)
  let dPath = '';
  if (points.length > 0) {
    dPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const mx = (curr.x + next.x) / 2;
      dPath += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
  }

  const areaPath = points.length > 0
    ? `${dPath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
    : '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 transition-colors">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-[#E03E2D] dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Strength Progression Curve</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interactive Day vs. Weight lifted graph</p>
          </div>
        </div>

        {/* Exercise Selector & Metric Modes */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedExerciseChart}
            onChange={(e) => setSelectedExerciseChart(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs rounded-2xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E03E2D] shadow-2xs cursor-pointer"
          >
            {allExercises.map((ex) => (
              <option key={ex} value={ex}>
                🏋️ {ex}
              </option>
            ))}
          </select>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setMetricMode('weight')}
              className={`px-3 py-1 rounded-xl transition ${
                metricMode === 'weight' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weight (kg)
            </button>
            <button
              onClick={() => setMetricMode('1rm')}
              className={`px-3 py-1 rounded-xl transition ${
                metricMode === '1rm' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Est 1RM
            </button>
            <button
              onClick={() => setMetricMode('volume')}
              className={`px-3 py-1 rounded-xl transition ${
                metricMode === 'volume' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      {/* Quick PR & Stats Pill Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans font-bold block uppercase">Max Weight PR</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">{maxHistoricalWeight} kg</span>
          </div>
          <Trophy className="w-5 h-5 text-amber-500" />
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-sans font-bold block uppercase">Strength Growth</span>
            <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {weightGain >= 0 ? `+${weightGain} kg` : `${weightGain} kg`}
            </span>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-rose-800 dark:text-rose-400 font-sans font-bold block uppercase">Estimated 1RM</span>
            <span className="text-xl font-extrabold text-[#E03E2D] dark:text-rose-400">~{estimated1RM} kg</span>
          </div>
          <Sparkles className="w-5 h-5 text-[#E03E2D] dark:text-rose-400" />
        </div>
      </div>

      {/* SVG Interactive Curve Graph */}
      {historyData.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
          <Dumbbell className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No workout sets logged yet for &quot;{selectedExerciseChart}&quot;</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Log a workout session below to plot your strength curve!</p>
        </div>
      ) : (
        <div className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 relative overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E03E2D" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#E03E2D" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Area Fill */}
            {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

            {/* Curve Line */}
            {dPath && (
              <path
                d={dPath}
                fill="none"
                stroke="#E03E2D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points & Tooltips */}
            {points.map((pt, idx) => (
              <g key={pt.date} className="group cursor-pointer">
                {/* Outer PR Pulse Ring */}
                {pt.isPR && (
                  <circle cx={pt.x} cy={pt.y} r="8" className="fill-rose-400/30 animate-ping" />
                )}

                {/* Point Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  className={pt.isPR ? 'fill-[#E03E2D] stroke-white stroke-2' : 'fill-slate-900 dark:fill-white stroke-white dark:stroke-slate-900 stroke-2'}
                />

                {/* Label Value */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="fill-slate-700 dark:fill-slate-200 font-mono text-[9px] font-extrabold"
                >
                  {pt.val}{metricMode === 'volume' ? '' : 'k'}
                </text>

                {/* Hover Tooltip Card */}
                <foreignObject x={Math.max(10, Math.min(chartWidth - 90, pt.x - 40))} y={pt.y - 45} width="80" height="30" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-900 text-white text-[9px] font-mono px-2 py-1 rounded-lg text-center shadow-lg border border-slate-700">
                    {pt.date.slice(5)}: {pt.val} {metricMode === 'volume' ? 'vol' : 'kg'}
                  </div>
                </foreignObject>
              </g>
            ))}
          </svg>

          {/* Date Axis */}
          <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 mt-2 px-2 border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
            <span>{historyData[0]?.date}</span>
            <span>{historyData[historyData.length - 1]?.date}</span>
          </div>
        </div>
      )}
    </div>
  );
};
