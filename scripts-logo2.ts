import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  for (const key of ["logo", "favicon"]) {
    await p.setting.upsert({ where: { key }, update: { value: "/logo.png" }, create: { key, value: "/logo.png" } });
  }
  console.log("logo set to /logo.png");
  await p.$disconnect();
})();
