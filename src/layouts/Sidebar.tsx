import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  PhoneIncoming,
  History,
  Calendar,
  Bot,
  Users,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { classNames } from '../utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calls-to-make', label: 'Calls to Make', icon: Phone },
  { path: '/incoming', label: 'Incoming', icon: PhoneIncoming },
  { path: '/recent', label: 'Recent', icon: History },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/pulse', label: 'Pulse', icon: Bot }
];

const bottomNavigation = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help', icon: HelpCircle }
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className={classNames(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-200',
        'flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      onMouseEnter={() => setHoveredItem('sidebar')}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">CallFlow</span>
          </NavLink>
        )}
        <button
          onClick={onToggle}
          className={classNames(
            'p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors',
            'flex items-center justify-center'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) => classNames(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="absolute right-2 w-0.5 h-6 bg-blue-600 rounded-r-full" />
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-200">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive: active }) => classNames(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Alex Chen</p>
              <p className="text-xs text-gray-500 truncate">Senior Account Executive</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}