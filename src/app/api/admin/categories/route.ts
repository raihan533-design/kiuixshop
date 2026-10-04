import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { name, image } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  let slug = slugify(name);
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) slug = `${slugify(name)}-${++i}`;
  return NextResponse.json(await prisma.category.create({ data: { name, slug, image: image || null } }));
}
