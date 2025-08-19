import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Contacto</h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            ¡Nos encantaría saber de ti! Haz tu reserva o déjanos un mensaje.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center"><i className="fas fa-map-marker-alt text-orange-500 mr-4"></i>Dirección</h3>
              <p className="text-lg text-gray-600">123 Ocean Drive, Miami, FL</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center"><i className="fas fa-phone text-orange-500 mr-4"></i>Teléfono</h3>
              <p className="text-lg text-gray-600">(123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center"><i className="fas fa-envelope text-orange-500 mr-4"></i>Email</h3>
              <p className="text-lg text-gray-600">contacto@elrincondelore.com</p>
            </div>
          </div>
          <div>
            <form className="bg-gray-50 p-8 rounded-lg shadow-lg space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="tu@email.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea id="message" name="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" placeholder="Escribe tu mensaje aquí..."></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
