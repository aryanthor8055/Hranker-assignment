'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API, setStored, getStored } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const { token, role } = getStored();
    if (token && role === 'admin') {
      router.replace('/admin');
      return;
    }
    if (token && role === 'user') {
      router.replace('/dashboard');
    }
  }, [mounted, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      setStored({ token: data.token, role: data.role });
      if (data.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Sign in to continue. You'll be redirected to your dashboard based on your role.
        </p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="link-line">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
