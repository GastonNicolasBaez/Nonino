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
