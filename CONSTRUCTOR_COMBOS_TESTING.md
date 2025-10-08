# 🧪 Guía de Testing - Constructor de Combos Interactivo

## 📋 Resumen

Se ha implementado un **Constructor de Combos Interactivo** completo con datos MOCK para que puedas probarlo inmediatamente sin necesidad de tener el backend funcionando.

## 🎯 Datos Mock Disponibles

**Total: 37 productos + 4 combos configurados** ✨

### Combos Configurados:

1. **Docena Clásica** - $14,400
   - 12 empanadas a elección
   
2. **Mega Combo Familiar** - $18,900
   - 12 empanadas
   - 2 bebidas de 1.5L
   - 2 postres

3. **Media Docena Premium** - $8,900
   - 6 empanadas especiales
   - 1 bebida

4. **Party Box XXL** - $32,500
   - 24 empanadas (12 tradicionales + 12 especiales)
   - 4 bebidas
   - 4 postres

### Productos Mock:

#### Empanadas Tradicionales (Categoría 1) - 8 opciones:
- Carne
- Pollo
- Jamón y Queso
- Verdura
- Humita
- Caprese
- Cebolla y Queso
- Choclo

#### Empanadas Especiales (Categoría 2) - 10 opciones:
- Roquefort y Nuez
- Cordero Patagónico
- Salmón y Eneldo
- Bondiola Braseada
- Matambre a la Pizza
- Cuatro Quesos
- Langostinos al Ajillo
- Rúcula y Jamón Crudo
- Pulled Pork BBQ
- Espinaca y Ricota

#### Bebidas (Categoría 3) - 10 opciones:
- Coca Cola 1.5L
- Sprite 1.5L
- Fanta 1.5L
- Agua Mineral 1.5L
- Agua con Gas 1.5L
- Cerveza Quilmes 1L
- Pepsi 1.5L
- 7Up 1.5L
- Jugo de Naranja 1L
- Vino Tinto 750ml

#### Postres (Categoría 4) - 9 opciones:
- Flan Casero
- Tiramisú
- Brownie con Helado
- Panqueques con Dulce de Leche
- Helado Artesanal
- Chocotorta
- Lemon Pie
- Cheesecake de Frutos Rojos
- Postre Balcarce

## 🚀 Cómo Probar

### Paso 1: Acceder al Constructor

#### Opción A - Desde el Menú:
1. Navega a `/menu`
2. Busca el botón dorado prominente "✨ Armá tu Combo Personalizado ✨" en el sidebar izquierdo
3. Click en el botón

#### Opción B - Acceso Directo:
1. Navega directamente a `/menu/combo-builder`

### Paso 2: Seleccionar un Combo

1. Verás un grid con 4 combos disponibles
2. Cada combo muestra:
   - Nombre y descripción
   - Precio con badge de descuento
   - Lista de componentes incluidos
3. Click en "Seleccionar este Combo"

### Paso 3: Seleccionar Empanadas

1. Verás un grid con todas las empanadas disponibles
2. Usa los botones **+** y **-** para elegir cantidades
3. Observa el panel derecho (sticky) que muestra:
   - Progreso: "5/12 empanadas seleccionadas"
   - Barra de progreso visual
   - Lista de productos seleccionados
4. El botón "Continuar" se habilitará cuando completes la cantidad requerida

### Paso 4: Seleccionar Bebidas (si aplica)

1. Si el combo incluye bebidas, verás el selector de bebidas
2. Mismo proceso con steppers +/-
3. Panel derecho actualiza en tiempo real

### Paso 5: Seleccionar Postres (si aplica)

1. Si el combo incluye postres, verás el selector de postres
2. Mismo proceso con steppers +/-

### Paso 6: Agregar al Carrito

1. Cuando completes todos los pasos, el botón "Agregar al Carrito" se habilitará
2. Click en el botón
3. Serás redirigido automáticamente a `/cart`

### Paso 7: Ver en el Carrito

1. En el carrito verás tu combo con:
   - Badge "✨ Combo Personalizado"
   - Borde dorado especial
   - Lista completa de productos incluidos
   - Precio total
   - Icono de paquete en lugar de imagen

## 🎨 Características Visuales a Notar

### Animaciones:
- ✅ Entrada suave de los combos con delay escalonado
- ✅ Transiciones entre pasos
- ✅ Animación de contador al cambiar cantidades
- ✅ Efectos hover en cards

### Diseño:
- ✅ Tema oscuro con acentos dorados
- ✅ Panel derecho sticky que sigue el scroll
- ✅ Barra de progreso que cambia de color (dorado → verde al completar → rojo si te pasas)
- ✅ Badges informativos
- ✅ Iconos contextuales

### Validaciones:
- ✅ Botón "Continuar" deshabilitado hasta completar cada paso
- ✅ Alerta visual si superas la cantidad del combo
- ✅ Mensaje de error si intentas agregar combo incompleto
- ✅ Verificación de sucursal seleccionada

## 📱 Responsive

### Desktop (≥1024px):
- Layout de dos columnas (65% / 35%)
- Panel sticky derecho
- Experiencia completa

### Mobile (<1024px):
- Mensaje informativo: "Esta funcionalidad está optimizada para pantallas grandes"
- Botón para volver al menú

## 🐛 Testing Checklist

- [ ] Ver grid de combos con 4 opciones
- [ ] Seleccionar combo "Docena Clásica"
- [ ] Usar steppers para elegir 12 empanadas
- [ ] Ver progreso en panel derecho en tiempo real
- [ ] Intentar continuar sin completar (debe estar deshabilitado)
- [ ] Completar las 12 empanadas
- [ ] Click en "Agregar al Carrito"
- [ ] Verificar en carrito que aparece como combo
- [ ] Ver detalle expandido de productos
- [ ] Probar combo "Mega Combo Familiar" (con bebidas y postres)
- [ ] Verificar flujo completo: empanadas → bebidas → postres
- [ ] Intentar superar la cantidad (debe mostrar advertencia)
- [ ] Eliminar combo del carrito
- [ ] Probar en mobile (debe mostrar mensaje)

## 🔧 Configuración de Mocks

### Archivo: `src/lib/mockCombos.js`

Los datos mock están configurados en este archivo. Puedes:
- Agregar más combos
- Agregar más productos
- Modificar precios
- Cambiar cantidades requeridas

### Activación Automática:

El sistema usa mocks automáticamente cuando:
1. No hay datos del backend
2. Hay error al conectar con el backend
3. El backend devuelve array vacío

Verás en consola:
```
⚠️ No hay combos del backend, usando datos MOCK
⚠️ No hay productos del backend, usando datos MOCK
```

## 📊 Estructura de Datos Mock

### Combo:
```javascript
{
  id: 1,
  code: "COMBO-DOCENA",
  name: "Docena Clásica",
  description: "...",
  price: 14400,
  active: true,
  categoryId: 100,
  components: [
    {
      productId: 1,
      productName: "Empanadas",
      quantity: 12,
      price: 1200,
      categoryId: 1
    }
  ]
}
```

### Producto:
```javascript
{
  id: 1,
  name: "Carne",
  description: "...",
  category: 1,
  price: 1200,
  image: "https://..."
}
```

## 🎉 ¡Listo para Probar!

Ahora puedes probar el constructor completo sin necesidad de backend. Los datos mock se cargan automáticamente y funcionan exactamente igual que los datos reales.

Para volver a usar datos del backend, simplemente asegúrate de que tu API esté funcionando y el sistema detectará automáticamente los datos reales.

---

**Nota:** Las imágenes en los mocks usan placeholders de Unsplash. Puedes reemplazarlas con tus propias imágenes o con imágenes base64.

