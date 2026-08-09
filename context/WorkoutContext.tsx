'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutSplit, WorkoutLog, ManualMacroLog, MacroGoals, MuscleGroup, MuscleProgression } from '@/types/workout';
import { useAuth } from '@/context/AuthContext';

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
  getMuscleProgression: (muscleGroup: MuscleGroup) => MuscleProgression;
  getAllMusclesProgression: () => Record<MuscleGroup, MuscleProgression>;
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

const MUSCLE_MAP: Record<MuscleGroup, { displayName: string; keywords: string[] }> = {
  chest: { displayName: 'Chest (Pectorals)', keywords: ['bench', 'incline', 'chest', 'fly', 'pushup', 'dip', 'pectoral'] },
  back: { displayName: 'Back (Lats & Traps)', keywords: ['deadlift', 'lat', 'pulldown', 'row', 'chinup', 'pullup', 'back', 'face pull'] },
  shoulders: { displayName: 'Shoulders (Deltoids)', keywords: ['overhead', 'press', 'shoulder', 'lateral raise', 'military', 'delt'] },
  biceps: { displayName: 'Biceps', keywords: ['biceps', 'curl', 'preacher', 'hammer'] },
  triceps: { displayName: 'Triceps', keywords: ['triceps', 'skullcrusher', 'pushdown', 'dip', 'extension'] },
  quads: { displayName: 'Quads (Quadriceps)', keywords: ['squat', 'leg press', 'leg extension', 'lunge', 'quad'] },
  hamstrings: { displayName: 'Hamstrings & Glutes', keywords: ['romanian', 'hamstring', 'curl', 'glute', 'stiff'] },
  calves: { displayName: 'Calves', keywords: ['calf', 'calves', 'raise'] },
  abs: { displayName: 'Core (Abs)', keywords: ['crunch', 'abs', 'ab', 'plank', 'hanging leg'] },
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayIsoString());
  const [splits, setSplits] = useState<WorkoutSplit[]>(DEFAULT_SPLITS);
  const [workoutLogs, setWorkoutLogs] = useState<Record<string, WorkoutLog[]>>(SAMPLE_HISTORICAL_LOGS);
  const [macroLogs, setMacroLogs] = useState<Record<string, ManualMacroLog>>(SAMPLE_MACRO_LOGS);
  const [selectedExerciseChart, setSelectedExerciseChart] = useState<string>('Barbell Bench Press');
  const [macroGoals, setMacroGoalsState] = useState<MacroGoals>({ calories: 2400, protein: 170, carbs: 250, fat: 65 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userId = user?.id || 'guest';
    try {
      const savedSplits = localStorage.getItem(`veritas_splits_${userId}`);
      if (savedSplits) setSplits(JSON.parse(savedSplits));

      const savedWorkoutLogs = localStorage.getItem(`veritas_workout_logs_${userId}`);
      if (savedWorkoutLogs) setWorkoutLogs(JSON.parse(savedWorkoutLogs));

      const savedMacroLogs = localStorage.getItem(`veritas_macro_logs_${userId}`);
      if (savedMacroLogs) setMacroLogs(JSON.parse(savedMacroLogs));

      const savedMacroGoals = localStorage.getItem(`veritas_macro_goals_${userId}`);
      if (savedMacroGoals) setMacroGoalsState(JSON.parse(savedMacroGoals));

      fetch(`/api/user/sync?userId=${userId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            if (resData.data.splits && resData.data.splits.length > 0) setSplits(resData.data.splits);
            if (resData.data.workoutLogs) setWorkoutLogs(resData.data.workoutLogs);
            if (resData.data.macroLogs) setMacroLogs(resData.data.macroLogs);
            if (resData.data.macroGoals) setMacroGoalsState(resData.data.macroGoals);
          }
        })
        .catch(() => {});
    } catch (e) {
      console.warn('LocalStorage restore error', e);
    } finally {
      setIsLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isLoaded) return;
    const userId = user?.id || 'guest';
    try {
      localStorage.setItem(`veritas_splits_${userId}`, JSON.stringify(splits));
      localStorage.setItem(`veritas_workout_logs_${userId}`, JSON.stringify(workoutLogs));
      localStorage.setItem(`veritas_macro_logs_${userId}`, JSON.stringify(macroLogs));
      localStorage.setItem(`veritas_macro_goals_${userId}`, JSON.stringify(macroGoals));

      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          splits,
          workoutLogs,
          macroLogs,
          macroGoals,
        }),
      }).catch(() => {});
    } catch (e) {}
  }, [splits, workoutLogs, macroLogs, macroGoals, isLoaded, user?.id]);

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

  const getMuscleProgression = (muscleGroup: MuscleGroup): MuscleProgression => {
    const config = MUSCLE_MAP[muscleGroup];
    let totalVolumeKg = 0;
    let maxWeightKg = 0;
    let totalSets = 0;
    let lastTrainedDate: string | undefined = undefined;

    Object.entries(workoutLogs).forEach(([dateKey, logs]) => {
      logs.forEach((log) => {
        log.exercises.forEach((exSession) => {
          const exName = exSession.exerciseName.toLowerCase();
          const matches = config.keywords.some((kw) => exName.includes(kw));

          if (matches) {
            if (!lastTrainedDate || dateKey > lastTrainedDate) {
              lastTrainedDate = dateKey;
            }

            exSession.sets.forEach((set) => {
              totalSets += 1;
              const setVol = set.weightKg * set.reps;
              totalVolumeKg += setVol;
              if (set.weightKg > maxWeightKg) maxWeightKg = set.weightKg;
            });
          }
        });
      });
    });

    // Level thresholds
    const levelThresholds = [0, 500, 1500, 3000, 6000, 10000, 15000, 22000, 30000, 45000];
    let level = 1;
    let levelTitle = 'Lvl 1 • Novice';

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (totalVolumeKg >= levelThresholds[i]) {
        level = i + 1;
        break;
      }
    }

    if (level === 1) levelTitle = 'Lvl 1 • Novice';
    else if (level <= 3) levelTitle = `Lvl ${level} • Hypertrophy I`;
    else if (level <= 6) levelTitle = `Lvl ${level} • Hypertrophy II`;
    else if (level <= 9) levelTitle = `Lvl ${level} • Elite Sculpt`;
    else levelTitle = `Lvl 10 • Titan Muscle`;

    const currentCap = levelThresholds[Math.min(level, levelThresholds.length - 1)];
    const prevCap = levelThresholds[Math.max(0, level - 1)];
    const progressToNextLevel = level >= 10 ? 100 : Math.min(100, Math.round(((totalVolumeKg - prevCap) / (currentCap - prevCap || 1)) * 100));

    // Recovery status
    let recoveryState: 'recovered' | 'primed' | 'fatigued' = 'recovered';
    if (lastTrainedDate) {
      const today = new Date();
      const trained = new Date(lastTrainedDate);
      const diffHours = (today.getTime() - trained.getTime()) / (1000 * 3600);

      if (diffHours <= 24) recoveryState = 'fatigued';
      else if (diffHours <= 48) recoveryState = 'primed';
      else recoveryState = 'recovered';
    }

    return {
      muscleGroup,
      displayName: config.displayName,
      totalVolumeKg,
      maxWeightKg,
      totalSets,
      level,
      levelTitle,
      progressToNextLevel,
      recoveryState,
      lastTrainedDate,
    };
  };

  const getAllMusclesProgression = (): Record<MuscleGroup, MuscleProgression> => {
    const keys: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'calves', 'abs'];
    const result: Partial<Record<MuscleGroup, MuscleProgression>> = {};

    keys.forEach((key) => {
      result[key] = getMuscleProgression(key);
    });

    return result as Record<MuscleGroup, MuscleProgression>;
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
        getMuscleProgression,
        getAllMusclesProgression,
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
