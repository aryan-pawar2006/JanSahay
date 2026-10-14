import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, Show, SignIn, SignUp, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import {
  useHealthCheck, useGetProfile, useSaveProfile, useListSchemes, useGetScheme,
  useGetRecommendations, useGetSchemeDocuments, useGetSchemeReadiness,
  useGetChecklist, useUpdateChecklist, useListDocumentGuides,
  useGetDocumentGuide, useGetPreparationDashboard,
  useExplainGuidance, useListAdminDocumentGuides, useCreateDocumentGuide,
  useUpdateDocumentGuide, useGetGuideReferences, useVerifyDocumentGuide,
  usePublishDocumentGuide, useArchiveDocumentGuide,
  getGetProfileQueryKey, getGetPreparationDashboardQueryKey, getGetChecklistQueryKey,
  getGetSchemeReadinessQueryKey, getListAdminDocumentGuidesQueryKey,
  getListDocumentGuidesQueryKey, getGetDocumentGuideQueryKey, getGetSchemeDocumentsQueryKey,
  getGetGuideReferencesQueryKey, getGetSchemeQueryKey,
} from '@workspace/api-client-react';
import type {
  AssistantAnswer, CitizenProfileInput, DocumentGuide, DocumentGuideInput,
  DocumentGuideUpdate, DocumentStatus, Recommendation, Scheme,
} from '@workspace/api-client-react';
import { Link, Redirect, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, ExternalLink, FileCheck2,
  FileText, Filter, GraduationCap, HeartHandshake, Home, Landmark, Leaf, LockKeyhole,
  LogOut, Menu, MessageCircle, Search, ShieldAlert, ShieldCheck, Sparkles, UserRound,
  X, BriefcaseBusiness, MapPin, Wallet, PanelLeftClose, Circle, LoaderCircle,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 25_000 } } });
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const clientAdminUserIds = new Set((import.meta.env.VITE_JANSAHAY_ADMIN_USER_IDS ?? '').split(',').map((id: string) => id.trim()).filter(Boolean));
function stripBase(path: string) { return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path; }
if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');

const clerkAppearance = {
  theme: shadcn, cssLayerName: 'clerk',
  options: { logoPlacement: 'inside' as const, logoLinkUrl: basePath || '/', logoImageUrl: `${window.location.origin}${basePath}/logo.svg` },
  variables: {
    colorPrimary: '#286454', colorForeground: '#203b34', colorMutedForeground: '#6f827a',
    colorDanger: '#ac463b', colorBackground: '#fbfaf5', colorInput: '#fffefa',
    colorInputForeground: '#203b34', colorNeutral: '#d8ddd4', fontFamily: 'DM Sans',
    borderRadius: '0.8rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center', cardBox: 'bg-[#fbfaf5] rounded-2xl w-[440px] max-w-full overflow-hidden border border-[#deded3]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none', footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#203b34] font-semibold', headerSubtitle: 'text-[#6f827a]',
    socialButtonsBlockButtonText: 'text-[#203b34] font-medium', formFieldLabel: 'text-[#294b41] font-medium',
    footerActionLink: 'text-[#286454] font-semibold', footerActionText: 'text-[#6f827a]',
    dividerText: 'text-[#71847b]', identityPreviewEditButton: 'text-[#286454]',
    formFieldSuccessText: 'text-[#286454]', alertText: 'text-[#8d3730]',
    logoBox: 'mb-4', logoImage: 'max-h-10', socialButtonsBlockButton: 'border-[#d8ddd4] bg-[#fffefa]',
    formButtonPrimary: 'bg-[#286454] hover:bg-[#204f43] text-white',
    formFieldInput: 'border-[#d8ddd4] bg-[#fffefa] text-[#203b34]',
    footerAction: 'border-t border-[#e4e3d9]', dividerLine: 'bg-[#deded3]', alert: 'border-[#e4b9b2]',
    otpCodeFieldInput: 'border-[#d8ddd4] bg-[#fffefa]', formFieldRow: 'text-[#294b41]', main: 'text-[#203b34]',
  },
};

type IconType = typeof Home;
const navItems: { href: string; label: string; icon: IconType }[] = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/schemes', label: 'Find schemes', icon: Landmark },
  { href: '/preparation', label: 'My documents', icon: ClipboardCheck },
  { href: '/guides', label: 'Document guides', icon: BookOpen },
  { href: '/assistant', label: 'Ask JanSahay', icon: MessageCircle },
  { href: '/profile', label: 'My profile', icon: UserRound },
];
const indiaStatesAndTerritories = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
const statusLabel: Record<string, string> = {
  verified: 'Verified source', unverified: 'Unverified — check official source', outdated: 'May be outdated',
  published: 'Published guidance', demonstration: 'Demonstration data', draft: 'Draft', archived: 'Archived',
  strong_match: 'Strong match', potential_match: 'Potential match', more_information_required: 'More information needed',
  not_a_match: 'Not a match', available: 'Have this', missing: 'Need to get', needs_verification: 'Check details', unknown: 'Not yet marked',
};
const pretty = (s: string) => s.replace(/[_-]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'alert' | 'demo' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
function SourceBadge({ verificationStatus, publicationStatus, sourceKind }: { verificationStatus?: string; publicationStatus?: string; sourceKind?: string }) {
  return <div className="flex flex-wrap gap-2">
    {sourceKind === 'demonstration' || publicationStatus === 'demonstration' ? <Badge tone="demo">Demonstration data</Badge> : null}
    {verificationStatus ? <Badge tone={verificationStatus === 'verified' ? 'good' : verificationStatus === 'outdated' ? 'alert' : 'warn'}>{statusLabel[verificationStatus] ?? pretty(verificationStatus)}</Badge> : null}
    {publicationStatus && publicationStatus !== 'demonstration' ? <Badge>{statusLabel[publicationStatus] ?? pretty(publicationStatus)}</Badge> : null}
  </div>;
}
function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-title"><div><div className="eyebrow">{eyebrow}</div><h1 className="serif">{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
function Loading({ label = 'Loading stored guidance…' }: { label?: string }) {
  return <div className="loading-panel" role="status"><div className="skeleton-block w-12 h-12 rounded-2xl"/><div className="skeleton-lines"><i/><i/><i/></div><span className="sr-only">{label}</span></div>;
}
function ErrorPanel({ retry, message = 'We could not load this guidance right now.' }: { retry: () => void; message?: string }) {
  return <div className="empty-panel error-panel"><ShieldAlert size={22}/><strong>Nothing has changed on your profile.</strong><p>{message} Your entries stay on this page. Try again when you are ready.</p><button className="button button-outline" onClick={retry}>Try again</button></div>;
}
function EmptyPanel({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <div className="empty-panel"><div className="empty-mark"><FileText size={22}/></div><strong>{title}</strong><p>{detail}</p>{action}</div>;
}

function AuthScreens({ mode }: { mode: 'in' | 'up' }) {
  return <main className="auth-wrap"><div className="auth-side"><Link href="/" className="brand"><span className="brand-mark"><Landmark size={22}/></span><span>JanSahay<small>PUBLIC GUIDANCE, MADE CLEAR</small></span></Link><div className="auth-note"><span className="eyebrow">A steadier way through</span><h1 className="serif">Know what is known.<br/><em>See what is still unclear.</em></h1><p>Compare your details with stored scheme rules, prepare documents, and always see where guidance comes from.</p><div className="auth-points"><span><ShieldCheck size={16}/> Your citizen profile stays private</span><span><ExternalLink size={16}/> Official sources stay in view</span></div></div><div className="auth-foot">Guidance is informational. Confirm decisions with the issuing authority.</div></div><div className="auth-card-wrap"><div className="auth-mobile-brand"><Link href="/" className="brand"><span className="brand-mark"><Landmark size={22}/></span><span>JanSahay<small>PUBLIC GUIDANCE, MADE CLEAR</small></span></Link></div>{mode === 'in' ? <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`}/> : <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`}/>}</div></main>;
}
function HomePublic() {
  const { data: schemes, isLoading, isError, refetch } = useListSchemes();
  const { data: guides } = useListDocumentGuides();
  return <main className="public-home">
    <header className="public-nav"><Link href="/" className="brand"><span className="brand-mark"><Landmark size={22}/></span><span>JanSahay<small>PUBLIC GUIDANCE, MADE CLEAR</small></span></Link><nav><a href="#how">How it works</a><a href="#principles">Our approach</a></nav><div className="nav-ctas"><Link href="/sign-in" className="text-link">Sign in</Link><Link href="/sign-up" className="button button-primary">Start with your profile <ArrowRight size={16}/></Link></div></header>
    <section className="hero-public"><div className="hero-copy page-enter"><div className="eyebrow"><span className="eyebrow-dot"/> A clearer path to public support</div><h1 className="serif">Government guidance,<br/><em>without the guesswork.</em></h1><p>See how your details compare with stored scheme rules. Understand what documents may be needed. Know what to verify before you act.</p><div className="hero-actions"><Link href="/sign-up" className="button button-primary">Get started <ArrowRight size={17}/></Link><a href="#how" className="button button-quiet">See how it works <ArrowDownRight size={17}/></a></div><div className="trust-row"><span><LockKeyhole size={15}/> Private profile</span><span><BadgeCheck size={15}/> Source labels shown</span><span><CircleHelp size={15}/> No eligibility promises</span></div></div><div className="hero-art" aria-label="Illustration of a public-service document"><div className="art-sun"/><div className="art-orbit"/><div className="art-card art-back"><div className="art-line short"/><div className="art-line"/><div className="art-line medium"/></div><div className="art-card art-front"><div className="art-card-top"><span className="art-seal"><Landmark size={19}/></span><span className="art-rule">YOUR DETAILS<br/>YOUR NEXT STEPS</span></div><div className="art-rule-line"/><div className="art-doc-row"><span className="art-check"><Check size={12}/></span><div className="art-line medium"/></div><div className="art-doc-row"><span className="art-check muted"><Circle size={10}/></span><div className="art-line short"/></div><div className="art-label">STORED GUIDANCE · NOT A DECISION</div></div><div className="art-stamp">SOURCE<br/>FIRST</div></div></section>
    <section className="promise-strip" id="principles"><div><span className="promise-icon"><LockKeyhole size={17}/></span><span><b>Private by design</b><small>Profile and checklist are yours</small></span></div><div><span className="promise-icon"><ExternalLink size={17}/></span><span><b>Source-led guidance</b><small>Official links where available</small></span></div><div><span className="promise-icon"><ShieldAlert size={17}/></span><span><b>Honest uncertainty</b><small>Unknown is not treated as eligible</small></span></div></section>
    <section className="how-section" id="how"><div className="section-intro"><div className="eyebrow">A useful starting point</div><h2 className="serif">Three steps. No false certainty.</h2><p>JanSahay compares only the information available in its stored rules. It does not submit an application or make an official decision.</p></div><div className="steps-grid"><article><span className="step-no">01</span><UserRound size={21}/><h3>Share only what matters</h3><p>Add the profile details used by scheme rules. Your signed-in information is kept separate from public browsing.</p></article><article><span className="step-no">02</span><Landmark size={21}/><h3>Compare stored rules</h3><p>See matched, failed and unknown conditions for each scheme—so gaps are visible, not glossed over.</p></article><article><span className="step-no">03</span><ClipboardCheck size={21}/><h3>Prepare, then verify</h3><p>Track document status and follow jurisdiction-specific guides. Confirm current requirements with the official source.</p></article></div></section>
    <section className="public-browse"><div className="public-browse-head"><div><div className="eyebrow">Browse without signing in</div><h2 className="serif">Stored guidance, in plain view.</h2></div><Link href="/guides" className="text-link">Explore document guides <ArrowRight size={15}/></Link></div>{isLoading ? <Loading/> : isError ? <ErrorPanel retry={() => void refetch()}/> : <div className="browse-list">{(schemes ?? []).slice(0, 3).map((s) => <Link href={`/schemes/${s.id}`} className="browse-item" key={s.id}><span className="browse-icon"><Landmark size={18}/></span><span><b>{s.name}</b><small>{s.category} · {s.state || 'Multi-state'}</small></span><SourceBadge verificationStatus={s.verificationStatus} publicationStatus={s.publicationStatus} sourceKind={s.sourceKind}/><ChevronRight size={17}/></Link>)}{!(schemes?.length) && <p className="quiet-note">No scheme guidance is currently available.</p>}</div>}{guides?.length ? <p className="quiet-note">{guides.length} document guides available · each guide shows its source status.</p> : null}</section>
    <footer className="public-footer"><Link href="/" className="brand"><span className="brand-mark"><Landmark size={18}/></span><span>JanSahay<small>PUBLIC GUIDANCE, MADE CLEAR</small></span></Link><p>Always confirm current requirements with the relevant issuing authority.</p><Link href="/sign-up" className="text-link">Continue to your private workspace <ArrowRight size={15}/></Link></footer>
  </main>;
}
function HomeRedirect() {
  return <><Show when="signed-in"><Redirect to="/dashboard"/></Show><Show when="signed-out"><HomePublic/></Show></>;
}
function Guard({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="auth-loading"><div className="skeleton-block w-12 h-12 rounded-2xl"/></div>;
  return isSignedIn ? <>{children}</> : <Redirect to="/"/>;
}

function AppShell({ children, active }: { children: ReactNode; active?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false); const { signOut } = useClerk(); const { user } = useUser(); const { isSignedIn } = useAuth();
  const visibleNavItems = isSignedIn ? navItems : navItems.filter((item) => item.href === '/schemes' || item.href === '/guides');
  const name = user?.firstName || 'Citizen';
  return <div className="app-frame">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}><div className="sidebar-head"><Link href="/dashboard" className="brand brand-light"><span className="brand-mark"><Landmark size={21}/></span><span>JanSahay<small>YOUR GUIDANCE DESK</small></span></Link><button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><PanelLeftClose size={18}/></button></div>
      <div className="nav-caption">{isSignedIn ? 'YOUR SPACE' : 'PUBLIC LIBRARY'}</div><nav className="side-nav">{visibleNavItems.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`side-link ${active === item.href ? 'side-active' : ''}`}><Icon size={18}/><span>{item.label}</span>{active === item.href && <span className="active-dot"/>}</Link>; })}</nav>
      {(user?.publicMetadata?.role === 'admin' || Boolean(user?.id && clientAdminUserIds.has(user.id))) && <><div className="nav-caption admin-caption">ADMINISTRATION</div><nav className="side-nav"><Link href="/admin/guides" className={`side-link ${active === '/admin/guides' ? 'side-active' : ''}`}><ShieldCheck size={18}/><span>Manage guides</span></Link></nav></>}
      <div className="sidebar-bottom">{isSignedIn ? <><div className="privacy-card"><LockKeyhole size={16}/><div><b>Your details stay private</b><small>Only you can see your profile and checklist.</small></div></div><div className="side-user"><div className="user-initial">{name.slice(0, 1).toUpperCase()}</div><div className="user-name"><b>{name}</b><small>Citizen workspace</small></div><button className="icon-button logout-button" aria-label="Sign out" onClick={() => signOut({ redirectUrl: basePath || '/' })}><LogOut size={16}/></button></div></> : <div className="sidebar-auth-links"><Link href="/sign-in" className="button button-outline">Sign in</Link><Link href="/sign-up" className="button button-primary">Create account</Link></div>}</div>
    </aside>
     <div className="main-column"><header className="topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div className="topbar-breadcrumb"><span>JanSahay</span><ChevronRight size={14}/><b>{navItems.find((n) => n.href === active)?.label ?? (active === '/admin/guides' ? 'Guide management' : 'Workspace')}</b></div><div className="topbar-right"><span className="topbar-safe">{isSignedIn ? <><ShieldCheck size={15}/> Private workspace</> : 'Public library'}</span>{isSignedIn ? <div className="mini-avatar">{name.slice(0, 1).toUpperCase()}</div> : <Link href="/sign-in" className="text-link">Sign in</Link>}</div></header><main className="content-area">{children}</main><footer className="app-footer"><span>Guidance to help you ask better questions.</span><span>Confirm details with the official source before applying.</span></footer></div>
  </div>;
}

function Dashboard() {
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: reloadProfile } = useGetProfile();
  const { data: preparation, isLoading: prepLoading, isError: prepError, refetch: reloadPrep } = useGetPreparationDashboard();
  const { data: schemes, isLoading: schemesLoading, isError: schemesError, refetch: reloadSchemes } = useListSchemes();
  const health = useHealthCheck();
  const saved = profile ? [profile.state, profile.district, profile.occupation, profile.annualFamilyIncome, profile.age].filter((x) => x !== null && x !== undefined && x !== '').length : 0;
  return <AppShell active="/dashboard"><div className="dashboard-page page-enter"><PageTitle eyebrow="YOUR GUIDANCE DESK" title={`Good to see you${profile?.state ? ` in ${profile.state}` : ''}.`} description="A private place to compare stored rules and prepare your next questions." action={<Link href="/profile" className="button button-outline"><UserRound size={16}/> Update profile</Link>}/>
    <div className="notice-band"><ShieldAlert size={17}/><p><b>Guidance, not an official decision.</b> Scheme comparisons use stored rules. Requirements can change—check linked official sources before acting.</p><span className={`service-indicator ${health.isError ? 'offline' : ''}`}><i/>{health.isLoading ? 'Checking service' : health.isError ? 'Service check unavailable' : 'Guidance service available'}</span></div>
    {(profileError || prepError || schemesError) && <div className="inline-warning">Some stored information could not be loaded. <button onClick={() => { void reloadProfile(); void reloadPrep(); void reloadSchemes(); }}>Retry</button></div>}
    <div className="welcome-grid"><section className="welcome-card"><div className="welcome-copy"><div className="eyebrow">A clear next step</div><h2 className="serif">Start with what applies to you.</h2><p>Share a few relevant details, then see which stored scheme rules match, need more information, or do not match.</p><Link href="/schemes" className="button button-primary">Compare scheme rules <ArrowRight size={16}/></Link></div><div className="welcome-symbol"><HeartHandshake size={42}/><span>START HERE</span></div></section><section className="profile-snapshot"><div className="section-kicker"><UserRound size={16}/> YOUR PROFILE</div>{profileLoading ? <div className="skeleton-lines"><i/><i/><i/></div> : profileError ? <p>Profile details could not be loaded.</p> : <><strong>{saved ? `${saved} details saved` : 'Your profile is not set up yet'}</strong><p>{profile?.state || profile?.district ? [profile.district, profile.state].filter(Boolean).join(', ') : 'Add location, occupation or education to make comparisons more useful.'}</p><Link className="text-link" href="/profile">{saved ? 'Review your details' : 'Set up my profile'} <ArrowRight size={14}/></Link><small className="private-caption"><LockKeyhole size={12}/> Visible only to you</small></>}</section></div>
    <div className="stats-row">{[{ label: 'Documents marked ready', value: prepLoading ? '—' : String(preparation?.readyCount ?? 0), icon: FileCheck2 }, { label: 'Still to prepare', value: prepLoading ? '—' : String(preparation?.missingCount ?? 0), icon: ClipboardCheck }, { label: 'Need a closer look', value: prepLoading ? '—' : String(preparation?.unknownCount ?? 0), icon: CircleHelp }].map(({ label, value, icon: Icon }) => <div className="stat-block" key={label}><span className="stat-icon"><Icon size={17}/></span><div><strong>{value}</strong><small>{label}</small></div></div>)}</div>
    <section className="dashboard-section"><div className="section-heading"><div><div className="eyebrow">A starting point, not a verdict</div><h2 className="serif">Explore stored schemes</h2></div><Link href="/schemes" className="text-link">See all schemes <ArrowRight size={14}/></Link></div>{schemesLoading ? <Loading/> : schemesError ? <ErrorPanel retry={() => void reloadSchemes()}/> : schemes?.length ? <div className="scheme-teasers">{schemes.slice(0, 3).map((s) => <SchemeCard key={s.id} scheme={s}/>)}</div> : <EmptyPanel title="No scheme rules are available yet" detail="Check back later, or explore document preparation guidance." action={<Link href="/guides" className="text-link">Browse document guides <ArrowRight size={14}/></Link>}/>}</section>
    <section className="dashboard-lower"><div className="lower-card"><div className="lower-icon"><BookOpen size={19}/></div><div><h3>Need a document?</h3><p>Find a guide by document type and see the relevant state jurisdiction.</p><Link href="/guides" className="text-link">Browse guides <ArrowRight size={14}/></Link></div></div><div className="lower-card warm"><div className="lower-icon"><MessageCircle size={19}/></div><div><h3>Question about guidance?</h3><p>Ask about stored rules. Answers stay grounded in available sources.</p><Link href="/assistant" className="text-link">Ask JanSahay <ArrowRight size={14}/></Link></div></div></section>
  </div></AppShell>;
}
function SchemeCard({ scheme, status }: { scheme: Scheme; status?: string }) {
  return <Link href={`/schemes/${scheme.id}`} className="scheme-card"><div className="scheme-card-top"><span className="scheme-category">{scheme.category}</span><ArrowUpRightIcon/></div><h3>{scheme.name}</h3><p>{scheme.description}</p><div className="scheme-card-meta"><span><MapPin size={13}/>{scheme.state || 'Multi-state'}</span>{status && <Badge tone={status === 'strong_match' ? 'good' : status === 'not_a_match' ? 'alert' : 'warn'}>{statusLabel[status] ?? pretty(status)}</Badge>}</div><SourceBadge verificationStatus={scheme.verificationStatus} publicationStatus={scheme.publicationStatus} sourceKind={scheme.sourceKind}/></Link>;
}
function ArrowUpRightIcon() { return <ArrowRight size={16} className="arrow-corner"/>; }
function SchemesPage() {
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const { isSignedIn } = useAuth();
  const { data: profile } = useGetProfile({ query: { queryKey: getGetProfileQueryKey(), enabled: Boolean(isSignedIn) } });
  const params = useMemo(() => ({ ...(search ? { search } : {}), ...(category ? { category } : {}) }), [search, category]);
  const list = useListSchemes(params); const recommend = useGetRecommendations();
  const doCompare = () => {
    if (!profile) return;
    recommend.mutate({ data: profile }, { onSuccess: (r) => setRecommendations(r) });
  };
  return <AppShell active="/schemes"><PageTitle eyebrow="SCHEME DISCOVERY" title="Find a place to begin." description="Compare your profile with stored scheme rules. A match is a useful prompt to verify—not a promise of eligibility." action={<button className="button button-primary" onClick={doCompare} disabled={!profile || recommend.isPending}><Sparkles size={16}/>{recommend.isPending ? 'Comparing…' : 'Compare with my profile'}</button>}/>
     {!isSignedIn ? <div className="notice-band compact"><CircleHelp size={17}/><p>Sign in to save a private profile and compare stored scheme rules. <Link href="/sign-in" className="inline-link">Sign in <ArrowRight size={13}/></Link> or <Link href="/sign-up" className="inline-link">create an account</Link>.</p></div> : !profile && <div className="notice-band compact"><CircleHelp size={17}/><p>Add your details before comparing. <Link href="/profile" className="inline-link">Set up your profile <ArrowRight size={13}/></Link></p></div>}
    {recommend.error && <div className="inline-warning">Could not compare your profile. Your details remain saved. <button onClick={doCompare}>Try again</button></div>}
    {recommendations && <section className="recommendation-box"><div className="section-heading"><div><div className="eyebrow">PROFILE COMPARISON</div><h2 className="serif">What the stored rules show</h2></div><button className="icon-button" aria-label="Close results" onClick={() => setRecommendations(null)}><X size={18}/></button></div><p className="quiet-note">These results reflect stored conditions only. Unknown conditions need a closer look; the issuing authority makes all final decisions.</p>{recommendations.length ? <div className="recommendation-list">{recommendations.map((r) => <RecommendationRow key={r.scheme.id} result={r}/>)}</div> : <EmptyPanel title="No comparison results" detail="There were no stored rules to compare against your profile."/>}</section>}
    <div className="filter-toolbar"><label className="search-field"><Search size={17}/><input aria-label="Search schemes" placeholder="Search schemes, support or category" value={search} onChange={(e) => setSearch(e.target.value)}/>{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15}/></button>}</label><label className="select-field"><Filter size={16}/><select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{[...new Set((list.data ?? []).map((s) => s.category))].map((c) => <option key={c}>{c}</option>)}</select><ChevronDown size={15}/></label></div>
    {list.isLoading ? <Loading/> : list.isError ? <ErrorPanel retry={() => void list.refetch()}/> : list.data?.length ? <div className="scheme-grid">{list.data.map((s) => <SchemeCard key={s.id} scheme={s}/>)}</div> : <EmptyPanel title="No stored schemes found" detail={search ? 'Try a broader search or remove the category filter.' : 'No published or demonstration scheme guidance is available right now.'} action={search || category ? <button className="button button-outline" onClick={() => { setSearch(''); setCategory(''); }}>Clear filters</button> : undefined}/>}
  </AppShell>;
}
function RecommendationRow({ result }: { result: Recommendation }) {
  const tone = result.status === 'strong_match' ? 'good' : result.status === 'not_a_match' ? 'alert' : 'warn';
  return <article className="recommendation-row"><div className="recommendation-status"><Badge tone={tone}>{statusLabel[result.status]}</Badge><span>{result.scheme.category}</span></div><div className="recommendation-main"><Link href={`/schemes/${result.scheme.id}`}><b>{result.scheme.name}</b><ArrowRight size={14}/></Link><p>{result.scheme.description}</p><div className="reason-pills">{result.matchedConditions.map((x) => <span className="reason matched" key={`m${x}`}><Check size={12}/>{x}</span>)}{result.failedConditions.map((x) => <span className="reason failed" key={`f${x}`}><X size={12}/>{x}</span>)}{result.unknownConditions.map((x) => <span className="reason unknown" key={`u${x}`}><CircleHelp size={12}/>{x}</span>)}</div></div><SourceBadge verificationStatus={result.scheme.verificationStatus} publicationStatus={result.scheme.publicationStatus} sourceKind={result.scheme.sourceKind}/></article>;
}
function SchemeDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { isSignedIn } = useAuth();
  const schemeQuery = useGetScheme(id, { query: { queryKey: getGetSchemeQueryKey(id), enabled: Boolean(id) } });
  const docs = useGetSchemeDocuments(id, { query: { queryKey: getGetSchemeDocumentsQueryKey(id), enabled: Boolean(id) } });
  const readiness = useGetSchemeReadiness(id, { query: { queryKey: getGetSchemeReadinessQueryKey(id), enabled: Boolean(id) && Boolean(isSignedIn) } });
  const checklist = useGetChecklist(id, { query: { queryKey: getGetChecklistQueryKey(id), enabled: Boolean(id) && Boolean(isSignedIn) } });
  const update = useUpdateChecklist(); const client = useQueryClient(); const scheme = schemeQuery.data;
  const updateStatus = (documentType: string, status: DocumentStatus) => {
    const source = checklist.data?.items ?? readiness.data?.items ?? [];
    const items = source.map((x) => ({ documentType: x.documentType, status: x.documentType === documentType ? status : x.status }));
    update.mutate({ schemeId: id, data: { items } }, { onSuccess: () => {
      void client.invalidateQueries({ queryKey: getGetChecklistQueryKey(id) });
      void client.invalidateQueries({ queryKey: getGetSchemeReadinessQueryKey(id) });
      void client.invalidateQueries({ queryKey: getGetPreparationDashboardQueryKey() });
    } });
  };
  if (schemeQuery.isLoading) return <AppShell active="/schemes"><Loading/></AppShell>;
  if (schemeQuery.isError || !scheme) return <AppShell active="/schemes"><ErrorPanel retry={() => void schemeQuery.refetch()} message="This scheme could not be loaded."/></AppShell>;
  return <AppShell active="/schemes"><Link href="/schemes" className="back-link"><ArrowLeft size={15}/> Back to schemes</Link><PageTitle eyebrow={scheme.category} title={scheme.name} description={scheme.description}/><SourceBadge verificationStatus={scheme.verificationStatus} publicationStatus={scheme.publicationStatus} sourceKind={scheme.sourceKind}/>
    <div className="detail-layout"><div className="detail-main">
      <section className="content-card"><div className="card-heading"><h2>Eligibility rules in storage</h2><span className="section-icon"><Landmark size={17}/></span></div><p className="quiet-note">These are stored scheme conditions—not an official eligibility decision.</p>{scheme.eligibilityRules.length ? <ul className="check-list">{scheme.eligibilityRules.map((r) => <li key={r}><span className="list-dot"/>{r}</li>)}</ul> : <p className="quiet-note">No eligibility rules are available in this record.</p>}
        {scheme.minimumAge != null || scheme.maximumAge != null || scheme.maximumAnnualIncome != null || scheme.state ? <div className="fact-grid">{scheme.minimumAge != null || scheme.maximumAge != null ? <div><small>Age range stored</small><b>{scheme.minimumAge ?? '—'} to {scheme.maximumAge ?? '—'}</b></div> : null}{scheme.maximumAnnualIncome != null ? <div><small>Income rule stored</small><b>Up to ₹{scheme.maximumAnnualIncome.toLocaleString('en-IN')}</b></div> : null}{scheme.state ? <div><small>Jurisdiction</small><b>{scheme.state}</b></div> : null}</div> : null}
      </section>
      <section className="content-card"><div className="card-heading"><h2>Benefits described</h2><span className="section-icon warm-icon"><HeartHandshake size={17}/></span></div>{scheme.benefits.length ? <ul className="check-list benefit-list">{scheme.benefits.map((b) => <li key={b}>{b}</li>)}</ul> : <p className="quiet-note">No benefit details are stored.</p>}</section>
      <section className="content-card"><div className="card-heading"><h2>Document preparation</h2><span className="section-icon"><ClipboardCheck size={17}/></span></div>{!isSignedIn ? docs.isLoading ? <Loading/> : docs.isError ? <ErrorPanel retry={() => void docs.refetch()}/> : docs.data?.length ? <><p className="quiet-note">Required documents from the stored record. Sign in to save a private checklist.</p><div className="document-check-list">{docs.data.map((doc) => <div className="document-check-row guest-document-row" key={doc.documentType}><div className="document-name"><FileText size={16}/><div><b>{doc.title}</b><small>{doc.reason}{doc.issuingAuthority ? ` · Issued by ${doc.issuingAuthority}` : ''}</small></div></div><Link href={`/guides?documentType=${encodeURIComponent(doc.documentType)}`} className="text-link">Guide <ArrowRight size={13}/></Link></div>)}</div><Link href="/sign-in" className="button button-outline">Sign in to track documents <ArrowRight size={14}/></Link></> : <EmptyPanel title="No required documents listed" detail="This scheme record does not include a document list yet."/> : readiness.isLoading ? <Loading/> : readiness.isError ? <ErrorPanel retry={() => void readiness.refetch()}/> : <><div className="readiness-line"><b>{readiness.data?.readyCount ?? 0} of {readiness.data?.totalCount ?? 0} marked ready</b><span>{readiness.data?.progressPercent ?? 0}%</span></div><div className="progress-track"><span style={{ width: `${readiness.data?.progressPercent ?? 0}%` }}/></div>{docs.isError && <div className="inline-warning">Required document details could not load. <button onClick={() => void docs.refetch()}>Retry</button></div>}{docs.isLoading ? <Loading/> : docs.data?.length ? <div className="document-check-list">{docs.data.map((doc) => { const item = checklist.data?.items.find((i) => i.documentType === doc.documentType) ?? readiness.data?.items.find((i) => i.documentType === doc.documentType); return <div className="document-check-row" key={doc.documentType}><div className="document-name"><FileText size={16}/><div><b>{doc.title}</b><small>{doc.reason}{doc.issuingAuthority ? ` · Issued by ${doc.issuingAuthority}` : ''}</small></div></div><select value={item?.status ?? 'unknown'} aria-label={`Status for ${doc.title}`} onChange={(e) => updateStatus(doc.documentType, e.target.value as DocumentStatus)} disabled={update.isPending}><option value="unknown">Not yet marked</option><option value="available">Have this</option><option value="missing">Need to get</option><option value="needs_verification">Check details</option></select><Link href={`/guides?documentType=${encodeURIComponent(doc.documentType)}`} className="text-link">Guide <ArrowRight size={13}/></Link></div>; })}</div> : <EmptyPanel title="No required documents listed" detail="This scheme record does not include a document list yet."/>}</>}</section>
    </div><aside className="detail-aside"><div className="aside-card"><div className="eyebrow">WHO THIS IS FOR</div><p>{scheme.targetBeneficiaries || 'No audience description stored.'}</p>{scheme.occupations.length > 0 && <div className="tag-row">{scheme.occupations.map((o) => <Badge key={o}>{o}</Badge>)}</div>}</div><div className="aside-card"><div className="eyebrow">HOW TO APPLY</div><p>{scheme.applicationInstructions || 'Application instructions are not included in this stored record.'}</p></div><div className="source-card"><div className="source-card-icon"><ExternalLink size={16}/></div><b>Verify with the official source</b><p>Check current rules, required documents, fees and deadlines with the issuing authority.</p>{scheme.officialSourceUrl ? <a href={scheme.officialSourceUrl} target="_blank" rel="noreferrer" className="button button-outline">Open official source <ExternalLink size={14}/></a> : <small>No official source link is stored in this record.</small>}{scheme.lastVerifiedAt && <small>Last marked verified {new Date(scheme.lastVerifiedAt).toLocaleDateString('en-IN')}</small>}</div></aside></div>
    {update.isError && <div className="toast-inline" role="alert">Could not save that document status. Your previous checklist remains. Try changing it again.</div>}
  </AppShell>;
}
function ProfilePage() {
  const query = useGetProfile(); const save = useSaveProfile(); const client = useQueryClient();
  const [form, setForm] = useState<CitizenProfileInput>({});
  const [dirty, setDirty] = useState(false); const [notice, setNotice] = useState('');
  const initialized = useRef(false);
  useEffect(() => { if (query.data && !initialized.current) { setForm({ ...query.data }); initialized.current = true; } }, [query.data]);
  const change = (key: keyof CitizenProfileInput, value: string | boolean) => {
    setDirty(true); setNotice('');
    setForm((prev) => ({ ...prev, [key]: value === '' ? null : typeof value === 'boolean' ? value : ['age', 'currentYear', 'annualFamilyIncome'].includes(key) ? Number(value) : value }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault(); save.mutate({ data: form }, { onSuccess: () => {
      setDirty(false); setNotice('Your profile has been saved privately.');
      void client.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    } });
  };
  const textField = (label: string, key: keyof CitizenProfileInput, type = 'text', hint?: string) => <label className="form-field"><span>{label}</span><input type={type} value={String(form[key] ?? '')} onChange={(e) => change(key, e.target.value)} placeholder={hint}/></label>;
  const selectField = (label: string, key: keyof CitizenProfileInput, options: string[]) => {
    const availableOptions = key === 'state' ? indiaStatesAndTerritories : options;
    return <label className="form-field"><span>{label}</span><select value={String(form[key] ?? '')} onChange={(e) => change(key, e.target.value)}><option value="">Choose if relevant</option>{availableOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>;
  };
  if (query.isLoading) return <AppShell active="/profile"><Loading/></AppShell>;
  return <AppShell active="/profile"><PageTitle eyebrow="PRIVATE PROFILE" title="A little context goes a long way." description="Only details used to compare against stored scheme rules. Leave anything blank if you are unsure."/>
    {query.isError && <div className="inline-warning">Could not load your saved profile. You can still edit and save these fields. <button onClick={() => void query.refetch()}>Retry</button></div>}
    <form className="profile-form content-card" onSubmit={submit} onChange={() => { if (!dirty) setDirty(true); }}>
      <div className="form-section-head"><span className="section-icon"><UserRound size={17}/></span><div><h2>About you</h2><p>Basic information that may appear in scheme conditions.</p></div></div>
      <div className="form-grid">{textField('Age', 'age', 'number', 'Years')}{selectField('State / Union Territory', 'state', ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'])}{textField('District', 'district', 'text', 'Your district')}{selectField('Occupation', 'occupation', ['Student','Farmer','Business owner','Salaried employment','Self-employed','Unemployed','Other'])}{selectField('Education level', 'educationLevel', ['No formal education','Primary','Secondary','Higher secondary','Diploma','Undergraduate','Postgraduate','Other'])}{textField('Course or field of study', 'course', 'text', 'If relevant')}{textField('Current year of study', 'currentYear', 'number', 'If relevant')}{textField('Annual family income (₹)', 'annualFamilyIncome', 'number', 'Approximate, if known')}</div>
      <div className="form-section-head space-top"><span className="section-icon warm-icon"><BriefcaseBusiness size={17}/></span><div><h2>Relevant circumstances</h2><p>Choose only the items that apply to you.</p></div></div>
      <div className="toggle-grid">{([{ key: 'student', label: 'I am currently studying', icon: GraduationCap }, { key: 'farmer', label: 'I am a farmer', icon: Leaf }, { key: 'businessOwner', label: 'I own a business', icon: BriefcaseBusiness }] as const).map(({ key, label, icon: Icon }) => <label className={`check-toggle ${form[key] ? 'toggle-on' : ''}`} key={key}><input type="checkbox" checked={Boolean(form[key])} onChange={(e) => change(key, e.target.checked)}/><span className="fake-check">{form[key] && <Check size={13}/>}</span><Icon size={17}/>{label}</label>)}</div>
      <div className="form-grid form-grid-small">{selectField('Employment status', 'employmentStatus', ['Employed','Self-employed','Unemployed','Seeking work','Not applicable'])}{selectField('Social category', 'socialCategory', ['General','Scheduled Caste (SC)','Scheduled Tribe (ST)','Other Backward Class (OBC)','Other / prefer not to say'])}</div>
      <div className="form-submit-row"><div className="form-feedback">{notice && <span className="success-message"><CheckCircle2 size={15}/>{notice}</span>}{save.isError && <span className="error-message">Save failed. Your edits are still here; please try again.</span>}{dirty && !notice && <span>Unsaved changes</span>}</div><button className="button button-primary" type="submit" disabled={save.isPending}><Check size={16}/>{save.isPending ? 'Saving…' : 'Save my profile'}</button></div>
    </form><div className="privacy-note"><LockKeyhole size={16}/><span><b>Your profile is private.</b> These details are used for your comparisons and are not shown to other citizens.</span></div>
  </AppShell>;
}

function PreparationPage() {
  const dashboard = useGetPreparationDashboard(); const schemes = useListSchemes(); const update = useUpdateChecklist(); const client = useQueryClient();
  const [filter, setFilter] = useState('all');
  const list = dashboard.data?.items ?? [];
  const filtered = list.filter((x) => filter === 'all' || x.status === filter);
  const updateStatus = (documentType: string, status: DocumentStatus, relatedSchemes: string[]) => {
    const schemeId = schemes.data?.find((scheme) => relatedSchemes.includes(scheme.name))?.id ?? schemes.data?.[0]?.id;
    if (!schemeId) return;
    update.mutate({ schemeId, data: { items: [{ documentType, status }] } }, { onSuccess: () => {
      void client.invalidateQueries({ queryKey: getGetPreparationDashboardQueryKey() });
      void client.invalidateQueries({ queryKey: getGetChecklistQueryKey(schemeId) });
      void client.invalidateQueries({ queryKey: getGetSchemeReadinessQueryKey(schemeId) });
    } });
  };
  return <AppShell active="/preparation"><PageTitle eyebrow="MY DOCUMENT PREPARATION" title="Get the paperwork in order." description="Your document checklist is private. Status is saved by canonical document type and can carry across relevant schemes." action={<Link href="/guides" className="button button-outline"><BookOpen size={16}/> Find a document guide</Link>}/>
    <div className="prep-summary"><div className="prep-progress"><div className="prep-progress-ring"><strong>{dashboard.data?.progressPercent ?? 0}%</strong></div><div><div className="eyebrow">YOUR PREPARATION</div><h2 className="serif">{dashboard.data?.readyCount ?? 0} ready <span>of {dashboard.data?.totalCount ?? 0}</span></h2><p>Mark what you have. For anything unclear, check the relevant guide and official source.</p></div></div><div className="prep-counts"><div><b>{dashboard.data?.readyCount ?? 0}</b><small>Ready</small></div><div><b>{dashboard.data?.missingCount ?? 0}</b><small>To prepare</small></div><div><b>{dashboard.data?.unknownCount ?? 0}</b><small>Unconfirmed</small></div></div></div>
    {dashboard.isError && <ErrorPanel retry={() => void dashboard.refetch()} message="Your private preparation list could not be loaded."/>}
    <div className="filter-tabs" role="group" aria-label="Filter checklist">{[['all','All documents'],['available','Ready'],['missing','To prepare'],['unknown','Not confirmed'],['needs_verification','Check details']].map(([key, label]) => <button key={key} className={filter === key ? 'tab-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div>
    {dashboard.isLoading ? <Loading/> : filtered.length ? <div className="prep-list">{filtered.map((item) => <div className="prep-item" key={item.documentType}><div className={`prep-item-icon ${item.status === 'available' ? 'ready-icon' : ''}`}>{item.status === 'available' ? <Check size={19}/> : <FileText size={19}/>}</div><div className="prep-item-info"><b>{item.title}</b><small>{item.relatedSchemes.length ? `Relevant to ${item.relatedSchemes.join(', ')}` : 'No related scheme listed'}</small></div><select aria-label={`Status for ${item.title}`} value={item.status} disabled={update.isPending || schemes.isLoading || !schemes.data?.length} onChange={(e) => updateStatus(item.documentType, e.target.value as DocumentStatus, item.relatedSchemes)}><option value="unknown">Not confirmed</option><option value="available">Have this</option><option value="missing">Need to get</option><option value="needs_verification">Check details</option></select><Link href={`/guides?documentType=${encodeURIComponent(item.documentType)}`} className="text-link">How to get it <ArrowRight size={13}/></Link></div>)}</div> : <EmptyPanel title={filter === 'all' ? 'Your checklist is clear for now' : 'No documents in this group'} detail={filter === 'all' ? 'Document requirements appear here when stored scheme rules list them.' : 'Choose another filter to see the rest of your checklist.'} action={<Link href="/schemes" className="button button-outline">Browse scheme rules <ArrowRight size={14}/></Link>}/>}
    {update.isError && <div className="toast-inline">Could not save that change. Your previous document status is still in place. Please try again.</div>}
    <div className="small-print"><ShieldCheck size={16}/> A checklist helps with preparation; it does not confirm your application is complete.</div>
  </AppShell>;
}
function GuideBrowserPage() {
  const { user } = useUser(); const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('documentType') ?? ''); const [state, setState] = useState(''); const [allStates, setAllStates] = useState(false);
  const profile = useGetProfile({ query: { queryKey: getGetProfileQueryKey(), enabled: Boolean(user) } });
  const effectiveState = allStates ? '' : state || profile.data?.state || '';
  const params = useMemo(() => effectiveState ? { state: effectiveState } : {}, [effectiveState]);
  const list = useListDocumentGuides(params);
  const normalizedSearch = search.trim().toLocaleLowerCase('en-IN').replace(/[\s-]+/g, '_');
  const guides = (list.data ?? []).filter((guide) => !search || guide.documentType.toLocaleLowerCase('en-IN').includes(normalizedSearch) || guide.title.toLocaleLowerCase('en-IN').includes(search.trim().toLocaleLowerCase('en-IN')));
  return <AppShell active="/guides"><PageTitle eyebrow="DOCUMENT GUIDES" title="A guide for the document you need." description="Guides are specific to an issuing jurisdiction. Check each guide’s status and open official sources before you apply."/>
    <div className="guide-search-row"><label className="search-field"><Search size={17}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Document type, e.g. income certificate" aria-label="Search document guides"/>{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={15}/></button>}</label><label className="select-field"><MapPin size={16}/><input value={allStates ? '' : state || profile.data?.state || ''} onChange={(e) => { setAllStates(false); setState(e.target.value); }} placeholder={allStates ? 'All jurisdictions' : 'State or jurisdiction'} aria-label="Filter by state"/><ChevronDown size={15}/></label>{(effectiveState || (allStates && profile.data?.state)) && <button className="button button-quiet" onClick={() => { const next = !allStates; setAllStates(next); setState(''); }}>{allStates ? 'Use my saved state' : 'Show all states'}</button>}</div>
    {list.isLoading ? <Loading/> : list.isError ? <ErrorPanel retry={() => void list.refetch()}/> : guides.length ? <div className="guide-grid">{guides.map((guide) => <GuideCard guide={guide} key={guide.id}/>)}</div> : <EmptyPanel title="No matching document guides" detail="Try a broader document name or another jurisdiction. A guide may not yet be stored for your state." action={search || state ? <button className="button button-outline" onClick={() => { setSearch(''); setState(''); setAllStates(true); }}>Clear search</button> : undefined}/>}
    <div className="small-print"><ShieldAlert size={16}/> Fees and processing times are shown only when included in the stored guide. Always confirm them at the official source.</div>
  </AppShell>;
}
function GuideCard({ guide }: { guide: DocumentGuide }) {
  return <Link href={`/guides/${guide.id}`} className="guide-card"><div className="guide-card-head"><span className="guide-glyph"><FileText size={19}/></span><span className="guide-jurisdiction"><MapPin size={12}/>{guide.applicableState}</span></div><h3>{guide.title}</h3><p>{guide.simpleDescription}</p><div className="guide-issuer">{guide.issuingAuthority || 'Issuing authority not listed'}</div><SourceBadge verificationStatus={guide.verificationStatus} publicationStatus={guide.publicationStatus}/><span className="guide-open">Read guide <ArrowRight size={14}/></span></Link>;
}
function GuideDetailPage() {
  const { id = '' } = useParams<{ id: string }>(); const guideQuery = useGetDocumentGuide(id, { query: { queryKey: getGetDocumentGuideQueryKey(id), enabled: Boolean(id) } }); const guide = guideQuery.data;
  if (guideQuery.isLoading) return <AppShell active="/guides"><Loading/></AppShell>;
  if (guideQuery.isError || !guide) return <AppShell active="/guides"><ErrorPanel retry={() => void guideQuery.refetch()} message="This document guide could not be loaded."/></AppShell>;
  return <AppShell active="/guides"><Link href="/guides" className="back-link"><ArrowLeft size={15}/> Back to document guides</Link><PageTitle eyebrow={`${guide.documentType} · ${guide.applicableState}`} title={guide.title} description={guide.simpleDescription}/><SourceBadge verificationStatus={guide.verificationStatus} publicationStatus={guide.publicationStatus}/>
    <div className="detail-layout guide-detail-layout"><div className="detail-main">
      <section className="content-card"><div className="card-heading"><h2>Before you begin</h2><span className="section-icon"><CircleHelp size={17}/></span></div><p className="quiet-note">Requirements can vary by jurisdiction. Verify current details with the issuing authority.</p>{guide.eligibilityOrPrerequisites.length ? <ul className="check-list">{guide.eligibilityOrPrerequisites.map((x) => <li key={x}><span className="list-dot"/>{x}</li>)}</ul> : <p className="quiet-note">No prerequisites are listed in this guide.</p>}</section>
      <section className="content-card"><div className="card-heading"><h2>Supporting documents</h2><span className="section-icon warm-icon"><FileCheck2 size={17}/></span></div>{guide.requiredSupportingDocuments.length ? <ul className="check-list">{guide.requiredSupportingDocuments.map((x) => <li key={x}><FileText size={15}/>{x}</li>)}</ul> : <p className="quiet-note">No supporting documents are listed.</p>}</section>
       {(guide.verificationStatus !== 'verified' || guide.applicationSteps.length === 0) && <div className="inline-warning guide-warning" role="status"><ShieldAlert size={17}/><div><b>Instructions have not been verified</b><p>Detailed instructions have not yet been verified. Please consult the issuing authority through the official information link.{guide.officialInformationUrl ? <> <a href={guide.officialInformationUrl} target="_blank" rel="noreferrer">Open the stored information link <ExternalLink size={12}/></a></> : ' No official information link is currently stored; contact the issuing authority directly.'}</p></div></div>}
       <section className="content-card"><div className="card-heading"><h2>Steps in this guide</h2><span className="section-icon"><ArrowRight size={17}/></span></div>{guide.applicationSteps.length ? <ol className="steps-list">{guide.applicationSteps.map((x, i) => <li key={`${i}-${x}`}><span>{String(i + 1).padStart(2, '0')}</span><p>{x}</p></li>)}</ol> : <p className="quiet-note">No application steps are stored.</p>}<div className="method-callout"><b>Application method</b><p>{guide.applicationMethod || 'Not specified'}</p></div></section>
      {guide.additionalNotes && <section className="content-card"><div className="card-heading"><h2>Additional notes</h2></div><p>{guide.additionalNotes}</p></section>}
    </div><aside className="detail-aside"><div className="aside-card"><div className="eyebrow">JURISDICTION & ISSUER</div><h3>{guide.applicableState}</h3><p>{guide.issuingAuthority || 'Issuing authority not listed'}</p></div>{guide.possibleFees || guide.expectedProcessingTime ? <div className="aside-card"><div className="eyebrow">STORED TIMING & FEES</div>{guide.possibleFees && <p><b>Possible fees:</b> {guide.possibleFees}</p>}{guide.expectedProcessingTime && <p><b>Processing time:</b> {guide.expectedProcessingTime}</p>}<small>Only as described in this stored record; please verify.</small></div> : null}<div className="source-card"><div className="source-card-icon"><ExternalLink size={16}/></div><b>Check the official guidance</b><p>Follow links to confirm current requirements, fees and application steps.</p>{guide.officialApplicationUrl && <a href={guide.officialApplicationUrl} target="_blank" rel="noreferrer" className="button button-primary">Application portal <ExternalLink size={14}/></a>}{guide.officialInformationUrl && <a href={guide.officialInformationUrl} target="_blank" rel="noreferrer" className="button button-outline">Official information <ExternalLink size={14}/></a>}{guide.lastVerifiedAt && <small>Last marked verified {new Date(guide.lastVerifiedAt).toLocaleDateString('en-IN')}</small>}</div></aside></div>
  </AppShell>;
}
function AssistantPage() {
  const explain = useExplainGuidance(); const [question, setQuestion] = useState(''); const [schemeId, setSchemeId] = useState(''); const [documentType, setDocumentType] = useState(''); const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null); const schemes = useListSchemes();
  const ask = (e: FormEvent) => { e.preventDefault(); if (!question.trim()) return; explain.mutate({ data: { question: question.trim(), schemeId: schemeId || null, documentType: documentType || null, language } }, { onSuccess: (result) => setAnswer(result) }); };
  const examples = ['What does “more information needed” mean?', 'Which documents does this scheme list?', 'Where should I verify the current requirements?'];
  return <AppShell active="/assistant"><PageTitle eyebrow="GROUNDED ASSISTANCE" title="A question, answered carefully." description="Ask about information stored in JanSahay. The assistant does not make up eligibility, fees, deadlines or official decisions."/>
    <div className="assistant-layout"><section className="assistant-panel"><div className="assistant-intro"><div className="assistant-orb"><MessageCircle size={24}/></div><div><div className="eyebrow">JANSAHAY ASSISTANT</div><h2 className="serif">Let’s look at what’s on record.</h2><p>Answers are grounded in stored scheme and document guidance, with source links when available.</p></div></div>
      {!answer && !explain.isPending && <div className="example-questions"><span>Try asking</span>{examples.map((x) => <button key={x} onClick={() => setQuestion(x)}>{x}<ArrowRight size={13}/></button>)}</div>}
      {explain.isPending && <div className="answer-card" role="status"><Loading label="Preparing an answer from stored guidance…"/></div>}
      {explain.isError && <div className="inline-warning">The answer could not be prepared. Your question is still here; you can try again.</div>}
      {answer && <div className="answer-card"><div className="answer-head"><span><Sparkles size={15}/> STORED GUIDANCE RESPONSE</span><button className="icon-button" onClick={() => setAnswer(null)} aria-label="Dismiss answer"><X size={17}/></button></div><p>{answer.answer}</p><div className="answer-label"><Badge tone="demo">{pretty(answer.mode)}</Badge>{answer.needsVerification && <Badge tone="warn">Please verify before acting</Badge>}</div>{answer.sources.length > 0 && <div className="answer-sources"><b>Sources in this answer</b>{answer.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.title}<ExternalLink size={13}/></a>)}</div>}</div>}
      <form className="question-form" onSubmit={ask}><label htmlFor="assistant-question">Your question</label><textarea id="assistant-question" data-testid="input-assistant-question" value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={1000} placeholder="Ask about stored scheme rules or a document guide…" required/><div className="question-controls"><div className="assistant-options"><label><span className="sr-only">Response language</span><select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}><option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option></select></label><label><span className="sr-only">Related scheme</span><select value={schemeId} onChange={(e) => setSchemeId(e.target.value)}><option value="">No specific scheme</option>{(schemes.data ?? []).map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label><label><span className="sr-only">Document type</span><input value={documentType} onChange={(e) => setDocumentType(e.target.value)} placeholder="Document type (optional)"/></label></div><button className="button button-primary" type="submit" disabled={explain.isPending || !question.trim()}>{explain.isPending ? 'Looking…' : 'Ask JanSahay'} <ArrowRight size={15}/></button></div></form>
    </section><aside className="assistant-caution"><span className="caution-icon"><ShieldAlert size={18}/></span><h3>Careful by design.</h3><p>JanSahay explains what is stored. It cannot tell you whether an authority will approve an application.</p><ul><li>Use source links to confirm current requirements.</li><li>Unknown information stays unknown.</li><li>Ask the issuing office about case-specific questions.</li></ul><Link href="/guides" className="text-link">Browse stored guides <ArrowRight size={14}/></Link></aside></div>
  </AppShell>;
}
const emptyGuide: DocumentGuideInput = {
  documentType: '', title: '', simpleDescription: '', applicableState: '', issuingAuthority: null,
  eligibilityOrPrerequisites: [], requiredSupportingDocuments: [], applicationSteps: [],
  applicationMethod: '', officialApplicationUrl: null, officialInformationUrl: null,
  additionalNotes: '',
};
function splitLines(value: string) { return value.split('\n').map((x) => x.trim()).filter(Boolean); }
function AdminGuidesPage() {
  const list = useListAdminDocumentGuides(); const create = useCreateDocumentGuide(); const update = useUpdateDocumentGuide();
  const verify = useVerifyDocumentGuide(); const publish = usePublishDocumentGuide(); const archive = useArchiveDocumentGuide();
  const [selectedId, setSelectedId] = useState(''); const [form, setForm] = useState<DocumentGuideInput>(emptyGuide); const [isNew, setIsNew] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(''); const [verifiedAt, setVerifiedAt] = useState(new Date().toISOString().slice(0, 10)); const [feedback, setFeedback] = useState('');
  const client = useQueryClient(); const selected = list.data?.find((g) => g.id === selectedId);
  const references = useGetGuideReferences(selectedId || 'unselected', { query: { queryKey: getGetGuideReferencesQueryKey(selectedId || 'unselected'), enabled: Boolean(selectedId && !isNew) } });
  useEffect(() => {
    if (selected && !isNew) {
      setForm({ documentType: selected.documentType, title: selected.title, simpleDescription: selected.simpleDescription, applicableState: selected.applicableState, issuingAuthority: selected.issuingAuthority ?? null, eligibilityOrPrerequisites: selected.eligibilityOrPrerequisites, requiredSupportingDocuments: selected.requiredSupportingDocuments, applicationSteps: selected.applicationSteps, applicationMethod: selected.applicationMethod, officialApplicationUrl: selected.officialApplicationUrl, officialInformationUrl: selected.officialInformationUrl, possibleFees: selected.possibleFees ?? null, expectedProcessingTime: selected.expectedProcessingTime ?? null, additionalNotes: selected.additionalNotes });
      setSourceUrl(selected.officialInformationUrl || selected.officialApplicationUrl || '');
    }
  }, [selected, isNew]);
  const invalidateAdmin = (id?: string) => {
    void client.invalidateQueries({ queryKey: getListAdminDocumentGuidesQueryKey() });
    void client.invalidateQueries({ queryKey: getListDocumentGuidesQueryKey() });
    if (id) { void client.invalidateQueries({ queryKey: getGetDocumentGuideQueryKey(id) }); void client.invalidateQueries({ queryKey: getGetGuideReferencesQueryKey(id) }); }
  };
  const setField = (key: keyof DocumentGuideInput, value: string) => setForm((f) => ({ ...f, [key]: ['eligibilityOrPrerequisites','requiredSupportingDocuments','applicationSteps'].includes(key) ? splitLines(value) : value === '' && ['issuingAuthority','officialApplicationUrl','officialInformationUrl','possibleFees','expectedProcessingTime'].includes(key) ? null : value }));
  const displayField = (key: keyof DocumentGuideInput) => {
    const value = form[key];
    return Array.isArray(value) ? value.join('\n') : value ?? '';
  };
  const formField = (label: string, key: keyof DocumentGuideInput, multiline = false) => <label className="form-field"><span>{label}</span>{multiline ? <textarea value={displayField(key)} onChange={(e) => setField(key, e.target.value)} rows={key === 'applicationSteps' ? 5 : 3} placeholder="One item per line"/> : <input value={displayField(key)} onChange={(e) => setField(key, e.target.value)} required={key === 'title' || key === 'documentType' || key === 'applicableState'}/>}</label>;
  const selectGuide = (id: string) => { setIsNew(false); setSelectedId(id); setFeedback(''); };
  const startNew = () => { setIsNew(true); setSelectedId(''); setForm({ ...emptyGuide }); setFeedback(''); setSourceUrl(''); };
  const saveGuide = (e: FormEvent) => {
    e.preventDefault(); setFeedback('');
    if (isNew) create.mutate({ data: form }, { onSuccess: (guide) => { setSelectedId(guide.id); setIsNew(false); invalidateAdmin(guide.id); setFeedback('Draft guide created. Review it before publication.'); }, onError: () => setFeedback('Could not create the guide. Your edits remain in the form.') });
    else if (selectedId) update.mutate({ guideId: selectedId, data: form as DocumentGuideUpdate }, { onSuccess: () => { invalidateAdmin(selectedId); setFeedback('Guide updates saved.'); }, onError: () => setFeedback('Could not save changes. Your edits remain in the form.') });
  };
  const verifyGuide = () => {
    if (!selectedId || !sourceUrl.trim() || !verifiedAt) { setFeedback('Add the official source URL and date of review before marking verified.'); return; }
    verify.mutate({ guideId: selectedId, data: { officialSourceUrl: sourceUrl, lastVerifiedAt: new Date(`${verifiedAt}T12:00:00`).toISOString() } }, { onSuccess: () => { invalidateAdmin(selectedId); setFeedback('Verification record saved. Confirm the source yourself before publication.'); }, onError: () => setFeedback('Verification could not be saved. The guide has not been marked verified.') });
  };
  const publishGuide = () => { if (!selectedId) return; publish.mutate({ guideId: selectedId }, { onSuccess: () => { invalidateAdmin(selectedId); setFeedback('Publication status updated.'); }, onError: () => setFeedback('Could not publish this guide. Review its verification status and required fields.') }); };
  const archiveGuide = () => { if (!selectedId || !window.confirm('Archive this document guide? It will no longer appear as published guidance.')) return; archive.mutate({ guideId: selectedId }, { onSuccess: () => { invalidateAdmin(selectedId); setFeedback('Guide archived.'); }, onError: () => setFeedback('Could not archive this guide. Please try again.') }); };
  const busy = create.isPending || update.isPending || verify.isPending || publish.isPending || archive.isPending;
  return <AppShell active="/admin/guides"><PageTitle eyebrow="ADMINISTRATION · GUIDE LIBRARY" title="Keep document guidance accountable." description="Create and revise stored guides, review their references, and change publication status only when the record is ready." action={<button className="button button-primary" onClick={startNew}><FileText size={16}/> New guide</button>}/>
    <div className="admin-layout"><aside className="admin-list"><div className="admin-list-heading"><b>Stored guides</b><span>{list.data?.length ?? 0}</span></div>{list.isLoading ? <Loading/> : list.isError ? <ErrorPanel retry={() => void list.refetch()}/> : list.data?.length ? list.data.map((g) => <button className={`admin-guide-choice ${selectedId === g.id && !isNew ? 'admin-guide-selected' : ''}`} key={g.id} onClick={() => selectGuide(g.id)}><b>{g.title}</b><small>{g.applicableState} · {g.documentType}</small><SourceBadge verificationStatus={g.verificationStatus} publicationStatus={g.publicationStatus}/></button>) : <EmptyPanel title="No guides stored" detail="Create a draft when you have reviewed source material."/>}</aside>
      <section className="admin-editor">{!selected && !isNew ? <EmptyPanel title="Choose a guide to review" detail="Select a stored guide, or start a new draft. Existing content remains unchanged until you save." action={<button className="button button-primary" onClick={startNew}>Create a guide</button>}/> : <><div className="admin-editor-head"><div><div className="eyebrow">{isNew ? 'NEW RECORD' : 'GUIDE REVIEW'}</div><h2 className="serif">{isNew ? 'Prepare a draft' : selected?.title}</h2></div>{selected && <SourceBadge verificationStatus={selected.verificationStatus} publicationStatus={selected.publicationStatus}/>}</div>
        <form className="admin-form" onSubmit={saveGuide}><div className="form-grid">{formField('Canonical document type', 'documentType')}{formField('Guide title', 'title')}{formField('Applicable state / jurisdiction', 'applicableState')}{formField('Issuing authority', 'issuingAuthority')}{formField('Short description', 'simpleDescription', true)}{formField('Application method', 'applicationMethod', true)}{formField('Prerequisites — one per line', 'eligibilityOrPrerequisites', true)}{formField('Supporting documents — one per line', 'requiredSupportingDocuments', true)}{formField('Application steps — one per line', 'applicationSteps', true)}{formField('Official application URL', 'officialApplicationUrl')}{formField('Official information URL', 'officialInformationUrl')}{formField('Possible fees (only if verified)', 'possibleFees')}{formField('Expected processing time (only if verified)', 'expectedProcessingTime')}{formField('Additional notes', 'additionalNotes', true)}</div><div className="admin-save-bar">{feedback && <span className={feedback.includes('Could not') ? 'error-message' : 'success-message'}>{feedback}</span>}<button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : isNew ? 'Create draft' : 'Save guide'}</button></div></form>
        {selected && <div className="admin-workflow"><section className="admin-workflow-card"><div className="card-heading"><h3>Source review</h3><ShieldCheck size={16}/></div><p>Only mark verified after a real review against the official source.</p><div className="verify-fields"><label className="form-field"><span>Reviewed official URL</span><input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…"/></label><label className="form-field"><span>Date reviewed</span><input type="date" value={verifiedAt} onChange={(e) => setVerifiedAt(e.target.value)}/></label></div><button className="button button-outline" onClick={verifyGuide} disabled={busy || !sourceUrl.trim()}><BadgeCheck size={15}/> Mark reviewed</button></section>
        <section className="admin-workflow-card"><div className="card-heading"><h3>Publication</h3><ExternalLink size={16}/></div><p>Published guides are visible in the citizen document library. Verify details first.</p><div className="workflow-buttons"><button className="button button-primary" onClick={publishGuide} disabled={busy || selected.verificationStatus !== 'verified'}><CheckCircle2 size={15}/> Publish guide</button><button className="button button-danger-outline" onClick={archiveGuide} disabled={busy}>Archive</button></div>{selected.verificationStatus !== 'verified' && <small>Mark reviewed before publishing.</small>}</section></div>}
         {selected && <section className="references-panel"><div className="card-heading"><h3>Scheme references</h3><span className="reference-count">{references.data?.length ?? 0}</span></div>{references.isLoading ? <Loading/> : references.isError ? <ErrorPanel retry={() => void references.refetch()}/> : references.data?.length ? <div className="reference-list">{references.data.map((ref) => <div key={ref.id}><Landmark size={14}/><span><b>{ref.name}</b><small>{ref.category}{ref.state ? ` · ${ref.state}` : ''}</small><SourceBadge verificationStatus={ref.verificationStatus} publicationStatus={ref.publicationStatus} sourceKind={ref.sourceKind}/></span><Link href={`/schemes/${ref.id}`} className="text-link">View<ArrowRight size={12}/></Link></div>)}</div> : <p className="quiet-note">No scheme references were returned for this guide’s document type.</p>}</section>}
      </>}</section>
    </div>
  </AppShell>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk(); const client = useQueryClient(); const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) client.clear();
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);
  return null;
}
function RouterContents() {
  const [, setLocation] = useLocation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance}
    signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`}
    localization={{ signIn: { start: { title: 'Welcome back', subtitle: 'Return to your private guidance desk' } }, signUp: { start: { title: 'Make a thoughtful start', subtitle: 'Create your private JanSahay account' } } }}
    routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to), { replace: true })}>
    <QueryClientProvider client={queryClient}><ClerkQueryClientCacheInvalidator/><TooltipProvider><Switch>
      <Route path="/" component={HomeRedirect}/>
      <Route path="/sign-in/*?" component={() => <AuthScreens mode="in"/>}/>
      <Route path="/sign-up/*?" component={() => <AuthScreens mode="up"/>}/>
      <Route path="/dashboard">{() => <Guard><Dashboard/></Guard>}</Route>
      <Route path="/profile">{() => <Guard><ProfilePage/></Guard>}</Route>
      <Route path="/schemes" component={SchemesPage}/>
      <Route path="/schemes/:id" component={SchemeDetailPage}/>
      <Route path="/preparation">{() => <Guard><PreparationPage/></Guard>}</Route>
      <Route path="/guides" component={GuideBrowserPage}/>
      <Route path="/guides/:id" component={GuideDetailPage}/>
      <Route path="/assistant">{() => <Guard><AssistantPage/></Guard>}</Route>
      <Route path="/admin/guides">{() => <AdminRoute/>}</Route>
      <Route component={NotFound}/>
    </Switch><Toaster/></TooltipProvider></QueryClientProvider>
  </ClerkProvider>;
}
function AdminRoute() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return <div className="auth-loading"><div className="skeleton-block w-12 h-12 rounded-2xl"/></div>;
  if (user?.publicMetadata?.role !== 'admin' && !(user?.id && clientAdminUserIds.has(user.id))) return <AppShell><div className="empty-panel"><ShieldAlert size={24}/><strong>This area is for administrators.</strong><p>Your account does not have the guide-management role.</p><Link href="/dashboard" className="button button-outline">Return to your workspace</Link></div></AppShell>;
  return <AdminGuidesPage/>;
}
function App() {
  return <WouterRouter base={basePath}><RouterContents/></WouterRouter>;
}
export default App;
