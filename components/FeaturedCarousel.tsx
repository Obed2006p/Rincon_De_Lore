
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { MenuItem } from '../types';

interface FeaturedCarouselProps {
  items: MenuItem[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (items.length > 0) {
      const isLastSlide = currentIndex === items.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => {
      resetTimeout();
    };
  }, [currentIndex, nextSlide, resetTimeout]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  
  if (!items || items.length === 0) {
    return null;
  }

  const handleMouseEnter = () => {
      resetTimeout();
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      nextSlide();
    }, 4000);
  };

  return (
    <div 
        className="relative w-full max-w-6xl mx-auto group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-roledescription="carousel"
    >
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden rounded-xl shadow-2xl">
        <div 
          className="w-full h-full flex transition-transform ease-in-out duration-1000"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="w-full flex-shrink-0 h-full relative"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white">
                <h3 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{item.name}</h3>
                <p className="text-md md:text-lg mt-2 max-w-lg drop-shadow-md">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Left Arrow */}
      <button 
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer group-hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      {/* Right Arrow */}
      <button 
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/30 text-white cursor-pointer group-hover:bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next slide"
      >
        &#10095;
      </button>
      
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center py-2 space-x-3" role="tablist">
        {items.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === slideIndex ? 'bg-orange-500 scale-125' : 'bg-white/50 hover:bg-white'}`}
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={currentIndex === slideIndex}
            role="tab"
            aria-selected={currentIndex === slideIndex}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
