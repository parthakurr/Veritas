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
    { group: 'shoulders', label: 'Delts (Shoulders)', view: 'front', cx: 145, cy: 130, calloutSide: 'left', calloutY: 60, recommendedExercise: 'Overhead Shoulder Press' },
    { group: 'biceps', label: 'Biceps', view: 'front', cx: 135, cy: 185, calloutSide: 'left', calloutY: 200, recommendedExercise: 'Biceps Barbell Curl' },
    { group: 'abs', label: 'Core (Abs)', view: 'front', cx: 200, cy: 220, calloutSide: 'left', calloutY: 270, recommendedExercise: 'Cable Crunch' },
    { group: 'quads', label: 'Quads (Legs)', view: 'front', cx: 175, cy: 330, calloutSide: 'left', calloutY: 340, recommendedExercise: 'Barbell Back Squat' },
    { group: 'back', label: 'Back (Lats & Traps)', view: 'back', cx: 200, cy: 160, calloutSide: 'right', calloutY: 120, recommendedExercise: 'Deadlift' },
    { group: 'triceps', label: 'Triceps', view: 'back', cx: 265, cy: 180, calloutSide: 'right', calloutY: 190, recommendedExercise: 'Triceps Dip' },
    { group: 'hamstrings', label: 'Hamstrings & Glutes', view: 'back', cx: 220, cy: 330, calloutSide: 'right', calloutY: 310, recommendedExercise: 'Romanian Deadlift' },
    { group: 'calves', label: 'Calves', view: 'back', cx: 225, cy: 430, calloutSide: 'right', calloutY: 410, recommendedExercise: 'Standing Calf Raise' },
  ];

  const filteredNodes = muscleNodes.filter((n) => n.view === bodyView);
  const activeNode = muscleNodes.find((n) => n.group === selectedMuscle) || muscleNodes[0];

  // Glow color by level
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
              <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-wider">VERITAS ANATOMY HUD</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-sans">
              Interactive Body &amp; Muscle Growth Blueprint
            </h2>
          </div>
        </div>

        {/* View Controls & Status Badges */}
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
              Front Body
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
              Back Body
            </button>
          </div>
        </div>
      </div>

      {/* Main Cockpit Display (Central Blueprint + Tesla Style Circular Zoom Callout & Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Side: Tesla Circular Targeted Muscle Zoom Callout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/80 rounded-3xl p-5 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden space-y-4">
            {/* Circle Targeted Preview (Matching Tesla Control Circle) */}
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
                  Target Muscle Group
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
                <span className="text-slate-400 text-[11px] font-bold">Progression to Level {Math.min(10, activeProgression.level + 1)}</span>
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
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Total Volume</span>
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

        {/* Center: Tesla Style Anatomical Vector Blueprint Diagram */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
          <div className="relative w-full max-w-[360px] aspect-[3/4] flex items-center justify-center">
            
            {/* SVG Anatomical Human Body Vector Schematic */}
            <svg viewBox="0 0 400 520" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Body Silhouette Outline */}
              <g fill="url(#bodyGrad)" stroke="#334155" strokeWidth="2">
                {/* Head */}
                <circle cx="200" cy="50" r="28" stroke="#475569" />

                {/* Neck */}
                <rect x="188" y="76" width="24" height="20" rx="4" />

                {/* Torso / Upper Body */}
                <path d="M 130 96 L 270 96 L 250 250 L 150 250 Z" rx="10" />

                {/* Left Arm */}
                <path d="M 130 96 L 100 110 L 90 220 L 115 220 L 140 140 Z" />

                {/* Right Arm */}
                <path d="M 270 96 L 300 110 L 310 220 L 285 220 L 260 140 Z" />

                {/* Pelvis */}
                <path d="M 150 250 L 250 250 L 235 290 L 165 290 Z" />

                {/* Left Leg */}
                <path d="M 165 290 L 145 420 L 140 490 L 175 490 L 195 420 L 198 290 Z" />

                {/* Right Leg */}
                <path d="M 235 290 L 255 420 L 260 490 L 225 490 L 205 420 L 202 290 Z" />
              </g>

              {/* Dynamic Glowing Muscle Nodes & Pointer Lines */}
              {filteredNodes.map((node) => {
                const prog = allProgression[node.group];
                const isSelected = selectedMuscle === node.group;
                const color = getGlowColor(prog.level);

                return (
                  <g key={node.group} onClick={() => setSelectedMuscle(node.group)} className="cursor-pointer group">
                    {/* Glowing Aura Ring */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? 22 + prog.level : 14 + Math.min(6, prog.level)}
                      fill={color}
                      fillOpacity={isSelected ? 0.35 : 0.15}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-500 group-hover:scale-125"
                      filter="url(#glow)"
                    />

                    {/* Inner Target Pulse Dot */}
                    <circle cx={node.cx} cy={node.cy} r="5" fill={color} />

                    {/* HUD Pointer Pointer Line */}
                    <line
                      x1={node.cx}
                      y1={node.cy}
                      x2={node.calloutSide === 'left' ? 40 : 360}
                      y2={node.calloutY}
                      stroke={color}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '3,3'}
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                    />

                    {/* HUD Endpoint Dot */}
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
