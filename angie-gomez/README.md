# Angie Gómez · Maquilladora Profesional

Landing page de una sola página para el negocio de maquillaje de Angie Gómez.
HTML/CSS/JS estático, sin dependencias ni build: se abre directamente en el
navegador o se sirve desde cualquier hosting estático.

**Publicada en:** https://berzosaneuro.github.io/Neuro-carrusel/angie-gomez/
(nota las mayúsculas en `Neuro-carrusel`, tal cual el nombre del repositorio).

## Secciones

Inicio · Sobre mí · Servicios · Precios y Paquetes · Portafolio (galería con
vista ampliada) · Preguntas Frecuentes · Testimonios · Reserva (formulario +
WhatsApp).

## Estructura

```
angie-gomez/
  index.html
  assets/
    css/style.css
    js/main.js          Menú móvil, animaciones, lightbox, formulario de reserva
    img/
      hero-angie.jpg     Foto de cabecera (hero)
      about-angie.jpg    Foto de la sección "Hola, soy Angie"
      favicon.svg
      gallery/
        gallery-1.jpg    Recorte adicional para la galería del portafolio
        gallery-2.jpg    Recorte adicional para la galería del portafolio
```

## Ver en local

No requiere instalación. Basta con servir la carpeta, por ejemplo:

```bash
cd angie-gomez
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Cómo funciona el formulario de reserva

No hay backend: al enviarlo, el JavaScript arma un mensaje con los datos del
formulario y abre WhatsApp (`wa.me`) con ese texto ya escrito, lista para
mandar. Si más adelante quieres que llegue por email o a una base de datos,
habría que conectarlo a un servicio de formularios (Formspree, un pequeño
backend propio, etc.) — dímelo y lo agrego.

## Pendiente de personalizar

El maquetado está completo, pero estos datos son placeholders y deben
sustituirse por los reales antes de publicar:

- **WhatsApp**: los botones y el formulario apuntan a `https://wa.me/000000000000`
  y `WHATSAPP_NUMBER` en `assets/js/main.js` — cambia el número en ambos
  sitios (aparece varias veces en `index.html`: nav, hero, precios, barra
  flotante y sección de reserva).
- **Contacto del pie de página**: ciudad, teléfono e Instagram (`@angiegomez.makeup`)
  son de ejemplo.
- **Cifras del hero** ("5+ años", "400+ clientas", "5.0 ★"): son placeholders.
- **Precios y Paquetes** (`#precios`): los montos ("Desde $XXX") son de
  ejemplo — reemplázalos por tus tarifas reales.
- **Preguntas Frecuentes** (`#faq`): las respuestas son ejemplos razonables
  (formas de pago, servicio a domicilio, anticipación, etc.) — revísalas y
  ajústalas a tus políticas reales.
- **Portafolio** (`#trabajo`): la galería usa las dos fotos reales que me
  diste (más dos recortes adicionales de las mismas) con vista ampliada al
  hacer clic. Cuando tengas fotos de trabajos reales, añádelas dentro de
  `assets/img/gallery/` y agrega un `<button class="gallery__item">` más
  siguiendo el mismo patrón que los existentes en `index.html`.
- **Testimonios**: son textos de ejemplo; reemplázalos por reseñas reales de
  clientas.

## Despliegue

Este sitio se publica junto a la app `client/` (curso de inglés) en el mismo
GitHub Pages del repositorio, bajo `/angie-gomez/`, mediante el workflow
`.github/workflows/deploy-angie-gomez.yml`. Cualquier push a esta rama que
toque archivos de `angie-gomez/` vuelve a publicar automáticamente.
