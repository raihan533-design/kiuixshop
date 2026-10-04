import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await prisma.product.findMany({ where: { enabled: true }, select: { slug: true, createdAt: true } });
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/shop`, lastModified: new Date() },
    { url: `${base}/categories`, lastModified: new Date() },
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.createdAt })),
  ];
}
