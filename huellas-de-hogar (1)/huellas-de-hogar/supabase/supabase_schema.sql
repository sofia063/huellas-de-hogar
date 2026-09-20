-- =========================================================
--  HUELLAS DE HOGAR — esquema de base de datos para Supabase
-- ---------------------------------------------------------
--  Cómo usarlo:
--  1. Entra a tu proyecto en https://supabase.com
--  2. Ve a "SQL Editor" → "New query"
--  3. Pega TODO este archivo y presiona "Run"
--  4. Copia la "Project URL" y la "anon public key"
--     (Settings → API) dentro de script.js
-- =========================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- Tabla: pets (mascotas en adopción)
-- ---------------------------------------------------------
create table if not exists public.pets (
  id                bigint generated always as identity primary key,
  nombre            text not null,
  especie           text not null check (especie in ('perro', 'gato')),
  raza              text,
  edad              integer not null check (edad >= 0),
  sexo              text check (sexo in ('macho', 'hembra')),
  tamano            text not null check (tamano in ('pequeño', 'mediano', 'grande')),
  descripcion       text,
  imagen_url        text not null,
  estado            text not null default 'disponible' check (estado in ('disponible', 'en_proceso', 'adoptado')),
  ubicacion_lat     double precision,
  ubicacion_lng     double precision,
  created_at        timestamptz not null default now()
);

comment on table public.pets is 'Animales publicados para adopción por el refugio.';

-- ---------------------------------------------------------
-- Tabla: adoption_requests (solicitudes de adopción)
-- ---------------------------------------------------------
create table if not exists public.adoption_requests (
  id                  uuid primary key default gen_random_uuid(),
  pet_id              bigint not null references public.pets (id) on delete cascade,
  nombre_solicitante  text not null,
  email               text not null,
  telefono            text not null,
  mensaje             text,
  estado_solicitud    text not null default 'pendiente' check (estado_solicitud in ('pendiente', 'en_revision', 'aprobada', 'rechazada')),
  created_at          timestamptz not null default now()
);

comment on table public.adoption_requests is 'Solicitudes que las personas envían desde el formulario del sitio.';

create index if not exists idx_adoption_requests_pet_id on public.adoption_requests (pet_id);
create index if not exists idx_pets_especie on public.pets (especie);
create index if not exists idx_pets_estado on public.pets (estado);

-- ---------------------------------------------------------
-- Seguridad: Row Level Security (RLS)
-- ---------------------------------------------------------
-- Cualquier visitante puede LEER la lista de mascotas (tabla pública),
-- pero solo puede INSERTAR solicitudes de adopción, nunca leerlas,
-- editarlas ni borrarlas (eso lo hace el equipo del refugio desde
-- el panel de Supabase con su propia sesión / service role).

alter table public.pets enable row level security;
alter table public.adoption_requests enable row level security;

drop policy if exists "Cualquiera puede ver mascotas" on public.pets;
create policy "Cualquiera puede ver mascotas"
  on public.pets for select
  using (true);

drop policy if exists "Cualquiera puede enviar una solicitud" on public.adoption_requests;
create policy "Cualquiera puede enviar una solicitud"
  on public.adoption_requests for insert
  with check (true);

-- Nota: a propósito NO se crea una policy de "select" para
-- adoption_requests, así los datos personales de los solicitantes
-- no quedan expuestos al público con la llave "anon".

-- ---------------------------------------------------------
-- Datos de ejemplo (usa fotos reales ya disponibles)
-- ---------------------------------------------------------
insert into public.pets
  (nombre, especie, raza, edad, sexo, tamano, descripcion, imagen_url, estado, ubicacion_lat, ubicacion_lng)
values
  ('Rocky', 'perro', 'Mestizo',           2, 'macho',  'mediano', 'Rocky es juguetón, aprendió a sentarse y a dar la pata en dos semanas. Le encanta correr en el parque.', 'https://placedog.net/500/400?id=10', 'disponible', -17.766, -63.182),
  ('Mia',   'gato',  'Común europeo',     1, 'hembra', 'pequeño', 'Mia es curiosa y muy limpia. Se lleva bien con otros gatos y le fascina dormir cerca de una ventana.',       'https://placekitten.com/500/400?image=2', 'disponible', -17.766, -63.182),
  ('Toby',  'perro', 'Labrador mix',      4, 'macho',  'grande',  'Toby es tranquilo y protector, ideal para una familia con niños. Ya sabe caminar con correa sin jalar.',    'https://placedog.net/500/400?id=20', 'disponible', -17.766, -63.182),
  ('Luna',  'gato',  'Siamés mix',        3, 'hembra', 'pequeño', 'Luna es independiente pero cariñosa por las noches. Está esterilizada y al día con sus vacunas.',            'https://placekitten.com/500/400?image=5', 'disponible', -17.766, -63.182),
  ('Simba', 'perro', 'Criollo',           1, 'macho',  'pequeño', 'Simba llegó como cachorro rescatado de la calle. Es sociable con otros perros y muy energético.',           'https://placedog.net/500/400?id=30', 'adoptado', -17.766, -63.182),
  ('Nala',  'gato',  'Naranjo común',     2, 'hembra', 'mediano', 'Nala es la reina de la casa cuna: tranquila, ronroneadora y perfecta para departamentos.',                  'https://placekitten.com/500/400?image=8', 'disponible', -17.766, -63.182),
  ('Max',   'perro', 'Pastor mix',        5, 'macho',  'grande',  'Max es un perro adulto, ya entrenado, obediente y muy leal. Busca un hogar tranquilo.',                     'https://placedog.net/500/400?id=40', 'disponible', -17.766, -63.182),
  ('Coco',  'gato',  'Tricolor',          1, 'hembra', 'pequeño', 'Coco es juguetona y muy activa, perfecta para una casa con espacio para explorar.',                          'https://placekitten.com/500/400?image=11', 'disponible', -17.766, -63.182)
on conflict do nothing;
