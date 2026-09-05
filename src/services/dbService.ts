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
import { Product, Order, Prescription, UserAccount, CategoryInfo } from '../types';
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
