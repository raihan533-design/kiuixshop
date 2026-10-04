import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.enabled) {
    return NextResponse.redirect(new URL("/shop", req.url));
  }
  try {
    await prisma.affiliateClick.create({
      data: {
        productId: product.id,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
        userAgent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
      },
    });
  } catch {}
  return NextResponse.redirect(product.affiliateUrl);
}
