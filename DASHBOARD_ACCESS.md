# 🚀 Acceso al Dashboard de Administrador - Nonino Empanadas

## 🔑 Credenciales de Acceso

Para acceder al panel de administración, utiliza las siguientes credenciales:

- **Email:** `admin@noninoempanadas.com`
- **Contraseña:** `admin123`

## 📍 Ruta de Acceso

1. Ve a la página de login de administrador: `/admin/login`
2. Ingresa las credenciales mencionadas arriba
3. Serás redirigido automáticamente al dashboard principal: `/admin`

## ⚠️ Nota Importante

Estas credenciales son **SOLO PARA DESARROLLO LOCAL**. En producción, deberás:

1. Configurar un backend real con autenticación segura
2. Cambiar las credenciales por defecto
3. Implementar un sistema de gestión de usuarios administradores

## 🛠️ Funcionalidades Disponibles

El dashboard incluye:

- **Dashboard Principal:** Métricas de ventas, pedidos y clientes
- **Gestión de Productos:** CRUD completo de productos
- **Gestión de Pedidos:** Seguimiento y actualización de estados
- **Gestión de Clientes:** Información y historial de clientes
- **Reportes:** Análisis de ventas y rendimiento
- **Configuraciones:** Ajustes del sistema

## 🔧 Configuración del Backend

Para usar el sistema completo con backend:

1. Configura la variable de entorno `VITE_API_URL` en tu archivo `.env`
2. Ejecuta el backend en el puerto especificado
3. Las credenciales se validarán contra el backend real

## 🎯 Datos de Demostración

Cuando el backend no esté disponible, el sistema mostrará:
- Datos mock realistas para empanadas
- Métricas simuladas de ventas
- Productos de ejemplo
- Pedidos de demostración

## 🚨 Seguridad

- **NUNCA** uses estas credenciales en producción
- Cambia la contraseña por defecto en el código antes de desplegar
- Implementa autenticación de dos factores para administradores
- Usa HTTPS en producción

## 📞 Soporte

Si tienes problemas para acceder:
1. Verifica que el servidor de desarrollo esté corriendo
2. Revisa la consola del navegador para errores
3. Asegúrate de estar usando las credenciales correctas
4. Limpia el localStorage si hay problemas de sesión

---

**¡Disfruta explorando el dashboard de Nonino Empanadas! 🥟**
