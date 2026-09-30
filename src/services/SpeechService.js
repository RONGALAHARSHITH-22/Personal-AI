// AURA Voice & Speech Recognition Core (JARVIS Architecture)
class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isWakeWordActive = true;
    this.wakeWord = 'aura';
    this.continuous = false;
    
    // Callbacks
    this.onSpeechResultCallback = null;
    this.onWakeWordTriggered = null;
    this.onSpeakingStateChange = null;
    this.onSubtitleCallback = null;
    this.onListeningChange = null;

    // Configurable voice metrics
    this.voicePitch = 1.05;
    this.voiceRate = 1.0;
    this.selectedVoice = null;
    this.availableVoices = [];

    this.initRecognition();
    this.loadVoices();
  }

  loadVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      const voices = this.synth.getVoices();
      this.availableVoices = voices;

      // Look for smooth, futuristic British or US female/neutral voices (JARVIS/AURA style)
      const auraVoice = voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Natural') ||
          v.name.includes('Google UK English Female') || 
          v.name.includes('Samantha') || 
          v.name.includes('Victoria') ||
          v.name.includes('Zira') ||
          v.name.includes('Karen') ||
          v.name.includes('English')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      this.selectedVoice = auraVoice || voices[0];
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onListeningChange) this.onListeningChange(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const candidateText = (finalTranscript || interimTranscript).trim();

        // Check for Wake-Word: "Hey Aura" / "Aura"
        if (this.isWakeWordActive) {
          const lower = candidateText.toLowerCase();
          if (lower.includes('hey aura') || lower.includes('aura') || lower.includes('jarvis')) {
            if (this.onWakeWordTriggered) {
              this.onWakeWordTriggered(candidateText);
            }
          }
        }

        if (finalTranscript && this.onSpeechResultCallback) {
          this.onSpeechResultCallback(finalTranscript.trim());
        }
      };

      this.recognition.onend = () => {
        // If continuous listening mode is on, auto-restart
        if (this.continuous) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            if (this.onListeningChange) this.onListeningChange(false);
          }
        } else {
          this.isListening = false;
          if (this.onListeningChange) this.onListeningChange(false);
        }
      };

      this.recognition.onerror = (err) => {
        // Ignore aborted error on manual stop
        if (err.error !== 'aborted') {
          console.warn('Speech recognition warning:', err.error);
        }
        if (!this.continuous) {
          this.isListening = false;
          if (this.onListeningChange) this.onListeningChange(false);
        }
      };
    }
  }

  startListening(onResult, isContinuous = false) {
    if (!this.recognition) {
      console.warn('Web Speech API not available.');
      return false;
    }
    this.onSpeechResultCallback = onResult;
    this.continuous = isContinuous;

    // If currently speaking, interrupt before listening
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    try {
      this.recognition.start();
      this.isListening = true;
      if (this.onListeningChange) this.onListeningChange(true);
      return true;
    } catch (e) {
      this.isListening = false;
      return false;
    }
  }

  stopListening() {
    this.continuous = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.isListening = false;
      if (this.onListeningChange) this.onListeningChange(false);
    }
  }

  toggleListening(onResult) {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      return this.startListening(onResult, false);
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synth) return;

    // Interrupt previous vocalization immediately
    this.synth.cancel();

    // Clean markdown and formatting symbols for natural conversational vocalization
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Here is the requested code snippet.')
      .replace(/[*_#`~>]/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    if (!cleanText) return;

    // Broadcast subtitle
    if (this.onSubtitleCallback) {
      this.onSubtitleCallback(cleanText);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.pitch = this.voicePitch;
    utterance.rate = this.voiceRate;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (this.onSubtitleCallback) this.onSubtitleCallback('');
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (this.onSubtitleCallback) this.onSubtitleCallback('');
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (this.onSubtitleCallback) this.onSubtitleCallback('');
    }
  }
}

export const speechService = new SpeechService();
