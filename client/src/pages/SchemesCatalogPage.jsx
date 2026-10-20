import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schemeService } from '../services/api';
import { Search, Filter, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';

export const SchemesCatalogPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    loadSchemes();
  }, [keyword, selectedCategory, selectedLevel, selectedState]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemes({
        keyword: keyword || undefined,
        category: selectedCategory || undefined,
        governmentLevel: selectedLevel || undefined,
        state: selectedState || undefined,
        size: 50
      });
      if (res.success && res.data) {
        setSchemes(res.data.content || []);
      }
    } catch (err) {
      console.error('Error loading schemes catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Government Schemes Catalog
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Browse verified Central and State government welfare schemes with structured eligibility rules and required document checklists.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Keyword Search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>SEARCH BY NAME OR BENEFIT</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Scholarship, PM-Kisan, Mudra..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>CATEGORY</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                <option value="">All Categories</option>
                <option value="EDUCATION">Education & Scholarships</option>
                <option value="AGRICULTURE">Agriculture & Farmers</option>
                <option value="BUSINESS">Business & MSME</option>
                <option value="EMPLOYMENT">Employment & Skills</option>
                <option value="SOCIAL_SUPPORT">Social Support & Housing</option>
                <option value="HEALTHCARE">Healthcare Assurance</option>
              </select>
            </div>

            {/* Government Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>GOVERNMENT LEVEL</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                <option value="">Central & State (All)</option>
                <option value="CENTRAL">Central Government</option>
                <option value="STATE">State Government</option>
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>STATE / REGION</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}>
                <option value="">All India & States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
            <p>Loading scheme directory...</p>
          </div>
        ) : schemes.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <p>No schemes matched your search criteria. Try clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
            {schemes.map(s => (
              <div key={s.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', fontSize: '0.7rem' }}>
                      {s.governmentLevel} • {s.state || 'All India'}
                    </span>
                    <span 
                      className={`badge ${s.verificationStatus === 'VERIFIED' ? 'badge-verified' : ''}`}
                      style={{ 
                        fontSize: '0.7rem',
                        background: s.verificationStatus === 'VERIFIED' ? '#f0fdf4' : '#f8fafc',
                        color: s.verificationStatus === 'VERIFIED' ? '#166534' : '#475569',
                        border: `1px solid ${s.verificationStatus === 'VERIFIED' ? '#bbf7d0' : '#e2e8f0'}`
                      }}
                    >
                      {s.verificationStatus === 'VERIFIED' 
                        ? '✓ Verified Source' 
                        : (s.dataStatus === 'LIVE' ? '● Live Official Data' : 'Official Record')}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {s.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {s.description}
                  </p>
                </div>

                <div>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.825rem' }}>
                    <strong style={{ color: '#0f172a' }}>Benefit:</strong>{' '}
                    <span style={{ color: '#15803d', fontWeight: 600 }}>{s.benefit}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to={`/schemes/${s.id}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Check Eligibility & Documents <ArrowRight size={13} />
                    </Link>

                    {s.sourceUrl && (
                      <a href={s.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                        Official Portal <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
