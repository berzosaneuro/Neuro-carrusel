# Curso de Inglés A2+

PWA privada para aprender inglés de A2 a C1. Interfaz en español, contenido en inglés.
Sin registro ni login: el progreso se guarda en el propio dispositivo.

**App publicada:** https://berzosaneuro.github.io/neuro-carrusel/

## Estructura

```
client/   Aplicación completa (React + Vite + TypeScript + Tailwind CSS v4)
```

Es una aplicación puramente estática: no hay servidor ni base de datos. El contenido del
curso está incluido en el bundle y el progreso vive en `localStorage` del navegador.

## Características

- **Sin cuentas**: se abre y funciona. El progreso es por dispositivo.
- **4 niveles (A2, B1, B2, C1) × 4 unidades = 16 unidades**, cada una con:
  - Vocabulario en flashcards que se giran para revelar traducción y ejemplo.
  - Explicación de gramática en español con ejemplos en inglés.
  - Diálogo con preguntas de comprensión.
  - Prueba de 8 preguntas (opción múltiple y rellenar hueco) con corrección instantánea.
- **Progresión bloqueada**: una unidad se desbloquea al aprobar (≥60%) la anterior.
- **Racha diaria** que aumenta cada día que completas al menos una unidad.
- **Instalable como PWA** (manifest + service worker con caché del app shell).

## Desarrollo

Requiere Node.js 18+.

```bash
cd client
npm install
npm run dev       # http://localhost:5173/neuro-carrusel/
```

Otros comandos:

```bash
npm run build     # genera client/dist
npm run preview   # sirve el build de producción
npm run lint
```

## Despliegue

El sitio se publica en GitHub Pages desde la rama `gh-pages`, que contiene el resultado
de `npm run build`. Para publicar una nueva versión:

```bash
cd client && npm run build
```

y sube el contenido de `client/dist` a la rama `gh-pages`.

`vite.config.ts` usa `base: './'` (rutas relativas), así que el mismo build sirve tanto
desde la raíz de un dominio como desde un subdirectorio. La app usa `HashRouter`, de modo
que las rutas funcionan en GitHub Pages sin reglas de reescritura en el servidor.

> **Ojo:** la rama `gh-pages` está compartida con otro sitio de este repositorio, que se
> publica en `gh-pages/angie-gomez/`. Por eso el workflow de despliegue reemplaza
> únicamente los archivos de la raíz y su carpeta `assets/`, en lugar de reescribir la
> rama entera. Cualquier cambio en ese workflow debe mantener esa garantía.
