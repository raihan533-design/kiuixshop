import { prisma } from "@/lib/db";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const now = Date.now();
  const day = 86400000;
  const [total, today, week, month, all, top] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - day) } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - 7 * day) } } }),
    prisma.affiliateClick.count({ where: { createdAt: { gte: new Date(now - 30 * day) } } }),
    prisma.affiliateClick.findMany({ select: { createdAt: true, productId: true }, orderBy: { createdAt: "asc" } }),
    prisma.affiliateClick.groupBy({ by: ["productId"], _count: true, orderBy: { _count: { productId: "desc" } }, take: 10 }),
  ]);
  const byDay: Record<string, number> = {};
  for (const c of all) {
    const d = c.createdAt.toISOString().slice(0, 10);
    byDay[d] = (byDay[d] || 0) + 1;
  }
  const chartData = Object.entries(byDay).map(([date, clicks]) => ({ date, clicks }));
  const products = await prisma.product.findMany({ where: { id: { in: top.map((t) => t.productId) } }, select: { id: true, name: true } });
  const topRows = top.map((t) => ({ name: products.find((p) => p.id === t.productId)?.name || "Unknown", clicks: t._count }));
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Total Clicks", total], ["Today", today], ["This Week", week], ["This Month", month]].map(([l, v]) => (
          <div key={l as string} className="rounded-2xl border p-4">
            <p className="text-sm text-gray-500">{l}</p>
            <p className="text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">{productCount} products • {categoryCount} categories</p>
      <DashboardCharts chartData={chartData} topRows={topRows} />
    </div>
  );
}
