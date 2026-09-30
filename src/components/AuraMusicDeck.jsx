import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Square, Music, Upload, Disc, Sparkles } from 'lucide-react';
import { musicService } from '../services/MusicService';
import { audioSynth } from '../services/AudioSynth';

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

  const handleSelectStyle = (styleId) => {
    audioSynth.playClickSound();
    onSelectDanceStyle && onSelectDanceStyle(styleId);
    musicService.setDanceStyle(styleId);
    
    // Immediately play corresponding beat and trigger avatar choreography
    const targetBeat = styleId === 'hip_hop' ? 'cyber_house' : styleId === 'cinematic' ? 'cinematic_pulse' : 'lofi_chill';
    musicService.playPresetBeat(targetBeat);
    setIsPlaying(true);
    if (onAvatarDanceTrigger) {
      onAvatarDanceTrigger(styleId);
    }
  };

  const handlePlayPreset = (trackId) => {
    audioSynth.playClickSound();
    musicService.playPresetBeat(trackId);
    setIsPlaying(true);
    if (onAvatarDanceTrigger) {
      onAvatarDanceTrigger(currentDanceStyle);
    }
  };

  const handleTogglePlay = () => {
    audioSynth.playClickSound();
    if (isPlaying) {
      musicService.stop();
      setIsPlaying(false);
      if (onAvatarDanceTrigger) {
        onAvatarDanceTrigger('idle');
      }
    } else {
      const defaultBeat = currentDanceStyle === 'hip_hop' ? 'cyber_house' : currentDanceStyle === 'cinematic' ? 'cinematic_pulse' : 'lofi_chill';
      musicService.playPresetBeat(defaultBeat);
      setIsPlaying(true);
      if (onAvatarDanceTrigger) {
        onAvatarDanceTrigger(currentDanceStyle);
      }
    }
  };

  const handleStop = () => {
    audioSynth.playClickSound();
    musicService.stop();
    setIsPlaying(false);
    if (onAvatarDanceTrigger) {
      onAvatarDanceTrigger('idle');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      audioSynth.playClickSound();
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
    <div className="cyber-glass" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '14px', borderRadius: '10px', border: `1px solid ${colorHex}33` }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,240,255,0.15)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Disc size={16} color={colorHex} className={isPlaying ? 'pulse-dot' : ''} />
          <h2 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '0.85rem', color: colorHex, margin: 0, letterSpacing: '0.5px' }}>
            CYBER SYNTH BEAT & DANCE KINEMATICS
          </h2>
        </div>
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: isPlaying ? '#00ff88' : 'var(--text-dim)' }}>
          {isPlaying ? `● LIVE // ${currentTrack?.name || 'CYBER BEAT'} (${currentTrack?.bpm || 128} BPM)` : 'STANDBY'}
        </span>
      </div>

      {/* Dance Style Switcher (Clicking immediately triggers dance!) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-orbitron)', color: 'var(--text-dim)' }}>
            SELECT DANCE CHOREOGRAPHY:
          </span>
          <span style={{ fontSize: '0.68rem', color: colorHex, fontFamily: 'var(--font-mono)' }}>
            CLICK TO DANCE NOW
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {danceStyles.map((style) => {
            const isSelected = currentDanceStyle === style.id && isPlaying;
            return (
              <button
                key={style.id}
                onClick={() => handleSelectStyle(style.id)}
                style={{
                  background: isSelected ? `${colorHex}25` : 'rgba(5, 8, 17, 0.7)',
                  border: isSelected ? `1px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '8px 6px',
                  color: isSelected ? colorHex : 'var(--text-main)',
                  fontFamily: 'var(--font-orbitron)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 0 12px ${colorHex}44` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>{style.name}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 400 }}>{style.desc.split('&')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Visualizer Equalizer Meters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(5,8,17,0.7)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          <span>AUDIO FREQUENCY TELEMETRY</span>
          <span style={{ color: colorHex }}>BASS: {Math.round(telemetry.bass * 100)}% | MID: {Math.round(telemetry.mid * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '32px', paddingTop: '2px' }}>
          {['BASS', 'MID', 'TREBLE', 'CORE'].map((label, idx) => {
            const val = idx === 0 ? telemetry.bass : idx === 1 ? telemetry.mid : idx === 2 ? telemetry.treble : telemetry.level;
            const h = Math.max(12, Math.round(val * 100));
            return (
              <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                <div style={{ width: '100%', height: `${h}%`, background: `linear-gradient(180deg, ${colorHex}, #0077ff)`, borderRadius: '2px', boxShadow: val > 0.4 ? `0 0 8px ${colorHex}` : 'none', transition: 'height 0.1s ease' }} />
                <span style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Track Selection */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="cyber-btn"
            style={{ padding: '6px 14px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={handleTogglePlay}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button 
            className="cyber-btn"
            style={{ padding: '6px 10px', fontSize: '0.74rem' }}
            onClick={handleStop}
            title="Stop Music & Reset Avatar"
          >
            <Square size={13} />
          </button>
        </div>

        {/* Preset Tracks */}
        <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', flex: 1 }}>
          {musicService.presetTracks.map((trk) => {
            const isCurrent = isPlaying && currentTrack?.id === trk.id;
            return (
              <button
                key={trk.id}
                onClick={() => handlePlayPreset(trk.id)}
                style={{
                  flex: 1,
                  background: isCurrent ? `${colorHex}25` : 'rgba(5, 8, 17, 0.7)',
                  border: isCurrent ? `1px solid ${colorHex}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  padding: '5px 6px',
                  color: isCurrent ? colorHex : 'var(--text-dim)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-rajdhani)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                ♫ {trk.name}
              </button>
            );
          })}
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
          style={{ padding: '6px 10px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
          onClick={() => fileInputRef.current?.click()}
          title="Upload your own local audio file for AURA to dance to"
        >
          <Upload size={12} /> LOAD AUDIO
        </button>
      </div>
    </div>
  );
}
