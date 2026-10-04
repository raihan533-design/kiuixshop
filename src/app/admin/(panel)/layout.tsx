import Link from "next/link";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:flex md:gap-8">
      <aside className="mb-6 md:mb-0 md:w-56">
        <nav className="flex gap-3 overflow-x-auto text-sm font-semibold md:flex-col">
          <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 hover:bg-gray-100">Dashboard</Link>
          <Link href="/admin/products" className="rounded-lg px-3 py-2 hover:bg-gray-100">Products</Link>
          <Link href="/admin/categories" className="rounded-lg px-3 py-2 hover:bg-gray-100">Categories</Link>
          <Link href="/admin/homepage" className="rounded-lg px-3 py-2 hover:bg-gray-100">Homepage</Link>
          <Link href="/admin/settings" className="rounded-lg px-3 py-2 hover:bg-gray-100">Settings</Link>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">Logout</button>
          </form>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
