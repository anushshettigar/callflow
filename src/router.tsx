import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { CallsToMake } from './pages/CallsToMake';
import { Incoming } from './pages/Incoming';
import { Recent } from './pages/Recent';
import { CalendarPage } from './pages/Calendar';
import { PulseHome } from './pages/PulseHome';
import { PulseChannel } from './pages/PulseChannel';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <div>Error</div>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'calls-to-make', element: <CallsToMake /> },
      { path: 'incoming', element: <Incoming /> },
      { path: 'recent', element: <Recent /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'pulse', element: <PulseHome /> },
      { path: 'pulse/:channelId', element: <PulseChannel /> },
    ]
  }
]);

export function AppRoutes() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}