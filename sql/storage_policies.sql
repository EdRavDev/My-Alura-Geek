-- Políticas de Storage para el bucket "game-imagenes"
-- Ejecutar esto en el SQL Editor de Supabase

-- 1. Permitir que usuarios anónimos SUBAN archivos
insert into storage.policies (bucket_id, name, definition, command)
values (
  'game-imagenes',
  'Public Upload Access',
  '(true)',
  'INSERT'
);

-- 2. Permitir que usuarios anónimos LEAN/DESCARGUEN archivos
insert into storage.policies (bucket_id, name, definition, command)
values (
  'game-imagenes',
  'Public Read Access',
  '(true)',
  'SELECT'
);

-- 3. Permitir que usuarios anónimos ACTUALICEN archivos (opcional)
insert into storage.policies (bucket_id, name, definition, command)
values (
  'game-imagenes',
  'Public Update Access',
  '(true)',
  'UPDATE'
);

-- 4. Permitir que usuarios anónimos ELIMINEN archivos (opcional)
insert into storage.policies (bucket_id, name, definition, command)
values (
  'game-imagenes',
  'Public Delete Access',
  '(true)',
  'DELETE'
);
