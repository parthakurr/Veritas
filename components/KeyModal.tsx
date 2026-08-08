'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface KeyModalProps {
  isOpen: boolean;
  apiKey: string;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const KeyModal: React.FC<KeyModalProps> = ({
  isOpen,
  apiKey,
  onClose,
  onSave,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);

  useEffect(() => {
    setInputKey(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect your personal Google Gemini API key to enable live LLM nutrition parsing with 100% accuracy on custom dishes.
          </p>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 text-cyan-300 text-xs font-mono rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Local Storage</span>
            </div>
            <p>Your API key is stored securely in your browser session and never sent to third-party servers.</p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-cyan-400 hover:underline font-semibold mt-1"
            >
              <span>Get a free Gemini API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
