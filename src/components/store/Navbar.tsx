import Link from "next/link";

export default function Navbar({ siteName, logo }: { siteName: string; logo: string }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-[#F4F4F4]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          {logo ? <img src={logo} alt={siteName} className="h-12 w-12 object-contain" /> : <span>{siteName || "Store"}</span>}
        </Link>
        <nav className="hidden items-center gap-8 text-base font-medium text-gray-600 md:flex">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <Link href="/shop" className="hover:text-brand-600">Shop</Link>
          <Link href="/categories" className="hover:text-brand-600">Categories</Link>
          <Link href="/about" className="hover:text-brand-600">About</Link>
          <Link href="/contact" className="hover:text-brand-600">Contact</Link>
        </nav>
        <Link href="/shop" className="rounded-full bg-brand-600 px-6 py-2.5 text-base font-semibold text-white hover:bg-brand-700">
          Shop Now
        </Link>
      </div>
      <div className="flex gap-5 overflow-x-auto border-t px-4 py-3 text-sm font-medium text-gray-600 md:hidden">
        <Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/categories">Categories</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
      </div>
    </header>
  );
}
