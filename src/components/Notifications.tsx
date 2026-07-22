import React from 'react';
import { useApp, type Notification } from '../context/AppContext';
import { X, CheckCheck, BellRing, Package, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, theme } = useApp();

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'stock':
        return <Package className="text-orange-500" size={18} />;
      case 'payment':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'ai':
        return <Sparkles className="text-purple-500" size={18} />;
      default:
        return <AlertCircle className="text-blue-500" size={18} />;
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/45 backdrop-blur-xs" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl transition-all duration-300 ${
        theme === 'dark' ? 'bg-card-dark text-text-dark border-l border-border-dark' : 'bg-white text-text-light'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing size={20} className="text-primary" />
            <h3 className="font-display font-bold text-lg">Smart Notifications</h3>
          </div>
          <div className="flex items-center gap-3">
            {notifications.some(n => !n.read) && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <BellRing size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs">No notifications to display.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 rounded-xl border flex gap-3 transition-all ${
                  n.read 
                    ? theme === 'dark' 
                      ? 'bg-slate-900/40 border-slate-900/60 opacity-70' 
                      : 'bg-slate-50 border-slate-100 opacity-80'
                    : theme === 'dark'
                      ? 'bg-slate-900 border-orange-500/20'
                      : 'bg-orange-50/40 border-orange-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-xs'
                }`}>
                  {getIcon(n.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold truncate leading-none">{n.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">{formatTime(n.date)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal">
                    {n.message}
                  </p>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 self-center" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
