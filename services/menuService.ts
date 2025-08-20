import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import type { MenuItem } from '../types';

// ===================================================================================
// 🔥 ¡ACCIÓN REQUERIDA! 🔥
//
// Reemplaza este objeto de configuración de marcador de posición con la configuración
// real de tu proyecto de Firebase.
//
// Puedes encontrarla en la Consola de Firebase -> Configuración del Proyecto -> General -> Tus apps
// -> SDK de Firebase -> Configuración (CDN).
//
// ¡Mientras no lo reemplaces, la aplicación funcionará con datos de muestra!
// ===================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U",
  authDomain: "rincon-de-lore.firebaseapp.com",
  projectId: "rincon-de-lore",
  storageBucket: "rincon-de-lore.appspot.com",
  messagingSenderId: "1023054561981",
  appId: "1:1023054561981:web:1a98228f741c1732cc2dd4",
  measurementId: "G-619DPFRWGS"
};


// --- DATOS DE MUESTRA ---
// Estos datos se usarán si la configuración de Firebase no es válida o la conexión falla.
const mockMenuItems: MenuItem[] = [
  { id: 'mock1', name: 'Chilaquiles Rojos', description: 'Totopos de maíz bañados en salsa roja, con crema, queso, cebolla y pollo.', price: 120, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635606/chilaquiles_rojos_j1g8zq.jpg', category: 'Desayuno', day: 'Lunes' },
  { id: 'mock2', name: 'Huevos Rancheros', description: 'Dos huevos estrellados sobre tortillas de maíz, bañados en salsa de jitomate.', price: 100, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635607/huevos_rancheros_c2v6wu.jpg', category: 'Desayuno', day: 'Martes' },
  { id: 'mock3', name: 'Enchiladas Suizas', description: 'Tortillas rellenas de pollo, bañadas en una cremosa salsa verde y gratinadas con queso.', price: 135, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635607/enchiladas_suizas_vysv7n.jpg', category: 'Desayuno', day: 'Miércoles' },
  { id: 'mock4', name: 'Torta Ahogada', description: 'Birote relleno de carnitas de cerdo, bañado en salsa de jitomate y chile.', price: 110, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635608/torta_ahogada_c7ozaq.jpg', category: 'Comida', day: 'Jueves' },
  { id: 'mock5', name: 'Mole Poblano', description: 'Pechuga de pollo bañada en el tradicional mole poblano, servido con arroz rojo.', price: 150, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635608/mole_poblano_d9e5f1.jpg', category: 'Comida', day: 'Viernes' },
  { id: 'mock6', name: 'Tacos al Pastor', description: 'Tres tacos de carne de cerdo marinada, servidos con piña, cebolla y cilantro.', price: 95, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635608/tacos_pastor_n6qrqd.jpg', category: 'Comida', day: 'Sábado' },
  { id: 'mock7', name: 'Agua de Horchata', description: 'Refrescante bebida de arroz con canela y un toque de vainilla.', price: 40, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635606/agua_horchata_o3zw3u.jpg', category: 'Bebidas', day: 'Everyday' },
  { id: 'mock8', name: 'Agua de Jamaica', description: 'Agua fresca preparada con la flor de jamaica, ligeramente endulzada.', price: 40, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635606/agua_jamaica_c8b1wz.jpg', category: 'Bebidas', day: 'Everyday' },
  { id: 'mock9', name: 'Café de Olla', description: 'Café tradicional mexicano endulzado con piloncillo y un toque de canela.', price: 35, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635606/cafe_olla_b9r6df.jpg', category: 'Bebidas', day: 'Everyday' },
  { id: 'mock10', name: 'Chiles en Nogada', description: 'Chile poblano relleno de picadillo, bañado en salsa de nuez y granada.', price: 250, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635606/chiles_nogada_h9k4qm.jpg', category: 'Especialidad', day: 'Especialidad' },
  { id: 'mock11', name: 'Cochinita Pibil', description: 'Carne de cerdo marinada en achiote, cocida lentamente y servida con cebolla morada.', price: 180, imageUrl: 'https://res.cloudinary.com/dsmzpsool/image/upload/v1755635607/cochinita_pibil_l0l1gq.jpg', category: 'Especialidad', day: 'Especialidad' },
];


let db: any;
try {
  // Solo inicializa Firebase si la configuración no es la de marcador de posición
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.warn("Usando configuración de Firebase de marcador de posición. Se cargarán los datos de muestra.");
  }
} catch (error) {
  console.error("Error al inicializar Firebase. Se usarán datos de muestra.", error);
}


export const getMenuItems = async (): Promise<MenuItem[]> => {
  // Si la base de datos no se inicializó (porque se usó la config de marcador de posición), usa los datos de muestra.
  if (!db) {
    return new Promise(resolve => setTimeout(() => resolve(mockMenuItems), 500)); // Simula una carga de red
  }

  // Si la DB está inicializada, intenta obtener los datos reales.
  try {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    
    if (productSnapshot.empty) {
      console.warn("La colección 'products' en Firestore está vacía o no existe. Devolviendo datos de muestra.");
      return mockMenuItems;
    }

    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Sin Nombre',
        description: data.description || '',
        price: data.price || 0,
        imageUrl: data.imageUrl || '',
        category: data.category || 'Sin Categoría',
        day: data.day || 'Todos los días',
      } as MenuItem;
    });
    return productList;
  } catch (error: any) {
      let specificAdvice = "Esto puede deberse a un problema de configuración o de conexión de red.";

      if (error.code === 'permission-denied') {
          specificAdvice = "¡ERROR DE PERMISO DENEGADO! La causa más común es que la URL de esta vista previa no está en tu lista de 'Authorized Domains' en la configuración de Authentication de Firebase. O bien, tus Reglas de Seguridad de Firestore no permiten la lectura pública de la colección 'products'.";
      } else if (error.code === 'unauthenticated') {
          specificAdvice = "ERROR DE AUTENTICACIÓN. Revisa que tu API Key y la configuración del proyecto (firebaseConfig) sean correctas.";
      }

      console.error(`No se pudieron obtener los productos de Firebase. ${specificAdvice} Devolviendo datos de muestra.`, error);
      return mockMenuItems; // Devuelve datos de muestra como último recurso
  }
};