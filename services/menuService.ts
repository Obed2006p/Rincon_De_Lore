
import type { MenuItem } from '../types';
import { db } from '../firebase';

/**
 * Fetches the menu items from the Firestore database.
 * @returns A promise that resolves to an array of menu items.
 */
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuItemsCollectionRef = db.collection('products');
    const q = menuItemsCollectionRef.orderBy('name', 'asc');
    const menuSnapshot = await q.get();
    
    const menuList = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));
    
    return menuList;
  } catch (error) {
    console.error("Error fetching menu items from Firestore:", error);
    // Throw a more specific error to be caught by the UI
    throw new Error("No se pudieron cargar los platillos desde la base de datos.");
  }
};