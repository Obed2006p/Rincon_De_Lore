
import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center animate-slide-up">
        <img 
          src="https://res.cloudinary.com/dsmzpsool/image/upload/v1755635609/Gemini_Generated_Image_p7w3l6p7w3l6p7w3-removebg-preview_bhq20q.png" 
          alt="Asistente Lore Chef" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Configuración Requerida</h2>
        <p className="text-gray-600 mb-6">
          Para activar el asistente de pedidos por chat, por favor ingresa tu API Key de Google Gemini.
        </p>
        <div className="space-y-4">
           <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Pega tu API Key aquí"
            className="w-full px-4 py-3 text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-colors"
            aria-label="Google Gemini API Key"
          />
          <button 
            onClick={handleSave}
            disabled={!key.trim()}
            className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Guardar y Activar Chatbot
          </button>
        </div>
         <p className="text-xs text-gray-400 mt-4">
          Tu clave se guardará de forma segura en tu navegador.
        </p>
      </div>
       <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease-out forwards; }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;
