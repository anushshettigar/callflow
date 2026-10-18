import type { KPIData, ChartDataPoint } from '../types';

export const mockKPIs: KPIData[] = [
  {
    label: 'Calls Today',
    value: 24,
    change: 12,
    trend: 'up',
    icon: 'Phone'
  },
  {
    label: 'Connect Rate',
    value: '38%',
    change: 5,
    trend: 'up',
    icon: 'Target'
  },
  {
    label: 'Talk Time',
    value: '3h 42m',
    change: -8,
    trend: 'down',
    icon: 'Clock'
  },
  {
    label: 'Pipeline Value',
    value: '$2.8M',
    change: 15,
    trend: 'up',
    icon: 'DollarSign'
  },
  {
    label: 'Deals Closed',
    value: 3,
    change: 50,
    trend: 'up',
    icon: 'CheckCircle'
  },
  {
    label: 'Tasks Completed',
    value: 18,
    change: -10,
    trend: 'down',
    icon: 'TaskSquare'
  }
];

export const mockChartData: ChartDataPoint[] = [
  { date: '2025-01-08', calls: 42, connected: 18, duration: 285, revenue: 45000 },
  { date: '2025-01-09', calls: 38, connected: 15, duration: 245, revenue: 38000 },
  { date: '2025-01-10', calls: 45, connected: 20, duration: 312, revenue: 52000 },
  { date: '2025-01-11', calls: 35, connected: 14, duration: 220, revenue: 31000 },
  { date: '2025-01-12', calls: 48, connected: 22, duration: 340, revenue: 58000 },
  { date: '2025-01-13', calls: 41, connected: 17, duration: 275, revenue: 42000 },
  { date: '2025-01-14', calls: 24, connected: 9, duration: 185, revenue: 28000 }
];

export const mockRecentActivity = [
  {
    id: 'act-001',
    type: 'call' as const,
    title: 'Call completed with Summit Financial',
    description: 'Contract negotiation - 45 min',
    timestamp: '2025-01-14T14:15:00Z',
    leadName: 'David Park',
    outcome: 'positive'
  },
  {
    id: 'act-002',
    type: 'email' as const,
    title: 'Proposal sent to Greenfield Manufacturing',
    description: 'Revised with volume discounts',
    timestamp: '2025-01-14T13:30:00Z',
    leadName: 'Marcus Johnson',
    outcome: 'neutral'
  },
  {
    id: 'act-003',
    type: 'call' as const,
    title: 'Call completed with Meridian Energy',
    description: 'Board presentation prep - 75 min',
    timestamp: '2025-01-14T11:45:00Z',
    leadName: 'James Wilson',
    outcome: 'positive'
  },
  {
    id: 'act-004',
    type: 'meeting' as const,
    title: 'Meeting: Velocity Sports pilot coordination',
    description: 'Marketing team sync - 45 min',
    timestamp: '2025-01-14T10:30:00Z',
    leadName: 'Thomas Anderson',
    outcome: 'neutral'
  },
  {
    id: 'act-005',
    type: 'call' as const,
    title: 'Missed call from Precision Aerospace',
    description: 'Callback scheduled for tomorrow',
    timestamp: '2025-01-14T11:15:00Z',
    leadName: 'Kevin O\'Connor',
    outcome: 'negative'
  },
  {
    id: 'act-006',
    type: 'task' as const,
    title: 'Task completed: Q4 pipeline review',
    description: 'Updated probabilities for 15 deals',
    timestamp: '2025-01-14T09:00:00Z',
    outcome: 'positive'
  },
  {
    id: 'act-007',
    type: 'call' as const,
    title: 'Voicemail left for Nova Retail',
    description: 'Discovery call scheduling',
    timestamp: '2025-01-14T09:30:00Z',
    leadName: 'Lisa Thompson',
    outcome: 'neutral'
  },
  {
    id: 'act-008',
    type: 'call' as const,
    title: 'Incoming call from BrightPath Healthcare',
    description: 'Technical questions - 13 min',
    timestamp: '2025-01-14T08:28:00Z',
    leadName: 'Elena Rodriguez',
    outcome: 'positive'
  }
];

export const mockQuickActions = [
  {
    id: 'qa-001',
    label: 'Start Power Dialer',
    description: 'Auto-dial high-priority leads',
    icon: 'Zap',
    action: 'power-dialer',
    primary: true
  },
  {
    id: 'qa-002',
    label: 'Log Call',
    description: 'Manually log a call activity',
    icon: 'Phone',
    action: 'log-call',
    primary: false
  },
  {
    id: 'qa-003',
    label: 'Schedule Demo',
    description: 'Book a product demonstration',
    icon: 'Calendar',
    action: 'schedule-demo',
    primary: false
  },
  {
    id: 'qa-004',
    label: 'Create Task',
    description: 'Add a follow-up or reminder',
    icon: 'Plus',
    action: 'create-task',
    primary: false
  },
  {
    id: 'qa-005',
    label: 'Send Email',
    description: 'Compose and send outreach',
    icon: 'Mail',
    action: 'send-email',
    primary: false
  },
  {
    id: 'qa-006',
    label: 'View Reports',
    description: 'Access analytics and reports',
    icon: 'BarChart2',
    action: 'view-reports',
    primary: false
  }
];

export const mockDailyProgress = {
  callsTarget: 50,
  callsMade: 24,
  connectsTarget: 20,
  connectsMade: 9,
  talkTimeTarget: 300,
  talkTimeActual: 222,
  revenueTarget: 100000,
  revenueActual: 28000
};

export const mockLeadsWaiting = [
  { id: 'lead-001', name: 'Sarah Mitchell', company: 'TechFlow Solutions', priority: 'high' as const, nextAction: 'Demo tomorrow 10 AM' },
  { id: 'lead-004', name: 'David Park', company: 'Summit Financial', priority: 'high' as const, nextAction: 'Contract finalization' },
  { id: 'lead-011', name: 'Patricia Hughes', company: 'Global Insurance', priority: 'high' as const, nextAction: 'Implementation timeline' },
  { id: 'lead-020', name: 'Michael Torres', company: 'Quantum Financial', priority: 'high' as const, nextAction: 'Pricing negotiation' },
  { id: 'lead-002', name: 'Marcus Johnson', company: 'Greenfield Mfg', priority: 'high' as const, nextAction: 'Proposal review' }
];

export const mockEarnings = {
  baseSalary: 85000,
  commissionYTD: 42500,
  quotaAttainment: 87,
  acceleratorTier: 'Tier 2 (1.5x)',
  nextMilestone: { label: 'Tier 3 (2x)', amount: 15000 }
};