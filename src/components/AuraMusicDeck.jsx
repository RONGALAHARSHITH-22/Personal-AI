import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Square, Music, Upload, Disc, Radio, Sliders } from 'lucide-react';
import { musicService } from '../services/MusicService';

export default function AuraMusicDeck({
  currentDanceStyle = 'hip_hop',
  onSelectDanceStyle,
  onAvatarDanceTrigger,
  colorHex = '#00f0ff'
}) {
  const [isPlaying, setIsPlaying] = useState(musicService.isPlaying);
  const [currentTrack, setCurrentTrack] = useState(musicService.currentTrack);
  const [telemetry, setTelemetry] = useState({ level: 0, bass: 0, mid: 0, treble: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    musicService.onTrackChange = (track) => {
      setCurrentTrack(track);
      setIsPlaying(!!track);
    };

    let animId;
    const updateMeters = () => {
      if (musicService.isPlaying) {
        setTelemetry(musicService.getAudioTelemetry());
      } else {
        setTelemetry({ level: 0, bass: 0, mid: 0, treble: 0 });
      }
      animId = requestAnimationFrame(updateMeters);
    };
    updateMeters();

    return () => {
      cancelAnimationFrame(animId);
      musicService.onTrackChange = null;
    };
  }, []);

  const handlePlayPreset = (trackId) => {
    musicService.playPresetBeat(trackId);
    setIsPlaying(true);
    if (onAvatarDanceTrigger) {
      onAvatarDanceTrigger(currentDanceStyle);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      musicService.stop();
      setIsPlaying(false);
    } else {
      handlePlayPreset('cyber_house');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      musicService.loadLocalAudio(file);
      setIsPlaying(true);
      if (onAvatarDanceTrigger) {
        onAvatarDanceTrigger(currentDanceStyle);
      }
    }
  };

  const danceStyles = [
    { id: 'hip_hop', name: 'HIP-HOP', desc: 'Rhythmic Bounces & Wave Popping' },
    { id: 'freestyle', name: 'FREESTYLE', desc: '360° Spins & Fluid Glides' },
    { id: 'cinematic', name: 'CINEMATIC', desc: 'Balletic Sweeps & Arabesques' }
  ];

  return (
    <div className="cyber-glass" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px', borderRadius: '8px', border: `1px solid ${colorHex}44` }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Disc size={18} color={colorHex} className={isPlaying ? 'pulse-dot' : ''} />
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.92rem', color: colorHex, margin: 0 }}>
            CYBER SYNTH BEAT & DANCE KINEMATICS
          </h2>
        </div>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isPlaying ? '#00ff88' : 'var(--text-dim)' }}>
          {isPlaying ? `● LIVE // ${currentTrack?.bpm || 128} BPM` : 'STANDBY'}
        </span>
      </div>

      {/* Dance Style Switcher */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-dim)' }}>
          CHOREOGRAPHY STYLE SELECTION:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {danceStyles.map((style) => {
            const isSelected = currentDanceStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => {
                  onSelectDanceStyle && onSelectDanceStyle(style.id);
                  musicService.setDanceStyle(style.id);
                  if (isPlaying && onAvatarDanceTrigger) {
                    onAvatarDanceTrigger(style.id);
                  }
                }}
                style={{
                  background: isSelected ? 'rgba(0, 240, 255, 0.18)' : 'rgba(5, 8, 17, 0.7)',
                  border: isSelected ? `1px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '8px 6px',
                  color: isSelected ? colorHex : 'var(--text-dim)',
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 10px ${colorHex}55` : 'none'
                }}
              >
                {style.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Visualizer Equalizer Meters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(5,8,17,0.7)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          <span>SPECTRUM TELEMETRY</span>
          <span style={{ color: colorHex }}>BASS: {Math.round(telemetry.bass * 100)}% | MID: {Math.round(telemetry.mid * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '36px', paddingTop: '4px' }}>
          {['BASS', 'MID', 'TREBLE', 'CORE'].map((label, idx) => {
            const val = idx === 0 ? telemetry.bass : idx === 1 ? telemetry.mid : idx === 2 ? telemetry.treble : telemetry.level;
            const h = Math.max(10, Math.round(val * 100));
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                <div style={{ width: '100%', height: `${h}%`, background: `linear-gradient(180deg, ${colorHex}, #0077ff)`, borderRadius: '2px', boxShadow: val > 0.5 ? `0 0 8px ${colorHex}` : 'none' }} />
                <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Track Selection */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="cyber-btn"
            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button 
            className="cyber-btn"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            onClick={() => {
              musicService.stop();
              setIsPlaying(false);
            }}
          >
            <Square size={13} />
          </button>
        </div>

        {/* Upload Local Audio Button */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="audio/*" 
          onChange={handleFileUpload} 
          style={{ display: 'none' }} 
        />
        <button 
          className="cyber-btn"
          style={{ padding: '6px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          onClick={() => fileInputRef.current?.click()}
          title="Upload your own local audio file for AURA to dance to"
        >
          <Upload size={13} /> LOAD AUDIO FILE
        </button>
      </div>

      {/* Preset Tracks */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {musicService.presetTracks.map((trk) => {
          const isCurrent = currentTrack?.id === trk.id;
          return (
            <button
              key={trk.id}
              onClick={() => handlePlayPreset(trk.id)}
              style={{
                flex: 1,
                background: isCurrent ? 'rgba(0, 240, 255, 0.2)' : 'rgba(5, 8, 17, 0.7)',
                border: isCurrent ? `1px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                padding: '5px 8px',
                color: isCurrent ? colorHex : 'var(--text-dim)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-rajdhani)',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ♫ {trk.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
