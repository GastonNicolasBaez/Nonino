/**
 * Datos MOCK para probar el Constructor de Combos
 * Este archivo contiene combos y productos de ejemplo
 */

// Mock de combos disponibles
export const mockCombos = [
  {
    id: 1,
    code: "COMBO-DOCENA",
    name: "Docena Clásica",
    description: "Armá tu docena con los sabores que más te gusten. Incluye 12 empanadas a elección.",
    price: 14400,
    active: true,
    categoryId: 100,
    components: [
      {
        productId: 1,
        productName: "Empanadas",
        quantity: 12,
        price: 1200,
        categoryId: 1 // EMPANADAS_TRADICIONALES
      }
    ],
    imageBase64: ""
  },
  {
    id: 2,
    code: "COMBO-MEGA",
    name: "Mega Combo Familiar",
    description: "Docena de empanadas + 2 bebidas de 1.5L + postre para compartir. ¡Perfecto para 4 personas!",
    price: 18900,
    active: true,
    categoryId: 100,
    components: [
      {
        productId: 1,
        productName: "Empanadas",
        quantity: 12,
        price: 1200,
        categoryId: 1 // EMPANADAS_TRADICIONALES
      },
      {
        productId: 20,
        productName: "Bebidas",
        quantity: 2,
        price: 800,
        categoryId: 3 // BEBIDAS
      },
      {
        productId: 30,
        productName: "Postres",
        quantity: 2,
        price: 1200,
        categoryId: 4 // POSTRES
      }
    ],
    imageBase64: ""
  },
  {
    id: 3,
    code: "COMBO-ESPECIAL",
    name: "Media Docena Premium",
    description: "6 empanadas especiales + bebida. Ideal para una comida individual o para dos.",
    price: 8900,
    active: true,
    categoryId: 100,
    components: [
      {
        productId: 1,
        productName: "Empanadas Especiales",
        quantity: 6,
        price: 1400,
        categoryId: 2 // EMPANADAS_ESPECIALES
      },
      {
        productId: 20,
        productName: "Bebida",
        quantity: 1,
        price: 800,
        categoryId: 3 // BEBIDAS
      }
    ],
    imageBase64: ""
  },
  {
    id: 4,
    code: "COMBO-PARTY",
    name: "Party Box XXL",
    description: "2 docenas de empanadas mixtas + 4 bebidas + 4 postres. ¡Para una fiesta completa!",
    price: 32500,
    active: true,
    categoryId: 100,
    components: [
      {
        productId: 1,
        productName: "Empanadas Tradicionales",
        quantity: 12,
        price: 1200,
        categoryId: 1
      },
      {
        productId: 2,
        productName: "Empanadas Especiales",
        quantity: 12,
        price: 1400,
        categoryId: 2
      },
      {
        productId: 20,
        productName: "Bebidas",
        quantity: 4,
        price: 800,
        categoryId: 3
      },
      {
        productId: 30,
        productName: "Postres",
        quantity: 4,
        price: 1200,
        categoryId: 4
      }
    ],
    imageBase64: ""
  }
];

// Mock de productos (empanadas tradicionales)
export const mockEmpanadaTradicionales = [
  {
    id: 1,
    name: "Carne",
    description: "Carne cortada a cuchillo, cebolla, huevo duro y aceitunas",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 2,
    name: "Pollo",
    description: "Pollo desmenuzado con verduras y especias",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 3,
    name: "Jamón y Queso",
    description: "Jamón cocido y queso mozzarella fundido",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 4,
    name: "Verdura",
    description: "Acelga, cebolla, huevo y salsa blanca",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 5,
    name: "Humita",
    description: "Choclo fresco con salsa blanca y especias",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 6,
    name: "Caprese",
    description: "Tomate, mozzarella y albahaca fresca",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 7,
    name: "Cebolla y Queso",
    description: "Cebolla caramelizada con queso cremoso",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 8,
    name: "Choclo",
    description: "Choclo cremoso con salsa bechamel",
    category: 1,
    price: 1200,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  }
];

// Mock de empanadas especiales
export const mockEmpanadaEspeciales = [
  {
    id: 10,
    name: "Roquefort y Nuez",
    description: "Queso roquefort con nueces tostadas",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 11,
    name: "Cordero Patagónico",
    description: "Cordero especiado con hierbas patagónicas",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 12,
    name: "Salmón y Eneldo",
    description: "Salmón rosado con salsa de eneldo",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 13,
    name: "Bondiola Braseada",
    description: "Bondiola cocida a baja temperatura",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 14,
    name: "Matambre a la Pizza",
    description: "Matambre con salsa, mozzarella y aceitunas",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 15,
    name: "Cuatro Quesos",
    description: "Mozzarella, parmesano, roquefort y provolone",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 16,
    name: "Langostinos al Ajillo",
    description: "Langostinos frescos con ajo y perejil",
    category: 2,
    price: 1600,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 17,
    name: "Rúcula y Jamón Crudo",
    description: "Rúcula fresca con jamón crudo y parmesano",
    category: 2,
    price: 1400,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 18,
    name: "Pulled Pork BBQ",
    description: "Cerdo desmechado con salsa barbacoa",
    category: 2,
    price: 1500,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  },
  {
    id: 19,
    name: "Espinaca y Ricota",
    description: "Espinaca fresca con ricota cremosa",
    category: 2,
    price: 1350,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80"
  }
];

// Mock de bebidas
export const mockBebidas = [
  {
    id: 20,
    name: "Coca Cola 1.5L",
    description: "Gaseosa Coca Cola 1.5 litros",
    category: 3,
    price: 800,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 21,
    name: "Sprite 1.5L",
    description: "Gaseosa Sprite 1.5 litros",
    category: 3,
    price: 800,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 22,
    name: "Fanta 1.5L",
    description: "Gaseosa Fanta 1.5 litros",
    category: 3,
    price: 800,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 23,
    name: "Agua Mineral 1.5L",
    description: "Agua mineral sin gas 1.5 litros",
    category: 3,
    price: 600,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 24,
    name: "Agua con Gas 1.5L",
    description: "Agua mineral con gas 1.5 litros",
    category: 3,
    price: 600,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 25,
    name: "Cerveza Quilmes 1L",
    description: "Cerveza Quilmes 1 litro",
    category: 3,
    price: 1200,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 26,
    name: "Pepsi 1.5L",
    description: "Gaseosa Pepsi 1.5 litros",
    category: 3,
    price: 800,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 27,
    name: "7Up 1.5L",
    description: "Gaseosa 7Up 1.5 litros",
    category: 3,
    price: 800,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 28,
    name: "Jugo de Naranja 1L",
    description: "Jugo natural de naranja exprimida",
    category: 3,
    price: 900,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  },
  {
    id: 29,
    name: "Vino Tinto 750ml",
    description: "Vino tinto malbec",
    category: 3,
    price: 1500,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"
  }
];

// Mock de postres
export const mockPostres = [
  {
    id: 30,
    name: "Flan Casero",
    description: "Flan casero con dulce de leche y crema",
    category: 4,
    price: 1200,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 31,
    name: "Tiramisú",
    description: "Clásico tiramisú italiano",
    category: 4,
    price: 1400,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 32,
    name: "Brownie con Helado",
    description: "Brownie de chocolate con helado de vainilla",
    category: 4,
    price: 1500,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 33,
    name: "Panqueques con Dulce de Leche",
    description: "Panqueques rellenos con dulce de leche",
    category: 4,
    price: 1200,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 34,
    name: "Helado Artesanal",
    description: "2 bochas de helado artesanal a elección",
    category: 4,
    price: 1000,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 35,
    name: "Chocotorta",
    description: "Chocotorta casera con dulce de leche",
    category: 4,
    price: 1300,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 36,
    name: "Lemon Pie",
    description: "Tarta de limón con merengue",
    category: 4,
    price: 1350,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 37,
    name: "Cheesecake de Frutos Rojos",
    description: "Cheesecake con salsa de frutos rojos",
    category: 4,
    price: 1500,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  },
  {
    id: 38,
    name: "Postre Balcarce",
    description: "Torta Balcarce con dulce de leche y merengue",
    category: 4,
    price: 1400,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80"
  }
];

// Todos los productos mock combinados
export const mockProductos = [
  ...mockEmpanadaTradicionales,
  ...mockEmpanadaEspeciales,
  ...mockBebidas,
  ...mockPostres
];

// Función helper para obtener productos por categoría
export const getProductosPorCategoria = (categoryId) => {
  return mockProductos.filter(p => p.category === categoryId);
};

// Función para simular delay de red
export const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

