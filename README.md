# English Course App (A2+)

Aplicación web interactiva para aprender inglés desde nivel A2 en adelante (A2, B1, B2, C1), con cuentas de usuario, progreso guardado en base de datos y desbloqueo progresivo de unidades.

## Estructura del proyecto

```
server/                          API REST (Node.js + Express + SQLite + JWT)
client/                          Frontend (React + Vite + TypeScript + Tailwind CSS)
landing-marta-ofelia-puerta/     Landing de psicología (HTML estático, sin build)
```

## Landing: Marta Ofelia Puerta — Psicóloga especialista en Autismo

Página de una sola pieza (`landing-marta-ofelia-puerta/index.html`) en estética cyberpunk dentro de una carcasa estilo iPhone, reutilizando la paleta neón y los paneles de cristal ya definidos en `client/src/index.css`. Incluye barra de estado y tab bar inferior al estilo iOS, carrusel de servicios/testimonios con scroll-snap, y un botón de contacto por WhatsApp.

Desplegada en: **https://marta-ofelia-puerta.vercel.app**

Antes de publicarla, reemplaza los datos de contacto de ejemplo (número de WhatsApp y correo) por los reales.

### Backend (formulario, agenda de citas y panel de administración)

`landing-marta-ofelia-puerta/api/` son funciones serverless de Vercel (Node.js, sin framework) respaldadas por Postgres (`@vercel/postgres`):

- `POST /api/contact` — guarda un mensaje del formulario de contacto.
- `GET /api/availability` — lista los horarios libres futuros (público).
- `POST /api/appointments` — reserva una cita (público, con protección contra doble reserva).
- `POST /api/admin/login` / `POST /api/admin/logout` — sesión de administración (cookie firmada, sin JWT externo).
- `GET /api/admin/leads`, `GET|POST|DELETE /api/admin/slots`, `GET|DELETE /api/admin/appointments` — protegidos, requieren sesión.

Panel de administración: `landing-marta-ofelia-puerta/admin/index.html` → **https://marta-ofelia-puerta.vercel.app/admin/** (login con `ADMIN_PASSWORD`). Desde ahí Marta puede ver los mensajes recibidos, gestionar las citas y añadir horarios disponibles.

**Puesta en marcha (una sola vez, requiere el dashboard de Vercel):**

1. En el proyecto `marta-ofelia-puerta` en Vercel → pestaña **Storage** → *Create Database* → **Postgres** → *Connect to Project* (plan gratuito). Esto inyecta automáticamente `POSTGRES_URL` y variables relacionadas.
2. En **Settings → Environment Variables**, añade para *Production*:
   - `ADMIN_PASSWORD` — contraseña del panel de administración.
   - `SESSION_SECRET` — cadena aleatoria larga usada para firmar la cookie de sesión.
3. Redeploy del proyecto para que las funciones recojan las nuevas variables.

Las tablas (`leads`, `availability_slots`, `appointments`) se crean automáticamente en el primer request (`CREATE TABLE IF NOT EXISTS`), no hace falta migrar nada a mano.

## Características

- **Cuentas de usuario**: registro/login con contraseña cifrada (bcrypt) y sesión vía JWT.
- **4 niveles (A2, B1, B2, C1) x 4 unidades = 16 unidades**, cada una con:
  - Vocabulario interactivo (flashcards que se giran para revelar traducción y ejemplo).
  - Explicación de gramática con ejemplos.
  - Diálogo (listening en formato texto) con preguntas de comprensión.
  - Quiz de 8 preguntas (opción múltiple y rellenar hueco) con corrección instantánea.
- **Progreso persistente**: cada usuario guarda su mejor puntuación por unidad, intentos y qué unidades ha completado.
- **Progresión bloqueada**: una unidad se desbloquea solo al aprobar (≥60%) la anterior, siguiendo el orden A2 → B1 → B2 → C1.
- **Racha diaria** (streak) que aumenta cada día que completas al menos una unidad.

## Requisitos

- Node.js 18+

## Puesta en marcha

### 1. Backend

```bash
cd server
cp .env.example .env   # y cambia JWT_SECRET por un valor aleatorio largo
npm install
npm run dev             # http://localhost:4000
```

La base de datos SQLite (`data.sqlite`) se crea automáticamente en `server/` la primera vez que arranca.

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

El frontend usa un proxy de Vite (`vite.config.ts`) para reenviar `/api/*` a `http://localhost:4000`, así que no hace falta configurar CORS ni URLs manualmente en desarrollo.

Abre `http://localhost:5173`, crea una cuenta y empieza el curso.

## Producción

```bash
cd client && npm run build   # genera client/dist (build estático)
cd server && npm start        # sirve la API (necesitas servir client/dist con un hosting estático o detrás de un proxy)
```

Recuerda establecer un `JWT_SECRET` fuerte y persistente en producción (variable de entorno), y hacer copia de seguridad del archivo `server/data.sqlite`.

## Ampliar el contenido

Todo el contenido del curso vive en `server/src/data/course.js`: cada unidad es un objeto con `vocabulary`, `grammar`, `dialogue` y `quiz`. Para añadir más unidades o niveles (por ejemplo C2), añade un nuevo objeto a `COURSE` siguiendo el mismo formato — el frontend y el sistema de progreso lo detectan automáticamente por orden (`level` + `order`).
