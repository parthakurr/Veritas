export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  isPR?: boolean;
}

export interface ExerciseSession {
  id: string;
  exerciseName: string;
  category?: string; // Chest, Back, Legs, Shoulders, Arms, Core
  sets: WorkoutSet[];
}

export interface WorkoutSplit {
  id: string;
  name: string; // e.g. "Push Day", "Pull Day", "Legs", "Upper Body"
  color: string;
  exercises: string[];
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  splitId: string;
  splitName: string;
  exercises: ExerciseSession[];
  notes?: string;
}

export interface ManualMacroLog {
  date: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
