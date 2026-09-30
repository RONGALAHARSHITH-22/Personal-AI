// Web Audio API Procedural Sci-Fi Sound Synthesizer
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.humGain = null;
    this.humOsc = null;
    this.isHumActive = false;
    this.analyser = null;
    this.dataArray = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Hologram Ambient Sub-Bass Hum
  toggleHologramHum(enable = true) {
    this.init();
    if (!this.ctx) return;

    if (enable) {
      if (this.isHumActive) return;
      try {
        this.humOsc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        this.humGain = this.ctx.createGain();

        this.humOsc.type = 'sine';
        this.humOsc.frequency.setValueAtTime(65, this.ctx.currentTime); // 65Hz deep cyber hum

        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime); // 0.5Hz pulse
        lfoGain.gain.setValueAtTime(4, this.ctx.currentTime);

        lfo.connect(this.humOsc.frequency);
        
        this.humGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        this.humGain.gain.exponentialRampToValueAtTime(0.06, this.ctx.currentTime + 1.5);

        this.humOsc.connect(this.humGain);
        this.humGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        this.humOsc.start();
        lfo.start();
        this.isHumActive = true;
      } catch (e) {
        console.warn('Audio hum error:', e);
      }
    } else {
      if (this.humGain && this.ctx) {
        try {
          this.humGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          setTimeout(() => {
            if (this.humOsc) this.humOsc.stop();
            this.isHumActive = false;
          }, 500);
        } catch (e) {
          this.isHumActive = false;
        }
      }
    }
  }

  // Futuristic UI Click Sound
  playClickSound() {
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Sci-Fi Hologram Boot / Activation Chime
  playBootChime() {
    this.init();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
      } catch (e) {}
    });
  }

  // Alert / Lockdown Alarm
  playAlertSiren() {
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // Get current audio volume level (0-1) for lip-sync & 3D pulses
  getAudioLevel() {
    if (!this.analyser || !this.dataArray) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    return sum / (this.dataArray.length * 255);
  }
}

export const audioSynth = new AudioSynthesizer();
