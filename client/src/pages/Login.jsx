import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../api.js';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, role } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      nav(role === 'admin' ? '/admin' : '/company');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <div className="card" style={{ width: 380, padding: 20 }}>
        <div className="stack">
          <div>
            <div className="section-title">Sign in</div>
            <div className="muted">Use your admin or company credentials</div>
          </div>
          <form onSubmit={submit} className="stack">
            <div className="stack">
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="stack">
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          {error && <div style={{ color: '#ff6b6b', fontSize: 13 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
