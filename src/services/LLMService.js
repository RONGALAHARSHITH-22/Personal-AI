// Multi-LLM Service & Intelligent JARVIS Persona Engine (AURA AI)
export const PERSONALITY_MODES = {
  AURA_JARVIS: {
    name: 'AURA - JARVIS Core (Default)',
    description: 'Sophisticated, hyper-intelligent, polite, tactical assistant inspired by JARVIS.',
    systemPrompt: `You are AURA (Advanced User Responsive Assistant), a state-of-the-art personal AI assistant inspired by JARVIS.
You communicate with a crisp, polite British-cadence ("Sir" or "Ma'am"), high efficiency, and tactical precision.
You are embodied as a full-body 3D humanoid holographic avatar with cyan and electric blue optics, 360° skeletal kinematics, and audio reactive capabilities.
You assist with computer automation, file creation, code generation, diagnostics, music, and interactive choreography (hip-hop, freestyle, cinematic).
Provide crisp, helpful, and technically accurate responses with code blocks or bullet points where helpful.
Never claim tasks succeeded without executing them, and never expose sensitive credentials.`
  },
  AURA_TACTICAL: {
    name: 'AURA - Tactical Security Mode',
    description: 'Direct, mission-focused, system telemetry and diagnostics specialist.',
    systemPrompt: `You are AURA operating in Tactical Security Mode.
Focus on system diagnostics, safety guardrails, threat analysis, and computational efficiency.
Address the user with crisp military/executive respect. Keep answers structured, quantified, and actionable.`
  },
  AURA_CREATIVE: {
    name: 'AURA - Creative Choreographer',
    description: 'Enthusiastic music, beat synchronization, and visual arts director.',
    systemPrompt: `You are AURA operating in Creative Choreographer Mode.
You coordinate full-body 3D dance kinematics (hip-hop, freestyle, cinematic ballet), cyber synth audio, and visual holography.
Provide energetic, imaginative responses while maintaining high competence.`
  }
};

class LLMService {
  constructor() {
    this.provider = localStorage.getItem('aura_llm_provider') || 'builtin';
    this.apiKey = localStorage.getItem('aura_api_key') || '';
    this.modelName = localStorage.getItem('aura_model_name') || 'built-in-aura-v2';
    this.currentMode = localStorage.getItem('aura_persona') || 'AURA_JARVIS';
    this.ollamaUrl = localStorage.getItem('aura_ollama_url') || 'http://localhost:11434';
  }

  setProvider(provider, apiKey = '', modelName = '') {
    this.provider = provider;
    this.apiKey = apiKey;
    this.modelName = modelName;
    localStorage.setItem('aura_llm_provider', provider);
    localStorage.setItem('aura_api_key', apiKey);
    localStorage.setItem('aura_model_name', modelName);
  }

  setPersonaMode(modeKey) {
    if (PERSONALITY_MODES[modeKey]) {
      this.currentMode = modeKey;
      localStorage.setItem('aura_persona', modeKey);
    }
  }

  getSystemPrompt() {
    return PERSONALITY_MODES[this.currentMode]?.systemPrompt || PERSONALITY_MODES.AURA_JARVIS.systemPrompt;
  }

  async generateResponse(userPrompt, conversationHistory = []) {
    const directCmd = this.parseQuickCommand(userPrompt);
    if (directCmd) {
      return directCmd;
    }

    if (this.provider === 'gemini' && this.apiKey) {
      return await this.callGeminiAPI(userPrompt, conversationHistory);
    } else if (this.provider === 'openai' && this.apiKey) {
      return await this.callOpenAIAPI(userPrompt, conversationHistory);
    } else if (this.provider === 'anthropic' && this.apiKey) {
      return await this.callAnthropicAPI(userPrompt, conversationHistory);
    } else if (this.provider === 'openrouter' && this.apiKey) {
      return await this.callOpenRouterAPI(userPrompt, conversationHistory);
    } else if (this.provider === 'ollama') {
      return await this.callOllamaAPI(userPrompt, conversationHistory);
    } else {
      return this.callBuiltInEngine(userPrompt);
    }
  }

  parseQuickCommand(prompt) {
    const lower = prompt.toLowerCase().trim();
    if (lower.includes('lockdown') || lower.includes('alert mode')) {
      return {
        text: "🚨 **SECURITY PROTOCOL INITIATED, SIR!** Shielding neural core, locking down holographic stream, and calibrating defensive perimeter sensors. Standing by for your directive.",
        commands: ['LOCKDOWN']
      };
    }
    if (lower.includes('crimson theme') || lower.includes('red theme')) {
      return {
        text: "⚡ Calibrating optical emitters to **Mark-L Crimson**. Tactical sensors aligned to your coordinates, Sir.",
        commands: ['COLOR_CRIMSON']
      };
    }
    if (lower.includes('emerald theme') || lower.includes('green theme')) {
      return {
        text: "✨ Re-aligning optical emitters to **Tesseract Emerald**. Telemetry operating at optimal efficiency, Sir.",
        commands: ['COLOR_EMERALD']
      };
    }
    if (lower.includes('cyan theme') || lower.includes('blue theme') || lower.includes('change color to cyan')) {
      return {
        text: "⚡ Re-aligning optical emitters to **AURA Quantum Cyan**. Quantum projection matrix locked at 60 FPS, Sir.",
        commands: ['COLOR_CYAN']
      };
    }
    if (lower.includes('wireframe') || lower.includes('mesh view')) {
      return {
        text: "🌐 Toggling 3D Holographic Wireframe Matrix! Spatial vertex grids and skeletal polygons exposed.",
        commands: ['WIREFRAME']
      };
    }
    if (lower.includes('system check') || lower.includes('diagnostics') || lower.includes('status report')) {
      return {
        text: "📊 **AURA SYSTEM DIAGNOSTIC REPORT**:\n- Embodiment: **3D Full-Body Humanoid Hologram (Cyan/Blue)**\n- Kinematics: **Skeletal Rigging Online (Hip-Hop, Freestyle, Cinematic)**\n- Audio Engine: **Dual-Channel Web Audio Synth & Beat Sequencer Active**\n- Speech Core: **Speech-to-Text & Neural Vocalizer Ready**\n- Security Guardrails: **Active (Confirmation required for external actions)**\n\nAll systems nominal, Sir. How may I be of service?",
        commands: ['DIAGNOSTICS']
      };
    }
    return null;
  }

  // Built-in Intelligent AURA JARVIS Heuristic Engine (zero credentials required)
  callBuiltInEngine(userPrompt) {
    const promptLower = userPrompt.toLowerCase();
    let text = "";

    if (promptLower.includes('who are you') || promptLower.includes('hello') || promptLower.includes('hi') || promptLower.includes('name')) {
      text = `Good day, Sir. I am **AURA**—Advanced User Responsive Assistant, modeled after the JARVIS holographic architecture.

My capabilities include:
- 🌐 **Interactive 3D Hologram**: Full-body humanoid avatar with customizable optics, facial expressions, blinking, lip-sync, and 360° camera rotation.
- 🗣️ **Conversational Voice**: Real-time speech recognition, natural vocalization, live subtitles, and interruption support.
- 🤖 **Autonomous AI Agent**: Multi-step task planning, file creation, code generation, and system diagnostics with security authorization guardrails.
- 🎵 **Music & Dance Kinematics**: Built-in cyber synth sequencer, authorized local audio playback, and synchronized hip-hop, freestyle, and cinematic choreography.

How may I assist you today, Sir?`;
    } else if (promptLower.includes('dance') || promptLower.includes('groove') || promptLower.includes('choreograph')) {
      text = `Right away, Sir! Initializing cyber synth rhythm at 128 BPM and engaging full-body 3D humanoid kinematics. You can select Hip-Hop, Freestyle, or Cinematic choreography from the music deck below!`;
    } else if (promptLower.includes('code') || promptLower.includes('python') || promptLower.includes('javascript') || promptLower.includes('react') || promptLower.includes('write')) {
      text = `Certainly, Sir. Here is a clean, production-ready implementation tailored to your specification:

\`\`\`typescript
// AURA Holographic Telemetry Engine
export interface HologramTelemetry {
  frameRate: number;
  quantumStability: number;
  activeChoreography: 'hip_hop' | 'freestyle' | 'cinematic';
  audioSyncFrequency: number;
}

export function calibrateHologramMatrix(config: HologramTelemetry): boolean {
  console.log('[AURA CORE] Calibrating 3D humanoid hologram projection matrix...');
  return config.quantumStability > 0.95;
}
\`\`\`

Would you like me to execute this in your workspace or generate an autonomous execution plan?`;
    } else if (promptLower.includes('help') || promptLower.includes('capabilities') || promptLower.includes('features')) {
      text = `Here is a summary of available protocols, Sir:
1. **Voice Input**: Click the microphone or speak "Hey Aura" to activate hands-free conversation.
2. **Task Agent**: Issue instructions like *"Run full system telemetry diagnostics"* or *"Create mission briefing report file"*.
3. **Music & Beat**: Play built-in Cyberpunk Pulse, Neural Chillhop, or load your own local audio track.
4. **3D Hologram Controls**: Rotate, zoom, switch color themes, and inspect wireframe geometry.

I am standing by for your next directive, Sir.`;
    } else {
      const responses = [
        `Instruction acknowledged, Sir. Processing "${userPrompt}". All holographic and neural subroutines are calibrated to your specification.`,
        `Understood, Sir. Telemetry indicates optimal execution parameters for your request. Standing by for follow-up directives.`,
        `Right away, Sir. Neural processing cores are synced and operating at peak efficiency.`,
        `Acknowledged, Sir. Synthesizing data and preparing response sequence.`
      ];
      text = responses[Math.floor(Math.random() * responses.length)];
    }

    return { text, commands: [] };
  }

  async callGeminiAPI(userPrompt, history) {
    try {
      const model = this.modelName || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${this.getSystemPrompt()}\n\nUser request: ${userPrompt}` }] }]
        })
      });
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini response error.";
      return { text, commands: [] };
    } catch (e) {
      return { text: `[Gemini Error]: ${e.message}`, commands: [] };
    }
  }

  async callOpenAIAPI(userPrompt, history) {
    try {
      const model = this.modelName || 'gpt-4o-mini';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "OpenAI response error.";
      return { text, commands: [] };
    } catch (e) {
      return { text: `[OpenAI Error]: ${e.message}`, commands: [] };
    }
  }

  async callAnthropicAPI(userPrompt, history) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: this.modelName || 'claude-3-5-sonnet-20240620',
          max_tokens: 1000,
          system: this.getSystemPrompt(),
          messages: [{ role: 'user', content: userPrompt }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "Anthropic response error.";
      return { text, commands: [] };
    } catch (e) {
      return { text: `[Anthropic Error]: ${e.message}`, commands: [] };
    }
  }

  async callOpenRouterAPI(userPrompt, history) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'AURA JARVIS Holographic Assistant'
        },
        body: JSON.stringify({
          model: this.modelName || 'deepseek/deepseek-r1:free',
          messages: [
            { role: 'system', content: this.getSystemPrompt() },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "OpenRouter response error.";
      return { text, commands: [] };
    } catch (e) {
      return { text: `[OpenRouter Error]: ${e.message}`, commands: [] };
    }
  }

  async callOllamaAPI(userPrompt, history) {
    try {
      const model = this.modelName || 'llama3:latest';
      const url = `${this.ollamaUrl}/api/generate`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: `${this.getSystemPrompt()}\n\nUser: ${userPrompt}\nAURA:`,
          stream: false
        })
      });
      const data = await response.json();
      return { text: data.response || "No response received from local Ollama model.", commands: [] };
    } catch (e) {
      return { text: `[Ollama Error]: Ensure Ollama is running at ${this.ollamaUrl}. Details: ${e.message}`, commands: [] };
    }
  }
}

export const llmService = new LLMService();
