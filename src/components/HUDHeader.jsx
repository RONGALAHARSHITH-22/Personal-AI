import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Settings, Sliders, Volume2, VolumeX, LayoutGrid, Monitor, MessageSquare, Mic, MicOff, Activity, ShieldCheck, Disc } from 'lucide-react';
import { audioSynth } from '../services/AudioSynth';
import { speechService } from '../services/SpeechService';

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

  // Poll safe FastAPI system telemetry if available
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
    const interval = setInterval(fetchTelemetry, 5000);
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
    <header className="cyber-glass hud-header-sticky">
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Left Section: Branding & Real-time Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="pulse-dot" style={{ backgroundColor: colorHex }} />
          <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '2px', margin: 0 }} className="glow-text-cyan">
            AURA <span style={{ fontSize: '0.72rem', opacity: 0.8, color: '#38bdf8' }}>// JARVIS HOLOGRAPHIC AI</span>
          </h1>
        </div>

        <div style={{ height: '22px', width: '1px', background: 'rgba(0, 240, 255, 0.3)' }} />

        {/* Telemetry Metrics */}
        <div className="telemetry-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
            <Cpu size={14} color={colorHex} /> CPU: <strong style={{ color: '#00ff88' }}>{cpuPercent}%</strong>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
            <Radio size={14} color="#ff007f" /> {fps} FPS
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-orbitron)',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(5, 8, 17, 0.8)',
            border: `1px solid ${stateColors[avatarState] || colorHex}`,
            color: stateColors[avatarState] || colorHex
          }}>
            <span className="pulse-dot" style={{ backgroundColor: stateColors[avatarState] || colorHex, width: '6px', height: '6px' }} />
            {avatarState.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Middle Section: View Layout Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(5, 8, 17, 0.75)', border: '1px solid rgba(0,240,255,0.25)', borderRadius: '6px', padding: '3px' }}>
          <button
            onClick={() => {
              audioSynth.playClickSound();
              onSelectViewMode('split');
            }}
            style={{
              background: viewMode === 'split' ? colorHex : 'transparent',
              color: viewMode === 'split' ? '#050811' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 9px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <LayoutGrid size={13} /> DASHBOARD
          </button>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              onSelectViewMode('stage');
            }}
            style={{
              background: viewMode === 'stage' ? colorHex : 'transparent',
              color: viewMode === 'stage' ? '#050811' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 9px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Monitor size={13} /> 3D STAGE
          </button>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              onSelectViewMode('tasks');
            }}
            style={{
              background: viewMode === 'tasks' ? colorHex : 'transparent',
              color: viewMode === 'tasks' ? '#050811' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 9px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Activity size={13} /> AGENT TASKS
          </button>

          <button
            onClick={() => {
              audioSynth.playClickSound();
              onSelectViewMode('chat');
            }}
            style={{
              background: viewMode === 'chat' ? colorHex : 'transparent',
              color: viewMode === 'chat' ? '#050811' : 'var(--text-dim)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 9px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-rajdhani)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MessageSquare size={13} /> CHAT
          </button>
        </div>

        {/* Wake-Word Toggle */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onToggleWakeWord && onToggleWakeWord();
          }}
          style={{
            background: isWakeWordActive ? 'rgba(0, 240, 255, 0.15)' : 'rgba(5, 8, 17, 0.65)',
            border: isWakeWordActive ? `1px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.15)',
            color: isWakeWordActive ? colorHex : 'var(--text-dim)',
            borderRadius: '6px',
            padding: '4px 9px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-orbitron)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          title="Toggle autonomous wake-word detection for 'Hey Aura'"
        >
          <ShieldCheck size={13} /> WAKE WORD: {isWakeWordActive ? 'ON' : 'OFF'}
        </button>

        {/* Microphone Toggle Button */}
        <button
          onClick={() => {
            audioSynth.playClickSound();
            onToggleListen && onToggleListen();
          }}
          style={{
            background: isListening ? 'rgba(255, 0, 127, 0.25)' : 'rgba(5, 8, 17, 0.65)',
            border: isListening ? '1px solid #ff007f' : '1px solid rgba(255, 255, 255, 0.15)',
            color: isListening ? '#ff007f' : 'var(--text-dim)',
            borderRadius: '6px',
            padding: '4px 9px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-orbitron)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {isListening ? <Mic size={13} className="pulse-dot" /> : <MicOff size={13} />}
          {isListening ? 'LISTENING...' : 'MIC'}
        </button>
      </div>

      {/* Right Section: Controls, Modals & Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Ambient Sub-bass Hum Toggle */}
        <button 
          className="cyber-btn"
          style={{ padding: '5px 8px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onToggleHum();
          }}
          title="Toggle Ambient Hologram Sub-Bass Hum"
        >
          {isHumActive ? <Volume2 size={13} color="#00ff88" /> : <VolumeX size={13} color="var(--text-dim)" />}
          {isHumActive ? 'HUM ON' : 'HUM OFF'}
        </button>

        {/* Hologram Setup Modal Button */}
        <button 
          className="cyber-btn"
          style={{ padding: '5px 8px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onOpenCustomizer();
          }}
        >
          <Sliders size={13} /> CALIBRATOR
        </button>

        {/* LLM Engine Modal Button */}
        <button 
          className="cyber-btn cyber-btn-secondary"
          style={{ padding: '5px 8px', fontSize: '0.72rem' }}
          onClick={() => {
            audioSynth.playClickSound();
            onOpenSettings();
          }}
        >
          <Settings size={13} /> AI CORE
        </button>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: colorHex, letterSpacing: '1px', marginLeft: '4px' }}>
          {timeStr}
        </div>
      </div>
    </header>
  );
}
