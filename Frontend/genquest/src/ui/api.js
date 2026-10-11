export const AUTH_API = process.env.REACT_APP_AUTH_API || 'http://localhost:3001/auth';
export const QG_API = process.env.REACT_APP_QG_API || 'http://127.0.0.1:5000/generate_questions';

export function getUser() {
  const id = localStorage.getItem('id');
  if (!id) return null;
  return { id, name: localStorage.getItem('name') || '', email: localStorage.getItem('email') || '' };
}

export function signOut() {
  ['id', 'name', 'email'].forEach((k) => localStorage.removeItem(k));
  fetch(`${AUTH_API}/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
}

export const isMultipleChoice = (q) => Array.isArray(q.answer);
export const correctOption = (q) => (Array.isArray(q.answer) ? (q.answer.find((o) => o.correct) || {}).answer : q.answer);

// The T5 generator sometimes returns lower-case questions; tidy them for display only.
export const tidyQuestion = (s) => { const t = (s || '').trim(); return t.charAt(0).toUpperCase() + t.slice(1); };
