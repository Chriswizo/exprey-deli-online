-- Run this in Supabase Dashboard > SQL Editor.
-- Public visitors can read shipment tracking details. Only authenticated admins can create/update/delete.
create extension if not exists pgcrypto;
create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique not null,
  recipient text,
  origin text not null,
  destination text not null,
  status text not null default 'Shipment Created',
  estimated_delivery date,
  notes text,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shipments enable row level security;
drop policy if exists "Public can track shipments" on public.shipments;
create policy "Public can track shipments" on public.shipments for select to anon, authenticated using (true);
drop policy if exists "Admins can insert shipments" on public.shipments;
create policy "Admins can insert shipments" on public.shipments for insert to authenticated with check (true);
drop policy if exists "Admins can update shipments" on public.shipments;
create policy "Admins can update shipments" on public.shipments for update to authenticated using (true) with check (true);
drop policy if exists "Admins can delete shipments" on public.shipments;
create policy "Admins can delete shipments" on public.shipments for delete to authenticated using (true);

-- IMPORTANT SECURITY NOTE:
-- The policies above allow any authenticated Supabase user to manage shipments.
-- For production, restrict write policies to a dedicated admin role/table before inviting any other users.
-- Keep public tracking responses free of private customer details. Consider a separate safe public view/RPC
-- so the anonymous visitor cannot query recipient names or internal notes.
