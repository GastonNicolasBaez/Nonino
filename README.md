# 🥟 Nonino Empanadas - Sistema de Gestión Completo

Un sistema completo de gestión para una empanaderería con panel de administración avanzado y experiencia de usuario moderna.

## 🚀 Características Principales

### 👤 Portal Público
- **Homepage atractiva** con hero section animado
- **Catálogo de productos** con filtros y búsqueda
- **Sistema de carrito** con sidebar animado
- **Proceso de checkout** completo
- **Seguimiento de pedidos** en tiempo real
- **Autenticación de usuarios** (login/registro)
- **Páginas informativas** (Nosotros, Contacto, Locales)

### 🔧 Panel de Administración
- **Dashboard principal** con métricas en tiempo real
- **Gestión de pedidos** completa con estados visuales
- **Administración de productos** con CRUD completo
- **Control de inventario** y materias primas
- **Base de datos de clientes** con segmentación
- **Reportes y análisis** detallados
- **Configuración del sistema** avanzada

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19.1.1, Vite 7.1.2
- **Routing**: React Router DOM 7.8.2
- **Styling**: Tailwind CSS 3.4.0
- **Animaciones**: Framer Motion 12.23.12
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand, React Query
- **Notifications**: Sonner
- **Package Manager**: pnpm

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/GastonNicolasBaez/Nonino.git
cd Nonino
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Ejecutar en desarrollo**
```bash
pnpm run dev
```

4. **Construir para producción**
```bash
pnpm run build
```

## 🎯 Credenciales de Acceso

### Panel de Administración
- **URL**: `/admin` o `/admin/login`
- **Email**: `admin@nonino.com`
- **Contraseña**: `admin123`

### Usuario Cliente (Demo)
- Cualquier email y contraseña válidos para testing

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── common/            # Componentes reutilizables
│   ├── layouts/           # Layouts de página
│   └── ui/               # Componentes UI base
├── context/
│   ├── AuthContext.jsx   # Contexto de autenticación
│   ├── CartContext.jsx   # Contexto del carrito
│   └── ThemeContext.jsx  # Contexto de tema
├── pages/
│   ├── admin/            # Páginas del panel admin
│   └── public/           # Páginas públicas
├── services/
│   ├── api.js           # Servicios API
│   └── mockData.js      # Datos de demostración
├── styles/              # Estilos globales
└── utils/              # Utilidades y helpers
```

## 🎨 Características de Diseño

- **Diseño Moderno**: Glassmorphism y animaciones suaves
- **Responsive**: Optimizado para todos los dispositivos
- **Tema Oscuro/Claro**: Cambio dinámico de tema
- **Micro-interacciones**: Feedback visual inmediato
- **Tipografía**: Inter + Poppins para mejor legibilidad
- **Color Palette**: Dorado empanada como color principal

## 🔮 Funcionalidades Avanzadas

### Sistema de Carrito
- Persistencia en localStorage
- Cálculo automático de precios
- Códigos promocionales
- Gestión de delivery

### Panel de Administración
- Estados de pedidos en tiempo real
- Métricas y analytics
- Gestión completa de inventario
- Segmentación de clientes por niveles
- Exportación de reportes

### Experiencia de Usuario
- Carga optimizada con lazy loading
- Animaciones suaves con Framer Motion
- Feedback inmediato con toasts
- Navegación intuitiva

## 🚀 Próximas Características

- [ ] Integración con backend real (Kotlin/Spring Boot)
- [ ] Sistema de pagos con Stripe/MercadoPago
- [ ] Notificaciones push en tiempo real
- [ ] App móvil con React Native
- [ ] Sistema de delivery tracking GPS
- [ ] Integración con redes sociales

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Gastón Nicolás Baez**
- GitHub: [@GastonNicolasBaez](https://github.com/GastonNicolasBaez)

---

### 🥟 "Las mejores empanadas de la ciudad, ahora con la mejor tecnología"