import React from 'react';

/**
 * Gráficos simples con CSS y HTML que funcionan perfectamente
 */

export function SimpleTopProductsChart({ data }) {
  const chartData = data || [
    { name: 'Empanada de Carne', sales: 890, color: '#f59e0b' },
    { name: 'Empanada de Pollo', sales: 756, color: '#10b981' },
    { name: 'Empanada de Dulce de Leche', sales: 634, color: '#8b5cf6' },
    { name: 'Empanada de Jamón y Queso', sales: 445, color: '#3b82f6' },
    { name: 'Empanada de Cordero', sales: 234, color: '#ef4444' }
  ];

  const maxSales = Math.max(...chartData.map(item => item.sales));

  return (
    <div className="w-full h-64 flex flex-col gap-3 py-4">
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-36 text-right">
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
          </div>
          <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
              style={{ 
                backgroundColor: item.color,
                width: `${(item.sales / maxSales) * 100}%`,
                minWidth: '60px'
              }}
            >
              <span className="text-xs font-bold text-white">
                {item.sales}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SimpleCategorySalesChart({ data }) {
  const [hoveredSection, setHoveredSection] = React.useState(null);
  
  const chartData = data || [
    { name: 'Tradicionales', value: 60, color: '#f59e0b' },
    { name: 'Gourmet', value: 20, color: '#10b981' },
    { name: 'Dulces', value: 15, color: '#8b5cf6' },
    { name: 'Vegetarianas', value: 5, color: '#ef4444' }
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  // Función para crear el path de cada sección
  const createSectionPath = (startAngle, endAngle) => {
    const centerX = 96; // 50% de 192px (w-48)
    const centerY = 96;
    const outerRadius = 96;
    const innerRadius = 24; // inset-6 = 24px

    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} z`;
  };

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      {/* Gráfico circular simple */}
      <div className="relative w-48 h-48">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                ${chartData.map(item => {
                  const percentage = (item.value / total) * 100;
                  const startPercent = cumulativePercentage;
                  cumulativePercentage += percentage;
                  return `${item.color} ${startPercent}% ${cumulativePercentage}%`;
                }).join(', ')}
              )`
            }}
          />
          <div className="absolute inset-6 bg-background rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">100%</span>
          </div>
        </div>
        
        {/* SVG invisible para zonas de hover */}
        <svg className="absolute inset-0 w-full h-full">
          {(() => {
            let cumulative = 0;
            return chartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulative * 3.6;
              const endAngle = (cumulative + percentage) * 3.6;
              cumulative += percentage;
              
              return (
                <path
                  key={index}
                  d={createSectionPath(startAngle, endAngle)}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                />
              );
            });
          })()}
        </svg>
        
        {/* Etiquetas individuales que aparecen en hover */}
        {(() => {
          let cumulative = 0;
          return chartData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (cumulative + percentage / 2) * 3.6 - 90; // Convertir a grados
            cumulative += percentage;
            
            const radius = 80; // Radio para posicionar las etiquetas
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <div
                key={index}
                className={`absolute text-xs font-bold text-white bg-black bg-opacity-80 px-2 py-1 rounded shadow-lg transition-opacity duration-300 ${
                  hoveredSection === index ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
              >
                {item.name}: {item.value}%
              </div>
            );
          });
        })()}
      </div>
      
      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-foreground">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimpleHourlySalesChart({ data }) {
  const chartData = data || [
    { hour: '11:00', sales: 8500 },
    { hour: '12:00', sales: 15200 },
    { hour: '13:00', sales: 18700 },
    { hour: '14:00', sales: 12300 },
    { hour: '15:00', sales: 9800 },
    { hour: '18:00', sales: 11200 },
    { hour: '19:00', sales: 16800 },
    { hour: '20:00', sales: 14500 },
    { hour: '21:00', sales: 10300 }
  ];

  const maxSales = Math.max(...chartData.map(item => item.sales));

  return (
    <div className="w-full h-64 px-4 py-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 max-w-16">
            <div className="w-full flex items-end" style={{ height: '180px' }}>
              <div 
                className="w-full bg-empanada-golden rounded-t-lg transition-all duration-1000 relative group cursor-pointer"
                style={{ height: `${(item.sales / maxSales) * 100}%`, minHeight: '8px' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ${item.sales.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-foreground font-medium">
              {item.hour}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimpleCustomerLevelChart({ data }) {
  const [hoveredSection, setHoveredSection] = React.useState(null);
  
  const chartData = data || [
    { name: 'Bronce', value: 25, color: '#cd7f32' },
    { name: 'Plata', value: 35, color: '#c0c0c0' },
    { name: 'Oro', value: 25, color: '#ffd700' },
    { name: 'Platino', value: 15, color: '#8b5cf6' }
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  // Función para crear el path de cada sección
  const createSectionPath = (startAngle, endAngle) => {
    const centerX = 96; // 50% de 192px (w-48)
    const centerY = 96;
    const outerRadius = 96;
    const innerRadius = 24; // inset-6 = 24px

    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} z`;
  };

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      {/* Gráfico circular simple */}
      <div className="relative w-48 h-48">
        <div className="w-full h-full rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                ${chartData.map(item => {
                  const percentage = (item.value / total) * 100;
                  const startPercent = cumulativePercentage;
                  cumulativePercentage += percentage;
                  return `${item.color} ${startPercent}% ${cumulativePercentage}%`;
                }).join(', ')}
              )`
            }}
          />
          <div className="absolute inset-6 bg-background rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">Niveles</span>
          </div>
        </div>
        
        {/* SVG invisible para zonas de hover */}
        <svg className="absolute inset-0 w-full h-full">
          {(() => {
            let cumulative = 0;
            return chartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulative * 3.6;
              const endAngle = (cumulative + percentage) * 3.6;
              cumulative += percentage;
              
              return (
                <path
                  key={index}
                  d={createSectionPath(startAngle, endAngle)}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSection(index)}
                  onMouseLeave={() => setHoveredSection(null)}
                />
              );
            });
          })()}
        </svg>
        
        {/* Etiquetas individuales que aparecen en hover */}
        {(() => {
          let cumulative = 0;
          return chartData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (cumulative + percentage / 2) * 3.6 - 90; // Convertir a grados
            cumulative += percentage;
            
            const radius = 80; // Radio para posicionar las etiquetas
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            
            return (
              <div
                key={index}
                className={`absolute text-xs font-bold text-white bg-black bg-opacity-80 px-2 py-1 rounded shadow-lg transition-opacity duration-300 ${
                  hoveredSection === index ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
              >
                {item.name}: {item.value}%
              </div>
            );
          });
        })()}
      </div>
      
      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-foreground">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}