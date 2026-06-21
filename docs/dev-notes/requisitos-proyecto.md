# Justificación de los requisitos del proyecto

Este documento indica de forma sencilla cómo se cumple cada requisito y dónde puede comprobarse dentro del proyecto.

## 1. El proyecto cumple los requisitos mínimos del Proyecto 1 en cuanto a HTML y CSS

La página utiliza HTML semántico para organizar el encabezado, la navegación, el buscador y la galería. También incluye etiquetas y atributos de accesibilidad, como textos alternativos para las imágenes, `aria-label` y una etiqueta asociada al buscador.

Los estilos están organizados en varios archivos CSS según su función. Se utiliza Flexbox para el encabezado y CSS Grid para distribuir las tarjetas de imágenes. También se han definido variables CSS reutilizables para colores, tamaños, espaciados y tipografías.

Dónde comprobarlo:

- `index.html`: estructura principal y carga de la aplicación.
- `src/styles/base.css`: estilos generales y reinicio básico.
- `src/styles/tokens.css`: variables reutilizables de diseño.
- `src/components/header/header.css`: estilos del encabezado y buscador.
- `src/components/gallery/gallery.css`: distribución de la galería.
- `src/components/pin-card/pin-card.css`: diseño de las tarjetas.

## 2. Web completamente responsive

La interfaz se adapta a distintos tamaños de pantalla. En móvil se simplifica la navegación para dejar espacio al logo, al buscador y al perfil. A partir de 768 píxeles se muestran también las opciones de navegación y los iconos adicionales del encabezado.

La galería utiliza columnas automáticas con un ancho flexible. De esta forma, el número de imágenes por fila cambia según el espacio disponible y las tarjetas conservan las distintas proporciones de las fotografías.

Dónde comprobarlo:

- `src/components/header/header.css`: estilos para móvil y media query de escritorio.
- `src/components/gallery/gallery.css`: grid con columnas automáticas.
- `src/components/gallery/DynamicGridLayout.js`: cálculo de la altura de cada tarjeta para crear el efecto tipo Pinterest.

## 3. El código está correctamente repartido en componentes

El código se ha dividido en componentes y módulos pequeños para separar responsabilidades y facilitar su reutilización.

- `src/components/header/Header.js`: construye el encabezado, el buscador y la navegación.
- `src/components/gallery/Gallery.js`: crea la galería y muestra las imágenes o el estado de carga.
- `src/components/gallery/DynamicGridLayout.js`: controla la distribución dinámica de las tarjetas.
- `src/components/pin-card/PinCard.js`: construye cada tarjeta completa.
- `src/components/pin-card/PinOverlay.js`: añade los contadores y el enlace para visitar la fotografía.
- `src/components/pin-card/UserInfo.js`: muestra los datos y la imagen del fotógrafo.
- `src/components/pin-card/Counter.js`: crea un contador reutilizable.
- `src/services/unsplashApi.js`: concentra las peticiones a Unsplash.
- `src/state/galleryState.js`: gestiona la página actual de los resultados.

`src/app.js` coordina estos componentes y contiene el flujo principal de la aplicación.

## 4. Se recogen correctamente los datos necesarios para conseguir un diseño como el aportado

La aplicación realiza una primera petición a Unsplash para mostrar fotografías recientes. Cuando el usuario escribe una búsqueda, utiliza el endpoint de búsqueda y muestra los resultados relacionados con ese texto.

Los datos visibles de cada tarjeta se obtienen de la respuesta de Unsplash:

- `image.urls.small`: fotografía principal.
- `image.alt_description`: texto alternativo de la fotografía.
- `image.user.name`: nombre del fotógrafo.
- `image.user.profile_image.medium`: imagen de perfil del fotógrafo.
- `image.created_at`: fecha de creación.
- `image.user.total_photos`: número total de fotografías del usuario.
- `image.likes`: número de “me gusta” de la fotografía.
- `image.links.html`: enlace a la fotografía en Unsplash.
- `image.user.links.html`: enlace al perfil del fotógrafo.

Se utiliza `total_photos` en lugar de `downloads` o `views` porque estos dos últimos datos no vienen incluidos en las respuestas generales y requerirían una petición adicional por cada fotografía.

Dónde comprobarlo:

- `src/services/unsplashApi.js`: creación de las peticiones a `/photos` y `/search/photos`.
- `src/components/pin-card/PinCard.js`: imagen principal.
- `src/components/pin-card/UserInfo.js`: fotógrafo, perfil y fecha.
- `src/components/pin-card/PinOverlay.js`: total de fotografías, likes y enlace a Unsplash.

## 5. El input se limpia después de cada búsqueda

La búsqueda se ejecuta al pulsar la tecla Enter. Después de enviar el texto, el valor del input se deja vacío para que el usuario pueda realizar otra búsqueda sin tener que borrar la anterior manualmente.

Dónde comprobarlo:

- `src/components/header/Header.js`: evento de teclado del buscador y asignación `searchInput.value = ""`.
- `src/app.js`: función que recibe la búsqueda y carga la primera página de los nuevos resultados.

## 6. Hay una manera de volver al estado inicial de la página

El logo de Pinterest funciona como botón de inicio. Al hacer clic sobre él se limpia el buscador, se reinicia la paginación y se vuelve a realizar la petición inicial de fotografías recientes.

La función de reinicio también cancela cualquier petición anterior que siga en curso. Esto evita que los resultados de una búsqueda antigua se mezclen con los de la página inicial.

Dónde comprobarlo:

- `src/components/header/Header.js`: evento de clic del logo y llamada a `onReset`.
- `src/app.js`: funciones `handleReset` y `loadFirstPage`.
- `src/state/galleryState.js`: función `resetCurrentPage`, que vuelve a la página 1.
