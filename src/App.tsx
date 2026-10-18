import { AppRoutes } from './router';
import { CallProvider } from './hooks/useCall';

function App() {
  return (
    <CallProvider>
      <AppRoutes />
    </CallProvider>
  );
}

export default App;