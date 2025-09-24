# FUNCIONALIDADES PENDIENTES

## 1. GESTIÓN DE RECETAS
**Estado:** Por desarrollar más tarde
**Requerimientos:**
- Editar recetas de cada producto
- Sistema de búsqueda
- Integración con productos existentes

## 2. MODAL DE NUEVO PRODUCTO (SISTEMA DE PASOS)
**Estado:** Por desarrollar
**Ubicación:** ProductManagement.jsx
**Referencia de estilo:** Modal de agregar local en sucursal

### Estructura del Modal por Pasos:

#### PASO 1: INFORMACIÓN BÁSICA DEL PRODUCTO
- Nombre del producto
- Descripción
- Categoría
- Precio base
- SKU/Código

#### PASO 2: RECETA DEL PRODUCTO
- **Buscador de ingredientes** (desde inventario)
- **Lista/tabla de ingredientes** disponibles
- **Funcionalidad:**
  - Seleccionar ingrediente
  - Especificar cantidad a usar
  - Botón para agregar ingrediente a la receta
  - Ver lista de ingredientes agregados
  - Poder quitar ingredientes de la receta

#### PASO 3: CONFIGURACIÓN FINAL
- **Carga de imagen** del producto
- **Stock mínimo**
- **Checkbox:** "Disponible para venta"

### Consideraciones Técnicas:
- Usar el mismo estilo de modal que tiene sucursal
- Integrar con inventario existente para obtener ingredientes
- Mantener consistencia con el diseño actual
- Validaciones en cada paso antes de continuar
- Posibilidad de volver al paso anterior

### Flujo de Usuario:
1. Click en "Agregar Producto"
2. Modal se abre en Paso 1
3. Usuario completa info básica → "Siguiente"
4. Paso 2: Usuario busca y agrega ingredientes → "Siguiente"
5. Paso 3: Usuario sube imagen y configura disponibilidad → "Finalizar"
6. Producto se crea con toda la información completa