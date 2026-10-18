import type { Task } from '../types';
// import { mockLeads } from './leads'; // unused

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Send revised proposal to Greenfield Manufacturing',
    description: 'Include volume discounts and 3-year TCO comparison as requested by CFO',
    dueDate: '2025-01-15',
    priority: 'high',
    completed: false,
    leadId: 'lead-002',
    createdAt: '2025-01-13T16:45:00Z'
  },
  {
    id: 'task-002',
    title: 'Schedule demo with TechFlow technical team',
    description: 'Coordinate calendars for Sarah Mitchell and 3 technical stakeholders',
    dueDate: '2025-01-16',
    priority: 'high',
    completed: false,
    leadId: 'lead-001',
    createdAt: '2025-01-14T10:30:00Z'
  },
  {
    id: 'task-003',
    title: 'Follow up on security questionnaire - BrightPath Healthcare',
    description: 'Check status of SOC2 review and HIPAA attestation review',
    dueDate: '2025-01-15',
    priority: 'high',
    completed: false,
    leadId: 'lead-003',
    createdAt: '2025-01-11T13:20:00Z'
  },
  {
    id: 'task-004',
    title: 'Finalize contract terms with Summit Financial legal',
    description: 'Review redlines on auto-renewal clause and data residency requirements',
    dueDate: '2025-01-17',
    priority: 'high',
    completed: false,
    leadId: 'lead-004',
    createdAt: '2025-01-14T09:00:00Z'
  },
  {
    id: 'task-005',
    title: 'Discovery call with Nova Retail Group',
    description: 'Initial qualification call - understand inventory challenges and timeline',
    dueDate: '2025-01-16',
    priority: 'medium',
    completed: false,
    leadId: 'lead-005',
    createdAt: '2025-01-10T11:00:00Z'
  },
  {
    id: 'task-006',
    title: 'Technical deep-dive with Apex Logistics engineering',
    description: 'Review API specs and pilot scope for 20 vehicles',
    dueDate: '2025-01-20',
    priority: 'medium',
    completed: false,
    leadId: 'lead-006',
    createdAt: '2025-01-12T08:30:00Z'
  },
  {
    id: 'task-007',
    title: 'Send student engagement metrics to Catalyst Education',
    description: 'Prepare report showing 23% improvement in course completion rates',
    dueDate: '2025-01-15',
    priority: 'medium',
    completed: false,
    leadId: 'lead-007',
    createdAt: '2025-01-09T14:15:00Z'
  },
  {
    id: 'task-008',
    title: 'Prepare board presentation for Meridian Energy',
    description: 'ROI model showing 18-month payback and 15-20% maintenance savings',
    dueDate: '2025-01-19',
    priority: 'high',
    completed: false,
    leadId: 'lead-008',
    createdAt: '2025-01-13T11:30:00Z'
  },
  {
    id: 'task-009',
    title: 'Coordinate pilot with Velocity Sports marketing',
    description: '3 game days pilot - track app sessions, concessions, merchandise',
    dueDate: '2025-01-22',
    priority: 'high',
    completed: false,
    leadId: 'lead-010',
    createdAt: '2025-01-12T15:45:00Z'
  },
  {
    id: 'task-010',
    title: 'Finalize implementation timeline - Global Insurance',
    description: 'Enterprise rollout plan for 12,000 claims/month',
    dueDate: '2025-01-16',
    priority: 'high',
    completed: false,
    leadId: 'lead-011',
    createdAt: '2025-01-14T10:15:00Z'
  },
  {
    id: 'task-011',
    title: 'Schedule AS9100 compliance demo - Precision Aerospace',
    description: 'Demo supplier quality module and first article inspection workflow',
    dueDate: '2025-01-21',
    priority: 'medium',
    completed: false,
    leadId: 'lead-012',
    createdAt: '2025-01-11T09:30:00Z'
  },
  {
    id: 'task-012',
    title: 'Launch cold chain pilot - FreshFoods Distribution',
    description: 'Deploy 200 sensors across 5 distribution centers',
    dueDate: '2025-01-20',
    priority: 'high',
    completed: false,
    leadId: 'lead-013',
    createdAt: '2025-01-13T14:20:00Z'
  },
  {
    id: 'task-013',
    title: 'Present to Stellar Hospitality ownership group',
    description: 'Multi-property dashboard and property-level ROI breakdown',
    dueDate: '2025-01-21',
    priority: 'high',
    completed: false,
    leadId: 'lead-015',
    createdAt: '2025-01-14T08:45:00Z'
  },
  {
    id: 'task-014',
    title: 'Technical workshop with NextGen Telecom NOC',
    description: 'SNMP trap integration and NetFlow analysis requirements',
    dueDate: '2025-01-23',
    priority: 'medium',
    completed: false,
    leadId: 'lead-016',
    createdAt: '2025-01-12T12:00:00Z'
  },
  {
    id: 'task-015',
    title: 'Follow up on grant funding - Meridian University',
    description: 'Grant decision moved to March 20. Update implementation timeline.',
    dueDate: '2025-01-20',
    priority: 'medium',
    completed: false,
    leadId: 'lead-017',
    createdAt: '2025-01-14T13:12:00Z'
  },
  {
    id: 'task-016',
    title: 'Send GDPR compliance addendum - Nordic Biotech',
    description: '21 CFR Part 11 validation pack and EU data residency confirmation',
    dueDate: '2025-01-17',
    priority: 'high',
    completed: false,
    leadId: 'lead-019',
    createdAt: '2025-01-13T09:00:00Z'
  },
  {
    id: 'task-017',
    title: 'Finalize 3-year pricing - Quantum Financial',
    description: 'Negotiate 50+ user volume discount. Competitor at $180/user/mo.',
    dueDate: '2025-01-16',
    priority: 'high',
    completed: false,
    leadId: 'lead-020',
    createdAt: '2025-01-14T11:00:00Z'
  },
  {
    id: 'task-018',
    title: 'Update CRM with Q4 pipeline review notes',
    description: 'Consolidate notes from all deal reviews and update probabilities',
    dueDate: '2025-01-15',
    priority: 'medium',
    completed: true,
    createdAt: '2025-01-10T17:00:00Z'
  },
  {
    id: 'task-019',
    title: 'Prepare weekly activity report for manager',
    description: 'Calls made, connects, opportunities advanced, pipeline changes',
    dueDate: '2025-01-17',
    priority: 'medium',
    completed: true,
    createdAt: '2025-01-12T16:00:00Z'
  },
  {
    id: 'task-020',
    title: 'Complete compliance training module',
    description: 'Annual data privacy and security awareness training',
    dueDate: '2025-01-31',
    priority: 'low',
    completed: false,
    createdAt: '2025-01-01T09:00:00Z'
  }
];

export const getTasksByLeadId = (leadId: string) => 
  mockTasks.filter(task => task.leadId === leadId);

export const getIncompleteTasks = () => 
  mockTasks.filter(task => !task.completed);

export const getCompletedTasks = () => 
  mockTasks.filter(task => task.completed);

export const getTasksByPriority = (priority: Task['priority']) => 
  mockTasks.filter(task => task.priority === priority);

export const getOverdueTasks = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return mockTasks.filter(task => {
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return !task.completed && due < today;
  });
};

export const getUpcomingTasks = (days = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(future.getDate() + days);
  return mockTasks.filter(task => {
    if (task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due <= future;
  });
};