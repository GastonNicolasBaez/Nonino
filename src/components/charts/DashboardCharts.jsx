import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

/**
 * Componente de gráfico de ventas semanales
 */
export function SalesChart({ data }) {
  const chartData = data || [
    { day: 'Lun', sales: 12000, orders: 45 },
    { day: 'Mar', sales: 15000, orders: 52 },
    { day: 'Mié', sales: 18000, orders: 48 },
    { day: 'Jue', sales: 22000, orders: 61 },
    { day: 'Vie', sales: 28000, orders: 78 },
    { day: 'Sáb', sales: 32000, orders: 85 },
    { day: 'Dom', sales: 25000, orders: 67 }
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [
              name === 'sales' ? `$${value.toLocaleString()}` : value,
              name === 'sales' ? 'Ventas' : 'Pedidos'
            ]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico de productos más vendidos
 */
export function TopProductsChart({ data }) {
  const chartData = data || [
    { name: 'Empanada de Carne', sales: 450, color: '#f59e0b' },
    { name: 'Empanada de Pollo', sales: 380, color: '#10b981' },
    { name: 'Empanada de Jamón y Queso', sales: 320, color: '#3b82f6' },
    { name: 'Empanada de Verdura', sales: 280, color: '#8b5cf6' },
    { name: 'Empanada de Humita', sales: 250, color: '#ef4444' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={140}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: '#f9fafb'
            }}
            formatter={(value) => [value, 'Vendidas']}
            labelStyle={{ color: '#f9fafb' }}
          />
          <Bar 
            dataKey="sales" 
            radius={[0, 4, 4, 0]}
            fill="#f59e0b"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico circular de estados de pedidos
 */
export function OrdersStatusChart({ data }) {
  const chartData = data || [
    { name: 'Completados', value: 45, color: '#10b981' },
    { name: 'Preparando', value: 20, color: '#3b82f6' },
    { name: 'Pendientes', value: 15, color: '#f59e0b' },
    { name: 'Cancelados', value: 5, color: '#ef4444' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [value, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico de tendencias de clientes
 */
export function CustomerTrendsChart({ data }) {
  const chartData = data || [
    { month: 'Ene', newCustomers: 12, totalCustomers: 120 },
    { month: 'Feb', newCustomers: 18, totalCustomers: 138 },
    { month: 'Mar', newCustomers: 15, totalCustomers: 153 },
    { month: 'Abr', newCustomers: 22, totalCustomers: 175 },
    { month: 'May', newCustomers: 25, totalCustomers: 200 },
    { month: 'Jun', newCustomers: 30, totalCustomers: 230 }
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [
              value,
              name === 'newCustomers' ? 'Nuevos Clientes' : 'Total Clientes'
            ]}
          />
          <Line
            type="monotone"
            dataKey="newCustomers"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="totalCustomers"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico de ventas por horario
 */
export function HourlySalesChart({ data }) {
  const chartData = data || [
    { hour: '08:00', sales: 1200, orders: 8 },
    { hour: '10:00', sales: 1800, orders: 12 },
    { hour: '12:00', sales: 3200, orders: 20 },
    { hour: '14:00', sales: 2800, orders: 18 },
    { hour: '16:00', sales: 2200, orders: 15 },
    { hour: '18:00', sales: 4500, orders: 28 },
    { hour: '20:00', sales: 3800, orders: 24 },
    { hour: '22:00', sales: 1500, orders: 10 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="hour" 
            className="text-xs"
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [
              name === 'sales' ? `$${value.toLocaleString()}` : value,
              name === 'sales' ? 'Ventas' : 'Pedidos'
            ]}
          />
          <Bar 
            dataKey="sales" 
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico circular de ventas por categoría
 */
export function CategorySalesChart({ data }) {
  const chartData = data || [
    { name: 'Tradicionales', value: 60, color: '#f59e0b' },
    { name: 'Gourmet', value: 25, color: '#10b981' },
    { name: 'Dulces', value: 15, color: '#8b5cf6' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Componente de gráfico circular de distribución de clientes por nivel
 */
export function CustomerLevelChart({ data }) {
  const chartData = data || [
    { name: 'Bronce', value: 45, color: '#cd7f32' },
    { name: 'Plata', value: 30, color: '#c0c0c0' },
    { name: 'Oro', value: 20, color: '#ffd700' },
    { name: 'Platino', value: 5, color: '#8b5cf6' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}