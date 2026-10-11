import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import {
  FiUploadCloud, FiFileText, FiChevronLeft, FiChevronRight, FiRefreshCw, FiCheck, FiEye, FiEyeOff, FiBookmark, FiAlertCircle,
} from 'react-icons/fi';
import Shell from '../ui/Shell';
import Toast from '../ui/Toast';
import { AUTH_API, QG_API, getUser, isMultipleChoice, correctOption, tidyQuestion } from '../ui/api';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

const MAX_WORDS = 500; // the generator works on one chapter-sized chunk
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

// ---------- PDF helpers ----------
async function resolvePageIndex(pdf, dest) {
  let d = dest;
  if (typeof d === 'string') d = await pdf.getDestination(d);
  if (Array.isArray(d)) d = d[0];
  if (d == null) return null;
  return typeof d === 'number' ? d : pdf.getPageIndex(d);
}

async function readOutline(pdf) {
  const outline = (await pdf.getOutline()) || [];
  const flat = [];
  const walk = (items, depth) => items.forEach((it) => { flat.push({ title: norm(it.title), dest: it.dest, depth }); if (it.items) walk(it.items, depth + 1); });
  walk(outline, 0);
  const chapters = [];
  for (const item of flat) {
    const pageIndex = await resolvePageIndex(pdf, item.dest).catch(() => null);
    if (pageIndex != null) chapters.push({ title: item.title, depth: item.depth, page: pageIndex + 1 });
  }
  return chapters;
}

// Rebuilds paragraphs from positioned text runs, so the heading and body never run together.
async function readParagraphs(pdf, fromPage, toPage) {
  const paragraphs = [];
  for (let p = fromPage; p <= toPage; p++) {
    const page = await pdf.getPage(p);
    const { items } = await page.getTextContent();
    let cur = '';
    let lastY = null;
    for (const item of items) {
      if (!('str' in item)) continue;
      const y = item.transform[5];
      const h = item.height || 12;
      if (lastY !== null && Math.abs(lastY - y) > 1) {
        if (lastY - y > h * 1.9 || y > lastY) { if (norm(cur)) paragraphs.push(norm(cur)); cur = ''; } else cur += ' ';
      }
      cur += item.str;
      if (item.str) lastY = y;
    }
    if (norm(cur)) paragraphs.push(norm(cur));
  }
  return paragraphs;
}

// ---------- small UI pieces ----------
function Button({ variant = 'secondary', className = '', children, ...props }) {
  const styles = {
    primary: 'bg-ink text-white hover:bg-ink-2 border border-ink',
    secondary: 'bg-surface text-ink border border-line-strong hover:bg-sunken',
    ghost: 'text-muted hover:text-ink hover:bg-sunken border border-transparent',
  }[variant];
  return (
    <button {...props} className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors disabled:cursor-default disabled:opacity-50 ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Tag({ children }) {
  return <span className="rounded-sm border border-line px-1.5 text-2xs font-medium leading-5 text-muted">{children}</span>;
}

function Marked({ text, needle }) {
  const n = norm(needle);
  const i = n ? text.indexOf(n) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="marker" data-marker>{text.slice(i, i + n.length)}</mark>
      {text.slice(i + n.length)}
    </>
  );
}

// ---------- empty / upload state ----------
function UploadState({ onFile, reading }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-[560px]">
        <h1 className="text-2xl font-semibold tracking-[-0.015em] text-ink">Start with a book</h1>
        <p className="mt-1 text-base text-muted">Upload a PDF. GenQuest reads its table of contents so you can study one chapter at a time.</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}
          className={`mt-8 flex h-[264px] flex-col items-center justify-center rounded-lg border border-dashed px-8 text-center transition-colors ${over ? 'border-ink bg-sunken' : 'border-line-strong bg-surface'}`}
        >
          {reading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-ink" />
              <div className="mt-4 text-base font-medium text-ink">Reading {reading}</div>
              <div className="mt-1 text-sm text-muted">Extracting title, author and chapters</div>
            </>
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-canvas text-ink-2"><FiUploadCloud size={18} /></span>
              <div className="mt-4 text-base font-medium text-ink">Drop a PDF here</div>
              <div className="mt-1 text-sm text-muted">or choose a file from your computer</div>
              <Button variant="primary" className="mt-6" onClick={() => inputRef.current.click()}>Choose PDF</Button>
            </>
          )}
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" data-testid="pdf-input" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        </div>
        <ol className="mt-8 grid grid-cols-3 gap-6 text-sm">
          {[
            ['Pick a chapter', 'Chapters come from the PDF outline.'],
            ['Generate', 'Open and multiple-choice questions in about ten seconds.'],
            ['Save', 'Keep the good ones in your library.'],
          ].map(([t, d], i) => (
            <li key={t}>
              <div className="text-xs font-medium text-faint tabnum">0{i + 1}</div>
              <div className="mt-1 font-medium text-ink">{t}</div>
              <div className="mt-0.5 text-muted">{d}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ---------- sidebar ----------
function Sidebar({ book, selected, onSelect, results, onReplace }) {
  const replaceRef = useRef(null);
  return (
    <aside className="flex h-full w-[264px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="border-b border-line p-4">
        <div className="text-2xs font-medium uppercase tracking-[0.08em] text-faint">Book</div>
        <div className="mt-2 text-base font-semibold leading-5 text-ink" data-testid="book-title">{book.title}</div>
        <div className="mt-1 text-sm text-muted">{book.author}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-faint tabnum">{book.pageCount} pages · {book.chapters.length} chapters</span>
          <button onClick={() => replaceRef.current.click()} className="text-xs font-medium text-muted hover:text-ink">Replace</button>
          <input ref={replaceRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files[0] && onReplace(e.target.files[0])} />
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <span className="text-2xs font-medium uppercase tracking-[0.08em] text-faint">Chapters</span>
      </div>
      <nav className="scroll-thin min-h-0 flex-1 overflow-y-auto px-2 pb-4" data-testid="chapters">
        {book.chapters.length === 0 && <p className="px-2 text-sm text-muted">This PDF has no table of contents.</p>}
        {book.chapters.map((c, i) => {
          const r = results[i];
          const active = i === selected;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              data-chapter={i}
              className={`relative flex w-full items-start gap-2 rounded-md py-2 pl-3 pr-2 text-left text-sm transition-colors ${active ? 'bg-sunken text-ink' : 'text-ink-2 hover:bg-canvas'}`}
            >
              {active && <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-accent" />}
              <span className={`w-5 shrink-0 tabnum ${active ? 'text-ink-2' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={`flex-1 leading-5 ${active ? 'font-medium' : ''}`}>{c.title}</span>
              {r && r.questions && (
                <span className="mt-0.5 flex items-center gap-1 text-2xs text-faint tabnum" title={r.saved ? 'Saved' : 'Generated'}>
                  {r.saved ? <FiBookmark size={11} className="text-ink-2" /> : null}{r.questions.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-line px-4 py-3 text-2xs leading-4 text-faint">
        Models: T5 generator · BERT evaluator
      </div>
    </aside>
  );
}

// ---------- reading pane ----------
function Reader({ book, index, chapter, paragraphs, loading, highlight, onPrev, onNext }) {
  const words = useMemo(() => paragraphs.join(' ').split(/\s+/).filter(Boolean).length, [paragraphs]);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [index]);
  useEffect(() => {
    const el = scrollRef.current && scrollRef.current.querySelector('[data-marker]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [highlight]);
  return (
    <section className="flex min-w-0 flex-1 flex-col bg-surface">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-line px-6 text-sm text-muted">
        <div className="truncate">
          <span>{book.title.split(':')[0]}</span>
          <span className="px-2 text-faint">/</span>
          <span className="text-ink-2">Chapter {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-xs text-faint tabnum">Page {chapter.page}</span>
          <button onClick={onPrev} disabled={index === 0} aria-label="Previous chapter" className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-sunken disabled:opacity-30"><FiChevronLeft size={16} /></button>
          <button onClick={onNext} disabled={index >= book.chapters.length - 1} aria-label="Next chapter" className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-sunken disabled:opacity-30"><FiChevronRight size={16} /></button>
        </div>
      </div>
      <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto" data-testid="reader">
        <article className="mx-auto max-w-measure px-8 pb-24 pt-14">
          <div className="text-xs font-medium uppercase tracking-[0.08em] text-faint">Chapter {index + 1}</div>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.01em] text-ink" data-testid="chapter-title">{chapter.title}</h1>
          <div className="mt-3 text-sm text-muted tabnum">{loading ? 'Loading…' : `${words} words · ${Math.max(1, Math.round(words / 230))} min read`}</div>
          <div className="mt-8 h-px bg-line" />
          {loading ? (
            <div className="mt-8 space-y-3">{[100, 96, 98, 70].map((w, i) => <div key={i} className="h-4 animate-shimmer rounded-sm bg-sunken" style={{ width: `${w}%` }} />)}</div>
          ) : (
            <div className="mt-8 space-y-5 font-serif text-[17px] leading-[30px] text-ink-2">
              {paragraphs.map((p, i) => <p key={i}><Marked text={p} needle={highlight} /></p>)}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

// ---------- questions pane ----------
const STAGES = [
  [0, 'Splitting the chapter into sentences'],
  [1200, 'Drafting questions with T5'],
  [4500, 'Building answer options with spaCy'],
  [7500, 'Ranking pairs with the BERT evaluator'],
];

function Generating({ startedAt }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 100); return () => clearInterval(t); }, []);
  const elapsed = now - startedAt;
  const stage = STAGES.filter(([t]) => elapsed >= t).length - 1;
  const pct = Math.min(92, (elapsed / 11000) * 100);
  return (
    <div className="space-y-3 p-4" data-testid="generating">
      <div className="rounded-lg border border-line bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Generating questions</span>
          <span className="text-xs text-muted tabnum">{(elapsed / 1000).toFixed(1)} s</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-sunken">
          <div className="h-full rounded-full bg-ink transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {STAGES.map(([, label], i) => (
            <li key={label} className={`flex items-center gap-2 ${i < stage ? 'text-muted' : i === stage ? 'text-ink' : 'text-faint'}`}>
              <span className="flex h-4 w-4 items-center justify-center">
                {i < stage ? <FiCheck size={13} /> : i === stage ? <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-line border-t-ink" /> : <span className="h-1 w-1 rounded-full bg-line-strong" />}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex gap-2"><div className="h-4 w-6 animate-shimmer rounded-sm bg-sunken" /><div className="h-4 w-16 animate-shimmer rounded-sm bg-sunken" /></div>
          <div className="mt-3 h-4 w-11/12 animate-shimmer rounded-sm bg-sunken" />
          <div className="mt-2 h-4 w-3/5 animate-shimmer rounded-sm bg-sunken" />
          <div className="mt-4 h-7 w-28 animate-shimmer rounded-sm bg-sunken" />
        </div>
      ))}
    </div>
  );
}

function QuestionCard({ q, n, revealed, active, onReveal, onFocus }) {
  const mc = isMultipleChoice(q);
  return (
    <div
      onMouseEnter={onFocus}
      className={`animate-rise rounded-lg border bg-surface p-4 transition-colors ${active && revealed ? 'border-line-strong' : 'border-line'}`}
      style={{ animationDelay: `${n * 45}ms` }}
      data-testid="question-card"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-faint tabnum">Q{n + 1}</span>
        <Tag>{mc ? 'Multiple choice' : 'Open'}</Tag>
      </div>
      <div className="mt-2 text-md font-medium leading-6 text-ink">{tidyQuestion(q.question)}</div>
      {mc && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {q.answer.map((o, i) => {
            const right = revealed && o.correct;
            return (
              <span key={i} className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-sm leading-5 transition-colors ${right ? 'border-accent bg-accent-soft font-medium text-ink' : revealed ? 'border-line text-faint' : 'border-line text-ink-2'}`}>
                <span className="text-2xs text-faint">{String.fromCharCode(65 + i)}</span>
                <span className="min-w-0 flex-1">{o.answer}</span>
                {right && <FiCheck size={13} strokeWidth={2.5} className="shrink-0 text-accent-ink" />}
              </span>
            );
          })}
        </div>
      )}
      {!mc && revealed && (
        <div className="mt-3 border-l-2 border-accent pl-3 text-sm leading-[22px] text-ink-2">{q.answer}</div>
      )}
      <button onClick={onReveal} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink" data-testid="reveal">
        {revealed ? <FiEyeOff size={13} /> : <FiEye size={13} />}
        {revealed ? 'Hide answer' : mc ? 'Show correct option' : 'Show answer'}
      </button>
    </div>
  );
}

function QuestionsPane({ chapter, state, onGenerate, onSave, revealed, setRevealed, active, setActive }) {
  const questions = (state && state.questions) || [];
  const loading = state && state.loading;
  const allRevealed = questions.length > 0 && revealed.size === questions.length;
  return (
    <aside className="flex h-full w-[440px] shrink-0 flex-col border-l border-line bg-canvas">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-surface px-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-ink">Questions</span>
          {questions.length > 0 && <span className="rounded-sm bg-sunken px-1.5 text-xs leading-5 text-muted tabnum">{questions.length}</span>}
        </div>
        {questions.length > 0 && !loading && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={() => setRevealed(allRevealed ? new Set() : new Set(questions.map((_, i) => i)))}>
              {allRevealed ? 'Hide answers' : 'Reveal all'}
            </Button>
            <Button variant="ghost" onClick={onGenerate} aria-label="Regenerate" title="Regenerate"><FiRefreshCw size={13} /></Button>
            <Button variant={state.saved ? 'secondary' : 'primary'} className={state.saved ? 'disabled:opacity-100' : ''} onClick={onSave} disabled={state.saved || state.saving} data-testid="save">
              {state.saved ? <><FiCheck size={14} /> Saved</> : state.saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        )}
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto" data-testid="questions">
        {loading ? (
          <Generating startedAt={state.startedAt} />
        ) : questions.length > 0 ? (
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between px-1 text-xs text-muted tabnum">
              <span>From “{chapter.title}”</span>
              <span>{(state.ms / 1000).toFixed(1)} s</span>
            </div>
            {questions.map((q, i) => (
              <QuestionCard
                key={`${state.runId}-${i}`}
                q={q}
                n={i}
                revealed={revealed.has(i)}
                active={active === i}
                onFocus={() => setActive(i)}
                onReveal={() => {
                  const next = new Set(revealed);
                  if (next.has(i)) next.delete(i); else next.add(i);
                  setRevealed(next);
                  setActive(i);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center px-8 pb-16">
            {state && state.error && (
              <div className="mb-6 flex gap-2 rounded-md border border-line bg-surface p-3 text-sm text-ink-2">
                <FiAlertCircle size={15} className="mt-0.5 shrink-0 text-danger" /> {state.error}
              </div>
            )}
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-2"><FiFileText size={17} /></span>
            <h2 className="mt-4 text-lg font-semibold text-ink">Questions for this chapter</h2>
            <p className="mt-1 text-sm text-muted">
              GenQuest drafts open and multiple-choice questions from “{chapter.title}” and keeps the ones its evaluator scores highest. It takes about ten seconds.
            </p>
            <div className="mt-6"><Button variant="primary" className="h-9 px-4" onClick={onGenerate} data-testid="generate">Generate questions</Button></div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ---------- page ----------
export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();
  const [pdf, setPdf] = useState(null);
  const [book, setBook] = useState(null);
  const [reading, setReading] = useState(null);
  const [selected, setSelected] = useState(0);
  const [paragraphs, setParagraphs] = useState([]);
  const [textLoading, setTextLoading] = useState(false);
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState(new Set());
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState(null);
  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => { if (!user) navigate('/'); }, [user, navigate]);

  const loadChapter = useCallback(async (doc, info, i) => {
    const ch = info.chapters[i];
    if (!ch) return;
    setSelected(i);
    setRevealed(new Set());
    setActive(null);
    setTextLoading(true);
    const next = info.chapters.slice(i + 1).find((c) => c.page > ch.page);
    const last = next ? next.page - 1 : Math.min(info.pageCount, ch.page + 2);
    let paras = await readParagraphs(doc, ch.page, Math.max(ch.page, last));
    if (paras.length && norm(paras[0]).toLowerCase().startsWith(ch.title.toLowerCase())) {
      const rest = norm(paras[0]).slice(ch.title.length).trim();
      paras = rest ? [rest, ...paras.slice(1)] : paras.slice(1);
    }
    setParagraphs(paras);
    setTextLoading(false);
  }, []);

  const handleFile = async (file) => {
    setReading(file.name);
    try {
      const data = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data }).promise;
      const meta = await doc.getMetadata().catch(() => ({ info: {} }));
      const chapters = await readOutline(doc);
      const info = {
        fileName: file.name,
        title: norm(meta.info && meta.info.Title) || file.name.replace(/\.pdf$/i, ''),
        author: norm(meta.info && meta.info.Author) || 'Unknown author',
        pageCount: doc.numPages,
        chapters: chapters.length ? chapters : [{ title: 'Full text', page: 1, depth: 0 }],
      };
      setPdf(doc);
      setBook(info);
      setResults({});
      await loadChapter(doc, info, 0);
    } catch (e) {
      setToast({ kind: 'error', message: 'That file could not be read as a PDF.' });
    } finally {
      setReading(null);
    }
  };

  const chapterText = useMemo(() => paragraphs.join(' ').split(/\s+/).slice(0, MAX_WORDS).join(' '), [paragraphs]);

  const generate = async () => {
    const idx = selected;
    const startedAt = Date.now();
    setRevealed(new Set());
    setActive(null);
    setResults((r) => ({ ...r, [idx]: { loading: true, startedAt } }));
    try {
      const response = await axios.post(QG_API, { text: chapterText });
      setResults((r) => ({ ...r, [idx]: { questions: response.data.questions || [], ms: Date.now() - startedAt, runId: startedAt } }));
    } catch (error) {
      setResults((r) => ({ ...r, [idx]: { error: 'The question generator did not respond. Check that the model server is running and try again.' } }));
    }
  };

  const save = async () => {
    const idx = selected;
    const state = results[idx];
    if (!state || !state.questions || !state.questions.length) return;
    setResults((r) => ({ ...r, [idx]: { ...r[idx], saving: true } }));
    try {
      await axios.post(`${AUTH_API}/save`, {
        userId: user.id,
        generatedQuestions: state.questions,
        bookTitle: book.title,
        chapter: book.chapters[idx].title,
      });
      setResults((r) => ({ ...r, [idx]: { ...r[idx], saving: false, saved: true } }));
      setToast({
        message: `${state.questions.length} questions saved from “${book.chapters[idx].title}”`,
        action: { label: 'View saved', onClick: () => navigate('/SavedQuestion') },
      });
    } catch (e) {
      setResults((r) => ({ ...r, [idx]: { ...r[idx], saving: false } }));
      setToast({ kind: 'error', message: 'Could not save questions. Please try again.' });
    }
  };

  const state = results[selected] || null;
  const activeQ = state && state.questions && active != null && revealed.has(active) ? state.questions[active] : null;
  const highlight = activeQ ? correctOption(activeQ) : null;

  return (
    <Shell>
      {!book ? (
        <UploadState onFile={handleFile} reading={reading} />
      ) : (
        <div className="flex h-full">
          <Sidebar book={book} selected={selected} results={results} onSelect={(i) => loadChapter(pdf, book, i)} onReplace={handleFile} />
          <Reader
            book={book}
            index={selected}
            chapter={book.chapters[selected]}
            paragraphs={paragraphs}
            loading={textLoading}
            highlight={highlight}
            onPrev={() => loadChapter(pdf, book, selected - 1)}
            onNext={() => loadChapter(pdf, book, selected + 1)}
          />
          <QuestionsPane
            chapter={book.chapters[selected]}
            state={state}
            onGenerate={generate}
            onSave={save}
            revealed={revealed}
            setRevealed={setRevealed}
            active={active}
            setActive={setActive}
          />
        </div>
      )}
      <Toast toast={toast} onClose={closeToast} />
    </Shell>
  );
}
