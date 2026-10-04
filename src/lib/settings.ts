import { prisma } from "./db";

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { in: keys } } });
  const out: Record<string, string> = {};
  for (const k of keys) out[k] = rows.find((r) => r.key === k)?.value ?? "";
  return out;
}

export async function setSetting(key: string, value: string) {
  await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
}

export const SETTING_KEYS = [
  "siteName", "logo", "favicon", "contactEmail", "footerContent", "currency",
  "seoTitle", "seoDescription", "gaId", "fbPixelId", "affiliateDisclosure",
  "heroTitle", "heroDescription", "heroImage", "heroCtaText", "heroCtaLink",
  "socialFacebook", "socialInstagram", "socialTwitter", "socialYoutube", "socialTiktok",
] as const;
