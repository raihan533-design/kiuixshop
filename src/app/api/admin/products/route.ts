import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  shortDesc: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  previousPrice: z.number().nullable().optional(),
  discountPct: z.number().int().min(0).max(100).default(0),
  brand: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().min(0).default(0),
  status: z.string().default("In Stock"),
  affiliateUrl: z.string().url(),
  categoryId: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string()).default({}),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  popular: z.boolean().default(false),
  enabled: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const d = parsed.data;
  let slug = slugify(d.name);
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) slug = `${slugify(d.name)}-${++i}`;
  const p = await prisma.product.create({
    data: { ...d, slug, images: JSON.stringify(d.images), specs: JSON.stringify(d.specs) },
  });
  return NextResponse.json(p);
}
