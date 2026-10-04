import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  try {
    const d = await req.json();
    new URL(d.affiliateUrl);
    const p = await prisma.product.update({
      where: { id },
      data: {
        name: d.name, shortDesc: d.shortDesc, description: d.description,
        price: Number(d.price), previousPrice: d.previousPrice ? Number(d.previousPrice) : null,
        discountPct: Number(d.discountPct), brand: d.brand,
        rating: Number(d.rating), ratingCount: Number(d.ratingCount), status: d.status,
        affiliateUrl: d.affiliateUrl, categoryId: d.categoryId || null,
        images: JSON.stringify(d.images || []), specs: JSON.stringify(d.specs || {}),
        featured: !!d.featured, isNew: !!d.isNew, popular: !!d.popular, enabled: !!d.enabled,
        seoTitle: d.seoTitle, seoDescription: d.seoDescription,
      },
    });
    return NextResponse.json(p);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
