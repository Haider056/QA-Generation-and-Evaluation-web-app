import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout, { Field, PrimaryButton } from '../ui/AuthLayout';
import { AUTH_API } from '../ui/api';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirmPassword) return setError("Passwords don't match.");
    setBusy(true);
    try {
      const response = await fetch(`${AUTH_API}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      navigate('/', { state: { signedUp: true } });
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Could not reach the server. Please try again.' : err.message || 'Sign up failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-[-0.015em] text-ink">Create your account</h1>
      <p className="mt-1 text-base text-muted">Turn any chapter into a set of study questions.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Full name" name="name" autoComplete="name" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} required />
        <Field label="Email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" name="password" autoComplete="new-password" hint="At least 8 characters." value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Field label="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="pt-2">
          <PrimaryButton type="submit" busy={busy}>{busy ? 'Creating account…' : 'Create account'}</PrimaryButton>
        </div>
      </form>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/" className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
