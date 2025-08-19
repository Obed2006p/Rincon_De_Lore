import React, { useState, useEffect } from 'react';
import CartIcon from './CartIcon';

type Page = 'home' | 'about' | 'contact';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (page: Page, anchor?: string | null) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onNavigate, currentPage }) => {
  const [logoAnimationClass, setLogoAnimationClass] = useState('');

  useEffect(() => {
    // Apply the animation class after the component has mounted to ensure it triggers
    setLogoAnimationClass('animate-logo-intro');
  }, []);
  
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, page: Page, sectionId?: string) => {
    event.preventDefault();
    onNavigate(page, sectionId);
  };

  return (
    <header className="bg-orange-500 shadow-lg sticky top-0 z-50">
      {/* Use Grid layout for medium screens and up to achieve true centering for the nav */}
      <div className="container mx-auto px-4 py-2 flex md:grid md:grid-cols-3 items-center">
        {/* LOGO */}
        <div className="flex-shrink-0 md:justify-self-start">
            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className={`flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 ${logoAnimationClass}`}>
                <img src="https://res.cloudinary.com/dsmzpsool/image/upload/v1755194765/Gemini_Generated_Image_e23g57e23g57e23g-removebg-preview_j0jirf.png" alt="El rincón de Lore Logo" className="h-12" />
                <span className="ml-3 text-2xl font-bold text-white hidden sm:block">El rincón de Lore</span>
            </a>
        </div>

        {/* NAVIGATION - Hidden on mobile, centered on medium+ */}
        <nav className="hidden md:flex justify-self-center space-x-8">
            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className="text-white hover:text-orange-200 transition-colors duration-300">Inicio</a>
            <a href="#about-us" onClick={(e) => handleNavClick(e, 'about')} className="text-white hover:text-orange-200 transition-colors duration-300">Sobre Nosotros</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-white hover:text-orange-200 transition-colors duration-300">Contacto</a>
        </nav>

        {/* Spacer for flex layout on mobile */}
        <div className="flex-grow md:hidden" />

        {/* CART ICON */}
        <div className="flex-shrink-0 md:justify-self-end">
            <button onClick={onCartClick} className="relative text-white hover:text-orange-200 transition-colors duration-300" aria-label="Open cart">
              <CartIcon count={cartItemCount} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;