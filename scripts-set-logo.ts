import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  await p.setting.upsert({ where: { key: "logo" }, update: { value: "/logo.jpg" }, create: { key: "logo", value: "/logo.jpg" } });
  await p.setting.upsert({ where: { key: "favicon" }, update: { value: "/logo.jpg" }, create: { key: "favicon", value: "/logo.jpg" } });
  console.log("logo set");
  await p.$disconnect();
})();
