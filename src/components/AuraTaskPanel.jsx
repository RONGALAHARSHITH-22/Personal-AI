import React, { useRef, useEffect } from 'react';
import { Play, Square, AlertTriangle, CheckCircle, Clock, Terminal, Activity, FileText, Cpu, Music } from 'lucide-react';

export default function AuraTaskPanel({
  agentState = 'IDLE',
  progress = 0,
  currentPlan = null,
  logs = [],
  onCancelTask,
  onQuickTask,
  colorHex = '#00f0ff'
}) {
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="cyber-glass" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', borderRadius: '8px', border: `1px solid ${colorHex}44`, height: '100%' }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color={colorHex} />
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.92rem', color: colorHex, margin: 0 }}>
            AURA AUTONOMOUS TASK PROTOCOLS
          </h2>
        </div>

        {/* State Badge */}
        <span style={{
          fontSize: '0.72rem',
          fontFamily: 'var(--font-orbitron)',
          padding: '3px 8px',
          borderRadius: '4px',
          fontWeight: 700,
          background: agentState === 'EXECUTING' ? 'rgba(0, 240, 255, 0.2)' : 
                      agentState === 'WAITING_CONFIRMATION' ? 'rgba(255, 170, 0, 0.2)' :
                      agentState === 'COMPLETED' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.08)',
          color: agentState === 'EXECUTING' ? 'var(--theme-cyan)' :
                 agentState === 'WAITING_CONFIRMATION' ? '#ffaa00' :
                 agentState === 'COMPLETED' ? '#00ff88' : 'var(--text-dim)',
          border: '1px solid ' + (agentState === 'EXECUTING' ? 'var(--theme-cyan)' :
                                 agentState === 'WAITING_CONFIRMATION' ? '#ffaa00' :
                                 agentState === 'COMPLETED' ? '#00ff88' : 'rgba(255,255,255,0.15)')
        }}>
          {agentState}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-rajdhani)', color: 'var(--text-dim)' }}>
          <span>TASK EXECUTION PROGRESS</span>
          <span style={{ color: colorHex, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(5, 8, 17, 0.8)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${colorHex}, #0077ff)`,
            transition: 'width 0.3s ease',
            boxShadow: `0 0 10px ${colorHex}`
          }} />
        </div>
      </div>

      {/* Plan Steps Checklist */}
      {currentPlan && currentPlan.steps && currentPlan.steps.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(5, 8, 17, 0.6)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-dim)' }}>
            STAGES IN EXECUTION PIPELINE:
          </span>
          {currentPlan.steps.map((s, idx) => (
            <div key={s.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-rajdhani)', padding: '3px 0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: s.status === 'completed' ? '#00ff88' : s.status === 'running' ? colorHex : 'var(--text-main)' }}>
                {s.status === 'completed' ? <CheckCircle size={14} color="#00ff88" /> : 
                 s.status === 'running' ? <Activity size={14} color={colorHex} className="pulse-dot" /> : 
                 <Clock size={14} color="var(--text-dim)" />}
                {s.description}
              </span>
              {s.requiresConfirmation && (
                <span style={{ fontSize: '0.65rem', color: '#ffaa00', border: '1px solid #ffaa00', padding: '1px 4px', borderRadius: '3px' }}>
                  SECURITY CHECK
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Commands */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-dim)' }}>
          QUICK JARVIS AGENT PROTOCOLS:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Run full system telemetry diagnostics')}
          >
            <Cpu size={13} color="var(--theme-cyan)" /> SYSTEM DIAGNOSTICS
          </button>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Synthesize Python code script')}
          >
            <Terminal size={13} color="#38bdf8" /> GENERATE SCRIPT
          </button>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Summarize system telemetry document')}
          >
            <FileText size={13} color="#a855f7" /> SUMMARIZE DOCS
          </button>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Open approved browser docs portal')}
          >
            <Activity size={13} color="#00ff88" /> BROWSER AUTOMATION
          </button>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Perform Hip-Hop dance routine to the cyber beat')}
          >
            <Music size={13} color="var(--theme-pink)" /> DANCE: HIP-HOP
          </button>
          <button 
            className="cyber-btn"
            style={{ fontSize: '0.72rem', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => onQuickTask && onQuickTask('Create mission briefing report file')}
          >
            <FileText size={13} color="#ffaa00" /> CREATE REPORT
          </button>
        </div>
      </div>

      {/* Execution Logs Terminal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minHeight: '120px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Terminal size={12} /> NEURAL TELEMETRY LOGS
          </span>
          {agentState === 'EXECUTING' && (
            <button
              onClick={onCancelTask}
              style={{
                background: 'rgba(255, 0, 60, 0.2)',
                border: '1px solid #ff003c',
                color: '#ff003c',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-orbitron)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Square size={10} /> ABORT TASK
            </button>
          )}
        </div>

        <div 
          ref={logContainerRef}
          style={{
            flex: 1,
            background: 'rgba(3, 5, 10, 0.95)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '6px',
            padding: '8px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            overflowY: 'auto',
            maxHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {logs.length === 0 ? (
            <span style={{ color: 'var(--text-dim)' }}>Ready for instruction. Standby.</span>
          ) : (
            logs.map((log) => {
              const color = log.type === 'error' ? '#ff0055' :
                            log.type === 'security' ? '#ffaa00' :
                            log.type === 'success' ? '#00ff88' :
                            log.type === 'warn' ? '#ffcc00' : 'var(--theme-cyan)';
              return (
                <div key={log.id} style={{ display: 'flex', gap: '6px', lineHeight: 1.3 }}>
                  <span style={{ color: 'var(--text-dim)', opacity: 0.6 }}>[{log.timestamp}]</span>
                  <span style={{ color }}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
