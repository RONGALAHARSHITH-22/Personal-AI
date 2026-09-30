import React from 'react';
import { ShieldAlert, Check, X, Lock } from 'lucide-react';

export default function SecurityConfirmationModal({
  isOpen,
  step = null,
  onConfirm,
  onReject,
  colorHex = '#00f0ff'
}) {
  if (!isOpen || !step) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 17, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="cyber-glass" style={{ width: '100%', maxWidth: '480px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', border: '1px solid #ffaa00' }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 170, 0, 0.3)', paddingBottom: '12px' }}>
          <ShieldAlert size={22} color="#ffaa00" className="pulse-dot" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1rem', color: '#ffaa00', margin: 0 }}>
              SECURITY OVERRIDE PROTOCOL
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              AURA SECURITY GATEWAY // TASK VERIFICATION
            </span>
          </div>
        </div>

        {/* Alert Notice */}
        <div style={{ background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.25)', borderRadius: '6px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-orbitron)', color: '#ffffff' }}>
            ACTION REQUIRING EXPLICIT USER AUTHORIZATION:
          </span>
          <div style={{ fontSize: '0.85rem', color: '#ffcc00', fontFamily: 'var(--font-mono)', background: 'rgba(5, 8, 17, 0.8)', padding: '8px', borderRadius: '4px' }}>
            "{step.description}"
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            TOOL: <code style={{ color: colorHex }}>{step.tool}</code> | PARAMETERS: <code style={{ color: 'var(--text-main)' }}>{JSON.stringify(step.params || {})}</code>
          </span>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
          This operation alters local workspace state or invokes external system subroutines. Per JARVIS safety directives, execution will not proceed without explicit user affirmation.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={onReject}
            style={{
              background: 'rgba(255, 0, 60, 0.15)',
              border: '1px solid #ff003c',
              color: '#ff003c',
              borderRadius: '6px',
              padding: '8px 14px',
              fontFamily: 'var(--font-orbitron)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={14} /> DENY / ABORT
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: 'rgba(0, 255, 136, 0.2)',
              border: '1px solid #00ff88',
              color: '#00ff88',
              borderRadius: '6px',
              padding: '8px 16px',
              fontFamily: 'var(--font-orbitron)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 12px rgba(0, 255, 136, 0.3)'
            }}
          >
            <Check size={14} /> AUTHORIZE ACTION
          </button>
        </div>
      </div>
    </div>
  );
}
