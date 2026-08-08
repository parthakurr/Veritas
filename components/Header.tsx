'use client';

import React from 'react';
import { Sparkles, Target, RotateCcw, Flame, Key } from 'lucide-react';

interface HeaderProps {
  onOpenGoalsModal: () => void;
  onOpenKeyModal: () => void;
  onResetLogs: () => void;
  hasApiKey: boolean;
  streakDays?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGoalsModal,
  onOpenKeyModal,
  onResetLogs,
  hasApiKey,
  streakDays = 7,
}) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/60 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                VERITAS<span className="text-cyan-400">.AI</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full uppercase">
                {hasApiKey ? 'Gemini Live' : 'Healthify AI'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{today}</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak Counter */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              hasApiKey
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/60'
                : 'bg-slate-900/80 text-cyan-400 border-slate-700/60 hover:bg-slate-800'
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'API Key Active' : 'Set Gemini Key'}</span>
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          </button>

          {/* Target Goals Button */}
          <button
            onClick={onOpenGoalsModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            title="Edit Daily Targets"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Set Goals</span>
          </button>

          {/* Reset Logs Button */}
          <button
            onClick={onResetLogs}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-900/50 text-xs font-medium transition-all"
            title="Reset Today's Logs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
