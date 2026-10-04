import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function Disclosure() {
  const text = await getSetting("affiliateDisclosure", "");
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Affiliate Disclosure</h1>
      <p className="mt-4 whitespace-pre-line text-gray-600">{text || "We may earn commissions on purchases made through our links."}</p>
    </div>
  );
}
