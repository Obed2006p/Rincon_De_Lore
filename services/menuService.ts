import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import type { MenuItem } from '../types';

// Your web app's Firebase configuration is now loaded securely from environment variables
const firebaseConfigString = process.env.VITE_FIREBASE_CONFIG;
if (!firebaseConfigString) {
  throw new Error("Missing Firebase configuration. Please set VITE_FIREBASE_CONFIG in your environment variables.");
}
const firebaseConfig = JSON.parse(firebaseConfigString);


// Initialize Firebase using the v8 compatibility syntax
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const productsCollection = db.collection('products');
  const productSnapshot = await productsCollection.get();
  const productList = productSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      category: data.category,
      day: data.day,
    } as MenuItem;
  });
  return productList;
};
