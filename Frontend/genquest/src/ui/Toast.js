import React, { useEffect } from 'react';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onClose, toast.duration || 4200);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  const isError = toast.kind === 'error';
  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center pointer-events-none">
      <div role="status" className="pointer-events-auto animate-rise flex items-center gap-3 rounded-lg bg-ink pl-3 pr-2 py-2 text-sm text-white">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${isError ? 'bg-danger' : 'bg-accent text-ink'}`}>
          {isError ? <FiAlertCircle size={12} /> : <FiCheck size={12} strokeWidth={3} />}
        </span>
        <span className="pr-1">{toast.message}</span>
        {toast.action && (
          <button onClick={toast.action.onClick} className="rounded-sm px-2 py-1 font-medium text-accent hover:bg-white/10">
            {toast.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
