"use client";
import { useState } from "react";

export default function CategoriesAdmin({ categories }: any) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  async function add(e: any) {
    e.preventDefault();
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, image }) });
    location.reload();
  }
  async function toggle(id: string, status: boolean) {
    await fetch(`/api/admin/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    location.reload();
  }
  async function del(id: string) {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    location.reload();
  }

  return (
    <div className="mt-4 max-w-2xl">
      <form onSubmit={add} className="flex gap-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="flex-1 rounded-lg border px-3 py-2" />
        <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)" className="flex-1 rounded-lg border px-3 py-2" />
        <button className="rounded-full bg-brand-600 px-5 text-sm font-semibold text-white">Add</button>
      </form>
      <div className="overflow-x-auto"><table className="mt-6 w-full text-sm">
        <thead><tr className="text-left text-gray-500"><th>Name</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {categories.map((c: any) => (
            <tr key={c.id} className="border-t">
              <td className="py-2">{c.name}</td>
              <td>{c.status ? "Active" : "Hidden"}</td>
              <td className="flex gap-3 py-2">
                <button onClick={() => toggle(c.id, !c.status)} className="text-brand-600">{c.status ? "Disable" : "Enable"}</button>
                <button onClick={() => del(c.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
