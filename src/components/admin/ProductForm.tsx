"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ product, categories }: any) {
  const router = useRouter();
  const [f, setF] = useState<any>({
    name: product?.name || "",
    shortDesc: product?.shortDesc || "",
    description: product?.description || "",
    price: product?.price ?? 0,
    previousPrice: product?.previousPrice ?? "",
    discountPct: product?.discountPct ?? 0,
    brand: product?.brand || "",
    rating: product?.rating ?? 0,
    ratingCount: product?.ratingCount ?? 0,
    status: product?.status || "In Stock",
    affiliateUrl: product?.affiliateUrl || "",
    categoryId: product?.categoryId || "",
    images: (product?.images ? JSON.parse(product.images || "[]") : []).join("\n"),
    specs: product?.specs ? Object.entries(JSON.parse(product.specs || "{}")).map(([k, v]) => `${k}: ${v}`).join("\n") : "",
    featured: product?.featured || false,
    isNew: product?.isNew || false,
    popular: product?.popular || false,
    enabled: product?.enabled ?? true,
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
  });
  const [error, setError] = useState("");
  const set = (k: string, v: any) => setF({ ...f, [k]: v });

  async function upload(e: any) {
    const files = Array.from(e.target.files || []) as File[];
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) urls.push((await res.json()).url);
    }
    set("images", [...urls, ...f.images.split("\n").filter((l: string) => l.trim())].join("\n"));
  }

  async function submit(e: any) {
    e.preventDefault();
    setError("");
    const specs: Record<string, string> = {};
    for (const line of f.specs.split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
    const payload = {
      ...f,
      price: Number(f.price),
      previousPrice: f.previousPrice === "" ? null : Number(f.previousPrice),
      discountPct: Number(f.discountPct),
      rating: Number(f.rating),
      ratingCount: Number(f.ratingCount),
      categoryId: f.categoryId || null,
      images: f.images.split("\n").map((s: string) => s.trim()).filter(Boolean),
      specs,
    };
    const res = await fetch(product ? `/api/admin/products/${product.id}` : "/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) { router.push("/admin/products"); router.refresh(); }
    else setError((await res.json()).error || "Error");
  }

  const input = "w-full rounded-lg border px-3 py-2 text-sm";
  const label = "mt-4 block text-sm font-semibold";

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <label className={label}>Name</label>
      <input required className={input} value={f.name} onChange={(e) => set("name", e.target.value)} />
      <label className={label}>Short description</label>
      <textarea className={input} value={f.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} />
      <label className={label}>Description</label>
      <textarea rows={5} className={input} value={f.description} onChange={(e) => set("description", e.target.value)} />
      <div className="grid grid-cols-3 gap-4">
        <div><label className={label}>Price</label><input type="number" step="0.01" className={input} value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
        <div><label className={label}>Previous price</label><input type="number" step="0.01" className={input} value={f.previousPrice} onChange={(e) => set("previousPrice", e.target.value)} /></div>
        <div><label className={label}>Discount %</label><input type="number" className={input} value={f.discountPct} onChange={(e) => set("discountPct", e.target.value)} /></div>
      </div>
      <label className={label}>Brand</label>
      <input className={input} value={f.brand} onChange={(e) => set("brand", e.target.value)} />
      <div className="grid grid-cols-3 gap-4">
        <div><label className={label}>Rating</label><input type="number" step="0.1" className={input} value={f.rating} onChange={(e) => set("rating", e.target.value)} /></div>
        <div><label className={label}>Rating count</label><input type="number" className={input} value={f.ratingCount} onChange={(e) => set("ratingCount", e.target.value)} /></div>
        <div><label className={label}>Status text</label><input className={input} value={f.status} onChange={(e) => set("status", e.target.value)} /></div>
      </div>
      <label className={label}>Affiliate URL</label>
      <input required type="url" className={input} value={f.affiliateUrl} onChange={(e) => set("affiliateUrl", e.target.value)} />
      <label className={label}>Category</label>
      <select className={input} value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
        <option value="">None</option>
        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <label className={label}>Images (one URL per line) — top one shows as main</label>
      <textarea rows={3} className={input} value={f.images} onChange={(e) => set("images", e.target.value)} />
      <label className={label}>Upload images</label>
      <input type="file" multiple accept="image/*" onChange={upload} />
      <label className={label}>Specs (Key: Value per line)</label>
      <textarea rows={4} className={input} value={f.specs} onChange={(e) => set("specs", e.target.value)} />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {[["featured", "Featured"], ["isNew", "New"], ["popular", "Popular"], ["enabled", "Enabled"]].map(([k, l]) => (
          <label key={k} className="flex items-center gap-1.5">
            <input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} /> {l}
          </label>
        ))}
      </div>
      <label className={label}>SEO title</label>
      <input className={input} value={f.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
      <label className={label}>SEO description</label>
      <input className={input} value={f.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <button className="mt-6 rounded-full bg-brand-600 px-8 py-2.5 font-semibold text-white">Save</button>
    </form>
  );
}
