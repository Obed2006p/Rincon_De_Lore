
import React from 'react';
import type { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
          <button
            onClick={onAddToCart}
            className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-full hover:bg-orange-500 hover:text-gray-900 transition-all duration-300"
          >
            <i className="fas fa-cart-plus mr-2"></i>
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
