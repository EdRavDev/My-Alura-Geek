-- 1. Habilitar seguridad (RLS) en la tabla existente "games"
alter table games enable row level security;

-- 2. Limpiar políticas anteriores para evitar errores
drop policy if exists "Public Read Access" on games;
drop policy if exists "Public Insert Access" on games;
drop policy if exists "Public Update Access" on games;
drop policy if exists "Public Delete Access" on games;

-- 3. Crear nuevas políticas de acceso PÚBLICO
create policy "Public Read Access" on games for select using ( true );
create policy "Public Insert Access" on games for insert with check ( true );
create policy "Public Update Access" on games for update using ( true );
create policy "Public Delete Access" on games for delete using ( true );
