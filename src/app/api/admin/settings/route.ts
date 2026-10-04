import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

async function saveFromForm(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  let entries: [string, string][] = [];
  if (ct.includes("application/json")) {
    const obj = await req.json();
    entries = Object.entries(obj).map(([k, v]) => [k, String(v)]);
  } else {
    const fd = await req.formData();
    entries = [...fd.entries()].map(([k, v]) => [k, String(v)]);
  }
  for (const [key, value] of entries) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }
}

export async function POST(req: NextRequest) {
  await saveFromForm(req);
  return NextResponse.redirect(req.headers.get("referer") || new URL("/admin/settings", req.url).toString(), 303);
}

export async function PUT(req: NextRequest) {
  await saveFromForm(req);
  return NextResponse.json({ ok: true });
}
