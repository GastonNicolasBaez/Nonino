# 🥟 Nonino Empanadas - Sistema de Gestión Completo

Un sistema completo de gestión para una empanaderería con panel de administración avanzado y experiencia de usuario moderna.

## 🚀 Características Principales

### 👤 Portal Público
- **Homepage atractiva** con hero section animado
- **Catálogo de productos** con filtros y búsqueda avanzada
- **Sistema de carrito** con sidebar animado y persistencia
- **Proceso de checkout** completo con validaciones robustas
- **Seguimiento de pedidos** en tiempo real
- **Autenticación de usuarios** (login/registro) con validaciones
- **Páginas informativas** (Nosotros, Contacto, Locales)
- **Completamente responsive** para todos los dispositivos

### 🔧 Panel de Administración
- **Dashboard principal** con métricas en tiempo real
- **Gestión de pedidos** completa con estados visuales
- **Administración de productos** con CRUD completo
- **Control de inventario** y materias primas
- **Base de datos de clientes** con segmentación
- **Reportes y análisis** detallados
- **Configuración del sistema** avanzada
- **Login seguro** con validaciones y límites de intentos

### 🔒 Seguridad y Mejores Prácticas
- **Validaciones robustas** en todos los formularios
- **Manejo de errores** consistente y centralizado
- **Credenciales seguras** mediante variables de entorno
- **Límites de intentos** de login para prevenir ataques
- **Documentación completa** con JSDoc
- **Código limpio** y mantenible
- **Configuración centralizada** de constantes

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

## ⚙️ Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api

# Development Mode
VITE_ENABLE_DEV_MODE=true
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGS=true

# Admin Credentials (Development Only)
VITE_DEFAULT_ADMIN_EMAIL=admin@noninoempanadas.com
VITE_DEFAULT_ADMIN_PASSWORD=admin123

# Security Configuration
VITE_MAX_LOGIN_ATTEMPTS=3
VITE_SESSION_TIMEOUT_MINUTES=60

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DARK_MODE=true
```

## 🎯 Credenciales de Acceso

### Panel de Administración
- **URL**: `/admin` o `/admin/login`
- **Email**: `admin@noninoempanadas.com` (desarrollo)
- **Contraseña**: `admin123` (desarrollo)
- **Nota**: En producción, las credenciales se configuran en el backend

### Usuario Cliente
- Registro e inicio de sesión a través del backend
- Validaciones robustas implementadas en el frontend

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/              # Componentes de autenticación
│   ├── common/            # Componentes reutilizables
│   ├── layouts/           # Layouts de página
│   └── ui/               # Componentes UI base
├── config/
│   └── constants.js      # Constantes y configuración centralizada
├── context/
│   ├── AuthContext.jsx   # Contexto de autenticación
│   ├── CartContext.jsx   # Contexto del carrito
│   └── ThemeContext.jsx  # Contexto de tema
├── lib/
│   └── utils.js          # Utilidades con validaciones robustas
├── pages/
│   ├── admin/            # Páginas del panel admin
│   └── public/           # Páginas públicas
├── services/
│   └── api.js           # Servicios API para backend
├── styles/              # Estilos globales
└── utils/              # Utilidades adicionales
```

## 🔧 Mejoras de Código Recientes

### ✅ Correcciones de Seguridad
- **Credenciales hardcodeadas eliminadas** - Uso de variables de entorno
- **Validaciones robustas** en todos los formularios
- **Límites de intentos** de login implementados
- **Manejo seguro de localStorage** con fallbacks

### ✅ Mejoras de Documentación
- **JSDoc completo** en todos los componentes principales
- **Documentación de funciones** con ejemplos de uso
- **README actualizado** con todas las características
- **Comentarios explicativos** en código complejo

### ✅ Optimizaciones de Código
- **Validaciones centralizadas** mediante constantes
- **Manejo de errores consistente** en toda la aplicación
- **Funciones reutilizables** para operaciones comunes
- **Código limpio** sin líneas innecesarias
- **Imports organizados** y optimizados

### ✅ Mejoras de UX/UI
- **Formularios mejorados** con feedback visual
- **Estados de carga** apropiados en todos los componentes
- **Mensajes de error** específicos y útiles
- **Accesibilidad mejorada** con etiquetas ARIA
- **Navegación optimizada** entre páginas

### ✅ Arquitectura Mejorada
- **Configuración centralizada** en `src/config/constants.js`
- **Validaciones robustas** en `src/lib/utils.js`
- **Separación de responsabilidades** clara
- **Código mantenible** y escalable

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
