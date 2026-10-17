import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Sparkles, BookOpen, CheckCircle, FileText, Bell, User, LogOut, ArrowRight, Globe } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleDemoClick = async (role) => {
    try {
      await quickLogin(role);
      navigate(role === 'admin' ? '/admin' : '/recommendations');
    } catch (e) {
      alert('Quick login failed');
    }
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Gov Banner */}
      <div style={{ backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '0.75rem', padding: '0.25rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              🇮🇳 Government Citizen Assistance Initiative • Digital India
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Language Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Globe size={13} />
              <button
                onClick={() => setLanguage('en')}
                style={{ background: 'none', border: 'none', color: language === 'en' ? '#f97316' : '#94a3b8', cursor: 'pointer', fontWeight: language === 'en' ? 700 : 400, fontSize: '0.75rem' }}>
                English
              </button>
              <span>|</span>
              <button
                onClick={() => setLanguage('mr')}
                style={{ background: 'none', border: 'none', color: language === 'mr' ? '#f97316' : '#94a3b8', cursor: 'pointer', fontWeight: language === 'mr' ? 700 : 400, fontSize: '0.75rem' }}>
                मराठी
              </button>
              <span>|</span>
              <button
                onClick={() => setLanguage('hi')}
                style={{ background: 'none', border: 'none', color: language === 'hi' ? '#f97316' : '#94a3b8', cursor: 'pointer', fontWeight: language === 'hi' ? 700 : 400, fontSize: '0.75rem' }}>
                हिन्दी
              </button>
            </div>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>● Live Portals Connected</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg, #1e3a8a 0%, #0f2459 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.25rem', border: '2px solid #f97316' }}>
            ज
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.02em' }}>
                {t('appTitle')}
              </span>
              <span style={{ background: '#f97316', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                2.0
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
              {t('tagline')}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            {t('home')}
          </Link>
          <Link to="/schemes" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <BookOpen size={16} color="#3b82f6" /> {t('schemes')}
          </Link>
          <Link to="/recommendations" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={16} color="#f97316" /> {t('recommendations')}
          </Link>
          <Link to="/document-preparation" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckCircle size={16} color="#10b981" /> {t('preparation')}
          </Link>
          <Link to="/document-guides" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileText size={16} color="#6366f1" /> {t('documentGuides')}
          </Link>
          <Link to="/updates" style={{ color: '#334155', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Bell size={16} color="#e11d48" /> {t('updates')}
          </Link>
          {isAdmin && (
            <Link to="/admin" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f5f3ff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              <Shield size={16} /> {t('admin')}
            </Link>
          )}
        </nav>

        {/* User / Demo Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#1e293b', background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                <User size={14} color="#1e3a8a" />
                <span>{user?.name?.split(' ')[0]}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({user?.role})</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                title="Log out"
                style={{ padding: '0.4rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Quick Demo Dropdown */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => handleDemoClick('student')}
                  className="btn btn-sm btn-outline"
                  title="Test as Maharashtra Student (Pune)"
                  style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af', fontWeight: 600 }}>
                  👨‍🎓 Student Demo
                </button>
                <button
                  onClick={() => handleDemoClick('farmer')}
                  className="btn btn-sm btn-outline"
                  title="Test as Maharashtra Farmer (Satara)"
                  style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', fontWeight: 600 }}>
                  🌾 Farmer Demo
                </button>
              </div>
              <Link to="/login" className="btn btn-primary btn-sm">
                {t('login')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
