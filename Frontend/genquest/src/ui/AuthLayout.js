import React from 'react';
import Brand from './Brand';

export function Field({ label, hint, right, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-ink-2">
        {label}
        {right}
      </span>
      <input
        {...props}
        className="h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-base text-ink placeholder:text-faint outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-ink/10"
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({ children, busy, ...props }) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className="flex h-10 w-full items-center justify-center rounded-md bg-ink text-base font-medium text-white transition-colors hover:bg-ink-2 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

// Right-hand panel: a still of what the product does, built from the real demo book.
function Preview() {
  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-4 text-xs font-medium uppercase tracking-[0.08em] text-muted">How it works</div>
      <div className="rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-5 py-3 text-xs text-muted">
          Journey to the Moon <span className="px-1 text-faint">/</span> Apollo 8: Around the Moon
        </div>
        <p className="px-5 py-4 font-serif text-[15px] leading-[26px] text-ink-2">
          The crew entered lunar orbit on December 24 and circled the Moon ten times.{' '}
          <mark className="marker">During one orbit, Bill Anders took the photograph known as Earthrise</mark>, which shows the
          Earth rising above the lunar horizon.
        </p>
      </div>
      <div className="ml-8 h-6 w-px bg-line-strong" />
      <div className="rounded-lg border border-line bg-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-faint tabnum">Q1</span>
          <span className="rounded-sm border border-line px-1.5 text-2xs font-medium leading-5 text-muted">Multiple choice</span>
        </div>
        <div className="text-md font-medium text-ink">Who took the photograph known as Earthrise?</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {['Frank Borman', 'Bill Anders', 'Jim Lovell', 'Michael Collins'].map((o) => (
            <span key={o} className={`rounded-sm border px-2.5 py-1.5 ${o === 'Bill Anders' ? 'border-accent bg-accent-soft font-medium text-ink' : 'border-line text-muted'}`}>{o}</span>
          ))}
        </div>
      </div>
      <p className="mt-6 max-w-[400px] text-sm text-muted">
        Upload a book, pick a chapter, and GenQuest drafts open and multiple-choice questions with a T5 generator, then ranks them with a BERT answer evaluator.
      </p>
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-full grid-cols-1 bg-canvas lg:grid-cols-[minmax(480px,1fr)_1fr]">
      <div className="flex flex-col bg-surface px-8 py-6 lg:border-r lg:border-line">
        <Brand to="/" />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>
        <div className="text-xs text-faint">GenQuest · Question generation for focused study</div>
      </div>
      <div className="hidden items-center justify-center px-12 lg:flex">
        <Preview />
      </div>
    </div>
  );
}
