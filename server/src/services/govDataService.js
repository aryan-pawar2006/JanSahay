/**
 * govDataService.js
 * Fetches REAL government scheme data from:
 *  1. MyScheme API (api.myscheme.gov.in) — public search endpoint
 *  2. data.gov.in Open Government Data API
 *  3. Official government scheme pages (cheerio HTML scraping)
 *
 * Data is upserted into the local JSON database so the app always has
 * a cached copy even when the internet is unavailable.
 */

import * as cheerio from 'cheerio';
import { db } from '../db/database.js';

// ── helpers ───────────────────────────────────────────────────────────────────

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (JanSahay AI College Project; Node.js) AppleWebKit/537.36',
  'Accept': 'application/json, text/html, */*',
  'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
};

async function safeFetch(url, opts = {}) {
  try {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(url, { ...opts, headers: { ...HEADERS, ...(opts.headers || {}) }, timeout: 12000 });
    return res;
  } catch (e) {
    console.warn(`[GovData] fetch failed for ${url}: ${e.message}`);
    return null;
  }
}

function nextId(collection) {
  const existing = db.getAll(collection);
  if (!existing || existing.length === 0) return 1;
  return Math.max(...existing.map(x => x.id || 0)) + 1;
}

function upsertScheme(scheme) {
  const existing = db.findOne('schemes', s =>
    s.name.trim().toLowerCase() === scheme.name.trim().toLowerCase()
  );
  if (existing) {
    db.update('schemes', existing.id, { ...existing, ...scheme, id: existing.id, lastFetched: new Date().toISOString() });
    return { action: 'updated', name: scheme.name };
  } else {
    const id = nextId('schemes');
    db.insert('schemes', { ...scheme, id, lastFetched: new Date().toISOString() });
    return { action: 'inserted', name: scheme.name };
  }
}

function upsertUpdate(update) {
  const existing = db.findOne('updates', u => u.title === update.title);
  if (!existing) {
    const id = nextId('updates');
    db.insert('updates', { ...update, id });
  }
}

// ── Source 1: MyScheme public search API ─────────────────────────────────────

async function fetchMySchemeAPI(keywords = ['scholarship', 'farmer', 'business', 'women', 'health']) {
  const results = [];

  for (const kw of keywords) {
    const url = `https://api.myscheme.gov.in/search/v4/schemes?lang=en&q=${encodeURIComponent(kw)}&keyword=${encodeURIComponent(kw)}`;
    const res = await safeFetch(url, {
      headers: {
        ...HEADERS,
        'Origin': 'https://www.myscheme.gov.in',
        'Referer': 'https://www.myscheme.gov.in/',
      }
    });

    if (!res) continue;
    if (res.status === 200) {
      try {
        const json = await res.json();
        // MyScheme returns { data: { hits: [...] } }
        const hits = json?.data?.hits || json?.hits || [];
        for (const hit of hits.slice(0, 5)) {
          const s = hit._source || hit;
          if (!s.schemeName && !s.name) continue;
          results.push({
            name: s.schemeName || s.name,
            description: s.schemeShortTitle || s.briefDescription || s.description || s.schemeName || '',
            benefit: s.benefit || s.benefits || 'As per scheme guidelines',
            category: mapCategory(s.tags || s.category || s.ministryName || ''),
            governmentLevel: (s.level || s.schemeLevel || 'CENTRAL').toUpperCase().includes('STATE') ? 'STATE' : 'CENTRAL',
            state: s.state || 'All India',
            targetBeneficiaries: s.targetBeneficiaries || s.beneficiaries || 'As per eligibility',
            sourceUrl: s.schemeUrl || s.url || `https://www.myscheme.gov.in/schemes/${s.schemeId || ''}`,
            lastVerified: new Date().toISOString().split('T')[0],
            active: true,
            isDemoData: false,
            verificationStatus: 'LIVE_FETCHED',
            source: 'MyScheme.gov.in',
            rules: [],
            requiredDocuments: [],
            applicationGuides: [],
          });
        }
      } catch (e) {
        console.warn('[GovData] MyScheme JSON parse error:', e.message);
      }
    }
  }
  return results;
}

// ── Source 2: data.gov.in Open API ───────────────────────────────────────────

const DATA_GOV_RESOURCES = [
  // PM-KISAN beneficiary data
  { id: '9ef84268-d588-465a-a308-a864a43d0070', label: 'PM-KISAN beneficiary data', category: 'AGRICULTURE' },
  // PMEGP data
  { id: 'b4bab743-27c0-4b46-8b24-3ccfe2ce17b6', label: 'PMEGP loans data', category: 'BUSINESS' },
];

async function fetchDataGovIn() {
  const results = [];
  const apiKey = process.env.DATA_GOV_API_KEY || '579b464db66ec23d359559749.........'; // placeholder

  // Try without auth first — data.gov.in allows limited anonymous requests
  for (const resource of DATA_GOV_RESOURCES) {
    const url = `https://api.data.gov.in/resource/${resource.id}?format=json&limit=5`;
    const res = await safeFetch(url);
    if (!res || res.status !== 200) continue;

    try {
      const json = await res.json();
      const records = json?.records || json?.data || [];
      if (records.length > 0) {
        results.push({
          label: resource.label,
          category: resource.category,
          recordCount: records.length,
          sample: records[0]
        });
      }
    } catch (e) {
      console.warn('[GovData] data.gov.in parse error:', e.message);
    }
  }
  return results;
}

// ── Source 3: Scrape official government scheme pages ────────────────────────

const SCHEME_PAGES = [
  {
    url: 'https://pmkisan.gov.in/',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'AGRICULTURE',
    governmentLevel: 'CENTRAL',
    state: 'All India',
  },
  {
    url: 'https://www.myscheme.gov.in/schemes/pmmvy',
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    category: 'WELFARE',
    governmentLevel: 'CENTRAL',
    state: 'All India',
  },
  {
    url: 'https://mahadbt.maharashtra.gov.in/',
    name: 'MahaDBT Scholarship Portal (Maharashtra)',
    category: 'EDUCATION',
    governmentLevel: 'STATE',
    state: 'Maharashtra',
  },
  {
    url: 'https://pmjay.gov.in/',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    category: 'HEALTH',
    governmentLevel: 'CENTRAL',
    state: 'All India',
  },
  {
    url: 'https://nsp.gov.in/',
    name: 'National Scholarship Portal (NSP)',
    category: 'EDUCATION',
    governmentLevel: 'CENTRAL',
    state: 'All India',
  },
];

async function scrapeSchemePages() {
  const scraped = [];

  for (const page of SCHEME_PAGES) {
    const res = await safeFetch(page.url);
    if (!res) continue;

    try {
      const html = await res.text();
      const $ = cheerio.load(html);

      // Extract title and description from meta tags (most govt sites have these)
      const metaDesc =
        $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="Description"]').attr('content') || '';

      const ogTitle =
        $('meta[property="og:title"]').attr('content') ||
        $('title').text() || '';

      // Extract benefit info — look for common patterns
      let benefit = '';
      $('p, li, .benefit, .highlight, .scheme-benefit').each((_, el) => {
        const text = $(el).text().trim();
        if ((text.includes('₹') || text.includes('lakh') || text.includes('benefit') || text.includes('subsidy')) && text.length < 300) {
          if (!benefit) benefit = text;
        }
      });

      scraped.push({
        name: page.name,
        description: metaDesc.slice(0, 500) || ogTitle.slice(0, 300) || `${page.name} - Official Government Scheme`,
        benefit: benefit || 'As per official scheme guidelines — visit the official portal for latest benefit amounts.',
        category: page.category,
        governmentLevel: page.governmentLevel,
        state: page.state,
        targetBeneficiaries: 'As per official eligibility criteria',
        sourceUrl: page.url,
        lastVerified: new Date().toISOString().split('T')[0],
        active: true,
        isDemoData: false,
        verificationStatus: 'LIVE_SCRAPED',
        source: new URL(page.url).hostname,
        rules: [],
        requiredDocuments: [],
        applicationGuides: [],
        scrapedAt: new Date().toISOString(),
      });

      console.log(`[GovData] Scraped: ${page.name} from ${page.url}`);
    } catch (e) {
      console.warn(`[GovData] Scrape failed for ${page.url}: ${e.message}`);
    }
  }

  return scraped;
}

// ── Source 4: Fetch live news/updates from PIB (Press Information Bureau) ───

async function fetchPIBUpdates() {
  const updates = [];

  const res = await safeFetch('https://pib.gov.in/allRel.aspx');
  if (!res || res.status !== 200) return updates;

  try {
    const html = await res.text();
    const $ = cheerio.load(html);

    $('ul.release-list li, .ContentDiv ul li, table tr').each((idx, el) => {
      if (idx >= 10) return;
      const $el = $(el);
      const title = $el.find('a').first().text().trim() || $el.text().trim();
      const href = $el.find('a').first().attr('href') || '';
      if (title && title.length > 20 && title.length < 300) {
        updates.push({
          title: title.substring(0, 200),
          description: `Official Press Information Bureau release. Click to read the full announcement on the PIB website.`,
          publishedDate: new Date().toISOString().split('T')[0],
          category: 'GOVERNMENT_UPDATE',
          source: 'PIB - Press Information Bureau',
          sourceUrl: href.startsWith('http') ? href : `https://pib.gov.in${href}`,
          isLive: true,
          fetchedAt: new Date().toISOString(),
        });
      }
    });
  } catch (e) {
    console.warn('[GovData] PIB scrape error:', e.message);
  }

  return updates.slice(0, 8);
}

// ── Category mapper ───────────────────────────────────────────────────────────

function mapCategory(input = '') {
  const s = input.toLowerCase();
  if (s.includes('agri') || s.includes('farmer') || s.includes('kisan') || s.includes('crop')) return 'AGRICULTURE';
  if (s.includes('health') || s.includes('medical') || s.includes('hospital') || s.includes('arogya')) return 'HEALTH';
  if (s.includes('education') || s.includes('scholarship') || s.includes('student') || s.includes('school')) return 'EDUCATION';
  if (s.includes('business') || s.includes('msme') || s.includes('entrepreneur') || s.includes('loan')) return 'BUSINESS';
  if (s.includes('women') || s.includes('girl') || s.includes('maternity') || s.includes('mahila')) return 'WELFARE';
  if (s.includes('housing') || s.includes('awas') || s.includes('house') || s.includes('home')) return 'HOUSING';
  if (s.includes('pension') || s.includes('senior') || s.includes('old age') || s.includes('atal')) return 'WELFARE';
  return 'WELFARE';
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export class GovDataService {
  /**
   * Fetch live data from all available government sources and upsert into DB.
   * Returns a summary report of what was fetched.
   */
  static async fetchAndSync() {
    const report = {
      timestamp: new Date().toISOString(),
      sources: {},
      totalInserted: 0,
      totalUpdated: 0,
      liveUpdatesAdded: 0,
      errors: [],
    };

    console.log('[GovData] Starting live government data fetch...');

    // 1. Scrape official scheme pages
    try {
      const scraped = await scrapeSchemePages();
      report.sources.officialPages = { fetched: scraped.length };

      for (const scheme of scraped) {
        const r = upsertScheme(scheme);
        if (r.action === 'inserted') report.totalInserted++;
        else report.totalUpdated++;
      }
      console.log(`[GovData] Official pages: ${scraped.length} schemes processed`);
    } catch (e) {
      report.errors.push(`Official pages scraping: ${e.message}`);
    }

    // 2. MyScheme API
    try {
      const mySchemeData = await fetchMySchemeAPI(['scholarship', 'farmer', 'business', 'health', 'women', 'disability']);
      report.sources.mySchemeAPI = { fetched: mySchemeData.length };

      for (const scheme of mySchemeData) {
        const r = upsertScheme(scheme);
        if (r.action === 'inserted') report.totalInserted++;
        else report.totalUpdated++;
      }
      console.log(`[GovData] MyScheme API: ${mySchemeData.length} schemes processed`);
    } catch (e) {
      report.errors.push(`MyScheme API: ${e.message}`);
    }

    // 3. PIB live updates
    try {
      const pibUpdates = await fetchPIBUpdates();
      report.sources.pibUpdates = { fetched: pibUpdates.length };

      for (const upd of pibUpdates) {
        upsertUpdate(upd);
        report.liveUpdatesAdded++;
      }
      console.log(`[GovData] PIB updates: ${pibUpdates.length} updates added`);
    } catch (e) {
      report.errors.push(`PIB updates: ${e.message}`);
    }

    // 4. data.gov.in (informational, for report only)
    try {
      const govInData = await fetchDataGovIn();
      report.sources.dataGovIn = { datasets: govInData.length, note: 'API key required for full data; limited preview fetched' };
    } catch (e) {
      report.errors.push(`data.gov.in: ${e.message}`);
    }

    const totalSchemes = (db.getAll('schemes') || []).length;
    report.totalSchemesInDB = totalSchemes;
    report.summary = `Successfully fetched from ${Object.keys(report.sources).length} government data sources. ${report.totalInserted} new schemes added, ${report.totalUpdated} updated. Total in database: ${totalSchemes} schemes.`;

    console.log('[GovData] Sync complete:', report.summary);
    return report;
  }

  /**
   * Fetch and return live scheme listings from MyScheme public API
   * (without persisting to DB — for real-time display)
   */
  static async getLiveSchemes(keyword = 'scholarship') {
    const mySchemeData = await fetchMySchemeAPI([keyword]);
    return mySchemeData;
  }

  /**
   * Get live press releases from PIB
   */
  static async getLiveUpdates() {
    const pibUpdates = await fetchPIBUpdates();
    return pibUpdates;
  }
}
