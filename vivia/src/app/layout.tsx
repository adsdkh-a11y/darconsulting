import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { getLocale } from "@/server/locale";
import { dictionary, RTL } from "@/lib/i18n";
import { I18nProvider } from "@/components/I18n";
import { ServiceWorker } from "@/components/ServiceWorker";

export const metadata: Metadata = {
  title: "VIVIA — Your IBD health hub",
  description: "Everything about your IBD. One place. Less effort. Better conversations with your care team.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "VIVIA", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#121615" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const c = await cookies();
  return (
    <html
      lang={locale}
      dir={RTL.includes(locale) ? "rtl" : "ltr"}
      data-text={c.get("vivia_text")?.value === "large" ? "large" : undefined}
      data-contrast={c.get("vivia_contrast")?.value === "high" ? "high" : undefined}
    >
      <body className="min-h-dvh antialiased">
        <I18nProvider locale={locale} dict={dictionary(locale)}>
          {children}
        </I18nProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
