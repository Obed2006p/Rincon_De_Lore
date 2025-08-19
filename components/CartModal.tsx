
import React from 'react';
import type { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onPlaceOrder: () => void;
  orderStatus: 'idle' | 'success';
}

const SuccessView: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
    <div className="relative mb-4">
       <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
    <h3 className="text-2xl font-bold text-gray-800">¡Pedido enviado con éxito!</h3>
    <p className="text-gray-600 mt-2">Gracias por tu preferencia. Estamos preparando tu orden.</p>
     <style>{`
      @keyframes fade-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    `}</style>
  </div>
);


const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onPlaceOrder, orderStatus }) => {
  if (!isOpen) return null;

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const renderContent = () => {
    if (orderStatus === 'success') {
      return <SuccessView />;
    }

    if (cartItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
           <i className="fas fa-shopping-cart text-5xl text-gray-300 mb-4"></i>
          <p className="text-lg text-gray-500">Tu carrito está vacío.</p>
        </div>
      );
    }

    return (
      <>
        <div className="overflow-y-auto max-h-96 pr-2">
            {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b last:border-b-0">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4"/>
                    <div className="flex-grow">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border hover:bg-gray-100">-</button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border hover:bg-gray-100">+</button>
                    </div>
                    <p className="w-20 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => onUpdateQuantity(item.id, 0)} className="ml-4 text-red-500 hover:text-red-700">
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ))}
        </div>
        <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={onPlaceOrder} 
              disabled={cartItems.length === 0}
              className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg mt-4 hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <i className="fas fa-paper-plane"></i>
                <span>Enviar Pedido</span>
            </button>
        </div>
      </>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Tu Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
        <div className="p-6">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CartModal;