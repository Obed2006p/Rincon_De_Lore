
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import CartModal from './components/CartModal';
import Hero from './components/Hero';
import Footer from './components/Footer';
import FeaturedCarousel from './components/FeaturedCarousel';
import VideoModal from './components/VideoModal';
import ChatbotWidget from './components/ChatbotWidget';
import QuantityModal from './components/QuantityModal';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import { getMenuItems } from './services/menuService';
import type { MenuItem, CartItem } from './types';

type OrderStatus = 'idle' | 'success';
type Page = 'home' | 'about' | 'contact';

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hasShownVideoAutomatically, setHasShownVideoAutomatically] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const apiKey = process.env.API_KEY;

  const featuredSectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const items = await getMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasShownVideoAutomatically) {
          setIsVideoModalOpen(true);
          setHasShownVideoAutomatically(true);
          if (featuredSectionRef.current) {
            observer.unobserve(featuredSectionRef.current);
          }
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    const currentRef = featuredSectionRef.current;
    if (currentRef && !hasShownVideoAutomatically) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, hasShownVideoAutomatically, currentPage]);

  const handleNavigate = (page: Page | 'menu') => {
    if (page === 'menu') {
      setCurrentPage('home');
      // Use setTimeout to ensure the DOM has updated before trying to scroll
      setTimeout(() => {
        const section = document.getElementById('menu');
        if (section) {
          const headerOffset = 90;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    setSelectedItem(null);
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
          setIsCartOpen(true);
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
    
    setTimeout(() => {
      setIsCartOpen(false);
      setCartItems([]);
      setTimeout(() => setOrderStatus('idle'), 500); 
    }, 3000);
  }, [cartItems]);

  const toggleCart = () => {
    if (isCartOpen && orderStatus === 'success') {
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
  
  const isWeekday = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(dayOfWeek);

  const dailyMenuItems = menuItems.filter(item => {
    // Always include items for the specific day of the week
    if (item.day === dayOfWeek) {
      return true;
    }
    // Include 'Especialidad' items only on weekdays (Monday to Friday)
    if (item.category === 'Especialidad' && isWeekday) {
      return true;
    }
    return false;
  });

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
            <Hero onMenuClick={() => handleNavigate('menu')} />
            <section ref={featuredSectionRef} className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Nuestras Especialidades</h2>
                        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            Descubre los platillos que nuestros clientes aman. Una selección especial de sabores que te transportarán.
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-12"><i className="fas fa-spinner fa-spin text-4xl text-orange-500"></i></div>
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
                <div className="text-center"><i className="fas fa-spinner fa-spin text-4xl text-orange-500"></i></div>
              ) : (
                <MenuList menuItems={dailyMenuItems} onAddToCart={handleOpenQuantityModal} />
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 flex flex-col min-h-screen">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={toggleCart}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="flex-grow">
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
      {!isChatbotOpen && apiKey && (
        <div className="fixed left-4 bottom-4 z-40 flex flex-col items-center group">
          <button
            onClick={toggleChatbot}
            className="bg-orange-500 text-white rounded-full shadow-xl hover:bg-orange-600 transition-all duration-300 ease-in-out transform group-hover:scale-110 flex flex-col items-center justify-center w-20 h-20 md:w-32 md:h-32"
            aria-label="Abrir chat para ordenar"
          >
            <div className="hidden md:flex md:flex-col md:items-center">
              <span className="font-semibold text-lg leading-tight">Tomar</span>
              <span className="font-semibold text-lg leading-tight">Pedido</span>
            </div>
            <i className="fas fa-comments text-3xl md:text-2xl mt-0 md:mt-1"></i>
          </button>
          <div className="flex items-center space-x-2 mt-2">
            <span className="block w-2 h-2 bg-orange-400 rounded-full opacity-70"></span>
            <span className="block w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
            <span className="block w-2 h-2 bg-orange-400 rounded-full opacity-70"></span>
          </div>
        </div>
      )}
      {apiKey && (
         <ChatbotWidget
          isOpen={isChatbotOpen}
          onClose={toggleChatbot}
          availableMenuItems={dailyMenuItems}
          onAddItemsToCart={handleAddItemsToCart}
          apiKey={apiKey}
        />
      )}
    </div>
  );
};

export default App;
