import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await prisma.category.findMany();
  return (<div><h1 className="text-2xl font-bold">Add Product</h1><ProductForm categories={categories} /></div>);
}
