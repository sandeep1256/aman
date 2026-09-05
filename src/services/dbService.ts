import { 
  db, 
  auth, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  deleteDoc,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
  FirebaseUser
} from '../lib/firebase';
import { Product, Order, Prescription, UserAccount, CategoryInfo, GmbReview, GmbProfileData } from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES_DATA } from '../data/categories';

// ----------------------------------------------------
// 1. PRODUCTS & SUNGLASSES CATALOG DATABASE OPERATIONS
// ----------------------------------------------------

export const seedInitialDatabaseData = async () => {
  try {
    // Check if products exist in Firestore
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    
    if (snap.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of PRODUCTS) {
        const docRef = doc(db, 'products', prod.id);
        await setDoc(docRef, {
          ...prod,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
    }

    // Check if categories exist in Firestore
    const categoriesRef = collection(db, 'categories');
    const catSnap = await getDocs(categoriesRef);
    if (catSnap.empty) {
      console.log('Seeding initial categories into Firestore...');
      for (const cat of CATEGORIES_DATA) {
        const catDocRef = doc(db, 'categories', cat.id);
        await setDoc(catDocRef, {
          ...cat,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
    }
  } catch (err) {
    console.warn('Database seeding note (using local cache if offline):', err);
  }
};

export const fetchProductsFromDb = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Product);
    }
  } catch (err) {
    console.warn('Error fetching products from Firestore, falling back to local dataset:', err);
  }
  return PRODUCTS;
};

export const saveProductToDb = async (product: Product): Promise<boolean> => {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
    return false;
  }
};

export const updateProductInDb = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error updating product in Firestore:', err);
    return false;
  }
};

export const deleteProductFromDb = async (productId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
    return false;
  }
};

export const fetchCategoriesFromDb = async (): Promise<CategoryInfo[]> => {
  try {
    const catRef = collection(db, 'categories');
    const snap = await getDocs(catRef);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as CategoryInfo);
    }
  } catch (err) {
    console.warn('Error fetching categories from Firestore:', err);
  }
  return CATEGORIES_DATA;
};

// ----------------------------------------------------
// 2. ORDER DATABASE OPERATIONS (CREATE, LIST, TRACK)
// ----------------------------------------------------

export const saveOrderToFirestore = async (order: Order, userId?: string) => {
  try {
    const orderDocRef = doc(db, 'orders', order.orderId);
    await setDoc(orderDocRef, {
      ...order,
      userId: userId || 'guest-user',
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving order to Firestore:', err);
    return false;
  }
};

export const fetchOrdersFromFirestore = async (userId?: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    let q = query(ordersRef, orderBy('date', 'desc'));
    
    if (userId && userId !== 'guest-user') {
      q = query(ordersRef, where('userId', '==', userId));
    }
    
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Order);
    }
  } catch (err) {
    console.warn('Error fetching orders from Firestore:', err);
  }
  return [];
};

export const updateOrderStatusInDb = async (orderId: string, status: Order['status'], newTimelineStep?: any) => {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    const updatePayload: any = { status };
    if (newTimelineStep) {
      const snap = await getDoc(orderDocRef);
      if (snap.exists()) {
        const existingTimeline = snap.data().timeline || [];
        updatePayload.timeline = [...existingTimeline, newTimelineStep];
      }
    }
    await updateDoc(orderDocRef, updatePayload);
    return true;
  } catch (err) {
    console.warn('Error updating order status in Firestore:', err);
    return false;
  }
};

export const updateOrderInDb = async (orderId: string, updates: Partial<Order>) => {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { ...updates, updatedAt: new Date().toISOString() });
    return true;
  } catch (err) {
    console.warn('Error updating order in Firestore:', err);
    return false;
  }
};

export const deleteOrderFromDb = async (orderId: string) => {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (err) {
    console.warn('Error deleting order from Firestore:', err);
    return false;
  }
};

// ----------------------------------------------------
// 3. PRESCRIPTION VAULT DATABASE OPERATIONS
// ----------------------------------------------------

export const savePrescriptionToFirestore = async (prescription: Prescription, userId?: string) => {
  try {
    const prescId = `presc-${Date.now()}`;
    const prescDocRef = doc(db, 'prescriptions', prescId);
    await setDoc(prescDocRef, {
      ...prescription,
      id: prescId,
      userId: userId || 'guest-user',
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error saving prescription to Firestore:', err);
    return false;
  }
};

export const fetchPrescriptionsFromFirestore = async (userId?: string): Promise<Prescription[]> => {
  try {
    const prescRef = collection(db, 'prescriptions');
    const q = userId ? query(prescRef, where('userId', '==', userId)) : prescRef;
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map(d => d.data() as Prescription);
    }
  } catch (err) {
    console.warn('Error fetching prescriptions from Firestore:', err);
  }
  return [];
};

// ----------------------------------------------------
// 4. USER AUTHENTICATION & PROFILE FIRESTORE OPERATIONS
// ----------------------------------------------------

export const syncUserProfileToFirestore = async (userAccount: UserAccount) => {
  try {
    const userDocRef = doc(db, 'users', userAccount.uid);
    await setDoc(userDocRef, {
      ...userAccount,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error syncing user profile to Firestore:', err);
  }
};

export const getUserProfileFromFirestore = async (uid: string): Promise<UserAccount | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
  } catch (err) {
    console.warn('Error getting user profile from Firestore:', err);
  }
  return null;
};

// Auth methods
export const registerUser = async (email: string, pass: string, name: string, phone?: string): Promise<UserAccount> => {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(userCred.user, { displayName: name });
  
  const newAccount: UserAccount = {
    uid: userCred.user.uid,
    email: email.toLowerCase(),
    displayName: name,
    phone: phone || '+91 98765 43210',
    membershipTier: 'Gold',
    rewardPoints: 500, // Welcome reward bonus
    role: 'customer',
    createdAt: new Date().toISOString(),
    isAnonymous: false
  };

  await syncUserProfileToFirestore(newAccount);
  return newAccount;
};

export const loginUser = async (email: string, pass: string): Promise<UserAccount> => {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  const existingProfile = await getUserProfileFromFirestore(userCred.user.uid);
  
  if (existingProfile) {
    return existingProfile;
  }

  const fallbackAccount: UserAccount = {
    uid: userCred.user.uid,
    email: userCred.user.email || email,
    displayName: userCred.user.displayName || email.split('@')[0],
    membershipTier: 'Gold',
    rewardPoints: 350,
    role: 'customer',
    createdAt: new Date().toISOString(),
    isAnonymous: false
  };

  await syncUserProfileToFirestore(fallbackAccount);
  return fallbackAccount;
};

export const loginGuest = async (): Promise<UserAccount> => {
  const userCred = await signInAnonymously(auth);
  const guestAccount: UserAccount = {
    uid: userCred.user.uid,
    email: 'guest.shopper@amanopticles.com',
    displayName: 'Guest Connoisseur',
    membershipTier: 'Silver',
    rewardPoints: 100,
    role: 'customer',
    createdAt: new Date().toISOString(),
    isAnonymous: true
  };

  await syncUserProfileToFirestore(guestAccount);
  return guestAccount;
};

export const logoutCurrentUser = async () => {
  await signOut(auth);
};

// ----------------------------------------------------
// 5. GOOGLE BUSINESS PROFILE (GMB) REVIEWS & METADATA SYNC
// ----------------------------------------------------

export const INITIAL_GMB_REVIEWS: GmbReview[] = [
  {
    id: 'gmb-rev-1',
    author: 'Rajendra Sharma',
    rating: 5.0,
    date: '3 weeks ago',
    comment: 'Very good quality glasses and lens fitting. Best optical store near Khandar bus stand in Sawai Madhopur. Highly reasonable manufacturer price directly without middlemen.',
    source: 'Google Review',
    verified: true,
    userLocation: 'Sawai Madhopur',
    likes: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString()
  },
  {
    id: 'gmb-rev-2',
    author: 'Mohit Meena',
    rating: 5.0,
    date: '1 month ago',
    comment: 'Bhai ka nature bahut achha hai aur frames ki variety bahut sundar hai. Computer blue cut lenses banwaye the, bilkul accurate number mila. 100% recommended for family spectacles.',
    source: 'Google Review',
    verified: true,
    userLocation: 'Rajasthan',
    likes: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    id: 'gmb-rev-3',
    author: 'Pooja Rathore',
    rating: 5.0,
    date: '2 months ago',
    comment: 'Best optical manufacturer in Sawai Madhopur! They delivered progressive lenses within same day with proper eye testing. Frame quality is superb and lightweight.',
    source: 'Google Review',
    verified: true,
    userLocation: 'Sawai Madhopur',
    likes: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
  },
  {
    id: 'gmb-rev-4',
    author: 'Akash Verma',
    rating: 5.0,
    date: '3 months ago',
    comment: 'Premium sunglasses and prescription frames at wholesale manufacturer rates. Very polite staff and great collection of titanium and acetate frames. Very satisfied.',
    source: 'Google Review',
    verified: true,
    userLocation: 'Jaipur / SWM',
    likes: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString()
  }
];

export const INITIAL_GMB_PROFILE: GmbProfileData = {
  businessName: 'Aman Opticals - Aman',
  tagline: 'Precision Optical Products Manufacturer & Eyewear Studio',
  category: 'Optical Products Manufacturer · Optician',
  rating: 5.0,
  totalReviews: 4,
  isOpenNow: true,
  timingText: 'Closed · Opens 10:30 am Sun (Mon-Sat 10:00 am - 9:00 pm)',
  address: 'Khandar bus stand tiraha Tel meel ke pass, Sawai Madhopur, Rajasthan 322201',
  city: 'Sawai Madhopur',
  state: 'Rajasthan',
  pincode: '322201',
  phone: '097856 09194',
  formattedPhone: '+91 97856 09194',
  shareUrl: 'https://share.google/I8LKVeAvbE6nWsDTz',
  mapsSearchUrl: 'https://www.google.com/maps/search/?api=1&query=Aman+Opticals+Khandar+bus+stand+tiraha+Sawai+Madhopur+Rajasthan+322201',
  latitude: 26.0124,
  longitude: 76.3533,
  highlights: [
    'Optical Products Manufacturer',
    'Computerized Eye Testing & Prescription Calibration',
    'In-Store Shopping & Same-Day Spectacles',
    'Pan-India Courier Dispatch',
    'Direct Factory Wholesale Pricing'
  ]
};

export const fetchGmbReviewsFromFirestore = async (): Promise<GmbReview[]> => {
  try {
    const revRef = collection(db, 'reviews');
    const snap = await getDocs(revRef);
    if (!snap.empty) {
      const items: GmbReview[] = [];
      snap.forEach(docSnap => {
        items.push({ ...(docSnap.data() as GmbReview), id: docSnap.id });
      });
      return items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // If empty in Firestore, seed initial verified reviews
    console.log('Seeding initial GMB reviews into Firestore...');
    for (const r of INITIAL_GMB_REVIEWS) {
      await setDoc(doc(db, 'reviews', r.id), r, { merge: true });
    }
    return INITIAL_GMB_REVIEWS;
  } catch (err) {
    console.warn('Could not fetch reviews from Firestore, using local fallback:', err);
    return INITIAL_GMB_REVIEWS;
  }
};

export const subscribeToGmbReviews = (callback: (reviews: GmbReview[]) => void): (() => void) => {
  try {
    const revRef = collection(db, 'reviews');
    const unsubscribe = onSnapshot(revRef, (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_GMB_REVIEWS);
      } else {
        const items: GmbReview[] = [];
        snapshot.forEach(docSnap => {
          items.push({ ...(docSnap.data() as GmbReview), id: docSnap.id });
        });
        items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(items);
      }
    }, (error) => {
      console.warn('Reviews onSnapshot subscription error:', error);
      callback(INITIAL_GMB_REVIEWS);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to reviews:', err);
    callback(INITIAL_GMB_REVIEWS);
    return () => {};
  }
};

export const addGmbReviewToFirestore = async (newReview: Omit<GmbReview, 'id' | 'createdAt'>): Promise<GmbReview> => {
  const revId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullReview: GmbReview = {
    ...newReview,
    id: revId,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'reviews', revId), fullReview);
  } catch (err) {
    console.warn('Error saving review to Firestore:', err);
  }
  return fullReview;
};

export const syncGmbProfileToFirestore = async () => {
  try {
    const profileRef = doc(db, 'gmb_profile', 'aman_opticals');
    await setDoc(profileRef, {
      ...INITIAL_GMB_PROFILE,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Error syncing GMB profile to Firestore:', err);
  }
};

