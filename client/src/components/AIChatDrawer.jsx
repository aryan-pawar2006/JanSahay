import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, User, Sparkles, CheckCircle,
  ExternalLink, Zap, Globe, AlertCircle, RotateCcw, Trash2
} from 'lucide-react';
import { aiService } from '../services/api';

// Safe URL validator: strictly permits only http:// and https://
function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Safe React Markdown Renderer (Zero XSS vulnerability, no dangerouslySetInnerHTML)
function SafeMarkdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  // Helper to parse bold **text** and links [label](url) into React elements
  const parseInline = (line) => {
    const parts = [];
    // Regex for bold **...** and markdown links [...](...)
    const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
        const splitIdx = token.indexOf('](');
        const label = token.substring(1, splitIdx);
        const rawUrl = token.substring(splitIdx + 2, token.length - 1);
        if (isSafeUrl(rawUrl)) {
          parts.push(
            <a
              key={match.index}
              href={rawUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#1e3a8a', fontWeight: 700, textDecoration: 'underline' }}>
              {label} ↗
            </a>
          );
        } else {
          parts.push(label);
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return parts.length > 0 ? parts : line;
  };

  return (
    <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: '0.35rem' }} />;
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} style={{ marginLeft: line.startsWith('  ') ? '1.25rem' : '0.5rem', marginBottom: '0.2rem', display: 'flex', gap: '0.35rem' }}>
              <span>•</span>
              <div>{parseInline(trimmed.substring(2))}</div>
            </div>
          );
        }
        return (
          <div key={idx} style={{ marginBottom: '0.2rem' }}>
            {parseInline(line)}
          </div>
        );
      })}
    </div>
  );
}

export const AIChatDrawer = ({ currentScheme = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('COMMON');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `**नमस्ते! Welcome to JanSahay AI Assistant!** 🙏\n\nI provide verified step-by-step solutions for **40+ government welfare schemes**, document readiness, and every small or big problem you might face.\n\nTap any topic chip below or type your question in English, Hindi, or Marathi!`,
      provider: 'JanSahay Grounded Engine',
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedQuestion, setLastFailedQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const promptCategories = {
    COMMON: {
      label: '🔥 Common Fixes',
      prompts: [
        'Aadhaar OTP is not coming / mobile not linked — what to do?',
        'How to seed bank account with Aadhaar (NPCI DBT)?',
        'Why was my Income Certificate rejected & how to appeal?',
        'PM-KISAN Land Seeding: NO — how to fix with Talathi?',
        'MahaDBT application sent back with scrutiny remark?',
        'Which documents do I currently have in hand?'
      ]
    },
    CERTIFICATES: {
      label: '📜 Certificates',
      prompts: [
        'How do I obtain an Income Certificate in Maharashtra?',
        'How do I get a digital 7/12 land extract?',
        'How to apply for Caste Validity on BARTI CCVIS?',
        'What is Non-Creamy Layer (NCL) and who qualifies?',
        'How to get an EWS Certificate (< ₹8L)?',
        'Unique Disability ID (UDID) card application process?'
      ]
    },
    STUDENTS: {
      label: '🎓 Students',
      prompts: [
        'What documents do I need for MahaDBT EBC Scholarship?',
        'Can I take both State and Central scholarships?',
        'Is Management quota student eligible for fee waiver?',
        'How to make a Gap Certificate affidavit for 1-year break?',
        'Dr. Panjabrao Deshmukh Hostel Allowance (₹30,000)?'
      ]
    },
    FARMERS: {
      label: '🌾 Farmers',
      prompts: [
        'PM-KISAN and Namo Shetkari ₹12,000 details?',
        'How to do PM-KISAN e-KYC on mobile with Face Auth?',
        '90% subsidy for Solar Agriculture Pump (KUSUM / Magel Tyala)?',
        '0% Interest Crop Loan (Pik Karj) up to ₹3 Lakh?',
        'पीएम किसान योजनेसाठी कोणती कागदपत्रे लागतात?'
      ]
    },
    WOMEN: {
      label: '🌸 Women & Family',
      prompts: [
        'लाडकी बहीण योजनेची पात्रता व कागदपत्रे (Majhi Ladki Bahin)?',
        'Can 2 women in the same family get Ladki Bahin?',
        'Pradhan Mantri Matru Vandana Yojana (₹5,000 maternity)?',
        'Sukanya Samriddhi Yojana (SSY) interest rate & rules?'
      ]
    },
    BUSINESS: {
      label: '💼 Business & Loans',
      prompts: [
        'Bank asking collateral for Mudra loan — what are RBI rules?',
        'What are the 3 loan categories under PM Mudra?',
        'PMEGP 35% government capital subsidy on new business?',
        'PM SVANidhi ₹10,000 street vendor micro-loan?',
        'PM Vishwakarma toolkit ₹15,000 + 5% loan for artisans?'
      ]
    },
    HELPLINES: {
      label: '📞 Helplines & RTS',
      prompts: [
        'Official government welfare helpline numbers?',
        'How to file complaint under Maharashtra RTS 2015?',
        'File a grievance on CPGRAMS or CM Helpline?'
      ]
    }
  };

  const schemeSpecificPrompts = currentScheme ? [
    `What documents do I still need for ${currentScheme.name?.split(' ')[0]}?`,
    `Am I eligible for ${currentScheme.name?.split(' ')[0]}?`,
    `How do I apply for ${currentScheme.name?.split(' ')[0]}?`,
    `Where is the official portal to apply?`
  ] : [];

  const handleSend = async (textToSend) => {
    const question = (textToSend || input).trim();
    if (!question || loading) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLastFailedQuestion(null);

    try {
      const res = await aiService.chat({
        question,
        schemeId: currentScheme?.id || null,
        language: 'en' // server auto-detects English, Hindi, Marathi accurately
      });

      if (res && res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: res.data.answer,
            provider: res.data.provider,
            sources: res.data.sources || [],
            dataStatus: res.data.dataStatus,
            officialUrl: res.data.officialUrl
          }
        ]);
      } else {
        throw new Error(res?.message || 'Empty response from server');
      }
    } catch (err) {
      console.warn('[AI] Chat error:', err);
      setLastFailedQuestion(question);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `⚠️ **Unable to process your request.**\n\nCould not reach the assistance service. Please verify your connection or click **Retry** below. You can also explore schemes directly via the official portal at [https://www.myscheme.gov.in](https://www.myscheme.gov.in).`,
          provider: 'System Error Notice',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: `Chat cleared. How can I assist you with government schemes or document preparation today?`,
        provider: 'JanSahay Grounded Engine',
        sources: []
      }
    ]);
    setLastFailedQuestion(null);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-drawer no-print"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f2459 100%)',
            color: 'white',
            border: '2px solid #f97316',
            borderRadius: '9999px',
            padding: '0.85rem 1.35rem',
            boxShadow: '0 10px 25px -5px rgba(30,58,138,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            zIndex: 999,
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
          <Sparkles size={18} color="#f97316" />
          <span>Ask JanSahay AI</span>
        </button>
      )}

      {/* Slide-over Chat Drawer */}
      {isOpen && (
        <div
          className="chat-drawer no-print"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '450px',
            maxWidth: '94vw',
            height: '650px',
            maxHeight: '88vh',
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 20px 30px -10px rgba(15,23,42,0.3)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            overflow: 'hidden'
          }}>

          {/* Header */}
          <div style={{ padding: '0.85rem 1rem', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>JanSahay AI Assistant</h3>
                <span style={{ fontSize: '0.65rem', color: '#93c5fd' }}>
                  {currentScheme ? `Context: ${currentScheme.name?.substring(0, 26)}...` : 'Verified Indian Government Knowledge Base'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={handleClearChat}
                title="Clear Chat Conversation"
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '4px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat Drawer"
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '9999px', width: '28px', height: '28px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '92%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '0.75rem',
                  backgroundColor: m.role === 'user' ? '#1e3a8a' : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#1e293b',
                  border: m.role === 'user' ? 'none' : m.isError ? '1px solid #fecaca' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  {m.role === 'user' ? (
                    <div style={{ fontSize: '0.85rem' }}>{m.text}</div>
                  ) : (
                    <SafeMarkdown text={m.text} />
                  )}

                  {/* Sources List if provided */}
                  {m.sources && m.sources.length > 0 && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', fontSize: '0.72rem', color: '#64748b' }}>
                      <strong style={{ color: '#0f172a' }}>Verified Sources:</strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
                        {m.sources.map((src, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span style={{ color: '#15803d' }}>✓</span>
                            {isSafeUrl(src.url) ? (
                              <a href={src.url} target="_blank" rel="noreferrer" style={{ color: '#1e3a8a', fontWeight: 600, textDecoration: 'none' }}>
                                {src.title || src.sourceName} ↗
                              </a>
                            ) : (
                              <span>{src.title}</span>
                            )}
                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>({src.dataStatus || 'verified'})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Provider Badge */}
                {m.provider && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem', fontSize: '0.65rem', color: '#64748b' }}>
                    <CheckCircle size={10} color="#15803d" />
                    <span>{m.provider}</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', padding: '0.5rem 0.8rem', background: '#ffffff', borderRadius: '0.6rem', border: '1px solid #e2e8f0', alignSelf: 'flex-start' }}>
                <Sparkles size={14} color="#1e3a8a" className="animate-spin" />
                <span>Searching verified government knowledge base...</span>
              </div>
            )}

            {lastFailedQuestion && !loading && (
              <div style={{ alignSelf: 'center', marginTop: '0.25rem' }}>
                <button
                  onClick={() => handleSend(lastFailedQuestion)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', borderColor: '#ef4444', color: '#ef4444' }}>
                  <RotateCcw size={12} /> Retry Question
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Category Tabs for Questions */}
          <div style={{ padding: '0.35rem 0.6rem 0.2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: '0.3rem', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {Object.keys(promptCategories).map((catKey) => {
              const cat = promptCategories[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  style={{
                    background: isSelected ? '#1e3a8a' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: isSelected ? '1px solid #1e3a8a' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Prompts Carousel for Selected Category */}
          <div style={{ padding: '0.35rem 0.6rem 0.45rem', background: '#ffffff', display: 'flex', gap: '0.35rem', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {schemeSpecificPrompts.map((qp, idx) => (
              <button
                key={`scheme-${idx}`}
                type="button"
                onClick={() => handleSend(qp)}
                disabled={loading}
                style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.68rem',
                  color: '#92400e',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  opacity: loading ? 0.6 : 1
                }}>
                ⚡ {qp}
              </button>
            ))}
            {(promptCategories[selectedCategory]?.prompts || []).map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp)}
                disabled={loading}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.68rem',
                  color: '#334155',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  opacity: loading ? 0.6 : 1
                }}>
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '0.65rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, eligibility, certificates... (EN/HI/MR)"
              disabled={loading}
              maxLength={1000}
              style={{
                flex: 1,
                padding: '0.55rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? '#1e3a8a' : '#94a3b8',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.55rem 0.85rem',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed'
              }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
