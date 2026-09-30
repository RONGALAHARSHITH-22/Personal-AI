import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Sparkles, Copy, Check, MessageSquare } from 'lucide-react';
import { speechService } from '../services/SpeechService';
import { audioSynth } from '../services/AudioSynth';

export default function ChatPanel({ 
  messages, 
  onSendMessage, 
  isThinking, 
  colorHex = '#00f0ff'
}) {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    audioSynth.playClickSound();
    onSendMessage(inputText);
    setInputText('');
  };

  const handleMicToggle = () => {
    audioSynth.playClickSound();
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const success = speechService.startListening((transcript) => {
        setIsListening(false);
        if (transcript) {
          onSendMessage(transcript);
        }
      });
      if (success) setIsListening(true);
    }
  };

  const handleSpeakMessage = (text) => {
    audioSynth.playClickSound();
    speechService.speak(text);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="cyber-glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', border: `1px solid ${colorHex}44` }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Chat Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 240, 255, 0.15)', paddingBottom: '10px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color={colorHex} />
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.9rem', color: colorHex, letterSpacing: '1px', margin: 0 }}>
            AURA NEURAL DIALOGUE STREAM
          </h2>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          JARVIS PROTOCOL ACTIVE
        </span>
      </div>

      {/* Message Stream */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px' }}>
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={idx} 
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                background: isUser ? 'rgba(0, 240, 255, 0.12)' : 'rgba(5, 8, 17, 0.75)',
                border: '1px solid ' + (isUser ? 'rgba(0, 240, 255, 0.35)' : `${colorHex}33`),
                borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                padding: '12px 14px',
                boxShadow: isUser ? '0 0 10px rgba(0,240,255,0.08)' : `0 0 12px ${colorHex}15`,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.7rem', fontFamily: 'var(--font-orbitron)', color: isUser ? 'var(--theme-cyan)' : colorHex }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: isUser ? 'var(--theme-cyan)' : colorHex, width: '5px', height: '5px' }} />
                  {isUser ? 'USER // COMMANDER' : 'AURA // JARVIS PRIME'}
                </span>
                
                {!isUser && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleSpeakMessage(msg.text)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                      title="Speak Message Vocalization"
                    >
                      <Volume2 size={13} />
                    </button>
                    <button 
                      onClick={() => handleCopy(msg.text, idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                      title="Copy Message Text"
                    >
                      {copiedIndex === idx ? <Check size={13} color="#00ff88" /> : <Copy size={13} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Message Body Content */}
              <div style={{ fontSize: '0.88rem', lineHeight: '1.55', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-main)', fontFamily: 'var(--font-inter)' }}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div style={{ alignSelf: 'flex-start', background: 'rgba(5, 8, 17, 0.75)', border: `1px solid ${colorHex}44`, borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: '0.8rem', color: colorHex, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} className="pulse-dot" color={colorHex} />
            <span style={{ fontFamily: 'var(--font-orbitron)' }}>AURA is synthesizing neural response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Row */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 0', borderTop: '1px solid rgba(0,240,255,0.1)' }}>
        {[
          'Who are you AURA?',
          'Run system diagnostics',
          'Dance hip-hop to the beat',
          'Create mission briefing report',
          'Toggle wireframe matrix',
          'Celebrate victory!'
        ].map((promptText, i) => (
          <button
            key={i}
            onClick={() => {
              audioSynth.playClickSound();
              onSendMessage(promptText);
            }}
            style={{
              background: 'rgba(0, 240, 255, 0.05)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 600
            }}
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={handleMicToggle}
          className={`cyber-btn ${isListening ? 'cyber-btn-secondary' : ''}`}
          style={{ padding: '10px 12px' }}
          title={isListening ? "Listening... click to pause" : "Voice input via microphone"}
        >
          {isListening ? <MicOff size={16} color="var(--theme-pink)" /> : <Mic size={16} color={colorHex} />}
        </button>

        <input 
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? "Listening for your voice command, Sir..." : "Ask AURA anything, issue tasks, or command choreography..."}
          style={{
            flex: 1,
            background: 'rgba(5, 8, 17, 0.8)',
            border: `1px solid ${colorHex}44`,
            borderRadius: '6px',
            padding: '10px 14px',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-inter)',
            outline: 'none'
          }}
        />

        <button type="submit" className="cyber-btn" disabled={isThinking || !inputText.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
