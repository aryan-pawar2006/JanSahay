import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Shield, User, Lock, ArrowRight, Award } from 'lucide-react';

export const LoginPage = () => {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        login(res.data.user, res.data.token);
        navigate(res.data.user.role === 'ADMIN' ? '/admin' : '/recommendations');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      await quickLogin(role);
      navigate(role === 'admin' ? '/admin' : '/recommendations');
    } catch (e) {
      setError('Quick login failed');
    }
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '85vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.25rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1rem', border: '2px solid #f97316' }}>
              ज
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Sign in to JanSahay AI
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Access your personalized citizen profile and document roadmap
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* 1-Click Demo Profiles for Evaluator */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textAlign: 'center', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <Award size={14} color="#ea580c" /> 1-CLICK TEST CREDENTIALS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="btn btn-outline btn-sm"
                style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af', fontSize: '0.75rem' }}>
                👨‍🎓 Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer')}
                className="btn btn-outline btn-sm"
                style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', fontSize: '0.75rem' }}>
                🌾 Farmer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('business')}
                className="btn btn-outline btn-sm"
                style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92400e', fontSize: '0.75rem' }}>
                💼 Business Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="btn btn-outline btn-sm"
                style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9', fontSize: '0.75rem' }}>
                🛡️ Admin Console
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1e3a8a', fontWeight: 700, textDecoration: 'none' }}>
              Create Citizen Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
