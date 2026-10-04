import Link from "next/link";
import Stars from "./Stars";
import { formatPrice, productImages } from "@/lib/utils";

export default function ProductCard({ p, currency }: { p: any; currency: string }) {
  const imgs = productImages(p.images);
  return (
    <div className="group flex flex-col rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/product/${p.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {imgs[0] ? (
          <img src={imgs[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">No image</div>
        )}
        {p.discountPct > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{p.discountPct}%</span>
        )}
        {p.isNew && (
          <span className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">NEW</span>
        )}
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-gray-400">{p.brand}</p>
        <Link href={`/product/${p.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-brand-600">{p.name}</Link>
        <div className="mt-1"><Stars rating={p.rating || 0} /></div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold">{formatPrice(p.price, currency)}</span>
          {p.previousPrice ? <span className="text-sm text-gray-400 line-through">{formatPrice(p.previousPrice, currency)}</span> : null}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <a href={`/buy/${p.slug}`} target="_blank" rel="nofollow noopener" className="flex-1 rounded-full bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700">Buy Now</a>
          <a href={`/buy/${p.slug}`} target="_blank" rel="nofollow noopener" className="flex-1 rounded-full border px-3 py-2 text-center text-xs font-semibold text-gray-700 hover:bg-gray-50">Details</a>
        </div>
      </div>
    </div>
  );
}
