
import React, { useState, useEffect } from 'react';
import CartIcon from './CartIcon';

type Page = 'home' | 'about' | 'contact';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onNavigate, currentPage }) => {
  const [logoAnimationClass, setLogoAnimationClass] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply the animation class after the component has mounted to ensure it triggers
    setLogoAnimationClass('animate-logo-intro');
  }, []);
  
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, page: Page) => {
    event.preventDefault();
    onNavigate(page);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const getLinkClass = (page: Page) => {
    const baseClass = "transition-colors duration-300 py-1";
    if (currentPage === page) {
      return `${baseClass} text-white font-semibold border-b-2 border-white`;
    }
    return `${baseClass} text-white/80 hover:text-white`;
  };

  const getMobileLinkClass = (page: Page) => {
    const baseClass = "block text-2xl font-bold py-4 text-center transition-colors duration-300";
    if (currentPage === page) {
      return `${baseClass} text-orange-500 bg-white/10`;
    }
    return `${baseClass} text-white hover:bg-white/5`;
  };

  return (
    <>
      <header className="bg-orange-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center relative">
          {/* LOGO */}
          <div className="flex-shrink-0">
              <a href="#" onClick={(e) => handleNavClick(e, 'home')} className={`flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 ${logoAnimationClass}`}>
                  <img src="https://res.cloudinary.com/dsmzpsool/image/upload/v1755194765/Gemini_Generated_Image_e23g57e23g57e23g-removebg-preview_j0jirf.png" alt="El rincón de Lore Logo" className="h-12" />
                  <span className="ml-3 text-2xl font-bold text-white hidden sm:block">El rincón de Lore</span>
              </a>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#" onClick={(e) => handleNavClick(e, 'home')} className={getLinkClass('home')}>Inicio</a>
              <a href="#" onClick={(e) => handleNavClick(e, 'about')} className={getLinkClass('about')}>Sobre Nosotros</a>
              <a href="#" onClick={(e) => handleNavClick(e, 'contact')} className={getLinkClass('contact')}>Contacto</a>
          </nav>
          
          {/* RIGHT SIDE ICONS (CART & HAMBURGER) */}
          <div className="flex items-center space-x-4">
            <button onClick={onCartClick} className="relative text-white hover:text-orange-200 transition-colors duration-300" aria-label="Open cart">
              <CartIcon count={cartItemCount} />
            </button>
            {/* HAMBURGER BUTTON */}
            <button 
              className="md:hidden text-white text-2xl w-8 h-8 flex items-center justify-center" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <nav 
          className={`fixed top-0 right-0 h-full w-2/3 max-w-xs bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the nav
        >
          <div className="pt-24">
            <a href="#" onClick={(e) => handleNavClick(e, 'home')} className={getMobileLinkClass('home')}>Inicio</a>
            <a href="#" onClick={(e) => handleNavClick(e, 'about')} className={getMobileLinkClass('about')}>Sobre Nosotros</a>
            <a href="#" onClick={(e) => handleNavClick(e, 'contact')} className={getMobileLinkClass('contact')}>Contacto</a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
