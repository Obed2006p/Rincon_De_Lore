
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import CartModal from './components/CartModal';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FeaturedCarousel from './components/FeaturedCarousel';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import VideoModal from './components/VideoModal';
import ChatbotWidget from './components/ChatbotWidget';
import QuantityModal from './components/QuantityModal';
import { getMenuItems } from './services/menuService';
import type { MenuItem, CartItem } from './types';

type Page = 'home' | 'about' | 'contact';
type OrderStatus = 'idle' | 'success';

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [targetAnchor, setTargetAnchor] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hasShownVideoAutomatically, setHasShownVideoAutomatically] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  
  const featuredSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        // Optionally set an error state to show in the UI
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    // This effect handles scrolling to an anchor on the home page after a page transition
    if (currentPage === 'home' && targetAnchor && !isTransitioning) {
      const timer = setTimeout(() => {
        const section = document.getElementById(targetAnchor);
        if (section) {
          const headerOffset = 90; // Approximate height of the sticky header
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        setTargetAnchor(null); // Reset after scroll
      }, 100); // A small delay to ensure the new page is fully rendered
      return () => clearTimeout(timer);
    }
  }, [currentPage, targetAnchor, isTransitioning]);

  useEffect(() => {
    // Intersection Observer for the video modal
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasShownVideoAutomatically) {
          setIsVideoModalOpen(true);
          setHasShownVideoAutomatically(true); // Mark as shown to prevent re-triggering
          // We only want this to trigger once automatically, so we unobserve
          if (featuredSectionRef.current) {
            observer.unobserve(featuredSectionRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the element is visible
      }
    );

    if (featuredSectionRef.current && !hasShownVideoAutomatically) {
      observer.observe(featuredSectionRef.current);
    }

    return () => {
      if (featuredSectionRef.current) {
        observer.unobserve(featuredSectionRef.current);
      }
    };
  }, [isLoading, hasShownVideoAutomatically]);

  const handleNavigate = (page: Page, anchor: string | null = null) => {
    // Case 1: Already on the target page, just scroll
    if (page === currentPage) {
      if (anchor) {
        const section = document.getElementById(anchor);
        if (section) {
          const headerOffset = 90;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      } else {
        // Scroll to top (e.g., clicking Home/logo on home page)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Case 2: Navigate to a new page with transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setTargetAnchor(anchor);
      window.scrollTo(0, 0); // Jump to top of new page immediately
      setIsTransitioning(false); // This will trigger the fade-in
    }, 300); // This duration must match the CSS transition duration for fade-out
  };

  const handleOpenQuantityModal = useCallback((item: MenuItem) => {
    setSelectedItem(item);
  }, []);

  const handleConfirmAddToCart = useCallback((item: MenuItem, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity }];
    });
    setSelectedItem(null); // Close the modal
  }, []);


  const handleAddItemsToCart = useCallback((itemsToAdd: { name: string; quantity: number }[]) => {
    setCartItems(prevItems => {
      const updatedCart = [...prevItems];
      let itemsWereAdded = false;

      itemsToAdd.forEach(itemToAdd => {
        const menuItem = menuItems.find(
          mi => mi.name.toLowerCase() === itemToAdd.name.toLowerCase()
        );

        if (menuItem && itemToAdd.quantity > 0) {
          const existingItemIndex = updatedCart.findIndex(ci => ci.id === menuItem.id);
          if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += itemToAdd.quantity;
          } else {
            updatedCart.push({ ...menuItem, quantity: itemToAdd.quantity });
          }
          itemsWereAdded = true;
        } else {
          console.warn(`Chatbot tried to add invalid item: ${itemToAdd.name}`);
        }
      });
      
      if(itemsWereAdded) {
          setIsCartOpen(true); // Open the cart to show the new items
      }

      return updatedCart;
    });
  }, [menuItems]);

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handlePlaceOrder = useCallback(() => {
    console.log('Order Placed:', cartItems);
    setOrderStatus('success');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsCartOpen(false); // Close modal
      setCartItems([]);     // Clear cart
      // Use another timeout to reset status after modal has closed
      setTimeout(() => setOrderStatus('idle'), 500); 
    }, 3000);
  }, [cartItems]);

  const toggleCart = () => {
    if (isCartOpen && orderStatus === 'success') {
      // If closing a successful order modal, reset immediately
      setOrderStatus('idle');
      setCartItems([]);
    }
    setIsCartOpen(!isCartOpen);
  }
  
  const closeVideoModal = () => setIsVideoModalOpen(false);
  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);
  
  const getDayOfWeek = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[new Date().getDay()];
  };

  const dayOfWeek = getDayOfWeek();
  const featuredItems = menuItems.filter(item => item.category === 'Especialidad');
  const dailyMenuItems = menuItems.filter(item => item.day === dayOfWeek || item.day === 'Especialidad');


  const renderPage = () => {
    switch(currentPage) {
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <section ref={featuredSectionRef} className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Nuestras Especialidades</h2>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Descubre los platillos que nuestros clientes aman. Una selección especial de sabores que te transportarán.
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-12">
                            <i className="fas fa-spinner fa-spin text-4xl text-orange-500"></i>
                        </div>
                    ) : (
                        <FeaturedCarousel items={featuredItems} />
                    )}
                </div>
            </section>
            
            <div id="menu" className="container mx-auto px-4 py-16 sm:py-24">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  <span className="block">Hoy, {dayOfWeek} tenemos:</span>
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-600">Un menú especial para cada día, preparado con los ingredientes más frescos.</p>
              </div>
              
              {isLoading ? (
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-4xl text-orange-500"></i>
                </div>
              ) : (
                <MenuList menuItems={dailyMenuItems} onAddToCart={handleOpenQuantityModal} />
              )}
            </div>
          </>
        )
    }
  }

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={toggleCart}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {renderPage()}
      </main>
      <Footer />
      <CartModal
        isOpen={isCartOpen}
        onClose={toggleCart}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrder}
        orderStatus={orderStatus}
      />
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={closeVideoModal}
        videoSrc="https://res.cloudinary.com/dsmzpsool/video/upload/v1755211138/Capibara_Rockanrolero_Ordena_en_Restaurante_jrcrqj.mp4"
        startMuted={true}
      />
       <QuantityModal
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleConfirmAddToCart}
      />
      {!isChatbotOpen && (
        <div 
          onClick={toggleChatbot}
          className="fixed left-4 bottom-8 z-40 group cursor-pointer"
          aria-label="Abrir chat para ordenar"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && toggleChatbot()}
        >
          <div className="relative">
            <div
              className="bg-orange-500 text-white font-bold rounded-full shadow-xl group-hover:bg-orange-600 transition-all duration-300 ease-in-out transform group-hover:scale-110 flex flex-col items-center justify-center w-28 h-28"
            >
              <span className="text-sm font-semibold leading-tight pt-2">Tomar</span>
              <span className="text-sm font-semibold leading-tight">Pedido</span>
              <i className="fas fa-comments mt-2 text-2xl"></i>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:scale-110">
              <div className="flex items-center space-x-1 filter drop-shadow-md">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full block"></span>
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full block"></span>
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full block"></span>
              </div>
            </div>
          </div>
        </div>
      )}
       <ChatbotWidget
        isOpen={isChatbotOpen}
        onClose={toggleChatbot}
        menuItems={menuItems}
        onAddItemsToCart={handleAddItemsToCart}
      />
    </div>
  );
};

export default App;