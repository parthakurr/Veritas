'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Zap, Command, X, CheckCircle2 } from 'lucide-react';
import { AIParseResponse } from '@/types/nutrition';

interface NaturalInputProps {
  onMealParsed: (parsedData: AIParseResponse, originalPrompt: string) => void;
  apiKey?: string;
}

const PRESET_PROMPTS = [
  "2 poached eggs with 2 slices of sourdough toast and half an avocado",
  "100gm chicken and 500gm biryani",
  "2 bottles of Amul protein lassi",
  "1 Yogabar protein bar and 500ml milk",
];

export const NaturalInput: React.FC<NaturalInputProps> = ({ onMealParsed, apiKey }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNote, setSuccessNote] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessNote(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }

      const res = await fetch('/api/parse-meal', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data: AIParseResponse = await res.json();

      if (data.success) {
        onMealParsed(data, prompt.trim());
        setPrompt('');
        if (data.summaryNote) {
          setSuccessNote(data.summaryNote);
          setTimeout(() => setSuccessNote(null), 4000);
        }
      } else {
        setErrorMsg(data.error || 'Failed to parse meal prompt. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while parsing';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 transition-all duration-300 focus-within:border-[#E03E2D] focus-within:ring-2 focus-within:ring-rose-500/10 overflow-hidden">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type what you ate... (e.g. '100gm chicken and 500gm biryani' or '2 bottles of Amul protein lassi')"
            rows={3}
            disabled={isLoading}
            className="w-full p-4 pr-16 bg-transparent text-slate-900 placeholder:text-slate-400 font-sans text-sm focus:outline-none resize-none disabled:opacity-50"
          />

          <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
              <Command className="w-3 h-3 text-slate-400" />
              <span>Press <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700">Enter ↵</kbd> to log</span>
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#E03E2D] hover:bg-[#C93323] text-white font-bold text-xs shadow-sm disabled:opacity-40 disabled:hover:bg-[#E03E2D] transition-all transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Parsing AI...</span>
                </>
              ) : (
                <>
                  <span>Log Meal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Preset Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1 font-mono">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Quick Prompts:</span>
        </span>
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(preset)}
            className="text-[11px] font-medium px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Feedback Banners */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between font-medium">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successNote && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNote}</span>
        </div>
      )}
    </div>
  );
};
