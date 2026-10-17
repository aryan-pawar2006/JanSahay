import React, { useState } from 'react';
import { X, CheckCircle, ExternalLink, AlertTriangle, Clock, Building, FileText, DollarSign, Check } from 'lucide-react';
import { documentService } from '../services/api';

export const DocumentGuideModal = ({ guide, onClose, onStatusUpdated }) => {
  const [markingAvailable, setMarkingAvailable] = useState(false);
  const [markedSuccess, setMarkedSuccess] = useState(false);

  if (!guide) return null;

  const handleMarkAvailable = async () => {
    setMarkingAvailable(true);
    try {
      await documentService.updateStatus({
        documentName: guide.title,
        documentType: guide.documentType,
        status: 'AVAILABLE',
        notes: `Marked available from guidance card on ${new Date().toLocaleDateString('en-IN')}`
      });
      setMarkedSuccess(true);
      if (onStatusUpdated) onStatusUpdated(guide.documentType, 'AVAILABLE');
    } catch (err) {
      alert('Could not update document status. Please make sure you are logged in.');
    } finally {
      setMarkingAvailable(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className={`badge ${
                guide.verificationStatus === 'VERIFIED' ? 'badge-verified' :
                guide.verificationStatus === 'OUTDATED' ? 'badge-outdated' : 'badge-unverified'
              }`}>
                {guide.verificationStatus === 'VERIFIED' ? '✓ Verified Official Guide' :
                 guide.verificationStatus === 'OUTDATED' ? '⚠ Outdated Instructions' : '⏳ Verification Pending'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                State: <strong>{guide.applicableState || 'All India'}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a' }}>
              {guide.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '9999px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Outdated Warning */}
          {guide.verificationStatus === 'OUTDATED' && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#991b1b', fontSize: '0.85rem' }}>
              <AlertTriangle size={18} />
              <span>Warning: This document procedure has not been verified recently. Procedures and portals may have changed. Verify with official portal below.</span>
            </div>
          )}

          {/* 1. What is this document & Simple Description */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={16} color="#3b82f6" /> 1. What is this document?
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, background: '#f8fafc', padding: '0.875rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              {guide.simpleDescription}
            </p>
          </div>

          {/* 2. Key Metadata Badges: Authority, Fees, Timeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Building size={14} color="#0f766e" /> ISSUING AUTHORITY
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {guide.issuingAuthority || 'Competent Revenue Officer'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <DollarSign size={14} color="#ea580c" /> STATUTORY FEES
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {guide.possibleFees || 'As per State RTS rules'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.875rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Clock size={14} color="#7c3aed" /> PROCESSING TIME
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {guide.expectedProcessingTime || '15 to 21 working days'}
              </div>
            </div>
          </div>

          {/* 3. Supporting Documents Required */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              2. Supporting Documents You Must Keep Ready:
            </h4>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '0.875rem' }}>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: '#166534', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {guide.requiredSupportingDocuments && guide.requiredSupportingDocuments.map((doc, idx) => (
                  <li key={idx} style={{ lineHeight: 1.5 }}>
                    <strong>{doc}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Step-by-Step Application Instructions */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              3. Step-by-Step Application Process:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {guide.applicationSteps && guide.applicationSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.875rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '9999px', background: '#1e3a8a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                    {step.stepNumber || idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        {step.title}
                      </h5>
                      {step.method && (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: step.method === 'ONLINE' ? '#eff6ff' : '#fef3c7', color: step.method === 'ONLINE' ? '#1d4ed8' : '#b45309', fontWeight: 600 }}>
                          {step.method}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                      {step.detail || step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Additional Notes & Official Links */}
          {guide.additionalNotes && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.875rem', borderRadius: '0.5rem', fontSize: '0.825rem', color: '#92400e' }}>
              <strong>Important Guidance:</strong> {guide.additionalNotes}
            </div>
          )}

          {/* Official Link */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>OFFICIAL APPLICATION PORTAL</div>
              <a
                href={guide.officialApplicationUrl || '#'}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-all' }}>
                {guide.officialApplicationUrl || 'Portal link available at Tahsil Office'} <ExternalLink size={14} />
              </a>
            </div>
            {guide.officialInformationUrl && (
              <a
                href={guide.officialInformationUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm">
                Gazette / Rules <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} className="btn btn-outline">
            Close Guide
          </button>

          <button
            onClick={handleMarkAvailable}
            disabled={markingAvailable || markedSuccess}
            className="btn btn-primary"
            style={{ backgroundColor: markedSuccess ? '#15803d' : '#1e3a8a' }}>
            {markedSuccess ? (
              <>
                <Check size={16} /> Marked in My Documents!
              </>
            ) : markingAvailable ? (
              'Saving...'
            ) : (
              <>
                <CheckCircle size={16} /> I Already Have This Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
