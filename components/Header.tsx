'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('site-theme') as 'dark' | 'light' | null;
    if (saved === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('site-theme', next);
    if (next === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }

  const links = [
    { href: '/', label: 'Try it' },
    { href: '/how-it-thinks', label: 'How it thinks' },
    { href: '/proof', label: 'Proof' },
    { href: '/architecture', label: 'Architecture' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg)]/85 border-b border-[var(--border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></span>
          <span className="font-extrabold text-base tracking-tight text-[var(--text)] font-mono">
            Semantic ISR
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
            v2.5
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--surface)] p-1 rounded-full border border-[var(--border)] text-xs">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-[var(--text-dim)] hover:text-[var(--text)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls: Europe-West status + Dark/Light button together */}
        <div className="flex items-center gap-2">
          {/* Europe-west pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-emerald-400">LIVE</span>
            <span className="text-[var(--text-mute)] font-semibold">europe-west3</span>
          </div>

          {/* Dark / Light toggle button right next to it */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold hover:border-blue-400 transition shadow-sm text-[var(--text)]"
            title="Toggle theme"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}