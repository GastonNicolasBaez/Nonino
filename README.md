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
- **Email**: Configurado en el backend
- **Contraseña**: Configurada en el backend

### Usuario Cliente
- Registro e inicio de sesión a través del backend

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
│   └── api.js           # Servicios API para backend
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

## 🚀 Características Implementadas

- [x] Integración con backend (Kotlin/Spring Boot)
- [x] Sistema de pagos preparado para MercadoPago
- [x] API REST completa
- [x] Autenticación JWT

## 👨‍💻 Desarrollado por

**Gastón Nicolás Baez**
- GitHub: [@GastonNicolasBaez](https://github.com/GastonNicolasBaez)

---

### 🥟 "Las mejores empanadas de la ciudad, ahora con la mejor tecnología"
