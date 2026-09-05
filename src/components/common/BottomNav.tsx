import React from 'react';
import { 
  Home, 
  Grid, 
  Camera, 
  Sparkles, 
  User, 
  ShoppingBag 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCenterAction?: boolean;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    t, 
    setSelectedProductForDetail 
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'catalog', label: t.navShop, icon: Grid },
    { 
      id: 'tryon', 
      label: t.navTryOn, 
      icon: Camera, 
      isCenterAction: true 
    },
    { id: 'stylist', label: t.navAIStylist, icon: Sparkles },
    { id: 'cart', label: t.navCart, icon: ShoppingBag, badge: cartCount },
    { id: 'account', label: t.navAccount, icon: User }
  ];

  const handleNavClick = (tabId: 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart') => {
    setSelectedProductForDetail(null);
    setActiveTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 text-stone-500 select-none pb-safe shadow-lg">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenterAction) {
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className="relative -top-3 flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-12 h-12 flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-stone-950 text-white shadow-xl ring-2 ring-[#D4AF37]' 
                    : 'bg-stone-900 text-[#D4AF37] border border-stone-800 shadow-md group-hover:scale-105'
                }`}>
                  <Camera className="w-5 h-5 stroke-[2]" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-bold mt-1 ${
                  isActive ? 'text-stone-950 font-black' : 'text-stone-600'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-all relative cursor-pointer ${
                isActive ? 'text-stone-950' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-stone-950' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-stone-950 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 min-w-[15px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9px] uppercase tracking-wider mt-1 ${
                isActive ? 'font-bold text-stone-950' : 'text-stone-500 font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
