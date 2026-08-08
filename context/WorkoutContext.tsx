'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutSplit, WorkoutLog, ManualMacroLog, MacroGoals } from '@/types/workout';

interface WorkoutContextType {
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  splits: WorkoutSplit[];
  workoutLogs: Record<string, WorkoutLog[]>; // date -> WorkoutLog[]
  macroLogs: Record<string, ManualMacroLog>; // date -> ManualMacroLog
  macroGoals: MacroGoals;
  selectedExerciseChart: string;
  setSelectedExerciseChart: (exerciseName: string) => void;
  addSplit: (name: string, exercises: string[], color?: string) => void;
  deleteSplit: (splitId: string) => void;
  addExerciseToSplit: (splitId: string, exerciseName: string) => void;
  deleteExerciseFromSplit: (splitId: string, exerciseName: string) => void;
  saveWorkoutLog: (log: WorkoutLog) => void;
  deleteWorkoutLog: (logId: string, targetDate?: string) => void;
  saveManualMacroLog: (log: ManualMacroLog) => void;
  setMacroGoals: (goals: MacroGoals) => void;
  getExerciseHistory: (exerciseName: string) => Array<{ date: string; maxWeight: number; totalVolume: number; setsCount: number }>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

function getTodayIsoString(): string {
  return new Date().toISOString().split('T')[0];
}

const DEFAULT_SPLITS: WorkoutSplit[] = [
  {
    id: 'split_push',
    name: 'Push Day',
    color: '#E03E2D',
    exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Overhead Shoulder Press', 'Triceps Dip', 'Lateral Raise'],
  },
  {
    id: 'split_pull',
    name: 'Pull Day',
    color: '#059669',
    exercises: ['Deadlift', 'Barbell Bent Over Row', 'Lat Pulldown', 'Face Pull', 'Biceps Barbell Curl'],
  },
  {
    id: 'split_legs',
    name: 'Legs Day',
    color: '#D97706',
    exercises: ['Barbell Back Squat', 'Romanian Deadlift', 'Leg Press', 'Hamstring Curl', 'Standing Calf Raise'],
  },
];

const SAMPLE_HISTORICAL_LOGS: Record<string, WorkoutLog[]> = {
  '2026-08-01': [
    {
      id: 'log_1',
      date: '2026-08-01',
      splitId: 'split_push',
      splitName: 'Push Day',
      exercises: [
        {
          id: 'ex_1',
          exerciseName: 'Barbell Bench Press',
          sets: [
            { id: 's1', setNumber: 1, weightKg: 80, reps: 8 },
            { id: 's2', setNumber: 2, weightKg: 85, reps: 6 },
            { id: 's3', setNumber: 3, weightKg: 90, reps: 4 },
          ],
        },
      ],
    },
  ],
  '2026-08-05': [
    {
      id: 'log_2',
      date: '2026-08-05',
      splitId: 'split_push',
      splitName: 'Push Day',
      exercises: [
        {
          id: 'ex_2',
          exerciseName: 'Barbell Bench Press',
          sets: [
            { id: 's4', setNumber: 1, weightKg: 82.5, reps: 8 },
            { id: 's5', setNumber: 2, weightKg: 87.5, reps: 6 },
            { id: 's6', setNumber: 3, weightKg: 92.5, reps: 5, isPR: true },
          ],
        },
      ],
    },
  ],
};

const SAMPLE_MACRO_LOGS: Record<string, ManualMacroLog> = {
  [getTodayIsoString()]: {
    date: getTodayIsoString(),
    calories: 2350,
    protein: 165,
    carbs: 240,
    fat: 65,
  },
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayIsoString());
  const [splits, setSplits] = useState<WorkoutSplit[]>(DEFAULT_SPLITS);
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, WorkoutLog[]>>(SAMPLE_HISTORICAL_LOGS);
  const [macroLogs, setMacroLogs] = useState<Record<string, ManualMacroLog>>(SAMPLE_MACRO_LOGS);
  const [selectedExerciseChart, setSelectedExerciseChart] = useState<string>('Barbell Bench Press');
  const [macroGoals, setMacroGoalsState] = useState<MacroGoals>({ calories: 2400, protein: 170, carbs: 250, fat: 65 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedSplits = localStorage.getItem('veritas_splits_v3');
      if (savedSplits) setSplits(JSON.parse(savedSplits));

      const savedWorkoutLogs = localStorage.getItem('veritas_workout_logs_v3');
      if (savedWorkoutLogs) setWorkoutLogs(JSON.parse(savedWorkoutLogs));

      const savedMacroLogs = localStorage.getItem('veritas_macro_logs_v3');
      if (savedMacroLogs) setMacroLogs(JSON.parse(savedMacroLogs));

      const savedMacroGoals = localStorage.getItem('veritas_macro_goals_v3');
      if (savedMacroGoals) setMacroGoalsState(JSON.parse(savedMacroGoals));
    } catch (e) {
      console.warn('LocalStorage restore error', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('veritas_splits_v3', JSON.stringify(splits));
      localStorage.setItem('veritas_workout_logs_v3', JSON.stringify(workoutLogs));
      localStorage.setItem('veritas_macro_logs_v3', JSON.stringify(macroLogs));
      localStorage.setItem('veritas_macro_goals_v3', JSON.stringify(macroGoals));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [splits, workoutLogs, macroLogs, macroGoals, isLoaded]);

  const addSplit = (name: string, exercises: string[], color = '#E03E2D') => {
    const newSplit: WorkoutSplit = {
      id: 'split_' + Date.now(),
      name,
      color,
      exercises,
    };
    setSplits((prev) => [...prev, newSplit]);
  };

  const deleteSplit = (splitId: string) => {
    setSplits((prev) => prev.filter((s) => s.id !== splitId));
  };

  const addExerciseToSplit = (splitId: string, exerciseName: string) => {
    setSplits((prev) =>
      prev.map((s) => (s.id === splitId ? { ...s, exercises: [...s.exercises, exerciseName] } : s))
    );
  };

  const deleteExerciseFromSplit = (splitId: string, exerciseName: string) => {
    setSplits((prev) =>
      prev.map((s) =>
        s.id === splitId
          ? { ...s, exercises: s.exercises.filter((ex) => ex.toLowerCase() !== exerciseName.toLowerCase()) }
          : s
      )
    );
  };

  const saveWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => {
      const dateKey = log.date;
      const existing = prev[dateKey] || [];
      const updated = existing.filter((l) => l.id !== log.id);
      return {
        ...prev,
        [dateKey]: [log, ...updated],
      };
    });
  };

  const deleteWorkoutLog = (logId: string, targetDate: string = selectedDate) => {
    setWorkoutLogs((prev) => {
      const existing = prev[targetDate] || [];
      return {
        ...prev,
        [targetDate]: existing.filter((l) => l.id !== logId),
      };
    });
  };

  const saveManualMacroLog = (log: ManualMacroLog) => {
    setMacroLogs((prev) => ({
      ...prev,
      [log.date]: log,
    }));
  };

  const setMacroGoals = (goals: MacroGoals) => {
    setMacroGoalsState(goals);
  };

  const getExerciseHistory = (exerciseName: string) => {
    const historyMap: Record<string, { maxWeight: number; totalVolume: number; setsCount: number }> = {};

    Object.entries(workoutLogs).forEach(([dateKey, logs]) => {
      logs.forEach((log) => {
        log.exercises.forEach((exSession) => {
          if (exSession.exerciseName.toLowerCase().trim() === exerciseName.toLowerCase().trim()) {
            let maxWeight = 0;
            let totalVolume = 0;
            let setsCount = 0;

            exSession.sets.forEach((set) => {
              if (set.weightKg > maxWeight) maxWeight = set.weightKg;
              totalVolume += set.weightKg * set.reps;
              setsCount += 1;
            });

            if (maxWeight > 0) {
              historyMap[dateKey] = { maxWeight, totalVolume, setsCount };
            }
          }
        });
      });
    });

    return Object.entries(historyMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return (
    <WorkoutContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        splits,
        workoutLogs,
        macroLogs,
        macroGoals,
        selectedExerciseChart,
        setSelectedExerciseChart,
        addSplit,
        deleteSplit,
        addExerciseToSplit,
        deleteExerciseFromSplit,
        saveWorkoutLog,
        deleteWorkoutLog,
        saveManualMacroLog,
        setMacroGoals,
        getExerciseHistory,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error('useWorkout must be used within a WorkoutProvider');
  return context;
};
