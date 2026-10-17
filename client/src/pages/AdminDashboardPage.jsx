import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService, updateService } from '../services/api';
import {
  Shield,
  FileText,
  BookOpen,
  Users,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Award,
  Globe,
  Database,
  Loader,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [guides, setGuides] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState('GUIDES'); // GUIDES, SCHEMES, USERS
  const [loading, setLoading] = useState(true);
  const [fetchingGov, setFetchingGov] = useState(false);
  const [govFetchResult, setGovFetchResult] = useState(null);


  // New Guide Form State
  const [showAddGuideModal, setShowAddGuideModal] = useState(false);
  const [guideForm, setGuideForm] = useState({
    documentType: '',
    title: '',
    simpleDescription: '',
    applicableState: 'Maharashtra',
    issuingAuthority: 'Tehsildar Office',
    requiredSupportingDocuments: 'Aadhaar Card\nRation Card\nProof of Income',
    applicationMethod: 'BOTH',
    officialApplicationUrl: 'https://aaplesarkar.mahaonline.gov.in',
    officialInformationUrl: 'https://rts.maharashtra.gov.in',
    possibleFees: '₹33.60',
    expectedProcessingTime: '15 working days',
    additionalNotes: 'Check validity before submitting application'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      alert('Access Restricted to JanSahay Administrators');
      navigate('/');
      return;
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.data);

      const guidesRes = await adminService.getDocumentGuides();
      if (guidesRes.success) setGuides(guidesRes.data);

      const schemesRes = await adminService.getSchemes();
      if (schemesRes.success) setSchemes(schemesRes.data);
    } catch (err) {
      console.error('Error loading admin console:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyGuide = async (id, status) => {
    try {
      await adminService.verifyDocumentGuide(id, status);
      loadAdminData();
    } catch (e) {
      alert('Error updating verification status');
    }
  };

  const handleDeleteGuide = async (id) => {
    if (window.confirm('Delete this document acquisition guide from the official knowledge base?')) {
      try {
        await adminService.deleteDocumentGuide(id);
        loadAdminData();
      } catch (e) {
        alert('Error deleting guide');
      }
    }
  };

  const handleCreateGuide = async (e) => {
    e.preventDefault();
    try {
      await adminService.createDocumentGuide({
        ...guideForm,
        requiredSupportingDocuments: guideForm.requiredSupportingDocuments.split('\n').filter(s => s.trim().length > 0),
        applicationSteps: [
          { stepNumber: 1, title: 'Portal Registration', detail: 'Register on official citizen portal', method: 'ONLINE' },
          { stepNumber: 2, title: 'Document Upload & Scrutiny', detail: 'Upload scanned proofs and pay government fee', method: 'ONLINE' },
          { stepNumber: 3, title: 'Certificate Issuance', detail: 'Download digitally signed certificate upon Tehsildar approval', method: 'ONLINE' }
        ]
      });
      setShowAddGuideModal(false);
      loadAdminData();
    } catch (err) {
      alert('Error adding document guide');
    }
  };

  const handleFetchGovernmentData = async () => {
    setFetchingGov(true);
    setGovFetchResult(null);
    try {
      const res = await updateService.fetchGovSchemes();
      setGovFetchResult({ success: true, message: res.message, data: res.data });
      // Reload schemes list
      const schemesRes = await adminService.getSchemes();
      if (schemesRes.success) setSchemes(schemesRes.data);
      const statsRes = await adminService.getDashboardStats();
      if (statsRes.success) setStats(statsRes.data);
    } catch (e) {
      setGovFetchResult({ success: false, message: e?.message || 'Government servers temporarily unavailable. All cached data is intact.' });
    } finally {
      setFetchingGov(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f5f3ff', color: '#7c3aed', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Shield size={14} /> Administrator Control Center
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Document Knowledge Base & Scheme Admin
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Maintain verified scheme rules, state document acquisition guides, official links, and verification badges.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleFetchGovernmentData}
              disabled={fetchingGov}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#15803d', color: '#15803d' }}>
              {fetchingGov ? <Loader size={15} className="animate-spin" /> : <Globe size={15} />}
              {fetchingGov ? 'Fetching...' : '🌐 Fetch Live Govt Data'}
            </button>
            <button
              onClick={() => setShowAddGuideModal(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={16} /> Add New Document Guide
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-4" style={{ gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>TOTAL ACTIVE SCHEMES</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.25rem' }}>
                {stats.activeSchemesCount} / {stats.totalSchemes}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>DOCUMENT GUIDES</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.25rem' }}>
                {stats.totalDocumentGuides}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>VERIFIED OFFICIAL GUIDES</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginTop: '0.25rem' }}>
                {stats.verifiedGuidesCount}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>REGISTERED USERS</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ea580c', marginTop: '0.25rem' }}>
                {stats.totalUsers}
              </div>
            </div>
          </div>
        )}

        {/* Gov Fetch Result Banner */}
        {govFetchResult && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.25rem',
            borderRadius: '0.75rem', marginBottom: '1.5rem',
            background: govFetchResult.success ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${govFetchResult.success ? '#bbf7d0' : '#fcd34d'}`
          }}>
            <Globe size={20} color={govFetchResult.success ? '#15803d' : '#b45309'} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: govFetchResult.success ? '#15803d' : '#b45309', marginBottom: '0.25rem' }}>
                {govFetchResult.success ? '✅ Live Government Data Sync Complete' : '⚠️ Partial Sync — Using Cached Data'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569' }}>{govFetchResult.message}</div>
              {govFetchResult.data && (
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Added: <strong>{govFetchResult.data.totalInserted}</strong> new schemes &nbsp;|&nbsp;
                  Updated: <strong>{govFetchResult.data.totalUpdated}</strong> &nbsp;|&nbsp;
                  Total in DB: <strong>{govFetchResult.data.totalSchemesInDB}</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('GUIDES')}
            className={`btn btn-sm ${activeTab === 'GUIDES' ? 'btn-primary' : 'btn-outline'}`}>
            <FileText size={15} /> Document Guides Knowledge Base ({guides.length})
          </button>
          <button
            onClick={() => setActiveTab('SCHEMES')}
            className={`btn btn-sm ${activeTab === 'SCHEMES' ? 'btn-primary' : 'btn-outline'}`}>
            <BookOpen size={15} /> Government Schemes ({schemes.length})
          </button>
        </div>

        {/* TAB 1: DOCUMENT GUIDES MANAGEMENT */}
        {activeTab === 'GUIDES' && (
          <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem' }}>DOCUMENT TYPE</th>
                  <th style={{ padding: '0.75rem' }}>TITLE & ISSUING AUTHORITY</th>
                  <th style={{ padding: '0.75rem' }}>STATE</th>
                  <th style={{ padding: '0.75rem' }}>VERIFICATION STATUS</th>
                  <th style={{ padding: '0.75rem' }}>REFERENCING SCHEMES</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {guides.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#1e3a8a' }}>
                      {g.documentType}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{g.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.issuingAuthority}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>
                        {g.applicableState || 'All India'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${
                        g.verificationStatus === 'VERIFIED' ? 'badge-verified' :
                        g.verificationStatus === 'OUTDATED' ? 'badge-outdated' : 'badge-unverified'
                      }`}>
                        {g.verificationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        {g.referencingSchemesCount || 0} scheme(s)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        {g.verificationStatus !== 'VERIFIED' ? (
                          <button
                            onClick={() => handleVerifyGuide(g.id, 'VERIFIED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#15803d', borderColor: '#bbf7d0' }}
                            title="Mark as Verified">
                            Verify
                          </button>
                        ) : (
                          <button
                            onClick={() => handleVerifyGuide(g.id, 'OUTDATED')}
                            className="btn btn-outline btn-sm"
                            style={{ color: '#b91c1c', borderColor: '#fecaca' }}
                            title="Mark as Outdated">
                            Mark Outdated
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteGuide(g.id)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#ef4444' }}
                          title="Delete Guide">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: SCHEMES MANAGEMENT */}
        {activeTab === 'SCHEMES' && (
          <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem' }}>SCHEME NAME</th>
                  <th style={{ padding: '0.75rem' }}>LEVEL & STATE</th>
                  <th style={{ padding: '0.75rem' }}>CATEGORY</th>
                  <th style={{ padding: '0.75rem' }}>RULES COUNT</th>
                  <th style={{ padding: '0.75rem' }}>REQUIRED DOCS</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {schemes.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge" style={{ background: '#eff6ff', color: '#1e40af' }}>
                        {s.governmentLevel} • {s.state || 'All India'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {s.category}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {s.rules?.length || 0} rule(s)
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {s.requiredDocuments?.length || 0} doc(s)
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <a href={s.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        Source <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Document Guide Modal */}
      {showAddGuideModal && (
        <div className="modal-overlay" onClick={() => setShowAddGuideModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '1.25rem' }}>
              Add Smart Document Acquisition Guide
            </h2>

            <form onSubmit={handleCreateGuide} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  DOCUMENT TYPE CODE (e.g. INCOME_CERTIFICATE, DOMICILE_CERTIFICATE)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NON_CREAMY_LAYER"
                  value={guideForm.documentType}
                  onChange={e => setGuideForm({ ...guideForm, documentType: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  OFFICIAL TITLE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-Creamy Layer Certificate (नॉन-क्रिमीलेअर दाखला)"
                  value={guideForm.title}
                  onChange={e => setGuideForm({ ...guideForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  SIMPLE-LANGUAGE DESCRIPTION (What is this document?)
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Clear description in simple English..."
                  value={guideForm.simpleDescription}
                  onChange={e => setGuideForm({ ...guideForm, simpleDescription: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    APPLICABLE STATE
                  </label>
                  <input
                    type="text"
                    value={guideForm.applicableState}
                    onChange={e => setGuideForm({ ...guideForm, applicableState: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    ISSUING AUTHORITY
                  </label>
                  <input
                    type="text"
                    value={guideForm.issuingAuthority}
                    onChange={e => setGuideForm({ ...guideForm, issuingAuthority: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  SUPPORTING DOCUMENTS CHECKLIST (One per line)
                </label>
                <textarea
                  rows="3"
                  value={guideForm.requiredSupportingDocuments}
                  onChange={e => setGuideForm({ ...guideForm, requiredSupportingDocuments: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    OFFICIAL APPLICATION URL
                  </label>
                  <input
                    type="text"
                    value={guideForm.officialApplicationUrl}
                    onChange={e => setGuideForm({ ...guideForm, officialApplicationUrl: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    EXPECTED PROCESSING TIME
                  </label>
                  <input
                    type="text"
                    value={guideForm.expectedProcessingTime}
                    onChange={e => setGuideForm({ ...guideForm, expectedProcessingTime: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddGuideModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
