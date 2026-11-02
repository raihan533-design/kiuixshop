import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const STORAGE_KEY = 'kiuix_supabase_config';

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

let cachedClient: ReturnType<typeof createClient> | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) return null;

  if (cachedClient && lastUrl === config.url && lastKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey);
    lastUrl = config.url;
    lastKey = config.anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Convert Product to Supabase Row
export function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    original_price: p.originalPrice ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    category: p.category,
    category_label: p.categoryLabel,
    badge: p.badge ?? null,
    image: p.image,
    secondary_image: p.secondaryImage ?? null,
    images: p.images || [p.image],
    description: p.description,
    features: p.features,
    specs: p.specs,
    colors: p.colors,
    in_stock: p.inStock,
    stock_count: p.stockCount,
  };
}

// Convert Supabase Row to Product
export function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 1),
    category: row.category,
    categoryLabel: row.category_label,
    badge: row.badge || undefined,
    image: row.image,
    secondaryImage: row.secondary_image || undefined,
    images: Array.isArray(row.images) ? row.images : [row.image],
    description: row.description,
    features: Array.isArray(row.features) ? row.features : [],
    specs: typeof row.specs === 'object' && row.specs !== null ? row.specs : {},
    colors: Array.isArray(row.colors) ? row.colors : [],
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count || 0),
  };
}

// Typed helper methods
export async function supabaseFetchProducts() {
  const client = getSupabaseClient();
  if (!client) return { data: null, error: new Error('Client not configured') };
  return (client.from('products') as any).select('*');
}

export async function supabaseUpsertProduct(product: Product) {
  const client = getSupabaseClient();
  if (!client) return;
  return (client.from('products') as any).upsert(productToRow(product));
}

export async function supabaseInsertProduct(product: Product) {
  const client = getSupabaseClient();
  if (!client) return;
  return (client.from('products') as any).insert(productToRow(product));
}

export async function supabaseDeleteProduct(id: string) {
  const client = getSupabaseClient();
  if (!client) return;
  return (client.from('products') as any).delete().eq('id', id);
}

export async function supabaseBulkUpsert(products: Product[]) {
  const client = getSupabaseClient();
  if (!client) return { error: new Error('Client not configured') };
  const rows = products.map(productToRow);
  return (client.from('products') as any).upsert(rows, { onConflict: 'id' });
}

// SQL schema generator for Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- 1. Create products table
create table if not exists public.products (
  id text primary key,
  name text not null,
  tagline text not null,
  price numeric not null,
  original_price numeric,
  rating numeric default 5.0,
  review_count integer default 1,
  category text not null,
  category_label text not null,
  badge text,
  image text not null,
  secondary_image text,
  images jsonb default '[]'::jsonb,
  description text not null,
  features jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  colors jsonb default '[]'::jsonb,
  in_stock boolean default true,
  stock_count integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- 3. Create public read policy (everyone in the world can read products)
drop policy if exists "Allow public read" on public.products;
create policy "Allow public read" on public.products for select using (true);

-- 4. Create public write policy (allow admin to create/update/delete products)
drop policy if exists "Allow public insert" on public.products;
create policy "Allow public insert" on public.products for insert with check (true);

drop policy if exists "Allow public update" on public.products;
create policy "Allow public update" on public.products for update using (true);

drop policy if exists "Allow public delete" on public.products;
create policy "Allow public delete" on public.products for delete using (true);
`;
