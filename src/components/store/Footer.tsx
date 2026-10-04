import Link from "next/link";

export default function Footer({ siteName, content, email, social }: any) {
  return (
    <footer className="mt-16 border-t bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">{siteName}</h3>
          <p className="mt-2 text-sm text-gray-500">{content}</p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li><Link href="/shop">All Products</Link></li>
            <li><Link href="/categories">Categories</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            <li><Link href="/affiliate-disclosure">Affiliate Disclosure</Link></li>
            <li><a href={`mailto:${email}`}>{email}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
