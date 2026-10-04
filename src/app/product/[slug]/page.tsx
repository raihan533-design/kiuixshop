import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { notFound } from "next/navigation";
import Stars from "@/components/store/Stars";
import { formatPrice, productImages, productSpecs } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  if (!p) return {};
  return { title: p.seoTitle || p.name, description: p.seoDescription || p.shortDesc || undefined };
}

export default async function ProductDetail({ params }: any) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!p || !p.enabled) notFound();
  const s = await getSettings(["currency", "affiliateDisclosure", "contactEmail"]);
  const imgs = productImages(p.images);
  const specs = productSpecs(p.specs);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDesc,
    brand: { "@type": "Brand", name: p.brand },
    offers: { "@type": "Offer", price: p.price, priceCurrency: "USD", availability: "https://schema.org/InStock" },
    aggregateRating: p.rating ? { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.ratingCount } : undefined,
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-gray-100">
            {imgs[0] ? <img src={imgs[0]} alt={p.name} className="h-full w-full object-cover" /> : null}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {imgs.slice(1).map((img, i) => <img key={i} src={img} alt={`${p.name} ${i + 2}`} className="h-20 w-20 rounded-xl object-cover" />)}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400">{p.brand} {p.category ? `• ${p.category.name}` : ""}</p>
          <h1 className="mt-1 text-3xl font-bold">{p.name}</h1>
          <div className="mt-2"><Stars rating={p.rating || 0} /></div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{formatPrice(p.price, s.currency)}</span>
            {p.previousPrice ? <span className="text-lg text-gray-400 line-through">{formatPrice(p.previousPrice, s.currency)}</span> : null}
            {p.discountPct > 0 && <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-bold text-red-600">-{p.discountPct}% OFF</span>}
          </div>
          <p className="mt-4 text-gray-600">{p.shortDesc}</p>
          <p className="mt-2 text-sm font-semibold text-green-600">{p.status}</p>
          <a href={`/buy/${p.slug}`} target="_blank" rel="nofollow noopener" className="mt-6 block rounded-full bg-brand-600 px-8 py-4 text-center font-bold text-white hover:bg-brand-700">
            Buy Now
          </a>
          <p className="mt-4 text-xs text-gray-400">{s.affiliateDisclosure}</p>
        </div>
      </div>
      {p.description && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Description</h2>
          <p className="mt-2 whitespace-pre-line text-gray-600">{p.description}</p>
        </section>
      )}
      {Object.keys(specs).length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Specifications</h2>
          <table className="mt-3 w-full max-w-2xl text-sm">
            <tbody>
              {Object.entries(specs).map(([k, v]) => (
                <tr key={k} className="border-b"><td className="py-2 pr-8 font-semibold">{k}</td><td className="py-2">{v as string}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
