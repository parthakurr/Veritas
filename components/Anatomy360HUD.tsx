'use client';

import React, { useState, useEffect } from 'react';
import { Dumbbell, RotateCw, Play, Pause, Zap, Plus, Layers, Target, Activity } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup } from '@/types/workout';
import { QuickLogModal } from '@/components/QuickLogModal';

export const Anatomy360HUD: React.FC = () => {
  const { getMuscleProgression, getAllMusclesProgression } = useWorkout();
  const [rotationAngle, setRotationAngle] = useState<number>(0); // 0 to 360 degrees
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [activeMuscle, setActiveMuscle] = useState<MuscleGroup>('chest');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);

  const allProgression = getAllMusclesProgression();

  // Auto-rotate 360 degrees
  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const isBackView = rotationAngle > 90 && rotationAngle < 270;

  const handleMuscleClick = (mg: MuscleGroup) => {
    setActiveMuscle(mg);
    setIsQuickLogOpen(true);
  };

  // Laser Pointer Callouts (Matching Reference Images 1 & 2)
  const calloutTargets: Array<{
    group: MuscleGroup;
    splitName: string;
    label: string;
    viewSide: 'front' | 'back';
    cx: number;
    cy: number;
    calloutX: number;
    calloutY: number;
    pointerSide: 'left' | 'right';
  }> = [
    { group: 'chest', splitName: 'PUSH DAY / CHEST', label: 'PECTORALIS MAJOR', viewSide: 'front', cx: 200, cy: 148, calloutX: 45, calloutY: 130, pointerSide: 'left' },
    { group: 'abs', splitName: 'CORE / ABS', label: 'RECTUS ABDOMINIS', viewSide: 'front', cx: 200, cy: 225, calloutX: 45, calloutY: 230, pointerSide: 'left' },
    { group: 'quads', splitName: 'LEGS DAY / QUADS', label: 'QUADRICEPS FEMORIS', viewSide: 'front', cx: 165, cy: 335, calloutX: 45, calloutY: 340, pointerSide: 'left' },
    { group: 'shoulders', splitName: 'PUSH DAY / SHOULDERS', label: 'DELTOIDS', viewSide: 'front', cx: 142, cy: 120, calloutX: 355, calloutY: 100, pointerSide: 'right' },
    { group: 'biceps', splitName: 'PULL DAY / BICEPS', label: 'BICEPS BRACHII', viewSide: 'front', cx: 126, cy: 190, calloutX: 355, calloutY: 190, pointerSide: 'right' },
    
    { group: 'back', splitName: 'PULL DAY / LATS & TRAPS', label: 'TRAPEZIUS & LATISSIMUS', viewSide: 'back', cx: 200, cy: 140, calloutX: 355, calloutY: 120, pointerSide: 'right' },
    { group: 'triceps', splitName: 'PUSH DAY / TRICEPS', label: 'TRICEPS BRACHII', viewSide: 'back', cx: 274, cy: 180, calloutX: 355, calloutY: 200, pointerSide: 'right' },
    { group: 'hamstrings', splitName: 'LEGS DAY / HAMSTRINGS', label: 'HAMSTRINGS & GLUTES', viewSide: 'back', cx: 220, cy: 330, calloutX: 45, calloutY: 320, pointerSide: 'left' },
    { group: 'calves', splitName: 'LEGS DAY / CALVES', label: 'GASTROCNEMIUS', viewSide: 'back', cx: 225, cy: 425, calloutX: 45, calloutY: 410, pointerSide: 'left' },
  ];

  const currentCalls = calloutTargets.filter((c) => (isBackView ? c.viewSide === 'back' : c.viewSide === 'front'));

  return (
    <div className="bg-[#020914] text-white rounded-3xl p-4 sm:p-7 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden font-sans space-y-6">
      {/* Background Matrix Dot Grid Overlay (Exact Match to Image 1 & 2) */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1.2px,transparent_1.2px)] [background-size:22px_22px] opacity-20 pointer-events-none" />

      {/* Top Sci-Fi Holographic HUD Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/30 pb-4 gap-3 relative z-10 font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 animate-pulse text-[#00f0ff]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold text-[#00f0ff] tracking-widest">
                VERITAS 360° NEON BLUE BLUEPRINT
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-sans">
              Interactive Holographic Muscle Map
            </h2>
          </div>
        </div>

        {/* 360° Rotation Controls */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-bold transition shadow-md"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotate ? 'Pause 360° Spin' : 'Auto 360° Spin'}</span>
          </button>

          <span className="text-[11px] font-extrabold text-[#00f0ff] bg-cyan-950/90 px-3 py-1.5 rounded-xl border border-cyan-500/40 font-mono">
            {Math.round(rotationAngle)}° {isBackView ? 'POSTERIOR' : 'ANTERIOR'}
          </span>
        </div>
      </div>

      {/* Main 360° Holographic Display Viewport */}
      <div className="relative min-h-[520px] flex items-center justify-center py-4">
        
        {/* Holographic Pedestal Oval Ring at Feet (Exact Match to Image 1 & 2) */}
        <div className="absolute bottom-4 w-80 h-16 rounded-full border-2 border-[#00f0ff]/80 bg-cyan-500/10 shadow-[0_0_40px_rgba(0,240,255,0.4)] transform rotate-x-65 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-12 rounded-full border border-[#00f0ff]/40 animate-pulse" />
        </div>

        {/* Callout Pointer Cards Grid (Left & Right Panels) */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 items-center gap-4 relative z-20">
          
          {/* Left Callouts Stack */}
          <div className="md:col-span-3 space-y-3 z-30">
            {currentCalls
              .filter((c) => c.pointerSide === 'left')
              .map((c) => {
                const prog = allProgression[c.group];
                const isSelected = activeMuscle === c.group;
                return (
                  <div
                    key={c.group}
                    onClick={() => handleMuscleClick(c.group)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/90 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.03]'
                        : 'bg-slate-950/80 border-cyan-500/30 hover:border-[#00f0ff]/70 hover:bg-cyan-950/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-[#00f0ff] tracking-wider block">
                        {c.splitName}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-[#00f0ff]" />
                    </div>
                    <h4 className="text-xs font-black text-white font-mono mt-0.5">{c.label}</h4>
                    <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-[#00f0ff] font-extrabold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Center 360° Neon Cyan Stylized Vector Blueprint Model (Exact Match to Image 1) */}
          <div className="md:col-span-6 flex justify-center relative py-2">
            <div
              className="relative w-full max-w-[340px] aspect-[3/4] transition-transform duration-75"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <svg viewBox="0 0 400 520" className="w-full h-full drop-shadow-[0_0_25px_rgba(0,240,255,0.5)]">
                <defs>
                  <filter id="neonBlueGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <linearGradient id="neonFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0088ff" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {/* Stylized Neon Vector Body Outline & Muscles (Matching Image 1 EXACTLY) */}
                <g stroke="#00f0ff" strokeWidth="1.8" fill="none" filter="url(#neonBlueGlow)">
                  
                  {/* Stylized Head: Circle + Center Vertical Dashed Line + Curved Eye Line + Neck Stand */}
                  <g>
                    <circle cx="200" cy="50" r="28" fill="rgba(0, 240, 255, 0.08)" stroke="#00f0ff" strokeWidth="2" />
                    <line x1="200" y1="22" x2="200" y2="78" stroke="#00f0ff" strokeWidth="1.2" strokeDasharray="3,2" />
                    <path d="M 182 52 Q 200 44 218 52" stroke="#00f0ff" strokeWidth="1.6" fill="none" />
                    <path d="M 182 52 Q 200 60 218 52" stroke="#00f0ff" strokeWidth="1.6" fill="none" />
                    {/* Neck Pedestal Stand */}
                    <path d="M 186 78 L 182 96 L 218 96 L 214 78 Z" fill="rgba(0, 240, 255, 0.15)" stroke="#00f0ff" strokeWidth="1.8" />
                  </g>

                  {!isBackView ? (
                    <>
                      {/* Sculpted Chest (Pectorals Dual Plates) */}
                      <path
                        d="M 142 115 C 170 120 196 128 198 155 C 198 175 168 185 140 168 C 132 150 135 125 142 115 Z"
                        fill={activeMuscle === 'chest' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.18)'}
                        stroke="#00f0ff"
                        strokeWidth="2.2"
                      />
                      <path
                        d="M 258 115 C 230 120 204 128 202 155 C 202 175 232 185 260 168 C 268 150 265 125 258 115 Z"
                        fill={activeMuscle === 'chest' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.18)'}
                        stroke="#00f0ff"
                        strokeWidth="2.2"
                      />
                      <path d="M 152 135 Q 180 140 196 145" strokeWidth="1.2" />
                      <path d="M 248 135 Q 220 140 204 145" strokeWidth="1.2" />

                      {/* Deltoids (Teardrop Shoulder Caps) */}
                      <path
                        d="M 124 104 C 134 98 148 108 144 132 C 138 145 126 140 120 126 Z"
                        fill={activeMuscle === 'shoulders' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.18)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 276 104 C 266 98 252 108 256 132 C 262 145 274 140 280 126 Z"
                        fill={activeMuscle === 'shoulders' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.18)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />

                      {/* Abdominals (6 Distinct Rounded Rectangles - Matching Image 1) */}
                      <g fill={activeMuscle === 'abs' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.15)'} stroke="#00f0ff" strokeWidth="2">
                        <rect x="176" y="195" width="20" height="18" rx="4" />
                        <rect x="204" y="195" width="20" height="18" rx="4" />
                        <rect x="176" y="217" width="20" height="18" rx="4" />
                        <rect x="204" y="217" width="20" height="18" rx="4" />
                        <rect x="178" y="239" width="18" height="20" rx="4" />
                        <rect x="204" y="239" width="18" height="20" rx="4" />
                      </g>

                      {/* Biceps & Forearms Outer Segments */}
                      <path
                        d="M 118 140 C 112 155 106 190 118 206 C 126 200 132 172 128 148 Z"
                        fill={activeMuscle === 'biceps' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.15)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 282 140 C 288 155 294 190 282 206 C 274 200 268 172 272 148 Z"
                        fill={activeMuscle === 'biceps' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.15)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />

                      {/* Quads / Legs (Tapered Leg Columns with Inner Teardrop Quads - Matching Image 1) */}
                      <g stroke="#00f0ff" strokeWidth="2">
                        {/* Outer Left Leg Column */}
                        <path d="M 152 285 L 140 375 L 138 480 C 138 495 160 498 172 498 C 182 498 190 475 192 410 L 196 285 Z" fill="rgba(0, 240, 255, 0.08)" />
                        {/* Inner Teardrop Left Quad */}
                        <path
                          d="M 154 295 C 146 325 144 370 165 388 C 175 382 186 340 188 300 Z"
                          fill={activeMuscle === 'quads' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.22)'}
                          stroke="#00f0ff"
                          strokeWidth="2.2"
                        />

                        {/* Outer Right Leg Column */}
                        <path d="M 248 285 L 260 375 L 262 480 C 262 495 240 498 228 498 C 218 498 210 475 208 410 L 204 285 Z" fill="rgba(0, 240, 255, 0.08)" />
                        {/* Inner Teardrop Right Quad */}
                        <path
                          d="M 246 295 C 254 325 256 370 235 388 C 225 382 214 340 212 300 Z"
                          fill={activeMuscle === 'quads' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.22)'}
                          stroke="#00f0ff"
                          strokeWidth="2.2"
                        />
                      </g>
                    </>
                  ) : (
                    <>
                      {/* Back View: Trapezius & Lats */}
                      <path
                        d="M 200 82 L 175 110 L 200 160 L 225 110 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 145 125 C 170 135 195 150 190 220 C 160 210 135 170 135 145 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 255 125 C 230 135 205 150 210 220 C 240 210 265 170 265 145 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />

                      {/* Triceps Horseshoe */}
                      <path
                        d="M 115 142 C 105 155 100 185 112 205 C 122 195 128 170 125 150 Z"
                        fill={activeMuscle === 'triceps' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 285 142 C 295 155 300 185 288 205 C 278 195 272 170 275 150 Z"
                        fill={activeMuscle === 'triceps' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />

                      {/* Hamstrings & Calves */}
                      <path
                        d="M 158 290 C 148 325 145 375 168 395 C 182 390 192 345 195 295 Z"
                        fill={activeMuscle === 'hamstrings' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 242 290 C 252 325 255 375 232 395 C 218 390 208 345 205 295 Z"
                        fill={activeMuscle === 'hamstrings' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 145 420 C 135 440 142 470 162 475 C 175 465 178 440 172 420 Z"
                        fill={activeMuscle === 'calves' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                      <path
                        d="M 255 420 C 265 440 258 470 238 475 C 225 465 222 440 228 420 Z"
                        fill={activeMuscle === 'calves' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(0, 240, 255, 0.2)'}
                        stroke="#00f0ff"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </g>

                {/* Laser Target Nodes & Pointer Lines (Exact Match to Image 1) */}
                {currentCalls.map((c) => {
                  const isSelected = activeMuscle === c.group;
                  return (
                    <g key={c.group} onClick={() => handleMuscleClick(c.group)} className="cursor-pointer">
                      {/* Laser Outer Glow Ring */}
                      <circle
                        cx={c.cx}
                        cy={c.cy}
                        r={isSelected ? 16 : 10}
                        fill="#00f0ff"
                        fillOpacity={isSelected ? 0.6 : 0.25}
                        stroke="#00f0ff"
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter="url(#neonBlueGlow)"
                      />
                      {/* Laser Inner Solid Target Dot */}
                      <circle cx={c.cx} cy={c.cy} r="4" fill="#00f0ff" />

                      {/* Laser Pointer Line to Callout Box */}
                      <line
                        x1={c.cx}
                        y1={c.cy}
                        x2={c.pointerSide === 'left' ? 45 : 355}
                        y2={c.calloutY}
                        stroke="#00f0ff"
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={isSelected ? 'none' : '3,3'}
                        strokeOpacity={isSelected ? 1 : 0.5}
                      />
                      <circle cx={c.pointerSide === 'left' ? 45 : 355} cy={c.calloutY} r="3" fill="#00f0ff" />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Callouts Stack */}
          <div className="md:col-span-3 space-y-3 z-30">
            {currentCalls
              .filter((c) => c.pointerSide === 'right')
              .map((c) => {
                const prog = allProgression[c.group];
                const isSelected = activeMuscle === c.group;
                return (
                  <div
                    key={c.group}
                    onClick={() => handleMuscleClick(c.group)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/90 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.03]'
                        : 'bg-slate-950/80 border-cyan-500/30 hover:border-[#00f0ff]/70 hover:bg-cyan-950/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-[#00f0ff] tracking-wider block">
                        {c.splitName}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-[#00f0ff]" />
                    </div>
                    <h4 className="text-xs font-black text-white font-mono mt-0.5">{c.label}</h4>
                    <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-[#00f0ff] font-extrabold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Rotation Range Slider */}
      <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 max-w-md mx-auto relative z-10 font-mono">
        <RotateCw className="w-4 h-4 text-[#00f0ff] shrink-0" />
        <input
          type="range"
          min="0"
          max="360"
          value={rotationAngle}
          onChange={(e) => {
            setIsAutoRotate(false);
            setRotationAngle(parseFloat(e.target.value));
          }}
          className="w-full accent-[#00f0ff] cursor-pointer"
        />
        <span className="text-xs font-extrabold text-[#00f0ff] w-12 text-right">{Math.round(rotationAngle)}°</span>
      </div>

      {/* Quick Set Logger Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        muscleGroup={activeMuscle}
      />
    </div>
  );
};
