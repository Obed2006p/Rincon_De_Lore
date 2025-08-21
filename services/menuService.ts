import type { MenuItem } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

/**
 * Fetches the menu items from the 'products' collection in Firestore.
 * @returns A promise that resolves to an array of menu items.
 */
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuCollectionRef = collection(db, 'products');
    const q = query(menuCollectionRef);
    const querySnapshot = await getDocs(q);

    const menuItems = querySnapshot.docs.map(doc => {
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

    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items from Firestore:", error);
    // Return an empty array in case of an error to prevent the app from crashing.
    return [];
  }
};