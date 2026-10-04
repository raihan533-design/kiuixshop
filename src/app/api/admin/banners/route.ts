import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  let d: any;
  if (ct.includes("application/json")) d = await req.json();
  else {
    const fd = await req.formData();
    d = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
  }
  if (!d.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  await prisma.banner.create({ data: { title: d.title, subtitle: d.subtitle || null, image: d.image || null, link: d.link || null } });
  return NextResponse.redirect(req.headers.get("referer") || new URL("/admin/homepage", req.url).toString(), 303);
}
