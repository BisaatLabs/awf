-- ============================================================
-- Al Wahid Furnitures — Supabase Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. CATEGORIES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  space       text,
  description text,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.categories is 'Product categories (Bedroom Sets, Tables, etc.)';

-- ─────────────────────────────────────────────────────────────
-- 2. PRODUCTS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.products (
  id                uuid     primary key default gen_random_uuid(),
  sku               text     unique,                       -- original id e.g. "awf-001"
  name              text     not null,
  slug              text     not null unique,
  category_id       uuid     references public.categories(id) on delete set null,
  space             text,                                  -- denormalised for fast filtering
  description       text,
  short_description text,
  materials         text[]   not null default '{}',        -- ['Wood','Metal',…]
  finish            text,
  width_mm          text,                                  -- stored as text: "2000 mm"
  depth_mm          text,
  height_mm         text,
  customizable      boolean  not null default true,
  featured          boolean  not null default false,
  is_active         boolean  not null default true,        -- soft-delete / hide
  price_display     text,                                  -- optional e.g. "On Request"
  sort_order        int      not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.products is 'Furniture product catalogue';
comment on column public.products.sku is 'Original AWF id, e.g. awf-001';
comment on column public.products.is_active is 'False = hidden from public catalogue (soft delete)';

-- ─────────────────────────────────────────────────────────────
-- 3. PRODUCT IMAGES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.product_images (
  id                   uuid primary key default gen_random_uuid(),
  product_id           uuid not null references public.products(id) on delete cascade,
  cloudinary_public_id text not null,   -- e.g. awf/products/bedroom-set-wooden/01-bed.png
  secure_url           text,            -- full https://res.cloudinary.com/… (optional cache)
  sort_order           int  not null default 0,
  is_primary           boolean not null default false,
  alt_text             text,
  created_at           timestamptz not null default now()
);

comment on table public.product_images is 'Cloudinary images per product; is_primary = hero image';

-- ─────────────────────────────────────────────────────────────
-- 4. USER ROLES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin', 'viewer')) default 'viewer',
  created_at timestamptz not null default now()
);

comment on table public.user_roles is 'Admin / viewer role per authenticated user';

-- ─────────────────────────────────────────────────────────────
-- 5. TRIGGERS — auto-update updated_at
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at   on public.products;
drop trigger if exists categories_updated_at on public.categories;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger categories_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 6. HELPER — is_admin() (security definer = runs as owner)
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = '' as $
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.user_roles     enable row level security;

-- ── categories ───────────────────────────────────────────────
-- Public: read active categories
drop policy if exists "public_read_active_categories" on public.categories;
create policy "public_read_active_categories"
  on public.categories for select
  using (is_active = true);

-- Admin: full access (bypasses the public filter so admin sees inactive too)
drop policy if exists "admin_all_categories" on public.categories;
create policy "admin_all_categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── products ─────────────────────────────────────────────────
drop policy if exists "public_read_active_products" on public.products;
create policy "public_read_active_products"
  on public.products for select
  using (is_active = true);

drop policy if exists "admin_all_products" on public.products;
create policy "admin_all_products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── product_images ───────────────────────────────────────────
drop policy if exists "public_read_product_images" on public.product_images;
create policy "public_read_product_images"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active = true
    )
  );

drop policy if exists "admin_all_product_images" on public.product_images;
create policy "admin_all_product_images"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ── user_roles ───────────────────────────────────────────────
drop policy if exists "own_role_read" on public.user_roles;
create policy "own_role_read"
  on public.user_roles for select
  using (user_id = auth.uid());

drop policy if exists "admin_manage_roles" on public.user_roles;
create policy "admin_manage_roles"
  on public.user_roles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- 8. INDEXES for common query patterns
-- ─────────────────────────────────────────────────────────────
create index if not exists idx_products_slug        on public.products(slug);
create index if not exists idx_products_category    on public.products(category_id);
create index if not exists idx_products_space       on public.products(space);
create index if not exists idx_products_featured    on public.products(featured) where featured = true;
create index if not exists idx_products_is_active   on public.products(is_active);
create index if not exists idx_product_images_prod  on public.product_images(product_id, sort_order);
create index if not exists idx_product_images_primary on public.product_images(product_id) where is_primary = true;

-- ─────────────────────────────────────────────────────────────
-- Done. Next: run scripts/seed-supabase.ts to import products.
-- ─────────────────────────────────────────────────────────────
