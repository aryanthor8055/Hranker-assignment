'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API, getStored, clearStored } from '@/lib/auth';

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { token } = getStored();

  useEffect(() => {
    if (typeof window === 'undefined' || !token) {
      router.replace('/login');
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          clearStored();
          router.replace('/login');
          return;
        }
        const data = await res.json();
        if (data.role !== 'admin') {
          clearStored();
          router.replace('/login');
          return;
        }
        setUser(data);
      } catch {
        clearStored();
        router.replace('/login');
      }
    };
    fetchMe();
  }, [token, router]);

  const handleLogout = () => {
    clearStored();
    router.replace('/login');
  };

  if (!user) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="card">
        <span className="badge admin">admin</span>
        <h1>Admin Dashboard</h1>
        <p className="meta">Logged in as {user.email}</p>
        <p>This is the admin area. Admin users are created directly in the database, not through the registration page.</p>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
