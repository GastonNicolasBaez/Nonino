import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Printer, 
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Package,
  Truck,
  User,
  DollarSign,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { formatPrice, formatDateTime } from "../../lib/utils";
import { toast } from "sonner";

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const mockOrders = [
    {
      id: "EMP-2024-001",
      customer: "Juan Pérez",
      items: ["2x Empanada de Carne", "1x Empanada de Pollo"],
      total: 2450,
      status: "preparing",
      createdAt: "2024-01-15T14:30:00Z",
      deliveryAddress: "Av. Corrientes 1234"
    },
    {
      id: "EMP-2024-002", 
      customer: "María García",
      items: ["3x Empanada de Jamón y Queso"],
      total: 1890,
      status: "ready",
      createdAt: "2024-01-15T13:45:00Z",
      deliveryAddress: "Calle Florida 567"
    }
  ];

  const statusOptions = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendientes" },
    { value: "confirmed", label: "Confirmados" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Listos" },
    { value: "delivered", label: "Entregados" }
  ];

  const getStatusVariant = (status) => {
    const variants = {
      pending: "outline",
      confirmed: "secondary", 
      preparing: "warning",
      ready: "success",
      delivered: "empanada"
    };
    return variants[status] || "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra todos los pedidos de empanadas
          </p>
        </div>
        <Button variant="empanada">
          Nuevo Pedido Manual
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, cliente o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-empanada-golden"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Más Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">#{order.id}</h3>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p><strong>Cliente:</strong> {order.customer}</p>
                      <p><strong>Fecha:</strong> {formatDateTime(order.createdAt)}</p>
                      <p><strong>Productos:</strong> {order.items.join(", ")}</p>
                      <p><strong>Dirección:</strong> {order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:items-end gap-2">
                    <span className="text-2xl font-bold text-empanada-golden">
                      {formatPrice(order.total)}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
