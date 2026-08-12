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
      setRotationAngle((prev) => (prev + 1.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  // Determine front vs back view based on 360 degree angle
  const isBackView = rotationAngle > 90 && rotationAngle < 270;

  const handleMuscleClick = (mg: MuscleGroup) => {
    setActiveMuscle(mg);
    setIsQuickLogOpen(true);
  };

  // Callout definition matching reference image
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
    { group: 'chest', splitName: 'PUSH DAY / CHEST', label: 'PECTORALIS MAJOR', viewSide: 'front', cx: 200, cy: 155, calloutX: 50, calloutY: 130, pointerSide: 'left' },
    { group: 'abs', splitName: 'CORE / ABS', label: 'RECTUS ABDOMINIS', viewSide: 'front', cx: 200, cy: 220, calloutX: 50, calloutY: 230, pointerSide: 'left' },
    { group: 'quads', splitName: 'LEGS DAY / QUADS', label: 'QUADRICEPS FEMORIS', viewSide: 'front', cx: 175, cy: 330, calloutX: 50, calloutY: 350, pointerSide: 'left' },
    { group: 'shoulders', splitName: 'PUSH DAY / SHOULDERS', label: 'DELTOIDS', viewSide: 'front', cx: 140, cy: 125, calloutX: 350, calloutY: 100, pointerSide: 'right' },
    { group: 'biceps', splitName: 'PULL DAY / BICEPS', label: 'BICEPS BRACHII', viewSide: 'front', cx: 130, cy: 185, calloutX: 350, calloutY: 180, pointerSide: 'right' },
    
    { group: 'back', splitName: 'PULL DAY / LATS & TRAPS', label: 'LATISSIMUS DORSI & TRAPEZIUS', viewSide: 'back', cx: 200, cy: 150, calloutX: 350, calloutY: 120, pointerSide: 'right' },
    { group: 'triceps', splitName: 'PUSH DAY / TRICEPS', label: 'TRICEPS BRACHII', viewSide: 'back', cx: 272, cy: 175, calloutX: 350, calloutY: 200, pointerSide: 'right' },
    { group: 'hamstrings', splitName: 'LEGS DAY / HAMSTRINGS', label: 'HAMSTRINGS & GLUTES', viewSide: 'back', cx: 220, cy: 330, calloutX: 50, calloutY: 320, pointerSide: 'left' },
    { group: 'calves', splitName: 'LEGS DAY / CALVES', label: 'GASTROCNEMIUS', viewSide: 'back', cx: 225, cy: 430, calloutX: 50, calloutY: 420, pointerSide: 'left' },
  ];

  const currentCalls = calloutTargets.filter((c) => (isBackView ? c.viewSide === 'back' : c.viewSide === 'front'));

  return (
    <div className="bg-[#020914] text-white rounded-3xl p-4 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden font-sans space-y-6">
      {/* Background Holographic Grid Floor & Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-cyan-950/40 via-cyan-900/10 to-transparent pointer-events-none" />

      {/* Top Sci-Fi Holographic HUD Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-500/20 pb-4 gap-3 relative z-10 font-mono">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-extrabold text-cyan-400 tracking-widest">
                VERITAS 360° HOLOGRAPHIC BLUE ANATOMY
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-white font-sans">
              360° Interactive Muscle Blueprint
            </h2>
          </div>
        </div>

        {/* 360° Rotation Controls */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end text-xs">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-bold transition"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotate ? 'Pause 360° Spin' : 'Auto 360° Spin'}</span>
          </button>

          <span className="text-[11px] font-extrabold text-cyan-400 bg-cyan-950/80 px-3 py-1.5 rounded-xl border border-cyan-500/30">
            {Math.round(rotationAngle)}° {isBackView ? 'POSTERIOR' : 'ANTERIOR'}
          </span>
        </div>
      </div>

      {/* Main 360° Holographic Display Viewport */}
      <div className="relative min-h-[500px] flex items-center justify-center py-4">
        
        {/* Holographic Blue Ray Platform Base at Feet (Matching Reference Image) */}
        <div className="absolute bottom-6 w-72 h-16 rounded-full border-2 border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_50px_rgba(0,240,255,0.3)] transform rotate-x-60 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-12 rounded-full border border-cyan-300/40 animate-pulse" />
        </div>

        {/* Callout Pointer Cards (Left & Right HUD Panels - Matching Reference Screenshot) */}
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
                        ? 'bg-cyan-950/90 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.03]'
                        : 'bg-slate-950/70 border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-cyan-400 tracking-wider block">
                        {c.splitName}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <h4 className="text-xs font-black text-white font-mono mt-0.5">{c.label}</h4>
                    <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-cyan-400 font-extrabold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Center 360° Holographic Human Body Vector Schematic */}
          <div className="md:col-span-6 flex justify-center relative py-4">
            <div
              className="relative w-full max-w-[340px] aspect-[3/4] transition-transform duration-75"
              style={{
                transform: `rotateY(${rotationAngle}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <svg viewBox="0 0 400 520" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <defs>
                  <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <linearGradient id="holoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0077ff" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Holographic Wireframe Muscles (Matching Reference Image) */}
                <g fill="none" stroke="#00f0ff" strokeWidth="1.2" opacity="0.9" filter="url(#cyanGlow)">
                  {/* Head & Skull Wireframe */}
                  <path d="M 200 20 C 180 20 172 35 172 52 C 172 70 182 82 200 82 C 218 82 228 70 228 52 C 228 35 220 20 200 20 Z" strokeWidth="1.5" />
                  <path d="M 185 45 Q 200 35 215 45" />
                  <path d="M 185 60 Q 200 70 215 60" />
                  <line x1="200" y1="20" x2="200" y2="82" strokeDasharray="2,2" />

                  {/* Neck */}
                  <path d="M 188 82 L 184 98 L 216 98 L 212 82 Z" />

                  {!isBackView ? (
                    <>
                      {/* Pectoralis Major (Chest Wireframe Bellies) */}
                      <path
                        d="M 145 125 C 170 130 195 135 198 158 C 198 175 170 185 145 170 C 135 155 138 135 145 125 Z"
                        fill={activeMuscle === 'chest' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                        stroke="#00f0ff"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M 255 125 C 230 130 205 135 202 158 C 202 175 230 185 255 170 C 265 155 262 135 255 125 Z"
                        fill={activeMuscle === 'chest' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                        stroke="#00f0ff"
                        strokeWidth="1.8"
                      />
                      <path d="M 155 140 Q 180 145 196 148" />
                      <path d="M 245 140 Q 220 145 204 148" />
                      <path d="M 150 155 Q 175 160 196 165" />
                      <path d="M 250 155 Q 225 160 204 165" />

                      {/* Deltoids (Shoulders Wireframe) */}
                      <path
                        d="M 124 110 C 132 104 146 112 144 135 C 140 148 128 142 122 130 Z"
                        fill={activeMuscle === 'shoulders' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 276 110 C 268 104 254 112 256 135 C 260 148 272 142 278 130 Z"
                        fill={activeMuscle === 'shoulders' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />

                      {/* Rectus Abdominis (Six-Pack Core Wireframe) */}
                      <g fill={activeMuscle === 'abs' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.15)'}>
                        <rect x="180" y="190" width="18" height="18" rx="3" stroke="#00f0ff" />
                        <rect x="202" y="190" width="18" height="18" rx="3" stroke="#00f0ff" />
                        <rect x="180" y="212" width="18" height="18" rx="3" stroke="#00f0ff" />
                        <rect x="202" y="212" width="18" height="18" rx="3" stroke="#00f0ff" />
                        <rect x="182" y="234" width="16" height="20" rx="3" stroke="#00f0ff" />
                        <rect x="202" y="234" width="16" height="20" rx="3" stroke="#00f0ff" />
                      </g>

                      {/* Biceps Wireframe */}
                      <path
                        d="M 120 142 C 114 155 110 185 120 200 C 126 195 132 170 130 150 Z"
                        fill={activeMuscle === 'biceps' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 280 142 C 286 155 290 185 280 200 C 274 195 268 170 270 150 Z"
                        fill={activeMuscle === 'biceps' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />

                      {/* Quadriceps Femoris Wireframe */}
                      <path
                        d="M 155 295 C 145 320 142 370 162 390 C 172 385 185 340 188 300 Z"
                        fill={activeMuscle === 'quads' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                        stroke="#00f0ff"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M 245 295 C 255 320 258 370 238 390 C 228 385 215 340 212 300 Z"
                        fill={activeMuscle === 'quads' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                        stroke="#00f0ff"
                        strokeWidth="1.6"
                      />
                    </>
                  ) : (
                    <>
                      {/* Trapezius & Latissimus Dorsi Wireframe */}
                      <path
                        d="M 200 82 L 175 110 L 200 160 L 225 110 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 145 125 C 170 135 195 150 190 220 C 160 210 135 170 135 145 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 255 125 C 230 135 205 150 210 220 C 240 210 265 170 265 145 Z"
                        fill={activeMuscle === 'back' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />

                      {/* Triceps Horseshoe Wireframe */}
                      <path
                        d="M 115 142 C 105 155 100 185 112 205 C 122 195 128 170 125 150 Z"
                        fill={activeMuscle === 'triceps' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 285 142 C 295 155 300 185 288 205 C 278 195 272 170 275 150 Z"
                        fill={activeMuscle === 'triceps' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />

                      {/* Hamstrings & Calves Wireframe */}
                      <path
                        d="M 158 290 C 148 325 145 375 168 395 C 182 390 192 345 195 295 Z"
                        fill={activeMuscle === 'hamstrings' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 242 290 C 252 325 255 375 232 395 C 218 390 208 345 205 295 Z"
                        fill={activeMuscle === 'hamstrings' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 145 420 C 135 440 142 470 162 475 C 175 465 178 440 172 420 Z"
                        fill={activeMuscle === 'calves' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                      <path
                        d="M 255 420 C 265 440 258 470 238 475 C 225 465 222 440 228 420 Z"
                        fill={activeMuscle === 'calves' ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)'}
                      />
                    </>
                  )}

                  {/* Legs Outline Wireframe */}
                  <path d="M 152 285 L 140 370 L 138 480 C 138 495 160 500 170 500 C 180 500 188 475 190 410 L 195 285 Z" strokeWidth="1.5" />
                  <path d="M 248 285 L 260 370 L 262 480 C 262 495 240 500 230 500 C 220 500 212 475 210 410 L 205 285 Z" strokeWidth="1.5" />
                </g>

                {/* Laser Pointer Node Pulse Targets */}
                {currentCalls.map((c) => (
                  <g key={c.group} onClick={() => handleMuscleClick(c.group)} className="cursor-pointer">
                    <circle cx={c.cx} cy={c.cy} r="10" fill="#00f0ff" fillOpacity="0.3" filter="url(#cyanGlow)" />
                    <circle cx={c.cx} cy={c.cy} r="4" fill="#00f0ff" />
                  </g>
                ))}
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
                        ? 'bg-cyan-950/90 border-cyan-400 shadow-xl shadow-cyan-500/20 scale-[1.03]'
                        : 'bg-slate-950/70 border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-cyan-400 tracking-wider block">
                        {c.splitName}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <h4 className="text-xs font-black text-white font-mono mt-0.5">{c.label}</h4>
                    <div className="text-[10px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                      <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                      <span className="text-cyan-400 font-extrabold">{prog.levelTitle.split('•')[0]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Rotation Range Slider */}
      <div className="flex items-center space-x-4 bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/20 max-w-md mx-auto relative z-10 font-mono">
        <RotateCw className="w-4 h-4 text-cyan-400 shrink-0" />
        <input
          type="range"
          min="0"
          max="360"
          value={rotationAngle}
          onChange={(e) => {
            setIsAutoRotate(false);
            setRotationAngle(parseFloat(e.target.value));
          }}
          className="w-full accent-cyan-400 cursor-pointer"
        />
        <span className="text-xs font-extrabold text-cyan-300 w-12 text-right">{Math.round(rotationAngle)}°</span>
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
