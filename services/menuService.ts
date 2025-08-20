import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import type { MenuItem } from '../types';

// The original code was trying to load Firebase configuration from an environment
// variable (VITE_FIREBASE_CONFIG) which is not available in this browser-only environment,
// causing the application to crash with a blank screen.
//
// This has been replaced with a placeholder configuration. This will allow the
// application to load correctly. It won't connect to Firebase to fetch menu
// data until a valid configuration is provided, but it resolves the critical startup error.
const firebaseConfig = {
  apiKey: "placeholder-key",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder-project",
  storageBucket: "placeholder.appspot.com",
  messagingSenderId: "placeholder-sender-id",
  appId: "placeholder-app-id"
};


// Initialize Firebase using the v8 compatibility syntax
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const productsCollection = db.collection('products');
    const productSnapshot = await productsCollection.get();
    
    if (productSnapshot.empty) {
      console.warn("No menu items found in Firestore 'products' collection. This is expected if using placeholder config.");
      return [];
    }

    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'No Name',
        description: data.description || '',
        price: data.price || 0,
        imageUrl: data.imageUrl || '',
        category: data.category || 'Uncategorized',
        day: data.day || 'Everyday',
      } as MenuItem;
    });
    return productList;
  } catch (error) {
      console.error("Could not fetch menu items from Firebase. This is expected if the placeholder configuration is being used.", error);
      // Return an empty array to prevent the app from crashing.
      // The UI will show an empty menu.
      return [];
  }
};
