import { getSetting } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function Contact() {
  const email = await getSetting("contactEmail", "support@example.com");
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 text-gray-600">Have a question or partnership inquiry? Email us at <a className="text-brand-600" href={`mailto:${email}`}>{email}</a>.</p>
      <p className="mt-2 text-sm text-gray-400">We typically respond within 24-48 hours.</p>
    </div>
  );
}
