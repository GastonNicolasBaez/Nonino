import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter,
  Users, 
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  Calendar,
  TrendingUp,
  UserX,
  Edit,
  MoreVertical,
  Eye,
  Download,
  RefreshCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice, formatDate } from "../../lib/utils";
import { toast } from "sonner";

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock customer data
  const mockCustomers = [
    {
      id: "cust-001",
      name: "Juan Carlos Pérez",
      email: "juan.perez@email.com",
      phone: "+54 11 1234-5678",
      avatar: null,
      registrationDate: "2023-05-15T10:30:00Z",
      lastOrder: "2024-01-15T14:30:00Z",
      totalOrders: 23,
      totalSpent: 15450,
      averageOrderValue: 672,
      status: "active",
      favoriteProducts: ["Empanada de Carne", "Empanada de Pollo"],
      addresses: [
        {
          type: "home",
          address: "Av. Corrientes 1234, CABA",
          zone: "centro",
          isDefault: true
        },
        {
          type: "work",
          address: "Florida 456, CABA",
          zone: "centro",
          isDefault: false
        }
      ],
      preferences: {
        notifications: true,
        promotions: true,
        newsletter: false
      },
      customerLevel: "gold",
      notes: "Cliente frecuente, siempre pide extra de aceitunas"
    },
    {
      id: "cust-002",
      name: "María García Rodríguez",
      email: "maria.garcia@email.com",
      phone: "+54 11 8765-4321",
      avatar: null,
      registrationDate: "2023-08-22T16:45:00Z",
      lastOrder: "2024-01-14T19:20:00Z",
      totalOrders: 15,
      totalSpent: 8750,
      averageOrderValue: 583,
      status: "active",
      favoriteProducts: ["Empanada de Jamón y Queso", "Empanada de Dulce de Leche"],
      addresses: [
        {
          type: "home",
          address: "Belgrano 789, Zona Norte",
          zone: "norte",
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        promotions: true,
        newsletter: true
      },
      customerLevel: "silver",
      notes: "Prefiere pedidos vegetarianos"
    },
    {
      id: "cust-003",
      name: "Carlos Alberto Fernández",
      email: "carlos.fernandez@email.com",
      phone: "+54 11 2468-1357",
      avatar: null,
      registrationDate: "2023-12-10T09:15:00Z",
      lastOrder: "2024-01-10T12:30:00Z",
      totalOrders: 8,
      totalSpent: 3240,
      averageOrderValue: 405,
      status: "active",
      favoriteProducts: ["Empanada de Carne", "Empanada de Cordero"],
      addresses: [
        {
          type: "home",
          address: "San Martín 321, Zona Sur",
          zone: "sur",
          isDefault: true
        }
      ],
      preferences: {
        notifications: false,
        promotions: true,
        newsletter: false
      },
      customerLevel: "bronze",
      notes: ""
    },
    {
      id: "cust-004",
      name: "Ana Patricia López",
      email: "ana.lopez@email.com",
      phone: "+54 11 9876-5432",
      avatar: null,
      registrationDate: "2023-03-08T11:20:00Z",
      lastOrder: "2023-12-15T18:45:00Z",
      totalOrders: 5,
      totalSpent: 1890,
      averageOrderValue: 378,
      status: "inactive",
      favoriteProducts: ["Empanada de Verduras"],
      addresses: [
        {
          type: "home",
          address: "Rivadavia 654, Zona Oeste",
          zone: "oeste",
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        promotions: false,
        newsletter: false
      },
      customerLevel: "bronze",
      notes: "Cliente inactivo desde diciembre"
    },
    {
      id: "cust-005",
      name: "Roberto Miguel Díaz",
      email: "roberto.diaz@email.com",
      phone: "+54 11 3456-7890",
      avatar: null,
      registrationDate: "2023-07-03T14:10:00Z",
      lastOrder: "2024-01-13T20:15:00Z",
      totalOrders: 31,
      totalSpent: 22150,
      averageOrderValue: 714,
      status: "active",
      favoriteProducts: ["Empanada de Carne", "Empanada de Pollo", "Empanada de Cordero"],
      addresses: [
        {
          type: "home",
          address: "9 de Julio 987, Centro",
          zone: "centro",
          isDefault: true
        }
      ],
      preferences: {
        notifications: true,
        promotions: true,
        newsletter: true
      },
      customerLevel: "platinum",
      notes: "Cliente VIP, pedidos grandes frecuentes"
    }
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setTimeout(() => {
        setCustomers(mockCustomers);
        setLoading(false);
      }, 800);
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    inactive: customers.filter(c => c.status === "inactive").length,
    new: customers.filter(c => {
      const regDate = new Date(c.registrationDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return regDate >= thirtyDaysAgo;
    }).length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue: customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length || 0,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0)
  };

  const getCustomerLevelBadge = (level) => {
    const levels = {
      bronze: { color: "bg-amber-600", label: "Bronce" },
      silver: { color: "bg-gray-500", label: "Plata" },
      gold: { color: "bg-yellow-500", label: "Oro" },
      platinum: { color: "bg-purple-600", label: "Platino" }
    };
    
    const levelInfo = levels[level] || levels.bronze;
    return (
      <Badge className={`${levelInfo.color} text-white text-xs`}>
        {levelInfo.label}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" 
      ? <Badge variant="success" className="bg-green-500 text-white">Activo</Badge>
      : <Badge variant="destructive">Inactivo</Badge>;
  };

  const CustomerDetailModal = ({ customer, onClose }) => {
    if (!customer) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Detalles del Cliente</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-empanada-golden rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      {getCustomerLevelBadge(customer.customerLevel)}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Cliente desde {formatDate(customer.registrationDate)}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {getStatusBadge(customer.status)}
                  </div>
                </CardContent>
              </Card>

              {/* Direcciones */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Direcciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {address.type === "home" ? "Casa" : "Trabajo"}
                        </Badge>
                        {address.isDefault && (
                          <Badge variant="empanada" className="text-xs">Principal</Badge>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span>{address.address}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Estadísticas y Actividad */}
            <div className="lg:col-span-2 space-y-4">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-empanada-golden">{customer.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Pedidos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-500">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-sm text-muted-foreground">Gastado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-500">{formatPrice(customer.averageOrderValue)}</p>
                    <p className="text-sm text-muted-foreground">Promedio</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      {Math.floor((new Date() - new Date(customer.lastOrder)) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-sm text-muted-foreground">Días desde último pedido</p>
                  </CardContent>
                </Card>
              </div>

              {/* Productos Favoritos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Productos Favoritos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {customer.favoriteProducts.map((product, index) => (
                      <Badge key={index} variant="outline">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preferencias */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Notificaciones</span>
                      <Badge variant={customer.preferences.notifications ? "success" : "destructive"} className="text-xs">
                        {customer.preferences.notifications ? "Sí" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Promociones</span>
                      <Badge variant={customer.preferences.promotions ? "success" : "destructive"} className="text-xs">
                        {customer.preferences.promotions ? "Sí" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Newsletter</span>
                      <Badge variant={customer.preferences.newsletter ? "success" : "destructive"} className="text-xs">
                        {customer.preferences.newsletter ? "Sí" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              {customer.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{customer.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra tu base de clientes y analiza su comportamiento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="empanada" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-2xl font-bold">{customerStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                <p className="text-2xl font-bold text-green-500">{customerStats.active}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nuevos (30 días)</p>
                <p className="text-2xl font-bold text-empanada-golden">{customerStats.new}</p>
              </div>
              <UserPlus className="w-8 h-8 text-empanada-golden" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-purple-500">
                  {formatPrice(customerStats.totalRevenue)}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Clientes ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-16 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Cliente</th>
                    <th className="text-left p-4 font-medium">Contacto</th>
                    <th className="text-left p-4 font-medium">Nivel</th>
                    <th className="text-left p-4 font-medium">Pedidos</th>
                    <th className="text-left p-4 font-medium">Total Gastado</th>
                    <th className="text-left p-4 font-medium">Último Pedido</th>
                    <th className="text-left p-4 font-medium">Estado</th>
                    <th className="text-left p-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-empanada-golden rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getCustomerLevelBadge(customer.customerLevel)}
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="font-medium">{customer.totalOrders}</p>
                          <p className="text-sm text-muted-foreground">pedidos</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{formatPrice(customer.totalSpent)}</p>
                          <p className="text-sm text-muted-foreground">
                            Promedio: {formatPrice(customer.averageOrderValue)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{formatDate(customer.lastOrder)}</p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(customer.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}