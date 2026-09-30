# ⚡ AURA — Advanced User Responsive Assistant

> **A futuristic personal AI assistant inspired by JARVIS, featuring a full-body interactive 3D holographic humanoid avatar, conversational voice synthesis, autonomous tool-based agent execution, and synchronized cyber synth choreography.**

---

## 🌟 Overview & Key Features

AURA is a functional personal AI assistant that unites 3D graphics, speech recognition, autonomous multi-step planning, and audio-reactive choreography.

### 🌐 1. Full-Body 3D Holographic Avatar
- **Humanoid Skeletal Rigging**: Full 3D anatomical skeletal mesh with chest breathing, arm wave kinematics, head nod & tilt, and leg positioning.
- **Optics & Holographic Shaders**: Translucent cyan and electric blue fresnel glow, wireframe toggle, and concentric rotating runic platform.
- **Scanning Laser Effects**: Real-time vertical laser scanning ring that sweeps across the avatar during diagnostics.
- **Facial Expressions & Lip-Sync**: Autonomous realistic eye blinking, glowing iris visors, and real-time lip-synchronization responding to voice audio amplitudes.
- **Multimodal Avatar States**:
  - `IDLE`: Relaxed breathing sway and ambient scanning.
  - `LISTENING`: Focused head tilt, heightened halo rotation, and mic sensitivity.
  - `THINKING`: Contemplative chin posture and neural compute pulse.
  - `TALKING`: Conversational hand gestures and procedural mouth lip-sync.
  - `CELEBRATING`: Fist-pumping victory jump with confetti fireworks.
  - `DANCING`: Synchronized Hip-Hop bounces, 360° Freestyle spins, or Cinematic sweeps.
- **3D Camera Controls**: OrbitControls with preset angles: `[FULL BODY]`, `[FACE / CHEST]`, and `[CINEMATIC]`.
- **Custom Model Extensibility**: Support for loading custom `.glb` / `.gltf` humanoid models with automatic holographic shader conversion.

### 🗣️ 2. Voice & Speech System
- **Real-Time Speech-to-Text**: Web Speech API integration with continuous listening option.
- **Wake-Word Detection**: Responds to `"Hey Aura"`, `"Aura"`, or `"Jarvis"`.
- **Natural Voice Synthesis**: Configurable British/US female and neutral cadences, with real-time pitch and speed calibration.
- **Live Subtitle HUD**: Glowing glassmorphism subtitle readout on the 3D stage.
- **Instant Interruption**: User speech immediately pauses assistant vocalization.

### 🤖 3. Autonomous Tool-Based AI Agent
- **Goal Decomposition & Planning**: Breaks high-level directives into ordered execution steps.
- **Tool Suite**:
  - `system_diagnostics`: Queries OS, CPU load, memory utilization, platform architecture, and WebGL telemetry.
  - `code_generator`: Synthesizes and validates code architectures.
  - `document_summary`: Extracts semantic insights from technical documents and logs.
  - `create_file`: Persists documents/scripts to designated workspace storage.
  - `browser_open`: Opens authorized web documentation or services.
  - `calculate`: Evaluates precision mathematical expressions.
- **Security Guardrail Protocol**: Mandatory confirmation modal for file creation, destructive actions, or external system access. Never claims completion without execution.
- **Real-Time Progress & Logs**: Animated progress indicator with streaming telemetry terminal.

### 🎵 4. Dance & Cyber Synth Music Station
- **Choreography Styles**:
  - **Hip-Hop**: Bouncing rhythm, arm popping, and aggressive head nodding.
  - **Freestyle**: 360-degree spins, wave glides, and fluid arm sweeps.
  - **Cinematic**: Balletic arabesques, graceful winged poses, and slow rotations.
- **Built-in Cyber Synth Sequencer**: Synthesizes 4-on-the-floor kick, noise snares, hi-hats, and bassline arpeggios in Web Audio API.
- **Preset Tracks**:
  - *Cyberpunk Pulse* (128 BPM, Hip-Hop)
  - *Neural Chillhop* (90 BPM, Freestyle)
  - *AURA Symphony Prime* (135 BPM, Cinematic)
- **Authorized Local Audio**: Drag-and-drop or select `.mp3`/`.wav` files for real-time FFT spectrum analysis and audio-reactive dancing.

### 🧠 5. Pluggable Multi-LLM Architecture
- **Zero-Credential Demo Mode**: Works immediately out-of-the-box with built-in heuristic intelligence without any API key required!
- **Google Gemini**: Gemini 1.5 / 2.0 Flash integration.
- **OpenAI**: GPT-4o and GPT-4o-mini.
- **Anthropic**: Claude 3.5 Sonnet.
- **OpenRouter**: DeepSeek-R1, Llama 3, Mistral.
- **Local Models**: Connects to local Ollama or LM Studio (`http://localhost:11434`).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+ (with virtual environment)

### 1. Backend Setup (FastAPI)
```bash
cd backend
# Activate Python virtual environment (Windows PowerShell)
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend API server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API will be running at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Vite)
In the project root directory:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Testing

### Backend Automated Test Suite
Run the 8 automated API and security tests:
```bash
backend\.venv\Scripts\python backend\tests\test_api.py
```
Output:
```
[PASS] /api/health passed
[PASS] /api/system/info passed: Windows AMD64
[PASS] /api/chat (dance detection) passed
[PASS] /api/agent/plan passed with 2 stages
[PASS] /api/agent/execute-step passed
[PASS] Security guardrail confirmation test passed (HTTP 403 on unconfirmed action)
[PASS] /api/agent/execute-step (code_generator) passed
[PASS] /api/agent/execute-step (document_summary) passed

ALL 8 AURA BACKEND TESTS PASSED SUCCESSFULLY!
```

### Production Build Validation
```bash
npm run build
```

---

## 📁 Project Architecture

```
├── backend/
│   ├── .env.example          # Backend environment variables
│   ├── main.py               # FastAPI application, agent tools, telemetry, chat engine
│   ├── requirements.txt      # FastAPI, Uvicorn, Pydantic, Psutil
│   └── tests/
│       └── test_api.py       # 8 automated unit & security guardrail tests
├── public/
├── src/
│   ├── components/
│   │   ├── AuraFullBodyAvatar.jsx   # Three.js / R3F humanoid avatar, scanning laser, platform
│   │   ├── AuraMusicDeck.jsx        # Cyber synth beat station & choreography selector
│   │   ├── AuraTaskPanel.jsx        # Autonomous agent planning & terminal execution logs
│   │   ├── ChatPanel.jsx            # Neural conversation stream with mic & audio playback
│   │   ├── CommandDeck.jsx          # Tactical controls (Arc core, diagnostics, mesh view)
│   │   ├── HologramControlsModal.jsx# Color matrix, pitch/rate calibration, GLB model loader
│   │   ├── HUDHeader.jsx            # Real-time telemetry (CPU, FPS, state badge, view switcher)
│   │   ├── LLMConfigModal.jsx       # Multi-LLM provider switcher (Gemini, OpenAI, Claude, Ollama)
│   │   └── SecurityConfirmationModal.jsx # Explicit user confirmation modal for security
│   ├── services/
│   │   ├── AIAgentService.js        # Goal planner & tool executor
│   │   ├── AudioSynth.js            # UI audio effects & hologram hum
│   │   ├── LLMService.js            # Heuristic & API LLM connector
│   │   ├── MusicService.js          # Web Audio synthesizer, sequencer & beat analyzer
│   │   └── SpeechService.js         # Web Speech recognition & vocalizer
│   ├── types/
│   │   └── aura.ts                  # TypeScript interface definitions
│   ├── App.jsx                      # Main application orchestrator
│   ├── index.css                    # Futuristic dark HUD styling & cyber glassmorphism
│   └── main.jsx                     # React entrypoint
├── package.json
├── tsconfig.json
├── vite.config.js
└── README.md
```

---

## 🛡️ Security & Privacy
- **Zero Key Leakage**: API credentials entered in settings are stored locally in the user's browser `localStorage` and never printed or sent to third-party loggers.
- **Safety Guardrail**: Any operation writing to the filesystem or opening external links triggers the `SecurityConfirmationModal` requiring explicit user authorization.
- **Audio Privacy**: Microphone stream is only active when toggled by the user or in wake-word detection mode.
