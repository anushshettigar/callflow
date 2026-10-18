export interface Lead {
  id: string;
  name: string;
  company: string;
  product: string;
  email: string;
  phone: string;
  leadScore: number;
  intentScore: number;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  lastInteraction: string;
  nextAction: string;
  buyingSignals: string[];
  notes: string;
  callHistory: CallRecord[];
  icpScore: number;
  assignedAgent: string;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  leadId: string;
  type: 'incoming' | 'outgoing' | 'missed';
  status: 'completed' | 'missed' | 'declined' | 'voicemail' | 'in-progress';
  startTime: string;
  endTime?: string;
  duration: number;
  outcome?: string;
  notes?: string;
  recordingUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  leadId?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'call' | 'meeting' | 'followup' | 'demo' | 'other';
  leadId?: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  type: 'message' | 'system' | 'pinned';
  isAgent: boolean;
  needsInput?: boolean;
  actions?: { label: string; action: string }[];
}

export interface PulseChannel {
  id: string;
  name: string;
  description: string;
  type: 'role-agent' | 'task-agent' | 'channel';
  members: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  icon: string;
  color: string;
}

export interface KPIData {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface ChartDataPoint {
  date: string;
  calls: number;
  connected: number;
  duration: number;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'agent' | 'manager' | 'admin';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    autoDial: boolean;
  };
}

export interface CallState {
  status: 'idle' | 'requesting-permission' | 'calling' | 'connecting' | 'connected' | 'ended' | 'error';
  leadId?: string;
  stream?: MediaStream;
  timer: number;
  muted: boolean;
  error?: string;
}