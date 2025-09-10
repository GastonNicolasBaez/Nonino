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
    { day: 'Lun', sales: 18500, orders: 67 },
    { day: 'Mar', sales: 22000, orders: 78 },
    { day: 'Mié', sales: 19800, orders: 71 },
    { day: 'Jue', sales: 25200, orders: 89 },
    { day: 'Vie', sales: 21700, orders: 76 },
    { day: 'Sáb', sales: 17800, orders: 62 },
    { day: 'Dom', sales: 20000, orders: 72 }
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            className="text-xs"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: 'var(--foreground)'
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
    { name: 'Empanada de Carne', sales: 890, color: '#f59e0b' },
    { name: 'Empanada de Pollo', sales: 756, color: '#10b981' },
    { name: 'Empanada de Dulce de Leche', sales: 634, color: '#8b5cf6' },
    { name: 'Empanada de Jamón y Queso', sales: 445, color: '#3b82f6' },
    { name: 'Empanada de Cordero', sales: 234, color: '#ef4444' }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          layout="horizontal" 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" className="opacity-30" />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={160}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            interval={0}
            axisLine={false}
            tickLine={false}
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
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: 'var(--foreground)'
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: 'var(--foreground)'
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
    { hour: '11:00', sales: 8500, orders: 30 },
    { hour: '12:00', sales: 15200, orders: 54 },
    { hour: '13:00', sales: 18700, orders: 67 },
    { hour: '14:00', sales: 12300, orders: 44 },
    { hour: '15:00', sales: 9800, orders: 35 },
    { hour: '18:00', sales: 11200, orders: 40 },
    { hour: '19:00', sales: 16800, orders: 60 },
    { hour: '20:00', sales: 14500, orders: 52 },
    { hour: '21:00', sales: 10300, orders: 37 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" className="opacity-30" />
          <XAxis 
            dataKey="hour" 
            className="text-xs"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: 'var(--foreground)'
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
    { name: 'Gourmet', value: 20, color: '#10b981' },
    { name: 'Dulces', value: 15, color: '#8b5cf6' },
    { name: 'Vegetarianas', value: 5, color: '#ef4444' }
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
    { name: 'Bronce', value: 25, color: '#cd7f32' },
    { name: 'Plata', value: 35, color: '#c0c0c0' },
    { name: 'Oro', value: 25, color: '#ffd700' },
    { name: 'Platino', value: 15, color: '#8b5cf6' }
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}