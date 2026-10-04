import { getSettings, SETTING_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const s = await getSettings([...SETTING_KEYS]);
  const groups: [string, string[]][] = [
    ["General", ["siteName", "logo", "favicon", "contactEmail", "currency", "footerContent"]],
    ["SEO", ["seoTitle", "seoDescription"]],
    ["Analytics", ["gaId", "fbPixelId"]],
    ["Social", ["socialFacebook", "socialInstagram", "socialTwitter", "socialYoutube", "socialTiktok"]],
    ["Disclosure", ["affiliateDisclosure"]],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Website Settings</h1>
      <form action="/api/admin/settings" method="post" className="mt-4 max-w-2xl">
        {groups.map(([title, keys]) => (
          <div key={title} className="mt-6">
            <h2 className="font-bold">{title}</h2>
            {keys.map((k) => (
              <div key={k}>
                <label className="mt-3 block text-sm font-semibold">{k}</label>
                {k === "affiliateDisclosure" || k === "footerContent" ? (
                  <textarea name={k} defaultValue={s[k]} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
                ) : (
                  <input name={k} defaultValue={s[k]} className="w-full rounded-lg border px-3 py-2 text-sm" />
                )}
              </div>
            ))}
          </div>
        ))}
        <button className="mt-6 rounded-full bg-brand-600 px-8 py-2.5 font-semibold text-white">Save Settings</button>
      </form>
    </div>
  );
}
