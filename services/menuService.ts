import type { MenuItem } from '../types';
import { db } from '../firebase';

/**
 * Fetches the menu items from the Firestore database.
 * @returns A promise that resolves to an array of menu items.
 */
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const menuSnapshot = await db.collection('menuItems').orderBy('name', 'asc').get();
    const menuList = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MenuItem));
    return menuList;
  } catch (error) {
    console.error("Error fetching menu items from Firestore:", error);
    // In case of an error, return an empty array to prevent the app from crashing.
    return [];
  }
};