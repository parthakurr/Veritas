'use client';

import React, { useState, useEffect } from 'react';
import { RotateCw, Play, Pause, Zap, Plus } from 'lucide-react';
import Image from 'next/image';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup } from '@/types/workout';
import { QuickLogModal } from '@/components/QuickLogModal';

/* ─────────────────────────────────────────────────────────────
   Clickable hotspot zones overlaid on the anatomy images.
   Positions are in percentages relative to the image container.
   ───────────────────────────────────────────────────────────── */
interface Hotspot {
  group: MuscleGroup;
  splitName: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  pointerSide: 'left' | 'right';
}

const FRONT_HOTSPOTS: Hotspot[] = [
  { group: 'shoulders', splitName: 'PUSH DAY', label: 'DELTOIDS', top: '17%', left: '12%', width: '16%', height: '8%', pointerSide: 'left' },
  { group: 'shoulders', splitName: 'PUSH DAY', label: 'DELTOIDS', top: '17%', left: '72%', width: '16%', height: '8%', pointerSide: 'right' },
  { group: 'chest', splitName: 'PUSH DAY', label: 'PECTORALIS MAJOR', top: '22%', left: '22%', width: '56%', height: '10%', pointerSide: 'left' },
  { group: 'biceps', splitName: 'PULL DAY', label: 'BICEPS BRACHII', top: '28%', left: '8%', width: '14%', height: '12%', pointerSide: 'left' },
  { group: 'biceps', splitName: 'PULL DAY', label: 'BICEPS BRACHII', top: '28%', left: '78%', width: '14%', height: '12%', pointerSide: 'right' },
  { group: 'abs', splitName: 'CORE', label: 'RECTUS ABDOMINIS', top: '32%', left: '32%', width: '36%', height: '14%', pointerSide: 'right' },
  { group: 'quads', splitName: 'LEG DAY', label: 'QUADRICEPS FEMORIS', top: '52%', left: '22%', width: '22%', height: '18%', pointerSide: 'left' },
  { group: 'quads', splitName: 'LEG DAY', label: 'QUADRICEPS FEMORIS', top: '52%', left: '56%', width: '22%', height: '18%', pointerSide: 'right' },
  { group: 'calves', splitName: 'LEG DAY', label: 'TIBIALIS ANTERIOR', top: '76%', left: '24%', width: '18%', height: '14%', pointerSide: 'left' },
  { group: 'calves', splitName: 'LEG DAY', label: 'TIBIALIS ANTERIOR', top: '76%', left: '58%', width: '18%', height: '14%', pointerSide: 'right' },
];

const BACK_HOTSPOTS: Hotspot[] = [
  { group: 'back', splitName: 'PULL DAY', label: 'TRAPEZIUS', top: '14%', left: '28%', width: '44%', height: '10%', pointerSide: 'right' },
  { group: 'back', splitName: 'PULL DAY', label: 'LATISSIMUS DORSI', top: '26%', left: '18%', width: '64%', height: '16%', pointerSide: 'right' },
  { group: 'shoulders', splitName: 'PUSH DAY', label: 'REAR DELTOIDS', top: '18%', left: '10%', width: '16%', height: '8%', pointerSide: 'left' },
  { group: 'shoulders', splitName: 'PUSH DAY', label: 'REAR DELTOIDS', top: '18%', left: '74%', width: '16%', height: '8%', pointerSide: 'right' },
  { group: 'triceps', splitName: 'PUSH DAY', label: 'TRICEPS BRACHII', top: '28%', left: '6%', width: '14%', height: '12%', pointerSide: 'left' },
  { group: 'triceps', splitName: 'PUSH DAY', label: 'TRICEPS BRACHII', top: '28%', left: '80%', width: '14%', height: '12%', pointerSide: 'right' },
  { group: 'hamstrings', splitName: 'LEG DAY', label: 'HAMSTRINGS', top: '52%', left: '22%', width: '22%', height: '18%', pointerSide: 'left' },
  { group: 'hamstrings', splitName: 'LEG DAY', label: 'HAMSTRINGS', top: '52%', left: '56%', width: '22%', height: '18%', pointerSide: 'right' },
  { group: 'calves', splitName: 'LEG DAY', label: 'GASTROCNEMIUS', top: '74%', left: '24%', width: '18%', height: '14%', pointerSide: 'left' },
  { group: 'calves', splitName: 'LEG DAY', label: 'GASTROCNEMIUS', top: '74%', left: '58%', width: '18%', height: '14%', pointerSide: 'right' },
];

// Deduplicate callout labels for the side panels
const getUniqueCallouts = (hotspots: Hotspot[], side: 'left' | 'right') => {
  const seen = new Set<MuscleGroup>();
  return hotspots.filter((h) => {
    if (h.pointerSide !== side || seen.has(h.group)) return false;
    seen.add(h.group);
    return true;
  });
};

export const Anatomy360HUD: React.FC = () => {
  const { getAllMusclesProgression } = useWorkout();
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [activeMuscle, setActiveMuscle] = useState<MuscleGroup | null>(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [selectedMuscleForLog, setSelectedMuscleForLog] = useState<MuscleGroup>('chest');

  const allProgression = getAllMusclesProgression();

  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const isBackView = rotationAngle > 90 && rotationAngle < 270;
  const currentHotspots = isBackView ? BACK_HOTSPOTS : FRONT_HOTSPOTS;

  const handleMuscleClick = (mg: MuscleGroup) => {
    setSelectedMuscleForLog(mg);
    setActiveMuscle(mg);
    setIsQuickLogOpen(true);
  };

  const leftCallouts = getUniqueCallouts(currentHotspots, 'left');
  const rightCallouts = getUniqueCallouts(currentHotspots, 'right');

  return (
    <div className="relative w-full min-h-screen bg-[#0a1628] overflow-hidden">
      {/* Dot matrix background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,200,255,0.12)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      
      {/* Radial blue ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,80,160,0.2)_0%,transparent_65%)] pointer-events-none" />

      {/* Top HUD bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-8 pt-5 pb-3">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-[#00d4ff] animate-pulse" />
          <div>
            <p className="text-[10px] font-mono font-bold text-[#00d4ff]/70 tracking-[0.2em] uppercase">Veritas Muscle Blueprint</p>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">360° Anatomy Scanner</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0a1628] border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/10 transition"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isAutoRotate ? 'Pause' : 'Auto Spin'}</span>
          </button>
          <span className="px-2.5 py-1.5 rounded-lg bg-[#0a1628] border border-[#00d4ff]/30 text-[#00d4ff] font-bold text-[11px]">
            {Math.round(rotationAngle)}° {isBackView ? 'POSTERIOR' : 'ANTERIOR'}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-3 md:gap-4">

          {/* Left callout panels */}
          <div className="md:col-span-3 space-y-2.5 pt-4 md:pt-12">
            {leftCallouts.map((c) => {
              const prog = allProgression[c.group];
              const isSelected = activeMuscle === c.group;
              return (
                <div
                  key={`left-${c.group}`}
                  onClick={() => handleMuscleClick(c.group)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#00d4ff]/10 border-[#00d4ff]/80 shadow-[0_0_16px_rgba(0,212,255,0.2)]'
                      : 'bg-[#0a1628]/80 border-[#00d4ff]/20 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-mono font-bold text-[#00d4ff]/60 tracking-widest">{c.splitName}</span>
                    <Plus className="w-3 h-3 text-[#00d4ff]/50" />
                  </div>
                  <h4 className="text-[11px] font-extrabold text-white font-mono leading-tight">{c.label}</h4>
                  <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-slate-400">
                    <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                    <span className="text-[#00d4ff] font-bold">{prog.levelTitle.split('•')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center anatomy image with clickable hotspots */}
          <div className="md:col-span-6 flex flex-col items-center relative">
            <div className="relative w-full max-w-[360px] mx-auto">
              {/* The actual high-quality anatomy image */}
              <div
                style={{
                  transform: `rotateY(${rotationAngle}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: isAutoRotate ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                <Image
                  src={isBackView ? '/anatomy-back.jpg' : '/anatomy-front.jpg'}
                  alt={isBackView ? 'Posterior anatomy view' : 'Anterior anatomy view'}
                  width={576}
                  height={1024}
                  className="w-full h-auto"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.35))' }}
                  priority
                />
              </div>

              {/* Clickable muscle hotspot overlays */}
              {currentHotspots.map((hotspot, idx) => {
                const isSelected = activeMuscle === hotspot.group;
                return (
                  <button
                    key={`${hotspot.group}-${idx}`}
                    onClick={() => handleMuscleClick(hotspot.group)}
                    className="absolute transition-all duration-200 rounded-lg"
                    style={{
                      top: hotspot.top,
                      left: hotspot.left,
                      width: hotspot.width,
                      height: hotspot.height,
                      background: isSelected
                        ? 'rgba(0, 212, 255, 0.25)'
                        : 'transparent',
                      border: isSelected
                        ? '1.5px solid rgba(0, 212, 255, 0.6)'
                        : '1.5px solid transparent',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 12px rgba(0, 212, 255, 0.15)'
                        : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.12)';
                        e.currentTarget.style.border = '1.5px solid rgba(0, 212, 255, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.border = '1.5px solid transparent';
                      }
                    }}
                    aria-label={`Log ${hotspot.label}`}
                  />
                );
              })}
            </div>

            {/* Holographic pedestal ring */}
            <div className="relative w-56 sm:w-64 h-8 sm:h-10 -mt-2">
              <div className="absolute inset-0 rounded-[50%] border-2 border-[#00d4ff]/50 shadow-[0_0_24px_rgba(0,212,255,0.25)]" />
              <div className="absolute inset-2 rounded-[50%] border border-[#00d4ff]/25" />
              <div className="absolute inset-4 rounded-[50%] border border-[#00d4ff]/10" />
            </div>
          </div>

          {/* Right callout panels */}
          <div className="md:col-span-3 space-y-2.5 pt-4 md:pt-12">
            {rightCallouts.map((c) => {
              const prog = allProgression[c.group];
              const isSelected = activeMuscle === c.group;
              return (
                <div
                  key={`right-${c.group}`}
                  onClick={() => handleMuscleClick(c.group)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#00d4ff]/10 border-[#00d4ff]/80 shadow-[0_0_16px_rgba(0,212,255,0.2)]'
                      : 'bg-[#0a1628]/80 border-[#00d4ff]/20 hover:border-[#00d4ff]/50 hover:bg-[#00d4ff]/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] font-mono font-bold text-[#00d4ff]/60 tracking-widest">{c.splitName}</span>
                    <Plus className="w-3 h-3 text-[#00d4ff]/50" />
                  </div>
                  <h4 className="text-[11px] font-extrabold text-white font-mono leading-tight">{c.label}</h4>
                  <div className="flex items-center justify-between mt-1.5 text-[9px] font-mono text-slate-400">
                    <span>Vol: {prog.totalVolumeKg.toLocaleString()} kg</span>
                    <span className="text-[#00d4ff] font-bold">{prog.levelTitle.split('•')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom rotation slider */}
      <div className="relative z-20 flex items-center justify-center px-6 pb-6">
        <div className="flex items-center space-x-4 bg-[#0a1628]/90 border border-[#00d4ff]/20 rounded-xl px-4 py-2.5 max-w-sm w-full">
          <RotateCw className="w-4 h-4 text-[#00d4ff] shrink-0" />
          <input
            type="range"
            min="0"
            max="360"
            value={rotationAngle}
            onChange={(e) => {
              setIsAutoRotate(false);
              setRotationAngle(parseFloat(e.target.value));
            }}
            className="w-full accent-[#00d4ff] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#00d4ff] w-10 text-right">{Math.round(rotationAngle)}°</span>
        </div>
      </div>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        muscleGroup={selectedMuscleForLog}
      />
    </div>
  );
};
