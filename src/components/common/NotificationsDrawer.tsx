import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Sparkles, 
  Package, 
  Eye, 
  Info, 
  BellRing,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsDrawer: React.FC = () => {
  const { 
    notificationsDrawerOpen, 
    setNotificationsDrawerOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    requestPushPermission,
    pushEnabled,
    t,
    setActiveTab,
    setActiveOrderToTrack,
    orders
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'order' | 'promo'>('all');

  if (!notificationsDrawerOpen) return null;

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'health':
        return <Eye className="w-4 h-4 text-cyan-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.type === 'order') {
      if (orders.length > 0) {
        setActiveOrderToTrack(orders[0]);
        setActiveTab('account');
        setNotificationsDrawerOpen(false);
      }
    } else if (notif.type === 'promo') {
      setActiveTab('catalog');
      setNotificationsDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl text-stone-900 animate-in slide-in-from-right duration-300"
        id="notifications-drawer-panel"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-900 text-[#D4AF37]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-tight">{t.notifications}</h3>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">Real-time alerts & delivery status</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsDrawerOpen(false)}
            className="p-2 border border-stone-200 text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Push Notification Banner */}
        {!pushEnabled && (
          <div className="m-4 p-3.5 bg-[#F5F2ED] border border-stone-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BellRing className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div>
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">Live Push Updates</div>
                <div className="text-stone-500 text-[10px]">Instant optical fitting & courier alerts</div>
              </div>
            </div>
            <button
              onClick={requestPushPermission}
              className="px-3 py-1.5 bg-stone-950 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Allow
            </button>
          </div>
        )}

        {/* Tabs & Mark All Read */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-stone-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                activeFilter === 'all' ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('order')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                activeFilter === 'order' ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveFilter('promo')}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                activeFilter === 'promo' ? 'bg-stone-950 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Offers
            </button>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.clearAll}</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAF8F5]">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-stone-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">No alerts in this category</p>
              <p className="text-[11px] text-stone-400 mt-1">You are completely up to date.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 border transition-all cursor-pointer relative ${
                  notif.read
                    ? 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    : 'bg-white border-stone-400 text-stone-900 shadow-sm'
                }`}
              >
                {!notif.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 bg-[#D4AF37]" />
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F5F2ED] border border-stone-200 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-xs uppercase tracking-wide leading-tight text-stone-950">
                      {notif.title}
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-stone-400 font-mono">
                      <span>
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-stone-900 font-bold uppercase tracking-wider flex items-center gap-0.5">
                        View details <ExternalLink className="w-2.5 h-2.5 inline" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
