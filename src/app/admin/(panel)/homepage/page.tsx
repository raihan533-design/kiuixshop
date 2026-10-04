import { getSettings, SETTING_KEYS } from "@/lib/settings";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomepageAdmin() {
  const keys = ["heroTitle", "heroDescription", "heroImage", "heroCtaText", "heroCtaLink"];
  const s = await getSettings(keys);
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold">Homepage Management</h1>
      <form action="/api/admin/settings" method="post" className="mt-4 max-w-2xl">
        <h2 className="font-bold">Hero Section</h2>
        {keys.map((k) => (
          <div key={k}>
            <label className="mt-3 block text-sm font-semibold">{k}</label>
            <input name={k} defaultValue={s[k] || ""} className="w-full rounded-lg border px-3 py-2 text-sm" />
          </div>
        ))}
        <button className="mt-4 rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white">Save Hero</button>
      </form>
      <h2 className="mt-10 font-bold">Promotional Banners</h2>
      <p className="text-sm text-gray-500">Edit banner JSON via API or add one below.</p>
      <BannerAdd />
      <ul className="mt-4 space-y-2 text-sm">
        {banners.map((b) => (
          <li key={b.id} className="flex justify-between rounded-lg border p-3">
            <span>{b.title} {b.enabled ? "" : "(disabled)"}</span>
            <Delete id={b.id} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-gray-400">Featured/Popular/New sections are controlled per product in the Products page.</p>
    </div>
  );
}

function BannerAdd() {
  return (
    <form action="/api/admin/banners" method="post" className="mt-3 flex gap-2 text-sm">
      <input name="title" required placeholder="Banner title" className="flex-1 rounded-lg border px-3 py-2" />
      <input name="subtitle" placeholder="Subtitle" className="flex-1 rounded-lg border px-3 py-2" />
      <input name="image" placeholder="Image URL" className="flex-1 rounded-lg border px-3 py-2" />
      <input name="link" placeholder="Link" className="flex-1 rounded-lg border px-3 py-2" />
      <button className="rounded-lg bg-brand-600 px-4 text-white">Add</button>
    </form>
  );
}

function Delete({ id }: { id: string }) {
  return (
    <form action={`/api/admin/banners/${id}`} method="post">
      <input type="hidden" name="_method" value="DELETE" />
      <button className="text-red-600" formAction={`/api/admin/banners/${id}?delete=1`}>Delete</button>
    </form>
  );
}
