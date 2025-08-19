
import React from 'react';

interface CartIconProps {
  count: number;
}

const CartIcon: React.FC<CartIconProps> = ({ count }) => {
  return (
    <div className="relative">
      <i className="fas fa-shopping-cart text-2xl"></i>
      {count > 0 && (
        <span className="absolute -top-6 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
