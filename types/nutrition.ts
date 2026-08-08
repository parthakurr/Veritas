export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealLog {
  id: string;
  timestamp: string; // ISO string or formatted time
  prompt: string;
  mealType: MealType;
  items: FoodItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AIParseResponse {
  success: boolean;
  mealType?: MealType;
  items: Omit<FoodItem, 'id'>[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  summaryNote?: string;
  error?: string;
}
