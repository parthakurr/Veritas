'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ArrowRight, ArrowLeft, CheckCircle2, Target, Activity, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { calculateTDEEAndMacros } from '@/lib/calculator';
import { Gender, ActivityLevel, FitnessGoal } from '@/types/user';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<Gender>(user?.gender || 'male');
  const [age, setAge] = useState<number>(user?.age || 26);
  const [heightCm, setHeightCm] = useState<number>(user?.heightCm || 178);
  const [weightKg, setWeightKg] = useState<number>(user?.weightKg || 74);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState<FitnessGoal>(user?.goal || 'fat_loss');

  const recommendation = calculateTDEEAndMacros({
    gender,
    age,
    heightCm,
    weightKg,
    activityLevel,
    goal,
  });

  const handleFinishOnboarding = () => {
    updateUserProfile({
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      goal,
      tdee: recommendation.tdee,
      macroGoals: recommendation.macroGoals,
      isOnboarded: true,
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 bg-ambient-glow flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col justify-center">
        {/* Progress Step Dots */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-[#E03E2D]'
                  : s < step
                  ? 'w-6 bg-emerald-500'
                  : 'w-6 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          {/* Step 1: Gender & Age */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2">
                <div className="p-3 rounded-2xl bg-rose-50 text-[#E03E2D] w-max mx-auto border border-rose-100">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Let&apos;s get to know you</h2>
                <p className="text-xs text-slate-500 font-medium">Step 1 of 4: Biological Profile</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Biological Sex
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`p-4 rounded-2xl border text-center transition font-bold text-sm ${
                        gender === 'male'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`p-4 rounded-2xl border text-center transition font-bold text-sm ${
                        gender === 'female'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Math.max(12, parseInt(e.target.value) || 20))}
                    className="w-full bg-slate-50 text-slate-900 font-mono font-bold text-lg rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#E03E2D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Height & Weight */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 w-max mx-auto border border-emerald-100">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Body Metrics</h2>
                <p className="text-xs text-slate-500 font-medium">Step 2 of 4: Height & Weight</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Math.max(100, parseInt(e.target.value) || 170))}
                    className="w-full bg-slate-50 text-slate-900 font-mono font-bold text-lg rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Math.max(30, parseInt(e.target.value) || 70))}
                    className="w-full bg-slate-50 text-slate-900 font-mono font-bold text-lg rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Activity & Goal */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 w-max mx-auto border border-amber-100">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Activity & Goal</h2>
                <p className="text-xs text-slate-500 font-medium">Step 3 of 4: Energy Expenditure</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                    className="w-full bg-slate-50 text-slate-900 font-semibold text-sm rounded-2xl px-4 py-3 border border-slate-200 focus:outline-none focus:border-[#E03E2D]"
                  >
                    <option value="sedentary">Sedentary (Desk Job, little exercise)</option>
                    <option value="light">Light Activity (Exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate Activity (Exercise 3-5 days/week)</option>
                    <option value="active">Active (Heavy Exercise 6-7 days/week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Primary Goal
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setGoal('fat_loss')}
                      className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                        goal === 'fat_loss'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Fat Loss (-20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoal('maintenance')}
                      className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                        goal === 'maintenance'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Maintain Weight
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoal('muscle_gain')}
                      className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                        goal === 'muscle_gain'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Muscle Gain (+15%)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
              <div className="p-3 rounded-2xl bg-rose-50 text-[#E03E2D] w-max mx-auto border border-rose-100">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Your Personalized Plan is Ready!</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Calculated via Mifflin-St Jeor Clinical Formula</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Daily Target</span>
                  <span className="text-2xl font-extrabold text-slate-900">{recommendation.targetCalories}</span>
                  <span className="text-[10px] text-slate-500 block">kcal/day</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 uppercase font-sans font-bold block">Protein Target</span>
                  <span className="text-2xl font-extrabold text-emerald-700">{recommendation.macroGoals.protein}g</span>
                  <span className="text-[10px] text-emerald-600 block">2.0g/kg</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-800 uppercase font-sans font-bold block">Carbs Target</span>
                  <span className="text-2xl font-extrabold text-amber-700">{recommendation.macroGoals.carbs}g</span>
                  <span className="text-[10px] text-amber-600 block">energy source</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] text-[#E03E2D] uppercase font-sans font-bold block">Fat Target</span>
                  <span className="text-2xl font-extrabold text-[#E03E2D]">{recommendation.macroGoals.fat}g</span>
                  <span className="text-[10px] text-rose-500 block">25% cals</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-[#E03E2D] hover:bg-[#C93323] text-white font-bold text-xs shadow-md shadow-rose-500/20 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="flex items-center space-x-1.5 px-8 py-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition transform hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Plan & Go to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
