import Link from "next/link";
import { prisma } from "@/lib/db";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function Products() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Add Product</Link>
      </div>
      <div className="overflow-x-auto">
      <table className="mt-6 w-full text-sm">
        <thead><tr className="text-left text-gray-500"><th>Name</th><th>Category</th><th>Price</th><th>Featured</th><th>Enabled</th><th></th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="py-2">{p.name}</td>
              <td>{p.category?.name || "-"}</td>
              <td>${p.price}</td>
              <td>{p.featured ? "Yes" : "No"}</td>
              <td>{p.enabled ? "Yes" : "No"}</td>
              <td className="flex gap-2 py-2">
                <Link href={`/admin/products/${p.id}`} className="text-brand-600">Edit</Link>
                <DeleteButton url={`/api/admin/products/${p.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
