<!-- a52ea02c-3d87-4d78-9eff-804c2de4b079 8103b2e0-c6f9-4c3a-9ad9-77ea3622248f -->
# Plan: Arreglar Posicionamiento de Barra de Búsqueda en Móvil

## Análisis del Problema

Basándome en las imágenes proporcionadas:

**Imagen 1 (Estado Inicial Correcto)**:
- La barra de búsqueda aparece justo debajo de la información del restaurante
- Posición natural y coherente con el layout

**Imagen 2 (Estado con Scroll - Problema)**:
- La barra de búsqueda se mueve hacia arriba cuando se hace scroll
- Esto ocurre porque tiene `sticky top-64px`

**Problema Identificado**:
El código actual en `src/components/menu/MenuMobile.jsx` línea 157:
```jsx
<div className="bg-empanada-dark border-b border-empanada-light-gray sticky z-30" style={{top: '64px'}}>
```

El elemento tiene `position: sticky` lo que hace que se "pegue" a la parte superior al hacer scroll. El usuario quiere que permanezca en su posición inicial y NO se mueva.

## Solución

### Opción 1: Eliminar Sticky Completamente (Recomendada)

Cambiar de `sticky` a posición normal (sin sticky), para que la barra permanezca en su posición natural y se desplace con el contenido.

**Cambio en línea 157 de `MenuMobile.jsx`**:
```jsx
// De:
<div className="bg-empanada-dark border-b border-empanada-light-gray sticky z-30" style={{top: '64px'}}>

// A:
<div className="bg-empanada-dark border-b border-empanada-light-gray z-30">
```

**Ventajas**:
- Simple y directo
- La barra permanece exactamente donde está en la imagen 1
- Se desplaza con el contenido naturalmente
- No hay efectos secundarios

**Desventajas**:
- La barra de búsqueda no estará siempre visible al hacer scroll
- El usuario tendrá que scrollear hacia arriba para buscar

### Opción 2: Usar Position Fixed con Toggle (Más Compleja)

Si se requiere que la barra esté siempre accesible pero comience en su posición natural:
- Detectar el scroll
- Cambiar de `position: static` a `position: fixed` solo después de cierto umbral
- Agregar lógica con JavaScript

Esta opción es más compleja y requiere más cambios.

## Implementación Recomendada

**Archivo**: `src/components/menu/MenuMobile.jsx`

**Línea 157** - Eliminar sticky:
```jsx
{/* Buscador y filtros - Posición normal sin sticky */}
<div className="bg-empanada-dark border-b border-empanada-light-gray z-30">
```

Esto mantendrá la barra en su posición exacta como se ve en la imagen 1, y se desplazará naturalmente con el contenido cuando el usuario haga scroll.

## Archivos a Modificar

1. `src/components/menu/MenuMobile.jsx` - Línea 157: Eliminar `sticky` y el `style={{top: '64px'}}`