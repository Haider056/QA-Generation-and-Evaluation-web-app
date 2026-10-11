import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout, { Field, PrimaryButton } from '../ui/AuthLayout';
import { AUTH_API } from '../ui/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const justSignedUp = location.state && location.state.signedUp;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid email or password');
      localStorage.setItem('id', data.id.id);
      localStorage.setItem('name', data.name || '');
      localStorage.setItem('email', data.email || email);
      navigate('/Home');
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Could not reach the server. Please try again.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-[-0.015em] text-ink">Sign in to GenQuest</h1>
      <p className="mt-1 text-base text-muted">Pick up where you left off with your books and saved questions.</p>
      {justSignedUp && (
        <div className="mt-6 rounded-md border border-line bg-sunken px-3 py-2 text-sm text-ink-2">Account created. Sign in to continue.</div>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          right={
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-xs font-normal text-muted hover:text-ink">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="pt-2">
          <PrimaryButton type="submit" busy={busy}>{busy ? 'Signing in…' : 'Sign in'}</PrimaryButton>
        </div>
      </form>
      <p className="mt-6 text-sm text-muted">
        New to GenQuest?{' '}
        <Link to="/Signup" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
