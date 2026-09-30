import React, { useState } from 'react';
import { X, Sliders, Palette, Box, Sparkles, Volume2, Upload } from 'lucide-react';
import { audioSynth } from '../services/AudioSynth';
import { speechService } from '../services/SpeechService';

export default function HologramControlsModal({ 
  isOpen, 
  onClose,
  colorThemes,
  currentColor,
  onSelectColor,
  isWireframe,
  onToggleWireframe,
  modelPreset = 'anime_3d',
  onSelectModelPreset,
  customGlbUrl,
  onUpdateGlbUrl
}) {
  const [localGlbUrl, setLocalGlbUrl] = useState(customGlbUrl || '');
  const [pitch, setPitch] = useState(speechService.voicePitch || 1.05);
  const [rate, setRate] = useState(speechService.voiceRate || 1.0);

  if (!isOpen) return null;

  const handleApplyGlb = () => {
    audioSynth.playClickSound();
    if (onUpdateGlbUrl) {
      onUpdateGlbUrl(localGlbUrl.trim() || null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setLocalGlbUrl(blobUrl);
      if (onUpdateGlbUrl) {
        onUpdateGlbUrl(blobUrl);
      }
      audioSynth.playClickSound();
    }
  };

  const handlePitchChange = (newPitch) => {
    setPitch(newPitch);
    speechService.voicePitch = newPitch;
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    speechService.voiceRate = newRate;
  };

  const modelOptions = [
    { id: 'anime_3d', name: '✨ 3D Anime Holographic Waifu', desc: 'Procedural 3D anime companion with dynamic hair, eyes & lip-sync' },
    { id: 'turntable_3d', name: '💫 360° Tripo Turntable Showcase', desc: 'Luma-keyed turntable holographic showcase with audio reactivity' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 17, 0.85)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="cyber-glass" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', border: `1px solid ${currentColor.hex}44` }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '12px' }}>
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.05rem', color: currentColor.hex, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} /> AURA 3D HOLOGRAPHIC CALIBRATOR
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Active 3D Model Preset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color={currentColor.hex} /> ACTIVE 3D AVATAR MODEL:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {modelOptions.map((opt) => {
              const isSelected = modelPreset === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    audioSynth.playClickSound();
                    onSelectModelPreset && onSelectModelPreset(opt.id);
                  }}
                  style={{
                    background: isSelected ? `${currentColor.hex}22` : 'rgba(5, 8, 17, 0.6)',
                    border: isSelected ? `1px solid ${currentColor.hex}` : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 12px ${currentColor.hex}33` : 'none'
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-orbitron)', color: isSelected ? currentColor.hex : 'var(--text-main)', fontWeight: 700 }}>
                    {opt.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Themes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={14} color={currentColor.hex} /> HOLOGRAPHIC EMITTER COLOR MATRIX:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px' }}>
            {colorThemes.map((theme) => {
              const isSelected = currentColor.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    audioSynth.playClickSound();
                    onSelectColor(theme);
                  }}
                  style={{
                    background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(5, 8, 17, 0.6)',
                    border: `1px solid ${isSelected ? theme.hex : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 0 10px ${theme.hex}55` : 'none'
                  }}
                >
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: theme.hex, boxShadow: `0 0 6px ${theme.hex}` }} />
                  <span style={{ fontSize: '0.78rem', color: isSelected ? theme.hex : 'var(--text-main)', fontFamily: 'var(--font-rajdhani)', fontWeight: 600 }}>
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wireframe & Spatial Rendering */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Box size={14} color={currentColor.hex} /> RENDERING GEOMETRY:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                audioSynth.playClickSound();
                onToggleWireframe();
              }}
              className="cyber-btn"
              style={{
                flex: 1,
                background: isWireframe ? 'rgba(0, 240, 255, 0.2)' : 'rgba(5, 8, 17, 0.7)',
                border: isWireframe ? `1px solid ${currentColor.hex}` : '1px solid rgba(255, 255, 255, 0.15)',
                color: isWireframe ? currentColor.hex : 'var(--text-dim)',
                padding: '8px 12px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Box size={14} /> {isWireframe ? 'WIREFRAME MATRIX [ACTIVE]' : 'SOLID HOLOGRAPHIC SURFACE'}
            </button>
          </div>
        </div>

        {/* Voice Audio Calibrator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(5, 8, 17, 0.6)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Volume2 size={14} color={currentColor.hex} /> VOCAL CADENCE & SYNTHESIS CALIBRATION:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
                <span>PITCH ({pitch.toFixed(2)})</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: currentColor.hex }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '4px' }}>
                <span>SPEED RATE ({rate.toFixed(2)})</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: currentColor.hex }}
              />
            </div>
          </div>
        </div>

        {/* Custom 3D Model Loader (GLB / GLTF) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} color={currentColor.hex} /> CUSTOM GLTF/GLB SKELETAL AVATAR MODEL:
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              value={localGlbUrl}
              onChange={(e) => setLocalGlbUrl(e.target.value)}
              placeholder="Paste direct HTTPS link to .glb or .gltf humanoid model..."
              style={{
                flex: 1,
                background: 'rgba(5, 8, 17, 0.8)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <button className="cyber-btn" onClick={handleApplyGlb} style={{ fontSize: '0.75rem', padding: '8px 12px' }}>
              LOAD URL
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <label className="cyber-btn cyber-btn-secondary" style={{ fontSize: '0.72rem', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Upload size={12} /> SELECT LOCAL .GLB FILE
              <input type="file" accept=".glb,.gltf" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-rajdhani)' }}>
              Supports rigged humanoid GLTF/GLB models.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', borderTop: '1px solid rgba(0, 240, 255, 0.15)', paddingTop: '12px' }}>
          <button className="cyber-btn" onClick={onClose} style={{ padding: '8px 20px' }}>
            APPLY CALIBRATION
          </button>
        </div>
      </div>
    </div>
  );
}
