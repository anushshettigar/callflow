import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  MoreVertical,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Phone,
  Mic,
  MicOff,
  X
} from 'lucide-react';
import { classNames, formatRelativeTime } from '../utils';
import { useClickOutside } from '../hooks';
import { useCall } from '../hooks/useCall';

interface TopNavProps {
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

export function TopNav({ onSidebarToggle, sidebarCollapsed }: TopNavProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { callState, toggleMute, endCall, getFormattedTimer, isConnected } = useCall();

  useClickOutside(notificationsRef, () => setShowNotifications(false));
  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/calls-to-make') return 'Calls to Make';
    if (path === '/incoming') return 'Incoming Calls';
    if (path === '/recent') return 'Recent Calls';
    if (path === '/calendar') return 'Calendar';
    if (path.startsWith('/pulse')) return 'Pulse';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help';
    return 'CallFlow';
  };

  const notifications = [
    { id: '1', title: 'New lead assigned', message: 'Sarah Mitchell from TechFlow Solutions', time: '2025-01-14T10:30:00Z', read: false },
    { id: '2', title: 'Deal updated', message: 'Global Insurance moved to Closed-Won', time: '2025-01-14T14:30:00Z', read: false },
    { id: '3', title: 'Task due', message: 'Send revised proposal to Greenfield Mfg', time: '2025-01-14T16:45:00Z', read: true },
    { id: '4', title: 'Meeting reminder', message: 'TechFlow demo in 30 minutes', time: '2025-01-14T09:30:00Z', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header
        className={classNames(
          'fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-200',
          'flex items-center justify-between px-4',
          sidebarCollapsed ? 'left-16' : 'left-64'
        )}
        role="banner"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Phone className="w-5 h-5" />
          </button>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search leads, calls, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleThemeChange(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={`Current theme: ${theme}. Click to change.`}
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : theme === 'light' ? <Sun className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </button>

          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
              aria-expanded={showNotifications}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-sm text-blue-600 hover:text-blue-700">Mark all read</button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={classNames(
                        'w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                        !notification.read && 'bg-blue-50'
                      )}
                    >
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatRelativeTime(notification.time)}</p>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-200">
                  <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-700 block text-center">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">Alex Chen</span>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900 text-sm">Alex Chen</p>
                  <p className="text-xs text-gray-500">alex.chen@callflow.io</p>
                </div>
                <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isConnected && (
        <div
          className={classNames(
            'fixed top-16 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-2 transition-all duration-200',
            'flex items-center justify-between',
            sidebarCollapsed ? 'left-16' : 'left-64'
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <span className="text-lg font-mono tabular-nums">{getFormattedTimer()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              aria-label={callState.muted ? 'Unmute' : 'Mute'}
              aria-pressed={callState.muted}
            >
              {callState.muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => endCall()}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
              aria-label="End call"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}