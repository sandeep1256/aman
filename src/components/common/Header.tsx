import React, { useState } from 'react';
import { 
  Glasses, 
  Search, 
  Bell, 
  Heart, 
  ShoppingBag, 
  Globe, 
  DollarSign, 
  X,
  Sparkles,
  Camera,
  Layers,
  ChevronDown,
  User,
  Sun,
  Database,
  MapPin,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CURRENCIES } from '../../data/currencies';
import { Language, Currency } from '../../types';

export const Header: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    cartCount, 
    wishlist, 
    unreadNotifsCount, 
    setNotificationsDrawerOpen,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setSelectedProductForDetail,
    selectedCategory,
    setSelectedCategory,
    user,
    setAuthModalOpen,
    setAuthMode,
    dbSyncStatus
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'hi', label: 'हिन्दी', flag: 'HI' },
    { code: 'es', label: 'Español', flag: 'ES' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'de', label: 'Deutsch', flag: 'DE' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
    { code: 'bn', label: 'বাংলা', flag: 'BN' }
  ];

  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 700) {
      const newCount = logoClickCount + 1;
      if (newCount >= 4) {
        // Owner 4-tap gesture triggers admin panel!
        setActiveTab('admin');
        setLogoClickCount(0);
        return;
      }
      setLogoClickCount(newCount);
    } else {
      setLogoClickCount(1);
    }
    setLastLogoClickTime(now);

    setSelectedProductForDetail(null);
    if (activeTab !== 'admin') {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 text-stone-900 select-none shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-[#F5F2ED] border-b border-stone-200/80 py-1.5 px-4 text-[10px] text-stone-600 flex items-center justify-between font-semibold tracking-widest uppercase">
        <div className="flex items-center gap-3 truncate">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0"></span>
          <span className="truncate">Aman Opticals • Sawai Madhopur Atelier (5.0 ★)</span>
          <button 
            onClick={() => setActiveTab('contact')}
            className="hidden sm:inline text-stone-900 underline font-bold hover:text-[#c59e2b] cursor-pointer"
          >
            Hotline: 097856 09194
          </button>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {/* Quick Currency Selector */}
          <div className="relative">
            <button
              id="currency-selector-button"
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1 hover:text-stone-950 transition-colors cursor-pointer text-stone-700 font-bold"
            >
              <span>{currency} ({CURRENCIES[currency]?.symbol})</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
            {currencyMenuOpen && (
              <div 
                id="currency-dropdown-menu"
                className="absolute right-0 top-full mt-1 bg-white border border-stone-200 shadow-xl rounded-none py-1 w-32 z-50 text-xs"
              >
                {(Object.keys(CURRENCIES) as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                      currency === cur ? 'text-stone-950 font-bold bg-stone-100' : 'text-stone-600'
                    }`}
                  >
                    <span>{cur}</span>
                    <span className="text-stone-400 font-mono">{CURRENCIES[cur].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Language Selector */}
          <div className="relative">
            <button
              id="language-selector-button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 hover:text-stone-950 transition-colors cursor-pointer text-stone-700 font-bold"
            >
              <Globe className="w-3 h-3 text-stone-400" />
              <span>{language.toUpperCase()}</span>
            </button>
            {langMenuOpen && (
              <div 
                id="language-dropdown-menu"
                className="absolute right-0 top-full mt-1 bg-white border border-stone-200 shadow-xl rounded-none py-1 w-40 z-50 text-xs"
              >
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-50 transition-colors ${
                      language === lang.code ? 'text-stone-950 font-bold bg-stone-100' : 'text-stone-600'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className="text-[10px] font-mono text-stone-400">{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name (Geometric Serif Balance) */}
        <button
          id="header-brand-logo"
          onClick={handleLogoClick}
          className="flex flex-col text-left cursor-pointer group focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-tighter font-bold uppercase text-stone-950">
              Aman Opticals
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-semibold -mt-0.5">
            Elite Vision & Luxury Wear
          </span>
        </button>

        {/* Desktop Geometric Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors cursor-pointer pb-1 ${
              activeTab === 'home' 
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Collections
          </button>
          <button
            onClick={() => {
              setSelectedCategory('sunglasses');
              setActiveTab('catalog');
            }}
            className={`transition-colors cursor-pointer pb-1 flex items-center gap-1 ${
              activeTab === 'catalog' && selectedCategory === 'sunglasses'
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sunglasses</span>
          </button>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('catalog');
            }}
            className={`transition-colors cursor-pointer pb-1 ${
              activeTab === 'catalog' && selectedCategory !== 'sunglasses'
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Optical Catalog
          </button>
          <button
            onClick={() => setActiveTab('tryon')}
            className={`transition-colors cursor-pointer pb-1 flex items-center gap-1.5 ${
              activeTab === 'tryon' 
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
            Virtual Lab 3D
          </button>
          <button
            onClick={() => setActiveTab('stylist')}
            className={`transition-colors cursor-pointer pb-1 ${
              activeTab === 'stylist' 
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            Facial Stylist
          </button>
          <button
            id="header-nav-contact"
            onClick={() => setActiveTab('contact')}
            className={`transition-colors cursor-pointer pb-1 flex items-center gap-1.5 ${
              activeTab === 'contact' 
                ? 'text-stone-950 border-b-2 border-stone-950 font-black' 
                : 'hover:text-stone-900 border-b-2 border-transparent'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Store & Contact</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Search Toggle */}
          <button
            id="header-search-toggle"
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2.5 transition-colors border cursor-pointer ${
              searchOpen 
                ? 'bg-stone-900 text-white border-stone-900' 
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-100'
            }`}
            title="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Account / Auth Modal Trigger */}
          {user ? (
            <button
              id="header-account-button"
              onClick={() => {
                setSelectedProductForDetail(null);
                setActiveTab('account');
              }}
              className={`p-2.5 transition-colors border cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-stone-950 text-white border-stone-950'
                  : 'bg-[#FAF8F5] border-stone-200 text-stone-800 hover:border-stone-400'
              }`}
              title={`Account: ${user.displayName || user.email}`}
            >
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden lg:inline text-[10px] font-mono font-bold max-w-[80px] truncate">
                {user.displayName?.split(' ')[0] || 'Patron'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="header-login-button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-2.5 sm:px-3 py-2 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                title="Log In"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Log In</span>
              </button>

              <button
                id="header-register-button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="hidden sm:flex px-2.5 sm:px-3 py-2 bg-stone-950 hover:bg-stone-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider items-center gap-1 cursor-pointer shadow-xs transition-colors"
                title="Register New Account"
              >
                <span>Register</span>
              </button>
            </div>
          )}

          {/* Notifications */}
          <button
            id="header-notifications-bell"
            onClick={() => setNotificationsDrawerOpen(true)}
            className="p-2.5 bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-stone-950 text-[10px] font-mono font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            id="header-wishlist-button"
            onClick={() => {
              setSelectedProductForDetail(null);
              setActiveTab('account');
            }}
            className="p-2.5 bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors relative hidden sm:flex cursor-pointer"
            title="Favorites"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-900 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Bag / Cart */}
          <button
            id="header-cart-button"
            onClick={() => {
              setSelectedProductForDetail(null);
              setActiveTab('cart');
            }}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-[#D4AF37] font-bold">({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-[#FAF8F5] px-4 py-3 animate-in slide-in-from-top duration-200">
          <div className="max-w-xl mx-auto flex items-center gap-3 bg-white border border-stone-300 px-4 py-2 focus-within:border-stone-900 transition-colors shadow-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              id="header-search-input"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setActiveTab('catalog');
                }
              }}
              className="w-full bg-transparent text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none uppercase tracking-wider"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
