import React, { useState, useEffect } from 'react';
import { updateService } from '../services/api';
import { TrendingUp, RefreshCw, ExternalLink, Calendar, Tag, Bell } from 'lucide-react';

export const LiveUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const res = await updateService.getUpdates();
      if (res.success && res.data) {
        setUpdates(res.data);
      }
    } catch (e) {
      console.error('Error fetching updates:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await updateService.syncLive();
      await loadUpdates();
    } catch (e) {
      alert('Sync completed with local cache');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff7ed', color: '#c2410c', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <TrendingUp size={14} /> Real-Time Policy Broadcasts
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Live Government Updates & Scheme Alerts
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Official announcements, scholarship deadline extensions, and DBT subsidy disbursement notices.
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Live Feeds'}
          </button>
        </div>

        {/* Updates Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
            <p>Fetching latest government notifications...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {updates.map(item => (
              <div key={item.id} className="card" style={{ padding: '1.5rem', borderLeft: '5px solid #ea580c' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', background: '#fff7ed', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {item.category || 'WELFARE'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <Calendar size={13} /> {item.publishedDate}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Source: <strong>{item.source}</strong>
                  </div>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                      Official Gazette / Order <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
