'use client';

import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, CheckCircle2, FolderPlus, X, Copy, Check } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { WorkoutSet, ExerciseSession, WorkoutLog } from '@/types/workout';

export const WorkoutLogger: React.FC = () => {
  const {
    selectedDate,
    splits,
    workoutLogs,
    addSplit,
    deleteSplit,
    addExerciseToSplit,
    deleteExerciseFromSplit,
    saveWorkoutLog,
    deleteWorkoutLog,
    setSelectedExerciseChart,
  } = useWorkout();

  const [activeSplitId, setActiveSplitId] = useState<string>(splits[0]?.id || '');
  const [selectedExercise, setSelectedExercise] = useState<string>(splits[0]?.exercises[0] || '');
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([
    { id: 's_1', setNumber: 1, weightKg: 80, reps: 8 },
    { id: 's_2', setNumber: 2, weightKg: 85, reps: 6 },
  ]);

  const [showToast, setShowToast] = useState(false);
  const [newSplitName, setNewSplitName] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [showAddSplitModal, setShowAddSplitModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const activeSplit = splits.find((s) => s.id === activeSplitId) || splits[0];
  const logsForSelectedDate = workoutLogs[selectedDate] || [];

  const handleAddSet = () => {
    const lastSet = currentSets[currentSets.length - 1];
    const newSet: WorkoutSet = {
      id: 's_' + Date.now(),
      setNumber: currentSets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : 60,
      reps: lastSet ? lastSet.reps : 10,
    };
    setCurrentSets((prev) => [...prev, newSet]);
  };

  const handleCopyPrevSet = () => {
    if (currentSets.length === 0) return;
    const last = currentSets[currentSets.length - 1];
    const newSet: WorkoutSet = {
      id: 's_' + Date.now(),
      setNumber: currentSets.length + 1,
      weightKg: last.weightKg,
      reps: last.reps,
    };
    setCurrentSets((prev) => [...prev, newSet]);
  };

  const handleAdjustWeight = (setId: string, delta: number) => {
    setCurrentSets((prev) =>
      prev.map((s) =>
        s.id === setId ? { ...s, weightKg: Math.max(0, Math.round((s.weightKg + delta) * 10) / 10) } : s
      )
    );
  };

  const handleUpdateSet = (setId: string, field: 'weightKg' | 'reps', value: number) => {
    setCurrentSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteSet = (setId: string) => {
    setCurrentSets((prev) =>
      prev
        .filter((s) => s.id !== setId)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }))
    );
  };

  const handleSaveWorkoutSession = () => {
    if (!selectedExercise || currentSets.length === 0) return;

    const newExerciseSession: ExerciseSession = {
      id: 'ex_sess_' + Date.now(),
      exerciseName: selectedExercise,
      sets: currentSets,
    };

    const existingLog = logsForSelectedDate.find((l) => l.splitId === activeSplit.id);

    let updatedLog: WorkoutLog;
    if (existingLog) {
      const existingExIndex = existingLog.exercises.findIndex(
        (e) => e.exerciseName.toLowerCase() === selectedExercise.toLowerCase()
      );

      let updatedExercises = [...existingLog.exercises];
      if (existingExIndex >= 0) {
        updatedExercises[existingExIndex] = newExerciseSession;
      } else {
        updatedExercises.push(newExerciseSession);
      }

      updatedLog = {
        ...existingLog,
        exercises: updatedExercises,
      };
    } else {
      updatedLog = {
        id: 'log_' + Date.now(),
        date: selectedDate,
        splitId: activeSplit.id,
        splitName: activeSplit.name,
        exercises: [newExerciseSession],
      };
    }

    saveWorkoutLog(updatedLog);
    setSelectedExerciseChart(selectedExercise);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleCreateSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSplitName.trim()) return;
    addSplit(newSplitName.trim(), ['Barbell Bench Press', 'Squat']);
    setNewSplitName('');
    setShowAddSplitModal(false);
  };

  const handleDeleteSplit = (splitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (splits.length <= 1) {
      alert('You must keep at least one workout split!');
      return;
    }
    deleteSplit(splitId);
    const remaining = splits.filter((s) => s.id !== splitId);
    if (remaining.length > 0) {
      setActiveSplitId(remaining[0].id);
      if (remaining[0].exercises.length > 0) {
        setSelectedExercise(remaining[0].exercises[0]);
      }
    }
  };

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;
    addExerciseToSplit(activeSplit.id, newExerciseName.trim());
    setSelectedExercise(newExerciseName.trim());
    setNewExerciseName('');
    setShowAddExerciseModal(false);
  };

  const handleDeleteExercise = () => {
    if (!selectedExercise || !activeSplit) return;
    deleteExerciseFromSplit(activeSplit.id, selectedExercise);
    const remaining = activeSplit.exercises.filter((ex) => ex !== selectedExercise);
    setSelectedExercise(remaining.length > 0 ? remaining[0] : '');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 transition-colors relative">
      {/* Save Success Toast */}
      {showToast && (
        <div className="absolute top-4 right-4 z-30 bg-emerald-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-2xl shadow-lg flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Exercise Session Saved!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-md">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Workout Session Logger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Log sets, weight (kg), and reps under your Day Split</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddSplitModal(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs font-bold border border-slate-200 dark:border-slate-700"
        >
          <FolderPlus className="w-4 h-4 text-[#E03E2D]" />
          <span>New Split</span>
        </button>
      </div>

      {/* 1. Workout Split Selection Pills */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block font-mono">
            Select Day Split
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {splits.map((s) => {
            const isActive = s.id === activeSplitId;
            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSplitId(s.id);
                  if (s.exercises.length > 0) setSelectedExercise(s.exercises[0]);
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>
                  {s.name} ({s.exercises.length} ex)
                </span>
                <button
                  onClick={(e) => handleDeleteSplit(s.id, e)}
                  className="p-0.5 rounded-full hover:bg-rose-500 hover:text-white transition text-slate-400"
                  title="Delete this Workout Split"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Exercise Picker & Add / Delete Exercise */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block font-mono">
            Exercise Name
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="text-[11px] font-bold text-[#E03E2D] dark:text-rose-400 hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Custom Exercise</span>
            </button>
            {selectedExercise && (
              <button
                onClick={handleDeleteExercise}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
                title="Delete selected exercise from split"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Exercise</span>
              </button>
            )}
          </div>
        </div>

        {activeSplit?.exercises.length === 0 ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 text-xs font-bold text-amber-800 dark:text-amber-300">
            No exercises in &quot;{activeSplit?.name}&quot; yet. Click &quot;+ Add Custom Exercise&quot; above!
          </div>
        ) : (
          <select
            value={selectedExercise}
            onChange={(e) => {
              setSelectedExercise(e.target.value);
              setSelectedExerciseChart(e.target.value);
            }}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-2xl px-4 py-2.5 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#E03E2D]"
          >
            {activeSplit?.exercises.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 3. Sets Table Input with Incremental Buttons */}
      <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center justify-between text-xs font-extrabold font-mono text-slate-500 dark:text-slate-400 uppercase px-2">
          <span>Set #</span>
          <span>Weight (kg)</span>
          <span>Reps</span>
          <span>Action</span>
        </div>

        <div className="space-y-2">
          {currentSets.map((s) => (
            <div key={s.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-extrabold text-slate-900 dark:text-white text-xs shrink-0">
                {s.setNumber}
              </span>

              {/* Incremental Controls */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleAdjustWeight(s.id, -2.5)}
                  className="px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  -2.5
                </button>

                <input
                  type="number"
                  step="0.5"
                  value={s.weightKg}
                  onChange={(e) => handleUpdateSet(s.id, 'weightKg', parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 font-mono text-xs font-extrabold text-slate-900 dark:text-white text-center focus:outline-none focus:border-[#E03E2D]"
                  placeholder="kg"
                />

                <button
                  type="button"
                  onClick={() => handleAdjustWeight(s.id, 2.5)}
                  className="px-1.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  +2.5
                </button>
              </div>

              <input
                type="number"
                value={s.reps}
                onChange={(e) => handleUpdateSet(s.id, 'reps', parseInt(e.target.value) || 0)}
                className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 font-mono text-xs font-extrabold text-slate-900 dark:text-white text-center focus:outline-none focus:border-[#E03E2D]"
                placeholder="reps"
              />

              <button
                type="button"
                onClick={() => handleDeleteSet(s.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition ml-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddSet}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-2xs"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Set</span>
            </button>
            <button
              onClick={handleCopyPrevSet}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-2xs"
            >
              <Copy className="w-4 h-4 text-amber-500" />
              <span>Copy Prev Set</span>
            </button>
          </div>

          <button
            onClick={handleSaveWorkoutSession}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-[#E03E2D] hover:bg-[#C93323] text-white font-extrabold text-xs transition shadow-md shadow-rose-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Exercise Session</span>
          </button>
        </div>
      </div>

      {/* 4. Display Today's Logged Workout Sessions */}
      {logsForSelectedDate.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
            Logged Exercises for {selectedDate}
          </h4>

          {logsForSelectedDate.map((log) => (
            <div key={log.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono text-[10px] font-bold">
                  {log.splitName}
                </span>
                <button
                  onClick={() => deleteWorkoutLog(log.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {log.exercises.map((ex) => (
                <div key={ex.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{ex.exerciseName}</span>
                  <div className="flex flex-wrap gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {ex.sets.map((s) => (
                      <span key={s.id} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        Set {s.setNumber}: <strong>{s.weightKg}kg</strong> × {s.reps} reps
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Add Split Modal */}
      {showAddSplitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateSplit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Create Workout Split</h4>
            <input
              type="text"
              placeholder="e.g. Upper Body, Arm Day, Core"
              value={newSplitName}
              onChange={(e) => setNewSplitName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-[#E03E2D]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddSplitModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#E03E2D] text-white rounded-xl shadow-md"
              >
                Save Split
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateExercise} className="bg-white dark:bg-slate-900 p-6 rounded-3xl w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Add Exercise to {activeSplit.name}</h4>
            <input
              type="text"
              placeholder="e.g. Cable Crossover, Incline DB Curl"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:outline-none focus:border-[#E03E2D]"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddExerciseModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-[#E03E2D] text-white rounded-xl shadow-md"
              >
                Add Exercise
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
