"use client";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";
import { api } from "@/lib/api";

export function LanguagePicker({ current, persistToProfile = false }: { current: Locale; persistToProfile?: boolean }) {
  const router = useRouter();
  return (
    <select
      aria-label="Language"
      value={current}
      className="tap rounded-xl border border-line bg-surface px-3 text-sm"
      onChange={async (e) => {
        const locale = e.target.value as Locale;
        await api("/api/preferences", "POST", { locale });
        if (persistToProfile) await api("/api/profile", "PATCH", { locale });
        router.refresh();
      }}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAMES[l]}
        </option>
      ))}
    </select>
  );
}
