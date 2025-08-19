import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div>
            <h4 className="text-xl font-bold text-orange-500">El rincón de Lore</h4>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} El rincón de Lore. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;