import React, { useState, useEffect, useRef } from 'react';
import AuraFullBodyAvatar from './components/AuraFullBodyAvatar';
import HUDHeader from './components/HUDHeader';
import AuraTaskPanel from './components/AuraTaskPanel';
import AuraMusicDeck from './components/AuraMusicDeck';
import ChatPanel from './components/ChatPanel';
import LLMConfigModal from './components/LLMConfigModal';
import HologramControlsModal from './components/HologramControlsModal';
import SecurityConfirmationModal from './components/SecurityConfirmationModal';

import { speechService } from './services/SpeechService';
import { audioSynth } from './services/AudioSynth';
import { musicService } from './services/MusicService';
import { aiAgentService } from './services/AIAgentService';
import { llmService } from './services/LLMService';
import confetti from 'canvas-confetti';

const COLOR_THEMES = [
  { id: 'cyan', name: 'AURA Quantum Cyan', hex: '#00f0ff', accent: '#0077ff' },
  { id: 'blue', name: 'JARVIS Deep Cobalt', hex: '#38bdf8', accent: '#1d4ed8' },
  { id: 'violet', name: 'Celestial Violet', hex: '#a855f7', accent: '#6b21a8' },
  { id: 'crimson', name: 'Mark-L Crimson', hex: '#ff003c', accent: '#990000' },
  { id: 'emerald', name: 'Tesseract Emerald', hex: '#00ff88', accent: '#047857' },
  { id: 'gold', name: 'Stark Arc Gold', hex: '#ffaa00', accent: '#b45309' }
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: 'aura',
      text: `Good day, Sir. I am **AURA**—Advanced User Responsive Assistant, modeled after the JARVIS holographic architecture.\n\nMy full-body 3D humanoid avatar, real-time vocal engine, autonomous task execution protocols, and cyber synth dance kinematics are online and standing by. You can speak to me, issue computer automation tasks, play cyber beats, or command me to dance in 360° space!`
    }
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLOR_THEMES[0]);
  const [isWireframe, setIsWireframe] = useState(false);
  const [customGlbUrl, setCustomGlbUrl] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [musicTelemetry, setMusicTelemetry] = useState({ level: 0, bass: 0, mid: 0, treble: 0 });
  const [isHumActive, setIsHumActive] = useState(false);

  // Avatar States: 'idle' | 'listening' | 'thinking' | 'talking' | 'celebrating' | 'dancing'
  const [avatarState, setAvatarState] = useState('idle');
  // Dance Style: 'hip_hop' | 'freestyle' | 'cinematic'
  const [danceStyle, setDanceStyle] = useState('hip_hop');

  // Subtitles
  const [subtitle, setSubtitle] = useState('');

  // Agent States
  const [agentState, setAgentState] = useState(aiAgentService.state);
  const [agentProgress, setAgentProgress] = useState(0);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [confirmationRequest, setConfirmationRequest] = useState(null);

  // View Mode: 'split' | 'stage' | 'tasks' | 'chat'
  const [viewMode, setViewMode] = useState('split');
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Initialize Speech and Audio listeners
  useEffect(() => {
    speechService.onSpeakingStateChange = (speaking) => {
      if (speaking) {
        setAvatarState('talking');
      } else if (musicService.isPlaying) {
        setAvatarState('dancing');
      } else {
        setAvatarState('idle');
      }
    };

    speechService.onSubtitleCallback = (text) => {
      setSubtitle(text);
    };

    speechService.onListeningChange = (listening) => {
      setIsListening(listening);
      if (listening) {
        setAvatarState('listening');
      } else if (!speechService.isSpeaking && !musicService.isPlaying) {
        setAvatarState('idle');
      }
    };

    speechService.onWakeWordTriggered = (phrase) => {
      audioSynth.playNotificationChime();
      setAvatarState('listening');
      speechService.speak('At your service, Sir.');
    };

    aiAgentService.onStateChange = (st) => setAgentState(st);
    aiAgentService.onProgressChange = (p) => setAgentProgress(p);
    aiAgentService.onLogsChange = (l) => setExecutionLogs(l);
    aiAgentService.onRequireConfirmation = (req) => setConfirmationRequest(req);

    let animId;
    const updateAudio = () => {
      let level = audioSynth.getAudioLevel();
      if (speechService.isSpeaking) {
        level = Math.max(level, 0.4 + Math.sin(Date.now() * 0.02) * 0.35);
      }
      setAudioLevel(level);

      if (musicService.isPlaying) {
        setMusicTelemetry(musicService.getAudioTelemetry());
      } else {
        setMusicTelemetry({ level: 0, bass: 0, mid: 0, treble: 0 });
      }

      animId = requestAnimationFrame(updateAudio);
    };
    updateAudio();

    return () => {
      cancelAnimationFrame(animId);
      speechService.stopListening();
      speechService.stopSpeaking();
      musicService.stop();
    };
  }, []);

  // Handle User Message from Chat or Voice
  const handleSendMessage = async (userText) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsThinking(true);
    setAvatarState('thinking');

    const lower = userText.toLowerCase();

    // Check for Dance directive
    if (lower.includes('dance') || lower.includes('groove') || lower.includes('beat')) {
      let targetStyle = 'freestyle';
      if (lower.includes('hip hop') || lower.includes('hip-hop')) targetStyle = 'hip_hop';
      if (lower.includes('cinematic') || lower.includes('ballet')) targetStyle = 'cinematic';
      
      setDanceStyle(targetStyle);
      musicService.setDanceStyle(targetStyle);
      musicService.playPresetBeat(targetStyle === 'hip_hop' ? 'cyber_house' : targetStyle === 'cinematic' ? 'cinematic_pulse' : 'lofi_chill');
      setAvatarState('dancing');
    }

    // Check for Celebration directive
    if (lower.includes('celebrate') || lower.includes('victory') || lower.includes('won') || lower.includes('congrat')) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      setAvatarState('celebrating');
    }

    try {
      // Send to FastAPI /api/chat or fallback LLM service
      let replyText = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userText }].map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            provider: llmService.provider || 'builtin'
          })
        });
        if (res.ok) {
          const data = await res.json();
          replyText = data.content;
          if (data.avatarState) setAvatarState(data.avatarState);
          if (data.danceStyle) setDanceStyle(data.danceStyle);
        }
      } catch (backendErr) {
        // Fallback to client LLM service
        const clientRes = await llmService.generateResponse(userText, messages);
        replyText = clientRes.text;
      }

      setIsThinking(false);
      setMessages(prev => [...prev, { sender: 'aura', text: replyText }]);
      speechService.speak(replyText);

    } catch (e) {
      setIsThinking(false);
      setAvatarState('idle');
      setMessages(prev => [...prev, { sender: 'aura', text: `System anomaly: ${e.message}` }]);
    }
  };

  // Launch Autonomous Agent Task
  const handleLaunchAgentTask = (taskPrompt) => {
    aiAgentService.executeTask(taskPrompt, (triggeredState) => {
      setAvatarState(triggeredState);
    });
  };

  const handleToggleVoiceInput = () => {
    const active = speechService.toggleListening((transcript) => {
      handleSendMessage(transcript);
    });
    setIsListening(active);
  };

  const handleToggleHum = () => {
    const nextState = !isHumActive;
    audioSynth.toggleHologramHum(nextState);
    setIsHumActive(nextState);
  };

  return (
    <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background Cyber Grid & Overlay */}
      <div className="cyber-bg" />
      <div className="scanline-overlay" />

      {/* TOP HUD HEADER */}
      <HUDHeader
        activeProvider={llmService.provider || 'builtin'}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        isHumActive={isHumActive}
        onToggleHum={handleToggleHum}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        avatarState={avatarState}
        isListening={isListening}
        onToggleListen={handleToggleVoiceInput}
        isWakeWordActive={isWakeWordActive}
        onToggleWakeWord={() => setIsWakeWordActive(prev => !prev)}
        colorHex={currentColor.hex}
      />

      {/* MAIN DASHBOARD (SPLIT VIEW) */}
      {viewMode === 'split' && (
        <main className="dashboard-workspace" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
          {/* LEFT COLUMN: 3D Holographic Stage + Music Deck */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '520px' }}>
            
            {/* 3D Full-Body Humanoid Avatar Stage */}
            <div className="cyber-glass" style={{ flex: 1, minHeight: '400px', position: 'relative', border: `1px solid ${currentColor.hex}44`, borderRadius: '8px' }}>
              <div className="hud-corner-tl" />
              <div className="hud-corner-br" />

              {/* Status Header Badge */}
              <div style={{ position: 'absolute', top: '14px', left: '16px', right: '16px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,8,17,0.75)', padding: '6px 12px', borderRadius: '6px', border: `1px solid ${currentColor.hex}33` }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-orbitron)', color: currentColor.hex, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: currentColor.hex }} />
                  AURA 3D FULL-BODY MATRIX // {avatarState.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  360° SKELETAL RIGGING
                </span>
              </div>

              {/* Real 3D Full-Body Hologram Canvas */}
              <AuraFullBodyAvatar
                colorHex={currentColor.hex}
                accentHex={currentColor.accent}
                avatarState={avatarState}
                danceStyle={danceStyle}
                audioLevel={audioLevel}
                musicAudio={musicTelemetry}
                isWireframe={isWireframe}
                customGlbUrl={customGlbUrl}
              />

              {/* Live Subtitle Bar */}
              {subtitle && (
                <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', zIndex: 15, background: 'rgba(5, 8, 17, 0.85)', backdropFilter: 'blur(10px)', border: `1px solid ${currentColor.hex}55`, borderRadius: '6px', padding: '8px 14px', color: '#ffffff', fontFamily: 'var(--font-rajdhani)', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center', boxShadow: `0 0 16px ${currentColor.hex}33` }}>
                  "{subtitle}"
                </div>
              )}
            </div>

            {/* Music & Cyber Synth Beat Station */}
            <AuraMusicDeck
              currentDanceStyle={danceStyle}
              onSelectDanceStyle={setDanceStyle}
              onAvatarDanceTrigger={(style) => {
                setDanceStyle(style);
                setAvatarState('dancing');
              }}
              colorHex={currentColor.hex}
            />
          </div>

          {/* RIGHT COLUMN: Autonomous Agent Tasks + Neural Chat Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '520px' }}>
            {/* Task Protocol Console */}
            <div style={{ maxHeight: '340px' }}>
              <AuraTaskPanel
                agentState={agentState}
                progress={agentProgress}
                currentPlan={aiAgentService.currentPlan}
                logs={executionLogs}
                onCancelTask={() => aiAgentService.cancelCurrentTask()}
                onQuickTask={handleLaunchAgentTask}
                colorHex={currentColor.hex}
              />
            </div>

            {/* Neural Chat Stream */}
            <div style={{ flex: 1, minHeight: '340px' }}>
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isThinking={isThinking}
                colorHex={currentColor.hex}
              />
            </div>
          </div>
        </main>
      )}

      {/* 3D STAGE FOCUS VIEW */}
      {viewMode === 'stage' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', zIndex: 1, minHeight: 'calc(100vh - 65px)' }}>
          <div className="cyber-glass" style={{ flex: 1, position: 'relative', minHeight: '520px', border: `1px solid ${currentColor.hex}55`, borderRadius: '8px' }}>
            <div className="hud-corner-tl" />
            <div className="hud-corner-br" />

            <AuraFullBodyAvatar
              colorHex={currentColor.hex}
              accentHex={currentColor.accent}
              avatarState={avatarState}
              danceStyle={danceStyle}
              audioLevel={audioLevel}
              musicAudio={musicTelemetry}
              isWireframe={isWireframe}
              customGlbUrl={customGlbUrl}
            />

            {subtitle && (
              <div style={{ position: 'absolute', bottom: '24px', left: '40px', right: '40px', zIndex: 15, background: 'rgba(5, 8, 17, 0.85)', backdropFilter: 'blur(10px)', border: `1px solid ${currentColor.hex}55`, borderRadius: '8px', padding: '12px 20px', color: '#ffffff', fontFamily: 'var(--font-rajdhani)', fontSize: '1.1rem', fontWeight: 600, textAlign: 'center' }}>
                "{subtitle}"
              </div>
            )}
          </div>

          <AuraMusicDeck
            currentDanceStyle={danceStyle}
            onSelectDanceStyle={setDanceStyle}
            onAvatarDanceTrigger={(style) => {
              setDanceStyle(style);
              setAvatarState('dancing');
            }}
            colorHex={currentColor.hex}
          />
        </main>
      )}

      {/* AGENT TASKS VIEW */}
      {viewMode === 'tasks' && (
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', padding: '16px', zIndex: 1, minHeight: 'calc(100vh - 65px)' }}>
          <AuraTaskPanel
            agentState={agentState}
            progress={agentProgress}
            currentPlan={aiAgentService.currentPlan}
            logs={executionLogs}
            onCancelTask={() => aiAgentService.cancelCurrentTask()}
            onQuickTask={handleLaunchAgentTask}
            colorHex={currentColor.hex}
          />
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            colorHex={currentColor.hex}
          />
        </main>
      )}

      {/* CHAT VIEW */}
      {viewMode === 'chat' && (
        <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: '16px', padding: '16px', zIndex: 1, minHeight: 'calc(100vh - 65px)', position: 'relative' }}>
          <div style={{ position: 'fixed', top: '75px', right: '24px', width: '240px', height: '300px', zIndex: 100 }} className="cyber-glass">
            <AuraFullBodyAvatar
              colorHex={currentColor.hex}
              accentHex={currentColor.accent}
              avatarState={avatarState}
              danceStyle={danceStyle}
              audioLevel={audioLevel}
              musicAudio={musicTelemetry}
              isWireframe={isWireframe}
              customGlbUrl={customGlbUrl}
            />
          </div>

          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
            colorHex={currentColor.hex}
          />
        </main>
      )}

      {/* Security Authorization Guardrail Modal */}
      <SecurityConfirmationModal
        isOpen={!!confirmationRequest}
        step={confirmationRequest?.step}
        onConfirm={() => {
          if (confirmationRequest?.onConfirm) confirmationRequest.onConfirm();
          setConfirmationRequest(null);
        }}
        onReject={() => {
          if (confirmationRequest?.onReject) confirmationRequest.onReject();
          setConfirmationRequest(null);
        }}
        colorHex={currentColor.hex}
      />

      {/* AI Core Settings Modal */}
      <LLMConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={({ provider }) => llmService.provider = provider}
      />

      {/* Hologram Calibrator Modal */}
      <HologramControlsModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        colorThemes={COLOR_THEMES}
        currentColor={currentColor}
        onSelectColor={setCurrentColor}
        isWireframe={isWireframe}
        onToggleWireframe={() => setIsWireframe(prev => !prev)}
        customGlbUrl={customGlbUrl}
        onUpdateGlbUrl={setCustomGlbUrl}
      />
    </div>
  );
}
