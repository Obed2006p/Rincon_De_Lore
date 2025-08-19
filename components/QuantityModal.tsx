
import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../types';

interface QuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const QuantityModal: React.FC<QuantityModalProps> = ({ isOpen, onClose, item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Reset quantity to 1 whenever a new item is selected
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleIncrement = () => setQuantity(q => q + 1);
  const handleDecrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleConfirm = () => {
    onAddToCart(item, quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in-fast">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slide-up"
      >
        <div className="relative">
          <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" />
          <button onClick={onClose} className="absolute top-3 right-3 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">{item.name}</h2>
          <p className="text-gray-600 mt-2">{item.description}</p>
          
          <div className="flex items-center justify-center my-6 space-x-4">
            <button onClick={handleDecrement} className="w-12 h-12 text-2xl font-bold rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">-</button>
            <span className="text-4xl font-bold w-20 text-center">{quantity}</span>
            <button onClick={handleIncrement} className="w-12 h-12 text-2xl font-bold rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">+</button>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
          >
            Añadir {quantity} por ${(item.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default QuantityModal;
