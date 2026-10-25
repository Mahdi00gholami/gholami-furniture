-- Run this file in the Supabase SQL Editor for the project.
create extension if not exists pgcrypto;

create table if not exists public.furniture_items (
  id text primary key,
  title text not null,
  room_category text not null,
  material text not null default '',
  image text not null default '',
  unit_price_afn numeric not null check (unit_price_afn >= 0),
  available_quantity integer not null default 0 check (available_quantity >= 0),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.site_cart (
  id uuid primary key,
  items jsonb not null default '{}'::jsonb
);

create table if not exists public.quotations (
  id text primary key,
  customer jsonb not null,
  products jsonb not null,
  subtotal numeric not null,
  finishing numeric not null,
  total numeric not null,
  created_at timestamptz not null default now()
);

alter table public.furniture_items enable row level security;
alter table public.site_cart enable row level security;
alter table public.quotations enable row level security;

drop policy if exists "Public can read furniture" on public.furniture_items;
create policy "Public can read furniture" on public.furniture_items for select to anon, authenticated using (true);
drop policy if exists "Furniture admins manage furniture" on public.furniture_items;
create policy "Furniture admins manage furniture" on public.furniture_items for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read site cart" on public.site_cart;
create policy "Public can read site cart" on public.site_cart for select to anon, authenticated using (true);
drop policy if exists "Admins can clear site cart" on public.site_cart;
create policy "Admins can clear site cart" on public.site_cart for update to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can read quotations" on public.quotations;
create policy "Public can read quotations" on public.quotations for select to anon, authenticated using (true);
drop policy if exists "Public can create quotations" on public.quotations;
create policy "Public can create quotations" on public.quotations for insert to anon, authenticated with check (true);
drop policy if exists "Public can delete quotations" on public.quotations;
create policy "Public can delete quotations" on public.quotations for delete to anon, authenticated using (true);

grant select on public.furniture_items to anon, authenticated;
grant insert, update, delete on public.furniture_items to authenticated;
grant select on public.site_cart to anon, authenticated;
grant update on public.site_cart to authenticated;
grant select, insert, delete on public.quotations to anon, authenticated;

create or replace function public.adjust_cart(p_cart_id uuid, p_item_id text, p_delta integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  product public.furniture_items%rowtype;
  current_cart jsonb;
  next_quantity integer;
begin
  if p_delta = 0 then raise exception 'Quantity change must not be zero.'; end if;
  select * into product from public.furniture_items where id = p_item_id for update;
  if not found then raise exception 'Furniture item not found.'; end if;
  insert into public.site_cart (id, items) values (p_cart_id, '{}'::jsonb) on conflict (id) do nothing;
  select items into current_cart from public.site_cart where id = p_cart_id for update;
  next_quantity := coalesce((current_cart ->> p_item_id)::integer, 0) + p_delta;
  if next_quantity < 0 then raise exception 'Cart quantity cannot be negative.'; end if;
  if product.available_quantity - p_delta < 0 then raise exception 'No more stock available in workshop.'; end if;
  update public.furniture_items set available_quantity = available_quantity - p_delta where id = p_item_id returning * into product;
  if next_quantity = 0 then current_cart := current_cart - p_item_id;
  else current_cart := jsonb_set(current_cart, array[p_item_id], to_jsonb(next_quantity), true);
  end if;
  update public.site_cart set items = current_cart where id = p_cart_id;
  return jsonb_build_object('available_quantity', product.available_quantity, 'cart', current_cart);
end;
$$;
revoke all on function public.adjust_cart(uuid, text, integer) from public;
grant execute on function public.adjust_cart(uuid, text, integer) to anon, authenticated;

create or replace function public.submit_quotation(
  p_id text, p_cart_id uuid, p_customer jsonb, p_products jsonb,
  p_subtotal numeric, p_finishing numeric, p_total numeric
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.quotations (id, customer, products, subtotal, finishing, total)
  values (p_id, p_customer, p_products, p_subtotal, p_finishing, p_total);
  update public.site_cart set items = '{}'::jsonb where id = p_cart_id;
end;
$$;
revoke all on function public.submit_quotation(text, uuid, jsonb, jsonb, numeric, numeric, numeric) from public;
grant execute on function public.submit_quotation(text, uuid, jsonb, jsonb, numeric, numeric, numeric) to anon, authenticated;

-- Seed without overwriting existing records: current catalog edits and quantities survive reruns.
insert into public.furniture_items (id, title, room_category, material, image, unit_price_afn, available_quantity, description) values
('1', 'Ergonomic Office Chair', 'office', 'Leather & Steel', '/chair 1.png', 3500, 5, 'Premium orthopedic swivel chair with lumbar support and adjustable height.'),
('2', 'Modern Executive Desk', 'office', 'Solid MDF', '/table 1.png', 6000, 4, 'Sleek office workstation featuring integrated cable management holes.'),
('3', 'Classic Wooden Dining Chair', 'dining room', 'Natural Oak', '/chair 2.png', 1500, 8, 'Minimalist finely polished timber chair, perfect for elegant dining rooms.'),
('4', 'Robust Workshop Dining Table', 'dining room', 'Walnut Wood', '/table 2.png', 4000, 3, 'Sturdy artisan crafted dining table designed for family gatherings.'),
('5', 'Luxury Accent Armchair', 'living room', 'Velvet Fabric', '/furniture 3.png', 9500, 6, 'Ultra-soft single sofa seat equipped with high-density comfort foam.'),
('6', 'Modern Living Room Sectional', 'living room', 'Premium Linen', '/furniture 4.png', 24000, 2, 'Contemporary style spacious sofa set tailored for luxury living spaces.')
on conflict (id) do nothing;
