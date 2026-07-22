import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import VoiceAssistant from './components/VoiceAssistant';

// Views
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import POS from './views/POS';
import Udhaar from './views/Udhaar';
import Analytics from './views/Analytics';
import Reports from './views/Reports';
import Settings from './views/Settings';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'pos':
        return <POS />;
      case 'udhaar':
        return <Udhaar />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderView()}
      {/* Floating Voice Assistant globally accessible */}
      <VoiceAssistant />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
