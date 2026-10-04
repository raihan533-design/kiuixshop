import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const s = await getSettings(["heroTitle", "heroDescription", "heroImage", "heroCtaText", "heroCtaLink", "currency", "affiliateDisclosure"]);
  const [featured, popular, newest, cats, banners] = await Promise.all([
    prisma.product.findMany({ where: { enabled: true, featured: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { enabled: true, popular: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { enabled: true, isNew: true }, take: 8, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ where: { status: true }, take: 8 }),
    prisma.banner.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
  ]);

  const Section = ({ title, items }: { title: string; items: any[] }) =>
    items.length > 0 ? (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-5 text-2xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} currency={s.currency} />)}
        </div>
      </section>
    ) : null;

  return (
    <>
      <section className="relative w-full">
        <img src="/hero.png" alt="Hero banner" className="block h-auto w-full min-h-[320px] object-cover" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4">
            <h1 className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">{s.heroTitle}</h1>
            <p className="mt-3 max-w-xl text-sm text-gray-700 sm:text-lg">{s.heroDescription}</p>
            <div className="mt-4 flex flex-wrap gap-3 sm:mt-6">
              <Link href={s.heroCtaLink || "/shop"} className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 sm:px-6 sm:py-3 sm:text-base">
                {s.heroCtaText || "Shop Now"}
              </Link>
              <Link href="/categories" className="rounded-full border border-gray-300 bg-white/70 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-white sm:px-6 sm:py-3 sm:text-base">Categories</Link>
            </div>
            <p className="mt-4 hidden max-w-lg text-xs text-gray-500 sm:mt-6 sm:block">{s.affiliateDisclosure}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <form action="/shop" className="mx-auto flex w-full">
          <input name="q" placeholder="Search products..." className="min-w-0 flex-1 rounded-l-full border px-5 py-3 outline-none focus:border-brand-500" />
          <button className="shrink-0 rounded-r-full bg-brand-600 px-6 font-semibold text-white">Search</button>
        </form>
      </section>

      <Section title="Featured Products" items={featured} />
      <Section title="Popular Products" items={popular} />
      <Section title="New Arrivals" items={newest} />

      {cats.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="mb-5 text-2xl font-bold">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cats.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.slug}`} className="rounded-2xl border p-4 text-center font-semibold hover:border-brand-500 hover:text-brand-600">
                {c.image ? <img src={c.image} alt={c.name} className="mx-auto mb-2 h-16 w-16 rounded-full object-cover" /> : null}
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {banners.map((b) => (
        <section key={b.id} className="mx-auto max-w-7xl px-4 py-6">
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            {b.image ? <img src={b.image} alt={b.title} className="h-56 w-full object-cover" /> : null}
            <div className="p-6">
              <h3 className="text-xl font-bold">{b.title}</h3>
              {b.subtitle ? <p className="text-gray-500">{b.subtitle}</p> : null}
              {b.link ? <Link href={b.link} className="mt-3 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white">Shop Now</Link> : null}
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold">Get the best deals first</h2>
        <form className="mx-auto mt-4 flex w-full max-w-2xl" action="/api/newsletter" method="post">
          <input required type="email" name="email" placeholder="Your email" className="min-w-0 flex-1 rounded-l-full border px-5 py-3" />
          <button className="shrink-0 rounded-r-full bg-brand-600 px-6 font-semibold text-white sm:px-8">Subscribe</button>
        </form>
      </section>
    </>
  );
}
