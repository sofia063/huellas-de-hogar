-- =========================================================
--  ARREGLAR FOTOS ROTAS — ejecutar en Supabase (SQL Editor)
-- ---------------------------------------------------------
--  placedog.net cambió de dominio a "place.dog" y
--  placekitten.com dejó de funcionar. Este script actualiza
--  las fotos de las mascotas que ya insertaste con el
--  supabase_schema.sql anterior, sin borrar nada más.
-- =========================================================

update public.pets set imagen_url = 'https://place.dog/500/400?id=10'
  where nombre = 'Rocky';

update public.pets set imagen_url = 'https://cataas.com/cat/595f280f557291a9750ebfb7?width=500&height=400'
  where nombre = 'Mia';

update public.pets set imagen_url = 'https://place.dog/500/400?id=20'
  where nombre = 'Toby';

update public.pets set imagen_url = 'https://cataas.com/cat/595f2810557291a9750ebfce?width=500&height=400'
  where nombre = 'Luna';

update public.pets set imagen_url = 'https://place.dog/500/400?id=30'
  where nombre = 'Simba';

update public.pets set imagen_url = 'https://cataas.com/cat/60c0d08ec441cc0011a913c5?width=500&height=400'
  where nombre = 'Nala';

update public.pets set imagen_url = 'https://place.dog/500/400?id=40'
  where nombre = 'Max';

update public.pets set imagen_url = 'https://cataas.com/cat/61009bfbcaacc400184f6b2b?width=500&height=400'
  where nombre = 'Coco';

-- Verifica que haya quedado bien:
select nombre, especie, imagen_url from public.pets order by id;
