// Datos mock para el dashboard de administrador en desarrollo local

export const mockDashboardData = {
  metrics: {
    totalSales: 1250000,
    totalOrders: 342,
    averageOrderValue: 3655,
    customerCount: 156,
    growthRate: 12.5,
    topProducts: [
      { name: "Empanada de Carne", sales: 450, revenue: 67500 },
      { name: "Empanada de Pollo", sales: 380, revenue: 57000 },
      { name: "Empanada de Jamón y Queso", sales: 320, revenue: 48000 },
      { name: "Empanada de Verdura", sales: 280, revenue: 42000 },
      { name: "Empanada de Humita", sales: 250, revenue: 37500 }
    ],
    salesData: [
      { day: 'Lun', sales: 12000, orders: 45 },
      { day: 'Mar', sales: 15000, orders: 52 },
      { day: 'Mié', sales: 18000, orders: 48 },
      { day: 'Jue', sales: 22000, orders: 61 },
      { day: 'Vie', sales: 28000, orders: 78 },
      { day: 'Sáb', sales: 32000, orders: 85 },
      { day: 'Dom', sales: 25000, orders: 67 }
    ],
    ordersStatus: [
      { name: 'Completados', value: 45, color: '#10b981' },
      { name: 'Preparando', value: 20, color: '#3b82f6' },
      { name: 'Pendientes', value: 15, color: '#f59e0b' },
      { name: 'Cancelados', value: 5, color: '#ef4444' }
    ],
    customerTrends: [
      { month: 'Ene', newCustomers: 12, totalCustomers: 120 },
      { month: 'Feb', newCustomers: 18, totalCustomers: 138 },
      { month: 'Mar', newCustomers: 15, totalCustomers: 153 },
      { month: 'Abr', newCustomers: 22, totalCustomers: 175 },
      { month: 'May', newCustomers: 25, totalCustomers: 200 },
      { month: 'Jun', newCustomers: 30, totalCustomers: 230 }
    ]
  },
  
  recentOrders: [
    {
      id: "ORD-001",
      customerName: "María González",
      items: 3,
      total: 4500,
      status: "completed",
      date: "2024-01-15T14:30:00Z",
      deliveryType: "delivery"
    },
    {
      id: "ORD-002",
      customerName: "Carlos Rodríguez",
      items: 2,
      total: 3200,
      status: "preparing",
      date: "2024-01-15T15:15:00Z",
      deliveryType: "pickup"
    },
    {
      id: "ORD-003",
      customerName: "Ana Martínez",
      items: 5,
      total: 7500,
      status: "pending",
      date: "2024-01-15T16:00:00Z",
      deliveryType: "delivery"
    }
  ],
  
  products: [
    {
      id: "EMP-001",
      name: "Empanada de Carne",
      category: "Carnes",
      price: 150,
      stock: 45,
      sku: "EMP-CARNE-001",
      status: "active",
      image: "/images/empanada-carne.jpg"
    },
    {
      id: "EMP-002",
      name: "Empanada de Pollo",
      category: "Carnes",
      price: 150,
      stock: 38,
      sku: "EMP-POLLO-001",
      status: "active",
      image: "/images/empanada-pollo.jpg"
    },
    {
      id: "EMP-003",
      name: "Empanada de Jamón y Queso",
      category: "Quesos",
      price: 150,
      stock: 42,
      sku: "EMP-JYQ-001",
      status: "active",
      image: "/images/empanada-jamon-queso.jpg"
    },
    {
      id: "EMP-004",
      name: "Empanada de Verdura",
      category: "Vegetales",
      price: 150,
      stock: 35,
      sku: "EMP-VERD-001",
      status: "active",
      image: "/images/empanada-verdura.jpg"
    },
    {
      id: "EMP-005",
      name: "Empanada de Humita",
      category: "Vegetales",
      price: 150,
      stock: 28,
      sku: "EMP-HUM-001",
      status: "active",
      image: "/images/empanada-humita.jpg"
    }
  ],
  
  customers: [
    {
      id: "CUST-001",
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+54 11 1234-5678",
      totalOrders: 12,
      totalSpent: 45000,
      lastOrder: "2024-01-15T14:30:00Z",
      status: "active"
    },
    {
      id: "CUST-002",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      phone: "+54 11 2345-6789",
      totalOrders: 8,
      totalSpent: 32000,
      lastOrder: "2024-01-15T15:15:00Z",
      status: "active"
    },
    {
      id: "CUST-003",
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      phone: "+54 11 3456-7890",
      totalOrders: 15,
      totalSpent: 75000,
      lastOrder: "2024-01-15T16:00:00Z",
      status: "active"
    }
  ],
  
  categories: [
    { id: "CAT-001", name: "Carnes", productCount: 2, status: "active" },
    { id: "CAT-002", name: "Quesos", productCount: 1, status: "active" },
    { id: "CAT-003", name: "Vegetales", productCount: 2, status: "active" },
    { id: "CAT-004", name: "Especiales", productCount: 0, status: "inactive" }
  ]
};

export const mockOrders = [
  {
    id: "ORD-001",
    customerName: "María González",
    customerEmail: "maria.gonzalez@email.com",
    customerPhone: "+54 11 1234-5678",
    items: [
      { name: "Empanada de Carne", quantity: 2, price: 150, total: 300 },
      { name: "Empanada de Pollo", quantity: 1, price: 150, total: 150 }
    ],
    subtotal: 450,
    deliveryFee: 500,
    total: 4500,
    status: "completed",
    orderDate: "2024-01-15T14:30:00Z",
    deliveryType: "delivery",
    deliveryAddress: "Av. Corrientes 1234, CABA",
    paymentMethod: "cash",
    notes: "Entregar en la puerta principal"
  },
  {
    id: "ORD-002",
    customerName: "Carlos Rodríguez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "+54 11 2345-6789",
    items: [
      { name: "Empanada de Jamón y Queso", quantity: 2, price: 150, total: 300 }
    ],
    subtotal: 300,
    deliveryFee: 0,
    total: 3200,
    status: "preparing",
    orderDate: "2024-01-15T15:15:00Z",
    deliveryType: "pickup",
    deliveryAddress: null,
    paymentMethod: "card",
    notes: "Retirar en 30 minutos"
  }
];

export const mockProducts = [
  {
    id: "EMP-001",
    name: "Empanada de Carne",
    description: "Deliciosa empanada rellena con carne de res, cebolla y especias",
    category: "Carnes",
    price: 150,
    stock: 45,
    sku: "EMP-CARNE-001",
    status: "active",
    image: "/images/empanada-carne.jpg",
    allergens: ["gluten"],
    nutritionalInfo: {
      calories: 280,
      protein: 12,
      carbs: 35,
      fat: 8
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "EMP-002",
    name: "Empanada de Pollo",
    description: "Empanada de pollo desmenuzado con cebolla caramelizada",
    category: "Carnes",
    price: 150,
    stock: 38,
    sku: "EMP-POLLO-001",
    status: "active",
    image: "/images/empanada-pollo.jpg",
    allergens: ["gluten"],
    nutritionalInfo: {
      calories: 265,
      protein: 14,
      carbs: 33,
      fat: 7
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  }
];

// Mock data para clientes
export const mockCustomers = [
  {
    id: "CUST-001",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+54 9 11 1234-5678",
    status: "active",
    totalOrders: 15,
    totalSpent: 22500,
    averageOrderValue: 1500,
    lastOrderDate: "2024-01-15T14:30:00Z",
    createdAt: "2023-06-15T10:00:00Z",
    addresses: [
      {
        type: "home",
        street: "Av. Corrientes 1234",
        city: "Buenos Aires",
        province: "CABA",
        postalCode: "C1043",
        isDefault: true
      }
    ],
    preferences: {
      favoriteProducts: ["EMP-001", "EMP-003"],
      deliveryNotes: "Portero eléctrico - Timbre 4B"
    }
  },
  {
    id: "CUST-002", 
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+54 9 11 2345-6789",
    status: "active",
    totalOrders: 8,
    totalSpent: 12000,
    averageOrderValue: 1500,
    lastOrderDate: "2024-01-12T18:45:00Z",
    createdAt: "2023-08-22T15:30:00Z",
    addresses: [
      {
        type: "work",
        street: "Florida 750",
        city: "Buenos Aires", 
        province: "CABA",
        postalCode: "C1005",
        isDefault: true
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Ana Martínez",
    email: "ana.martinez@email.com", 
    phone: "+54 9 11 3456-7890",
    status: "active",
    totalOrders: 23,
    totalSpent: 34500,
    averageOrderValue: 1500,
    lastOrderDate: "2024-01-14T12:15:00Z",
    createdAt: "2023-04-10T09:20:00Z",
    addresses: [
      {
        type: "home",
        street: "San Martín 456",
        city: "Buenos Aires",
        province: "CABA", 
        postalCode: "C1004",
        isDefault: true
      }
    ],
    preferences: {
      favoriteProducts: ["EMP-002", "EMP-004", "EMP-005"]
    }
  },
  {
    id: "CUST-004",
    name: "Luis Fernández",
    email: "luis.fernandez@email.com",
    phone: "+54 9 11 4567-8901",
    status: "inactive",
    totalOrders: 3,
    totalSpent: 4500,
    averageOrderValue: 1500,
    lastOrderDate: "2023-12-20T16:30:00Z",
    createdAt: "2023-11-05T11:45:00Z",
    addresses: [
      {
        type: "home",
        street: "Rivadavia 2345",
        city: "Buenos Aires",
        province: "CABA",
        postalCode: "C1034",
        isDefault: true
      }
    ]
  }
];

// Mock data para inventario
export const mockInventory = [
  {
    id: "INV-001",
    name: "Harina de Trigo",
    sku: "HAR-TRIGO-001",
    category: "Ingredientes",
    stock: 25,
    minStock: 10,
    maxStock: 100,
    unit: "kg",
    cost: 150,
    price: null,
    supplier: "Molinos Río de la Plata",
    lastRestocked: "2024-01-10T08:00:00Z",
    expiryDate: "2024-06-15",
    location: "Almacén A - Estante 1",
    status: "active"
  },
  {
    id: "INV-002",
    name: "Carne Molida Premium",
    sku: "CAR-MOL-001", 
    category: "Carnes",
    stock: 5,
    minStock: 8,
    maxStock: 30,
    unit: "kg",
    cost: 1200,
    price: null,
    supplier: "Frigorífico San José",
    lastRestocked: "2024-01-12T06:30:00Z",
    expiryDate: "2024-01-18",
    location: "Cámara Fría - Sector B",
    status: "low_stock"
  },
  {
    id: "INV-003",
    name: "Queso Cremoso",
    sku: "QUE-CRE-001",
    category: "Lácteos", 
    stock: 12,
    minStock: 5,
    maxStock: 25,
    unit: "kg",
    cost: 800,
    price: null,
    supplier: "La Serenísima",
    lastRestocked: "2024-01-11T14:20:00Z",
    expiryDate: "2024-01-25",
    location: "Cámara Fría - Sector A",
    status: "active"
  },
  {
    id: "INV-004",
    name: "Cebolla",
    sku: "CEB-COM-001",
    category: "Verduras",
    stock: 15,
    minStock: 10,
    maxStock: 50,
    unit: "kg", 
    cost: 120,
    price: null,
    supplier: "Mercado Central",
    lastRestocked: "2024-01-13T10:15:00Z",
    expiryDate: "2024-02-01",
    location: "Almacén B - Cajón 3",
    status: "active"
  },
  {
    id: "INV-005",
    name: "Huevos Frescos",
    sku: "HUE-FRE-001",
    category: "Ingredientes",
    stock: 0,
    minStock: 5,
    maxStock: 20,
    unit: "docena",
    cost: 300,
    price: null,
    supplier: "Granja Los Pinos",
    lastRestocked: "2024-01-08T16:00:00Z",
    expiryDate: "2024-01-20",
    location: "Cámara Fría - Sector C", 
    status: "out_of_stock"
  }
];

