import { Gender, ActivityLevel, FitnessGoal } from '@/types/user';
import { MacroGoals } from '@/types/nutrition';

export interface CalculationInput {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
}

export function calculateTDEEAndMacros(input: CalculationInput): {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macroGoals: MacroGoals;
} {
  const { gender, age, heightCm, weightKg, activityLevel, goal } = input;

  // Mifflin-St Jeor Equation for BMR
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  // Activity Multipliers
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.375));

  // Goal Adjustment
  let targetCalories = tdee;
  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.15); // 15% surplus
  }

  // Recommended Macro Distribution:
  // Protein: 2.0g per kg of body weight
  const proteinGrams = Math.round(weightKg * 2.0);
  const proteinCalories = proteinGrams * 4;

  // Fat: 25% of target calories (9 kcal/g)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: Remaining calories (4 kcal/g)
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbsGrams = Math.round(remainingCalories / 4);

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macroGoals: {
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
    },
  };
}
