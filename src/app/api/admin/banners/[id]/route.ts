import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: any) {
  const { id } = await params;
  if (req.nextUrl.searchParams.get("delete") === "1") {
    await prisma.banner.delete({ where: { id } });
  }
  return NextResponse.redirect(req.headers.get("referer") || new URL("/admin/homepage", req.url).toString(), 303);
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const { id } = await params;
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
