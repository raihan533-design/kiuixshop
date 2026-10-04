import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings(["seoTitle", "seoDescription", "siteName"]);
  return {
    title: { default: s.seoTitle || s.siteName || "Store", template: `%s | ${s.siteName || "Store"}` },
    description: s.seoDescription,
    icons: { icon: "/logo.png" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings(["siteName", "logo", "contactEmail", "footerContent", "socialFacebook", "socialInstagram", "socialTwitter", "socialYoutube", "socialTiktok", "gaId"]);
  return (
    <html lang="en">
      <body>
        <Navbar siteName={s.siteName} logo={s.logo} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer siteName={s.siteName} content={s.footerContent} email={s.contactEmail} social={s} />
        {s.gaId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${s.gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.gaId}');`,
              }}
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
