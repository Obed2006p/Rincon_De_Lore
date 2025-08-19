
import React from 'react';
import MenuItemCard from './MenuItemCard';
import type { MenuItem } from '../types';

interface MenuListProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({ menuItems, onAddToCart }) => {
  const groupedItems = menuItems.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Define the desired order of categories
  const categoryOrder = ['Desayuno', 'Comida', 'Bebidas'];

  // Sort the categories based on the defined order
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    // If a category is not in our order list, it goes to the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div>
      {sortedCategories.map((category) => (
        <div key={category} className="mb-12">
          <h3 className="text-3xl font-bold border-b-2 border-orange-500 pb-2 mb-8 text-gray-800">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {groupedItems[category].map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToCart={() => onAddToCart(item)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
