'use client';

import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySaved }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('GEMINI_API_KEY');
      if (saved) setApiKey(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
    }
    onKeySaved(apiKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0b101b] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-sky-400 font-mono uppercase tracking-wider">
            🔑 Gemini API Gate Key
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs font-mono p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          Enter your Google AI Studio API key for live <b>Gemini 2.5 Flash / 2.0 Flash</b> inference execution.
        </p>

        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
        />

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-mono font-semibold transition"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
}