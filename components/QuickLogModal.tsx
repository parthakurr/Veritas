'use client';

import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Dumbbell, Zap, CheckCircle2 } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { MuscleGroup, WorkoutSet } from '@/types/workout';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  muscleGroup: MuscleGroup;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({ isOpen, onClose, muscleGroup }) => {
  const { splits, saveWorkoutLog, selectedDate, getMuscleProgression } = useWorkout();

  // Find recommended split based on muscle group
  const getSplitForMuscle = (mg: MuscleGroup) => {
    if (['chest', 'shoulders', 'triceps'].includes(mg)) return splits.find((s) => s.id.includes('push')) || splits[0];
    if (['back', 'biceps'].includes(mg)) return splits.find((s) => s.id.includes('pull')) || splits[1] || splits[0];
    return splits.find((s) => s.id.includes('leg')) || splits[2] || splits[0];
  };

  const currentSplit = getSplitForMuscle(muscleGroup);
  const prog = getMuscleProgression(muscleGroup);

  const defaultExerciseName = currentSplit?.exercises[0] || 'Barbell Bench Press';
  const [selectedExercise, setSelectedExercise] = useState<string>(defaultExerciseName);
  const [sets, setSets] = useState<WorkoutSet[]>([
    { id: 'qs_1', setNumber: 1, weightKg: prog.maxWeightKg || 60, reps: 10 },
    { id: 'qs_2', setNumber: 2, weightKg: prog.maxWeightKg || 60, reps: 8 },
  ]);
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleAdjustWeight = (setId: string, delta: number) => {
    setSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, weightKg: Math.max(0, Math.round((s.weightKg + delta) * 10) / 10) } : s))
    );
  };

  const handleAdjustReps = (setId: string, delta: number) => {
    setSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, reps: Math.max(1, s.reps + delta) } : s))
    );
  };

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1] || { weightKg: 60, reps: 8 };
    setSets([
      ...sets,
      {
        id: 'qs_' + Date.now(),
        setNumber: sets.length + 1,
        weightKg: lastSet.weightKg,
        reps: lastSet.reps,
      },
    ]);
  };

  const handleDeleteSet = (setId: string) => {
    if (sets.length <= 1) return;
    setSets((prev) =>
      prev.filter((s) => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const logId = 'log_' + Date.now();
    saveWorkoutLog({
      id: logId,
      date: selectedDate,
      splitId: currentSplit?.id || 'split_push',
      splitName: currentSplit?.name || 'Workout Session',
      exercises: [
        {
          id: 'ex_' + Date.now(),
          exerciseName: selectedExercise,
          sets,
        },
      ],
    });

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl shadow-cyan-950/50 space-y-5 text-white font-sans relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block tracking-wider">
                Direct Anatomy Set Logger ({selectedDate})
              </span>
              <h3 className="text-base font-extrabold text-white">
                Log Lifts for {prog.displayName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Set Logged Successfully! Updating Holographic Body Stats...</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Exercise Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block font-mono">Select Exercise</label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl px-3 py-2.5 text-xs font-bold text-cyan-300 focus:outline-none focus:border-cyan-400 font-mono"
            >
              {(currentSplit?.exercises || [defaultExerciseName]).map((ex) => (
                <option key={ex} value={ex} className="bg-slate-900 text-white">
                  {ex}
                </option>
              ))}
            </select>
          </div>

          {/* Set Rows */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {sets.map((set) => (
              <div
                key={set.id}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2 text-xs font-mono"
              >
                <span className="font-extrabold text-cyan-400 w-12">Set {set.setNumber}</span>

                {/* Weight Control */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(set.id, -2.5)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                  >
                    -2.5
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    value={set.weightKg}
                    onChange={(e) =>
                      setSets((prev) =>
                        prev.map((s) => (s.id === set.id ? { ...s, weightKg: parseFloat(e.target.value) || 0 } : s))
                      )
                    }
                    className="w-16 bg-slate-900 border border-slate-700 text-center py-1 rounded-lg text-white font-extrabold"
                  />
                  <span className="text-slate-400 text-[10px]">kg</span>
                  <button
                    type="button"
                    onClick={() => handleAdjustWeight(set.id, 2.5)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-[10px] font-bold"
                  >
                    +2.5
                  </button>
                </div>

                {/* Reps Control */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustReps(set.id, -1)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
                  >
                    -1
                  </button>
                  <span className="w-8 text-center font-extrabold text-white">{set.reps}</span>
                  <button
                    type="button"
                    onClick={() => handleAdjustReps(set.id, 1)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-[10px] font-bold"
                  >
                    +1
                  </button>
                  <span className="text-slate-400 text-[10px]">reps</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSet(set.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleAddSet}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 font-mono"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Set</span>
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Lifts to Blueprint</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
