import { getSetting, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="prose mt-4 max-w-none whitespace-pre-line text-gray-600">{children}</div>
    </div>
  );
}

export default function About() {
  return Page({ title: "About Us", children:
    "KiuixShop is a curated affiliate store. We review and recommend products from trusted merchants. When you buy through our links, we may earn a commission at no extra cost to you. Our mission is to help you find the best value products quickly and confidently." });
}
