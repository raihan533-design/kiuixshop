export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatPrice(amount: number, currency = "$") {
  return `${currency}${amount.toFixed(2)}`;
}

export function productImages(imgs: string | null): string[] {
  try {
    const arr = JSON.parse(imgs || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function productSpecs(specs: string | null): Record<string, string> {
  try {
    const obj = JSON.parse(specs || "{}");
    return typeof obj === "object" && obj ? obj : {};
  } catch {
    return {};
  }
}
