import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Clock, Heart, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
// TODO: Implementar AuthContext para usuarios públicos
// import { useAuth } from "../../context/AuthContext";
import { formatPrice, formatDateTime } from "../../lib/utils";
import { toast } from "sonner";

export function ProfilePage() {
  // const { user, logout, updateUser } = useAuth();
  const user = null; // TODO: Implementar autenticación
  const logout = () => {}; // TODO: Implementar autenticación
  const updateUser = () => {}; // TODO: Implementar autenticación
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSave = () => {
    updateUser(formData);
    setEditMode(false);
    toast.success("Perfil actualizado correctamente");
  };

  const mockOrders = [
    {
      id: "EMP-2024-001",
      date: "2024-01-15T14:30:00Z",
      status: "delivered",
      total: 2450,
      items: ["2x Empanada de Carne", "1x Empanada de Pollo"]
    },
    {
      id: "EMP-2024-002",
      date: "2024-01-10T19:45:00Z",
      status: "delivered",
      total: 1890,
      items: ["3x Empanada de Jamón y Queso"]
    }
  ];

  const mockFavorites = [
    { id: 1, name: "Empanada de Carne", price: 450, icon: "🥟" },
    { id: 2, name: "Empanada de Pollo", price: 420, icon: "🥟" },
  ];

  const tabs = [
    { id: "profile", label: "Mi Perfil", icon: User },
    { id: "orders", label: "Mis Pedidos", icon: Clock },
    { id: "favorites", label: "Favoritos", icon: Heart },
    { id: "addresses", label: "Direcciones", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Mi Cuenta</h1>
              <p className="text-gray-600">Hola, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-empanada-golden text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Información Personal
                      <Button
                        variant="outline"
                        onClick={() => editMode ? handleSave() : setEditMode(true)}
                      >
                        {editMode ? "Guardar" : "Editar"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nombre</label>
                        {editMode ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{user?.name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        {editMode ? (
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user?.email}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Teléfono</label>
                        {editMode ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{user?.phone || "No agregado"}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo de cuenta</label>
                        <Badge variant="empanada">{user?.role === "admin" ? "Administrador" : "Cliente"}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Pedido #{order.id}</h4>
                              <p className="text-sm text-gray-600">
                                {formatDateTime(order.date)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{formatPrice(order.total)}</div>
                              <Badge variant="success" className="text-xs">
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.items.join(", ")}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                            <Button variant="outline" size="sm">
                              Repetir Pedido
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Favoritos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockFavorites.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex items-center gap-4">
                          <div className="w-16 h-16 bg-empanada-golden/10 rounded flex items-center justify-center">
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-empanada-golden font-bold">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <Button variant="empanada" size="sm">
                            Agregar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Mis Direcciones
                      <Button variant="empanada">
                        Agregar Dirección
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-gray-600 mb-4">
                        Agrega una dirección para hacer tus pedidos más rápido
                      </p>
                      <Button variant="empanada">
                        Agregar Primera Dirección
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
