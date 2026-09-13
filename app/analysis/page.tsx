'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Theme = 'dark' | 'light';

const rules = [
  {
    type: 'General technical question',
    match: '90%',
    validFor: '1 hour',
    reuse: 'Yes',
    access: 'Public information',
    action: 'Reuse a strong and recent answer.',
    tone: 'green',
  },
  {
    type: 'Version-specific question',
    match: '94%',
    validFor: '15 minutes',
    reuse: 'Yes, carefully',
    access: 'Public information',
    action: 'Use a stricter match to avoid mixing versions.',
    tone: 'blue',
  },
  {
    type: 'Current prices or changing information',
    match: '96%',
    validFor: '5 minutes',
    reuse: 'Yes, carefully',
    access: 'Restricted information',
    action: 'Refresh quickly to avoid outdated information.',
    tone: 'amber',
  },
  {
    type: 'Private account information',
    match: 'Not applicable',
    validFor: 'Not reusable',
    reuse: 'No',
    access: 'Private information',
    action: 'Protect the information and avoid shared reuse.',
    tone: 'rose',
  },
  {
    type: 'Unrelated question',
    match: 'Not applicable',
    validFor: 'Not reusable',
    reuse: 'No',
    access: 'Outside supported topic',
    action: 'Do not use a technical answer for an unrelated question.',
    tone: 'gray',
  },
];

function toneClass(tone: string, isDark: boolean) {
  const styles: Record<string, string> = {
    green: isDark ? 'text-emerald-300' : 'text-emerald-700',
    blue: isDark ? 'text-cyan-300' : 'text-blue-700',
    amber: isDark ? 'text-amber-300' : 'text-amber-700',
    rose: isDark ? 'text-rose-300' : 'text-rose-700',
    gray: isDark ? 'text-slate-300' : 'text-slate-600',
  };

  return styles[tone] ?? styles.gray;
}

export default function UnderstandDecisionPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [showTechnical, setShowTechnical] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site-theme');

    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    }
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    localStorage.setItem('site-theme', nextTheme);
  }

  const isDark = theme === 'dark';

  const surface = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-slate-200';

  const softSurface = isDark
    ? 'bg-slate-950 border-slate-800'
    : 'bg-slate-50 border-slate-200';

  const heading = isDark ? 'text-white' : 'text-slate-900';
  const muted = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div
      className={`${
        isDark
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      } min-h-screen px-4 py-6 font-sans antialiased transition-colors duration-200 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header
          className={`${surface} flex flex-col gap-4 rounded-2xl border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between`}
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600" />

              <h1 className={`text-xl font-black tracking-tight ${heading}`}>
                SMART SEARCH LAB
              </h1>

              <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-600 dark:text-cyan-400">
                Semantic ISR research prototype
              </span>
            </div>

            <p className={`mt-1 text-xs ${muted}`}>
              Understand why an answer was reused, refreshed, or restricted.
            </p>
          </div>

          <nav
            className="flex flex-wrap items-center gap-2"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className={`${softSurface} rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition hover:border-blue-400 hover:text-blue-600`}
            >
              1. Ask a question
            </Link>

            <span className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white">
              2. Understand the decision
            </span>

            <Link
              href="/benchmark"
              className={`${softSurface} rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition hover:border-blue-400 hover:text-blue-600`}
            >
              3. Compare approaches
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className={`${softSurface} rounded-xl border px-3 py-1.5 text-xs font-semibold transition hover:border-blue-400`}
            >
              {isDark ? '☀️ Light mode' : '🌙 Dark mode'}
            </button>

            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Back to question
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          <section
            className={`${surface} rounded-2xl border p-6 shadow-sm sm:p-8`}
          >
            <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
              Step 2
            </p>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <h2 className={`text-3xl font-black tracking-tight ${heading}`}>
                  How does the system make decisions?
                </h2>

                <p className={`mt-3 text-base leading-relaxed ${muted}`}>
                  The system identifies the type of question, then checks its
                  match quality, freshness, topic, and privacy before reusing an
                  existing answer.
                </p>
              </div>

              <span
                className={`${softSurface} rounded-full border px-3 py-1.5 text-xs font-semibold ${muted}`}
              >
                Decision guide
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                [
                  '1',
                  'Understand the question',
                  'Identify whether it is technical, version-specific, current, private, or unrelated.',
                ],
                [
                  '2',
                  'Check the answer',
                  'Compare the question with existing answers and check whether the answer is still recent.',
                ],
                [
                  '3',
                  'Choose safely',
                  'Reuse the answer only when all required checks pass.',
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className={`${softSurface} rounded-xl border p-4`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {number}
                  </span>

                  <h3 className={`mt-3 text-sm font-bold ${heading}`}>
                    {title}
                  </h3>

                  <p className={`mt-1 text-sm leading-relaxed ${muted}`}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className={`${surface} rounded-2xl border p-6 shadow-sm sm:p-8`}
          >
            <div className="mb-5">
              <h3 className={`text-xl font-bold ${heading}`}>
                Rules used for each question type
              </h3>

              <p className={`mt-2 max-w-3xl text-sm ${muted}`}>
                More sensitive or fast-changing information requires stricter
                checks. A higher match requirement means the system is more
                cautious before reusing an answer.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead
                  className={
                    isDark
                      ? 'bg-slate-950 text-slate-300'
                      : 'bg-slate-50 text-slate-700'
                  }
                >
                  <tr>
                    <th className="p-4 font-semibold">Question type</th>
                    <th className="p-4 font-semibold">Required match</th>
                    <th className="p-4 font-semibold">Valid for</th>
                    <th className="p-4 font-semibold">Reuse answer?</th>
                    <th className="p-4 font-semibold">
                      Information access
                    </th>
                    <th className="p-4 font-semibold">What happens</th>
                  </tr>
                </thead>

                <tbody
                  className={
                    isDark
                      ? 'divide-y divide-slate-800'
                      : 'divide-y divide-slate-100'
                  }
                >
                  {rules.map((rule) => (
                    <tr
                      key={rule.type}
                      className={
                        isDark
                          ? 'hover:bg-slate-800/40'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td
                        className={`p-4 font-semibold ${toneClass(
                          rule.tone,
                          isDark,
                        )}`}
                      >
                        {rule.type}
                      </td>

                      <td className="p-4">{rule.match}</td>
                      <td className="p-4">{rule.validFor}</td>
                      <td className="p-4 font-semibold">{rule.reuse}</td>
                      <td className="p-4">{rule.access}</td>
                      <td className={`p-4 ${muted}`}>{rule.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            className={`${surface} rounded-2xl border p-6 shadow-sm sm:p-8`}
          >
            <h3 className={`text-xl font-bold ${heading}`}>
              What do the rules mean?
            </h3>

            <p className={`mt-1 text-sm ${muted}`}>
              These examples explain the table in everyday language.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className={`${softSurface} rounded-xl border p-4`}>
                <p className="text-sm font-bold text-blue-600 dark:text-cyan-400">
                  Higher match requirement
                </p>

                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  The system becomes more careful when a wrong answer could be
                  confusing, such as with software versions or prices.
                </p>
              </div>

              <div className={`${softSurface} rounded-xl border p-4`}>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-300">
                  Shorter validity period
                </p>

                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  Prices and other changing information are refreshed sooner so
                  an old answer is not reused.
                </p>
              </div>

              <div className={`${softSurface} rounded-xl border p-4`}>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-300">
                  Privacy protection
                </p>

                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  Questions involving account information do not use shared
                  answers.
                </p>
              </div>
            </div>
          </section>

          <section
            className={`${surface} rounded-2xl border p-6 shadow-sm sm:p-8`}
          >
            <button
              type="button"
              onClick={() => setShowTechnical((value) => !value)}
              className="flex w-full items-center justify-between text-left"
              aria-expanded={showTechnical}
            >
              <span>
                <span className={`block text-lg font-bold ${heading}`}>
                  Technical details
                </span>

                <span className={`mt-1 block text-sm ${muted}`}>
                  Show the academic notation and decision formula used by the
                  prototype.
                </span>
              </span>

              <span className="ml-4 text-xl font-bold text-blue-600 dark:text-cyan-400">
                {showTechnical ? '−' : '+'}
              </span>
            </button>

            {showTechnical && (
              <div
                className={`${softSurface} mt-5 space-y-5 rounded-xl border p-5 text-sm`}
              >
                <div>
                  <p className="font-bold text-blue-600 dark:text-cyan-400">
                    Policy tuple
                  </p>

                  <p className={`mt-2 leading-relaxed ${muted}`}>
                    Each question type is represented as Pᵢ = (τᵢ, Tᵢ, Cᵢ,
                    Sᵢ).
                  </p>

                  <ul className={`mt-2 space-y-1 ${muted}`}>
                    <li>τᵢ: required similarity threshold.</li>
                    <li>Tᵢ: maximum answer age in seconds.</li>
                    <li>Cᵢ: whether shared answer reuse is permitted.</li>
                    <li>Sᵢ: information-access scope.</li>
                  </ul>
                </div>

                <div
                  className={`${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  } border-t pt-5`}
                >
                  <p className="font-bold text-amber-600 dark:text-amber-300">
                    Decision rule
                  </p>

                  <code
                    className={`${
                      isDark
                        ? 'bg-slate-900 text-slate-200'
                        : 'bg-white text-slate-800'
                    } mt-2 block overflow-x-auto rounded-lg border p-3 font-mono text-xs`}
                  >
                    AnswerReused = (match ≥ threshold) AND (age ≤ validity) AND
                    (topic matches) AND (reuse allowed)
                  </code>

                  <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
                    The final decision requires every condition to pass before
                    an existing answer is reused.
                  </p>
                </div>

                <div
                  className={`${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  } border-t pt-5`}
                >
                  <p className="font-bold text-emerald-600 dark:text-emerald-300">
                    Research reference
                  </p>

                  <p className={`mt-2 ${muted}`}>
                    Academic mapping: thesis Chapter 3.6 · Dynamic intent-aware
                    answer reuse policy.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}