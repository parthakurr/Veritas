import { MacroGoals, MealLog } from './nutrition';

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'fat_loss' | 'maintenance' | 'muscle_gain';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  tdee: number;
  macroGoals: MacroGoals;
  isOnboarded: boolean;
}

export type DateMealLogs = Record<string, MealLog[]>; // YYYY-MM-DD -> MealLog[]
