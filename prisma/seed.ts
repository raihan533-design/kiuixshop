import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: { email, passwordHash: hash },
  });

  const categories = ["Electronics", "Home & Kitchen", "Fashion", "Beauty", "Sports"];
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
  }

  const defaults: Record<string, string> = {
    siteName: "KiuixShop",
    contactEmail: "support@example.com",
    currency: "$",
    seoTitle: "KiuixShop - Curated Affiliate Deals",
    seoDescription: "Handpicked products with the best deals.",
    affiliateDisclosure:
      "KiuixShop is a participant in affiliate programs. When you purchase through links on our site, we may earn a commission at no extra cost to you.",
    heroTitle: "Discover Premium Products at Great Prices",
    heroDescription:
      "Shop curated recommendations from top brands. We review and link the best deals directly to trusted merchants.",
    heroCtaText: "Shop Now",
    heroCtaLink: "/shop",
    footerContent: "© 2026 KiuixShop. All rights reserved.",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  console.log("Seeded admin:", email);

  const count = await prisma.product.count();
  if (count === 0) {
    const cats = await prisma.category.findMany();
    const sample: any[] = [
      { name: "Wireless Noise-Cancelling Headphones", brand: "SoundPro", price: 129.99, previousPrice: 199.99, discountPct: 35, rating: 4.6, ratingCount: 1284, featured: true, popular: true, isNew: true, cat: "Electronics", img: "https://picsum.photos/seed/headphones/800/800" },
      { name: "Smart LED Desk Lamp", brand: "LumiHome", price: 34.5, previousPrice: 49.99, discountPct: 31, rating: 4.3, ratingCount: 542, featured: true, cat: "Home & Kitchen", img: "https://picsum.photos/seed/lamp/800/800" },
      { name: "Yoga Mat Pro Series", brand: "FlexCore", price: 24.99, previousPrice: 39.99, discountPct: 38, rating: 4.7, ratingCount: 2310, popular: true, cat: "Sports", img: "https://picsum.photos/seed/yoga/800/800" },
      { name: "Organic Face Serum", brand: "GlowLab", price: 19.99, discountPct: 0, rating: 4.4, ratingCount: 389, isNew: true, cat: "Beauty", img: "https://picsum.photos/seed/serum/800/800" },
      { name: "Stainless Steel Water Bottle", brand: "HydroPeak", price: 15.99, previousPrice: 24.99, discountPct: 36, rating: 4.8, ratingCount: 5231, featured: true, popular: true, cat: "Sports", img: "https://picsum.photos/seed/bottle/800/800" },
      { name: "Cotton Oversized Hoodie", brand: "UrbanVibe", price: 45.0, previousPrice: 65.0, discountPct: 31, rating: 4.5, ratingCount: 876, popular: true, cat: "Fashion", img: "https://picsum.photos/seed/hoodie/800/800" },
      { name: "Bluetooth Mechanical Keyboard", brand: "KeyCraft", price: 89.99, previousPrice: 129.99, discountPct: 31, rating: 4.6, ratingCount: 642, isNew: true, featured: true, cat: "Electronics", img: "https://picsum.photos/seed/keyboard/800/800" },
      { name: "Ceramic Non-Stick Pan Set", brand: "ChefMate", price: 59.99, previousPrice: 89.99, discountPct: 33, rating: 4.2, ratingCount: 411, cat: "Home & Kitchen", img: "https://picsum.photos/seed/pan/800/800" },
    ];
    for (const s of sample) {
      const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await prisma.product.create({
        data: {
          name: s.name, slug, brand: s.brand, price: s.price, previousPrice: s.previousPrice ?? null,
          discountPct: s.discountPct, rating: s.rating, ratingCount: s.ratingCount,
          shortDesc: `Premium ${s.name.toLowerCase()} from ${s.brand}.`,
          description: `${s.name} by ${s.brand} delivers excellent quality and value. Verified top choice among our customers.`,
          affiliateUrl: "https://example.com/affiliate-link",
          images: JSON.stringify([s.img]),
          featured: !!s.featured, isNew: !!s.isNew, popular: !!s.popular,
          categoryId: cats.find((c) => c.name === s.cat)?.id ?? null,
          status: "In Stock",
        },
      });
    }
    console.log("Seeded sample products");
  }
}

main().finally(() => prisma.$disconnect());
