import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemeService, documentService, documentGuideService } from '../services/api';
import { DocumentGuideModal } from '../components/DocumentGuideModal';
import { AIChatDrawer } from '../components/AIChatDrawer';
import {
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  FileText,
  Building,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Sparkles,
  Printer
} from 'lucide-react';

export const SchemeDetailPage = () => {
  const { id } = useParams();

  const [scheme, setScheme] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGuide, setActiveGuide] = useState(null);

  useEffect(() => {
    loadSchemeDetails();
  }, [id]);

  const loadSchemeDetails = async () => {
    setLoading(true);
    try {
      const schemeRes = await schemeService.getSchemeById(id);
      if (schemeRes.success) {
        setScheme(schemeRes.data);
      }

      // Load readiness if user is logged in
      try {
        const readRes = await schemeService.getSchemeDocumentReadiness(id);
        if (readRes.success) {
          setReadiness(readRes.data);
        }
      } catch (e) {
        // Not logged in or no profile yet
      }
    } catch (err) {
      console.error('Error loading scheme:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (docName, docType, newStatus) => {
    try {
      await documentService.updateStatus({
        documentName: docName,
        documentType: docType,
        status: newStatus
      });
      // Refresh readiness
      const readRes = await schemeService.getSchemeDocumentReadiness(id);
      if (readRes.success) {
        setReadiness(readRes.data);
      }
    } catch (err) {
      alert('Could not update status. Please make sure you are logged in.');
    }
  };

  const openGuideForDocument = async (docType) => {
    try {
      const res = await documentGuideService.getGuideByType(docType, scheme?.state || 'Maharashtra');
      if (res.success && res.data) {
        setActiveGuide(res.data);
      } else {
        alert('Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link.');
      }
    } catch (e) {
      alert('Detailed instructions have not yet been verified for this specific certificate. Please check the official portal.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: '#64748b' }}>
        <p>Loading scheme requirements and document readiness...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Scheme record not found</h2>
        <Link to="/schemes" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', backgroundColor: '#f8fafc', minHeight: '90vh' }}>
      <div className="container">
        {/* Printable Official Header (Visible ONLY when printing) */}
        <div className="print-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#1e3a8a', margin: 0, fontWeight: 800 }}>
                🇮🇳 JanSahay AI — Official Scheme Eligibility & Application Roadmap
              </h1>
              <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: '0.9rem' }}>
                Scheme: <strong>{scheme.name}</strong> • Level: <strong>{scheme.governmentLevel}</strong> • State: <strong>{scheme.state || 'All India'}</strong>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Printed On: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: scheme.verificationStatus === 'VERIFIED' ? '#15803d' : '#475569' }}>
                Status: {scheme.verificationStatus === 'VERIFIED' ? 'Verified Official Record' : (scheme.verificationStatus || 'Official Portal Record')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/schemes" style={{ color: '#1e3a8a', textDecoration: 'none' }}>Schemes</Link>
            <span>/</span>
            <span>{scheme.name}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
            <Printer size={14} /> Print / Save PDF Roadmap
          </button>
        </div>

        {/* Scheme Header Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid #1e3a8a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                  {scheme.governmentLevel} GOVERNMENT
                </span>
                <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                  State: {scheme.state || 'All India'}
                </span>
                <span className="badge" style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  Category: {scheme.category}
                </span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                {scheme.name}
              </h1>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '850px' }}>
                {scheme.description}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline btn-sm no-print"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
                  <Printer size={14} /> Print Roadmap
                </button>
                <a
                  href={scheme.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Official Source <ExternalLink size={14} />
                </a>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                {scheme.lastVerified ? `Verified on: ${scheme.lastVerified}` : (scheme.dataStatus === 'LIVE' ? 'Live Official Feed' : 'Official Portal Record')}
              </div>
            </div>
          </div>

          {/* Benefit Banner */}
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.5rem', padding: '1rem', marginTop: '1.25rem' }}>
            <strong style={{ color: '#065f46', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              DIRECT BENEFIT DELIVERED:
            </strong>
            <p style={{ color: '#047857', fontWeight: 700, fontSize: '1.1rem', margin: '0.25rem 0 0 0' }}>
              {scheme.benefit}
            </p>
          </div>
        </div>

        {/* 3-SECTION INTEGRATED EXPERIENCE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* SECTION A: SCHEME ELIGIBILITY */}
          <section className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ background: '#1e3a8a', color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                A
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                Section A: Scheme Eligibility Criteria
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {scheme.targetBeneficiaries && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>TARGET BENEFICIARIES</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{scheme.targetBeneficiaries}</div>
                </div>
              )}
              {scheme.incomeCondition && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>INCOME CONDITIONS</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{scheme.incomeCondition}</div>
                </div>
              )}
              {scheme.educationCondition && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '0.25rem' }}>EDUCATION PREREQUISITES</div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{scheme.educationCondition}</div>
                </div>
              )}
            </div>

            {/* Rules Table */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Structured Rule Verification:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {scheme.rules && scheme.rules.map((rule, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={16} color="#15803d" />
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{rule.description || `${rule.field} ${rule.operator} ${rule.value}`}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Required Rule
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION B: REQUIRED DOCUMENTS & CHECKLIST */}
          <section className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#f97316', color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                  B
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                    Section B: Required Documents Checklist
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Track your document availability status and preparation progress.
                  </p>
                </div>
              </div>

              {readiness && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '120px' }}>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${readiness.readinessPercentage}%` }}></div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: readiness.readinessPercentage === 100 ? '#15803d' : '#ea580c' }}>
                    {readiness.readinessPercentage}% Ready
                  </span>
                </div>
              )}
            </div>

            {/* Checklist Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {readiness?.documents ? (
                readiness.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                          {doc.documentName}
                        </span>
                        {doc.requiredFlag && (
                          <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#991b1b', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            Mandatory
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Issuing Authority: <strong>{doc.issuingAuthority}</strong> • Purpose: {doc.purpose}
                      </div>
                    </div>

                    {/* Status Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <select
                        value={doc.status}
                        onChange={(e) => handleStatusChange(doc.documentName, doc.documentType, e.target.value)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          backgroundColor:
                            doc.status === 'AVAILABLE' ? '#f0fdf4' :
                            doc.status === 'MISSING' ? '#fef2f2' :
                            doc.status === 'NEEDS_VERIFICATION' ? '#fffbeb' : '#f8fafc',
                          color:
                            doc.status === 'AVAILABLE' ? '#15803d' :
                            doc.status === 'MISSING' ? '#b91c1c' :
                            doc.status === 'NEEDS_VERIFICATION' ? '#b45309' : '#475569'
                        }}>
                        <option value="NOT_YET_CHECKED">❓ Unknown / Not Checked</option>
                        <option value="AVAILABLE">✓ Already Available</option>
                        <option value="MISSING">✗ Missing / Unavailable</option>
                        <option value="NEEDS_VERIFICATION">⚠ Needs Verification</option>
                      </select>

                      {/* "How to Get This Document" button */}
                      {doc.hasGuide && (
                        <button
                          onClick={() => openGuideForDocument(doc.documentType)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: '#fed7aa', color: '#ea580c', background: '#fff7ed', fontWeight: 700 }}>
                          How to Get This Document <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                scheme.requiredDocuments?.map((doc, idx) => (
                  <div key={idx} style={{ padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{doc.documentName}</strong> ({doc.purpose})
                    </div>
                    {doc.documentType && (
                      <button
                        onClick={() => openGuideForDocument(doc.documentType)}
                        className="btn btn-outline btn-sm">
                        How to Get This Document
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION C: HOW TO OBTAIN MISSING DOCUMENTS */}
          <section className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ background: '#15803d', color: 'white', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                C
              </div>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  Section C: How to Obtain Missing Documents
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  Verified state acquisition procedures, issuing offices, and step-by-step submission routes.
                </p>
              </div>
            </div>

            {/* Guidance Cards for Missing/Required Docs */}
            <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
              {(scheme.requiredDocuments || []).map((reqDoc, idx) => (
                <div key={idx} className="card" style={{ padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                        ✓ State Procedure
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Authority: {reqDoc.issuingAuthority || 'Tehsildar / SDO'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {reqDoc.documentName}
                    </h4>

                    <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Mandatory certificate required to verify your eligibility for <em>{scheme.name}</em>.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => openGuideForDocument(reqDoc.documentType || 'INCOME_CERTIFICATE')}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', justifyContent: 'center', gap: '0.35rem' }}>
                      <BookOpen size={14} /> Open Complete Step-by-Step Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* APPLICATION TIMELINE & OFFICIAL STEPS */}
          {scheme.applicationGuides && scheme.applicationGuides.length > 0 && (
            <section className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                Official Scheme Application Roadmap
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scheme.applicationGuides.map((guide, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9999px', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                      {guide.stepNumber}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                        {guide.title}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                        {guide.instruction}
                      </p>
                      {guide.sourceUrl && (
                        <a href={guide.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#1e3a8a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
                          Official Portal Link <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Document Acquisition Guide Modal */}
      {activeGuide && (
        <DocumentGuideModal
          guide={activeGuide}
          onClose={() => setActiveGuide(null)}
          onStatusUpdated={() => loadSchemeDetails()}
        />
      )}

      {/* Floating AI Assistant */}
      <AIChatDrawer currentScheme={scheme} />
    </div>
  );
};
