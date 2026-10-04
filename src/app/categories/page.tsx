import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const cats = await prisma.category.findMany({ where: { status: true }, include: { _count: { select: { products: true } } } });
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cats.map((c) => (
          <Link key={c.id} href={`/shop?category=${c.slug}`} className="rounded-2xl border p-6 text-center transition hover:border-brand-500 hover:shadow">
            {c.image ? <img src={c.image} alt={c.name} className="mx-auto h-20 w-20 rounded-full object-cover" /> : null}
            <p className="mt-3 font-semibold">{c.name}</p>
            <p className="text-sm text-gray-400">{c._count.products} products</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
