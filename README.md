# 🐾 Huellas de Hogar — Sitio de adopción de mascotas

Proyecto completo en **HTML + CSS + JavaScript**, con almacenamiento en la nube
usando **Supabase** (Postgres) y un mapa satelital de la ubicación del refugio.

## Archivos del proyecto

| Archivo                | Qué hace |
|-------------------------|----------|
| `index.html`             | Estructura de la página (hero, mascotas, mapa, formulario) |
| `style.css`              | Todo el diseño visual |
| `script.js`              | Lógica: conexión a Supabase, filtros, modal de adopción y mapa |
| `supabase_schema.sql`    | Crea las tablas `pets` y `adoption_requests` en Supabase, con seguridad (RLS) y datos de ejemplo |

## 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta / proyecto nuevo (es gratis).
2. En el menú lateral entra a **SQL Editor → New query**.
3. Copia y pega **todo** el contenido de `supabase_schema.sql` y presiona **Run**.
   Esto crea las tablas, las reglas de seguridad y 8 mascotas de ejemplo con fotos reales.
4. Ve a **Settings → API** y copia:
   - **Project URL**
   - **anon public key**

## 2. Conectar el sitio con tu proyecto

Abre `script.js` y reemplaza estas dos líneas al principio del archivo:

```js
const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU-CLAVE-ANON-PUBLICA";
```

con los valores que copiaste en el paso anterior. Guarda el archivo.

> Si no configuras Supabase, el sitio sigue funcionando igual, pero usa datos
> de ejemplo guardados en el propio `script.js` (modo demo, sin nube).

## 3. Ubicación del refugio (imagen satelital)

La sección "Visítanos en el refugio" muestra una **imagen satelital fija**
(no un mapa interactivo) centrada en **Calle Beni, Santa Cruz de la Sierra**,
siempre orientada con el **norte hacia arriba**. La imagen se genera con el
servicio público de Esri World Imagery, en `index.html`:

```html
<img class="satellite-img"
     src="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-63.187338,-17.780889,-63.175086,-17.773889&bboxSR=4326&imageSR=4326&size=800,480&format=jpg&f=image"
     alt="Vista satelital de la ubicación del refugio en Calle Beni, Santa Cruz de la Sierra">
```

Si necesitas mover el punto exacto (otra calle, otra cuadra), cambia los 4
números de `bbox` (son: `oeste,sur,este,norte` en coordenadas geográficas) o
pídeme la nueva dirección y te genero el enlace actualizado.

## 4. Publicar el sitio

Como es HTML/CSS/JS puro, puedes subir los 3 archivos (`index.html`,
`style.css`, `script.js`) a cualquier hosting estático:

- **Netlify** o **Vercel**: arrastra la carpeta del proyecto.
- **GitHub Pages**: sube el repositorio y activa Pages.
- O simplemente abre `index.html` en el navegador para probarlo localmente.

## 5. Administrar mascotas y solicitudes

Desde el panel de Supabase (**Table Editor**) puedes:
- Agregar, editar o marcar mascotas como `adoptado` en la tabla `pets`.
- Revisar las solicitudes de adopción que llegan a `adoption_requests`
  (por seguridad, esa tabla NO se puede leer desde el sitio público, solo
  desde tu panel de administrador).

## Notas sobre las imágenes

Las fotos de mascotas usan servicios de imágenes reales ya disponibles
(`placedog.net` para perros y `placekitten.com` para gatos), solo para que
el proyecto se vea completo desde el primer momento. Para producción,
reemplaza el campo `imagen_url` de cada mascota por fotos reales de tu
refugio (puedes subirlas a **Supabase Storage** y pegar aquí la URL pública).
