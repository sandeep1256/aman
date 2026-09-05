import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Language, 
  Currency, 
  Product, 
  CartItem, 
  Order, 
  Prescription, 
  TryOnSnapshot, 
  AppNotification,
  LensOption,
  ProductColor,
  UserAccount,
  CategoryInfo
} from '../types';
import { translations, TranslationDictionary } from '../data/translations';
import { PRODUCTS } from '../data/products';
import { LENS_OPTIONS } from '../data/lenses';
import { CATEGORIES_DATA } from '../data/categories';
import { 
  seedInitialDatabaseData,
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  saveProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  savePrescriptionToFirestore,
  fetchPrescriptionsFromFirestore,
  registerUser,
  loginUser,
  loginGuest as loginGuestService,
  logoutCurrentUser,
  getUserProfileFromFirestore,
  updateOrderStatusInDb,
  updateOrderInDb,
  deleteOrderFromDb
} from '../services/dbService';
import { auth, onAuthStateChanged } from '../lib/firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isRTL: boolean;
  currency: Currency;
  setCurrency: (cur: Currency) => void;
  
  // Auth & User Account
  user: UserAccount | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;

  // Navigation & Modals
  activeTab: 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin';
  setActiveTab: (tab: 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin') => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  selectedProductForTryOn: Product | null;
  setSelectedProductForTryOn: (p: Product | null) => void;
  selectedProductForLensConfig: Product | null;
  setSelectedProductForLensConfig: (p: Product | null) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  pdToolModalOpen: boolean;
  setPdToolModalOpen: (open: boolean) => void;
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;

  // Search, Categories & Catalog
  products: Product[];
  categories: CategoryInfo[];
  dbSyncStatus: 'synced' | 'connecting' | 'offline';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Cart & Shopping
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (
    product: Product, 
    color: ProductColor, 
    lensOption?: LensOption, 
    prescription?: Prescription, 
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Products & Frame Inventory Management (Owner Admin)
  adminAddProduct: (product: Product) => Promise<boolean>;
  adminUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  adminDeleteProduct: (productId: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  // Orders & Live Tracking
  orders: Order[];
  placeOrder: (order: Order) => Promise<void>;
  activeOrderToTrack: Order | null;
  setActiveOrderToTrack: (order: Order | null) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  adminAddOrder: (order: Order) => Promise<boolean>;
  adminUpdateOrder: (orderId: string, updates: Partial<Order>) => Promise<boolean>;
  adminDeleteOrder: (orderId: string) => Promise<boolean>;
  fetchAllStoreOrders: () => Promise<void>;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;

  // Prescriptions Vault
  prescriptions: Prescription[];
  savePrescription: (presc: Prescription) => Promise<void>;
  deletePrescription: (savedName: string) => void;

  // Try-on Lookbook
  tryOnSnapshots: TryOnSnapshot[];
  saveTryOnSnapshot: (snapshot: TryOnSnapshot) => void;
  deleteTryOnSnapshot: (id: string) => void;

  // Notifications & PWA
  notifications: AppNotification[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type?: 'promo' | 'order' | 'health' | 'info') => void;

  isOnline: boolean;
  pushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  LANG: 'aman_opticles_lang',
  CURRENCY: 'aman_opticles_currency',
  CART: 'aman_opticles_cart',
  WISHLIST: 'aman_opticles_wishlist',
  ORDERS: 'aman_opticles_orders',
  PRESCRIPTIONS: 'aman_opticles_prescriptions',
  TRYONS: 'aman_opticles_tryons',
  NOTIFS: 'aman_opticles_notifs',
  PUSH_ENABLED: 'aman_opticles_push',
  USER_CACHE: 'aman_opticles_user_cache'
};

const DEFAULT_DEMO_USER: UserAccount = {
  uid: 'aman-demo-user-01',
  email: 'client@amanopticles.com',
  displayName: 'Aarav Sharma',
  phone: '+91 98765 43210',
  membershipTier: 'Platinum',
  rewardPoints: 1250,
  role: 'customer',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  isAnonymous: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENCY) as Currency) || 'INR';
  });

  // User State
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_CACHE);
      return cached ? JSON.parse(cached) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  const getInitialTab = (): 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (path.includes('sky-akash') || hash.includes('sky-akash') || search.includes('sky-akash') || search.includes('admin')) {
        return 'admin';
      }
    }
    return 'home';
  };

  // Navigation & Modals
  const [activeTab, setActiveTabState] = useState<'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin'>(getInitialTab);

  const setActiveTab = (tab: 'home' | 'catalog' | 'tryon' | 'stylist' | 'account' | 'cart' | 'admin') => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        if (tab === 'admin') {
          if (!window.location.pathname.includes('sky-akash')) {
            window.history.pushState({ tab: 'admin' }, '', '/sky-akash');
          }
        } else {
          if (window.location.pathname.includes('sky-akash')) {
            window.history.pushState({ tab }, '', '/');
          }
        }
      } catch (err) {
        console.warn('History pushState error:', err);
      }
    }
  };

  // Listen to browser URL changes for /sky-akash
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();
        if (path.includes('sky-akash') || hash.includes('sky-akash') || search.includes('sky-akash')) {
          setActiveTabState('admin');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForTryOn, setSelectedProductForTryOn] = useState<Product | null>(null);
  const [selectedProductForLensConfig, setSelectedProductForLensConfig] = useState<Product | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [pdToolModalOpen, setPdToolModalOpen] = useState(false);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(null);

  // Search & Catalog
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES_DATA);
  const [dbSyncStatus, setDbSyncStatus] = useState<'synced' | 'connecting' | 'offline'>('connecting');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Local storage synced states
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['aman-titan-01', 'aman-sun-aviator-02'];
    } catch {
      return ['aman-titan-01'];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRESCRIPTIONS);
      return saved ? JSON.parse(saved) : [
        {
          savedName: 'My Daily Work Glasses',
          type: 'single_vision',
          rightEye: { sph: '-1.50', cyl: '-0.50', axis: '90' },
          leftEye: { sph: '-1.75', cyl: '-0.25', axis: '85' },
          pd: 63,
          doctorName: 'Dr. R. K. Mehta (AIIMS Eye Clinic)',
          date: '15 Aug 2026'
        }
      ];
    } catch {
      return [];
    }
  });

  const [tryOnSnapshots, setTryOnSnapshots] = useState<TryOnSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TRYONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'n-db-ready',
        title: '⚡ Firestore Connected',
        message: 'Live database synchronization active for sunglasses, optical catalogue, orders & users.',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: 'n-welcome',
        title: '👓 Welcome to Aman Opticles',
        message: 'Explore our 3D Virtual Try-On and use code AMANOPTICS for 40% off on Japanese Titanium frames!',
        type: 'promo',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED) === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRYONS, JSON.stringify(tryOnSnapshots));
  }, [tryOnSnapshots]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_CACHE, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_CACHE);
    }
  }, [user]);

  // INITIALIZE FIRESTORE DATABASE & AUTH LISTENER
  useEffect(() => {
    const initDbAndAuth = async () => {
      try {
        setDbSyncStatus('connecting');
        await seedInitialDatabaseData();
        
        // Fetch products and categories
        const dbProducts = await fetchProductsFromDb();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }

        const dbCategories = await fetchCategoriesFromDb();
        if (dbCategories && dbCategories.length > 0) {
          setCategories(dbCategories);
        }

        // Fetch user orders if user exists
        if (user) {
          const dbOrders = await fetchOrdersFromFirestore(user.uid);
          if (dbOrders && dbOrders.length > 0) {
            setOrders(dbOrders);
          }

          const dbPresc = await fetchPrescriptionsFromFirestore(user.uid);
          if (dbPresc && dbPresc.length > 0) {
            setPrescriptions(dbPresc);
          }
        }

        setDbSyncStatus('synced');
      } catch (err) {
        console.warn('Firestore initial sync note:', err);
        setDbSyncStatus(navigator.onLine ? 'synced' : 'offline');
      }
    };

    initDbAndAuth();

    // Firebase Auth State Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfileFromFirestore(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          const fallback: UserAccount = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || 'customer@amanopticles.com',
            displayName: firebaseUser.displayName || 'Distinguished Patron',
            membershipTier: 'Gold',
            rewardPoints: 450,
            role: 'customer',
            createdAt: new Date().toISOString(),
            isAnonymous: firebaseUser.isAnonymous
          };
          setUser(fallback);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setDbSyncStatus('synced');
      addNotification('🟢 Back Online', 'Database sync restored. Live real-time catalogue active.', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setDbSyncStatus('offline');
      addNotification('📡 Offline Mode Active', 'No internet connection detected. Seamless local cached catalogue enabled.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Authentication Handlers
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const loggedIn = await loginUser(email, pass);
      setUser(loggedIn);
      setAuthModalOpen(false);
      addNotification('✨ Welcome Back', `Logged in as ${loggedIn.displayName || loggedIn.email}`, 'info');
      
      // Load user data
      const userOrders = await fetchOrdersFromFirestore(loggedIn.uid);
      if (userOrders.length > 0) setOrders(userOrders);

      const userPresc = await fetchPrescriptionsFromFirestore(loggedIn.uid);
      if (userPresc.length > 0) setPrescriptions(userPresc);

      return { success: true };
    } catch (err: any) {
      console.warn('Login error:', err);
      let msg = 'Failed to sign in. Please verify your email and password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'No account found with these credentials or password was incorrect.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Incorrect password entered.';
      }
      return { success: false, error: msg };
    }
  };

  const signup = async (email: string, pass: string, name: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const created = await registerUser(email, pass, name, phone);
      setUser(created);
      setAuthModalOpen(false);
      addNotification('🎉 Account Created', `Welcome to Aman Opticles, ${created.displayName}! +500 Reward points credited.`, 'promo');
      return { success: true };
    } catch (err: any) {
      console.warn('Signup error:', err);
      let msg = 'Could not complete registration. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      return { success: false, error: msg };
    }
  };

  const loginAsGuest = async () => {
    try {
      const guest = await loginGuestService();
      setUser(guest);
      setAuthModalOpen(false);
      addNotification('👋 Guest Session Active', 'Browsing as Guest Connoisseur. You can save lookbooks and place orders!', 'info');
    } catch (err) {
      console.warn('Guest login note:', err);
      setUser(DEFAULT_DEMO_USER);
      setAuthModalOpen(false);
    }
  };

  const logout = async () => {
    try {
      await logoutCurrentUser();
    } catch (err) {}
    setUser(null);
    addNotification('🔒 Signed Out', 'You have been safely signed out of your Aman Opticles account.', 'info');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const setCurrency = (cur: Currency) => {
    setCurrencyState(cur);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENCY, cur);
  };

  const t = useMemo(() => translations[language] || translations.en, [language]);
  const isRTL = language === 'ar';

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const addToCart = (
    product: Product,
    color: ProductColor,
    lensOption?: LensOption,
    prescription?: Prescription,
    quantity: number = 1
  ) => {
    const defaultLens = lensOption || LENS_OPTIONS[0];
    const unitPrice = product.price + defaultLens.price;
    const cartItemId = `${product.id}-${color.name}-${defaultLens.id}-${Date.now()}`;

    const newItem: CartItem = {
      cartItemId,
      product,
      selectedColor: color,
      lensOption: defaultLens,
      prescription,
      quantity,
      unitPrice
    };

    setCart(prev => [newItem, ...prev]);
    addNotification('🛍️ Added to Bag', `${product.name} (${color.name}) with ${defaultLens.name} was added.`, 'info');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter(id => id !== productId);
      } else {
        const prod = products.find(p => p.id === productId);
        addNotification('❤️ Saved to Favorites', `${prod?.name || 'Eyewear'} added to your wishlist.`, 'info');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Save order to state and Firestore database
  const placeOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
    setActiveOrderToTrack(order);

    // Save to Firestore database
    await saveOrderToFirestore(order, user?.uid);

    addNotification(
      '🎉 Order Placed & Synced to Database!', 
      `Order #${order.orderId} recorded in Firestore. Estimated delivery: ${order.estimatedDelivery}`,
      'order'
    );
    
    // Simulate real-time tracking update
    setTimeout(async () => {
      const step = {
        status: 'lens_crafting',
        title: 'Precision Lens Surfacing & Coating',
        description: 'Robotic digital edge profiling in sterile optical cleanroom',
        timestamp: 'Just now',
        completed: true
      };
      await updateOrderStatusInDb(order.orderId, 'lens_crafting', step);
      addNotification(
        '🔬 Order Status Update',
        `Order #${order.orderId} optical lenses cut & anti-reflective coating applied.`,
        'order'
      );
    }, 12000);
  };

  // Admin State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const fetchAllStoreOrders = async () => {
    try {
      const allOrders = await fetchOrdersFromFirestore();
      if (allOrders && allOrders.length > 0) {
        setOrders(allOrders);
      }
    } catch (err) {
      console.warn('Could not fetch all store orders:', err);
    }
  };

  // ----------------------------------------------------
  // ADMIN PRODUCT CATALOG MANAGEMENT (OWNER LISTING)
  // ----------------------------------------------------
  const adminAddProduct = async (newProduct: Product): Promise<boolean> => {
    try {
      setProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)]);
      await saveProductToDb(newProduct);
      addNotification('👓 New Frame Listed', `"${newProduct.name}" is now live in store catalog!`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to add product listing:', err);
      return false;
    }
  };

  const adminUpdateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
      if (selectedProductForDetail && selectedProductForDetail.id === productId) {
        setSelectedProductForDetail(prev => prev ? { ...prev, ...updates } : null);
      }
      await updateProductInDb(productId, updates);
      addNotification('✏️ Frame Listing Updated', `Product ${productId} specifications saved.`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to update product listing:', err);
      return false;
    }
  };

  const adminDeleteProduct = async (productId: string): Promise<boolean> => {
    try {
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (selectedProductForDetail && selectedProductForDetail.id === productId) {
        setSelectedProductForDetail(null);
      }
      await deleteProductFromDb(productId);
      addNotification('🗑️ Frame Removed', `Product ${productId} removed from catalog.`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to delete product listing:', err);
      return false;
    }
  };

  const refreshProducts = async () => {
    try {
      const dbProds = await fetchProductsFromDb();
      if (dbProds && dbProds.length > 0) {
        setProducts(dbProds);
      }
    } catch (err) {
      console.warn('Refresh products warning:', err);
    }
  };

  const adminAddOrder = async (newOrder: Order): Promise<boolean> => {
    try {
      setOrders(prev => [newOrder, ...prev]);
      await saveOrderToFirestore(newOrder, newOrder.shippingAddress?.email || 'admin-walkin');
      addNotification('📦 New Order Created', `Order #${newOrder.orderId} was added to store database.`, 'order');
      return true;
    } catch (err) {
      console.error('Failed to add admin order:', err);
      return false;
    }
  };

  const adminUpdateOrder = async (orderId: string, updates: Partial<Order>): Promise<boolean> => {
    try {
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, ...updates } : o));
      if (activeOrderToTrack && activeOrderToTrack.orderId === orderId) {
        setActiveOrderToTrack(prev => prev ? { ...prev, ...updates } : null);
      }
      await updateOrderInDb(orderId, updates);
      addNotification('✏️ Order Updated', `Order #${orderId} records updated in database.`, 'order');
      return true;
    } catch (err) {
      console.error('Failed to update order:', err);
      return false;
    }
  };

  const adminDeleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      setOrders(prev => prev.filter(o => o.orderId !== orderId));
      if (activeOrderToTrack && activeOrderToTrack.orderId === orderId) {
        setActiveOrderToTrack(null);
      }
      await deleteOrderFromDb(orderId);
      addNotification('🗑️ Order Removed', `Order #${orderId} deleted from database.`, 'info');
      return true;
    } catch (err) {
      console.error('Failed to delete order:', err);
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));
    await updateOrderStatusInDb(orderId, status);
  };

  const savePrescription = async (presc: Prescription) => {
    setPrescriptions(prev => [presc, ...prev.filter(p => p.savedName !== presc.savedName)]);
    await savePrescriptionToFirestore(presc, user?.uid);
    addNotification('📋 Prescription Vault Saved', `Prescription "${presc.savedName || 'Default'}" stored in database.`, 'info');
  };

  const deletePrescription = (savedName: string) => {
    setPrescriptions(prev => prev.filter(p => p.savedName !== savedName));
  };

  const saveTryOnSnapshot = (snapshot: TryOnSnapshot) => {
    setTryOnSnapshots(prev => [snapshot, ...prev]);
    addNotification('📸 Look Saved to Lookbook', `Virtual Try-On snapshot for ${snapshot.productName} saved!`, 'info');
  };

  const deleteTryOnSnapshot = (id: string) => {
    setTryOnSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string, type: 'promo' | 'order' | 'health' | 'info' = 'info') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch {
        // ignore iframe constraints
      }
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      setPushEnabled(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED, 'true');
      addNotification('🔔 In-App Push Enabled', 'Real-time order tracking notifications are now active.', 'info');
      return true;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' || permission === 'default') {
        setPushEnabled(true);
        localStorage.setItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED, 'true');
        addNotification('🔔 Push Notifications Active', 'You will receive real-time order updates & exclusive drop alerts.', 'info');
        return true;
      }
    } catch {
      setPushEnabled(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PUSH_ENABLED, 'true');
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        currency,
        setCurrency,
        user,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        signup,
        loginAsGuest,
        logout,
        activeTab,
        setActiveTab,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedProductForTryOn,
        setSelectedProductForTryOn,
        selectedProductForLensConfig,
        setSelectedProductForLensConfig,
        checkoutModalOpen,
        setCheckoutModalOpen,
        pdToolModalOpen,
        setPdToolModalOpen,
        notificationsDrawerOpen,
        setNotificationsDrawerOpen,
        products,
        categories,
        dbSyncStatus,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        refreshProducts,
        orders,
        placeOrder,
        activeOrderToTrack,
        setActiveOrderToTrack,
        updateOrderStatus,
        adminAddOrder,
        adminUpdateOrder,
        adminDeleteOrder,
        fetchAllStoreOrders,
        isAdminMode,
        setIsAdminMode,
        prescriptions,
        savePrescription,
        deletePrescription,
        tryOnSnapshots,
        saveTryOnSnapshot,
        deleteTryOnSnapshot,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        isOnline,
        pushEnabled,
        requestPushPermission
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
