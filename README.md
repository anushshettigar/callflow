# CallFlow

A professional desktop-first call centre workspace built with React, Vite, TypeScript, and Tailwind CSS.

## Overview

CallFlow is a comprehensive call centre agent application that provides a complete workspace for managing leads, calls, tasks, calendar events, and team collaboration. It features a modern, responsive UI with real-time calling capabilities using browser-native WebRTC APIs.

## Features

### Core Pages
- **Dashboard** - KPI cards, 7-day charts (calls/connects, talk time/revenue), recent activity, quick actions, leads waiting, earnings overview
- **Calls to Make** - Ranked/scored leads with expandable rows showing customer details, notes, buying signals, call history, and recommended next actions. Includes search, filters, sorting, and pagination
- **Incoming** - Incoming/missed calls with customer info, time, duration, value at stake, status, and callback functionality
- **Recent** - Complete call history with incoming/outgoing/missed filters, search, date range filtering, and clickable call details
- **Calendar** - Month grid view with event dots, previous/next month navigation, today button, selected date details, and local event creation/editing
- **Pulse Home** - AI assistant (AvaniBot-style), role agents, task agents, channels, kudos/team activity
- **Pulse Channel** - Channel header, back navigation, chat messages with timestamps, agent messages on right/other on left, pinned "Needs your input" card with action buttons, working send functionality

### Calling System
- **Real WebRTC Audio** - Uses browser-native `getUserMedia` and `AudioContext` for genuine microphone access
- **Call States** - Requesting permission → Calling → Connecting → Connected → Ended
- **Live Timer** - Real-time duration display during connected calls
- **Mute/Unmute** - Toggle microphone during active calls
- **Call Outcomes** - Select/store call outcome on completion
- **Auto-logging** - Completed calls automatically added to Recent page and update lead/dashboard state

### Technical Features
- **Responsive Design** - Desktop-first with mobile support (collapsible sidebar, stacked layouts)
- **Local Persistence** - localStorage for tasks, calls, calendar events, chat messages, user preferences
- **State Management** - React hooks for call state, local storage, debouncing, click-outside, media queries
- **Accessibility** - Keyboard navigation, ARIA labels, focus management, semantic HTML
- **Component Library** - Reusable UI components (Button, Card, Modal, Table, Dropdown, Tooltip, Avatar, Badge, Pagination, Toast, Skeleton)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 8** - Build tool and dev server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Recharts 3** - Data visualization
- **Lucide React** - Icon system
- **PostCSS** - CSS processing

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Avatar.tsx
│   │   ├── Table.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Pagination.tsx
│   │   ├── Toast.tsx
│   │   └── Skeleton.tsx
│   └── LeadsModal.tsx         # Lead detail modal
├── layouts/
│   ├── Sidebar.tsx            # Persistent navigation sidebar
│   ├── TopNav.tsx             # Top navigation bar
│   └── AppLayout.tsx          # Main layout wrapper
├── pages/
│   ├── Dashboard.tsx
│   ├── CallsToMake.tsx
│   ├── Incoming.tsx
│   ├── Recent.tsx
│   ├── Calendar.tsx
│   ├── PulseHome.tsx
│   └── PulseChannel.tsx
├── data/
│   ├── leads.ts               # 20 realistic lead records
│   ├── calls.ts               # 30 call records
│   ├── tasks.ts               # 20 tasks
│   ├── calendar.ts            # 21 calendar events
│   ├── pulse.ts               # 10 Pulse channels + messages
│   └── dashboard.ts           # KPIs, charts, activity data
├── hooks/
│   ├── useLocalStorage.ts     # localStorage sync hooks
│   ├── useCall.ts             # WebRTC call state management
│   └── useUtils.ts            # Debounce, click-outside, media queries
├── services/
│   └── calling.ts             # WebRTC calling service
├── utils/
│   ├── formatters.ts          # Duration, date, currency formatting
│   ├── storage.ts             # localStorage CRUD operations
│   └── validation.ts          # Form validation helpers
├── types/
│   └── index.ts               # TypeScript interfaces
├── router.tsx                 # React Router configuration
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Calling Architecture

### Real vs Simulated Functionality

**Real (Browser-Native):**
- Microphone access via `navigator.mediaDevices.getUserMedia()`
- Audio visualization using `AudioContext` and `AnalyserNode`
- Actual microphone mute/unmute via `MediaStreamTrack.enabled`
- Real timer using `setInterval`

**Simulated (For Demo):**
- Call connection simulation (2s "calling" + 1.5s "connecting" delays)
- No actual PSTN/VoIP connection (requires signaling server)
- No real peer-to-peer WebRTC connection (requires STUN/TURN + signaling)

### Calling Test Procedure

1. Navigate to **Calls to Make** page
2. Click the phone icon on any lead row
3. Browser will prompt for microphone permission - click **Allow**
4. Observe call states: **Calling** → **Connecting** → **Connected**
5. During **Connected** state:
   - Timer counts up in real-time
   - Audio level visualization responds to microphone input
   - Click **Mute** button to toggle microphone
6. Click **End Call** button
7. Select call outcome from dropdown or enter custom text
8. Verify call appears in **Recent** page with correct duration and outcome
9. Verify lead's call history updates in expanded row

### Limitations

- **No real PSTN/VoIP calls** - This is a browser-native audio demo only. Actual phone calls require:
  - Signaling server (WebSocket/SIP)
  - STUN/TURN servers for NAT traversal
  - Twilio, Vonage, or similar telephony provider
  - Backend infrastructure for call routing
- **Single-user demo** - No multi-party calls or call transfer
- **No call recording** - Would require MediaRecorder API + storage backend
- **Microphone only** - No speaker/output device selection in this demo

## Deployment

### Vercel (Recommended)

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod
```

### Static Hosting (Netlify, GitHub Pages, etc.)

```bash
npm run build
# Deploy dist/ folder
```

**SPA Routing:** Ensure your hosting platform redirects all routes to `index.html` for client-side routing.

### Environment Variables

No required environment variables for demo mode. For production calling:

```env
# Example for Twilio integration (not implemented)
VITE_TWILIO_ACCOUNT_SID=
VITE_TWILIO_API_KEY=
VITE_TWILIO_API_SECRET=
VITE_TWILIO_APP_SID=
```

## Completed Features

- ✅ Dashboard with KPIs, charts, activity feed, quick actions
- ✅ Calls to Make with 20 leads, expandable rows, search/filter/sort/pagination
- ✅ Incoming calls with callback functionality
- ✅ Recent calls with full history, filters, search, date range
- ✅ Calendar with month view, event creation/editing, localStorage persistence
- ✅ Pulse Home with AI agents, task agents, channels, kudos
- ✅ Pulse Channel with chat, pinned cards, actions, real-time messaging
- ✅ Leads Modal with navigation, buying signals, call history
- ✅ WebRTC calling with mic permission, states, timer, mute, outcomes
- ✅ Responsive layout with collapsible sidebar
- ✅ localStorage persistence for tasks, calls, events, messages, preferences
- ✅ Toast notifications, loading/empty/error states
- ✅ Accessibility (keyboard, ARIA, focus management)
- ✅ Production build passing

## Known Issues / Skipped Features

- ❌ Real PSTN/VoIP calling (requires backend infrastructure)
- ❌ Multi-user real-time presence (requires WebSocket server)
- ❌ Call recording/playback
- ❌ Advanced analytics/reporting export
- ❌ Team management/admin panel
- ❌ Integration with CRM (Salesforce, HubSpot)
- ❌ SMS/Email composition from UI
- ❌ Dark mode toggle (CSS variables defined but no UI toggle)

## AI Tools Used

- **GitHub Copilot** - Code completion and component scaffolding
- **Claude (Anthropic)** - Architecture planning, complex component logic, TypeScript fixes
- **ChatGPT** - Recharts formatter typing, Tailwind v4 migration guidance

## License

MIT License - feel free to use for learning or commercial projects.