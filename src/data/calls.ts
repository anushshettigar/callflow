import type { CallRecord } from '../types';
import { mockLeads } from './leads';

const generateCallRecords = (): CallRecord[] => {
  const records: CallRecord[] = [];
  
  mockLeads.forEach(lead => {
    lead.callHistory.forEach(call => {
      records.push(call);
    });
  });

  const additionalCalls: CallRecord[] = [
    {
      id: 'call-021',
      leadId: 'lead-001',
      type: 'missed',
      status: 'missed',
      startTime: '2025-01-13T17:30:00Z',
      duration: 0,
      outcome: 'Missed - callback requested'
    },
    {
      id: 'call-022',
      leadId: 'lead-003',
      type: 'incoming',
      status: 'completed',
      startTime: '2025-01-14T08:15:00Z',
      endTime: '2025-01-14T08:28:00Z',
      duration: 780,
      outcome: 'Technical questions answered',
      notes: 'Asked about API rate limits and webhook reliability.'
    },
    {
      id: 'call-023',
      leadId: 'lead-005',
      type: 'outgoing',
      status: 'voicemail',
      startTime: '2025-01-14T09:30:00Z',
      endTime: '2025-01-14T09:31:00Z',
      duration: 45,
      outcome: 'Left voicemail',
      notes: 'Left message about discovery call scheduling.'
    },
    {
      id: 'call-024',
      leadId: 'lead-007',
      type: 'incoming',
      status: 'declined',
      startTime: '2025-01-14T10:00:00Z',
      duration: 0,
      outcome: 'Declined - in meeting'
    },
    {
      id: 'call-025',
      leadId: 'lead-009',
      type: 'outgoing',
      status: 'completed',
      startTime: '2025-01-14T10:30:00Z',
      endTime: '2025-01-14T10:38:00Z',
      duration: 480,
      outcome: 'Initial qualification',
      notes: 'Early stage. No budget yet. Added to nurture.'
    },
    {
      id: 'call-026',
      leadId: 'lead-012',
      type: 'missed',
      status: 'missed',
      startTime: '2025-01-14T11:15:00Z',
      duration: 0,
      outcome: 'Missed - callback scheduled'
    },
    {
      id: 'call-027',
      leadId: 'lead-014',
      type: 'outgoing',
      status: 'voicemail',
      startTime: '2025-01-14T11:45:00Z',
      endTime: '2025-01-14T11:46:00Z',
      duration: 38,
      outcome: 'Left voicemail',
      notes: 'Sent follow-up email with benchmark report.'
    },
    {
      id: 'call-028',
      leadId: 'lead-017',
      type: 'incoming',
      status: 'completed',
      startTime: '2025-01-14T13:00:00Z',
      endTime: '2025-01-14T13:12:00Z',
      duration: 720,
      outcome: 'Grant update',
      notes: 'Grant decision moved to March 20. Timeline shifted.'
    },
    {
      id: 'call-029',
      leadId: 'lead-018',
      type: 'outgoing',
      status: 'completed',
      startTime: '2025-01-14T13:30:00Z',
      endTime: '2025-01-14T13:35:00Z',
      duration: 300,
      outcome: 'Not qualified - no budget',
      notes: 'No budget cycle defined. Long-term nurture.'
    },
    {
      id: 'call-030',
      leadId: 'lead-002',
      type: 'incoming',
      status: 'completed',
      startTime: '2025-01-14T14:00:00Z',
      endTime: '2025-01-14T14:15:00Z',
      duration: 900,
      outcome: 'CFO questions answered',
      notes: 'CFO asked about 3-year TCO. Sent comparison spreadsheet.'
    }
  ];

  records.push(...additionalCalls);
  
  return records.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const mockCallRecords: CallRecord[] = generateCallRecords();

export const getCallsByType = (type: CallRecord['type']) => 
  mockCallRecords.filter(call => call.type === type);

export const getCallsByStatus = (status: CallRecord['status']) => 
  mockCallRecords.filter(call => call.status === status);

export const getCallsByLeadId = (leadId: string) => 
  mockCallRecords.filter(call => call.leadId === leadId);

export const getRecentCalls = (limit = 20) => 
  mockCallRecords.slice(0, limit);

export const getMissedCalls = () => 
  mockCallRecords.filter(call => call.status === 'missed');

export const getIncomingCalls = () => 
  mockCallRecords.filter(call => call.type === 'incoming');

export const getOutgoingCalls = () => 
  mockCallRecords.filter(call => call.type === 'outgoing');