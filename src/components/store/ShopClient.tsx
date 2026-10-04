"use client";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function ShopClient({ products, categories, currency, initialCategory, initialQuery }: any) {
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const brands = useMemo(() => [...new Set(products.map((p: any) => p.brand).filter(Boolean))] as string[], [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p: any) => {
      if (q && !`${p.name} ${p.brand} ${p.shortDesc || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (category && p.categoryId !== categories.find((c: any) => c.slug === category)?.id) return false;
      if (brand && p.brand !== brand) return false;
      if ((p.rating || 0) < minRating) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "popular": list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break;
      case "discount": list = [...list].sort((a, b) => b.discountPct - a.discountPct); break;
      default: list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [products, q, category, brand, minRating, maxPrice, sort, categories]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:flex md:gap-8">
      <aside className="mb-6 rounded-2xl border p-4 md:mb-0 md:w-64">
        <h2 className="font-bold">Filters</h2>
        <label className="mt-4 block text-sm font-semibold">Search</label>
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border px-3 py-2" />
        <label className="mt-4 block text-sm font-semibold">Category</label>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border px-3 py-2">
          <option value="">All</option>
          {categories.map((c: any) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <label className="mt-4 block text-sm font-semibold">Brand</label>
        <select value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border px-3 py-2">
          <option value="">All</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <label className="mt-4 block text-sm font-semibold">Min rating: {minRating}+</label>
        <input type="range" min={0} max={5} value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="mt-1 w-full" />
        <label className="mt-4 block text-sm font-semibold">Max price: {currency}{maxPrice}</label>
        <input type="range" min={0} max={10000} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-1 w-full" />
        <label className="mt-4 block text-sm font-semibold">Sort</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2">
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="discount">Discount</option>
        </select>
      </aside>
      <div className="flex-1">
        <p className="mb-4 text-sm text-gray-500">{filtered.length} products</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((p: any) => <ProductCard key={p.id} p={p} currency={currency} />)}
        </div>
        {pages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`h-9 w-9 rounded-full border ${page === i + 1 ? "bg-brand-600 text-white" : ""}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
