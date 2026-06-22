# Justificación de los requisitos

Esta guía resume cómo se cumple cada criterio de evaluación. Para instalar y ejecutar el proyecto, consultar el [README](../../README.md). Para entender su funcionamiento interno, consultar las [notas de desarrollo](./notas-desarrollo.md).

## Cómo se cumplen los requisitos

### 1. Requisitos mínimos de HTML y CSS

La página utiliza una estructura HTML semántica, etiquetas asociadas a los controles y atributos de accesibilidad. Los estilos están separados por responsabilidad y utilizan Flexbox, CSS Grid, variables CSS y estados de interacción con teclado y ratón.

### 2. Web completamente responsive

El encabezado simplifica su contenido en pantallas pequeñas y muestra la navegación completa a partir de 768 píxeles. La galería ajusta automáticamente el número de columnas al ancho disponible y conserva las distintas proporciones de las fotografías.

### 3. Código repartido en componentes

La interfaz está dividida en componentes pequeños para el encabezado, la galería, las tarjetas, la información del fotógrafo y los contadores. La comunicación se realiza mediante funciones y callbacks; el acceso a Unsplash y el estado de paginación permanecen en módulos independientes.

### 4. Datos de Unsplash y diseño propuesto

La carga inicial obtiene fotografías recientes y el buscador solicita resultados relacionados con el texto introducido. La fotografía, el texto alternativo, el autor, el avatar, la fecha, los contadores y los enlaces de cada tarjeta proceden de la respuesta de Unsplash.

El contador de cámara utiliza `user.total_photos` y el de corazón utiliza `likes`. Se evita usar `views` o `downloads` porque no vienen en las respuestas generales y exigirían una petición adicional por cada fotografía.

### 5. Limpieza del buscador

La búsqueda se ejecuta al pulsar Enter. Después de enviar el texto, el input queda vacío para permitir una nueva búsqueda sin borrar manualmente la anterior.

### 6. Regreso al estado inicial

El logo funciona como acceso al inicio. Al pulsarlo se limpia el buscador, se reinicia la paginación y se vuelve a solicitar la primera página de fotografías recientes. Las peticiones anteriores se cancelan para evitar mezclar resultados.

### 7. Entrega mediante repositorio público

El proyecto se entrega mediante un repositorio público de GitHub para que el código, la documentación y las instrucciones de ejecución sean accesibles durante la corrección.

## Referencias para la revisión

| Requisito | Dónde comprobarlo | Elementos principales |
| --- | --- | --- |
| HTML y CSS | `index.html`, `src/styles/`, `src/components/**/*.css` | Puntos de montaje, estilos base, tokens, grid, flex y estados de foco |
| Responsive | `src/components/header/header.css`, `src/components/gallery/gallery.css`, `src/components/gallery/DynamicGridLayout.js` | Media query, columnas automáticas y cálculo de altura |
| Componentes | `src/components/`, `src/app.js` | `createHeader`, `createGallery`, `createPinCard`, `createUserInfo` y coordinación general |
| Datos de Unsplash | `src/services/unsplashApi.js`, `src/components/pin-card/` | `/photos`, `/search/photos` y propiedades de cada fotografía y usuario |
| Limpieza del input | `src/components/header/Header.js` | Evento de Enter y `searchInput.value = ""` |
| Estado inicial | `src/components/header/Header.js`, `src/app.js`, `src/state/galleryState.js` | `onReset`, `handleReset`, `loadFirstPage` y `resetCurrentPage` |
| Repositorio público | Página principal del repositorio y `README.md` | Acceso al código e instrucciones de instalación |
