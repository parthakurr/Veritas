'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { MealLog, MacroGoals } from '@/types/nutrition';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updateMacroGoals: (goals: MacroGoals) => void;
  dateMealLogs: Record<string, MealLog[]>;
  saveMealLog: (meal: MealLog) => void;
  deleteMealLog: (mealId: string, targetDate?: string) => void;
  updateMealLog: (meal: MealLog) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_1',
  name: 'Alex Johnson',
  email: 'alex@veritas.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  gender: 'male',
  age: 26,
  heightCm: 178,
  weightKg: 76,
  goal: 'muscle_gain',
  activityLevel: 'moderate',
  tdee: 2450,
  macroGoals: {
    calories: 2400,
    protein: 170,
    carbs: 250,
    fat: 65,
  },
  isOnboarded: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [dateMealLogs, setDateMealLogs] = useState<Record<string, MealLog[]>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const authUser: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Veritas Lifter',
          email: firebaseUser.email || 'user@veritas.ai',
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          gender: 'male',
          age: 25,
          heightCm: 175,
          weightKg: 75,
          goal: 'muscle_gain',
          activityLevel: 'moderate',
          tdee: 2400,
          macroGoals: {
            calories: 2400,
            protein: 170,
            carbs: 250,
            fat: 65,
          },
          isOnboarded: true,
        };
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const loggedUser: UserProfile = {
          id: result.user.uid,
          name: result.user.displayName || 'Veritas Lifter',
          email: result.user.email || 'user@veritas.ai',
          avatar: result.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          gender: 'male',
          age: 25,
          heightCm: 175,
          weightKg: 75,
          goal: 'muscle_gain',
          activityLevel: 'moderate',
          tdee: 2400,
          macroGoals: {
            calories: 2400,
            protein: 170,
            carbs: 250,
            fat: 65,
          },
          isOnboarded: true,
        };
        setUser(loggedUser);
      }
    } catch (error) {
      console.warn('Google Popup Auth fallback', error);
      setUser(DEFAULT_USER);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const updateMacroGoals = (goals: MacroGoals) => {
    if (!user) return;
    setUser({
      ...user,
      macroGoals: goals,
    });
  };

  const saveMealLog = (meal: MealLog) => {
    const dateKey = meal.timestamp.split('T')[0] || new Date().toISOString().split('T')[0];
    setDateMealLogs((prev) => ({
      ...prev,
      [dateKey]: [meal, ...(prev[dateKey] || [])],
    }));
  };

  const deleteMealLog = (mealId: string, targetDate?: string) => {
    setDateMealLogs((prev) => {
      const dateKey = targetDate || Object.keys(prev).find((d) => prev[d].some((m) => m.id === mealId));
      if (!dateKey) return prev;
      return {
        ...prev,
        [dateKey]: prev[dateKey].filter((m) => m.id !== mealId),
      };
    });
  };

  const updateMealLog = (updatedMeal: MealLog) => {
    const dateKey = updatedMeal.timestamp.split('T')[0] || new Date().toISOString().split('T')[0];
    setDateMealLogs((prev) => {
      const existing = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: existing.map((m) => (m.id === updatedMeal.id ? updatedMeal : m)),
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        updateUserProfile,
        updateMacroGoals,
        dateMealLogs,
        saveMealLog,
        deleteMealLog,
        updateMealLog,
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
