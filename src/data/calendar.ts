import type { CalendarEvent } from '../types';
// import { mockLeads } from './leads'; // unused

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-001',
    title: 'Demo with TechFlow Solutions',
    description: 'Enterprise CRM demo for Sarah Mitchell and technical team',
    date: '2025-01-16',
    time: '10:00',
    duration: 60,
    type: 'demo',
    leadId: 'lead-001',
    color: '#3B82F6'
  },
  {
    id: 'evt-002',
    title: 'Discovery Call - Nova Retail Group',
    description: 'Initial qualification call with Lisa Thompson',
    date: '2025-01-16',
    time: '14:00',
    duration: 30,
    type: 'call',
    leadId: 'lead-005',
    color: '#10B981'
  },
  {
    id: 'evt-003',
    title: 'Proposal Review - Greenfield Manufacturing',
    description: 'Revised proposal with volume discounts for Marcus Johnson',
    date: '2025-01-17',
    time: '11:00',
    duration: 45,
    type: 'meeting',
    leadId: 'lead-002',
    color: '#F59E0B'
  },
  {
    id: 'evt-004',
    title: 'Contract Finalization - Summit Financial',
    description: 'Legal review of redlines with David Park',
    date: '2025-01-17',
    time: '15:30',
    duration: 60,
    type: 'meeting',
    leadId: 'lead-004',
    color: '#EF4444'
  },
  {
    id: 'evt-005',
    title: 'Security Questionnaire Follow-up',
    description: 'Check SOC2/HIPAA review status with Elena Rodriguez',
    date: '2025-01-15',
    time: '09:00',
    duration: 30,
    type: 'call',
    leadId: 'lead-003',
    color: '#10B981'
  },
  {
    id: 'evt-006',
    title: 'Board Presentation Prep - Meridian Energy',
    description: 'Finalize ROI deck for Jan 20 board meeting',
    date: '2025-01-19',
    time: '10:00',
    duration: 90,
    type: 'meeting',
    leadId: 'lead-008',
    color: '#8B5CF6'
  },
  {
    id: 'evt-007',
    title: 'Technical Deep-dive - Apex Logistics',
    description: 'API specs review and 20-vehicle pilot scope',
    date: '2025-01-20',
    time: '13:00',
    duration: 60,
    type: 'meeting',
    leadId: 'lead-006',
    color: '#3B82F6'
  },
  {
    id: 'evt-008',
    title: 'Cold Chain Pilot Launch - FreshFoods',
    description: 'Deploy 200 sensors across 5 distribution centers',
    date: '2025-01-20',
    time: '08:00',
    duration: 120,
    type: 'other',
    leadId: 'lead-013',
    color: '#06B6D4'
  },
  {
    id: 'evt-009',
    title: 'Ownership Group Presentation - Stellar Hospitality',
    description: 'Multi-property dashboard and ROI breakdown',
    date: '2025-01-21',
    time: '14:00',
    duration: 60,
    type: 'meeting',
    leadId: 'lead-015',
    color: '#EC4899'
  },
  {
    id: 'evt-010',
    title: 'AS9100 Compliance Demo - Precision Aerospace',
    description: 'Supplier quality module and first article inspection',
    date: '2025-01-21',
    time: '10:00',
    duration: 45,
    type: 'demo',
    leadId: 'lead-012',
    color: '#3B82F6'
  },
  {
    id: 'evt-011',
    title: 'Pilot Coordination - Velocity Sports',
    description: 'Marketing team sync for 3-game pilot launch',
    date: '2025-01-22',
    time: '11:00',
    duration: 45,
    type: 'meeting',
    leadId: 'lead-010',
    color: '#F59E0B'
  },
  {
    id: 'evt-012',
    title: 'NOC Technical Workshop - NextGen Telecom',
    description: 'SNMP integration and NetFlow analysis requirements',
    date: '2025-01-23',
    time: '14:00',
    duration: 90,
    type: 'meeting',
    leadId: 'lead-016',
    color: '#6366F1'
  },
  {
    id: 'evt-013',
    title: 'Grant Timeline Update - Meridian University',
    description: 'Funding decision moved to March 20',
    date: '2025-01-20',
    time: '16:00',
    duration: 30,
    type: 'call',
    leadId: 'lead-017',
    color: '#10B981'
  },
  {
    id: 'evt-014',
    title: 'GDPR Addendum Delivery - Nordic Biotech',
    description: '21 CFR Part 11 validation and EU data residency',
    date: '2025-01-17',
    time: '09:00',
    duration: 30,
    type: 'call',
    leadId: 'lead-019',
    color: '#10B981'
  },
  {
    id: 'evt-015',
    title: 'Pricing Finalization - Quantum Financial',
    description: '3-year term, 50+ users, volume discount negotiation',
    date: '2025-01-16',
    time: '16:00',
    duration: 45,
    type: 'meeting',
    leadId: 'lead-020',
    color: '#EF4444'
  },
  {
    id: 'evt-016',
    title: 'Implementation Planning - Global Insurance',
    description: 'Enterprise rollout for 12K claims/month',
    date: '2025-01-16',
    time: '10:30',
    duration: 60,
    type: 'meeting',
    leadId: 'lead-011',
    color: '#8B5CF6'
  },
  {
    id: 'evt-017',
    title: 'Team Standup',
    description: 'Daily pipeline review and blockers',
    date: '2025-01-15',
    time: '08:30',
    duration: 15,
    type: 'other',
    color: '#6B7280'
  },
  {
    id: 'evt-018',
    title: 'Team Standup',
    description: 'Daily pipeline review and blockers',
    date: '2025-01-16',
    time: '08:30',
    duration: 15,
    type: 'other',
    color: '#6B7280'
  },
  {
    id: 'evt-019',
    title: 'Team Standup',
    description: 'Daily pipeline review and blockers',
    date: '2025-01-17',
    time: '08:30',
    duration: 15,
    type: 'other',
    color: '#6B7280'
  },
  {
    id: 'evt-020',
    title: 'Pipeline Review with Manager',
    description: 'Weekly forecast and deal progression',
    date: '2025-01-17',
    time: '16:00',
    duration: 30,
    type: 'meeting',
    color: '#6B7280'
  },
  {
    id: 'evt-021',
    title: 'Compliance Training Deadline',
    description: 'Annual data privacy and security training',
    date: '2025-01-31',
    time: '23:59',
    duration: 60,
    type: 'other',
    color: '#EF4444'
  }
];

export const getEventsByDate = (date: string) => 
  mockCalendarEvents.filter(event => event.date === date);

export const getEventsByLeadId = (leadId: string) => 
  mockCalendarEvents.filter(event => event.leadId === leadId);

export const getEventsByType = (type: CalendarEvent['type']) => 
  mockCalendarEvents.filter(event => event.type === type);

export const getEventsForMonth = (year: number, month: number) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  
  return mockCalendarEvents.filter(event => 
    event.date >= startStr && event.date <= endStr
  );
};

export const getEventsForDateRange = (startDate: string, endDate: string) => 
  mockCalendarEvents.filter(event => 
    event.date >= startDate && event.date <= endDate
  );