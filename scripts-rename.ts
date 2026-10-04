import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
(async () => {
  const rows = await p.setting.findMany();
  for (const r of rows) {
    if (r.value.includes("TopPicks")) {
      await p.setting.update({ where: { key: r.key }, data: { value: r.value.replaceAll("TopPicks", "KiuixShop") } });
    }
  }
  console.log("done");
  await p.$disconnect();
})();
