import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useState, useEffect } from 'react';
import { classNames } from '../utils';
import { useIsMobile } from '../hooks';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed !== null) {
      setSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar
        isCollapsed={sidebarCollapsed || isMobile}
        onToggle={toggleSidebar}
      />

      <TopNav
        onSidebarToggle={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed || isMobile}
      />

      <main
        id="main-content"
        className={classNames(
          'min-h-screen transition-all duration-200 pt-16',
          'overflow-y-auto',
          sidebarCollapsed && !isMobile ? 'ml-16' : 'ml-64',
          isMobile ? 'ml-0' : ''
        )}
        role="main"
        tabIndex={-1}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}