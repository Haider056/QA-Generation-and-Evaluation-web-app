import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiSearch } from 'react-icons/fi';
import Shell from '../ui/Shell';
import { AUTH_API, getUser, isMultipleChoice, tidyQuestion } from '../ui/api';

const slug = (s) => (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const fmtDate = (iso) => {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

function group(questions) {
  const books = new Map();
  for (const q of questions) {
    const b = q.bookTitle || 'Untitled book';
    const c = q.chapter || 'Unsorted';
    if (!books.has(b)) books.set(b, new Map());
    const chapters = books.get(b);
    if (!chapters.has(c)) chapters.set(c, []);
    chapters.get(c).push(q);
  }
  return [...books].map(([book, chapters]) => ({ book, chapters: [...chapters].map(([chapter, items]) => ({ chapter, items })) }));
}

function SavedItem({ q }) {
  const mc = isMultipleChoice(q);
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-6 border-t border-line px-5 py-4 first:border-t-0" data-testid="saved-item">
      <div className="min-w-0">
        <div className="text-md font-medium leading-6 text-ink">{tidyQuestion(q.question)}</div>
        {mc ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {q.answer.map((o, i) => (
              <span key={i} className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-sm ${o.correct ? 'border-accent bg-accent-soft font-medium text-ink' : 'border-line text-muted'}`}>
                {o.answer}{o.correct && <FiCheck size={12} strokeWidth={2.5} className="text-accent-ink" />}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-1 text-sm leading-[22px] text-muted">{q.answer}</div>
        )}
      </div>
      <div className="flex flex-col items-end gap-2 pt-0.5">
        <span className="rounded-sm border border-line px-1.5 text-2xs font-medium leading-5 text-muted">{mc ? 'Multiple choice' : 'Open'}</span>
      </div>
    </li>
  );
}

export default function SavedQuestion() {
  const navigate = useNavigate();
  const user = getUser();
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    fetch(`${AUTH_API}/questions?userId=${encodeURIComponent(user.id)}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad status'))))
      .then((d) => setQuestions(d.questions || []))
      .catch(() => setError('Could not load your saved questions.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!questions) return [];
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((x) => `${x.question} ${JSON.stringify(x.answer)} ${x.chapter}`.toLowerCase().includes(q));
  }, [questions, query]);
  const groups = useMemo(() => group(filtered), [filtered]);
  const lastSaved = questions && questions.length ? fmtDate(questions[0].createdAt) : null;

  return (
    <Shell>
      <div className="scroll-thin h-full overflow-y-auto" data-testid="saved-scroll">
        <div className="mx-auto grid max-w-[1120px] grid-cols-[220px_1fr] gap-12 px-8 pb-24 pt-12">
          <aside className="sticky top-12 self-start">
            {groups.map((g) => (
              <div key={g.book} className="mb-6">
                <div className="text-2xs font-medium uppercase tracking-[0.08em] text-faint">Book</div>
                <div className="mt-1.5 text-sm font-semibold leading-5 text-ink">{g.book}</div>
                <ul className="mt-3 space-y-0.5">
                  {g.chapters.map((c) => (
                    <li key={c.chapter}>
                      <a href={`#${slug(g.book)}-${slug(c.chapter)}`} className="flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-ink-2 hover:bg-sunken">
                        <span className="leading-5">{c.chapter}</span>
                        <span className="text-xs text-faint tabnum">{c.items.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <section className="min-w-0">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.015em] text-ink">Saved questions</h1>
                <p className="mt-1 text-base text-muted tabnum">
                  {questions == null ? 'Loading…' : `${questions.length} questions across ${groups.reduce((n, g) => n + g.chapters.length, 0)} chapters${lastSaved ? ` · last saved ${lastSaved}` : ''}`}
                </p>
              </div>
              <label className="relative block w-64">
                <FiSearch size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter questions"
                  className="h-9 w-full rounded-md border border-line-strong bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-faint outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
                />
              </label>
            </div>

            {error && <p className="mt-8 text-sm text-danger">{error}</p>}

            {questions && questions.length === 0 && (
              <div className="mt-10 rounded-lg border border-dashed border-line-strong bg-surface px-8 py-12 text-center">
                <div className="text-base font-medium text-ink">Nothing saved yet</div>
                <p className="mt-1 text-sm text-muted">Generate questions for a chapter and press Save to keep them here.</p>
                <Link to="/Home" className="mt-5 inline-flex h-8 items-center rounded-md bg-ink px-3 text-sm font-medium text-white hover:bg-ink-2">Open workspace</Link>
              </div>
            )}

            {groups.map((g) => (
              <div key={g.book} className="mt-10">
                {g.chapters.map((c) => (
                  <div key={c.chapter} id={`${slug(g.book)}-${slug(c.chapter)}`} className="mt-8 scroll-mt-6">
                    <div className="mb-3 flex items-baseline justify-between">
                      <h2 className="font-serif text-xl font-semibold text-ink">{c.chapter}</h2>
                      <span className="text-xs text-muted tabnum">{c.items.length} questions · {fmtDate(c.items[0].createdAt)}</span>
                    </div>
                    <ul className="rounded-lg border border-line bg-surface">
                      {c.items.map((q) => <SavedItem key={q.id} q={q} />)}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </section>
        </div>
      </div>
    </Shell>
  );
}
