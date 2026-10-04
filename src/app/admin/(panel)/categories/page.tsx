import { prisma } from "@/lib/db";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (<div><h1 className="text-2xl font-bold">Categories</h1><CategoriesAdmin categories={categories} /></div>);
}
