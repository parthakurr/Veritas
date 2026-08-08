'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DateMealLogs } from '@/types/user';
import { MealLog, MacroGoals } from '@/types/nutrition';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  dateMealLogs: DateMealLogs;
  currentDayMeals: MealLog[];
  loginWithGoogle: () => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addMealLog: (meal: MealLog, targetDate?: string) => void;
  updateMealLog: (updatedMeal: MealLog, targetDate?: string) => void;
  deleteMealLog: (mealId: string, targetDate?: string) => void;
  resetCurrentDayLogs: (targetDate?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getTodayIsoString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_guest',
  name: 'Alex Mercer',
  email: 'alex.mercer@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  gender: 'male',
  age: 26,
  heightCm: 178,
  weightKg: 74,
  activityLevel: 'moderate',
  goal: 'fat_loss',
  tdee: 2450,
  macroGoals: { calories: 2150, protein: 150, carbs: 210, fat: 60 },
  isOnboarded: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayIsoString());
  const [dateMealLogs, setDateMealLogs] = useState<DateMealLogs>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('veritas_user_v2');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedLogs = localStorage.getItem('veritas_date_logs_v2');
      if (savedLogs) {
        setDateMealLogs(JSON.parse(savedLogs));
      } else {
        // Initial sample data for today
        const todayKey = getTodayIsoString();
        setDateMealLogs({
          [todayKey]: [
            {
              id: 'meal_sample_1',
              timestamp: '8:30 AM',
              prompt: '2 poached eggs with sourdough toast and half an avocado',
              mealType: 'breakfast',
              items: [
                { id: 'i1', name: 'Poached Eggs', servingSize: '2 large', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.6 },
                { id: 'i2', name: 'Sourdough Toast', servingSize: '2 slices (70g)', calories: 186, protein: 7.0, carbs: 36.0, fat: 1.2 },
                { id: 'i3', name: 'Avocado', servingSize: '0.5 medium', calories: 120, protein: 1.5, carbs: 6.0, fat: 11.0 },
              ],
              totals: { calories: 450, protein: 21.1, carbs: 42.8, fat: 21.8 },
            },
          ],
        });
      }
    } catch (e) {
      console.warn('LocalStorage error', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (user) localStorage.setItem('veritas_user_v2', JSON.stringify(user));
      else localStorage.removeItem('veritas_user_v2');
      localStorage.setItem('veritas_date_logs_v2', JSON.stringify(dateMealLogs));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [user, dateMealLogs, isLoaded]);

  const loginWithGoogle = () => {
    setUser(DEFAULT_USER);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...profile };
    });
  };

  const currentDayMeals = dateMealLogs[selectedDate] || [];

  const addMealLog = (meal: MealLog, targetDate: string = selectedDate) => {
    setDateMealLogs((prev) => {
      const existing = prev[targetDate] || [];
      return {
        ...prev,
        [targetDate]: [meal, ...existing],
      };
    });
  };

  const updateMealLog = (updatedMeal: MealLog, targetDate: string = selectedDate) => {
    setDateMealLogs((prev) => {
      const existing = prev[targetDate] || [];
      return {
        ...prev,
        [targetDate]: existing.map((m) => (m.id === updatedMeal.id ? updatedMeal : m)),
      };
    });
  };

  const deleteMealLog = (mealId: string, targetDate: string = selectedDate) => {
    setDateMealLogs((prev) => {
      const existing = prev[targetDate] || [];
      return {
        ...prev,
        [targetDate]: existing.filter((m) => m.id !== mealId),
      };
    });
  };

  const resetCurrentDayLogs = (targetDate: string = selectedDate) => {
    setDateMealLogs((prev) => ({
      ...prev,
      [targetDate]: [],
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        selectedDate,
        setSelectedDate,
        dateMealLogs,
        currentDayMeals,
        loginWithGoogle,
        logout,
        updateUserProfile,
        addMealLog,
        updateMealLog,
        deleteMealLog,
        resetCurrentDayLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
