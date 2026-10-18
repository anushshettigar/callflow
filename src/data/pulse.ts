import type { PulseChannel, ChatMessage } from '../types';

export const mockPulseChannels: PulseChannel[] = [
  {
    id: 'channel-001',
    name: 'AvaniBot Assistant',
    description: 'Your AI-powered sales assistant for insights, coaching, and automation',
    type: 'role-agent',
    members: ['you'],
    unreadCount: 2,
    icon: 'Bot',
    color: '#8B5CF6'
  },
  {
    id: 'channel-002',
    name: 'Deal Coach',
    description: 'Real-time deal guidance and objection handling',
    type: 'role-agent',
    members: ['you'],
    unreadCount: 0,
    icon: 'Target',
    color: '#3B82F6'
  },
  {
    id: 'channel-003',
    name: 'Pipeline Analyst',
    description: 'Forecast accuracy and pipeline health monitoring',
    type: 'role-agent',
    members: ['you'],
    unreadCount: 1,
    icon: 'BarChart2',
    color: '#10B981'
  },
  {
    id: 'channel-004',
    name: 'Email Composer',
    description: 'Draft, refine, and personalize outreach emails',
    type: 'task-agent',
    members: ['you'],
    unreadCount: 0,
    icon: 'Mail',
    color: '#F59E0B'
  },
  {
    id: 'channel-005',
    name: 'Call Prep Assistant',
    description: 'Research, talking points, and pre-call briefings',
    type: 'task-agent',
    members: ['you'],
    unreadCount: 0,
    icon: 'Phone',
    color: '#EF4444'
  },
  {
    id: 'channel-006',
    name: 'CRM Autopilot',
    description: 'Auto-log activities, update fields, enrich records',
    type: 'task-agent',
    members: ['you'],
    unreadCount: 3,
    icon: 'Database',
    color: '#06B6D4'
  },
  {
    id: 'channel-007',
    name: '#deal-updates',
    description: 'Real-time deal notifications and team celebrations',
    type: 'channel',
    members: ['you', 'alex.chen', 'jordan.park', 'morgan.lee', 'sarah.mitchell'],
    lastMessage: {
      id: 'msg-001',
      channelId: 'channel-007',
      userId: 'alex.chen',
      userName: 'Alex Chen',
      userAvatar: 'AC',
      content: '🎉 Closed-won: Global Insurance Partners! $420K ARR. 6-month sales cycle.',
      timestamp: '2025-01-14T14:30:00Z',
      type: 'message',
      isAgent: false
    },
    unreadCount: 5,
    icon: 'MessageSquare',
    color: '#6366F1'
  },
  {
    id: 'channel-008',
    name: '#team-wins',
    description: 'Share victories, shoutouts, and kudos',
    type: 'channel',
    members: ['you', 'alex.chen', 'jordan.park', 'morgan.lee', 'sarah.mitchell', 'casey.wong'],
    lastMessage: {
      id: 'msg-002',
      channelId: 'channel-008',
      userId: 'jordan.park',
      userName: 'Jordan Park',
      userAvatar: 'JP',
      content: 'Kudos to @morgan.lee for the Velocity Sports pilot win! 🏀 Season starts March!',
      timestamp: '2025-01-14T12:15:00Z',
      type: 'message',
      isAgent: false
    },
    unreadCount: 2,
    icon: 'Trophy',
    color: '#F97316'
  },
  {
    id: 'channel-009',
    name: '#competitive-intel',
    description: 'Competitor movements, battle cards, win/loss insights',
    type: 'channel',
    members: ['you', 'alex.chen', 'jordan.park', 'morgan.lee'],
    lastMessage: {
      id: 'msg-003',
      channelId: 'channel-009',
      userId: 'morgan.lee',
      userName: 'Morgan Lee',
      userAvatar: 'ML',
      content: 'CompetitorX just dropped pricing 15% for mid-market. Updated battle card attached.',
      timestamp: '2025-01-14T09:45:00Z',
      type: 'message',
      isAgent: false
    },
    unreadCount: 0,
    icon: 'Shield',
    color: '#84CC16'
  },
  {
    id: 'channel-010',
    name: '#product-feedback',
    description: 'Feature requests, bug reports, and product discussions',
    type: 'channel',
    members: ['you', 'alex.chen', 'jordan.park', 'morgan.lee', 'product.team'],
    lastMessage: {
      id: 'msg-004',
      channelId: 'channel-010',
      userId: 'product.team',
      userName: 'Product Team',
      userAvatar: 'PT',
      content: 'New mobile app beta released. Test flight link in thread. Feedback by Friday!',
      timestamp: '2025-01-13T16:20:00Z',
      type: 'message',
      isAgent: false
    },
    unreadCount: 1,
    icon: 'Lightbulb',
    color: '#EC4899'
  }
];

export const mockChannelMessages: Record<string, ChatMessage[]> = {
  'channel-001': [
    {
      id: 'msg-avan-001',
      channelId: 'channel-001',
      userId: 'avanibot',
      userName: 'AvaniBot',
      userAvatar: 'AB',
      content: 'Good morning! I\'ve analyzed your pipeline for today. You have 3 high-priority deals needing attention: Summit Financial (contract finalization), Global Insurance (implementation timeline), and Quantum Financial (pricing negotiation). Would you like me to prepare briefing docs for any of these?',
      timestamp: '2025-01-14T07:00:00Z',
      type: 'message',
      isAgent: true
    },
    {
      id: 'msg-avan-002',
      channelId: 'channel-001',
      userId: 'avanibot',
      userName: 'AvaniBot',
      userAvatar: 'AB',
      content: 'Also noticed: TechFlow demo tomorrow at 10 AM. I\'ve pulled their tech stack info (React/Node/AWS) and compiled 3 likely technical questions. Want me to send the prep doc?',
      timestamp: '2025-01-14T07:02:00Z',
      type: 'message',
      isAgent: true
    },
    {
      id: 'msg-avan-003',
      channelId: 'channel-001',
      userId: 'you',
      userName: 'You',
      userAvatar: 'Y',
      content: 'Yes, please send the TechFlow prep doc. Also, what\'s the latest on Summit Financial contract?',
      timestamp: '2025-01-14T07:15:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-avan-004',
      channelId: 'channel-001',
      userId: 'avanibot',
      userName: 'AvaniBot',
      userAvatar: 'AB',
      content: 'Summit Financial: Legal completed review yesterday. Two open items: 1) Auto-renewal opt-out clause (procurement requirement), 2) EU data residency addendum. David Park expects final draft by EOD Friday. I\'ve drafted the addendum - want me to send for your review?',
      timestamp: '2025-01-14T07:16:00Z',
      type: 'message',
      isAgent: true,
      needsInput: true,
      actions: [
        { label: 'Send addendum for review', action: 'send_addendum' },
        { label: 'Schedule call with David', action: 'schedule_call' }
      ]
    }
  ],
  'channel-002': [
    {
      id: 'msg-coach-001',
      channelId: 'channel-002',
      userId: 'dealcoach',
      userName: 'Deal Coach',
      userAvatar: 'DC',
      content: 'Deal Alert: Quantum Financial is in pricing negotiation. Competitor at $180/user/mo. Your value props: real-time VaR + regulatory reporting automation. Recommended approach: anchor on 3-year value, offer 5% annual cap, emphasize switching cost.',
      timestamp: '2025-01-14T08:00:00Z',
      type: 'message',
      isAgent: true
    },
    {
      id: 'msg-coach-002',
      channelId: 'channel-002',
      userId: 'dealcoach',
      userName: 'Deal Coach',
      userAvatar: 'DC',
      content: 'Objection handler ready for "price too high": "I understand budget pressure. Most clients find the regulatory reporting automation alone saves 20 hrs/month - that\'s $15K+ in analyst time. Want me to run the ROI calc for your 50 users?"',
      timestamp: '2025-01-14T08:05:00Z',
      type: 'message',
      isAgent: true
    }
  ],
  'channel-003': [
    {
      id: 'msg-pipeline-001',
      channelId: 'channel-003',
      userId: 'pipelineanalyst',
      userName: 'Pipeline Analyst',
      userAvatar: 'PA',
      content: 'Pipeline Health Check: $2.8M weighted pipeline (target: $3.2M). 4 deals in negotiation/proposal stage worth $1.4M. Risk: Greenfield Manufacturing CFO sign-off pending. Opportunity: Nordic Biotech decision Feb 15 - high probability.',
      timestamp: '2025-01-14T06:30:00Z',
      type: 'message',
      isAgent: true
    },
    {
      id: 'msg-pipeline-002',
      channelId: 'channel-003',
      userId: 'pipelineanalyst',
      userName: 'Pipeline Analyst',
      userAvatar: 'PA',
      content: 'Forecast accuracy last month: 94% (target 90%+). Strong performance. This month\'s commit: $890K. Best case: $1.4M. Gap to quota: $310K. Recommendation: accelerate Summit & Global Insurance closes.',
      timestamp: '2025-01-14T06:35:00Z',
      type: 'message',
      isAgent: true
    }
  ],
  'channel-004': [
    {
      id: 'msg-email-001',
      channelId: 'channel-004',
      userId: 'emailcomposer',
      userName: 'Email Composer',
      userAvatar: 'EC',
      content: 'Drafted follow-up for Nova Retail discovery call (tomorrow 2 PM). Subject: "Inventory intelligence - 300 stores, 15% stockout reduction". Includes case study link and calendar link. Ready to review?',
      timestamp: '2025-01-14T09:00:00Z',
      type: 'message',
      isAgent: true,
      needsInput: true,
      actions: [
        { label: 'Approve & send', action: 'approve_send' },
        { label: 'Edit draft', action: 'edit_draft' }
      ]
    }
  ],
  'channel-005': [
    {
      id: 'msg-callprep-001',
      channelId: 'channel-005',
      userId: 'callprep',
      userName: 'Call Prep Assistant',
      userAvatar: 'CP',
      content: 'Pre-call brief for TechFlow demo (Jan 16, 10 AM):\n• Attendees: Sarah Mitchell (VP Sales), 2 Sales Engineers, 1 RevOps\n• Tech stack: Salesforce, Outreach, Gong, Snowflake\n• Pain points: $180K/yr Salesforce cost, manual forecasting, no mobile\n• Likely questions: API limits, SSO/SCIM, data migration, mobile app\n• Your differentiators: Native forecasting, 2-week implementation, mobile-first\n\nWant me to create a battle card for Salesforce displacement?',
      timestamp: '2025-01-14T08:30:00Z',
      type: 'message',
      isAgent: true,
      needsInput: true,
      actions: [
        { label: 'Create battle card', action: 'create_battlecard' },
        { label: 'Send brief to calendar', action: 'send_to_calendar' }
      ]
    }
  ],
  'channel-006': [
    {
      id: 'msg-crm-001',
      channelId: 'channel-006',
      userId: 'crmautopilot',
      userName: 'CRM Autopilot',
      userAvatar: 'CA',
      content: 'Auto-logged 4 activities today:\n✅ Call with Summit Financial (45 min) - Contract negotiation\n✅ Email to Greenfield Manufacturing - Revised proposal sent\n✅ Call with Meridian Energy (75 min) - Board prep\n✅ Meeting logged: Velocity Sports pilot coordination\n\n3 records enriched with LinkedIn data. 2 contacts updated with new titles.',
      timestamp: '2025-01-14T17:00:00Z',
      type: 'message',
      isAgent: true
    },
    {
      id: 'msg-crm-002',
      channelId: 'channel-006',
      userId: 'crmautopilot',
      userName: 'CRM Autopilot',
      userAvatar: 'CA',
      content: 'Action needed: 3 leads missing next steps:\n1. Nova Retail (lead-005) - Discovery call scheduled, no next action\n2. Urban Development (lead-009) - Nurture only, no activity >30 days\n3. Apex Construction (lead-018) - New lead, no outreach logged\n\nWant me to suggest next actions?',
      timestamp: '2025-01-14T17:05:00Z',
      type: 'message',
      isAgent: true,
      needsInput: true,
      actions: [
        { label: 'Suggest next actions', action: 'suggest_actions' },
        { label: 'Auto-create tasks', action: 'auto_create_tasks' }
      ]
    }
  ],
  'channel-007': [
    {
      id: 'msg-deals-001',
      channelId: 'channel-007',
      userId: 'alex.chen',
      userName: 'Alex Chen',
      userAvatar: 'AC',
      content: '🎉 Closed-won: Global Insurance Partners! $420K ARR. 6-month sales cycle. Pilot proved 40% faster claims processing. Huge win for the team!',
      timestamp: '2025-01-14T14:30:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-deals-002',
      channelId: 'channel-007',
      userId: 'jordan.park',
      userName: 'Jordan Park',
      userAvatar: 'JP',
      content: 'Incredible work @alex.chen! That pilot-to-close motion is exactly what we need to replicate. 🙌',
      timestamp: '2025-01-14T14:32:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-deals-003',
      channelId: 'channel-007',
      userId: 'morgan.lee',
      userName: 'Morgan Lee',
      userAvatar: 'ML',
      content: 'Congrats! 🎊 The healthcare vertical playbook is working. Who\'s next?',
      timestamp: '2025-01-14T14:35:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-deals-004',
      channelId: 'channel-007',
      userId: 'sarah.mitchell',
      userName: 'Sarah Mitchell',
      userAvatar: 'SM',
      content: 'Amazing! 🚀 That case study is going to be gold for prospecting.',
      timestamp: '2025-01-14T14:38:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-deals-005',
      channelId: 'channel-007',
      userId: 'casey.wong',
      userName: 'Casey Wong',
      userAvatar: 'CW',
      content: 'Woo! 🎉 Drinks on Alex this Friday?',
      timestamp: '2025-01-14T14:40:00Z',
      type: 'message',
      isAgent: false
    }
  ],
  'channel-008': [
    {
      id: 'msg-wins-001',
      channelId: 'channel-008',
      userId: 'jordan.park',
      userName: 'Jordan Park',
      userAvatar: 'JP',
      content: 'Kudos to @morgan.lee for the Velocity Sports pilot win! 🏀 Season starts March!',
      timestamp: '2025-01-14T12:15:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-wins-002',
      channelId: 'channel-008',
      userId: 'morgan.lee',
      userName: 'Morgan Lee',
      userAvatar: 'ML',
      content: 'Thanks @jordan.park! Team effort - @alex.chen\'s demo scripts and @you\'s pilot scoping made it happen. 🤝',
      timestamp: '2025-01-14T12:18:00Z',
      type: 'message',
      isAgent: false
    },
    {
      id: 'msg-wins-003',
      channelId: 'channel-008',
      userId: 'alex.chen',
      userName: 'Alex Chen',
      userAvatar: 'AC',
      content: '🤝 Love the collaboration. Sports vertical is heating up!',
      timestamp: '2025-01-14T12:20:00Z',
      type: 'message',
      isAgent: false
    }
  ]
};

export const getChannelMessages = (channelId: string) => 
  mockChannelMessages[channelId] || [];

export const getChannelById = (id: string) => 
  mockPulseChannels.find(c => c.id === id);

export const getChannelsByType = (type: PulseChannel['type']) => 
  mockPulseChannels.filter(c => c.type === type);