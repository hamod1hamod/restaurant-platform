import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore, collection, getDocs, doc, setDoc, deleteDoc, writeBatch, Firestore
} from 'firebase/firestore';
import {
  mockSettings, mockCategories, mockProducts, mockCoupons, mockReviews, mockOrders
} from './mockData';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const FIREBASE_CONFIG_KEY = 'gh_firebase_custom_config';

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
    
    // Check vite env
    const env = (import.meta as any).env;
    if (env?.VITE_FIREBASE_API_KEY && env?.VITE_FIREBASE_PROJECT_ID) {
      return {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: env.VITE_FIREBASE_APP_ID || ''
      };
    }
  } catch {}
  return null;
}

let appInstance: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;

export function initFirebase(): { app: FirebaseApp | null; db: Firestore | null } {
  if (firestoreInstance) return { app: appInstance, db: firestoreInstance };

  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null };
  }

  try {
    const apps = getApps();
    appInstance = apps.length > 0 ? apps[0] : initializeApp(config);
    firestoreInstance = getFirestore(appInstance);
    return { app: appInstance, db: firestoreInstance };
  } catch (err) {
    console.warn("Failed to initialize Firebase:", err);
    return { app: null, db: null };
  }
}

export function saveFirebaseConfig(cfg: FirebaseConfig): boolean {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
    appInstance = null;
    firestoreInstance = null;
    initFirebase();
    return true;
  } catch {
    return false;
  }
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_CONFIG_KEY);
  appInstance = null;
  firestoreInstance = null;
}

// Restore / reset entire database to baseline seeded state
export async function restoreDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Reset LocalStorage
    localStorage.setItem('gh_categories', JSON.stringify(mockCategories));
    localStorage.setItem('gh_products', JSON.stringify(mockProducts));
    localStorage.setItem('gh_coupons', JSON.stringify(mockCoupons));
    localStorage.setItem('gh_reviews', JSON.stringify(mockReviews));
    localStorage.setItem('gh_orders', JSON.stringify(mockOrders));
    localStorage.setItem('gh_settings', JSON.stringify(mockSettings));

    // 2. Sync to Firebase Firestore if connected
    const { db } = initFirebase();
    if (db) {
      const batch = writeBatch(db);

      // Categories
      for (const cat of mockCategories) {
        batch.set(doc(db, 'categories', String(cat.id)), cat);
      }
      // Products
      for (const prod of mockProducts) {
        batch.set(doc(db, 'products', String(prod.id)), prod);
      }
      // Coupons
      for (const coup of mockCoupons) {
        batch.set(doc(db, 'coupons', String(coup.id)), coup);
      }
      // Reviews
      for (const rev of mockReviews) {
        batch.set(doc(db, 'reviews', String(rev.id)), rev);
      }
      // Orders
      for (const ord of mockOrders) {
        batch.set(doc(db, 'orders', String(ord.id)), ord);
      }
      // Settings
      batch.set(doc(db, 'settings', 'global'), mockSettings);

      await batch.commit();
      return { success: true, message: 'Database successfully restored and synchronized with Firebase Firestore!' };
    }

    return { success: true, message: 'Database successfully restored to original gourmet baseline menu!' };
  } catch (err: any) {
    return { success: false, message: `Restore error: ${err.message || 'Unknown error'}` };
  }
}

// Fetch all collections from Firestore if available
export async function syncFromFirestore(): Promise<boolean> {
  const { db } = initFirebase();
  if (!db) return false;

  try {
    const [catSnap, prodSnap, revSnap, ordSnap, coupSnap] = await Promise.all([
      getDocs(collection(db, 'categories')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'reviews')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'coupons'))
    ]);

    if (!catSnap.empty) {
      const cats = catSnap.docs.map(d => d.data());
      localStorage.setItem('gh_categories', JSON.stringify(cats));
    }
    if (!prodSnap.empty) {
      const prods = prodSnap.docs.map(d => d.data());
      localStorage.setItem('gh_products', JSON.stringify(prods));
    }
    if (!revSnap.empty) {
      const revs = revSnap.docs.map(d => d.data());
      localStorage.setItem('gh_reviews', JSON.stringify(revs));
    }
    if (!ordSnap.empty) {
      const ords = ordSnap.docs.map(d => d.data());
      localStorage.setItem('gh_orders', JSON.stringify(ords));
    }
    if (!coupSnap.empty) {
      const coups = coupSnap.docs.map(d => d.data());
      localStorage.setItem('gh_coupons', JSON.stringify(coups));
    }
    return true;
  } catch (err) {
    console.warn("Firestore sync error:", err);
    return false;
  }
}
