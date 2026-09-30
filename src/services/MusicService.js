// AURA Authorized Music & Cyber Synth Beat Generator
class MusicService {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.bpm = 120;
    this.currentDanceStyle = 'hip_hop'; // hip_hop | freestyle | cinematic

    // Web Audio Sequencer State
    this.sequenceInterval = null;
    this.step = 0;

    // Local file player
    this.audioElement = null;
    this.mediaSource = null;

    // Presets
    this.presetTracks = [
      { id: 'cyber_house', name: 'Cyberpunk Pulse', bpm: 128, style: 'hip_hop', genre: 'Synthwave / Electro' },
      { id: 'lofi_chill', name: 'Neural Chillhop', bpm: 90, style: 'freestyle', genre: 'Lo-Fi Chillhop' },
      { id: 'cinematic_pulse', name: 'AURA Symphony Prime', bpm: 135, style: 'cinematic', genre: 'Cinematic Orchestral' }
    ];

    this.onTrackChange = null;
    this.onBeat = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesize Cybernetic Kick Drum
  playKick(time) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.35);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  // Synthesize Snare / Clap
  playSnare(time) {
    if (!this.audioCtx) return;
    // White noise buffer
    const bufferSize = this.audioCtx.sampleRate * 0.18;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.65, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    noise.start(time);
    noise.stop(time + 0.18);
  }

  // Synthesize Hi-Hat
  playHiHat(time) {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.05;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.gainNode);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // Synthesize Cyber Bass Note
  playBass(freq, time, duration = 0.2) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.connect(gain);
    gain.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  playPresetBeat(trackId = 'cyber_house') {
    this.initAudio();
    this.stop();

    const track = this.presetTracks.find(t => t.id === trackId) || this.presetTracks[0];
    this.currentTrack = track;
    this.bpm = track.bpm;
    this.currentDanceStyle = track.style;
    this.isPlaying = true;

    if (this.onTrackChange) this.onTrackChange(track);

    const stepTimeMs = (60 / this.bpm / 4) * 1000; // 16th note
    this.step = 0;

    this.sequenceInterval = setInterval(() => {
      const now = this.audioCtx.currentTime;
      const s = this.step % 16;

      // Kick drum on 0, 4, 8, 12 (4-on-the-floor)
      if (s % 4 === 0) {
        this.playKick(now);
        if (this.onBeat) this.onBeat(s);
      }

      // Snare on 4, 12
      if (s === 4 || s === 12) {
        this.playSnare(now);
      }

      // Hi-Hat every other step or 16th note
      if (s % 2 === 0 || s % 3 === 0) {
        this.playHiHat(now);
      }

      // Bassline arpeggio
      const bassNotes = [55, 55, 65, 55, 73.4, 55, 65, 82.4];
      if (s % 2 === 0) {
        const note = bassNotes[(s / 2) % bassNotes.length];
        this.playBass(note, now, 0.22);
      }

      this.step++;
    }, stepTimeMs);
  }

  // Load Authorized Local Audio File
  loadLocalAudio(file) {
    this.initAudio();
    this.stop();

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }

    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    audio.crossOrigin = 'anonymous';
    this.audioElement = audio;

    if (!this.mediaSource) {
      this.mediaSource = this.audioCtx.createMediaElementSource(audio);
      this.mediaSource.connect(this.gainNode);
    }

    audio.play().then(() => {
      this.isPlaying = true;
      this.currentTrack = {
        id: 'local_file',
        name: file.name.replace(/\.[^/.]+$/, ''),
        bpm: 124,
        style: this.currentDanceStyle,
        genre: 'User Local Audio'
      };
      if (this.onTrackChange) this.onTrackChange(this.currentTrack);
    }).catch(e => console.warn('Audio play notice:', e));

    audio.onended = () => {
      this.isPlaying = false;
      if (this.onTrackChange) this.onTrackChange(null);
    };
  }

  stop() {
    if (this.sequenceInterval) {
      clearInterval(this.sequenceInterval);
      this.sequenceInterval = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.currentTrack = null;
    if (this.onTrackChange) this.onTrackChange(null);
  }

  setDanceStyle(style) {
    this.currentDanceStyle = style;
  }

  // Real-time audio amplitude for visualizer and dance beat detection
  getAudioTelemetry() {
    if (!this.analyser) {
      return { level: 0, bass: 0, mid: 0, treble: 0, frequencies: new Uint8Array(64) };
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);

    let sum = 0;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;

    const len = data.length;
    for (let i = 0; i < len; i++) {
      sum += data[i];
      if (i < len * 0.2) bassSum += data[i];
      else if (i < len * 0.6) midSum += data[i];
      else trebleSum += data[i];
    }

    const level = Math.min(1.0, (sum / len) / 128);
    const bass = Math.min(1.0, (bassSum / (len * 0.2)) / 128);
    const mid = Math.min(1.0, (midSum / (len * 0.4)) / 128);
    const treble = Math.min(1.0, (trebleSum / (len * 0.4)) / 128);

    return { level, bass, mid, treble, frequencies: data };
  }
}

export const musicService = new MusicService();
