import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { MenuItem } from '../types';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onAddItemsToCart: (items: { name: string; quantity: number }[]) => void;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="text-gray-400 text-sm">Asistente está escribiendo</span>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ isOpen, onClose, menuItems, onAddItemsToCart }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any | null>(null); // Use 'any' as Chat type is now loaded dynamically
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botAvatarUrl = "https://res.cloudinary.com/dsmzpsool/image/upload/v1755635609/Gemini_Generated_Image_p7w3l6p7w3l6p7w3-removebg-preview_bhq20q.png";

  const systemInstruction = useMemo(() => {
    const menuForAI = menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    }));

    return `# TU PERSONA Y OBJETIVO
- Eres 'Asistente Lore Chef', el alma digital del restaurante 'El rincón de Lore'.
- Tu estilo es relajado, amigable y con un toque chilango (CDMX), pero siempre claro y servicial. Usa frases como "¿Qué onda?", "¿Qué se te antoja?", "¡Órale va!", "¡De una!".
- Tu misión principal es tomar los pedidos de los clientes de manera eficiente y agradable.
- Eres un experto absoluto en el menú y no sabes nada de otros platillos.

# TU BASE DE CONOCIMIENTO (EL MENÚ)
- Solo puedes tomar pedidos de los siguientes platillos. Este es tu universo y no existe nada fuera de él.
- Menú en formato JSON: ${JSON.stringify(menuForAI)}

# REGLAS DE COMPORTAMIENTO (MINI-ALGORITMOS)

1.  **INICIO DE CONVERSACIÓN:**
    -   Siempre saluda primero de forma amigable. Empieza con algo como: "¡Qué onda! Soy Lore Chef, tu asistente personal. ¿Qué se te antoja pedir hoy?"

2.  **TOMA DE PEDIDO:**
    -   **Identificar platillos:** Presta mucha atención a lo que escribe el cliente para identificar platillos del menú.
    -   **Manejar ambigüedad:** Si un cliente pide algo genérico que tiene variantes (ej. "chilaquiles"), debes preguntar para aclarar. Por ejemplo: "¡Claro! ¿Los chilaquiles los quieres verdes o rojos?".
    -   **Platillos fuera del menú:** Si te piden algo que NO está en el menú (ej. "pizza", "pozole"), responde amablemente que no lo manejas y redirige la conversación a una sugerencia del menú. Ejemplo: "¡Uy, qué crees! El pozole no lo manejamos, pero si buscas algo calientito y rico, nuestras enchiladas suizas están de diez. ¿Te laten?".
    -   **Venta sugestiva (Upselling):** Sé proactivo. Si piden un platillo principal, sugiere una bebida o un complemento. Ejemplo: "¡Va que va! Una torta ahogada. ¿Te la preparamos con un agua de jamaica bien fría para que amarre?".

3.  **FINALIZACIÓN Y FORMATO JSON (¡MUY IMPORTANTE!):**
    -   **Confirmación:** Antes de generar el JSON, confirma el pedido con el cliente. Por ejemplo: "Perfecto, entonces sería una Torta Ahogada y un agua de jamaica. ¿Es correcto?".
    -   **Generación del JSON:** Una vez que el cliente confirme su pedido (con "sí", "correcto", "así es", etc.), tu *siguiente* respuesta DEBE SER ÚNICAMENTE el objeto JSON. NO PONGAS NI UNA PALABRA MÁS. Ni "listo", ni "aquí tienes", NADA. Solo el JSON.
    -   **Esquema del JSON:** { "action": "add_to_cart", "items": [{ "name": "nombre exacto del platillo", "quantity": numero }, { "name": "otro platillo", "quantity": numero }] }.
    -   El \`name\` en el JSON debe ser EXACTAMENTE igual al que aparece en el menú que te proporcioné.

4.  **CONVERSACIÓN GENERAL:**
    -   Si el cliente solo platica o hace preguntas sobre el restaurante ("¿dónde están?", "¿a qué hora cierran?"), responde amablemente pero intenta siempre guiar la conversación de vuelta a tomar el pedido. Ejemplo: "Estamos en 123 Ocean Drive. ¡Cuando gustes caerle! ¿Te gustaría que te vaya tomando tu orden para cuando llegues?".`;
  }, [menuItems]);

  useEffect(() => {
    const initializeChat = async () => {
      if (isOpen && menuItems.length > 0 && !chat) {
        try {
          const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : undefined;

          if (!apiKey) {
            throw new Error("Missing Gemini API Key. Please set the API_KEY environment variable.");
          }

          // Dynamically import the library only when needed.
          // This prevents the library's code from running on initial page load
          // and crashing the app in a build-less browser environment.
          const { GoogleGenAI } = await import('@google/genai');
          
          const ai = new GoogleGenAI({ apiKey });
          const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
              systemInstruction: systemInstruction,
            }
          });
          
          setChat(newChat);
          setMessages([{ sender: 'bot', text: '¡Qué onda! Soy Lore Chef, tu asistente personal. ¿Qué se te antoja pedir hoy?' }]);

        } catch (error) {
          console.error("Failed to initialize Gemini Chat:", error);
          setMessages([{ sender: 'bot', text: 'Hubo un problema conectando con mi cerebro. Intenta de nuevo más tarde.' }]);
        }
      }
    };

    initializeChat();
  }, [isOpen, menuItems, chat, systemInstruction]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result: any = await chat.sendMessage({ message: userMessage.text });
      const botResponseText = result.text.trim();


      if (botResponseText.startsWith('{') && botResponseText.endsWith('}')) {
        try {
          const parsedResponse = JSON.parse(botResponseText);
          if (parsedResponse.action === 'add_to_cart' && Array.isArray(parsedResponse.items)) {
            onAddItemsToCart(parsedResponse.items);
            
            const itemNames = parsedResponse.items.map(i => `${i.quantity} ${i.name}`).join(', ');
            const confirmationMessage: Message = { sender: 'bot', text: `¡Listo! Agregué ${itemNames} a tu carrito. Ya puedes verlo ahí. ¿Deseas algo más?` };
            setMessages(prev => [...prev, confirmationMessage]);
          } else {
            setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
          }
        } catch (e) {
          console.error("JSON parsing error:", e);
          setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
        }
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
      }

    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage: Message = { sender: 'bot', text: "¡Ups! Se me cruzaron los cables. Por favor, intenta de nuevo." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm h-[70vh] flex flex-col transition-all duration-300 ease-in-out transform animate-slide-in-right">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl flex flex-col h-full border border-white/10">
        <header className="p-4 flex items-center gap-4 border-b border-white/10 flex-shrink-0">
          <img src={botAvatarUrl} alt="Asistente Lore Chef" className="w-10 h-10 rounded-full border-2 border-orange-500" />
          <h3 className="font-bold text-lg text-white flex-1">Asistente Lore Chef</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Cerrar chat">
            <i className="fas fa-times fa-lg"></i>
          </button>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-3 animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <img src={botAvatarUrl} alt="Bot Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
              )}
              
              <div className={`max-w-xs lg:max-w-sm px-4 py-3 shadow-md ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-t-2xl rounded-bl-2xl' : 'bg-gray-700 text-gray-200 rounded-t-2xl rounded-br-2xl'}`}>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </main>
        
        <footer className="p-4 border-t border-white/10 flex-shrink-0">
          {isLoading && <TypingIndicator />}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu pedido..."
              className="flex-1 w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none placeholder-gray-400 transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
              aria-label="Enviar mensaje"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </footer>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-track { background: transparent; }
        main::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; border: 3px solid transparent; }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;