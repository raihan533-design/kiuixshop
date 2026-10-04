import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  const d = await req.json();
  return NextResponse.json(await prisma.category.update({ where: { id }, data: { status: !!d.status, ...(d.name ? { name: d.name } : {}) } }));
}

export async function DELETE(_req: NextRequest, { params }: any) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
