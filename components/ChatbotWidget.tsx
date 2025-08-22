
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { MenuItem } from '../types';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  availableMenuItems: MenuItem[];
  onAddItemsToCart: (items: { name: string; quantity: number }[]) => void;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  link?: string;
  linkText?: string;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-2">
    <span className="text-gray-400 text-sm">Asistente está escribiendo</span>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
  </div>
);

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ isOpen, onClose, availableMenuItems, onAddItemsToCart }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botAvatarUrl = "https://res.cloudinary.com/dsmzpsool/image/upload/v1755635609/Gemini_Generated_Image_p7w3l6p7w3l6p7w3-removebg-preview_bhq20q.png";

  const systemInstruction = useMemo(() => {
    const menuForAI = availableMenuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    }));

    return `# TU PERSONA Y OBJETIVO
- Eres 'Asistente Lore Chef', el alma digital del restaurante 'El rincón de Lore'.
- Tu estilo es relajado, amigable y con un toque chilango (CDMX), pero siempre claro y servicial. Usa frases como "¿Qué onda?", "¿Qué se te antoja?", "¡Órale va!", "¡De una!".
- Tu misión es guiar al cliente a través de un proceso de 3 fases: tomar el pedido de comida, recolectar sus datos de entrega y finalmente generar un resumen para enviar por WhatsApp.
- Eres un experto absoluto en el menú y no sabes nada de otros platillos.

# TU BASE DE CONOCIMIENTO (EL MENÚ DE HOY)
- Solo puedes tomar pedidos de los siguientes platillos. Este es tu universo y no existe nada fuera de él.
- Menú en formato JSON: ${JSON.stringify(menuForAI)}

# REGLAS DE COMPORTAMIENTO (PROCESO COMPLETO POR FASES)

## FASE 1: Tomar el Pedido de Comida
1.  **INICIO:** Siempre saluda primero. Ejemplo: "¡Qué onda! Soy Lore Chef. ¿Qué se te antoja pedir hoy?".
2.  **TOMA DE PEDIDO:** Identifica platillos del menú, maneja ambigüedades ("¿Chilaquiles rojos o verdes?"), rechaza amablemente platillos fuera del menú ("¡Uy, esa no la manejo, pero te recomiendo...!") y sugiere bebidas o complementos.
3.  **CONFIRMACIÓN DE COMIDA:** Antes de terminar esta fase, confirma el pedido de comida. Ejemplo: "Perfecto, entonces sería una Torta Ahogada y un agua de jamaica. ¿Es correcto?".
4.  **OUTPUT DE FASE 1:** Cuando el cliente confirme, tu *siguiente* respuesta debe ser ÚNICAMENTE el JSON de acción. NADA DE TEXTO ADICIONAL.
    -   **Esquema JSON:** \`{ "action": "add_to_cart", "items": [{ "name": "nombre exacto", "quantity": numero }] }\`
5.  **TRANSICIÓN:** Inmediatamente después de enviar ese JSON, sin esperar respuesta, INICIA LA FASE 2.

## FASE 2: Recolectar Información de Entrega
1.  **INICIO:** Comienza pidiendo el primer dato. Ejemplo: "¡Órale! Ya lo puse en el carrito. Ahora, para mandártelo, necesito unos datos. ¿Cuál es tu nombre completo?".
2.  **RECOLECCIÓN SECUENCIAL:** Pide los siguientes datos UNO POR UNO, de forma conversacional:
    -   Nombre completo
    -   Celular (a 10 dígitos)
    -   Calle y número
    -   Código Postal
    -   Correo electrónico
    -   Referencias del domicilio (ej. "casa con portón negro", "entre calle X y Y")
3.  **CONFIRMACIÓN DE DATOS:** Ve confirmando cada dato que te den. Ejemplo: "Va, 'Juan Pérez'. Ahora pásame tu cel...".

## FASE 3: Confirmación Final y Envío
1.  **RESUMEN TOTAL:** Cuando tengas los 6 datos de entrega, DEBES presentar un resumen completo de TODO: el pedido de comida (que debes recordar del contexto de la conversación) y todos los datos de entrega que recolectaste.
2.  **CONFIRMACIÓN FINAL:** Pregunta por última vez si todo es correcto. Ejemplo: "A ver, checa si todo está bien: Pedido: 1 Torta Ahogada, 1 Agua de Jamaica. Entrega a: Juan Pérez, Cel: 5512345678, en Calle Falsa 123, CP 06000, etc. ¿Es correcto?".
3.  **OUTPUT DE FASE 3:** Si el cliente confirma ("sí", "correcto", etc.), tu *siguiente* respuesta debe ser ÚNICAMENTE el JSON final. NO AÑADAS TEXTO ADICIONAL.
    -   **Esquema JSON Final:** \`{ "action": "prepare_whatsapp_message", "order_items": [{ "name": "nombre exacto", "quantity": numero }], "customer_details": { "name": "...", "phone": "...", "street": "...", "postal_code": "...", "email": "...", "references": "..." } }\``;
  }, [availableMenuItems]);
  
  useEffect(() => {
    // Show welcome message when the widget is opened for the first time in a session.
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: '¡Qué onda! Soy Lore Chef, tu asistente personal. ¿Qué se te antoja pedir hoy?' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    
    // The messages to be sent to the API, without the initial hardcoded greeting.
    const apiMessages = [...messages.slice(1), userMessage];

    // Update UI with the user's message immediately for a responsive feel.
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, systemInstruction }),
      });

      if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          throw new Error(errorData.error || `Request failed with status ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      const botResponseText = data.reply.trim();

      let finalBotMessage: Message;

      if (botResponseText.startsWith('{') && botResponseText.endsWith('}')) {
        try {
          const parsedResponse = JSON.parse(botResponseText);
          if (parsedResponse.action === 'add_to_cart' && Array.isArray(parsedResponse.items)) {
            onAddItemsToCart(parsedResponse.items);
            const itemNames = parsedResponse.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ');
            finalBotMessage = { sender: 'bot', text: `¡Listo! Agregué ${itemNames} a tu carrito. Ya puedes verlo si gustas.` };
          } else if (parsedResponse.action === 'prepare_whatsapp_message') {
            const { order_items, customer_details } = parsedResponse;
            const restaurantPhone = '5213148721913';
            const orderSummary = order_items.map((item: any) => `- ${item.quantity}x ${item.name}`).join('\n');
            const fullMessage = `¡Hola! Quiero hacer el siguiente pedido desde la web:\n\n*MI PEDIDO:*\n${orderSummary}\n\n*DATOS DE ENTREGA:*\n*Nombre:* ${customer_details.name}\n*Celular:* ${customer_details.phone}\n*Dirección:* ${customer_details.street}, C.P. ${customer_details.postal_code}\n*Email:* ${customer_details.email}\n*Referencias:* ${customer_details.references}\n\n¡Gracias!`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${encodedMessage}`;
            finalBotMessage = {
                sender: 'bot',
                text: '¡Excelente! Tu pedido está listo para ser enviado. Haz clic abajo para confirmar y mandar tu orden por WhatsApp.',
                link: whatsappUrl,
                linkText: 'Enviar Pedido por WhatsApp'
            };
          } else {
            finalBotMessage = { sender: 'bot', text: botResponseText };
          }
        } catch (e) {
          console.error("JSON parsing error:", e);
          finalBotMessage = { sender: 'bot', text: botResponseText };
        }
      } else {
        finalBotMessage = { sender: 'bot', text: botResponseText };
      }
      
      setMessages(prev => [...prev, finalBotMessage]);

    } catch (error) {
      console.error("Error sending message to backend:", error);
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
                <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                 {msg.link && (
                    <a
                    href={msg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                    >
                    <i className="fab fa-whatsapp"></i> {msg.linkText}
                    </a>
                )}
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