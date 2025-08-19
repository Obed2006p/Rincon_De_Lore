import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section id="about-us" className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Sobre Nosotros</h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Pasión por la auténtica cocina italiana.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img src="https://picsum.photos/id/1025/800/600" alt="Interior del restaurante El rincón de Lore" className="w-full h-full object-cover" />
          </div>
          <div className="text-lg text-gray-700 space-y-4">
            <p>
              En "El rincón de Lore", cada platillo cuenta una historia. Fundado en 2024, nuestro restaurante nació del sueño de compartir la auténtica cocina italiana con un toque casero. Creemos en el poder de los ingredientes frescos y de calidad, seleccionados cuidadosamente de productores locales para llevar a tu mesa una experiencia culinaria inolvidable.
            </p>
            <p>
              Nuestra chef y fundadora, Lore, vierte su corazón en cada receta, combinando técnicas tradicionales con un toque de innovación. Más que un restaurante, somos una familia que te abre las puertas de su casa para que disfrutes de momentos especiales alrededor de buena comida.
            </p>
            <p>
              ¡Te esperamos para compartir nuestra pasión contigo!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
