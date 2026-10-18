import type { Lead } from '../types';

export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'Sarah Mitchell',
    company: 'TechFlow Solutions',
    product: 'Enterprise CRM',
    email: 'sarah.mitchell@techflow.io',
    phone: '+1 (415) 555-0142',
    leadScore: 92,
    intentScore: 88,
    priority: 'high',
    status: 'qualified',
    lastInteraction: '2025-01-14T10:30:00Z',
    nextAction: 'Schedule demo with technical team',
    buyingSignals: [
      'Viewed pricing page 3 times this week',
      'Downloaded integration whitepaper',
      'Requested API documentation',
      'Attended webinar on automation workflows'
    ],
    notes: 'Decision maker for CRM migration. Currently using Salesforce but frustrated with costs. Team of 45 sales reps. Budget approved for Q1.',
    callHistory: [
      {
        id: 'call-001',
        leadId: 'lead-001',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-10T14:00:00Z',
        endTime: '2025-01-10T14:18:00Z',
        duration: 1080,
        outcome: 'Qualified - demo scheduled',
        notes: 'Confirmed budget authority and timeline. Technical evaluation needed.'
      },
      {
        id: 'call-002',
        leadId: 'lead-001',
        type: 'incoming',
        status: 'completed',
        startTime: '2025-01-12T09:15:00Z',
        endTime: '2025-01-12T09:22:00Z',
        duration: 420,
        outcome: 'Follow-up questions',
        notes: 'Asked about SSO integration and data migration timeline.'
      }
    ],
    icpScore: 95,
    assignedAgent: 'Alex Chen',
    createdAt: '2025-01-05T08:00:00Z'
  },
  {
    id: 'lead-002',
    name: 'Marcus Johnson',
    company: 'Greenfield Manufacturing',
    product: 'Supply Chain Analytics',
    email: 'marcus.j@greenfield-mfg.com',
    phone: '+1 (312) 555-0187',
    leadScore: 87,
    intentScore: 82,
    priority: 'high',
    status: 'proposal',
    lastInteraction: '2025-01-13T16:45:00Z',
    nextAction: 'Send revised proposal with volume discounts',
    buyingSignals: [
      'Requested pilot program details',
      'Shared current vendor pain points',
      'Inquired about implementation timeline',
      'CC\'d CFO on last email thread'
    ],
    notes: 'VP Operations. Managing 12 facilities. Current vendor contract expires March 2025. Strong champion but needs CFO sign-off.',
    callHistory: [
      {
        id: 'call-003',
        leadId: 'lead-002',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-08T11:00:00Z',
        endTime: '2025-01-08T11:35:00Z',
        duration: 2100,
        outcome: 'Proposal delivered',
        notes: 'Walked through ROI calculator. CFO wants 3-year TCO comparison.'
      }
    ],
    icpScore: 89,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-20T09:30:00Z'
  },
  {
    id: 'lead-003',
    name: 'Elena Rodriguez',
    company: 'BrightPath Healthcare',
    product: 'Patient Engagement Platform',
    email: 'elena.rodriguez@brightpathhealth.org',
    phone: '+1 (512) 555-0293',
    leadScore: 78,
    intentScore: 71,
    priority: 'medium',
    status: 'contacted',
    lastInteraction: '2025-01-11T13:20:00Z',
    nextAction: 'Follow up on security questionnaire',
    buyingSignals: [
      'Completed security assessment',
      'Asked about HIPAA compliance features',
      'Requested reference calls',
      'Evaluating 3 vendors simultaneously'
    ],
    notes: 'IT Director. 200-bed hospital network. Security review in progress. Decision by end of Q1.',
    callHistory: [
      {
        id: 'call-004',
        leadId: 'lead-003',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-06T15:30:00Z',
        endTime: '2025-01-06T15:42:00Z',
        duration: 720,
        outcome: 'Security questionnaire sent',
        notes: 'Sent SOC2 report and HIPAA attestation. Follow up in 1 week.'
      }
    ],
    icpScore: 82,
    assignedAgent: 'Jordan Park',
    createdAt: '2024-12-28T11:00:00Z'
  },
  {
    id: 'lead-004',
    name: 'David Park',
    company: 'Summit Financial Group',
    product: 'Compliance Automation',
    email: 'd.park@summitfinancial.com',
    phone: '+1 (212) 555-0156',
    leadScore: 94,
    intentScore: 91,
    priority: 'high',
    status: 'negotiation',
    lastInteraction: '2025-01-14T09:00:00Z',
    nextAction: 'Finalize contract terms with legal',
    buyingSignals: [
      'Legal review initiated',
      'Requested custom SLA terms',
      'Asked about on-premise deployment option',
      'Budget holder confirmed in meeting'
    ],
    notes: 'Chief Compliance Officer. FinTech regulatory pressure driving urgency. 500+ employees. Competitive bake-off with 2 vendors.',
    callHistory: [
      {
        id: 'call-005',
        leadId: 'lead-004',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-09T10:00:00Z',
        endTime: '2025-01-09T10:45:00Z',
        duration: 2700,
        outcome: 'Negotiation started',
        notes: 'Pushed back on auto-renewal clause. Legal to review redlines by Friday.'
      },
      {
        id: 'call-006',
        leadId: 'lead-004',
        type: 'incoming',
        status: 'completed',
        startTime: '2025-01-13T14:30:00Z',
        endTime: '2025-01-13T14:38:00Z',
        duration: 480,
        outcome: 'Contract terms clarification',
        notes: 'Confirmed data residency requirements. EU data must stay in EU.'
      }
    ],
    icpScore: 97,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-15T14:00:00Z'
  },
  {
    id: 'lead-005',
    name: 'Lisa Thompson',
    company: 'Nova Retail Group',
    product: 'Inventory Intelligence',
    email: 'lisa.thompson@novaretail.com',
    phone: '+1 (303) 555-0234',
    leadScore: 65,
    intentScore: 58,
    priority: 'medium',
    status: 'new',
    lastInteraction: '2025-01-10T11:00:00Z',
    nextAction: 'Discovery call scheduled for Jan 16',
    buyingSignals: [
      'Downloaded case study on stockout reduction',
      'Visited demo request page',
      'Subscribed to newsletter'
    ],
    notes: 'Supply Chain Director. 300 stores nationally. Early research phase. No budget confirmed yet.',
    callHistory: [],
    icpScore: 71,
    assignedAgent: 'Jordan Park',
    createdAt: '2025-01-08T16:00:00Z'
  },
  {
    id: 'lead-006',
    name: 'Robert Kim',
    company: 'Apex Logistics',
    product: 'Fleet Management',
    email: 'r.kim@apexlogistics.net',
    phone: '+1 (713) 555-0178',
    leadScore: 81,
    intentScore: 76,
    priority: 'high',
    status: 'qualified',
    lastInteraction: '2025-01-12T08:30:00Z',
    nextAction: 'Technical deep-dive with engineering',
    buyingSignals: [
      'Requested API rate limits documentation',
      'Asked about ELD integration',
      'Shared current fleet size: 280 vehicles',
      'Inquired about driver safety scoring'
    ],
    notes: 'Fleet Operations VP. Rapid growth from 150 to 280 vehicles in 18 months. Current solution cannot scale.',
    callHistory: [
      {
        id: 'call-007',
        leadId: 'lead-006',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-07T13:00:00Z',
        endTime: '2025-01-07T13:25:00Z',
        duration: 1500,
        outcome: 'Qualified - technical eval needed',
        notes: 'Engineering team to review API specs. Pilot with 20 vehicles proposed.'
      }
    ],
    icpScore: 85,
    assignedAgent: 'Morgan Lee',
    createdAt: '2025-01-03T10:00:00Z'
  },
  {
    id: 'lead-007',
    name: 'Amanda Foster',
    company: 'Catalyst Education',
    product: 'Learning Management System',
    email: 'amanda.foster@catalysted.org',
    phone: '+1 (617) 555-0345',
    leadScore: 73,
    intentScore: 69,
    priority: 'medium',
    status: 'contacted',
    lastInteraction: '2025-01-09T14:15:00Z',
    nextAction: 'Send student engagement metrics report',
    buyingSignals: [
      'Requested SCORM compliance details',
      'Asked about mobile app features',
      'Inquired about integration with SIS'
    ],
    notes: 'VP Academic Technology. 15,000 students across 4 campuses. Current LMS contract ends June 2025.',
    callHistory: [
      {
        id: 'call-008',
        leadId: 'lead-007',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-05T11:00:00Z',
        endTime: '2025-01-05T11:18:00Z',
        duration: 1080,
        outcome: 'Requirements gathered',
        notes: 'Needs LTI 1.3 support. Faculty adoption is key concern.'
      }
    ],
    icpScore: 76,
    assignedAgent: 'Morgan Lee',
    createdAt: '2025-01-02T09:00:00Z'
  },
  {
    id: 'lead-008',
    name: 'James Wilson',
    company: 'Meridian Energy',
    product: 'Asset Monitoring',
    email: 'j.wilson@meridianenergy.com',
    phone: '+1 (720) 555-0267',
    leadScore: 88,
    intentScore: 84,
    priority: 'high',
    status: 'proposal',
    lastInteraction: '2025-01-13T11:30:00Z',
    nextAction: 'Present ROI model to board',
    buyingSignals: [
      'Shared sensor data sample',
      'Requested predictive maintenance demo',
      'Board presentation scheduled for Jan 20',
      'Current maintenance costs: $2.4M/year'
    ],
    notes: 'Director of Operations. 47 wind farms. Predictive maintenance could save 15-20% annually. Champion has board access.',
    callHistory: [
      {
        id: 'call-009',
        leadId: 'lead-008',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-08T09:30:00Z',
        endTime: '2025-01-08T10:15:00Z',
        duration: 2700,
        outcome: 'Proposal delivered',
        notes: 'Board deck prepared. ROI model shows 18-month payback.'
      }
    ],
    icpScore: 91,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-18T13:00:00Z'
  },
  {
    id: 'lead-009',
    name: 'Michelle Chang',
    company: 'Urban Development Corp',
    product: 'Project Management Suite',
    email: 'm.chang@urbandevcorp.com',
    phone: '+1 (404) 555-0198',
    leadScore: 59,
    intentScore: 52,
    priority: 'low',
    status: 'new',
    lastInteraction: '2025-01-08T16:00:00Z',
    nextAction: 'Nurture campaign - send industry reports',
    buyingSignals: [
      'Downloaded construction tech trends report',
      'Visited pricing page once'
    ],
    notes: 'Project Controls Manager. Early research. No immediate timeline. 12 active projects worth $340M.',
    callHistory: [],
    icpScore: 64,
    assignedAgent: 'Jordan Park',
    createdAt: '2025-01-06T12:00:00Z'
  },
  {
    id: 'lead-010',
    name: 'Thomas Anderson',
    company: 'Velocity Sports',
    product: 'Fan Engagement Platform',
    email: 't.anderson@velocitysports.com',
    phone: '+1 (310) 555-0412',
    leadScore: 82,
    intentScore: 79,
    priority: 'high',
    status: 'qualified',
    lastInteraction: '2025-01-12T15:45:00Z',
    nextAction: 'Coordinate pilot with marketing team',
    buyingSignals: [
      'Requested real-time analytics demo',
      'Asked about AR/VR integration roadmap',
      'Shared current app engagement metrics',
      'Marketing VP champion identified'
    ],
    notes: 'Digital Innovation Lead. Professional sports franchise. Season starts March. Want app launch by opening day.',
    callHistory: [
      {
        id: 'call-010',
        leadId: 'lead-010',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-09T16:00:00Z',
        endTime: '2025-01-09T16:28:00Z',
        duration: 1680,
        outcome: 'Qualified - pilot scoped',
        notes: 'Pilot: 3 game days. Metrics: app sessions, concession orders, merchandise.'
      }
    ],
    icpScore: 86,
    assignedAgent: 'Morgan Lee',
    createdAt: '2025-01-04T11:30:00Z'
  },
  {
    id: 'lead-011',
    name: 'Patricia Hughes',
    company: 'Global Insurance Partners',
    product: 'Claims Automation',
    email: 'p.hughes@globalinsure.com',
    phone: '+1 (602) 555-0289',
    leadScore: 90,
    intentScore: 86,
    priority: 'high',
    status: 'negotiation',
    lastInteraction: '2025-01-14T10:15:00Z',
    nextAction: 'Finalize implementation timeline',
    buyingSignals: [
      'Legal review completed',
      'IT security assessment passed',
      'Pilot results: 40% faster claims processing',
      'Budget approved for enterprise rollout'
    ],
    notes: 'SVP Claims Operations. 12,000 claims/month. Pilot with auto claims showed 40% reduction in processing time. Ready to sign.',
    callHistory: [
      {
        id: 'call-011',
        leadId: 'lead-011',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-10T10:00:00Z',
        endTime: '2025-01-10T10:50:00Z',
        duration: 3000,
        outcome: 'Pilot results review',
        notes: 'Excellent pilot results. Legal approved. Finalizing MSA.'
      },
      {
        id: 'call-012',
        leadId: 'lead-011',
        type: 'incoming',
        status: 'completed',
        startTime: '2025-01-13T16:00:00Z',
        endTime: '2025-01-13T16:12:00Z',
        duration: 720,
        outcome: 'Implementation questions',
        notes: 'Asked about data migration from legacy system. 5-year retention requirement.'
      }
    ],
    icpScore: 93,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-11-20T08:00:00Z'
  },
  {
    id: 'lead-012',
    name: 'Kevin O\'Connor',
    company: 'Precision Aerospace',
    product: 'Quality Management',
    email: 'k.oconnor@precisionaero.com',
    phone: '+1 (206) 555-0376',
    leadScore: 76,
    intentScore: 70,
    priority: 'medium',
    status: 'contacted',
    lastInteraction: '2025-01-11T09:30:00Z',
    nextAction: 'Schedule AS9100 compliance demo',
    buyingSignals: [
      'Asked about AS9100:2016 module',
      'Requested audit trail capabilities',
      'Shared current non-conformance rate: 2.3%'
    ],
    notes: 'Quality Director. AS9100 recertification due Q2. 800 employees. Current system is paper-based.',
    callHistory: [
      {
        id: 'call-013',
        leadId: 'lead-012',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-06T14:00:00Z',
        endTime: '2025-01-06T14:22:00Z',
        duration: 1320,
        outcome: 'Compliance requirements gathered',
        notes: 'Need supplier quality module. First article inspection critical.'
      }
    ],
    icpScore: 79,
    assignedAgent: 'Morgan Lee',
    createdAt: '2024-12-30T15:00:00Z'
  },
  {
    id: 'lead-013',
    name: 'Rachel Green',
    company: 'FreshFoods Distribution',
    product: 'Cold Chain Monitoring',
    email: 'r.green@freshfoodsdist.com',
    phone: '+1 (305) 555-0155',
    leadScore: 84,
    intentScore: 80,
    priority: 'high',
    status: 'qualified',
    lastInteraction: '2025-01-13T14:20:00Z',
    nextAction: 'Pilot with 5 distribution centers',
    buyingSignals: [
      'Requested real-time temperature alerts',
      'Asked about FDA FSMA compliance reporting',
      'Shared spoilage cost: $1.2M/year',
      'Pilot budget approved for 3 months'
    ],
    notes: 'VP Quality Assurance. 22 distribution centers. FDA audit finding drove urgency. IoT sensor deployment needed.',
    callHistory: [
      {
        id: 'call-014',
        leadId: 'lead-013',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-07T10:30:00Z',
        endTime: '2025-01-07T11:10:00Z',
        duration: 2400,
        outcome: 'Pilot scoped - 5 DCs',
        notes: 'Phase 1: 5 centers, 200 sensors. Success criteria: <0.5% temp excursions.'
      }
    ],
    icpScore: 88,
    assignedAgent: 'Jordan Park',
    createdAt: '2025-01-02T14:00:00Z'
  },
  {
    id: 'lead-014',
    name: 'Steven Brooks',
    company: 'Horizon Media Group',
    product: 'Content Analytics',
    email: 's.brooks@horizonmedia.com',
    phone: '+1 (213) 555-0243',
    leadScore: 68,
    intentScore: 61,
    priority: 'medium',
    status: 'new',
    lastInteraction: '2025-01-09T10:00:00Z',
    nextAction: 'Send media industry benchmark report',
    buyingSignals: [
      'Downloaded content ROI whitepaper',
      'Visited competitor comparison page'
    ],
    notes: 'Director of Analytics. Digital media publisher. 50M monthly uniques. Exploring options for 2025 planning.',
    callHistory: [],
    icpScore: 72,
    assignedAgent: 'Jordan Park',
    createdAt: '2025-01-07T11:00:00Z'
  },
  {
    id: 'lead-015',
    name: 'Nicole Patel',
    company: 'Stellar Hospitality',
    product: 'Guest Experience Platform',
    email: 'n.patel@stellarhospitality.com',
    phone: '+1 (702) 555-0167',
    leadScore: 91,
    intentScore: 89,
    priority: 'high',
    status: 'proposal',
    lastInteraction: '2025-01-14T08:45:00Z',
    nextAction: 'Present to ownership group',
    buyingSignals: [
      'Ownership group review scheduled',
      'Requested multi-property dashboard',
      'Shared NPS target: 70+',
      'Current PMS integration confirmed compatible'
    ],
    notes: 'COO. 18 luxury properties. Guest personalization initiative. Owner presentation Jan 21. Strong champion.',
    callHistory: [
      {
        id: 'call-015',
        leadId: 'lead-015',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-09T14:00:00Z',
        endTime: '2025-01-09T14:42:00Z',
        duration: 2520,
        outcome: 'Proposal presented',
        notes: 'Ownership group review Jan 21. Need property-level ROI breakdown.'
      }
    ],
    icpScore: 94,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-22T10:00:00Z'
  },
  {
    id: 'lead-016',
    name: 'Daniel Rivera',
    company: 'NextGen Telecom',
    product: 'Network Assurance',
    email: 'd.rivera@nextgen-telecom.net',
    phone: '+1 (972) 555-0291',
    leadScore: 83,
    intentScore: 78,
    priority: 'high',
    status: 'qualified',
    lastInteraction: '2025-01-12T12:00:00Z',
    nextAction: 'Technical workshop with NOC team',
    buyingSignals: [
      'Shared network topology diagrams',
      'Asked about 5G core monitoring',
      'Current mean time to repair: 47 minutes',
      'Target MTTR: <15 minutes'
    ],
    notes: 'VP Network Operations. 5G rollout in 12 markets. Legacy monitoring tools cannot handle scale. NOC team of 35.',
    callHistory: [
      {
        id: 'call-016',
        leadId: 'lead-016',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-08T15:00:00Z',
        endTime: '2025-01-08T15:38:00Z',
        duration: 2280,
        outcome: 'Technical requirements defined',
        notes: 'NOC workshop scheduled. Need SNMP trap integration and NetFlow analysis.'
      }
    ],
    icpScore: 87,
    assignedAgent: 'Morgan Lee',
    createdAt: '2025-01-03T16:00:00Z'
  },
  {
    id: 'lead-017',
    name: 'Laura Bennett',
    company: 'Meridian University',
    product: 'Student Success Platform',
    email: 'l.bennett@meridian.edu',
    phone: '+1 (804) 555-0384',
    leadScore: 71,
    intentScore: 65,
    priority: 'medium',
    status: 'contacted',
    lastInteraction: '2025-01-10T13:30:00Z',
    nextAction: 'Follow up on grant funding timeline',
    buyingSignals: [
      'Asked about early alert system',
      'Requested retention analytics demo',
      'Grant application submitted for funding'
    ],
    notes: 'Associate Provost. 28,000 students. Grant funding decision in March. Retention rate target: 85%.',
    callHistory: [
      {
        id: 'call-017',
        leadId: 'lead-017',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-05T16:00:00Z',
        endTime: '2025-01-05T16:15:00Z',
        duration: 900,
        outcome: 'Grant timeline discussed',
        notes: 'Funding decision March 15. If approved, 60-day implementation window.'
      }
    ],
    icpScore: 74,
    assignedAgent: 'Jordan Park',
    createdAt: '2025-01-01T12:00:00Z'
  },
  {
    id: 'lead-018',
    name: 'Christopher Lee',
    company: 'Apex Construction',
    product: 'Field Operations',
    email: 'c.lee@apexconstruction.com',
    phone: '+1 (480) 555-0172',
    leadScore: 62,
    intentScore: 55,
    priority: 'low',
    status: 'new',
    lastInteraction: '2025-01-07T11:00:00Z',
    nextAction: 'Add to nurture sequence',
    buyingSignals: [
      'Visited mobile app features page',
      'Downloaded daily logs case study'
    ],
    notes: 'Field Operations Manager. 35 active job sites. Paper-based daily reports. No budget cycle defined.',
    callHistory: [],
    icpScore: 67,
    assignedAgent: 'Morgan Lee',
    createdAt: '2025-01-05T09:00:00Z'
  },
  {
    id: 'lead-019',
    name: 'Sofia Andersson',
    company: 'Nordic Biotech',
    product: 'Lab Information Management',
    email: 's.andersson@nordicbiotech.se',
    phone: '+46 8 555 0123',
    leadScore: 86,
    intentScore: 83,
    priority: 'high',
    status: 'proposal',
    lastInteraction: '2025-01-13T09:00:00Z',
    nextAction: 'Send GDPR compliance addendum',
    buyingSignals: [
      'Requested 21 CFR Part 11 validation pack',
      'Asked about EU data residency',
      'Shared sample throughput: 500 samples/day',
      'QA team evaluation in progress'
    ],
    notes: 'Lab Director. GMP facility. FDA and EMA inspections. Validation documentation critical. Decision by Feb 15.',
    callHistory: [
      {
        id: 'call-018',
        leadId: 'lead-019',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-09T08:00:00Z',
        endTime: '2025-01-09T08:45:00Z',
        duration: 2700,
        outcome: 'Validation requirements gathered',
        notes: 'Need IQ/OQ/PQ protocols. Audit trail immutability required.'
      }
    ],
    icpScore: 90,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-10T11:00:00Z'
  },
  {
    id: 'lead-020',
    name: 'Michael Torres',
    company: 'Quantum Financial',
    product: 'Risk Analytics',
    email: 'm.torres@quantumfin.com',
    phone: '+1 (312) 555-0405',
    leadScore: 89,
    intentScore: 85,
    priority: 'high',
    status: 'negotiation',
    lastInteraction: '2025-01-14T11:00:00Z',
    nextAction: 'Finalize pricing for 3-year term',
    buyingSignals: [
      'Procurement involved',
      'Requested volume discount for 50+ users',
      'Security questionnaire completed',
      'Competitor pricing shared: 15% lower'
    ],
    notes: 'Chief Risk Officer. Hedge fund. Real-time VaR calculation needed. Price sensitive but values speed.',
    callHistory: [
      {
        id: 'call-019',
        leadId: 'lead-020',
        type: 'outgoing',
        status: 'completed',
        startTime: '2025-01-10T14:00:00Z',
        endTime: '2025-01-10T14:35:00Z',
        duration: 2100,
        outcome: 'Pricing negotiation',
        notes: 'Competitor at $180/user/mo. Our value: real-time + regulatory reporting.'
      },
      {
        id: 'call-020',
        leadId: 'lead-020',
        type: 'incoming',
        status: 'completed',
        startTime: '2025-01-13T10:30:00Z',
        endTime: '2025-01-13T10:42:00Z',
        duration: 720,
        outcome: 'Contract terms',
        notes: 'Procurement wants 3-year with 5% annual cap. Auto-renewal opt-out.'
      }
    ],
    icpScore: 92,
    assignedAgent: 'Alex Chen',
    createdAt: '2024-12-05T09:00:00Z'
  }
];

export const getLeadsByStatus = (status: Lead['status']) => 
  mockLeads.filter(lead => lead.status === status);

export const getLeadsByPriority = (priority: Lead['priority']) => 
  mockLeads.filter(lead => lead.priority === priority);

export const getLeadById = (id: string) => 
  mockLeads.find(lead => lead.id === id);

export const sortLeadsByScore = (leads: Lead[], ascending = false) => 
  [...leads].sort((a, b) => ascending ? a.leadScore - b.leadScore : b.leadScore - a.leadScore);