import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import { aiService } from '../services/api';

export const AIChatDrawer = ({ currentScheme = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I am your JanSahay AI Assistant. I provide verified, grounded explanations about government schemes, eligibility rules, and state document acquisition processes. How can I help you today?`,
      provider: 'JanSahay Grounded Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    currentScheme ? `Why is ${currentScheme.name?.split(' ')[0]} recommended for me?` : 'Why is a scheme recommended for me?',
    'How do I get an Income Certificate in Maharashtra?',
    'How can I get Domicile certificate?',
    'मराठीत माहिती द्या (Explain in Marathi)',
    'सरल हिंदी में समझाइए (Explain in Hindi)'
  ];

  const handleSend = async (textToSend) => {
    const question = textToSend || input;
    if (!question.trim()) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat({
        question,
        schemeId: currentScheme?.id || null,
        language: question.includes('मराठी') ? 'mr' : question.includes('हिंदी') ? 'hi' : 'en'
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
          text: 'Detailed instructions have not yet been verified. Please consult the issuing authority through the official government link.',
          provider: 'JanSahay Rule Engine'
        }
      ]);
    } finally {
      setLoading(false);
    }
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
            boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)',
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
          width: '420px',
          maxWidth: '92vw',
          height: '620px',
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.3)',
          border: '1px solid #cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>JanSahay AI Assistant</h3>
                <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>Verified Stored Knowledge Base</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '9999px', width: '28px', height: '28px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '88%',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  backgroundColor: m.role === 'user' ? '#1e3a8a' : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#1e293b',
                  border: m.role === 'user' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>

                {m.provider && (
                  <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle size={10} color="#10b981" /> {m.provider}
                  </span>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem', padding: '0.5rem' }}>
                <Bot size={16} /> Analyzing verified scheme records...
              </div>
            )}
          </div>

          {/* Quick Prompts Chips */}
          <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.35rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.7rem',
                  color: '#334155',
                  cursor: 'pointer',
                  flexShrink: 0
                }}>
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes, eligibility, documents..."
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#1e3a8a',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.6rem 0.85rem',
                cursor: 'pointer'
              }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
