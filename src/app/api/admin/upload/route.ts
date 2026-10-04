import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const file = fd.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Max 2MB" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type || "image/jpeg"};base64,${buf.toString("base64")}`;
  return NextResponse.json({ url: dataUrl });
}
