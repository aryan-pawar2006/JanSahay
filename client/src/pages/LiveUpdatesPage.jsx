import React, { useState, useEffect } from 'react';
import { updateService } from '../services/api';
import {
  TrendingUp, RefreshCw, ExternalLink, Calendar, Tag, Bell,
  Globe, Database, Newspaper, Satellite, CheckCircle, AlertCircle, Loader
} from 'lucide-react';

export const LiveUpdatesPage = () => {
  const [updates, setUpdates] = useState([]);
  const [pibUpdates, setPibUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [fetchingGov, setFetchingGov] = useState(false);
  const [fetchResult, setFetchResult] = useState(null);
  const [activeTab, setActiveTab] = useState('STORED'); // STORED | PIB | GOV_FETCH

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const res = await updateService.getUpdates();
      if (res.success && res.data) setUpdates(res.data);
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
      console.warn('Sync completed with local cache');
    } finally {
      setSyncing(false);
    }
  };

  // ── Fetch LIVE PIB updates from government website ──
  const handleFetchPIB = async () => {
    setSyncing(true);
    setPibUpdates([]);
    try {
      const res = await updateService.getLivePIBUpdates();
      if (res.success && res.data) {
        setPibUpdates(res.data);
        setActiveTab('PIB');
      }
    } catch (e) {
      console.warn('[PIB] Could not fetch live PIB data:', e);
      setPibUpdates([{
        title: 'PIB temporarily unavailable',
        description: 'The Press Information Bureau server could not be reached. Please try again in a few minutes or visit pib.gov.in directly.',
        publishedDate: new Date().toISOString().split('T')[0],
        category: 'NOTICE',
        source: 'JanSahay System',
        sourceUrl: 'https://pib.gov.in'
      }]);
      setActiveTab('PIB');
    } finally {
      setSyncing(false);
    }
  };

  // ── Trigger full government data sync (scheme data) ──
  const handleFetchGovernmentData = async () => {
    setFetchingGov(true);
    setFetchResult(null);
    setActiveTab('GOV_FETCH');
    try {
      const res = await updateService.fetchGovSchemes();
      setFetchResult({
        success: true,
        message: res.message || 'Government data sync completed.',
        data: res.data
      });
    } catch (e) {
      setFetchResult({
        success: false,
        message: e?.message || 'Could not reach government data servers. All cached scheme data is still available.',
        data: null
      });
    } finally {
      setFetchingGov(false);
    }
  };

  const categoryColors = {
    EDUCATION: '#7c3aed',
    AGRICULTURE: '#15803d',
    BUSINESS: '#ea580c',
    HEALTH: '#0891b2',
    GENERAL: '#475569',
    GOVERNMENT_UPDATE: '#1e3a8a',
    WELFARE: '#db2777',
    NOTICE: '#b45309',
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh', backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff7ed', color: '#c2410c', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <Satellite size={14} /> Real-Time Government Data
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Live Government Updates &amp; Scheme Alerts
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Official announcements, live data fetched from government websites, PIB press releases, and scheme disbursement notices.
          </p>
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSync}
            disabled={syncing || fetchingGov}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Local Cache'}
          </button>

          <button
            onClick={handleFetchPIB}
            disabled={syncing || fetchingGov}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', borderColor: '#7c3aed', color: '#7c3aed' }}>
            <Newspaper size={15} />
            Fetch Live PIB Releases
          </button>

          <button
            onClick={handleFetchGovernmentData}
            disabled={syncing || fetchingGov}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #15803d, #047857)' }}>
            {fetchingGov ? <Loader size={15} className="animate-spin" /> : <Globe size={15} />}
            {fetchingGov ? 'Fetching from Government Websites...' : '🌐 Fetch Live Govt Schemes Now'}
          </button>
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
          {[
            { key: 'STORED', label: `📋 Stored Updates (${updates.length})` },
            { key: 'PIB', label: `📰 PIB Live Releases (${pibUpdates.length})` },
            { key: 'GOV_FETCH', label: '🏛️ Govt Data Fetch Report' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                color: activeTab === tab.key ? '#1e3a8a' : '#64748b',
                borderBottom: activeTab === tab.key ? '3px solid #1e3a8a' : '3px solid transparent',
                marginBottom: '-2px'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: Stored Updates ── */}
        {activeTab === 'STORED' && (
          loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
              <Loader size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              <p>Loading government notifications...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {updates.map((item, idx) => (
                <UpdateCard key={item.id || idx} item={item} categoryColors={categoryColors} />
              ))}
              {updates.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                  <Bell size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>No stored updates. Click "Sync Local Cache" to refresh.</p>
                </div>
              )}
            </div>
          )
        )}

        {/* ── TAB 2: PIB Live Updates ── */}
        {activeTab === 'PIB' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {pibUpdates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <Newspaper size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>Click <strong>"Fetch Live PIB Releases"</strong> above to load real-time press releases from the Press Information Bureau (pib.gov.in).</p>
              </div>
            ) : (
              pibUpdates.map((item, idx) => (
                <UpdateCard key={idx} item={item} categoryColors={categoryColors} isLive />
              ))
            )}
          </div>
        )}

        {/* ── TAB 3: Government Data Fetch Report ── */}
        {activeTab === 'GOV_FETCH' && (
          <div>
            {fetchingGov && (
              <div style={{ textAlign: 'center', padding: '5rem', color: '#15803d' }}>
                <Globe size={48} style={{ margin: '0 auto 1rem', animation: 'spin 2s linear infinite' }} />
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>🌐 Connecting to Government Data Sources...</p>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Fetching from MyScheme.gov.in, PIB, official scheme portals...</p>
              </div>
            )}

            {!fetchingGov && !fetchResult && (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                <Database size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                <p>Click <strong>"🌐 Fetch Live Govt Schemes Now"</strong> to sync real-time data from government websites.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  Sources: MyScheme.gov.in API, PIB Press Releases, pmkisan.gov.in, mahadbt.maharashtra.gov.in, and more.
                </p>
              </div>
            )}

            {fetchResult && (
              <div>
                {/* Status Banner */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 1.5rem',
                  borderRadius: '0.75rem', marginBottom: '1.5rem',
                  background: fetchResult.success ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${fetchResult.success ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {fetchResult.success
                    ? <CheckCircle size={24} color="#15803d" />
                    : <AlertCircle size={24} color="#dc2626" />}
                  <div>
                    <div style={{ fontWeight: 700, color: fetchResult.success ? '#15803d' : '#dc2626' }}>
                      {fetchResult.success ? 'Government Data Sync Successful' : 'Partial Sync — Using Cached Data'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.2rem' }}>
                      {fetchResult.message}
                    </div>
                  </div>
                </div>

                {/* Report Details */}
                {fetchResult.data && (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                      {[
                        { label: 'New Schemes Added', value: fetchResult.data.totalInserted, color: '#15803d' },
                        { label: 'Schemes Updated', value: fetchResult.data.totalUpdated, color: '#1e3a8a' },
                        { label: 'Live Updates Added', value: fetchResult.data.liveUpdatesAdded, color: '#7c3aed' },
                        { label: 'Total in Database', value: fetchResult.data.totalSchemesInDB, color: '#ea580c' },
                      ].map(stat => (
                        <div key={stat.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value ?? '—'}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '0.25rem' }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Source breakdown */}
                    {fetchResult.data.sources && (
                      <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: '#1e3a8a' }}>📡 Data Sources Accessed</h3>
                        {Object.entries(fetchResult.data.sources).map(([source, info]) => (
                          <div key={source} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                              {source.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span style={{ color: '#64748b' }}>
                              {typeof info === 'object' ? JSON.stringify(info).replace(/{|}/g, '') : info}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {fetchResult.data.errors?.length > 0 && (
                      <div className="card" style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', background: '#fffbeb' }}>
                        <p style={{ fontWeight: 700, color: '#b45309', marginBottom: '0.5rem' }}>⚠️ Partial Failures (non-critical):</p>
                        {fetchResult.data.errors.map((err, i) => (
                          <p key={i} style={{ fontSize: '0.8rem', color: '#92400e' }}>• {err}</p>
                        ))}
                        <p style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '0.5rem' }}>
                          These are non-critical — the application continues to work with all cached data.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Panel */}
        <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #bfdbfe' }}>
          <h4 style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: '0.5rem' }}>🏛️ Government Data Sources Used</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem', color: '#1e40af' }}>
            {[
              { name: 'MyScheme.gov.in', url: 'https://www.myscheme.gov.in' },
              { name: 'PIB (Press Info Bureau)', url: 'https://pib.gov.in' },
              { name: 'PM-KISAN Portal', url: 'https://pmkisan.gov.in' },
              { name: 'MahaDBT Portal', url: 'https://mahadbt.maharashtra.gov.in' },
              { name: 'Ayushman Bharat (PM-JAY)', url: 'https://pmjay.gov.in' },
              { name: 'data.gov.in Open API', url: 'https://data.gov.in' },
            ].map(src => (
              <a key={src.name} href={src.url} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', color: '#1e40af' }}>
                <ExternalLink size={12} /> {src.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Reusable update card ──
function UpdateCard({ item, categoryColors, isLive = false }) {
  const catColor = categoryColors[item.category] || '#475569';
  return (
    <div className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${catColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: catColor, background: `${catColor}15`, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
            {item.category || 'WELFARE'}
          </span>
          {isLive && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '0.15rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#15803d', display: 'inline-block' }} />
              LIVE
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b' }}>
          <Calendar size={13} /> {item.publishedDate || item.fetchedAt?.split('T')[0] || 'Today'}
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        {item.title}
      </h3>

      <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
        {item.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          Source: <strong>{item.source}</strong>
        </div>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
            Official Source <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
