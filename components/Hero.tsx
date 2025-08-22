
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onMenuClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onMenuClick }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation shortly after mount to ensure it's visible
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const title = "Donde cada platillo cuenta una historia";
  const subtitle = "De la huerta a nuestra mesa, con un toque de genialidad";

  // Function to wrap words in animated spans
  const renderAnimatedText = (text: string, delayOffset = 0) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        style={{ animationDelay: `${delayOffset + index * 0.1}s` }}
      >
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <div 
      className="relative h-[60vh] bg-cover bg-center"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dsmzpsool/image/upload/v1755210405/descarga_gu9j0g.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h1 className={`text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg ${isAnimated ? 'animate-text-wave' : 'opacity-0'}`}>
            {renderAnimatedText(title)}
          </h1>
          <p className={`text-base sm:text-lg md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md ${isAnimated ? 'animate-text-wave' : 'opacity-0'}`}>
            {renderAnimatedText(subtitle, title.split(' ').length * 0.1)}
          </p>
          <div className="flex justify-center">
            <button
              onClick={onMenuClick}
              className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-orange-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Ver Menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
