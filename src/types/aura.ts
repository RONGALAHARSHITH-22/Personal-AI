export type AvatarState = 'idle' | 'listening' | 'thinking' | 'talking' | 'celebrating' | 'dancing';

export type DanceStyle = 'hip_hop' | 'freestyle' | 'cinematic';

export interface ColorTheme {
  id: string;
  name: string;
  hex: string;
  accent: string;
}

export interface AgentStep {
  id: string;
  tool: string;
  description: string;
  params?: Record<string, any>;
  requiresConfirmation: boolean;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
}

export interface AgentPlan {
  task: string;
  planId: string;
  steps: AgentStep[];
}

export interface AgentLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'security';
}

export interface AudioTelemetry {
  level: number;
  bass: number;
  mid: number;
  treble: number;
  frequencies?: Uint8Array;
}

export interface ChatMessage {
  sender: 'user' | 'aura';
  text: string;
  timestamp?: number;
}

export interface SystemInfo {
  os: string;
  release: string;
  architecture: string;
  processor: string;
  uptime: number;
  cpuPercent: number;
  memory: {
    totalMB: number;
    availableMB: number;
    percentUsed: number;
  };
}
