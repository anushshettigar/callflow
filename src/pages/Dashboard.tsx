import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Phone,
  Target,
  Clock,
  DollarSign,
  CheckCircle,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Calendar,
  Mail,
  Zap,
  Plus,
  BarChart2,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge, ScoreBadge } from '../components/ui/Badge';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { SkeletonCard, SkeletonList } from '../components/ui/Skeleton';

import { mockKPIs, mockChartData, mockRecentActivity, mockQuickActions, mockDailyProgress, mockLeadsWaiting, mockEarnings } from '../data/dashboard';
import { formatDuration, formatCurrency, formatRelativeTime, formatPercentage, classNames } from '../utils';

const KPI_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  Target,
  Clock,
  DollarSign,
  CheckCircle,
  ClipboardCheck
};

function KPICard({ label, value, change, trend, icon }: { label: string; value: string | number; change: number; trend: 'up' | 'down' | 'neutral'; icon: string }) {
  const Icon = KPI_ICONS[icon] || Phone;
  const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus };
  const TrendIcon = trendIcons[trend];
  
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TrendIcon className={classNames('w-4 h-4', trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400')} />
          <span className={classNames('text-sm font-medium', trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500')}>
            {formatPercentage(change)} vs last week
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">{children}</div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ activity }: { activity: { type: 'call' | 'email' | 'meeting' | 'task'; title: string; description: string; leadName?: string; outcome: string; timestamp: string } }) {
  const icons = {
    call: Phone,
    email: Mail,
    meeting: Calendar,
    task: ClipboardCheck
  } as const;
  const Icon = icons[activity.type] || Phone;
  
  const outcomeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={classNames('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', outcomeColors[activity.outcome as keyof typeof outcomeColors] || outcomeColors.neutral)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
        {activity.leadName && (
          <p className="text-xs text-gray-400 mt-1">{activity.leadName}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{formatRelativeTime(activity.timestamp)}</span>
    </div>
  );
}

const QUICK_ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Phone,
  Calendar,
  Plus,
  Mail,
  BarChart2
};

function QuickActionButton({ action, onClick }: { action: { icon: string; primary: boolean; label: string; description: string }; onClick: () => void }) {
  const Icon = QUICK_ACTION_ICONS[action.icon] || Zap;
  return (
    <Button
      variant={action.primary ? 'primary' : 'outline'}
      size="lg"
      className="w-full justify-start gap-3"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="text-left">
        <p className="font-medium text-gray-900">{action.label}</p>
        <p className="text-sm text-gray-500">{action.description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
    </Button>
  );
}

function LeadsWaitingList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Leads Waiting
          </CardTitle>
          <CardDescription>High priority leads needing attention</CardDescription>
        </div>
        <Link to="/calls-to-make" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {mockLeadsWaiting.map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} size="sm" />
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.company}</p>
                </div>
              </div>
              <div className="text-right">
                <StatusBadge status={lead.priority} type="task" />
                <p className="text-xs text-gray-500 mt-1">{lead.nextAction}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EarningsCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Earnings Overview
        </CardTitle>
        <CardDescription>Year-to-date commission and quota attainment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockEarnings.commissionYTD)}</p>
            <p className="text-sm text-gray-500">Commission YTD</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{mockEarnings.quotaAttainment}%</p>
            <p className="text-sm text-gray-500">Quota Attainment</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockEarnings.baseSalary)}</p>
            <p className="text-sm text-gray-500">Base Salary</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">{mockEarnings.acceleratorTier}</p>
            <p className="text-sm text-gray-500">Accelerator</p>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">Next Milestone</p>
              <p className="text-sm text-blue-600">{mockEarnings.nextMilestone.label} - {formatCurrency(mockEarnings.nextMilestone.amount)} away</p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{mockEarnings.quotaAttainment}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TasksCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            My Tasks
          </CardTitle>
          <CardDescription>Upcoming and overdue tasks</CardDescription>
        </div>
        <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View all
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {mockDailyProgress.callsMade > 0 && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Daily calls target</p>
                  <p className="text-sm text-gray-500">{mockDailyProgress.callsMade}/{mockDailyProgress.callsTarget} calls made</p>
                </div>
              </div>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full transition-all" style={{ width: `${(mockDailyProgress.callsMade / mockDailyProgress.callsTarget) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(false);

  // Simulate loading on first render
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your call center performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Call
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Calls & Connects (7 Days)" description="Daily call volume and connection rate">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConnects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { weekday: 'short' })} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={((value: number | undefined, name: string) => [value ?? 0, name === 'calls' ? 'Calls' : 'Connects']) as any}
              />
              <Area type="monotone" dataKey="calls" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="connected" stroke="#10B981" fillOpacity={1} fill="url(#colorConnects)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Talk Time & Revenue (7 Days)" description="Daily talk time in minutes and revenue generated">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { weekday: 'short' })} />
              <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={12} label={{ value: 'Talk Time (min)', angle: -90, position: 'insideLeft', offset: 10, fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={12} label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', offset: 10, fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={((value: number | undefined, name: string) => {
                  if (name === 'duration') return [value ?? 0, 'Talk Time (min)'];
                  if (name === 'revenue') return [formatCurrency(value ?? 0), 'Revenue'];
                  return [value ?? 0, name];
                }) as any}
              />
              <Line yAxisId="left" type="monotone" dataKey="duration" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LeadsWaitingList />
        <EarningsCard />
        <TasksCard />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest calls, emails, and tasks</CardDescription>
          </div>
          <Link to="/recent" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {mockRecentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common actions to accelerate your workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockQuickActions.map((action) => (
              <QuickActionButton key={action.id} action={action} onClick={() => {}} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;