import React from 'react';
import { Activity, Palette, Eye, Zap, ShieldCheck } from 'lucide-react';
import { audioSynth } from '../services/AudioSynth';

export default function CommandDeck({ 
  onExecuteCommand, 
  currentPersona, 
  onSwitchPersona, 
  currentColor, 
  onCycleColor,
  isWireframe,
  onToggleWireframe
}) {
  return (
    <div className="cyber-glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.15)', paddingBottom: '8px' }}>
        <h3 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', color: currentColor.hex, letterSpacing: '1.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} /> AURA TACTICAL COMMAND DECK
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-rajdhani)' }}>
          JARVIS LEVEL-5 PROTOCOL ACTIVE
        </span>
      </div>

      {/* Quick Action Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {/* Arc Reactor Overcharge */}
        <button 
          className="cyber-btn cyber-btn-secondary"
          style={{ padding: '8px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
          onClick={() => {
            audioSynth.playNotificationChime();
            onExecuteCommand('OVERCHARGE');
          }}
          title="Pulse Arc Reactor Hologram Core"
        >
          <Zap size={14} color={currentColor.hex} /> ARC CORE
        </button>

        {/* System Diagnostics */}
        <button 
          className="cyber-btn"
          style={{ padding: '8px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
          onClick={() => {
            audioSynth.playClickSound();
            onExecuteCommand('DIAGNOSTICS');
          }}
        >
          <Activity size={14} /> DIAGNOSTICS
        </button>

        {/* Hologram Color Cycle */}
        <button 
          className="cyber-btn"
          style={{ padding: '8px 10px', fontSize: '0.75rem', justifyContent: 'center' }}
          onClick={() => {
            audioSynth.playClickSound();
            onCycleColor();
          }}
        >
          <Palette size={14} /> {currentColor.name.split(' ')[0]}
        </button>

        {/* Wireframe Matrix */}
        <button 
          className="cyber-btn"
          style={{ 
            padding: '8px 10px', 
            fontSize: '0.75rem', 
            justifyContent: 'center',
            borderColor: isWireframe ? 'var(--theme-emerald)' : 'var(--accent-primary)'
          }}
          onClick={() => {
            audioSynth.playClickSound();
            onToggleWireframe();
          }}
        >
          <Eye size={14} /> {isWireframe ? 'MESH: ON' : 'MESH: OFF'}
        </button>
      </div>

      {/* Persona Mode Selector Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-rajdhani)', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
          CORE MODE:
        </span>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flex: 1, paddingBottom: '2px' }}>
          {[
            { id: 'AURA_JARVIS', label: 'JARVIS Core' },
            { id: 'AURA_TACTICAL', label: 'Tactical Security' },
            { id: 'AURA_CREATIVE', label: 'Creative Choreographer' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                audioSynth.playClickSound();
                onSwitchPersona(item.id);
              }}
              style={{
                background: currentPersona === item.id ? currentColor.hex : 'rgba(0,240,255,0.06)',
                color: currentPersona === item.id ? '#050811' : 'var(--text-main)',
                border: '1px solid ' + (currentPersona === item.id ? currentColor.hex : 'rgba(0,240,255,0.2)'),
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-rajdhani)',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
