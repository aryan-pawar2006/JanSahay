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

    return parts;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: 1.6, fontSize: '0.85rem' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={i} style={{ height: '0.35rem' }} />;
        }
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', paddingLeft: '0.5rem' }}>
              <span style={{ color: '#f97316', fontWeight: 800 }}>•</span>
              <div style={{ flex: 1 }}>{parseInline(trimmed.substring(2))}</div>
            </div>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', paddingLeft: '0.5rem' }}>
              <span style={{ color: '#1e3a8a', fontWeight: 800, minWidth: '16px' }}>{numMatch[1]}.</span>
              <div style={{ flex: 1 }}>{parseInline(numMatch[2])}</div>
            </div>
          );
        }
        return <div key={i}>{parseInline(line)}</div>;
      })}
    </div>
  );
}

export const AIChatDrawer = ({ currentScheme = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScheme, setActiveScheme] = useState(currentScheme);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `**नमस्ते! Welcome to JanSahay AI Assistant!** 🙏\n\nI am trained to answer any small or big question about government schemes, documents, and application issues.\n\nType your question below in English, Hindi, or Marathi!`,
      provider: 'JanSahay Grounded Engine',
      sources: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedQuestion, setLastFailedQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentScheme) {
      setActiveScheme(currentScheme);
    }
  }, [currentScheme]);

  // Global event listener for any "Ask AI About This Scheme" button across the application
  useEffect(() => {
    const handleGlobalAskAI = (event) => {
      const detail = event.detail || {};
      if (detail.scheme) {
        setActiveScheme(detail.scheme);
      }
      setIsOpen(true);
      if (detail.initialQuestion) {
        handleSend(detail.initialQuestion, detail.scheme || activeScheme);
      }
    };

    window.addEventListener('jansahay-open-ai', handleGlobalAskAI);
    return () => window.removeEventListener('jansahay-open-ai', handleGlobalAskAI);
  }, [activeScheme]);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Keep suggestions minimal and clean (no clutter, no long lists of questions shown to user)
  const schemeName = activeScheme?.schemeName || activeScheme?.name;
  const minimalPrompts = activeScheme ? [
    `Explain ${schemeName?.split(' ')[0]} in simple words`,
    `What documents are needed for this scheme?`,
    `How to apply officially?`
  ] : [
    'Which documents do I currently have in hand?',
    'How do I obtain an Income Certificate?',
    'Emergency government helpline numbers'
  ];

  const handleSend = async (textToSend, overrideScheme = null) => {
    const question = (textToSend || input).trim();
    if (!question || loading) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLastFailedQuestion(null);

    const schemeToUse = overrideScheme || activeScheme;

    try {
      const res = await aiService.chat({
        question,
        schemeId: schemeToUse?.id || schemeToUse?.schemeId || null,
        language: 'en'
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
          text: `⚠️ **Unable to process your request.**\n\nPlease check your internet connection or click **Retry** below.`,
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
        text: `Chat cleared. How can I assist you today?`,
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
            height: '640px',
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
                <span style={{ fontSize: '0.68rem', color: '#93c5fd' }}>
                  {activeScheme ? `Context: ${schemeName?.substring(0, 26)}...` : 'Ask any scheme or document question'}
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
                </div>

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
                <span>Thinking...</span>
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

          {/* Minimal Suggestions (Clean & Simple, NO Clutter) */}
          <div style={{ padding: '0.35rem 0.6rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.35rem', overflowX: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {minimalPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp)}
                disabled={loading}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.7rem',
                  color: '#475569',
                  fontWeight: 600,
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
              placeholder="Type any small or big question (EN/HI/MR)..."
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
              disabled={!input.trim() || loading}
              className="btn btn-primary btn-sm"
              style={{ padding: '0 0.85rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
