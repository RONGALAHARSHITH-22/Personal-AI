import React, { useState } from 'react';
import { X, Key, Cpu, Check, HelpCircle } from 'lucide-react';
import { llmService } from '../services/LLMService';
import { audioSynth } from '../services/AudioSynth';

export default function LLMConfigModal({ isOpen, onClose, onSave }) {
  const [provider, setProvider] = useState(llmService.provider || 'builtin');
  const [apiKey, setApiKey] = useState(llmService.apiKey || '');
  const [modelName, setModelName] = useState(llmService.modelName || 'built-in-aura-v2');

  if (!isOpen) return null;

  const handleSave = () => {
    audioSynth.playClickSound();
    llmService.setProvider(provider, apiKey, modelName);
    onSave({ provider, apiKey, modelName });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="cyber-glass" style={{ width: '100%', maxWidth: '540px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.1rem', color: 'var(--accent-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} /> MULTI-LLM NEURAL ENGINE CONFIG
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Provider Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)' }}>
            SELECT AI PROVIDER:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { id: 'builtin', name: '⚡ Built-in AURA (Zero Key)', desc: 'Instant local cyber model' },
              { id: 'gemini', name: '✨ Google Gemini', desc: 'Gemini 1.5/2.0 Flash' },
              { id: 'openai', name: '🧠 OpenAI GPT-4o', desc: 'GPT-4o & GPT-4o-mini' },
              { id: 'anthropic', name: '🔮 Anthropic Claude', desc: 'Claude 3.5 Sonnet' },
              { id: 'openrouter', name: '🌐 OpenRouter Universal', desc: 'DeepSeek, Llama, Mistral' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  audioSynth.playClickSound();
                  setProvider(p.id);
                  if (p.id === 'builtin') setModelName('built-in-aura-v2');
                  else if (p.id === 'gemini') setModelName('gemini-1.5-flash');
                  else if (p.id === 'openai') setModelName('gpt-4o-mini');
                  else if (p.id === 'anthropic') setModelName('claude-3-5-sonnet-20240620');
                  else if (p.id === 'openrouter') setModelName('deepseek/deepseek-r1:free');
                }}
                style={{
                  background: provider === p.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(5, 8, 17, 0.6)',
                  border: '1px solid ' + (provider === p.id ? 'var(--accent-primary)' : 'rgba(0, 240, 255, 0.15)'),
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: provider === p.id ? 'var(--theme-cyan)' : 'var(--text-main)', fontFamily: 'var(--font-rajdhani)' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {p.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key Field (if not builtin) */}
        {provider !== 'builtin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} color="var(--theme-gold)" /> PROVIDER API KEY:
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider.toUpperCase()} API key...`}
              style={{
                background: 'rgba(5, 8, 17, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '6px',
                padding: '10px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>
        )}

        {/* Model Name Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)' }}>
            TARGET MODEL IDENTIFIER:
          </label>
          <input 
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            disabled={provider === 'builtin'}
            style={{
              background: 'rgba(5, 8, 17, 0.9)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '6px',
              padding: '10px',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button className="cyber-btn cyber-btn-secondary" onClick={onClose}>
            CANCEL
          </button>
          <button className="cyber-btn" onClick={handleSave}>
            <Check size={16} /> SAVE CONFIG
          </button>
        </div>
      </div>
    </div>
  );
}
