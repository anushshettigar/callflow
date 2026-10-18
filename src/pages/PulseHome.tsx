import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Target,
  BarChart2,
  Mail,
  Phone,
  Database,
  MessageSquare,
  Trophy,
  Shield,
  Lightbulb,
  Bell,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
  MoreVertical,
  RefreshCw,
  Plus
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';

import { mockPulseChannels, getChannelsByType, getChannelById, mockChannelMessages } from '../data/pulse';
import { PulseChannel, ChatMessage } from '../types';
import { formatRelativeTime, classNames } from '../utils';
import { useToast } from '../components/ui/Toast';

const ROLE_AGENTS = ['channel-001', 'channel-002', 'channel-003'];
const TASK_AGENTS = ['channel-004', 'channel-005', 'channel-006'];
const CHANNELS = ['channel-007', 'channel-008', 'channel-009', 'channel-010'];

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Target,
  BarChart2,
  Mail,
  Phone,
  Database
};

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Trophy,
  Shield,
  Lightbulb
};

function AgentCard({ channel }: { channel: PulseChannel }) {
  const Icon = AGENT_ICONS[channel.icon] || Bot;
  const navigate = useNavigate();
  const { addToast } = useToast();
  const messages = mockChannelMessages[channel.id] || [];
  const unreadMessages = messages.filter(m => !m.timestamp.includes('2025-01-14T07')).length;
  const latestMessage = messages[messages.length - 1];

  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/pulse/${channel.id}`)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: channel.color + '20' }}>
              <span style={{ color: channel.color }}>
                <Icon className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{channel.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{channel.description}</p>
            </div>
          </div>
          {channel.unreadCount > 0 && (
            <Badge variant="danger" size="sm">{channel.unreadCount}</Badge>
          )}
        </div>
        
        {latestMessage && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-2">{latestMessage.content}</p>
            <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(latestMessage.timestamp)}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/pulse/${channel.id}`); }}>
            Open
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelCard({ channel }: { channel: PulseChannel }) {
  const Icon = CHANNEL_ICONS[channel.icon] || MessageSquare;
  const navigate = useNavigate();
  const messages = mockChannelMessages[channel.id] || [];
  const latestMessage = channel.lastMessage || messages[messages.length - 1];

  return (
    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/pulse/${channel.id}`)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: channel.color + '20' }}>
              <span style={{ color: channel.color }}>
                <Icon className="w-6 h-6" />
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                #{channel.name.replace('#', '')}
                {channel.unreadCount > 0 && <Badge variant="danger" size="sm">{channel.unreadCount}</Badge>}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{channel.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <AvatarGroup max={4} size="xs">
              {channel.members.slice(0, 4).map((member, i) => (
                <Avatar key={i} name={member} size="xs" />
              ))}
            </AvatarGroup>
            <span>{channel.members.length} members</span>
          </div>
        </div>

        {latestMessage && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Avatar name={latestMessage.userName} size="xs" />
              <span className="font-medium text-gray-900 text-sm">{latestMessage.userName}</span>
              <span className="text-gray-400">{formatRelativeTime(latestMessage.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{latestMessage.content}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/pulse/${channel.id}`); }}>
            Open Channel
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function KudosCard() {
  const kudos = [
    { from: 'Jordan Park', to: 'Morgan Lee', message: 'Great job on the Velocity Sports pilot!', time: '2025-01-14T12:18:00Z' },
    { from: 'Alex Chen', to: 'You', message: 'Thanks for the Summit Financial contract push!', time: '2025-01-14T10:30:00Z' },
    { from: 'Casey Wong', to: 'Team', message: 'Amazing quarter everyone! Drinks on Friday?', time: '2025-01-13T16:45:00Z' },
    { from: 'Sarah Mitchell', to: 'Alex Chen', message: 'Love the new battle cards for CompetitorX', time: '2025-01-13T14:20:00Z' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Team Kudos
        </CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {kudos.map((kudo, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Avatar name={kudo.from} size="xs" />
                <span className="font-medium text-gray-900 text-sm">{kudo.from}</span>
                <span className="text-gray-400 text-sm">→</span>
                <Avatar name={kudo.to} size="xs" />
                <span className="font-medium text-gray-900 text-sm">{kudo.to}</span>
                <span className="text-gray-400 text-xs ml-auto">{formatRelativeTime(kudo.time)}</span>
              </div>
              <p className="text-sm text-gray-600">{kudo.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsCard() {
  const insights = [
    { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', title: 'Pipeline Up 15%', desc: 'Weighted pipeline increased to $2.8M' },
    { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', title: '3 Deals at Risk', desc: 'Greenfield, Nordic, Quantum need attention' },
    { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Avg Response: 2.3h', desc: 'Improved from 4.1h last month' },
    { icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', title: 'Forecast Accuracy: 94%', desc: 'Exceeding 90% target' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          AI Insights
        </CardTitle>
        <Button variant="ghost" size="sm">Refresh</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <div key={i} className={classNames('p-3 rounded-lg', insight.bg)}>
              <div className="flex items-center gap-2 mb-2">
                <insight.icon className={classNames('w-5 h-5', insight.color)} />
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{insight.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: 'Ask AvaniBot', desc: 'Get deal insights & coaching', icon: Bot, color: 'bg-purple-100 text-purple-600', href: '/pulse/channel-001' },
    { label: 'Prep for Calls', desc: 'Research & talking points', icon: Phone, color: 'bg-blue-100 text-blue-600', href: '/pulse/channel-005' },
    { label: 'Compose Emails', desc: 'AI-powered outreach', icon: Mail, color: 'bg-amber-100 text-amber-600', href: '/pulse/channel-004' },
    { label: 'Update CRM', desc: 'Auto-log activities', icon: Database, color: 'bg-green-100 text-green-600', href: '/pulse/channel-006' },
    { label: 'Check Pipeline', desc: 'Forecast & health', icon: BarChart2, color: 'bg-emerald-100 text-emerald-600', href: '/pulse/channel-003' },
    { label: 'Deal Coaching', desc: 'Objection handling', icon: Target, color: 'bg-red-100 text-red-600', href: '/pulse/channel-002' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </CardTitle>
        <CardDescription>AI-powered shortcuts for your workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, i) => (
            <Link key={i} to={action.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={classNames('w-10 h-10 rounded-lg flex items-center justify-center', action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PulseHome() {
  const roleAgents = ROLE_AGENTS.map(id => getChannelById(id)!).filter(Boolean);
  const taskAgents = TASK_AGENTS.map(id => getChannelById(id)!).filter(Boolean);
  const channels = CHANNELS.map(id => getChannelById(id)!).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-600" />
            Pulse
          </h1>
          <p className="text-gray-500 mt-1">Your AI-powered sales workspace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Channel
          </Button>
        </div>
      </div>

      {/* AI Insights & Kudos Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightsCard />
        <KudosCard />
      </div>

      {/* Role Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            Role Agents
          </CardTitle>
          <CardDescription>AI assistants for specific sales roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roleAgents.map((channel) => (
              <AgentCard key={channel.id} channel={channel} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Task Agents
          </CardTitle>
          <CardDescription>Automated agents for repetitive tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {taskAgents.map((channel) => (
              <AgentCard key={channel.id} channel={channel} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Channels
            </CardTitle>
            <CardDescription>Team collaboration spaces</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActionsCard />
    </div>
  );
}

export default PulseHome;