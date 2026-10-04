import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import ShopClient from "@/components/store/ShopClient";

export const dynamic = "force-dynamic";

export default async function Shop({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const [products, categories, settings] = await Promise.all([
    prisma.product.findMany({ where: { enabled: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ where: { status: true } }),
    getSettings(["currency"]),
  ]);
  return <ShopClient products={products} categories={categories} currency={settings.currency} initialCategory={sp.category || ""} initialQuery={sp.q || ""} />;
}
