'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenApiKeyModal?: () => void;
}

export default function Navbar({ onOpenApiKeyModal }: NavbarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('semantic_isr_api_key');
    const storedOllama = localStorage.getItem('semantic_isr_ollama_url');
    if (storedKey) setApiKey(storedKey);
    if (storedOllama) setOllamaUrl(storedOllama);
  }, []);

  const handleOpen = () => {
    if (onOpenApiKeyModal) {
      onOpenApiKeyModal();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('semantic_isr_api_key', apiKey);
    localStorage.setItem('semantic_isr_ollama_url', ollamaUrl);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsModalOpen(false);
    }, 900);
  };

  const navItems = [
    { label: '01. Gatekeeper Lab', href: '/' },
    { label: '02. Analysis Hub', href: '/analysis-hub' },
    { label: '03. 100-Prompt Benchmark', href: '/benchmark' },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shadow-sm" />
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-extrabold text-xl tracking-tight text-sky-600 hover:text-sky-700 transition-colors">
                SEMANTIC ISR LAB
              </span>
              <span className="text-xs font-mono text-slate-400">v2.5-thesis</span>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* API Key Trigger & Cloud Info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpen}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-sm transition-colors cursor-pointer"
            >
              <span>🔑</span>
              <span>API Gate Key</span>
            </button>

            <div className="border border-purple-200 bg-purple-50/70 rounded-md px-2.5 py-1 text-right">
              <div className="text-[9px] uppercase tracking-wider font-semibold text-purple-600">
                Cloud Run
              </div>
              <div className="text-[11px] font-mono font-medium text-purple-900">
                us-central1
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* API Key Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 max-w-md w-full shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔑</span>
                <h3 className="font-black text-slate-900 tracking-tight text-base">
                  API & Gatekeeper Configuration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-mono font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-600 uppercase block">
                  Google Vertex AI / Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 transition"
                />
                <p className="text-[11px] text-slate-400">
                  Used for real-time `text-embedding-004` calls and cache busts.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-600 uppercase block">
                  Ollama Daemon Endpoint
                </label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 transition"
                />
                <p className="text-[11px] text-slate-400">
                  Local fallback engine for nomic-embed-text inference.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition cursor-pointer"
                >
                  {savedSuccess ? '✓ Saved!' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}