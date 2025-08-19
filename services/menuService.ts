import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import type { MenuItem } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U",
  authDomain: "rincon-de-lore.firebaseapp.com",
  projectId: "rincon-de-lore",
  storageBucket: "rincon-de-lore.appspot.com",
  messagingSenderId: "1023054561981",
  appId: "1:1023054561981:web:1a98228f741c1732cc2dd4",
  measurementId: "G-619DPFRWGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const productsCollection = collection(db, 'products');
  const productSnapshot = await getDocs(productsCollection);
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
