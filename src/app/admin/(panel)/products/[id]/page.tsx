import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: any) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany(),
  ]);
  if (!product) notFound();
  return (<div><h1 className="text-2xl font-bold">Edit Product</h1><ProductForm product={product} categories={categories} /></div>);
}
