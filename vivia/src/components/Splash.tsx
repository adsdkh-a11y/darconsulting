"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";

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
        <svg viewBox="0 0 512 512" className="mx-auto mb-5 size-20" aria-hidden>
          <path d="M150 170c40 110 70 170 106 190 36-20 66-80 106-190" fill="none" stroke="currentColor" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="256" cy="140" r="22" fill="#e39a78" />
        </svg>
        <p className="font-display text-5xl tracking-wide">VIVIA</p>
        <p className="mt-2 opacity-90">{t("app.tagline")}</p>
      </div>
    </main>
  );
}
