'use client';

import React, { useState } from 'react';
import { Dumbbell, Shield, Zap, Activity, Flame, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup } from '@/types/workout';

export const AnatomyHUD: React.FC = () => {
  const { getMuscleProgression, getAllMusclesProgression, setSelectedExerciseChart } = useWorkout();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('chest');
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');

  const allProgression = getAllMusclesProgression();
  const activeProgression = getMuscleProgression(selectedMuscle);

  const muscleNodes: Array<{
    group: MuscleGroup;
    label: string;
    view: 'front' | 'back';
    cx: number;
    cy: number;
    calloutSide: 'left' | 'right';
    calloutY: number;
    recommendedExercise: string;
  }> = [
    { group: 'chest', label: 'Chest (Pectorals)', view: 'front', cx: 200, cy: 155, calloutSide: 'left', calloutY: 120, recommendedExercise: 'Barbell Bench Press' },
    { group: 'shoulders', label: 'Delts (Shoulders)', view: 'front', cx: 140, cy: 125, calloutSide: 'left', calloutY: 60, recommendedExercise: 'Overhead Shoulder Press' },
    { group: 'biceps', label: 'Biceps (Arms)', view: 'front', cx: 130, cy: 185, calloutSide: 'left', calloutY: 200, recommendedExercise: 'Biceps Barbell Curl' },
    { group: 'abs', label: 'Core (Six-Pack Abs)', view: 'front', cx: 200, cy: 220, calloutSide: 'left', calloutY: 270, recommendedExercise: 'Cable Crunch' },
    { group: 'quads', label: 'Quads (Quadriceps)', view: 'front', cx: 175, cy: 330, calloutSide: 'left', calloutY: 340, recommendedExercise: 'Barbell Back Squat' },
    { group: 'back', label: 'Lats & Traps (Back)', view: 'back', cx: 200, cy: 150, calloutSide: 'right', calloutY: 120, recommendedExercise: 'Deadlift' },
    { group: 'triceps', label: 'Triceps Horseshoe', view: 'back', cx: 272, cy: 175, calloutSide: 'right', calloutY: 190, recommendedExercise: 'Triceps Dip' },
    { group: 'hamstrings', label: 'Hamstrings & Glutes', view: 'back', cx: 220, cy: 330, calloutSide: 'right', calloutY: 310, recommendedExercise: 'Romanian Deadlift' },
    { group: 'calves', label: 'Calves (Gastrocnemius)', view: 'back', cx: 225, cy: 430, calloutSide: 'right', calloutY: 410, recommendedExercise: 'Standing Calf Raise' },
  ];

  const filteredNodes = muscleNodes.filter((n) => n.view === bodyView);
  const activeNode = muscleNodes.find((n) => n.group === selectedMuscle) || muscleNodes[0];

  const getGlowColor = (level: number) => {
    if (level <= 2) return '#10B981'; // emerald
    if (level <= 5) return '#06B6D4'; // cyan
    if (level <= 8) return '#F59E0B'; // amber
    return '#E03E2D'; // rose/coral
  };

  const activeGlow = getGlowColor(activeProgression.level);

  return (
    <div className="bg-slate-950 dark:bg-[#070C14] text-white rounded-3xl p-4 sm:p-7 border border-slate-800/80 shadow-2xl relative overflow-hidden font-sans space-y-6">
      {/* Subtle Background HUD Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

      {/* Top Tesla Cockpit HUD Header Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3 relative z-10 font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-[#E03E2D] border border-rose-500/30">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">PRECISION ANATOMY HUD</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-sans">
              Interactive Body &amp; Muscle Growth Blueprint
            </h2>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end text-xs font-bold">
          <div className="flex items-center bg-slate-900/90 rounded-2xl p-1 border border-slate-800">
            <button
              onClick={() => {
                setBodyView('front');
                if (bodyView === 'back') setSelectedMuscle('chest');
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                bodyView === 'front' ? 'bg-[#E03E2D] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Anterior (Front View)
            </button>
            <button
              onClick={() => {
                setBodyView('back');
                if (bodyView === 'front') setSelectedMuscle('back');
              }}
              className={`px-3 py-1.5 rounded-xl transition ${
                bodyView === 'back' ? 'bg-[#E03E2D] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Posterior (Back View)
            </button>
          </div>
        </div>
      </div>

      {/* Main Cockpit Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Side: Tesla Circular Targeted Muscle Zoom Callout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden space-y-4">
            {/* Circle Targeted Preview */}
            <div className="flex items-center space-x-4">
              <div
                className="w-24 h-24 rounded-full border-2 flex items-center justify-center relative overflow-hidden shrink-0 transition-transform duration-500 shadow-xl"
                style={{ borderColor: activeGlow, boxShadow: `0 0 25px ${activeGlow}40` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 opacity-90" />
                <Dumbbell className="w-10 h-10 relative z-10" style={{ color: activeGlow }} />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
                  style={{ backgroundColor: activeGlow }}
                />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400 block">
                  Target Muscle Belly
                </span>
                <h3 className="text-lg font-black text-white font-sans">{activeProgression.displayName}</h3>
                <span
                  className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border"
                  style={{
                    backgroundColor: `${activeGlow}20`,
                    borderColor: `${activeGlow}50`,
                    color: activeGlow,
                  }}
                >
                  {activeProgression.levelTitle}
                </span>
              </div>
            </div>

            {/* Level Growth Bar */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px] font-bold">Growth to Level {Math.min(10, activeProgression.level + 1)}</span>
                <span className="font-extrabold text-white">{activeProgression.progressToNextLevel}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${activeProgression.progressToNextLevel}%`,
                    backgroundColor: activeGlow,
                    boxShadow: `0 0 10px ${activeGlow}`,
                  }}
                />
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-mono pt-1 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Volume Lifted</span>
                <span className="text-sm font-extrabold text-emerald-400">{activeProgression.totalVolumeKg.toLocaleString()} kg</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Max Lift (PR)</span>
                <span className="text-sm font-extrabold text-amber-400">{activeProgression.maxWeightKg} kg</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Sets</span>
                <span className="text-sm font-extrabold text-cyan-400">{activeProgression.totalSets} sets</span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Recovery State</span>
                <span className="text-[11px] font-extrabold capitalize text-white flex items-center space-x-1 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeProgression.recoveryState === 'fatigued'
                        ? 'bg-rose-500'
                        : activeProgression.recoveryState === 'primed'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span>{activeProgression.recoveryState}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setSelectedExerciseChart(activeNode.recommendedExercise)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 transition flex items-center justify-center space-x-2"
            >
              <span>View Strength Curve Graph</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Precision High-Detail Anatomical Vector Body Blueprint Diagram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-2">
          <div className="relative w-full max-w-[380px] aspect-[3/4] flex items-center justify-center">
            
            <svg viewBox="0 0 400 520" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0B1324" stopOpacity="0.95" />
                </linearGradient>

                <filter id="hudGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Body Silhouette Contour */}
              <g fill="url(#bodyBaseGrad)" stroke="#334155" strokeWidth="1.5">
                {/* Head & Neck */}
                <path d="M 200 20 C 180 20 172 35 172 52 C 172 70 182 82 200 82 C 218 82 228 70 228 52 C 228 35 220 20 200 20 Z" />
                <path d="M 188 82 L 184 98 L 216 98 L 212 82 Z" />

                {/* Torso */}
                <path d="M 184 98 C 160 98 128 108 122 135 C 118 155 125 210 135 248 C 145 270 160 285 200 285 C 240 285 255 270 265 248 C 275 210 282 155 278 135 C 272 108 240 98 216 98 Z" />

                {/* Left Arm */}
                <path d="M 122 135 C 112 145 100 185 92 230 C 88 250 86 280 94 285 C 102 290 112 265 118 245 C 128 200 135 160 135 145 Z" />

                {/* Right Arm */}
                <path d="M 278 135 C 288 145 300 185 308 230 C 312 250 314 280 306 285 C 298 290 288 265 282 245 C 272 200 265 160 265 145 Z" />

                {/* Legs */}
                <path d="M 152 285 L 140 370 L 138 480 C 138 495 160 500 170 500 C 180 500 188 475 190 410 L 195 285 Z" />
                <path d="M 248 285 L 260 370 L 262 480 C 262 495 240 500 230 500 C 220 500 212 475 210 410 L 205 285 Z" />
              </g>

              {/* Detailed Precision Anatomical Muscle Belly Striation Lines & Highlights */}
              {bodyView === 'front' ? (
                <g stroke="#475569" strokeWidth="1" fill="none" opacity="0.8 border-slate-700">
                  {/* Pectoralis Major (Chest) Muscle Lines */}
                  <path
                    d="M 145 125 C 170 130 195 135 198 158 C 198 175 170 185 145 170 C 135 155 138 135 145 125 Z"
                    fill={selectedMuscle === 'chest' ? `${getGlowColor(allProgression.chest.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'chest' ? getGlowColor(allProgression.chest.level) : '#475569'}
                    strokeWidth={selectedMuscle === 'chest' ? '2' : '1'}
                  />
                  <path
                    d="M 255 125 C 230 130 205 135 202 158 C 202 175 230 185 255 170 C 265 155 262 135 255 125 Z"
                    fill={selectedMuscle === 'chest' ? `${getGlowColor(allProgression.chest.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'chest' ? getGlowColor(allProgression.chest.level) : '#475569'}
                    strokeWidth={selectedMuscle === 'chest' ? '2' : '1'}
                  />
                  <path d="M 155 140 Q 180 145 196 148" />
                  <path d="M 245 140 Q 220 145 204 148" />
                  <path d="M 150 155 Q 175 160 196 165" />
                  <path d="M 250 155 Q 225 160 204 165" />

                  {/* Deltoids (Shoulders) Muscle Caps */}
                  <path
                    d="M 124 110 C 132 104 146 112 144 135 C 140 148 128 142 122 130 Z"
                    fill={selectedMuscle === 'shoulders' ? `${getGlowColor(allProgression.shoulders.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'shoulders' ? getGlowColor(allProgression.shoulders.level) : '#475569'}
                  />
                  <path
                    d="M 276 110 C 268 104 254 112 256 135 C 260 148 272 142 278 130 Z"
                    fill={selectedMuscle === 'shoulders' ? `${getGlowColor(allProgression.shoulders.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'shoulders' ? getGlowColor(allProgression.shoulders.level) : '#475569'}
                  />

                  {/* Rectus Abdominis (Six-Pack Core) */}
                  <g
                    fill={selectedMuscle === 'abs' ? `${getGlowColor(allProgression.abs.level)}40` : '#1e293b30'}
                    stroke={selectedMuscle === 'abs' ? getGlowColor(allProgression.abs.level) : '#475569'}
                    strokeWidth={selectedMuscle === 'abs' ? '1.5' : '1'}
                  >
                    <rect x="180" y="190" width="18" height="18" rx="4" />
                    <rect x="202" y="190" width="18" height="18" rx="4" />
                    <rect x="180" y="212" width="18" height="18" rx="4" />
                    <rect x="202" y="212" width="18" height="18" rx="4" />
                    <rect x="182" y="234" width="16" height="20" rx="4" />
                    <rect x="202" y="234" width="16" height="20" rx="4" />
                  </g>

                  {/* Biceps Brachii Bellies */}
                  <path
                    d="M 120 142 C 114 155 110 185 120 200 C 126 195 132 170 130 150 Z"
                    fill={selectedMuscle === 'biceps' ? `${getGlowColor(allProgression.biceps.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'biceps' ? getGlowColor(allProgression.biceps.level) : '#475569'}
                  />
                  <path
                    d="M 280 142 C 286 155 290 185 280 200 C 274 195 268 170 270 150 Z"
                    fill={selectedMuscle === 'biceps' ? `${getGlowColor(allProgression.biceps.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'biceps' ? getGlowColor(allProgression.biceps.level) : '#475569'}
                  />

                  {/* Quadriceps (Thighs) Muscle Bellies */}
                  <path
                    d="M 155 295 C 145 320 142 370 162 390 C 172 385 185 340 188 300 Z"
                    fill={selectedMuscle === 'quads' ? `${getGlowColor(allProgression.quads.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'quads' ? getGlowColor(allProgression.quads.level) : '#475569'}
                  />
                  <path
                    d="M 245 295 C 255 320 258 370 238 390 C 228 385 215 340 212 300 Z"
                    fill={selectedMuscle === 'quads' ? `${getGlowColor(allProgression.quads.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'quads' ? getGlowColor(allProgression.quads.level) : '#475569'}
                  />
                </g>
              ) : (
                <g stroke="#475569" strokeWidth="1" fill="none" opacity="0.8">
                  {/* Trapezius & Lats (Back) */}
                  <path
                    d="M 200 82 L 175 110 L 200 160 L 225 110 Z"
                    fill={selectedMuscle === 'back' ? `${getGlowColor(allProgression.back.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'back' ? getGlowColor(allProgression.back.level) : '#475569'}
                  />
                  <path
                    d="M 145 125 C 170 135 195 150 190 220 C 160 210 135 170 135 145 Z"
                    fill={selectedMuscle === 'back' ? `${getGlowColor(allProgression.back.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'back' ? getGlowColor(allProgression.back.level) : '#475569'}
                  />
                  <path
                    d="M 255 125 C 230 135 205 150 210 220 C 240 210 265 170 265 145 Z"
                    fill={selectedMuscle === 'back' ? `${getGlowColor(allProgression.back.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'back' ? getGlowColor(allProgression.back.level) : '#475569'}
                  />

                  {/* Triceps Horseshoe Bellies */}
                  <path
                    d="M 115 142 C 105 155 100 185 112 205 C 122 195 128 170 125 150 Z"
                    fill={selectedMuscle === 'triceps' ? `${getGlowColor(allProgression.triceps.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'triceps' ? getGlowColor(allProgression.triceps.level) : '#475569'}
                  />
                  <path
                    d="M 285 142 C 295 155 300 185 288 205 C 278 195 272 170 275 150 Z"
                    fill={selectedMuscle === 'triceps' ? `${getGlowColor(allProgression.triceps.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'triceps' ? getGlowColor(allProgression.triceps.level) : '#475569'}
                  />

                  {/* Hamstrings & Glutes */}
                  <path
                    d="M 158 290 C 148 325 145 375 168 395 C 182 390 192 345 195 295 Z"
                    fill={selectedMuscle === 'hamstrings' ? `${getGlowColor(allProgression.hamstrings.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'hamstrings' ? getGlowColor(allProgression.hamstrings.level) : '#475569'}
                  />
                  <path
                    d="M 242 290 C 252 325 255 375 232 395 C 218 390 208 345 205 295 Z"
                    fill={selectedMuscle === 'hamstrings' ? `${getGlowColor(allProgression.hamstrings.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'hamstrings' ? getGlowColor(allProgression.hamstrings.level) : '#475569'}
                  />

                  {/* Calves (Gastrocnemius Diamond Head) */}
                  <path
                    d="M 145 420 C 135 440 142 470 162 475 C 175 465 178 440 172 420 Z"
                    fill={selectedMuscle === 'calves' ? `${getGlowColor(allProgression.calves.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'calves' ? getGlowColor(allProgression.calves.level) : '#475569'}
                  />
                  <path
                    d="M 255 420 C 265 440 258 470 238 475 C 225 465 222 440 228 420 Z"
                    fill={selectedMuscle === 'calves' ? `${getGlowColor(allProgression.calves.level)}40` : '#1e293b40'}
                    stroke={selectedMuscle === 'calves' ? getGlowColor(allProgression.calves.level) : '#475569'}
                  />
                </g>
              )}

              {/* Dynamic Glowing Muscle Hotspot Pointer Lines */}
              {filteredNodes.map((node) => {
                const prog = allProgression[node.group];
                const isSelected = selectedMuscle === node.group;
                const color = getGlowColor(prog.level);

                return (
                  <g key={node.group} onClick={() => setSelectedMuscle(node.group)} className="cursor-pointer group">
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? 18 + prog.level : 10 + Math.min(4, prog.level)}
                      fill={color}
                      fillOpacity={isSelected ? 0.45 : 0.2}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-500 group-hover:scale-125"
                      filter="url(#hudGlowFilter)"
                    />
                    <circle cx={node.cx} cy={node.cy} r="4" fill={color} />

                    <line
                      x1={node.cx}
                      y1={node.cy}
                      x2={node.calloutSide === 'left' ? 40 : 360}
                      y2={node.calloutY}
                      stroke={color}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '3,3'}
                      strokeOpacity={isSelected ? 0.95 : 0.4}
                    />

                    <circle
                      cx={node.calloutSide === 'left' ? 40 : 360}
                      cy={node.calloutY}
                      r="3"
                      fill={color}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Interactive Muscle Group Selector Buttons */}
        <div className="lg:col-span-3 space-y-2.5 font-mono text-xs">
          <span className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider block mb-1">
            Select Muscle Group
          </span>

          {muscleNodes.map((node) => {
            const prog = allProgression[node.group];
            const isSelected = selectedMuscle === node.group;
            const color = getGlowColor(prog.level);

            return (
              <button
                key={node.group}
                onClick={() => {
                  setSelectedMuscle(node.group);
                  setBodyView(node.view);
                }}
                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white border-rose-500/80 shadow-lg shadow-rose-500/10 font-extrabold scale-[1.02]'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-sans text-xs font-bold truncate">{node.label}</span>
                </div>

                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Lvl {prog.level}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
