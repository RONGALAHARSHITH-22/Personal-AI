import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Settings, Sliders, Volume2, VolumeX, LayoutGrid, Monitor, MessageSquare, Mic, MicOff, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { audioSynth } from '../services/AudioSynth';

export default function HUDHeader({ 
  activeProvider, 
  onOpenSettings, 
  onOpenCustomizer,
  isHumActive,
  onToggleHum,
  viewMode = 'split',
  onSelectViewMode,
  avatarState = 'idle',
  isListening = false,
  onToggleListen,
  isWakeWordActive = true,
  onToggleWakeWord,
  colorHex = '#00f0ff'
}) {
  const [timeStr, setTimeStr] = useState('');
  const [fps, setFps] = useState(60);
  const [cpuPercent, setCpuPercent] = useState(12.4);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll safe system telemetry
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/system/info');
        if (res.ok) {
          const data = await res.json();
          if (data.cpuPercent !== undefined) {
            setCpuPercent(data.cpuPercent);
          }
        }
      } catch (e) {}
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 4000);
    return () => clearInterval(interval);
  }, []);

  // FPS Counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    const loop = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(loop);
    };
    const animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const stateColors = {
    idle: '#00f0ff',
    listening: '#ff00ff',
    thinking: '#ffaa00',
    talking: '#00ff88',
    celebrating: '#ffd700',
    dancing: '#ff007f'
  };

  return (
    <header className="cyber-glass hud-header-sticky" style={{ borderBottom: `1px solid ${colorHex}33` }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Left: Brand & Telemetry Capsule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" style={{ backgroundColor: colorHex, boxShadow: `0 0 10px ${colorHex}` }} />
          <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.1rem', fontWeight: 900, letterSpacing: '2px', margin: 0, color: '#ffffff' }}>
            AURA <span style={{ fontSize: '0.68rem', fontWeight: 600, color: colorHex, opacity: 0.9 }}>// 3D ANIME COMPANION</span>
          </h1>
        </div>

        {/* Compact Integrated Telemetry Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(5, 8, 17, 0.75)',
          border: `1px solid ${colorHex}25`,
          borderRadius: '20px',
          padding: '3px 10px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Cpu size={12} color={colorHex} /> {cpuPercent}%
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{ color: 'var(--text-dim)' }}>
            {fps} FPS
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
          <span style={{
            color: stateColors[avatarState] || colorHex,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className="pulse-dot" style={{ backgroundColor: stateColors[avatarState] || colorHex, width: '5px', height: '5px' }} />
            {avatarState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Center: View Switcher */}
      <div style={{ display: 'flex', background: 'rgba(5, 8, 17, 0.75)', border: `1px solid ${colorHex}25`, borderRadius: '8px', padding: '3px', gap: '2px' }}>
        {[
          { id: 'split', label: 'DASHBOARD', icon: LayoutGrid },
          { id: 'stage', label: '3D STAGE', icon: Monitor },
          { id: 'tasks', label: 'AGENT TASKS', icon: Activity },
          { id: 'chat', label: 'CHAT', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = viewMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioSynth.playClickSound();
                onSelectViewMode(tab.id);
              }}
              style={{
                background: isActive ? `${colorHex}25` : 'transparent',
                color: isActive ? colorHex : 'var(--text-dim)',
                border: isActive ? `1px solid ${colorHex}66` : '1px solid transparent',
                borderRadius: '6px',
                padding: '5px 11px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-rajdhani)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 10px ${colorHex}25` : 'none'
              }}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Quick Action Controls & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Voice Mic Toggle */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onToggleListen && onToggleListen();
          }}
          className="cyber-btn"
          style={{
            padding: '5px 10px',
            fontSize: '0.72rem',
            background: isListening ? 'rgba(255, 0, 127, 0.25)' : undefined,
            borderColor: isListening ? '#ff007f' : undefined,
            color: isListening ? '#ff007f' : undefined
          }}
          title={isListening ? "Listening... click to pause" : "Click to speak to AURA"}
        >
          {isListening ? <Mic size={13} className="pulse-dot" /> : <MicOff size={13} />}
          {isListening ? 'LISTENING' : 'VOICE'}
        </button>

        {/* Wake Word Toggle */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onToggleWakeWord && onToggleWakeWord();
          }}
          className="cyber-btn"
          style={{
            padding: '5px 9px',
            fontSize: '0.72rem',
            background: isWakeWordActive ? `${colorHex}15` : undefined,
            borderColor: isWakeWordActive ? `${colorHex}66` : undefined,
            color: isWakeWordActive ? colorHex : 'var(--text-dim)'
          }}
          title="Toggle hands-free 'Hey Aura' wake-word detection"
        >
          <ShieldCheck size={13} /> WAKE {isWakeWordActive ? 'ON' : 'OFF'}
        </button>

        {/* Ambient Sci-Fi Hum */}
        <button 
          className="cyber-btn"
          style={{ padding: '5px 9px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onToggleHum();
          }}
          title="Toggle ambient holographic sub-bass hum sound"
        >
          {isHumActive ? <Volume2 size={13} color="#00ff88" /> : <VolumeX size={13} color="var(--text-dim)" />}
          {isHumActive ? 'HUM' : 'MUTE'}
        </button>

        {/* Hologram Calibrator Modal */}
        <button 
          className="cyber-btn"
          style={{ padding: '5px 9px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onOpenCustomizer();
          }}
          title="Open Hologram Customizer & 3D Optics Calibrator"
        >
          <Sliders size={13} /> CALIBRATOR
        </button>

        {/* LLM Engine Config */}
        <button 
          className="cyber-btn cyber-btn-secondary"
          style={{ padding: '5px 9px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onOpenSettings();
          }}
          title="Configure AI model provider (Gemini, OpenAI, Claude, Ollama)"
        >
          <Settings size={13} /> AI CORE
        </button>

        {/* Digital Clock */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: colorHex, paddingLeft: '4px', letterSpacing: '1px' }}>
          {timeStr}
        </div>
      </div>
    </header>
  );
}
