import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  const r = await p.product.findMany({ select: { name: true, images: true } });
  for (const x of r) console.log(x.name, "=>", (x.images || "").slice(0, 80));
  await p.$disconnect();
})();
