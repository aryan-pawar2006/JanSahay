import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, CheckCircle, ExternalLink, Zap, Globe } from 'lucide-react';
import { aiService } from '../services/api';

// Simple markdown-like renderer for AI responses
function RenderMarkdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
      {lines.map((line, idx) => {
        // Bold headers **text**
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
        // Links [text](url)
        const withLinks = boldLine.replace(
          /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
          (_, label, url) => `<a href="${url}" target="_blank" rel="noreferrer" style="color:#1e3a8a;font-weight:700">${label} ↗</a>`
        );
        // Bullet points
        if (line.startsWith('• ') || line.startsWith('  • ')) {
          return (
            <div key={idx} style={{ marginLeft: line.startsWith('  •') ? '1.25rem' : '0', marginBottom: '0.15rem' }}>
              <span dangerouslySetInnerHTML={{ __html: withLinks }} />
            </div>
          );
        }
        // Empty lines
        if (!line.trim()) return <div key={idx} style={{ height: '0.4rem' }} />;
        return (
          <div key={idx} style={{ marginBottom: '0.1rem' }}>
            <span dangerouslySetInnerHTML={{ __html: withLinks }} />
          </div>
        );
      })}
    </div>
  );
}

export const AIChatDrawer = ({ currentScheme = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `**नमस्ते! Welcome to JanSahay AI!** 🙏\n\nI help Indian citizens discover and apply for **30+ government welfare schemes**.\n\nAsk me:\n• *"What schemes are available for farmers?"*\n• *"How do I get an Income Certificate?"*\n• *"PM-KISAN के लिए क्या चाहिए?"*\n• *"मराठीत सांगा"*`,
      provider: 'JanSahay AI Assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const quickPrompts = [
    currentScheme ? `Explain ${currentScheme.name?.split(' ')[0]} scheme` : 'What schemes am I eligible for?',
    'How to get Income Certificate in Maharashtra?',
    'PM-KISAN documents required?',
    'Ayushman Bharat eligibility?',
    'मराठीत माहिती द्या',
    'हिंदी में बताइए',
    'Official helpline numbers?',
    'Show me scholarship schemes',
  ];

  const detectLanguage = (text) => {
    if (/[\u0900-\u097F]/.test(text)) {
      if (text.includes('मराठी') || text.includes('सांगा') || text.includes('आहे') || text.includes('द्या')) return 'mr';
      return 'hi';
    }
    if (text.includes('marathi') || text.includes('marathi')) return 'mr';
    if (text.includes('hindi') || text.includes('mein') || text.includes('kaise') || text.includes('batao')) return 'hi';
    return 'en';
  };

  const handleSend = async (textToSend) => {
    const question = textToSend || input;
    if (!question.trim()) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const lang = detectLanguage(question);
      const res = await aiService.chat({
        question,
        schemeId: currentScheme?.id || null,
        language: lang
      });

      if (res.success && res.data) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: res.data.answer,
            provider: res.data.provider,
            officialUrl: res.data.officialUrl
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an error. Please try again or visit the **official MyScheme portal** at [myscheme.gov.in](https://www.myscheme.gov.in).',
          provider: 'JanSahay AI'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const providerColor = (provider) => {
    if (!provider) return '#64748b';
    if (provider.includes('Gemini')) return '#1565C0';
    if (provider.includes('Groq') || provider.includes('Llama')) return '#7b1fa2';
    if (provider.includes('Multilingual') || provider.includes('मराठी') || provider.includes('हिंदी')) return '#0e7490';
    return '#15803d';
  };

  const providerIcon = (provider) => {
    if (!provider) return null;
    if (provider.includes('Gemini') || provider.includes('Groq') || provider.includes('Llama')) return <Zap size={10} />;
    if (provider.includes('मराठी') || provider.includes('हिंदी')) return <Globe size={10} />;
    return <CheckCircle size={10} />;
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-drawer no-print"
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0f2459 100%)',
            color: 'white', border: '2px solid #f97316', borderRadius: '9999px',
            padding: '0.85rem 1.35rem', boxShadow: '0 10px 25px -5px rgba(30,58,138,0.4)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            cursor: 'pointer', zIndex: 999, fontWeight: 700, fontSize: '0.9rem'
          }}>
          <Sparkles size={18} color="#f97316" />
          <span>Ask JanSahay AI</span>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div
          className="chat-drawer no-print"
          style={{
            position: 'fixed', bottom: '20px', right: '20px',
            width: '440px', maxWidth: '93vw',
            height: '640px', maxHeight: '86vh',
            backgroundColor: '#ffffff', borderRadius: '1rem',
            boxShadow: '0 20px 30px -10px rgba(15,23,42,0.3)',
            border: '1px solid #cbd5e1',
            display: 'flex', flexDirection: 'column',
            zIndex: 1001, overflow: 'hidden'
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
                  {currentScheme ? `Context: ${currentScheme.name?.substring(0, 28)}...` : '30+ Govt Schemes • EN / HI / MR'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '9999px', width: '28px', height: '28px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '90%', padding: '0.7rem 0.9rem', borderRadius: '0.75rem',
                  backgroundColor: m.role === 'user' ? '#1e3a8a' : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#1e293b',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  {m.role === 'user'
                    ? <div style={{ fontSize: '0.85rem' }}>{m.text}</div>
                    : <RenderMarkdown text={m.text} />
                  }
                </div>

                {m.provider && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.62rem', color: providerColor(m.provider), display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      {providerIcon(m.provider)} {m.provider}
                    </span>
                    {m.officialUrl && (
                      <a href={m.officialUrl} target="_blank" rel="noreferrer"
                        style={{ fontSize: '0.62rem', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.15rem', textDecoration: 'none' }}>
                        <ExternalLink size={9} /> Official Portal
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', padding: '0.4rem 0.75rem', background: '#fff', borderRadius: '0.6rem', border: '1px solid #e2e8f0', alignSelf: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1e3a8a', animation: `bounce 1s ${delay}s infinite` }} />
                  ))}
                </div>
                Analyzing government schemes...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.4rem 0.6rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.3rem', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                disabled={loading}
                style={{
                  background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '9999px',
                  padding: '0.22rem 0.6rem', fontSize: '0.68rem', color: '#334155',
                  cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: loading ? 0.6 : 1
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
              placeholder="Ask about schemes, documents, eligibility... (EN/HI/MR)"
              disabled={loading}
              style={{
                flex: 1, padding: '0.55rem 0.85rem', borderRadius: '0.5rem',
                border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none',
                opacity: loading ? 0.7 : 1
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? '#1e3a8a' : '#94a3b8',
                color: 'white', border: 'none', borderRadius: '0.5rem',
                padding: '0.55rem 0.85rem', cursor: 'pointer', transition: 'background 0.2s'
              }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
};
