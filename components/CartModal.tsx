import React, { useState, useEffect } from 'react';
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
    <h3 className="text-2xl font-bold text-gray-800">¡Pedido listo para enviar!</h3>
    <p className="text-gray-600 mt-2">Gracias por tu preferencia. Serás redirigido a WhatsApp para confirmar tu orden.</p>
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
  const [view, setView] = useState<'cart' | 'form'>('cart');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    street: '',
    postalCode: '',
    email: '',
    references: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset view when modal is closed or when cart becomes empty
    if (!isOpen || cartItems.length === 0) {
      setView('cart');
      // Reset form fields
      setCustomerDetails({
        name: '', phone: '', street: '', postalCode: '', email: '', references: '',
      });
    }
  }, [isOpen, cartItems.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const restaurantPhone = '5213148721913';
    const orderSummary = cartItems.map(item => `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('\n');
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const fullMessage = `¡Hola! Quiero hacer el siguiente pedido desde la web:\n\n*MI PEDIDO:*\n${orderSummary}\n\n*TOTAL: $${totalPrice.toFixed(2)}*\n\n*DATOS DE ENTREGA:*\n*Nombre:* ${customerDetails.name}\n*Celular:* ${customerDetails.phone}\n*Dirección:* ${customerDetails.street}, C.P. ${customerDetails.postalCode}\n*Email:* ${customerDetails.email}\n*Referencias:* ${customerDetails.references}\n\n¡Gracias!`;

    const encodedMessage = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    // Trigger the success state in the parent component
    onPlaceOrder();
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 3000);
  };

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

    if (view === 'form') {
      return (
        <form onSubmit={handleWhatsAppSubmit}>
           <h3 className="text-xl font-semibold mb-4 text-gray-800">Completa tus datos para el envío</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 pb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input type="text" id="name" name="name" value={customerDetails.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Celular (10 dígitos)</label>
                <input type="tel" id="phone" name="phone" value={customerDetails.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" required pattern="\d{10}" />
              </div>
               <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Calle y Número</label>
                <input type="text" id="street" name="street" value={customerDetails.street} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" required />
              </div>
               <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                <input type="text" id="postalCode" name="postalCode" value={customerDetails.postalCode} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input type="email" id="email" name="email" value={customerDetails.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="references" className="block text-sm font-medium text-gray-700 mb-1">Referencias del Domicilio</label>
                <textarea id="references" name="references" rows={2} value={customerDetails.references} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="Ej: Casa con portón negro, entre calle X y Y..."></textarea>
              </div>
           </div>
           <div className="mt-6 pt-6 border-t flex items-center justify-between gap-4">
             <button type="button" onClick={() => setView('cart')} className="text-gray-600 hover:text-gray-900 font-semibold">
               &larr; Volver al Carrito
             </button>
             <button 
               type="submit"
               disabled={isSubmitting}
               className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                 <i className="fab fa-whatsapp"></i>
                 <span>Confirmar y Enviar</span>
             </button>
           </div>
        </form>
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
              onClick={() => setView('form')}
              disabled={cartItems.length === 0}
              className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg mt-4 hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <i className="fas fa-arrow-right"></i>
                <span>Continuar al Envío</span>
            </button>
        </div>
      </>
    );
  };
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
             {view === 'cart' ? 'Tu Pedido' : 'Datos de Envío'}
          </h2>
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
