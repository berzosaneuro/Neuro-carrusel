# Angie Gómez · Maquilladora Profesional

Landing page de una sola página para el negocio de maquillaje de Angie Gómez,
inspirada en el diseño de referencia proporcionado. HTML/CSS/JS estático, sin
dependencias ni build: se abre directamente en el navegador o se sirve desde
cualquier hosting estático.

## Estructura

```
angie-gomez/
  index.html
  assets/
    css/style.css
    js/main.js
    img/
      hero-angie.jpg     Foto de cabecera (hero)
      about-angie.jpg    Foto de la sección "Hola, soy Angie"
      favicon.svg
```

## Ver en local

No requiere instalación. Basta con servir la carpeta, por ejemplo:

```bash
cd angie-gomez
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Pendiente de personalizar

El maquetado está completo, pero estos datos son placeholders y deben
sustituirse por los reales antes de publicar:

- **WhatsApp**: los botones apuntan a `https://wa.me/000000000000` — cambia el
  número en `index.html` (aparece en el nav, el hero, la barra flotante y el CTA final).
- **Contacto del pie de página**: ciudad, teléfono e Instagram (`@angiegomez.makeup`)
  son de ejemplo.
- **Cifras del hero** ("5+ años", "400+ clientas", "5.0 ★"): son placeholders de
  ejemplo — ajústalas a datos reales antes de publicar.
- **Portafolio** (`#trabajo`): solo hay dos fotos reales, así que la sección usa
  una tarjeta grande que enlaza a Instagram (donde vivirá el portafolio completo)
  más unas tarjetas de categoría con color sólido en vez de fotos de trabajos que
  no existen todavía. Cuando tengas fotos reales de trabajos, sustituye esas
  tarjetas de categoría por `<img>` dentro de `assets/img/portfolio/`.
- **Testimonios**: son textos de ejemplo; reemplázalos por reseñas reales de
  clientas.

## Despliegue

Este sitio es independiente de la app `client/` (curso de inglés) que ya
publica este repositorio en GitHub Pages. Si quieres publicarlo, dime si
prefieres un dominio/proyecto propio o una ruta dentro del mismo Pages
(p. ej. `/angie-gomez/`) y configuro el workflow correspondiente.
