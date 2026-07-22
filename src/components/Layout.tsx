import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BookOpen, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon,
  Bell,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import Notifications from './Notifications.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { activeView, setActiveView, theme, setTheme, notifications, shopProfile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'pos', label: 'Sales (POS)', icon: ShoppingCart },
    { id: 'udhaar', label: 'Udhaar Ledger', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
      theme === 'dark' ? 'bg-bg-dark text-text-dark' : 'bg-slate-50 text-text-light'
    }`}>
      
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 border-r fixed h-full z-20 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-card-dark border-border-dark' : 'bg-white border-slate-200'
      }`}>
        {/* Brand */}
        <div className="p-6 border-b border-inherit flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-display font-extrabold text-xl shadow-lg shadow-orange-500/20">
            K
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight leading-none text-primary">
              KiranaAI
            </h1>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Retail OS
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-orange-500/10'
                    : theme === 'dark' 
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-inherit'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Profile Card & Language Indicator */}
        <div className="p-4 border-t border-inherit">
          <div className={`p-3 rounded-xl flex items-center gap-3 ${
            theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'
          }`}>
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary font-bold">
              {shopProfile.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate">{shopProfile.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{shopProfile.upiId}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        
        {/* Top Header */}
        <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-300 flex items-center justify-between px-6 py-4 ${
          theme === 'dark' ? 'bg-bg-dark/85 border-border-dark' : 'bg-white/85 border-slate-200'
        }`}>
          {/* Left: Mobile hamburger & title */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-display font-bold text-lg md:text-xl capitalize leading-none">
                {navigationItems.find(item => item.id === activeView)?.label || activeView}
              </h2>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button 
              onClick={handleToggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'border-border-dark bg-slate-900 text-amber-400 hover:bg-slate-800' 
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification trigger */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl border relative transition-colors ${
                theme === 'dark' 
                  ? 'border-border-dark bg-slate-900 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[9px] font-bold text-white rounded-full flex items-center justify-center pulse-ripple">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl w-full mx-auto pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className={`relative flex flex-col w-4/5 max-w-sm h-full p-6 shadow-2xl transition-colors duration-300 ${
            theme === 'dark' ? 'bg-bg-dark border-r border-border-dark' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-display font-extrabold text-xl">
                  K
                </div>
                <h1 className="font-display font-bold text-lg text-primary">KiranaAI</h1>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                      isActive 
                        ? 'bg-primary text-white' 
                        : theme === 'dark' 
                          ? 'text-slate-300 hover:bg-slate-800' 
                          : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'
              }`}>
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary font-bold">
                  {shopProfile.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{shopProfile.name}</p>
                  <p className="text-xs text-slate-400 truncate">{shopProfile.upiId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <Notifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
};

export default Layout;
