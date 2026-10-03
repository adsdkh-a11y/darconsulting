"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { Logo } from "./Logo";

export function Splash() {
  const router = useRouter();
  const { t } = useI18n();
  useEffect(() => {
    const id = setTimeout(() => router.replace("/welcome"), 900);
    return () => clearTimeout(id);
  }, [router]);
  return (
    <main className="grid min-h-dvh place-items-center bg-primary text-primary-ink">
      <div className="text-center">
        <Logo size="lg" tag mono />
        <p className="mt-2 opacity-90">{t("app.tagline")}</p>
      </div>
    </main>
  );
}
